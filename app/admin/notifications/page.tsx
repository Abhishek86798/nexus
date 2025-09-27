"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Bell,
  Send,
  Users,
  Mail,
  MessageSquare,
  Smartphone,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Plus,
} from "lucide-react"
import { notificationService } from "@/lib/notifications/notification-service"
import type { NotificationTemplate, NotificationChannel, BulkNotification } from "@/lib/notifications/types"

export default function NotificationsPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [channels, setChannels] = useState<NotificationChannel[]>([])
  const [bulkNotifications, setBulkNotifications] = useState<BulkNotification[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setTemplates(notificationService.getTemplates())
    setChannels(notificationService.getChannels())
    // Mock bulk notifications
    setBulkNotifications([
      {
        id: "bulk_1",
        name: "Schedule Change - CS101",
        templateId: "schedule_change",
        recipientGroups: ["CS101_students"],
        totalRecipients: 45,
        sentCount: 45,
        deliveredCount: 43,
        failedCount: 2,
        status: "completed",
        scheduledAt: new Date("2024-01-15T10:30:00"),
        createdAt: new Date("2024-01-15T10:25:00"),
      },
      {
        id: "bulk_2",
        name: "Maintenance Alert - All Faculty",
        templateId: "disruption_alert",
        recipientGroups: ["all_faculty"],
        totalRecipients: 25,
        sentCount: 20,
        deliveredCount: 18,
        failedCount: 2,
        status: "sending",
        scheduledAt: new Date(),
        createdAt: new Date(),
      },
    ])
  }

  const handleSendBulkNotification = async () => {
    if (!selectedTemplate) return

    setIsLoading(true)
    try {
      const mockRecipients = ["student_1", "faculty_1"]
      const variables = {
        recipient_name: "User",
        course_name: "Sample Course",
        original_time: "10:00 AM",
        new_time: "11:00 AM",
        room_name: "LH-101",
        change_reason: "Faculty unavailability",
      }

      await notificationService.sendBulkNotification(selectedTemplate, mockRecipients, variables)
      loadData()
    } catch (error) {
      console.error("Failed to send notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      case "in_app":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "sending":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage notifications and communication channels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">1,198</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">49</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold">96.1%</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send">Send Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Send Notifications Tab */}
        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Bulk Notification</CardTitle>
                <CardDescription>Send notifications to multiple recipients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_students">All Students</SelectItem>
                      <SelectItem value="all_faculty">All Faculty</SelectItem>
                      <SelectItem value="cs_students">CS Students</SelectItem>
                      <SelectItem value="ee_students">EE Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="channels">Channels</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {channels.map((channel) => (
                      <Badge key={channel.id} variant="outline" className="flex items-center gap-1">
                        {getChannelIcon(channel.type)}
                        {channel.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSendBulkNotification}
                  disabled={isLoading || !selectedTemplate}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Notification
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview the selected template</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    {(() => {
                      const template = templates.find((t) => t.id === selectedTemplate)
                      return template ? (
                        <>
                          <div>
                            <Label className="text-sm font-medium">Subject</Label>
                            <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Content</Label>
                            <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                              {template.content}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Variables</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.variables.map((variable) => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Select a template to preview</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline">{template.category.replace("_", " ")}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Subject</Label>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Channels</Label>
                      <div className="flex gap-1 mt-1">
                        {template.channels.map((channelId) => {
                          const channel = channels.find((c) => c.id === channelId)
                          return channel ? (
                            <Badge key={channelId} variant="secondary" className="text-xs">
                              {getChannelIcon(channel.type)}
                              <span className="ml-1">{channel.name}</span>
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map((channel) => (
              <Card key={channel.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getChannelIcon(channel.type)}
                    {channel.name}
                  </CardTitle>
                  <CardDescription>Configure {channel.name.toLowerCase()} settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${channel.id}-enabled`}>Enabled</Label>
                    <Switch id={`${channel.id}-enabled`} checked={channel.enabled} />
                  </div>

                  {channel.type === "email" && (
                    <>
                      <div>
                        <Label htmlFor="smtp-server">SMTP Server</Label>
                        <Input id="smtp-server" value={channel.config.smtp_server} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="smtp-port">Port</Label>
                        <Input id="smtp-port" value={channel.config.port} readOnly />
                      </div>
                    </>
                  )}

                  {channel.type === "sms" && (
                    <>
                      <div>
                        <Label htmlFor="sms-provider">Provider</Label>
                        <Input id="sms-provider" value={channel.config.provider} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="api-key">API Key</Label>
                        <Input id="api-key" value="••••••••••••" type="password" readOnly />
                      </div>
                    </>
                  )}

                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Recent bulk notifications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{notification.name}</h4>
                        <p className="text-sm text-gray-600">
                          Sent {notification.scheduledAt.toLocaleString()} • {notification.totalRecipients} recipients
                        </p>
                      </div>
                      <Badge className={getStatusColor(notification.status)}>{notification.status}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Sent</p>
                        <p className="text-lg font-semibold text-blue-600">{notification.sentCount}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Delivered</p>
                        <p className="text-lg font-semibold text-green-600">{notification.deliveredCount}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Failed</p>
                        <p className="text-lg font-semibold text-red-600">{notification.failedCount}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Delivery Progress</span>
                        <span>{Math.round((notification.deliveredCount / notification.totalRecipients) * 100)}%</span>
                      </div>
                      <Progress value={(notification.deliveredCount / notification.totalRecipients) * 100} />
                    </div>
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
