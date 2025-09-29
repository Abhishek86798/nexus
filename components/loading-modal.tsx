'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Zap, Brain } from "lucide-react";

interface LoadingStep {
  id: string;
  label: string;
  duration: number;
  completed: boolean;
}

interface LoadingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function LoadingModal({ isOpen, onComplete }: LoadingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: '1', label: 'Analyzing course requirements...', duration: 800, completed: false },
    { id: '2', label: 'Checking teacher availability...', duration: 600, completed: false },
    { id: '3', label: 'Optimizing room assignments...', duration: 700, completed: false },
    { id: '4', label: 'Running AI optimization...', duration: 900, completed: false },
    { id: '5', label: 'Finalizing timetable...', duration: 500, completed: false }
  ]);

  useEffect(() => {
    if (!isOpen) return;
    
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Animate progress for current step
        const stepDuration = steps[i].duration;
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const increment = 100 / (stepDuration / 50);
            const newProgress = Math.min(prev + increment, (i + 1) * 20);
            return newProgress;
          });
        }, 50);

        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        
        clearInterval(progressInterval);
        
        // Mark step as completed
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, completed: true } : step
        ));
        
        setProgress((i + 1) * 20);
      }

      // Wait a bit before completing
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    processSteps();
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Timetable</h2>
            <p className="text-gray-600">AI is optimizing your schedule...</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : index === currentStep ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <span className={`text-sm ${
                  step.completed 
                    ? 'text-green-600 font-medium' 
                    : index === currentStep 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Zap className="h-4 w-4" />
              <span>Powered by AI Optimization Engine</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}