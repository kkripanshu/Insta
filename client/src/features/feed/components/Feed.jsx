import React, { useState, useRef } from "react";
import InstaIcon from "../../../assets/icons/InstaIcon.svg";
import IC_Home from "../../../assets/icons/IC_Home.svg";
import IC_Reel from "../../../assets/icons/IC_Reel.svg";
import IC_Message from "../../../assets/icons/IC_Message.svg";
import IC_Search from "../../../assets/icons/IC_Search.svg";
import IC_Explore from "../../../assets/icons/IC_Explore.svg";
import IC_Notification from "../../../assets/icons/IC_Notification.svg";
import IC_Add from "../../../assets/icons/IC_Add.svg";
import IC_Profile from "../../../assets/icons/IC_Profile.svg";
import NavigationBar from "./NavigationBar";
import '../../../styles/index.css';
import { Modal } from "antd";
import IC_Uplod_Modal from "../../../assets/icons/IC_Upload_Modal.png";
import Button from "../../../components/common/Button";
import { createPost } from '../../posts/post.api';

const navigationBar = [
  { id: 1, icon: IC_Home, label: 'Home', type: 'route', Path: '/feed' },
  { id: 2,  icon: IC_Reel, label: 'Reels', type: 'route', Path: '/reels' },
  { id: 3, icon: IC_Message, label: 'Message', type: 'route', Path: '/messages' },
  { id: 4, icon: IC_Search, label: 'Search', type: 'route', Path: '/search' },
  { id: 5, icon: IC_Explore, label: 'Explore', type: 'route', Path: '/explore' },
  { id: 6, icon: IC_Notification, label: 'Notifications', type: 'route', Path: '/notifications' },
  { id: 7, icon: IC_Add, label: 'Add', type: 'modal' },
  { id: 8, icon: IC_Profile, label: 'Profile', type: 'route', Path: '/profile' }
]

const Feed = () => {

  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCaption('');
    setUploading(false);
    setOpenModal(false);
  };

  const handleSubmitPost = async () => {
    if (!selectedFile) {
      alert('Please select an image or video');
      return;
    }
    if(!caption.trim()) {
      alert('Please enter a caption');
      return;
    }

    setUploading(true);

    try {
      const result = await createPost({ media: selectedFile, caption });

      if (!result.ok) {
        alert(result.message || 'Upload failed');
        return;
      }

      alert('Post created successfully');
      resetModal();
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-scroll bg-[#0c1014] flex flex-row p-4" style={{
      scrollbarWidth: 'none'
    }}>
      <div className="flex flex-col gap-4 py-2 w-auto">
        <div className="w-8 h-8 flex justify-center items-center">
          <img src={InstaIcon} alt="" />
        </div>
        <div className="flex flex-col gap-8 h-8 w-auto pt-10">
          {navigationBar.map((navigate, index) => (
            <NavigationBar  key={index} navigate={navigate} onOpenModal={handleOpenModal} />
          ))}
        </div>
      </div>
      <div></div>
      <div></div>

      <Modal 
        wrapClassName="createModal"
        className="createModal"
        open={openModal}
        onCancel={resetModal}
        maskClosable={true}
        closeIcon={false}
        footer={null}
        style={{
          borderRadius: '24px'
        }}
      >
        <div className="flex h-125 flex-col ">
          <div className="bg-[#0d1114] border-b-2 border-amber-100 w-full h-16 flex items-center overflow-hidden justify-center rounded-t-3xl">
            <span className="text-white text-lg font-semibold">Create New Post</span>
          </div>
          <div className="bg-[#202228] flex flex-col gap-3 items-center justify-center h-[calc(100%-64px)] rounded-b-3xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div className="flex flex-col gap-4 items-center w-full px-6">
                {selectedFile?.type.startsWith('video/') ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-24 rounded-xl"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-24 rounded-xl"
                  />
                )}
                <div className="flex flex-row gap-2 items-center w-full max-w-full">
                  <span className="truncate text-white" style={{
                    fontSize: '24px',
                    color: '#fcfcfc',
                    fontFamily: "Albert Sans, sans-serif",
                    fontWeight: '500',
                    lineHeight: '32px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block',
                    maxWidth: 'calc(100% - 2.5rem)'
                  }}>{selectedFile.name}</span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full rounded-xl p-3 bg-[#121619] text-white border border-[#2f343a] outline-none"
                  rows={3}
                  style={{
                    resize: 'none'
                  }}
                />
                <div className="flex gap-3 h-10 w-full">
                  <div className="w-1/3 h-full">
                    <Button
                    size="default"
                    label={uploading ? 'Posting...' : 'Post'}
                    disabled={uploading}
                    onClick={handleSubmitPost}
                  />
                  </div>
                  <div className="w-2/3 h-full">
                    <Button
                      label="Choose another file"
                      onClick={handleImageUpload}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 flex justify-center items-center">
                  <img src={IC_Uplod_Modal} alt="" />
                </div>
                <span className="text-white text-xl">Drag photos and videos here</span>
                <div className="w-1/2 h-10 flex justify-center items-center mt-4" onClick={handleImageUpload}>
                  <Button label="Select from computer" />
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Feed;
