import React, { useState } from 'react'
import { Input } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './CommonInput.css';

const CommonInput = ({ label, placeholder, type = "text", value = "", onChange, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const sharedStyle = {
    backgroundColor: 'transparent',
    border: '1.5px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    height: '48px',
    color: '#fff',
    fontSize: '15px',
  };

  return (
    <div className='w-full h-full flex flex-col gap-1.5 '>
      <div style={{
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '600',
        color: '#e0e0e0',
      }}>{label}</div>
      {type === 'password' ? (
        <div className='flex items-center gap-2'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className="custom-input"
            style={sharedStyle}
            value={value}
            onChange={onChange}
            autoComplete="off"
            {...props}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className='cursor-pointer text-white hover:text-gray-400 transition'
            style={{ fontSize: '18px' }}
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </div>
        </div>
      ) : (
        <Input 
          type={type}
          placeholder={placeholder}
          className="custom-input"
          style={sharedStyle}
          value={value}
          onChange={onChange}
          autoComplete="off"
          {...props}
        />
      )}
    </div>
  )
}

export default CommonInput;
