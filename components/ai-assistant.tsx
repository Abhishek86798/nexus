"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Brain,
  ArrowRight,
  AlertCircle
} from "lucide-react"
import type { AISuggestion, PerformanceMetrics } from "@/lib/types"

interface AIAssistantProps {
  className?: string
}

// Mock AI suggestions
const mockSuggestions: AISuggestion[] = [
  {
    id: 1,
    type: "swap",
    title: "Optimize CS101 Schedule",
    description: "Swap CS101 with MA204 on Monday to reduce student travel time between buildings by 40%",
    impact: "Reduces avg. walking time by 3 minutes per student",
    confidence: 87,
    estimated_improvement: "40% reduction in travel time"
  },
  {
    id: 2,
    type: "optimization",
    title: "Faculty Workload Balance",
    description: "Redistribute Dr. Sharma's classes to improve workload fairness across faculty",
    impact: "Improves workload distribution by 15%",
    confidence: 78,
    estimated_improvement: "15% workload balance improvement"
  },
  {
    id: 3,
    type: "preference",
    title: "Morning Preference Match",
    description: "Move Database Systems to 9:00 AM slot to match Prof. Patel's preferred teaching hours",
    impact: "Increases faculty satisfaction by 12%",
    confidence: 92,
    estimated_improvement: "12% faculty satisfaction increase"
  },
  {
    id: 4,
    type: "move",
    title: "Lab Utilization",
    description: "Consolidate lab sessions to Lab B201 for better equipment utilization",
    impact: "Improves lab utilization by 25%",
    confidence: 85,
    estimated_improvement: "25% lab utilization improvement"
  }
]

// Mock performance metrics
const mockMetrics: PerformanceMetrics = {
  student_schedule_compactness: 78,
  teacher_workload_fairness: 84,
  room_utilization: 67,
  preference_satisfaction: 73,
  conflict_resolution_score: 95
}

const metricChartData = [
  { name: "Mon", value: 85 },
  { name: "Tue", value: 92 },
  { name: "Tue", value: 78 },
  { name: "Wed", value: 88 },
  { name: "Thu", value: 95 },
  { name: "Fri", value: 76 },
  { name: "Sat", value: 45 }
]

export function AIAssistant({ className = "" }: AIAssistantProps) {
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<number>>(new Set())
  const [declinedSuggestions, setDeclinedSuggestions] = useState<Set<number>>(new Set())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const acceptSuggestion = (id: number) => {
    setAcceptedSuggestions(prev => new Set([...prev, id]))
    // Simulate improvement in metrics
    setTimeout(() => {
      // In real implementation, this would trigger timetable updates
      console.log(`Accepted suggestion ${id}`)
    }, 500)
  }

  const declineSuggestion = (id: number) => {
    setDeclinedSuggestions(prev => new Set([...prev, id]))
  }

  const runDeepAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const steps = [
      "Analyzing schedule compactness...",
      "Evaluating faculty preferences...", 
      "Checking room utilization...",
      "Computing student satisfaction...",
      "Generating recommendations..."
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnalysisProgress((i + 1) * 20)
    }

    setIsAnalyzing(false)
    setAnalysisProgress(0)
  }

  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-yellow-600" 
    return "text-red-600"
  }

  const getMetricBgColor = (value: number) => {
    if (value >= 80) return "bg-green-100 dark:bg-green-900"
    if (value >= 60) return "bg-yellow-100 dark:bg-yellow-900"
    return "bg-red-100 dark:bg-red-900"
  }

  const pendingSuggestions = mockSuggestions.filter(s => 
    !acceptedSuggestions.has(s.id) && !declinedSuggestions.has(s.id)
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Assistant Header */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Brain className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <CardDescription>
            Advanced optimization insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">System Status: Active</span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={runDeepAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 mr-1" />
                  Deep Analysis
                </>
              )}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="mt-4">
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-2">
                Running AI optimization analysis... {analysisProgress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions" className="flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            Suggestions ({pendingSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* AI Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          {pendingSuggestions.length > 0 ? (
            pendingSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {suggestion.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">{suggestion.impact}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => acceptSuggestion(suggestion.id)}
                        className="flex-1"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => declineSuggestion(suggestion.id)}
                        className="flex-1"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    No new optimization suggestions at this time.
                  </p>
                  <Button size="sm" className="mt-4" onClick={runDeepAnalysis}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {acceptedSuggestions.size > 0 && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-600 dark:text-green-400">
                  Recently Applied
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(acceptedSuggestions).map(id => {
                    const suggestion = mockSuggestions.find(s => s.id === id)
                    return suggestion ? (
                      <div key={id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>{suggestion.title}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(mockMetrics).map(([key, value]) => {
              const metricLabels = {
                student_schedule_compactness: "Student Schedule Compactness",
                teacher_workload_fairness: "Teacher Workload Fairness", 
                room_utilization: "Room Utilization",
                preference_satisfaction: "Preference Satisfaction",
                conflict_resolution_score: "Conflict Resolution"
              }
              
              return (
                <Card key={key}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        {metricLabels[key as keyof typeof metricLabels]}
                      </span>
                      <span className={`text-lg font-bold ${getMetricColor(value)}`}>
                        {value}%
                      </span>
                    </div>
                    <Progress value={value} className="w-full h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Poor</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Weekly Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between space-x-1">
                {metricChartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${(data.value / 100) * 80}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{data.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Brain className="h-4 w-4" />
                AI Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Peak Efficiency Detected</p>
                    <p className="text-xs text-muted-foreground">
                      Tuesday and Thursday show optimal room utilization patterns
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Opportunity Identified</p>
                    <p className="text-xs text-muted-foreground">
                      Friday afternoons have 35% unused classroom capacity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Pattern Recognition</p>
                    <p className="text-xs text-muted-foreground">
                      Students prefer morning slots for major courses by 68%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Target className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Schedule Density</p>
                    <p className="text-xs text-muted-foreground">
                      Optimize class clustering to reduce campus navigation time
                    </p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-blue-500" />
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Users className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Faculty Balance</p>
                    <p className="text-xs text-muted-foreground">
                      Redistribute teaching load for better work-life balance
                    </p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-green-500" />
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Resource Allocation</p>
                    <p className="text-xs text-muted-foreground">
                      Better utilization of specialized lab equipment
                    </p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                Predictive Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>📈 <strong>Next Week Forecast:</strong> 12% increase in room utilization expected</p>
                <p>🎯 <strong>Optimization Potential:</strong> Current schedule can be improved by 18%</p>
                <p>⚡ <strong>Quick Win:</strong> Moving 3 classes can reduce conflicts by 67%</p>
                <p>🧠 <strong>ML Confidence:</strong> 94% accuracy on schedule predictions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}