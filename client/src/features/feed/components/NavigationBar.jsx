import React from 'react';
import { useNavigate } from 'react-router';

const NavigationBar = ({ navigate, onOpenModal }) => {
  const navigateTo = useNavigate();

  const handleClick = () => {
    if (navigate.type === 'route') {
      navigateTo(navigate.Path);
    } else if (navigate.type === 'modal') {
        onOpenModal();
    }
  };

  return (
    <div className="flex gap-4 items-center p-2 cursor-pointer group hover:bg-gray-500 rounded-lg transition duration-300" onClick={handleClick}>
      
      <div className="w-8 h-8 flex justify-center items-center">
        <img src={navigate.icon} alt={navigate.label} />
      </div>

      <span className="opacity-0 group-hover:opacity-100 text-white text-xl transition duration-300">
        {navigate.label}
      </span>

    </div>
  );
};

export default NavigationBar