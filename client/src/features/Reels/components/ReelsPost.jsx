import React, { useState, useEffect, useRef } from 'react';
import { HeartOutlined, CommentOutlined, SendOutlined, HeartFilled, MoreOutlined } from '@ant-design/icons';
import { likePost, commentPost } from '../../posts/post.api';
import { getUserFromStorage } from '../../../utils/authUtils';
import { Input, Modal } from 'antd';
import '../Reels.css';

const ReelsPost = ({ post, playingVideoId, setPlayingVideoId }) => {
  const currentUser = getUserFromStorage();
  const [open, setOpen] = useState(false);
  const [inputComment, setInputComment] = useState('');
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id) || false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);

  const handleLike = async () => {
    const result = await likePost(post._id);
    if (result.ok) {
      if (isLiked) {
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
    }
  };

  const handleAddComment = async () => {
    const trimmedComment = inputComment.trim();
    if (!trimmedComment) return;

    const result = await commentPost(post._id, trimmedComment);
    if (result.ok) {
      const newComment = result.data?.comment || {
        text: trimmedComment,
        postedBy: currentUser,
      };
      setComments(prev => [...prev, newComment]);
      setCommentCount(prev => prev + 1);
      setInputComment('');
    }
  };

  const handleCancel = () => {
    setOpen(false);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoPlay = () => {
    setPlayingVideoId(post._id);
  };

  const handleVideoPause = () => {
    setPlayingVideoId(null);
  };

  useEffect(() => {
    if (playingVideoId && playingVideoId !== post._id && videoRef.current) {
      videoRef.current.pause();
    }
  }, [playingVideoId, post._id]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (open && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
            setPlayingVideoId(post._id);
          } else {
            videoRef.current.pause();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );
    observer.observe(videoRef.current);
    return () => {
      observer.disconnect();
    };
  }, [post._id, setPlayingVideoId]);

  return (
    <>
      {/* Main Reel Container - Centered three-column layout (left: user/caption, center: video, right: actions) */}
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="reel-centered-container flex items-start justify-center px-8" style={{ width: '100%', maxWidth: '1100px' }}>
          {/* Left - User + Caption */}
          <div className="reel-left text-white" style={{ width: '260px', paddingRight: '16px' }}>
            <div className="flex flex-row gap-3 items-center mb-4">
              <div className="reel-user-avatar overflow-hidden">
                <img
                  src={post?.postedBy?.profilePicture || ''}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">@{post?.postedBy?.username}</div>
                <button className="follow-btn" style={{ marginTop: '8px' }}>
                  Follow
                </button>
              </div>
            </div>
            {post.caption && (
              <p className="reel-caption" style={{ marginTop: '8px' }}>{post.caption}</p>
            )}
          </div>

          {/* Center - Video */}
          <div className="reel-center flex items-center justify-center" style={{ flex: '0 0 560px', maxWidth: '100%', padding: '0 12px' }}>
            {post.imageUrl.includes('/image/') ? (
              <img
                src={post.imageUrl}
                alt="Reel"
                className="reel-media"
              />
            ) : (
              <video
                ref={videoRef}
                src={post.imageUrl}
                loop
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                className="reel-media"
              />
            )}
          </div>

          {/* Right - Action Buttons */}
          <div className="reel-right flex flex-col items-center" style={{ width: '120px', paddingLeft: '16px' }}>
            <div
              onClick={handleLike}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              {isLiked ? (
                <HeartFilled className="text-2xl text-red-500 group-hover:scale-125 transition-transform" />
              ) : (
                <HeartOutlined className="text-2xl text-white group-hover:scale-125 transition-transform" />
              )}
              <span className="text-white text-xs font-medium">{likesCount}</span>
            </div>

            <div
              onClick={() => {
                setOpen(true);
                if (videoRef.current) {
                  videoRef.current.pause();
                }
                setPlayingVideoId(null);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer group mt-4"
            >
              <CommentOutlined className="text-2xl text-white group-hover:scale-125 transition-transform" />
              <span className="text-white text-xs font-medium">{commentCount}</span>
            </div>

            <div className="flex flex-col items-center gap-1 cursor-pointer group mt-4">
              <SendOutlined className="text-2xl text-white group-hover:scale-125 transition-transform" />
            </div>

            <div className="flex flex-col items-center gap-1 cursor-pointer group mt-4">
              <MoreOutlined className="text-2xl text-white group-hover:scale-125 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <Modal
        className="reels-comment-modal-container"
        open={open}
        onCancel={handleCancel}
        footer={null}
        centered
        closable={false}
        maskClosable={true}
        width="auto"
        styles={{
          content: {
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#212328',
            padding: '0px',
            margin: '0px',
          },
          body: {
            height: '600px',
            overflowY: 'auto',
            backgroundColor: '#212328',
            minWidth: '600px',
            maxWidth: '60vw',
            padding: '0px !important',
            margin: '0px !important',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <div className="flex flex-row gap-0 items-center w-full h-full">
          {/* Video Side */}
          <div className="w-1/2 h-full flex items-center justify-center bg-black">
            {post.imageUrl.includes('/image/') ? (
              <img
                src={post.imageUrl}
                alt="Reel"
                className="reel-modal-media"
              />
            ) : (
              <video
                ref={modalVideoRef}
                src={post.imageUrl}
                loop
                className="reel-modal-media"
              />
            )}
          </div>

          {/* Comments Side */}
          <div className="w-1/2 h-full px-4 py-4 flex flex-col min-w-0 bg-[#212328]">
            {/* Header */}
            <div className="flex flex-row gap-2 h-12 items-center shrink-0 mb-3 pb-3 border-b border-gray-700">
              <div className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden">
                <img
                  src={post.postedBy.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-white text-sm font-bold block">@{post.postedBy.username}</span>
                <span className="text-gray-400 text-xs block truncate">
                  {post.postedBy?.firstName || post.postedBy?.lastName
                    ? `${post.postedBy?.firstName || ''} ${post.postedBy?.lastName || ''}`.trim()
                    : 'Bio not available'}
                </span>
              </div>
            </div>

            {/* Caption */}
            {post.caption && (
              <div className="mb-4 pb-3 border-b border-gray-700">
                <p className="text-white text-sm">{post.caption}</p>
              </div>
            )}

            {/* Comments List */}
            <div className="flex flex-col mt-2 overflow-hidden flex-1 min-h-0">
              <div
                className="overflow-y-auto pr-2 text-sm text-white space-y-3 min-h-0"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4a4a4a transparent',
                }}
              >
                {comments.length > 0 ? (
                  comments.map((comment, index) => {
                    const author = comment.postedBy?.username ? comment.postedBy : currentUser;
                    return (
                      <div
                        key={`${comment._id || index}-${author?.username || 'unknown'}`}
                        className="flex flex-row gap-2 items-start"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <img
                            src={author?.profilePicture || post.postedBy.profilePicture}
                            alt={author?.username || 'User'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white text-sm font-semibold">@{author?.username || 'user'}</span>
                          <p className="text-gray-300 text-xs mt-1 whitespace-normal">{comment.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400 text-sm">No comments yet. Be the first to comment.</div>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="h-14 shrink-0 flex flex-row gap-2 items-center border-t border-gray-700 pt-3 mt-3">
              <Input
                className="commentInput flex-1"
                placeholder="Add a comment..."
                variant="borderless"
                size="small"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    padding: '4px 0',
                  },
                }}
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
                onPressEnter={handleAddComment}
              />
              <button
                onClick={handleAddComment}
                disabled={!inputComment.trim()}
                className="text-blue-500 hover:text-blue-400 disabled:text-gray-600 px-3 py-2 text-sm font-semibold cursor-pointer transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReelsPost;
