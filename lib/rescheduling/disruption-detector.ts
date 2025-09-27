import type { DisruptionEvent, AffectedResource } from "./types"

export class DisruptionDetector {
  private activeDisruptions: Map<string, DisruptionEvent> = new Map()
  private listeners: ((event: DisruptionEvent) => void)[] = []

  // Simulate real-time disruption detection
  startMonitoring() {
    // In a real system, this would connect to various data sources
    setInterval(() => {
      this.checkForDisruptions()
    }, 30000) // Check every 30 seconds
  }

  private checkForDisruptions() {
    // Simulate random disruptions for demo
    if (Math.random() < 0.1) {
      // 10% chance every 30 seconds
      const disruption = this.generateRandomDisruption()
      this.reportDisruption(disruption)
    }
  }

  reportDisruption(disruption: DisruptionEvent) {
    this.activeDisruptions.set(disruption.id, disruption)
    this.notifyListeners(disruption)
  }

  resolveDisruption(disruptionId: string) {
    const disruption = this.activeDisruptions.get(disruptionId)
    if (disruption) {
      disruption.status = "resolved"
      disruption.resolvedAt = new Date()
      this.activeDisruptions.delete(disruptionId)
    }
  }

  getActiveDisruptions(): DisruptionEvent[] {
    return Array.from(this.activeDisruptions.values())
  }

  onDisruption(callback: (event: DisruptionEvent) => void) {
    this.listeners.push(callback)
  }

  private notifyListeners(event: DisruptionEvent) {
    this.listeners.forEach((callback) => callback(event))
  }

  private generateRandomDisruption(): DisruptionEvent {
    const types: DisruptionEvent["type"][] = ["faculty_absence", "room_unavailable", "equipment_failure", "maintenance"]

    const severities: DisruptionEvent["severity"][] = ["low", "medium", "high"]

    const type = types[Math.floor(Math.random() * types.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    return {
      id: `disruption_${Date.now()}`,
      type,
      severity,
      title: this.getDisruptionTitle(type),
      description: this.getDisruptionDescription(type),
      affectedResources: this.generateAffectedResources(type),
      startTime: new Date(),
      status: "active",
      createdAt: new Date(),
      createdBy: "system",
    }
  }

  private getDisruptionTitle(type: DisruptionEvent["type"]): string {
    const titles = {
      faculty_absence: "Faculty Member Unavailable",
      room_unavailable: "Classroom Temporarily Closed",
      equipment_failure: "Equipment Malfunction",
      maintenance: "Scheduled Maintenance",
      emergency_closure: "Emergency Building Closure",
      weather_disruption: "Weather-Related Disruption",
      event_conflict: "Conflicting Event Scheduled",
      student_emergency: "Student Emergency Situation",
    }
    return titles[type]
  }

  private getDisruptionDescription(type: DisruptionEvent["type"]): string {
    const descriptions = {
      faculty_absence: "A faculty member is unexpectedly unavailable for scheduled classes",
      room_unavailable: "A classroom is temporarily unavailable due to maintenance or other issues",
      equipment_failure: "Essential equipment has malfunctioned and requires immediate attention",
      maintenance: "Scheduled maintenance work is affecting classroom availability",
      emergency_closure: "Emergency situation requires immediate building closure",
      weather_disruption: "Severe weather conditions are affecting normal operations",
      event_conflict: "An unscheduled event is conflicting with regular classes",
      student_emergency: "A student emergency requires immediate schedule adjustments",
    }
    return descriptions[type]
  }

  private generateAffectedResources(type: DisruptionEvent["type"]): AffectedResource[] {
    // Generate mock affected resources based on disruption type
    const resources: AffectedResource[] = []

    if (type === "faculty_absence") {
      resources.push({
        type: "faculty",
        id: "faculty_1",
        name: "Dr. Rajesh Sharma",
        impact: "direct",
      })
    } else if (type === "room_unavailable") {
      resources.push({
        type: "room",
        id: "room_101",
        name: "Lecture Hall 101",
        impact: "direct",
      })
    }

    return resources
  }
}

export const disruptionDetector = new DisruptionDetector()
