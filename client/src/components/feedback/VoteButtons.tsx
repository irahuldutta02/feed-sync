
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  initialUpvotes?: number;
  initialDownvotes?: number;
  onVoteChange?: (upvotes: number, downvotes: number) => void;
}

const VoteButtons = ({
  initialUpvotes = 0,
  initialDownvotes = 0,
  onVoteChange,
}: VoteButtonsProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

  const handleUpvote = () => {
    if (userVote === 'up') {
      // Undo upvote
      setUpvotes(upvotes - 1);
      setUserVote(null);
      onVoteChange?.(upvotes - 1, downvotes);
    } else {
      // Add upvote and remove downvote if exists
      const newUpvotes = upvotes + 1;
      let newDownvotes = downvotes;
      
      if (userVote === 'down') {
        newDownvotes = downvotes - 1;
      }
      
      setUpvotes(newUpvotes);
      setDownvotes(newDownvotes);
      setUserVote('up');
      onVoteChange?.(newUpvotes, newDownvotes);
    }
  };

  const handleDownvote = () => {
    if (userVote === 'down') {
      // Undo downvote
      setDownvotes(downvotes - 1);
      setUserVote(null);
      onVoteChange?.(upvotes, downvotes - 1);
    } else {
      // Add downvote and remove upvote if exists
      const newDownvotes = downvotes + 1;
      let newUpvotes = upvotes;
      
      if (userVote === 'up') {
        newUpvotes = upvotes - 1;
      }
      
      setDownvotes(newDownvotes);
      setUpvotes(newUpvotes);
      setUserVote('down');
      onVoteChange?.(newUpvotes, newDownvotes);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleUpvote}
        className="flex items-center space-x-1 text-sm"
        aria-label="Upvote"
      >
        <ThumbsUp 
          className={cn(
            "h-4 w-4", 
            userVote === 'up' ? "text-green-500 fill-green-500" : "text-muted-foreground"
          )} 
        />
        <span className={cn(
          "text-xs",
          userVote === 'up' ? "text-green-500" : "text-muted-foreground"
        )}>
          {upvotes}
        </span>
      </button>
      
      <button
        onClick={handleDownvote}
        className="flex items-center space-x-1 text-sm"
        aria-label="Downvote"
      >
        <ThumbsDown 
          className={cn(
            "h-4 w-4", 
            userVote === 'down' ? "text-red-500 fill-red-500" : "text-muted-foreground"
          )} 
        />
        <span className={cn(
          "text-xs",
          userVote === 'down' ? "text-red-500" : "text-muted-foreground"
        )}>
          {downvotes}
        </span>
      </button>
    </div>
  );
};

export default VoteButtons;
