import CountdownTimer from '../CountdownTimer';

export default function CountdownTimerExample() {
  return (
    <div className="p-4 max-w-mobile mx-auto">
      <CountdownTimer timeLeft={{ hours: 30, minutes: 24, seconds: 43 }} />
    </div>
  );
}
