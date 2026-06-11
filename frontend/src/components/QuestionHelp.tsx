import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { questionHelpContent, QuestionHelp as QuestionHelpType } from '@/config/questionHelpContent';
import { startupHelpContent, StartupHelp } from '@/config/startupHelpContent';

// Global state to manage which help popup is open
let currentOpenHelpKey: string | null = null;
const helpStateSubscribers: Set<() => void> = new Set();

const notifyStateChange = () => {
  helpStateSubscribers.forEach(callback => callback());
};

interface QuestionHelpProps {
  questionKey: string;
  questionText: string;
  helpType?: 'question' | 'startup';
}

export const QuestionHelp: React.FC<QuestionHelpProps> = ({ 
  questionKey, 
  questionText,
  helpType = 'question'
}) => {
  const [, forceUpdate] = useState({});
  
  const helpContent = helpType === 'startup' 
    ? startupHelpContent[questionKey] 
    : questionHelpContent[questionKey];
  
  const isOpen = currentOpenHelpKey === questionKey;
  
  useEffect(() => {
    const callback = () => forceUpdate({});
    helpStateSubscribers.add(callback);
    return () => {
      helpStateSubscribers.delete(callback);
    };
  }, []);

  // Close help panel when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Check if click is outside the help panel and not on the help button
        if (!target.closest('.help-panel') && !target.closest('.help-button')) {
          currentOpenHelpKey = null;
          notifyStateChange();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  const toggleHelp = () => {
    if (isOpen) {
      currentOpenHelpKey = null;
    } else {
      currentOpenHelpKey = questionKey;
    }
    notifyStateChange();
  };
  
  if (!helpContent) {
    console.warn(`No help content found for question key: ${questionKey}`);
    return null;
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 ml-0 mr-0 text-muted-foreground hover:text-primary help-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleHelp();
          console.log('Help button clicked, now open:', !isOpen);
        }}
        type="button"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-8 left-0 z-50 w-[min(500px,95vw)] p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl help-panel">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-semibold pr-2 leading-tight">{questionText}</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                currentOpenHelpKey = null;
                notifyStateChange();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3 text-xs">
            <div>
              <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">💡 Why is this important?</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{helpContent.importance}</p>
            </div>
            
            {helpContent.tips && helpContent.tips.length > 0 && (
              <div>
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🎯 Tips:</p>
                <ul className="space-y-1">
                  {helpContent.tips.map((tip, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed flex">
                      <span className="text-green-500 mr-1 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {helpContent.examples && helpContent.examples.length > 0 && (
              <div>
                <p className="font-semibold text-purple-600 dark:text-purple-400 mb-1">📋 Examples:</p>
                <ul className="space-y-1">
                  {helpContent.examples.map((example, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed flex">
                      <span className="text-purple-500 mr-1 flex-shrink-0">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {helpContent.terminology && Object.keys(helpContent.terminology).length > 0 && (
              <div>
                <p className="font-semibold text-orange-600 dark:text-orange-400 mb-1">📚 Key Terms:</p>
                <div className="space-y-1">
                  {Object.entries(helpContent.terminology).map(([term, definition]) => (
                    <div key={term} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-xs">{term}:</p>
                      <p className="text-gray-700 dark:text-gray-300 text-xs">{definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionHelp;