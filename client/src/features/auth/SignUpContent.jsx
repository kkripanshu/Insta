import React, { useRef, useState } from 'react';
import IM_Logo from '../../assets/images/IM-Logo.png';
import { DatePicker, message } from 'antd';
import CommonInput from '../../components/common/CommonInput';
import VideoLoader from '../../components/common/VideoLoader';
import './SignUpContent.css';
import { useNavigate } from 'react-router-dom';
import { register } from './auth.service';

const SignUpContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const pendingRouteRef = useRef(null);
  const pendingMessageRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.mobileNumber.trim() && formData.mobileNumber.length !== 10) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(formData.password)) {
      newErrors.password = 'Password must be 6+ chars with upper, lower, number, special';
    }
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow digits for mobile number and limit to 10 digits
    if (name === 'mobileNumber') {
      const digitsOnly = value.replace(/[^\d]/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dateOfBirth: date }));
    if (errors.dateOfBirth) setErrors(prev => ({ ...prev, dateOfBirth: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setShowLoader(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
      });
      pendingRouteRef.current = '/login';
      pendingMessageRef.current = {
        type: 'success',
        text: 'Registration successful!',
      };
    } catch (error) {
      pendingMessageRef.current = {
        type: 'error',
        text: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLoaderComplete = () => {
    setShowLoader(false);
    if (pendingMessageRef.current) {
      const { type, text } = pendingMessageRef.current;
      if (type === 'success') message.success(text);
      if (type === 'error') message.error(text);
      pendingMessageRef.current = null;
    }
    if (pendingRouteRef.current) {
      navigate(pendingRouteRef.current);
      pendingRouteRef.current = null;
    }
  };

  return (
    <>
      {showLoader && (
        <VideoLoader
          isLoading={loading}
          onComplete={handleLoaderComplete}
        />
      )}
      <div className='w-full h-full flex flex-col py-2 px-10 items-center'>
      <div className='w-full h-20 flex flex-row justify-center items-center'>
        <img src={IM_Logo} alt='Logo' className='h-full w-auto object-contain' />
      </div>
      <div className='flex flex-col gap-4 h-auto w-full px-22'>
        <div className='flex flex-col gap-1 h-auto w-full'>
          <h1 className='gradient-text text-3xl font-bold'>Create Account</h1>
          <div className='text-gray-100 text-[1rem]'>Join the community, share your moments with others 💕🎶</div>
        </div>
        <div className='flex flex-col gap-2 w-full h-auto'>
          <div className='flex flex-row gap-6 w-[80%] h-auto'>
            <div className='w-1/2 flex flex-col'>
              <CommonInput label='First Name' placeholder='Enter First Name' name='firstName' value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <span className='text-red-500 text-sm mt-1'>{errors.firstName}</span>}
            </div>
            <div className='w-1/2 flex flex-col'>
              <CommonInput label='Last Name' placeholder='Enter Last Name' name='lastName' value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <span className='text-red-500 text-sm mt-1'>{errors.lastName}</span>}
            </div>
          </div>
          <div className='flex flex-row gap-6 w-[80%] h-auto'>
            <div className='w-1/2 flex flex-col'>
              <CommonInput label='Password' placeholder='Enter Password' type='password' name='password' value={formData.password} onChange={handleChange} />
              {errors.password && <span className='text-red-500 text-sm mt-1'>{errors.password}</span>}
            </div>
            <div className='w-1/2 flex flex-col'>
              <CommonInput label='Confirm Password' placeholder='Confirm Password' type='password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <span className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</span>}
            </div>
          </div>
          <div className='flex flex-row gap-6 w-[80%] h-auto'>
            <div className='w-1/2 flex flex-col'>
              <CommonInput label='Email' placeholder='Enter Email' name='email' value={formData.email} onChange={handleChange} />
              {errors.email && <span className='text-red-500 text-sm mt-1'>{errors.email}</span>}
            </div>
            <div className='w-1/2 flex flex-col'>
              <CommonInput label='Mobile Number' placeholder='Enter Mobile Number' name='mobileNumber' value={formData.mobileNumber} onChange={handleChange} />
              {errors.mobileNumber && <span className='text-red-500 text-sm mt-1'>{errors.mobileNumber}</span>}
            </div>
          </div>
          <div className='flex flex-row gap-6 w-[80%] h-auto'>
            <div className='w-1/2 flex flex-col'>
              <div className='text-[14px] font-semibold text-[#e0e0e0] mb-1.5'>Date of Birth</div>
              <DatePicker className='signup-date-picker' placeholder='Select date' value={formData.dateOfBirth} onChange={handleDateChange} />
              {errors.dateOfBirth && <span className='text-red-500 text-sm mt-1'>{errors.dateOfBirth}</span>}
            </div>
            <div className='w-1/2'></div>
          </div>
        </div>
      </div>
      <div className='flex px-22 mt-8 flex-row w-full h-auto justify-between items-center'>
        <div className='w-1/3 h-auto'>
          <button onClick={handleSubmit} disabled={loading} className='w-full h-12 rounded-2xl cursor-pointer flex items-center justify-center px-3 py-2' style={{ border: '2px solid #0432ff', background: 'linear-gradient(90deg, #0432ff 0%, #1e61ff 100%)', opacity: loading ? 0.6 : 1 }}>
            <div className='text-white font-semibold'>{loading ? 'Signing Up...' : 'Sign Up'}</div>
          </button>
        </div>
        <div className='text-gray-100'>Already have an account? <span onClick={() => navigate('/login')} className='text-blue-500 cursor-pointer hover:text-blue-400'>Login</span></div>
      </div>
    </div>
    </>
  );
};

export default SignUpContent;
