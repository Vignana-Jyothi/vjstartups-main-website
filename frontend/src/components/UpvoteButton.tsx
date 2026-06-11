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
          "flex items-center gap-2 px-3 py-2 rounded-2xl shadow-md transition-all",
          "bg-white dark:bg-gray-800",
          "hover:scale-105"
        )}
      >
        <Heart
          className={clsx(
            "w-5 h-5 transition-colors",
            hasUpvoted ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"
          )}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {upvotes}
        </span>
      </button>
      
      {showDownvote && (
        <button
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-2xl shadow-md transition-all",
            "bg-white dark:bg-gray-800",
            "hover:scale-105"
          )}
        >
          <ThumbsDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {downvotes}
          </span>
        </button>
      )}
    </div>
  );
};

export default UpvoteButton;
