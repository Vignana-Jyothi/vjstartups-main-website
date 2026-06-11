import { stageLabels } from "@/data/mockData";

interface StatusBadgeProps {
  stage: number;
  className?: string;
}

const StatusBadge = ({ stage, className = "" }: StatusBadgeProps) => {
  const safeStage = stage || 1;
  
  const getStatusStyle = (stageNum: number) => {
    if (stageNum <= 3) return "status-idea";
    if (stageNum <= 6) return "status-development"; 
    return "status-funded";
  };
  
  return (
    <span className={`status-badge ${getStatusStyle(safeStage)} ${className}`}>
      {stageLabels[safeStage - 1]}
    </span>
  );
};

export default StatusBadge;