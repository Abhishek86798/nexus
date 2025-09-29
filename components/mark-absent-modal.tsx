'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserX, 
  RefreshCw, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MapPin
} from "lucide-react";
import { TimetableEntry, timeSlots } from "@/data/timetableData";

interface AbsentSuggestion {
  id: string;
  type: 'substitute' | 'reschedule' | 'merge' | 'cancel';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  newTeacher?: string;
  newRoom?: string;
  newTime?: string;
  affectedStudents?: number;
}

interface MarkAbsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntry: TimetableEntry | null;
  onAcceptSuggestion: (suggestionId: string, entryId: string) => void;
  onDeclineSuggestion: (suggestionId: string) => void;
}

export default function MarkAbsentModal({ 
  isOpen, 
  onClose, 
  selectedEntry, 
  onAcceptSuggestion, 
  onDeclineSuggestion 
}: MarkAbsentModalProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Helper function to get time slot display text
  const getTimeSlotText = (timeSlotId: string): string => {
    const slot = timeSlots.find(ts => ts.id === timeSlotId);
    return slot ? slot.displayTime : timeSlotId;
  };

  // Generate contextual suggestions based on the selected class
  const getAbsentSuggestions = (entry: TimetableEntry | null): AbsentSuggestion[] => {
    if (!entry) return [];

    return [
      {
        id: 'sub-1',
        type: 'substitute',
        title: 'Assign Substitute Teacher',
        description: `Prof. Rajesh Kumar (available) can cover ${entry.courseName}`,
        impact: 'low',
        newTeacher: 'Prof. Rajesh Kumar',
        affectedStudents: entry.enrolledCount
      },
      {
        id: 'resc-1',
        type: 'reschedule',
        title: 'Reschedule to Available Slot',
        description: `Move class to ${entry.day} 2:00-3:00 PM in ${entry.roomNumber}`,
        impact: 'medium',
        newTime: '2:00-3:00 PM',
        affectedStudents: entry.enrolledCount
      },
      {
        id: 'merge-1',
        type: 'merge',
        title: 'Merge with Similar Class',
        description: 'Combine with CS201 Advanced session (same topic coverage)',
        impact: 'medium',
        newRoom: 'Room A301 (Larger)',
        affectedStudents: entry.enrolledCount + 28
      },
      {
        id: 'cancel-1',
        type: 'cancel',
        title: 'Cancel and Make-up Later',
        description: 'Cancel this session and schedule make-up class next week',
        impact: 'high',
        affectedStudents: entry.enrolledCount
      }
    ];
  };

  const getSuggestionIcon = (type: AbsentSuggestion['type']) => {
    switch (type) {
      case 'substitute': return <Users className="h-4 w-4" />;
      case 'reschedule': return <Calendar className="h-4 w-4" />;
      case 'merge': return <RefreshCw className="h-4 w-4" />;
      case 'cancel': return <XCircle className="h-4 w-4" />;
    }
  };

  const getImpactBadgeColor = (impact: AbsentSuggestion['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const suggestions = getAbsentSuggestions(selectedEntry);

  const handleAccept = (suggestionId: string) => {
    if (selectedEntry) {
      onAcceptSuggestion(suggestionId, selectedEntry.id);
      setSelectedSuggestion(null);
      onClose();
    }
  };

  const handleDecline = (suggestionId: string) => {
    onDeclineSuggestion(suggestionId);
    setSelectedSuggestion(null);
  };

  if (!selectedEntry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserX className="h-6 w-6 text-red-600" />
            Mark Teacher Absent
          </DialogTitle>
        </DialogHeader>

        {/* Class Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-2">{selectedEntry.courseName}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{selectedEntry.teacherName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{selectedEntry.day} {getTimeSlotText(selectedEntry.timeSlotId)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{selectedEntry.roomNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{selectedEntry.enrolledCount} students</span>
            </div>
          </div>
        </div>

        {/* Alert */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Marking a teacher as absent will disrupt this class. Please select one of the suggested solutions below.
          </AlertDescription>
        </Alert>

        {/* AI Suggestions */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg mb-4">AI-Recommended Solutions:</h4>
          
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                selectedSuggestion === suggestion.id 
                  ? 'ring-2 ring-blue-500 border-blue-300' 
                  : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getSuggestionIcon(suggestion.type)}
                  <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                  <Badge className={getImpactBadgeColor(suggestion.impact)}>
                    {suggestion.impact} impact
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-600 mb-3">{suggestion.description}</p>
              
              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500 mb-4">
                {suggestion.newTeacher && (
                  <div>Substitute: {suggestion.newTeacher}</div>
                )}
                {suggestion.newRoom && (
                  <div>New Room: {suggestion.newRoom}</div>
                )}
                {suggestion.newTime && (
                  <div>New Time: {suggestion.newTime}</div>
                )}
                {suggestion.affectedStudents && (
                  <div>Affected: {suggestion.affectedStudents} students</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAccept(suggestion.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecline(suggestion.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              // Mark as absent without solution (emergency)
              onAcceptSuggestion('emergency-absent', selectedEntry.id);
              onClose();
            }}
          >
            <UserX className="h-4 w-4 mr-2" />
            Mark Absent (No Solution)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}