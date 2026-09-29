import React from "react";
import { Heart, ThumbsDown } from "lucide-react";
import clsx from "clsx";

type UpvoteButtonProps = {
  upvotes: number;
  hasUpvoted?: boolean; // controlled prop
  downvotes?: number;
  showDownvote?: boolean;
  onClick: (e?: React.MouseEvent) => void; // controlled click handler with optional event
  className?: string;
};

const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  upvotes,
  hasUpvoted = false,
  downvotes = 0,
  showDownvote = false,
  onClick,
  className,
}) => {
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      <button
        onClick={(e) => {
          // Pass the event to the parent component
          if (onClick) onClick(e);
        }}
        className={clsx(
          "flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md transition-all",
          "hover:border-pink-400/60",
          hasUpvoted && "border-pink-400/60"
        )}
        aria-pressed={hasUpvoted}
        aria-label={hasUpvoted ? "Remove upvote" : "Upvote"}
      >
        <Heart
          className={clsx(
            "w-4 h-4 transition-colors",
            hasUpvoted ? "fill-pink-400 text-pink-400" : "text-white/70"
          )}
        />
        <span className="font-mono text-xs text-white">
          {upvotes}
        </span>
      </button>
      
      {showDownvote && (
        <button
          className={clsx(
            "flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md transition-all"
          )}
        >
          <ThumbsDown className="w-4 h-4 text-white/70" />
          <span className="font-mono text-xs text-white">
            {downvotes}
          </span>
        </button>
      )}
    </div>
  );
};

export default UpvoteButton;
