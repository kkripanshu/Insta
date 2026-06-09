import React, { useState, useEffect } from 'react'
import InstaIcon from '../../../assets/icons/InstaIcon.svg'
import NavigationBar from '../../feed/components/NavigationBar'
import ReelsPost from './ReelsPost'
import { fetchFeed } from '../../posts/post.api'
import '../Reels.css'

const Reels = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingVideoId, setPlayingVideoId] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetchFeed()
        console.log('Reels API Response:', response)
        if (response.ok) {
          // Filter to show only video posts (reels) - imageUrl that don't contain '/image/'
          const reels = response.posts?.filter(post => !post.imageUrl.includes('/image/')) || []
          console.log('Filtered Reels:', reels)
          setPosts(reels)
        }
      } catch (error) {
        console.error('Error fetching reels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="w-full h-screen flex flex-row bg-[#0c1014]" style={{ scrollbarWidth: 'none' }}>
      {/* Sidebar */}
      <div className="flex flex-col py-2 w-auto px-4 border-r border-[#15161d] sticky top-0 h-screen overflow-y-auto">
        <div className="w-8 h-8 flex justify-center items-center">
          <img src={InstaIcon} alt="Instagram" />
        </div>
        <div className="flex flex-col gap-4 w-auto pt-10">
          <NavigationBar />
        </div>
      </div>

      {/* Reels Container - Full Width Videos */}
      <div className="flex-1 flex items-center justify-center bg-[#0c1014] overflow-hidden">
        <div 
          className="w-full h-screen overflow-y-scroll flex flex-col items-center snap-mandatory snap-y"
          style={{ 
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {loading ? (
            <div className="w-full h-screen flex items-center justify-center text-white">
              <div className="text-center">
                <div className="loader mb-4"></div>
                <p>Loading reels...</p>
              </div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post._id} 
                className="w-full h-screen flex items-center justify-center snap-start shrink-0 scroll-smooth"
              >
                <ReelsPost 
                  post={post} 
                  playingVideoId={playingVideoId}
                  setPlayingVideoId={setPlayingVideoId}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-screen flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg">No reels available</p>
                <p className="text-sm mt-2">Create your first reel to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reels