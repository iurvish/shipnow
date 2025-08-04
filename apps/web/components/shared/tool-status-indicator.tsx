import React from 'react';
import { Check, Loader2, Search, Database, Shield, FileText, Zap } from 'lucide-react';
import { ToolStatus } from '@/lib/actions/chat-actions';

interface ToolStatusIndicatorProps {
  statuses: ToolStatus[];
  currentStep?: string;
}

const getStepIcon = (step: string, completed: boolean) => {
  const iconProps = { className: `h-4 w-4 ${completed ? 'text-green-500' : 'text-muted-foreground'}` };
  
  switch (step) {
    case 'classify':
      return <FileText {...iconProps} />;
    case 'generate':
      return <Zap {...iconProps} />;
    case 'validate':
      return <Shield {...iconProps} />;
    case 'search':
      return <Database {...iconProps} />;
    case 'format':
      return <Search {...iconProps} />;
    default:
      return <Loader2 {...iconProps} />;
  }
};

export function ToolStatusIndicator({ statuses, currentStep }: ToolStatusIndicatorProps) {
  if (statuses.length === 0) return null;

  return (
    <div className="bg-muted/30 border border-muted p-4 mb-4" style={{ borderRadius: '0px' }}>
      <div className="flex items-center gap-2 mb-3">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm font-medium text-foreground">AI Processing</span>
      </div>
      
      <div className="space-y-2">
        {statuses.map((status, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {status.completed ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : status.step === currentStep ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                getStepIcon(status.step, status.completed)
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium capitalize ${
                  status.completed 
                    ? 'text-green-600 dark:text-green-400' 
                    : status.step === currentStep 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}>
                  {status.step}
                </span>
                {status.completed && (
                  <span className="text-xs text-green-600 dark:text-green-400">✓</span>
                )}
              </div>
              <p className={`text-xs ${
                status.completed 
                  ? 'text-green-600/80 dark:text-green-400/80' 
                  : status.step === currentStep 
                  ? 'text-primary/80' 
                  : 'text-muted-foreground'
              }`}>
                {status.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
