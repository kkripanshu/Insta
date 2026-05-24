import React from 'react';
import { Modal } from 'antd';
import IC_Uplod_Modal from '../../assets/icons/IC_Upload_Modal.png';
import Button from './Button';
import { usePostModal } from '../../context/PostModalContext';

const PostModal = () => {
  const {
    openModal,
    selectedFile,
    previewUrl,
    caption,
    uploading,
    fileInputRef,
    handleImageUpload,
    handleFileChange,
    resetModal,
    handleSubmitPost,
    setCaption,
  } = usePostModal();

  return (
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
      <div className="flex h-125 flex-col">
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
  );
};

export default PostModal;
