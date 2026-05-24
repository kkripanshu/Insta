import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from '../features/auth/Login';
import Signup from '../features/auth/Signup';
import Feed from '../features/feed/components/Feed';
import Reels from '../features/Reels/components/Reels';
import Messages from '../features/Messages/components/Messages';
import Search from '../features/Search/components/Search';
import Explore from '../features/Explore/components/Explore';
import Notifications from '../features/Notifications/components/Notifications';
import Profile from '../features/Profile/components/Profile';
import { PostModalProvider } from '../context/PostModalContext';
import PostModal from '../components/common/PostModal';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Router = () => {
  return (
    <BrowserRouter>
      <PostModalProvider>
        <Routes>
          <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <PostModal />
      </PostModalProvider>
    </BrowserRouter>
  )
}

export default Router;