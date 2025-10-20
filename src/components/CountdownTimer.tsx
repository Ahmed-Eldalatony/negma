import { Clock } from "lucide-react";

interface CountdownTimerProps {
  timeLeft?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function CountdownTimer({ timeLeft = { hours: 30, minutes: 24, seconds: 43 } }: CountdownTimerProps) {
  return (
    <div 
      className="flex items-center justify-center gap-2 p-3 bg-muted rounded-md"
      data-testid="countdown-timer"
    >
      <Clock className="h-4 w-4 text-destructive" />
      <span className="text-sm font-medium">عرض محدود</span>
      <div className="flex items-center gap-1 font-mono text-sm font-bold">
        <span data-testid="text-hours">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span>:</span>
        <span data-testid="text-minutes">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span>:</span>
        <span data-testid="text-seconds">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
