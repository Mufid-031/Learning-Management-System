import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Discussion, Reply, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  MessageCircleIcon,
  PencilIcon,
  SaveIcon,
  ThumbsUpIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';
import UserAvatar from './forum-user-avatar';
import InputError from './input-error';
import BlockNoteMarkdownEditor from './markdown-editor-blocknote';
import LessonMarkdownDisplay from './markdown-viewer';
import { Label } from './ui/label';

interface DiscussionDetailProps {
  discussion: Discussion;
  currentUser: User;
}

export default function DiscussionDetail({
  discussion,
  currentUser,
}: DiscussionDetailProps) {
  const [hasError] = useState(false);

  console.log(discussion);

  // State for editing discussion
  const [isEditingDiscussion, setIsEditingDiscussion] = useState(false);
  const {
    data: discussionEditData,
    setData: setDiscussionEditData,
    put: putDiscussionContent,
    processing: processingDiscussionEdit,
    reset: resetDiscussionEditForm,
    errors: discussionEditErrors,
  } = useForm({
    content: discussion?.content || '',
  });

  const { delete: destroyDiscussion } = useForm();

  // State for editing a specific reply
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const {
    data: replyEditData,
    setData: setReplyEditData,
    put: putReplyContent,
    processing: processingReplyEdit,
    reset: resetReplyEditForm,
    errors: replyEditErrors,
  } = useForm({
    content: '',
  });

  const { delete: destroyReply } = useForm();

  const { data, setData, post, processing, reset, errors } = useForm({
    content: '',
    discussion_thread_id: discussion?.id,
  });

  const {
    data: resolvedData,
    setData: setResolvedData,
    put: putResolved,
  } = useForm({
    resolved: discussion?.resolved,
  });

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussion) return;
    post(route('replies.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset('content');
      },
      onError: (e) => console.log(e),
    });
  };

  const handleToggleResolved = () => {
    if (!discussion) return;
    setResolvedData('resolved', !resolvedData.resolved);
    // Assuming 'discussions.update' handles the 'resolved' status.
    // If you have a separate route for just resolved, use that.
    putResolved(route('discussions.update', discussion.id), {
      preserveScroll: true,
      onError: (e) => console.log(e),
    });
  };

  const handleLikeDiscussion = () => {
    if (!discussion) return;
    post(route('discussions.like', discussion.id), {
      preserveScroll: true,
      onError: (e) => console.log(e),
    });
  };

  const handleLikeReply = (replyId: number) => {
    post(route('replies.like', replyId), {
      preserveScroll: true,
      onError: (e) => console.log(e),
    });
  };

  // --- Discussion Edit Handlers ---
  const handleEditDiscussion = () => {
    if (!discussion) return;
    setDiscussionEditData('content', discussion.content);
    setIsEditingDiscussion(true);
  };

  const handleCancelEditDiscussion = () => {
    setIsEditingDiscussion(false);
    resetDiscussionEditForm('content');
  };

  const handleSubmitDiscussionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussion) return;
    // Assuming you have a route like 'discussions.content.update' for updating content
    putDiscussionContent(route('discussions.content.update', discussion.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditingDiscussion(false);
      },
      onError: (err) => console.error('Error updating discussion:', err),
    });
  };

  const handleDeleteDiscussion = () => {
    if (!discussion) return;
    destroyDiscussion(route('discussions.destroy', discussion.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditingDiscussion(false);
      },
      onError: (err) => console.error('Error deleting discussion:', err),
    });
  };

  // --- Reply Edit Handlers ---
  const handleEditReply = (reply: Reply) => {
    setEditingReplyId(reply.id);
    setReplyEditData('content', reply.content);
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    resetReplyEditForm('content');
  };

  const handleSubmitReplyUpdate = (e: React.FormEvent, replyId: number) => {
    e.preventDefault();
    // Assuming you have a route like 'replies.content.update' for updating content
    putReplyContent(route('replies.update', replyId), {
      preserveScroll: true,
      onSuccess: () => {
        setEditingReplyId(null);
      },
      onError: (err) => console.error('Error updating reply:', err),
    });
  };

  const handleDeleteReply = (replyId: number) => {
    destroyReply(route('replies.destroy', replyId), {
      preserveScroll: true,
      onSuccess: () => {
        setEditingReplyId(null);
      },
      onError: (err) => console.error('Error deleting reply:', err),
    });
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/10">
        <AlertCircleIcon className="h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold">Error Loading Discussion</h3>
        <p className="text-muted-foreground mt-2 mb-4 text-sm">
          There was a problem loading this discussion. Please try again later.
        </p>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Loading discussion...</p>
      </div>
    );
  }

  const canEditDiscussion =
    currentUser.id === discussion.user.id || currentUser.role === 'admin';

  return (
    <div className="rounded-lg border">
      <div className="p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar user={discussion.user} />
            <div>
              <div className="font-medium">{discussion.user.name}</div>
              <div className="text-muted-foreground text-xs">
                Posted{' '}
                {formatDistanceToNow(new Date(discussion.created_at), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
          <Badge variant={getCategoryVariant(discussion.category)}>
            {getCategoryLabel(discussion.category)}
          </Badge>
        </div>

        <h1 className="mb-4 text-xl font-bold sm:text-2xl">
          {discussion.title}
        </h1>

        {isEditingDiscussion ? (
          <form onSubmit={handleSubmitDiscussionUpdate} className="space-y-4">
            <BlockNoteMarkdownEditor
              initialValue={discussionEditData.content}
              onChange={(value) => setDiscussionEditData('content', value)}
              editable={true}
            />
            <InputError message={discussionEditErrors.content} />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={processingDiscussionEdit}
              >
                <SaveIcon className="mr-2 h-4 w-4" />
                {processingDiscussionEdit ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEditDiscussion}
                disabled={processingDiscussionEdit}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <LessonMarkdownDisplay content={discussion.content} />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleLikeDiscussion}
          >
            <ThumbsUpIcon className="h-4 w-4" />
            Helpful ({discussion.likes})
          </Button>

          {canEditDiscussion && !isEditingDiscussion && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleEditDiscussion}
            >
              <PencilIcon className="h-4 w-4" />
              Edit Discussion
            </Button>
          )}

          {canEditDiscussion && !isEditingDiscussion && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleDeleteDiscussion}
            >
              <Trash2Icon className="h-4 w-4" />
              Delete Discussion
            </Button>
          )}

          {(currentUser.id === discussion.user.id ||
            currentUser.role === 'admin') && (
            <Button
              variant={discussion.resolved ? 'outline' : 'default'}
              size="sm"
              className={cn(
                'gap-1',
                discussion.resolved && 'border-green-500 text-green-500',
              )}
              onClick={handleToggleResolved}
            >
              <CheckCircle2Icon className="h-4 w-4" />
              {discussion.resolved ? 'Resolved' : 'Mark as Resolved'}
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="p-4 md:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <MessageCircleIcon className="h-5 w-5" />
          Replies ({discussion.replies?.length || 0})
        </h2>

        {discussion.replies && discussion.replies.length > 0 ? (
          <div className="space-y-6">
            {discussion.replies.map((reply) => {
              const isEditingThisReply = editingReplyId === reply.id;
              const canEditReply =
                currentUser.id === reply.user.id ||
                currentUser.role === 'admin';

              return (
                <div key={reply.id} className="bg-muted/40 rounded-lg p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={reply.user} size="sm" />
                      <div>
                        <div className="font-medium">{reply.user.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(reply.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    {canEditReply && !isEditingThisReply && (
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReply(reply)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReply(reply.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditingThisReply ? (
                    <form
                      onSubmit={(e) => handleSubmitReplyUpdate(e, reply.id)}
                      className="mt-2 space-y-3"
                    >
                      <BlockNoteMarkdownEditor
                        initialValue={replyEditData.content}
                        onChange={(value) => setReplyEditData('content', value)}
                        editable={true}
                      />
                      <InputError message={replyEditErrors.content} />
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          size="sm"
                          disabled={processingReplyEdit}
                        >
                          <SaveIcon className="mr-1 h-3.5 w-3.5" />
                          {processingReplyEdit ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEditReply}
                          disabled={processingReplyEdit}
                        >
                          <XIcon className="mr-1 h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="mt-2 text-sm">
                      <LessonMarkdownDisplay content={reply.content} />
                    </div>
                  )}

                  {!isEditingThisReply && (
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => handleLikeReply(reply.id)}
                      >
                        <ThumbsUpIcon className="h-3.5 w-3.5" />
                        Helpful ({reply.likes})
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              No replies yet. Be the first to reply!
            </p>
          </div>
        )}

        {/* Form for new reply */}
        <form onSubmit={handleSubmitReply} className="mt-6">
          <div className="grid space-y-2">
            <Label htmlFor="content">Your Reply</Label>
            <BlockNoteMarkdownEditor
              value={data.content}
              onChange={(value) => setData('content', value)}
              editable={true}
            />
            <InputError message={errors.content} />
          </div>
          <Button
            type="submit"
            disabled={!data.content.trim() || processing}
            className="mt-4"
          >
            {processing ? 'Posting...' : 'Post Reply'}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Helper functions (assumed to be correct from original code)
function getCategoryLabel(category: string): string {
  switch (category) {
    case 'general':
      return 'General';
    case 'question':
      return 'Question';
    case 'resource':
      return 'Resource';
    default:
      return category;
  }
}

function getCategoryVariant(
  category: string,
): 'default' | 'secondary' | 'outline' {
  switch (category) {
    case 'general':
      return 'default';
    case 'question':
      return 'secondary';
    case 'resource':
      return 'outline';
    default:
      return 'default';
  }
}
