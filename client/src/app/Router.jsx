import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from '../features/auth/Login';
import Signup from '../features/auth/Signup';
import Feed from '../features/feed/components/Feed';


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/feed' element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reels" element={<div>Reels</div>} />
        <Route path="/messages" element={<div>Messages</div>} />
        <Route path="/search" element={<div>Search</div>} />
        <Route path="/explore" element={<div>Explore</div>} />
        <Route path="/notifications" element={<div>Notifications</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;