import React, { createContext, useContext, useState, useRef } from 'react';
import { createPost } from '../features/posts/post.api';

const PostModalContext = createContext();

export const usePostModal = () => {
  const context = useContext(PostModalContext);
  if (!context) {
    throw new Error('usePostModal must be used within PostModalProvider');
  }
  return context;
};

export const PostModalProvider = ({ children }) => {
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
    if (!caption.trim()) {
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

  const value = {
    openModal,
    selectedFile,
    previewUrl,
    caption,
    uploading,
    fileInputRef,
    handleOpenModal,
    handleImageUpload,
    handleFileChange,
    resetModal,
    handleSubmitPost,
    setCaption,
  };

  return (
    <PostModalContext.Provider value={value}>
      {children}
    </PostModalContext.Provider>
  );
};
