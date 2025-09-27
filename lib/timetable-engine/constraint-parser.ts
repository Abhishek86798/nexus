// Natural language preference parser for converting text to constraints

export class ConstraintParser {
  private timeKeywords = {
    morning: ["morning", "am", "early"],
    afternoon: ["afternoon", "pm", "late"],
    specific_times: {
      "9": ["9", "nine", "9am", "9:00"],
      "10": ["10", "ten", "10am", "10:00"],
      "11": ["11", "eleven", "11am", "11:00"],
      "14": ["2pm", "2:00pm", "afternoon 1"],
      "15": ["3pm", "3:00pm", "afternoon 2"],
    },
  }

  private dayKeywords = {
    monday: ["monday", "mon"],
    tuesday: ["tuesday", "tue"],
    wednesday: ["wednesday", "wed"],
    thursday: ["thursday", "thu"],
    friday: ["friday", "fri"],
  }

  private preferenceKeywords = {
    prefers: ["prefers", "likes", "wants", "favors"],
    avoids: ["avoids", "dislikes", "cannot", "unavailable"],
    needs: ["needs", "requires", "must have"],
  }

  parsePreference(text: string): any[] {
    const constraints: any[] = []
    const lowerText = text.toLowerCase()

    // Determine preference type
    const isPositive = this.containsAny(lowerText, this.preferenceKeywords.prefers)
    const isNegative = this.containsAny(lowerText, this.preferenceKeywords.avoids)
    const isRequired = this.containsAny(lowerText, this.preferenceKeywords.needs)

    // Parse time preferences
    const timeConstraints = this.parseTimePreferences(lowerText, isPositive, isNegative, isRequired)
    constraints.push(...timeConstraints)

    // Parse room preferences
    const roomConstraints = this.parseRoomPreferences(lowerText, isPositive, isNegative, isRequired)
    constraints.push(...roomConstraints)

    // Parse day preferences
    const dayConstraints = this.parseDayPreferences(lowerText, isPositive, isNegative, isRequired)
    constraints.push(...dayConstraints)

    return constraints
  }

  private parseTimePreferences(text: string, isPositive: boolean, isNegative: boolean, isRequired: boolean): any[] {
    const constraints: any[] = []

    // Morning preference
    if (this.containsAny(text, this.timeKeywords.morning)) {
      constraints.push({
        preference_text: text,
        constraint_type: "time_preference",
        priority: isRequired ? 10 : isPositive ? 8 : 3,
        is_hard_constraint: isRequired || isNegative,
      })
    }

    // Afternoon preference
    if (this.containsAny(text, this.timeKeywords.afternoon)) {
      constraints.push({
        preference_text: text,
        constraint_type: "time_preference",
        priority: isRequired ? 10 : isPositive ? 8 : 3,
        is_hard_constraint: isRequired || isNegative,
      })
    }

    return constraints
  }

  private parseRoomPreferences(text: string, isPositive: boolean, isNegative: boolean, isRequired: boolean): any[] {
    const constraints: any[] = []

    // Lab requirement
    if (text.includes("lab")) {
      constraints.push({
        preference_text: text,
        constraint_type: "room_preference",
        priority: isRequired ? 10 : 8,
        is_hard_constraint: isRequired,
      })
    }

    // Equipment requirements
    if (text.includes("projector") || text.includes("computer") || text.includes("server")) {
      constraints.push({
        preference_text: text,
        constraint_type: "equipment_preference",
        priority: isRequired ? 9 : 7,
        is_hard_constraint: isRequired,
      })
    }

    return constraints
  }

  private parseDayPreferences(text: string, isPositive: boolean, isNegative: boolean, isRequired: boolean): any[] {
    const constraints: any[] = []

    Object.entries(this.dayKeywords).forEach(([day, keywords]) => {
      if (this.containsAny(text, keywords)) {
        constraints.push({
          preference_text: text,
          constraint_type: "day_preference",
          priority: isRequired ? 10 : isNegative ? 9 : 6,
          is_hard_constraint: isRequired || isNegative,
        })
      }
    })

    return constraints
  }

  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword))
  }
}
