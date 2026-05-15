import { useEffect, useState } from 'react'

const usePosts = (initial = []) => {
  const [posts, setPosts] = useState(initial)

  useEffect(() => {
    // placeholder: fetch posts here
  }, [])

  return { posts, setPosts }
}

export default usePosts
