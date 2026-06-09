import React, { useState, useEffect, useRef } from 'react';
import { MoreOutlined, HeartOutlined, CommentOutlined, SendOutlined, HeartFilled } from '@ant-design/icons';
import { likePost } from '../../features/posts/post.api';
import { getUserFromStorage } from '../../utils/authUtils';
import { Input, Modal } from 'antd';
import { commentPost } from '../../features/posts/post.api';


const SinglePost = ({ post, playingVideoId = null, setPlayingVideoId = () => {}, modalOnly = false, isOpen = false, onClose = () => {} }) => {

    const currentUser = getUserFromStorage();
    const [open, setOpen] = useState(false);
    const [inputComment, setInputComment] = useState('');
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id) || false);
    const [comments, setComments] = useState(post.comments || []);
    const [commentCount, setCommentCount] = useState(post.comments?.length || post.comments?.count || 0);
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
        if (modalOnly) {
            onClose();
        }
        setOpen(false);
        if (modalVideoRef.current) {
            modalVideoRef.current.pause();
        }
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
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
            modalVideoRef.current.play().catch(() => { });
        }
    }, [open]);

    useEffect(() => {
        if (modalOnly) {
            setOpen(isOpen);
        }
    }, [modalOnly, isOpen]);

    useEffect(() => {
        if (!videoRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current.play().catch(() => { });
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
            {!modalOnly && (
                <div className='w-auto h-auto px-2 py-2 flex flex-col gap-2 rounded-2xl border border-[#15161d]'>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2 items-center'>
                        <div className='w-10 h-10 flex items-center justify-center rounded-full'>
                            <img src={post?.postedBy?.profilePicture || ''} alt="Post" className='w-full h-full rounded-full object-cover' />
                        </div>
                        <span style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>@{post?.postedBy?.username}</span>
                    </div>
                    <div className='w-10 h-10 flex items-center justify-center'>
                        <MoreOutlined style={{
                            color: 'white',
                            fontSize: '20px',
                            cursor: 'pointer'
                        }} />
                    </div>
                </div>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white'
                }}>{post.caption}</div>
                <div className='w-auto  h-auto rounded-2xl flex mt-2 px-2 items-center justify-center'>
                    {
                        post.imageUrl.includes('/image/') ? (
                            <img
                                src={post.imageUrl}
                                alt="Post"
                                className="w-full h-full rounded-2xl object-cover"
                            />
                        ) : (
                            <video
                                ref={videoRef}
                                src={post.imageUrl}
                                controls
                                loop
                                onPlay={handleVideoPlay}
                                onPause={handleVideoPause}
                                className="w-full max-w-100 h-full rounded-2xl object-cover max-h-150"
                            />
                        )
                    }
                </div>
                <div className='flex flex-row items-start '>
                    <div className='w-auto gap-1 px-10 flex flex-row'>
                        <div onClick={handleLike} className='w-10 h-10 gap-2 flex items-center justify-center'>
                            {isLiked ? (
                                <HeartFilled style={{
                                    color: '#FF0000',
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }} />
                            ) : (
                                <HeartOutlined style={{
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }} />
                            )}
                            <div style={{
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: '500'
                            }}>{likesCount}</div>
                        </div>
                    </div>
                    <div className='w-auto gap-1 px-10 flex flex-row'>
                        <div onClick={() => {
                            setOpen(true);
                            if (videoRef.current) {
                                videoRef.current.pause();
                            }
                            setPlayingVideoId(null);
                        }} className='w-10 h-10 gap-2 flex items-center justify-center'>
                            <CommentOutlined style={{
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }} />
                            <div style={{
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: '500'
                            }}>{commentCount}</div>
                        </div>
                    </div>
                    <div className='w-auto  px-10 flex '>
                        <div className='w-10 h-10 gap-2 flex items-center justify-center'>
                            <SendOutlined style={{
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }} />
                        </div>
                    </div>
                </div>
            </div>
            )}
            <Modal
                className="custom-modal"
                open={open}
                onCancel={handleCancel}
                footer={null}
                centered
                closable={false}
                maskClosable={true}
                width='auto'
                styles={{
                    content: {
                        borderRadius: '24px',
                        overflow: 'hidden',
                        backgroundColor: '#40c4cc',
                    },
                    body: {
                        // height: '600px',
                        overflowY: 'hidden', 
                        backgroundColor: '#212328',
                        minWidth: '600px',
                        maxWidth: '60vw',
                        height: '95vh',
                        borderRadius: '10px',
                        overflow: 'hidden',
                    },
                }}
            >
                <div className='flex flex-row gap-0.5 items-center w-full h-full'>
                    <div className='w-1/2 h-full flex items-center justify-center'>
                        {post.imageUrl.includes('/image/') ? (
                            <img
                                src={post.imageUrl}
                                alt="Post"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                ref={modalVideoRef}
                                src={post.imageUrl}
                                controls
                                loop
                                onPlay={handleVideoPlay}
                                onPause={handleVideoPause}
                                className="w-full h-full object-cover "
                            />
                        )}
                    </div>
                    <div className='w-1/2 h-full px-4 py-4 flex flex-col min-w-0'>
                        <div className='flex flex-row gap-2 h-12 items-center shrink-0'>
                            <div className='w-10 h-10 flex justify-center items-center rounded-full overflow-hidden'>
                                <img
                                    src={post.postedBy.profilePicture}
                                    alt="Profile Picture"
                                    className='w-full h-full rounded-full object-cover'
                                />
                            </div>
                            <div className='min-w-0'>
                                <span className='text-white text-sm font-bold block'>
                                    @{post.postedBy.username}
                                </span>
                                <span className='text-gray-400 text-xs block truncate'>
                                    {post.postedBy?.firstName || post.postedBy?.lastName
                                        ? `${post.postedBy?.firstName || ''} ${post.postedBy?.lastName || ''}`.trim()
                                        : 'Bio not available'}
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col mt-2 overflow-hidden flex-1 min-h-0'>
                            <div className='mb-4 overflow-y-auto pr-2 text-sm text-white space-y-3 min-h-0' style={{
                                scrollbarWidth: 'none',
                            }}>
                                <div className='pb-3 border-b border-gray-700'>
                                    <p className='mt-2 text-xs text-gray-300'>{post.caption || 'No caption yet.'}</p>
                                </div>
                                <div className='pt-3 space-y-3'>
                                    {comments.length > 0 ? (
                                        comments.map((comment, index) => {
                                            const author = comment.postedBy?.username ? comment.postedBy : currentUser;
                                            return (
                                                <div key={`${comment._id || index}-${author?.username || 'unknown'}`} className='flex flex-row gap-3 items-start'>
                                                    <div className='w-8 h-8 rounded-full overflow-hidden shrink-0'>
                                                        <img
                                                            src={author?.profilePicture || post.postedBy.profilePicture}
                                                            alt={author?.username || 'User'}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <span className='text-white text-sm font-semibold'>
                                                            @{author?.username || 'user'}
                                                        </span>
                                                        <p className='text-gray-300 text-sm wrap-break-word'>{comment.text}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className='text-gray-400 text-sm'>No comments yet. Be the first to comment.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='h-16 shrink-0 flex flex-row gap-2 items-center border-t border-gray-700 pt-2'>
                            <Input
                                className='commentInput flex-1'
                                placeholder='Add a comment...'
                                variant='borderless'
                                colorText='white'
                                styles={{
                                    root: {
                                        backgroundColor: 'transparent',
                                        colorText: 'white'
                                    }
                                }}
                                value={inputComment}
                                onChange={(e) => setInputComment(e.target.value)}
                            />
                            <span onClick={handleAddComment} className='flex items-center justify-center cursor-pointer text-white px-3 py-2'>
                                Post
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}



export default SinglePost