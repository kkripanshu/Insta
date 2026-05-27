import React, { useState, useEffect, useRef } from 'react';
import { MoreOutlined, HeartOutlined, CommentOutlined, SendOutlined, HeartFilled } from '@ant-design/icons';
import { likePost } from '../../features/posts/post.api';
import { getUserFromStorage } from '../../utils/authUtils';


const SinglePost = ({ post, playingVideoId, setPlayingVideoId }) => {
    const currentUser = getUserFromStorage();
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id) || false);
    const videoRef = useRef(null);

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
                    <div  className='w-10 h-10 gap-2 flex items-center justify-center'>
                        <CommentOutlined style={{
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }} />
                        <div style={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '500'
                        }}>{post.comments?.count || 0}</div>
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
    )
}

export default SinglePost