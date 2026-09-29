import { useState } from "react";
import "./comment-section.css";

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

const initial = (name: string) => (name.trim().charAt(0) || "A").toUpperCase();

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
        setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closeReply = (id: string) =>
    setReplyInputs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

  const renderComment = (comment: Comment, isReply = false, parentCommentId?: string) => {
    if (!comment || typeof comment !== "object") return null;
    const c = {
      ...comment,
      id: comment.id || `temp-${Math.random().toString(36).substring(7)}`,
      author: typeof comment.author === "string" && comment.author ? comment.author : "Anonymous",
      content: typeof comment.content === "string" ? comment.content : "",
      timestamp: typeof comment.timestamp === "string" ? comment.timestamp : "",
      likes: typeof comment.likes === "number" ? comment.likes : 0,
      isLiked: !!comment.isLiked,
      replies: Array.isArray(comment.replies) ? comment.replies : [],
    };

    return (
      <li key={c.id} className={`cs-item${isReply ? " is-reply" : ""}`}>
        <div className="cs-avatar" aria-hidden="true">
          {c.avatar ? <img src={c.avatar} alt="" /> : initial(c.author)}
        </div>
        <div className="cs-body">
          <div className="cs-head">
            <b>{c.author}</b>
            {c.timestamp && <span>{c.timestamp}</span>}
          </div>
          <p className="cs-text">{c.content}</p>
          <div className="cs-actions">
            <button
              type="button"
              className={c.isLiked ? "is-on" : ""}
              aria-pressed={c.isLiked}
              onClick={() => (isReply && parentCommentId ? onLikeComment(parentCommentId, c.id) : onLikeComment(c.id))}
            >
              {c.isLiked ? "♥" : "♡"} {c.likes > 0 ? c.likes : "Like"}
            </button>
            {!isReply && (
              <button type="button" onClick={() => setReplyInputs((prev) => ({ ...prev, [c.id]: prev[c.id] || "" }))}>
                Reply
              </button>
            )}
          </div>

          {Object.prototype.hasOwnProperty.call(replyInputs, c.id) && (
            <div className="cs-compose is-reply">
              <textarea
                placeholder={`Reply to ${c.author}`}
                value={replyInputs[c.id]}
                onChange={(e) => setReplyInputs((prev) => ({ ...prev, [c.id]: e.target.value }))}
                aria-label={`Reply to ${c.author}`}
              />
              <div className="cs-compose-foot">
                <button type="button" className="cs-quiet" onClick={() => closeReply(c.id)}>Cancel</button>
                <button type="button" className="cs-send" onClick={() => handleSubmitReply(c.id)} disabled={!replyInputs[c.id]?.trim()}>
                  Reply ↗
                </button>
              </div>
            </div>
          )}

          {c.replies.length > 0 && <ul className="cs-list">{c.replies.map((reply) => renderComment(reply, true, c.id))}</ul>}
        </div>
      </li>
    );
  };

  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="cs">
      <div className="cs-compose">
        <textarea
          placeholder="Add to the discussion: evidence, a question, a counterpoint."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          aria-label="Add a comment"
        />
        <div className="cs-compose-foot">
          <span>Be specific and kind.</span>
          <button type="button" className="cs-send" onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
            Post comment ↗
          </button>
        </div>
      </div>

      {safeComments.length === 0 ? (
        <p className="cs-empty">No comments yet. Start the discussion.</p>
      ) : (
        <ul className="cs-list">{safeComments.map((comment) => renderComment(comment))}</ul>
      )}
    </div>
  );
};

export default CommentSection;
