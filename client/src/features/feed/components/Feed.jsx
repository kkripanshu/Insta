import React, { useEffect, useState } from "react";
import InstaIcon from "../../../assets/icons/InstaIcon.svg";
import NavigationBar from "./NavigationBar";
import '../../../styles/index.css';
import { getUserFromStorage } from "../../../utils/authUtils";
import IC_Video from "../../../assets/icons/IC_Video.svg";
import IC_Feeling from "../../../assets/icons/IC_Feeling.svg";
import IC_Image from "../../../assets/icons/IC_Image.svg";
import IC_Location from "../../../assets/icons/IC_Location.svg";
import { usePostModal } from "../../../context/PostModalContext";
import { fetchFeed, likePost } from '../../posts/post.api'
import SinglePost from "../../../components/common/SinglePost";




const Feed = () => {

  const [posts, setPosts] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const [user, setUser] = useState(null);
  const { handleOpenModal } = usePostModal();

  useEffect(() => {
    const userData = getUserFromStorage();

    const fetchPosts = async () => {
      const response = await fetchFeed();

      console.log(response, 'posts response');

      if (response.ok) {
        setPosts(response.posts);
      }
    };

    fetchPosts();

    console.log(userData, 'userData');

    setUser(userData);
  }, []);



  return (

    <div className="w-full h-full bg-[#0c1014] flex flex-row p-4" style={{
      scrollbarWidth: 'none',
      overflow: 'hidden'
    }}>
      <div className="flex flex-col py-2 w-auto">
        <div className="w-8 h-8 flex justify-center items-center">
          <img src={InstaIcon} alt="" />
        </div>
        <div className="flex flex-col gap-4 h-8 w-auto pt-10">
          <NavigationBar />
        </div>
      </div>
      <div className="w-[60%] overflow-hidden h-full flex flex-col gap-2 px-2">
        {/* <div onClick={handleOpenModal} className="w-2/3 cursor-pointer flex flex-col h-32 rounded-2xl bg-[#0b0e16] border border-[#15161d]">
          <div className="flex px-6 py-2 h-1/2 flex-row gap-8 border-b border-b-[#15161d]">
            <div className="h-11 w-11 flex items-center justify-center object-cover rounded-full">
              <img src={user?.profilePicture} alt="" style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                borderRadius: '100%'
              }} />
            </div>
            <div className="w-[calc(100%-44px)] flex items-center">
              <span style={{
                fontFamily: 'Albert Sans',
                fontSize: '16px',
                fontWeight: '500',
                color: '#60676e'
              }}>Create something amazing....</span>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center w-full h-full px-8 py-2">
            <div className="flex flex-col gap-1 items-center justify-center">
              <img src={IC_Image} alt="" style={{
                height: '28px',
                width: '28px'
              }}/>
              <span style={{
                fontFamily: 'Albert Sans',
                fontSize: '16px',
                fontWeight: '500',
                color: '#fff'
              }}>Image</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <img src={IC_Video} alt="" style={{
                height: '28px',
                width: '28px'
              }}/>
              <span style={{
                fontFamily: 'Albert Sans',
                fontSize: '16px',
                fontWeight: '500',
                color: '#fff'
              }}>Video</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <img src={IC_Feeling} alt="" style={{
                height: '28px',
                width: '28px'
              }}/>
              <span style={{
                fontFamily: 'Albert Sans',
                fontSize: '16px',
                fontWeight: '500',
                color: '#fff'
              }}>Feeling</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <img src={IC_Location} alt="" style={{
                height: '28px',
                width: '28px'
              }}/>
              <span style={{
                fontFamily: 'Albert Sans',
                fontSize: '16px',
                fontWeight: '500',
                color: '#fff'
              }}>Location</span>
            </div>
          </div>
        </div> */}
        <div className="w-full flex flex-col h-full overflow-scroll border-2 rounded-2xl border-[#15161d]" style={{
          scrollbarWidth: 'none'
        }}>
          {posts.map((post) => (
            <SinglePost
              key={post._id}
              post={post}
              playingVideoId={playingVideoId}
              setPlayingVideoId={setPlayingVideoId}
            />
          ))}
        </div>
      </div>
      <div className="w-[40%] h-full px-2 overflow-hidden"></div>
    </div>
  );
};

export default Feed;
