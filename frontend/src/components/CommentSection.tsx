import { useState } from "react";
import { Send, Reply, Heart, MessageCircle, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string, replyId?: string) => void;
  onReply: (commentId: string, content: string) => void;
}

const CommentSection = ({ comments, onAddComment, onLikeComment, onReply }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (newComment.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddComment(newComment);
        setNewComment("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    const content = replyInputs[commentId]?.trim();
    if (content && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onReply(commentId, content);
        setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderComment = (comment: Comment, isReply = false, parentCommentId?: string) => {
    // Safe guard against invalid comment objects
    if (!comment || typeof comment !== 'object') {
      console.error("Invalid comment object:", comment);
      return null;
    }
    
    // Ensure we have a valid comment object with string properties
    const safeComment = {
      ...comment,
      id: comment.id || `temp-${Math.random().toString(36).substring(7)}`,
      author: typeof comment.author === 'string' ? comment.author : 'Anonymous',
      content: typeof comment.content === 'string' ? comment.content : '',
      timestamp: typeof comment.timestamp === 'string' ? comment.timestamp : new Date().toLocaleString(),
      likes: typeof comment.likes === 'number' ? comment.likes : 0,
      isLiked: !!comment.isLiked,
      replies: Array.isArray(comment.replies) ? comment.replies : []
    };
    
    return (
      <div key={safeComment.id} className={`${isReply ? 'ml-8 md:ml-12' : ''} mb-4`}>
        <Card className={`${isReply ? 'bg-gray-50/50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'} shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 ${isReply ? 'border-l-gray-300 dark:border-l-gray-600' : 'border-l-green-500'}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} ring-2 ring-white shadow-sm`}>
                <AvatarImage src={safeComment.avatar || ""} />
                <AvatarFallback className={`${isReply ? 'text-xs' : 'text-sm'} font-semibold bg-gradient-to-br from-green-400 to-blue-500 text-white`}>
                  {safeComment.author && typeof safeComment.author === 'string' && safeComment.author.length > 0 
                    ? safeComment.author[0].toUpperCase() 
                    : 'A'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-semibold ${isReply ? 'text-sm' : 'text-base'} text-gray-900 dark:text-white`}>
                    {safeComment.author}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {safeComment.timestamp}
                  </span>
                </div>

                <div className={`${isReply ? 'text-sm' : 'text-base'} text-gray-700 dark:text-gray-300 leading-relaxed mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg`}>
                  {safeComment.content}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => isReply && parentCommentId ? onLikeComment(parentCommentId, safeComment.id) : onLikeComment(safeComment.id)}
                    className={`h-8 px-3 text-xs rounded-full transition-all duration-200 ${
                      safeComment.isLiked 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <Heart size={14} className={`mr-1 ${safeComment.isLiked ? 'fill-current' : ''}`} />
                    {safeComment.likes > 0 ? safeComment.likes : 'Like'}
                  </Button>

                  {!isReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyInputs(prev => ({ ...prev, [safeComment.id]: prev[safeComment.id] || "" }))}
                      className="h-8 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200"
                    >
                      <Reply size={14} className="mr-1" />
                      Reply
                    </Button>
                  )}
                </div>

                {/* Reply Form */}
                {replyInputs.hasOwnProperty(safeComment.id) && (
                  <Card className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 border border-blue-200 dark:border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Smile className="w-5 h-5 text-blue-500 mt-1" />
                        <Textarea
                          placeholder="Write a thoughtful reply..."
                          value={replyInputs[safeComment.id]}
                          onChange={e => setReplyInputs(prev => ({ ...prev, [safeComment.id]: e.target.value }))}
                          className="min-h-[80px] border-blue-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setReplyInputs(prev => {
                            const copy = { ...prev };
                            delete copy[safeComment.id];
                            return copy;
                          })}
                          className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleSubmitReply(safeComment.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          <Send size={14} className="mr-1" />
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Nested Replies */}
        {safeComment.replies && Array.isArray(safeComment.replies) && safeComment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {safeComment.replies.map(reply => renderComment(reply, true, safeComment.id))}
          </div>
        )}
      </div>
    );
  };

  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-3">
            {/* <MessageCircle className="w-6 h-6 text-white" /> */}
          </div>
          Discussion
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {safeComments.length} {safeComments.length === 1 ? 'comment' : 'comments'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Comment Input */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 border border-green-200 dark:border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="w-10 h-10 ring-2 ring-white dark:ring-gray-600 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 text-white font-semibold">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts and insights..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="min-h-[100px] border-green-200 dark:border-gray-600 focus:border-green-400 dark:focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Tip: Be constructive and respectful in your comments
              </p>
              <Button 
                onClick={handleSubmitComment} 
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} className="mr-2" />
                Post Comment
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Comments List */}
        <div className="space-y-4">
          {safeComments.length === 0 ? (
            <Card className="bg-gray-50 dark:bg-gray-700 border-dashed border-2 border-gray-200 dark:border-gray-600">
              <CardContent className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No comments yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Be the first to share your thoughts and start the discussion!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {safeComments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
