import type {
  NotificationChannel,
  NotificationTemplate,
  NotificationRecipient,
  Notification,
  BulkNotification,
} from "./types"

export class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map()
  private templates: Map<string, NotificationTemplate> = new Map()
  private recipients: Map<string, NotificationRecipient> = new Map()

  constructor() {
    this.initializeDefaultChannels()
    this.initializeDefaultTemplates()
    this.loadMockRecipients()
  }

  // Channel Management
  private initializeDefaultChannels() {
    const defaultChannels: NotificationChannel[] = [
      {
        id: "email",
        name: "Email",
        type: "email",
        enabled: true,
        config: { smtp_server: "smtp.university.edu", port: 587 },
      },
      {
        id: "sms",
        name: "SMS",
        type: "sms",
        enabled: true,
        config: { provider: "twilio", api_key: "mock_key" },
      },
      {
        id: "push",
        name: "Push Notifications",
        type: "push",
        enabled: true,
        config: { firebase_key: "mock_firebase_key" },
      },
      {
        id: "in_app",
        name: "In-App Notifications",
        type: "in_app",
        enabled: true,
        config: {},
      },
    ]

    defaultChannels.forEach((channel) => {
      this.channels.set(channel.id, channel)
    })
  }

  // Template Management
  private initializeDefaultTemplates() {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: "schedule_change",
        name: "Schedule Change Alert",
        subject: "Important: Schedule Change for {{course_name}}",
        content: `Dear {{recipient_name}},

Your class schedule has been updated:

Course: {{course_name}}
Original Time: {{original_time}}
New Time: {{new_time}}
Room: {{room_name}}
Reason: {{change_reason}}

Please update your calendar accordingly.

Best regards,
Academic Office`,
        variables: ["recipient_name", "course_name", "original_time", "new_time", "room_name", "change_reason"],
        channels: ["email", "sms", "push"],
        category: "schedule_change",
      },
      {
        id: "disruption_alert",
        name: "Disruption Alert",
        subject: "Urgent: Class Disruption - {{course_name}}",
        content: `Dear {{recipient_name}},

We need to inform you of an urgent schedule disruption:

Course: {{course_name}}
Scheduled Time: {{scheduled_time}}
Issue: {{disruption_reason}}
Status: {{status}}

{{resolution_details}}

We apologize for any inconvenience.

Academic Office`,
        variables: [
          "recipient_name",
          "course_name",
          "scheduled_time",
          "disruption_reason",
          "status",
          "resolution_details",
        ],
        channels: ["email", "sms", "push", "in_app"],
        category: "disruption_alert",
      },
      {
        id: "class_reminder",
        name: "Class Reminder",
        subject: "Reminder: {{course_name}} in {{time_until}}",
        content: `Hi {{recipient_name}},

This is a friendly reminder about your upcoming class:

Course: {{course_name}}
Time: {{class_time}}
Room: {{room_name}}
Faculty: {{faculty_name}}

See you there!`,
        variables: ["recipient_name", "course_name", "time_until", "class_time", "room_name", "faculty_name"],
        channels: ["push", "in_app"],
        category: "reminder",
      },
    ]

    defaultTemplates.forEach((template) => {
      this.templates.set(template.id, template)
    })
  }

  private loadMockRecipients() {
    const mockRecipients: NotificationRecipient[] = [
      {
        id: "student_1",
        name: "Rahul Sharma",
        email: "rahul.sharma@university.edu",
        phone: "+91-9876543210",
        role: "student",
        preferences: {
          channels: { email: true, sms: true, push: true, in_app: true },
          categories: {
            schedule_change: true,
            disruption_alert: true,
            reminder: true,
            announcement: true,
            system_update: false,
          },
          frequency: "immediate",
          quiet_hours: { enabled: true, start: "22:00", end: "07:00" },
        },
      },
      {
        id: "faculty_1",
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@university.edu",
        phone: "+91-9876543211",
        role: "faculty",
        preferences: {
          channels: { email: true, sms: false, push: true, in_app: true },
          categories: {
            schedule_change: true,
            disruption_alert: true,
            reminder: false,
            announcement: true,
            system_update: true,
          },
          frequency: "immediate",
          quiet_hours: { enabled: false, start: "00:00", end: "00:00" },
        },
      },
    ]

    mockRecipients.forEach((recipient) => {
      this.recipients.set(recipient.id, recipient)
    })
  }

  // Notification Sending
  async sendNotification(
    templateId: string,
    recipientId: string,
    variables: Record<string, string>,
    channels?: string[],
  ): Promise<Notification> {
    const template = this.templates.get(templateId)
    const recipient = this.recipients.get(recipientId)

    if (!template || !recipient) {
      throw new Error("Template or recipient not found")
    }

    // Apply user preferences
    const enabledChannels =
      channels ||
      template.channels.filter((channel) => {
        const channelEnabled = recipient.preferences.channels[channel as keyof typeof recipient.preferences.channels]
        const categoryEnabled = recipient.preferences.categories[template.category]
        return channelEnabled && categoryEnabled
      })

    // Replace variables in content
    let content = template.content
    let subject = template.subject

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      content = content.replace(new RegExp(placeholder, "g"), value)
      subject = subject.replace(new RegExp(placeholder, "g"), value)
    })

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      templateId,
      recipientId,
      subject,
      content,
      channels: enabledChannels,
      status: "pending",
      scheduledAt: new Date(),
      metadata: variables,
    }

    // Simulate sending
    await this.processNotification(notification)

    return notification
  }

  async sendBulkNotification(
    templateId: string,
    recipientIds: string[],
    variables: Record<string, string>,
  ): Promise<BulkNotification> {
    const bulkNotification: BulkNotification = {
      id: `bulk_${Date.now()}`,
      name: `Bulk notification - ${new Date().toLocaleString()}`,
      templateId,
      recipientGroups: ["selected_recipients"],
      totalRecipients: recipientIds.length,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      status: "sending",
      scheduledAt: new Date(),
      createdAt: new Date(),
    }

    // Process notifications in batches
    for (const recipientId of recipientIds) {
      try {
        await this.sendNotification(templateId, recipientId, variables)
        bulkNotification.sentCount++
        bulkNotification.deliveredCount++
      } catch (error) {
        bulkNotification.failedCount++
      }
    }

    bulkNotification.status = "completed"
    return bulkNotification
  }

  private async processNotification(notification: Notification): Promise<void> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Simulate delivery success/failure
    const success = Math.random() > 0.05 // 95% success rate

    if (success) {
      notification.status = "delivered"
      notification.sentAt = new Date()
      notification.deliveredAt = new Date()
    } else {
      notification.status = "failed"
    }
  }

  // Getters
  getChannels(): NotificationChannel[] {
    return Array.from(this.channels.values())
  }

  getTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values())
  }

  getRecipients(): NotificationRecipient[] {
    return Array.from(this.recipients.values())
  }

  // Integration with rescheduling system
  async notifyScheduleChange(
    courseId: string,
    originalTime: string,
    newTime: string,
    roomName: string,
    reason: string,
    affectedStudents: string[],
    affectedFaculty: string[],
  ): Promise<void> {
    const variables = {
      course_name: `Course ${courseId}`,
      original_time: originalTime,
      new_time: newTime,
      room_name: roomName,
      change_reason: reason,
    }

    // Notify students
    for (const studentId of affectedStudents) {
      const student = this.recipients.get(studentId)
      if (student) {
        await this.sendNotification("schedule_change", studentId, {
          ...variables,
          recipient_name: student.name,
        })
      }
    }

    // Notify faculty
    for (const facultyId of affectedFaculty) {
      const faculty = this.recipients.get(facultyId)
      if (faculty) {
        await this.sendNotification("schedule_change", facultyId, {
          ...variables,
          recipient_name: faculty.name,
        })
      }
    }
  }
}

export const notificationService = new NotificationService()
