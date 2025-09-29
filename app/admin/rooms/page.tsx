"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Upload } from "lucide-react"
import { sampleClassrooms } from "@/lib/sample-data"
import { GenericExcelImport } from "@/components/generic-excel-import"
import { roomsImportConfig } from "@/lib/excel-import-configs"
import type { Classroom } from "@/lib/types"

interface RoomFormData {
  name: string
  type: string
  capacity: string
  building: string
  floor: string
  features: string
}

interface RoomFormProps {
  formData: RoomFormData
  setFormData: (data: RoomFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isEditing: boolean
}

function RoomForm({ formData, setFormData, onSubmit, isEditing }: RoomFormProps) {
  const handleChange = (field: keyof RoomFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Room Name/Number</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter room name/number"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Room Type</Label>
          <select 
            id="type"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Room Type"
            required
          >
            <option value="">Select type</option>
            <option value="classroom">Classroom</option>
            <option value="lab">Lab</option>
            <option value="auditorium">Auditorium</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => handleChange("capacity", e.target.value)}
            placeholder="Max students"
            min="1"
            required
          />
        </div>
        <div>
          <Label htmlFor="building">Building</Label>
          <Input
            id="building"
            value={formData.building}
            onChange={(e) => handleChange("building", e.target.value)}
            placeholder="Building name"
          />
        </div>
        <div>
          <Label htmlFor="floor">Floor</Label>
          <Input
            id="floor"
            type="number"
            value={formData.floor}
            onChange={(e) => handleChange("floor", e.target.value)}
            placeholder="Floor number"
            min="0"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="features">Features/Equipment</Label>
        <Input
          id="features"
          value={formData.features}
          onChange={(e) => handleChange("features", e.target.value)}
          placeholder="Enter features (comma-separated)"
        />
      </div>
      <Button type="submit" className={`w-full ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}>
        {isEditing ? "Update Room" : "Add Room"}
      </Button>
    </form>
  )
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Classroom[]>(sampleClassrooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Classroom | null>(null)

  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    type: "",
    capacity: "30",
    building: "",
    floor: "1",
    features: "",
  })

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.building && room.building.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const roomData: Classroom = {
      id: editingRoom ? editingRoom.id : Date.now(),
      name: formData.name,
      type: formData.type as "classroom" | "lab" | "auditorium",
      capacity: parseInt(formData.capacity),
      is_lab: formData.type === "lab",
      building: formData.building || undefined,
      floor: formData.floor ? parseInt(formData.floor) : undefined,
      equipment: formData.features ? formData.features.split(",").map(f => f.trim()) : undefined,
    }

    if (editingRoom) {
      setRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? roomData : r)))
      setEditingRoom(null)
    } else {
      setRooms((prev) => [...prev, roomData])
      setIsAddDialogOpen(false)
    }

    // Reset form
    setFormData({
      name: "",
      type: "",
      capacity: "30",
      building: "",
      floor: "1",
      features: "",
    })
  }

  const handleEdit = (room: Classroom) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      type: room.type,
      capacity: room.capacity.toString(),
      building: room.building || "",
      floor: room.floor?.toString() || "1",
      features: room.equipment ? room.equipment.join(", ") : "",
    })
  }

  const handleDelete = (id: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== id))
  }

  const handleImportSuccess = (importedData: any[]) => {
    const newRooms: Classroom[] = importedData.map((data, index) => ({
      id: Date.now() + index,
      name: data.name,
      type: data.type as "classroom" | "lab" | "auditorium",
      capacity: parseInt(data.capacity) || 30,
      is_lab: data.type === "lab",
      building: data.building || undefined,
      floor: data.floor ? parseInt(data.floor) : undefined,
      equipment: typeof data.features === 'string' ? data.features.split(',').map((f: string) => f.trim()) : data.features || undefined,
    }))
    
    setRooms(prev => [...prev, ...newRooms])
    setIsImportDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms Management</h1>
          <p className="mt-2 text-gray-600">Manage classrooms, labs, and other facilities</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Upload className="h-4 w-4 mr-2" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Rooms from Excel</DialogTitle>
                <DialogDescription>Upload an Excel file to import room data</DialogDescription>
              </DialogHeader>
              <GenericExcelImport
                config={roomsImportConfig}
                onDataImported={handleImportSuccess}
                onImportSuccess={handleImportSuccess}
                onCancel={() => setIsImportDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>Create a new room/facility</DialogDescription>
              </DialogHeader>
              <RoomForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={false} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{rooms.length}</div>
            <p className="text-xs text-gray-500">Total Rooms</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{rooms.filter(r => r.type === "lab").length}</div>
            <p className="text-xs text-gray-500">Labs</p>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Room Facilities</CardTitle>
          <CardDescription>All available rooms and their specifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={room.type === "lab" ? "default" : room.type === "auditorium" ? "secondary" : "outline"}
                    >
                      {room.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{room.capacity}</Badge>
                  </TableCell>
                  <TableCell>{room.building || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{room.floor || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.equipment ? room.equipment.slice(0, 2).map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      )) : <span className="text-gray-500 text-sm">No features</span>}
                      {room.equipment && room.equipment.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{room.equipment.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(room)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingRoom && (
        <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>Update room information</DialogDescription>
            </DialogHeader>
            <RoomForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={true} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}