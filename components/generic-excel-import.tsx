"use client"

import React, { useState, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, FileSpreadsheet, Check, X, AlertCircle, Download } from 'lucide-react'
import { toast } from 'sonner'

export interface ExcelImportConfig {
  type: 'teachers' | 'courses' | 'rooms'
  title: string
  description: string
  requiredColumns: string[]
  columnMapping: Record<string, string[]> // Maps field name to possible column names
  sampleData: Record<string, any>[]
}

export interface GenericExcelImportProps {
  config: ExcelImportConfig
  onDataImported: (data: any[]) => void
  onImportSuccess?: (data: any[]) => void
  onCancel?: () => void
  className?: string
}

export function GenericExcelImport({ config, onDataImported, onImportSuccess, onCancel, className }: GenericExcelImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [previewMode, setPreviewMode] = useState(false)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setData([])
      setPreviewMode(false)
    }
  }, [])

  const parseExcelFile = useCallback(async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Get the first worksheet
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
          
          if (jsonData.length < 2) {
            throw new Error('Excel file must contain at least a header row and one data row')
          }
          
          // Parse headers (first row)
          const headers = jsonData[0].map(h => h?.toString().toLowerCase().trim())
          
          // Validate required columns using column mapping
          const missingColumns = config.requiredColumns.filter(reqCol => {
            const possibleNames = config.columnMapping[reqCol] || [reqCol]
            return !possibleNames.some(possibleName => 
              headers.some(header => header.includes(possibleName.toLowerCase()) || possibleName.toLowerCase().includes(header))
            )
          })
          
          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}. Please ensure your file has the correct column headers.`)
          }
          
          // Map column indices
          const getColumnIndex = (fieldName: string) => {
            const possibleNames = config.columnMapping[fieldName] || [fieldName]
            return headers.findIndex(header => 
              possibleNames.some(name => header.includes(name.toLowerCase()) || name.toLowerCase().includes(header))
            )
          }
          
          // Create column index mapping
          const columnIndices: Record<string, number> = {}
          Object.keys(config.columnMapping).forEach(fieldName => {
            columnIndices[fieldName] = getColumnIndex(fieldName)
          })
          
          // Parse data rows
          const parsedData: any[] = []
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i]
            
            // Skip empty rows
            if (!row || row.every(cell => !cell)) continue
            
            try {
              const item: any = {}
              
              // Map each field based on column indices
              Object.keys(columnIndices).forEach(fieldName => {
                const colIndex = columnIndices[fieldName]
                if (colIndex >= 0) {
                  let rawValue = row[colIndex]?.toString().trim() || ''
                  let parsedValue: any = rawValue
                  
                  // Special parsing for different field types
                  if (fieldName === 'maxHoursPerDay' || fieldName === 'credits' || fieldName === 'capacity') {
                    parsedValue = parseInt(rawValue) || 0
                  } else if (fieldName === 'subjects' || fieldName === 'preferredTimeSlots' || fieldName === 'features') {
                    // Handle arrays - split by comma or semicolon
                    parsedValue = rawValue ? rawValue.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean) : []
                  } else if (fieldName === 'isAvailable') {
                    // Handle boolean
                    parsedValue = rawValue.toLowerCase() === 'true' || rawValue === '1' || rawValue.toLowerCase() === 'yes'
                  }
                  
                  item[fieldName] = parsedValue
                }
              })
              
              // Generate ID if not provided
              if (!item.id) {
                item.id = `${config.type}_${Date.now()}_${i}`
              }
              
              // Validate required fields (non-empty)
              const hasRequiredData = config.requiredColumns.some(col => {
                const value = item[col]
                return value !== undefined && value !== null && value !== ''
              })
              
              if (!hasRequiredData) {
                console.warn(`Skipping row ${i + 1}: Missing essential data`)
                continue
              }
              
              parsedData.push(item)
            } catch (rowError) {
              console.warn(`Error parsing row ${i + 1}:`, rowError)
            }
          }
          
          if (parsedData.length === 0) {
            throw new Error(`No valid ${config.type} data found in the Excel file`)
          }
          
          resolve(parsedData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }, [config])

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const parsedData = await parseExcelFile(file)
      setData(parsedData)
      setPreviewMode(true)
      toast.success(`Successfully parsed ${parsedData.length} ${config.type} records`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to parse ${config.type} Excel file`
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [file, parseExcelFile, config.type])

  const handleConfirmImport = useCallback(() => {
    if (data.length > 0) {
      onDataImported(data)
      onImportSuccess?.(data)
      toast.success(`Imported ${data.length} ${config.type} successfully`)
      
      // Reset state
      setFile(null)
      setData([])
      setPreviewMode(false)
      setError('')
      
      // Reset file input
      const fileInput = document.getElementById(`excel-file-${config.type}`) as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  }, [data, onDataImported, onImportSuccess, config.type])

  const handleCancel = useCallback(() => {
    setPreviewMode(false)
    setData([])
    setError('')
    onCancel?.()
  }, [onCancel])

  const downloadSampleFile = useCallback(() => {
    try {
      // Create workbook with sample data
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(config.sampleData)
      XLSX.utils.book_append_sheet(workbook, worksheet, config.type.charAt(0).toUpperCase() + config.type.slice(1))
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sample_${config.type}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success(`Sample ${config.type} file downloaded`)
    } catch (error) {
      toast.error(`Failed to download sample file`)
      console.error('Download error:', error)
    }
  }, [config])

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {config.title}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!previewMode ? (
            <>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor={`excel-file-${config.type}`}>Select Excel File</Label>
                  <Input
                    id={`excel-file-${config.type}`}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadSampleFile}
                    className="h-10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Sample
                  </Button>
                </div>
              </div>
              
              {file && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{file.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Expected Excel Format:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Required columns:</strong> {config.requiredColumns.join(', ')}</p>
                  <p><strong>Note:</strong> Column names are flexible - the system will automatically match similar headers</p>
                </div>
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={!file || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Parsing Excel File...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload and Parse
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Preview Imported Data</h3>
                  <p className="text-sm text-gray-600">
                    Found {data.length} {config.type} record{data.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmImport}>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Import
                  </Button>
                </div>
              </div>
              
              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(data[0] || {}).slice(0, 6).map((key) => (
                        <TableHead key={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 10).map((item, index) => (
                      <TableRow key={index}>
                        {Object.values(item).slice(0, 6).map((value: any, cellIndex) => (
                          <TableCell key={cellIndex} className="text-sm">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data.length > 10 && (
                  <div className="p-2 text-center text-sm text-gray-500 border-t">
                    Showing first 10 of {data.length} records
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}