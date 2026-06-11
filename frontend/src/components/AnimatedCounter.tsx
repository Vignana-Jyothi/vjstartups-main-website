import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  duration: number;
  label: string;
}

const AnimatedCounter = ({ end, duration, label }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(end * easeOut));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return (
    <div className="text-center animate-counter">
      <div className="counter-number">{count}</div>
      <div className="counter-label">{label}</div>
    </div>
  );
};

export default AnimatedCounter;