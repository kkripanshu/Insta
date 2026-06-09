import React, { useEffect, useState } from 'react'
import InstaIcon from '../../../assets/icons/InstaIcon.svg'
import NavigationBar from '../../feed/components/NavigationBar'
import SinglePost from '../../../components/common/SinglePost'
import { Input, Empty } from 'antd'
import { fetchFeed } from '../../posts/post.api'

const { Search: AntSearch } = Input

const Search = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await fetchFeed()
      if (res.ok) setPosts(res.posts || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = posts.filter((p) => {
    if (!query) return true
    const q = query.toLowerCase()
    const username = p.postedBy?.username || ''
    const caption = p.caption || ''
    return username.toLowerCase().includes(q) || caption.toLowerCase().includes(q)
  })

  return (
    <div className="w-full h-full overflow-auto bg-[#0c1014] flex flex-row p-4" style={{ scrollbarWidth: 'none' }}>
      <div className="flex flex-col py-2 w-auto">
        <div className="w-8 h-8 flex justify-center items-center">
          <img src={InstaIcon} alt="" />
        </div>
        <div className="flex flex-col gap-4 h-8 w-auto pt-10">
          <NavigationBar />
        </div>
      </div>

      <div className="flex-1 p-4 text-white">
        <div className="max-w-4xl mx-auto">
          <AntSearch
            placeholder="Search by username or caption"
            allowClear
            size="large"
            enterButton={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={(val) => setQuery(val)}
            style={{ marginBottom: 20 }}
          />

          {loading ? (
            <div className="text-white">Loading...</div>
          ) : filtered.length === 0 ? (
            <Empty description="No posts found" />
          ) : (
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
              {filtered.map((post) => (
                <div
                  key={post._id}
                  className="bg-black rounded-md overflow-hidden cursor-pointer hover:brightness-110"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.imageUrl.includes('/image/') ? (
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-64 object-cover" />
                  ) : (
                    <video src={post.imageUrl} muted loop className="w-full h-64 object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <SinglePost
          post={selectedPost}
          modalOnly
          isOpen={true}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  )
}

export default Search