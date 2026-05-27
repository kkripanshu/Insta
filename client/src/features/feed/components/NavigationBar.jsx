import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import InstaIcon from "../../../assets/icons/InstaIcon.svg";
import IC_Home from "../../../assets/icons/IC_Home.svg";
import IC_Reel from "../../../assets/icons/IC_Reel.svg";
import IC_Message from "../../../assets/icons/IC_Message.svg";
import IC_Search from "../../../assets/icons/IC_Search.svg";
import IC_Explore from "../../../assets/icons/IC_Explore.svg";
import IC_Notification from "../../../assets/icons/IC_Notification.svg";
import IC_Add from "../../../assets/icons/IC_Add.svg";
import IC_Profile from "../../../assets/icons/IC_Profile.svg";

import { usePostModal } from '../../../context/PostModalContext';

const NavigationBar = () => {

  const navigateTo = useNavigate();
  const location = useLocation();

  const { handleOpenModal } = usePostModal();

  const handleClick = (item) => {
    if (item.type === 'route') {
      navigateTo(item.Path);
    } else if (item.type === 'modal') {
      handleOpenModal();
    }
  };

  const navigationBar = [
    { id: 1, icon: IC_Home, label: 'Home', type: 'route', Path: '/feed' },
    { id: 2, icon: IC_Reel, label: 'Reels', type: 'route', Path: '/reels' },
    { id: 3, icon: IC_Message, label: 'Message', type: 'route', Path: '/messages' },
    { id: 4, icon: IC_Search, label: 'Search', type: 'route', Path: '/search' },
    { id: 5, icon: IC_Explore, label: 'Explore', type: 'route', Path: '/explore' },
    { id: 6, icon: IC_Notification, label: 'Notifications', type: 'route', Path: '/notifications' },
    { id: 7, icon: IC_Add, label: 'Add', type: 'modal' },
    { id: 8, icon: IC_Profile, label: 'Profile', type: 'route', Path: '/profile' }
  ];

  return (
    <>
      {navigationBar.map((item) => {

        const isActive = location.pathname === item.Path;

        return (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className={`group flex gap-4 items-center p-2 cursor-pointer rounded-lg transition duration-300

              ${isActive
                ? 'bg-[#20215f] text-white'
                : 'hover:bg-gray-500 text-white'
              }
            `}
          >

            <div className="w-8 h-8 flex justify-center items-center">
              <img src={item.icon} alt={item.label} />
            </div>

            <span
              className={`
                text-xl transition duration-300
                ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              `}
            >
              {item.label}
            </span>

          </div>
        );
      })}
    </>
  );
};

export default NavigationBar;