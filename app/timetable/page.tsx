'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  UserX, 
  RefreshCw, 
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import MarkAbsentModal from "@/components/mark-absent-modal";
import { 
  timeSlots, 
  weekDays, 
  sampleTimetable, 
  getTimetableEntry, 
  getCourseTypeColor,
  aiSuggestions,
  teacherSatisfactionData,
  roomUtilizationData,
  studentCompactnessData,
  TimetableEntry,
  AISuggestion
} from "@/data/timetableData";

export default function TimetablePage() {
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMarkAbsentModalOpen, setIsMarkAbsentModalOpen] = useState(false);
  const [modifiedEntries, setModifiedEntries] = useState<Set<string>>(new Set());
  const [absentTeachers, setAbsentTeachers] = useState<Set<string>>(new Set());
  const [disruptedClasses, setDisruptedClasses] = useState<Set<string>>(new Set());

  const handleCellClick = (entry: TimetableEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleMarkAbsent = () => {
    setIsModalOpen(false);
    setIsMarkAbsentModalOpen(true);
  };

  const handleAcceptAbsentSuggestion = (suggestionId: string, entryId: string) => {
    if (selectedEntry) {
      // Mark teacher as absent
      setAbsentTeachers(prev => new Set([...prev, selectedEntry.teacherName]));
      
      // Handle different suggestion types
      if (suggestionId === 'emergency-absent' || suggestionId.startsWith('cancel-')) {
        // Mark class as disrupted (will show in red)
        setDisruptedClasses(prev => new Set([...prev, entryId]));
        toast.error(`Class cancelled due to teacher absence`, {
          description: `${selectedEntry.courseName} has been marked as disrupted`
        });
      } else {
        // For substitute/reschedule/merge, mark as modified (will show in yellow)
        setModifiedEntries(prev => new Set([...prev, entryId]));
        toast.success(`Solution applied successfully`, {
          description: `${selectedEntry.courseName} has been rescheduled`
        });
      }
    }
  };

  const handleDeclineAbsentSuggestion = (suggestionId: string) => {
    // Could track declined suggestions for analytics
    console.log('Declined suggestion:', suggestionId);
    toast.info('Suggestion declined', {
      description: 'You can explore other solutions or mark as emergency absent'
    });
  };

  const handleReschedule = () => {
    if (selectedEntry) {
      setModifiedEntries(prev => new Set([...prev, selectedEntry.id]));
      setIsModalOpen(false);
    }
  };

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'swap': return <RefreshCw className="h-4 w-4" />;
      case 'optimize': return <TrendingUp className="h-4 w-4" />;
      case 'reschedule': return <Calendar className="h-4 w-4" />;
      case 'alert': return <Users className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (impact: AISuggestion['impact']) => {
    switch (impact) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 pr-80">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  Interactive Timetable
                </h1>
                <p className="text-gray-600">Click on any class to view details and manage changes</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Timetable Grid */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      <div className="p-3 font-semibold text-gray-600 text-center">Time</div>
                      {weekDays.map((day) => (
                        <div key={day} className="p-3 font-semibold text-gray-800 text-center bg-gray-100 rounded">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Time Slot Rows */}
                    {timeSlots.map((timeSlot) => (
                      <div key={timeSlot.id} className="grid grid-cols-6 gap-2 mb-2">
                        {/* Time Column */}
                        <div className="p-3 text-sm font-medium text-gray-600 bg-gray-50 rounded text-center">
                          {timeSlot.displayTime}
                        </div>
                        
                        {/* Day Columns */}
                        {weekDays.map((day) => {
                          const entry = getTimetableEntry(day, timeSlot.id);
                          const isModified = entry && modifiedEntries.has(entry.id);
                          const isDisrupted = entry && disruptedClasses.has(entry.id);
                          const isTeacherAbsent = entry && absentTeachers.has(entry.teacherName);
                          
                          return (
                            <div key={`${day}-${timeSlot.id}`} className="min-h-[80px]">
                              {entry ? (
                                <div
                                  onClick={() => handleCellClick(entry)}
                                  className={`
                                    p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md h-full
                                    ${isDisrupted ? 'bg-red-100 border-red-300' : 
                                      isModified ? 'bg-yellow-100 border-yellow-300' : 
                                      getCourseTypeColor(entry.courseType)}
                                    ${(isDisrupted || isModified) ? 'ring-2 ring-offset-1' : ''}
                                    ${isDisrupted ? 'ring-red-400' : isModified ? 'ring-yellow-400' : ''}
                                  `}
                                >
                                  <div className="space-y-1">
                                    <div className="font-semibold text-sm">{entry.courseCode}</div>
                                    <div className="text-xs text-gray-600">{entry.teacherName.split(' ').slice(-1)}</div>
                                    <div className="text-xs text-gray-600 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {entry.roomNumber}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {entry.enrolledCount}/{entry.maxCapacity}
                                    </div>
                                  </div>
                                  {(isDisrupted || isModified) && (
                                    <div className="mt-1">
                                      {isDisrupted ? (
                                        <Badge variant="destructive" className="text-xs">
                                          Teacher Absent
                                        </Badge>
                                      ) : (
                                        <Badge className="text-xs bg-yellow-500 text-white">
                                          Rescheduled
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="h-full border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 opacity-50"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300"></div>
                    <span className="text-sm text-gray-600">Major Course</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300"></div>
                    <span className="text-sm text-gray-600">Minor Course</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-300"></div>
                    <span className="text-sm text-gray-600">Laboratory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-300"></div>
                    <span className="text-sm text-gray-600">Elective</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant Sidebar - Fixed Right Panel */}
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                AI Assistant
              </h2>
              <p className="text-sm text-gray-600">Smart suggestions and insights</p>
            </div>

            {/* Suggestions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Suggestions
              </h3>
              {aiSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className={`${getSuggestionColor(suggestion.impact)} hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-gray-600 mt-1">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge variant={suggestion.impact === 'high' ? 'destructive' : suggestion.impact === 'medium' ? 'default' : 'secondary'} className="text-xs">
                            {suggestion.impact} impact
                          </Badge>
                          <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Metrics */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Metrics
              </h3>

              {/* Teacher Satisfaction */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Teacher Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={teacherSatisfactionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={50}
                          dataKey="value"
                        >
                          {teacherSatisfactionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-lg font-bold text-green-600 mt-2">
                    80% Satisfied
                  </div>
                </CardContent>
              </Card>

              {/* Room Utilization */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Room Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roomUtilizationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-lg font-bold text-blue-600 mt-2">
                    82% Average
                  </div>
                </CardContent>
              </Card>

              {/* Student Compactness */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Student Compactness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {studentCompactnessData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-full rounded"
                              style={{
                                width: `${item.value}%`,
                                backgroundColor: item.color
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-lg font-bold text-green-600 mt-2">
                    95% Optimized
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Class Details
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{selectedEntry.courseName}</h3>
                  <p className="text-gray-600">{selectedEntry.courseCode}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Teacher:</span>
                    <p>{selectedEntry.teacherName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Room:</span>
                    <p>{selectedEntry.roomNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Day:</span>
                    <p>{selectedEntry.day}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <p>{timeSlots.find(t => t.id === selectedEntry.timeSlotId)?.displayTime}</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Enrolled Students:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{selectedEntry.enrolledCount} / {selectedEntry.maxCapacity} students</span>
                    <Badge className={getCourseTypeColor(selectedEntry.courseType)}>
                      {selectedEntry.courseType.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Sample Enrolled Students:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• John Doe (CS2021001)</div>
                    <div>• Jane Smith (CS2021002)</div>
                    <div>• Alice Johnson (CS2019001)</div>
                    <div>• ... and {selectedEntry.enrolledCount - 3} more</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleMarkAbsent}
                  className="flex-1"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Mark Teacher Absent
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReschedule}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mark Teacher Absent Modal */}
      <MarkAbsentModal
        isOpen={isMarkAbsentModalOpen}
        onClose={() => setIsMarkAbsentModalOpen(false)}
        selectedEntry={selectedEntry}
        onAcceptSuggestion={handleAcceptAbsentSuggestion}
        onDeclineSuggestion={handleDeclineAbsentSuggestion}
      />
    </div>
  );
}