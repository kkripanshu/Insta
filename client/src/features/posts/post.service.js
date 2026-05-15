import { createPost, fetchFeed } from './post.api'

export const submitPost = async (payload) => createPost(payload)

export const getFeed = async () => fetchFeed()
