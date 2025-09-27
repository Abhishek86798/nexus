export interface NotificationChannel {
  id: string
  name: string
  type: "email" | "sms" | "push" | "in_app"
  enabled: boolean
  config: Record<string, any>
}

export interface NotificationTemplate {
  id: string
  name: string
  subject: string
  content: string
  variables: string[]
  channels: string[]
  category: NotificationCategory
}

export type NotificationCategory =
  | "schedule_change"
  | "disruption_alert"
  | "reminder"
  | "announcement"
  | "system_update"

export interface NotificationRecipient {
  id: string
  name: string
  email: string
  phone?: string
  role: "student" | "faculty" | "admin"
  preferences: NotificationPreferences
}

export interface NotificationPreferences {
  channels: {
    email: boolean
    sms: boolean
    push: boolean
    in_app: boolean
  }
  categories: {
    schedule_change: boolean
    disruption_alert: boolean
    reminder: boolean
    announcement: boolean
    system_update: boolean
  }
  frequency: "immediate" | "hourly" | "daily" | "weekly"
  quiet_hours: {
    enabled: boolean
    start: string
    end: string
  }
}

export interface Notification {
  id: string
  templateId: string
  recipientId: string
  subject: string
  content: string
  channels: string[]
  status: "pending" | "sent" | "delivered" | "failed"
  scheduledAt: Date
  sentAt?: Date
  deliveredAt?: Date
  metadata: Record<string, any>
}

export interface BulkNotification {
  id: string
  name: string
  templateId: string
  recipientGroups: string[]
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  failedCount: number
  status: "draft" | "scheduled" | "sending" | "completed" | "failed"
  scheduledAt: Date
  createdAt: Date
}
