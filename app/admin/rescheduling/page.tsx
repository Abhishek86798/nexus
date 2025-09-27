"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Clock,
  Users,
  Building,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  Zap,
  TrendingUp,
  Calendar,
} from "lucide-react"
import type { DisruptionEvent, ReschedulingOption } from "@/lib/rescheduling/types"
import { disruptionDetector } from "@/lib/rescheduling/disruption-detector"
import { reschedulingEngine } from "@/lib/rescheduling/rescheduling-engine"

export default function ReschedulingPage() {
  const [activeDisruptions, setActiveDisruptions] = useState<DisruptionEvent[]>([])
  const [selectedDisruption, setSelectedDisruption] = useState<DisruptionEvent | null>(null)
  const [reschedulingOptions, setReschedulingOptions] = useState<ReschedulingOption[]>([])
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [monitoringActive, setMonitoringActive] = useState(true)

  useEffect(() => {
    // Initialize disruption monitoring
    disruptionDetector.startMonitoring()

    // Listen for new disruptions
    disruptionDetector.onDisruption((disruption) => {
      setActiveDisruptions((prev) => [...prev, disruption])
    })

    // Load initial disruptions
    setActiveDisruptions(disruptionDetector.getActiveDisruptions())
  }, [])

  const handleGenerateOptions = async (disruption: DisruptionEvent) => {
    setSelectedDisruption(disruption)
    setIsGeneratingOptions(true)

    try {
      const options = await reschedulingEngine.generateReschedulingOptions(disruption)
      setReschedulingOptions(options)
    } catch (error) {
      console.error("Failed to generate rescheduling options:", error)
    } finally {
      setIsGeneratingOptions(false)
    }
  }

  const handleExecuteOption = async (option: ReschedulingOption) => {
    setIsExecuting(true)

    try {
      const result = await reschedulingEngine.executeRescheduling(option)
      if (result.success) {
        // Remove resolved disruption
        if (selectedDisruption) {
          disruptionDetector.resolveDisruption(selectedDisruption.id)
          setActiveDisruptions((prev) => prev.filter((d) => d.id !== selectedDisruption.id))
          setSelectedDisruption(null)
          setReschedulingOptions([])
        }
      }
    } catch (error) {
      console.error("Failed to execute rescheduling:", error)
    } finally {
      setIsExecuting(false)
    }
  }

  const getSeverityColor = (severity: DisruptionEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDisruptionIcon = (type: DisruptionEvent["type"]) => {
    switch (type) {
      case "faculty_absence":
        return <Users className="h-4 w-4" />
      case "room_unavailable":
        return <Building className="h-4 w-4" />
      case "equipment_failure":
        return <AlertTriangle className="h-4 w-4" />
      case "maintenance":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-time Rescheduling</h1>
          <p className="text-gray-600 mt-1">Monitor disruptions and manage schedule changes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${monitoringActive ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-600">
              {monitoringActive ? "Monitoring Active" : "Monitoring Paused"}
            </span>
          </div>
          <Button variant="outline" onClick={() => setMonitoringActive(!monitoringActive)}>
            {monitoringActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {monitoringActive ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Active Disruptions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Disruptions</p>
                <p className="text-2xl font-bold">{activeDisruptions.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {activeDisruptions.filter((d) => d.severity === "critical").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auto-Resolved</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold">8.5m</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Disruptions</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Simulation</TabsTrigger>
          <TabsTrigger value="history">Resolution History</TabsTrigger>
        </TabsList>

        {/* Active Disruptions Tab */}
        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disruptions List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Disruptions</CardTitle>
                <CardDescription>Active issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeDisruptions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active disruptions</p>
                    <p className="text-sm">All systems operating normally</p>
                  </div>
                ) : (
                  activeDisruptions.map((disruption) => (
                    <div
                      key={disruption.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDisruption?.id === disruption.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleGenerateOptions(disruption)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">{getDisruptionIcon(disruption.type)}</div>
                          <div className="flex-1">
                            <h4 className="font-medium">{disruption.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{disruption.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getSeverityColor(disruption.severity)}>
                                {disruption.severity.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">{disruption.createdAt.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Affected Resources */}
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-2">Affected Resources:</p>
                        <div className="flex flex-wrap gap-1">
                          {disruption.affectedResources.map((resource, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {resource.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Rescheduling Options */}
            <Card>
              <CardHeader>
                <CardTitle>Rescheduling Options</CardTitle>
                <CardDescription>
                  {selectedDisruption
                    ? `Options for: ${selectedDisruption.title}`
                    : "Select a disruption to view options"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedDisruption ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a disruption to generate rescheduling options</p>
                  </div>
                ) : isGeneratingOptions ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                    <p>Generating rescheduling options...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reschedulingOptions.map((option) => (
                      <div key={option.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{option.title}</h4>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                          <Badge variant="outline">{Math.round(option.confidence * 100)}% confidence</Badge>
                        </div>

                        {/* Impact Assessment */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Students Affected:</span>
                            <span className="ml-2 font-medium">{option.impact.studentsAffected}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Est. Time:</span>
                            <span className="ml-2 font-medium">{option.estimatedTime}m</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Faculty Affected:</span>
                            <span className="ml-2 font-medium">{option.impact.facultyAffected}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Severity:</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {option.impact.severity}
                            </Badge>
                          </div>
                        </div>

                        <Button onClick={() => handleExecuteOption(option)} disabled={isExecuting} className="w-full">
                          {isExecuting ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Executing...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Execute Rescheduling
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scenario Simulation Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Disruption Scenario Simulation</CardTitle>
              <CardDescription>Test system resilience with simulated disruptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: "Faculty Absence", description: "Simulate unexpected faculty unavailability", icon: Users },
                  { type: "Room Closure", description: "Test room unavailability scenarios", icon: Building },
                  {
                    type: "Equipment Failure",
                    description: "Simulate critical equipment malfunction",
                    icon: AlertTriangle,
                  },
                  { type: "Weather Disruption", description: "Test severe weather impact", icon: RefreshCw },
                  { type: "Emergency Closure", description: "Simulate building emergency closure", icon: XCircle },
                  {
                    type: "Mass Cancellation",
                    description: "Test multiple simultaneous disruptions",
                    icon: TrendingUp,
                  },
                ].map((scenario, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <scenario.icon className="h-6 w-6 text-blue-600 mr-3" />
                        <h4 className="font-medium">{scenario.type}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Run Simulation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resolution History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolution History</CardTitle>
              <CardDescription>Past disruptions and their resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Dr. Kumar Absence - CS301",
                    resolvedAt: "2 hours ago",
                    method: "Substitute Faculty",
                    impact: "45 students",
                    status: "resolved",
                  },
                  {
                    title: "Lab Equipment Failure - EE Lab",
                    resolvedAt: "5 hours ago",
                    method: "Room Relocation",
                    impact: "30 students",
                    status: "resolved",
                  },
                  {
                    title: "Lecture Hall 201 Maintenance",
                    resolvedAt: "1 day ago",
                    method: "Schedule Postponement",
                    impact: "120 students",
                    status: "resolved",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Resolved {item.resolvedAt}</span>
                        <span>•</span>
                        <span>Method: {item.method}</span>
                        <span>•</span>
                        <span>Impact: {item.impact}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolved
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
