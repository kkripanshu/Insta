import React from 'react';
import SignUpContent from './SignUpContent';
const Signup = () => {
  return (
    <div className='py-2 px-60 h-full w-full bg-gray-200' style={{
      backgroundImage: `url("https://images.pexels.com/photos/17556547/pexels-photo-17556547.jpeg")`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}>


    <div className='w-full h-full rounded-4xl glass-card'>
        <SignUpContent />
    </div>


    </div>
  );
};

export default Signup;