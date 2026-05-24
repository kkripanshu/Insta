import React, { useEffect, useState } from 'react'
import InstaIcon from '../../../assets/icons/InstaIcon.svg'
import NavigationBar from '../../feed/components/NavigationBar'
import { getUserFromStorage, updateUserInStorage } from '../../../utils/authUtils'
import Button from '../../../components/common/Button'
import EditableField from '../../../components/common/EditableField'
import EditIcon from '../../../assets/icons/IC_Edit.svg'
import { updateProfile } from '../../user/user.api'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState({})
  const [originalData, setOriginalData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = getUserFromStorage();
    console.log('userData', userData);
    setUser(userData)
    setFormData(userData || {})
    setOriginalData(userData || {})
  }, [])

  if (!user) {
    return null
  }

  const displayName = `${formData.firstName || user.firstName} ${formData.lastName || user.lastName}`
  
  // Handle profile picture preview
  const getProfileImage = () => {
    if (formData.profilePicture instanceof File) {
      return URL.createObjectURL(formData.profilePicture)
    }
    return formData.profilePicture || user.profilePicture || 'https://avatars.githubusercontent.com/u/105380863?v=4'
  }
  
  const profileImage = getProfileImage()
  const formattedDob = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : (user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '')

  const handleEditClick = (fieldName) => {
    setEditingField(fieldName)
    setErrors({})
  }

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    setErrors(prev => ({ ...prev, [fieldName]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth)
      if (dob >= new Date()) {
        newErrors.dateOfBirth = 'Date of birth must be in the past'
      }
    }
    if (formData.mobileNumber && !/^\+?[\d\s-]{10,}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number format'
    }
    if (formData.profilePicture && !(formData.profilePicture instanceof File) && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.profilePicture)) {
      newErrors.profilePicture = 'Invalid URL format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const result = await updateProfile(formData)
      if (result.ok) {
        updateUserInStorage(result.user)
        setUser(result.user)
        setOriginalData(result.user)
        setFormData(result.user)
        setEditingField(null)
        message.success('Profile updated successfully!')
      } else {
        message.error(result.message || 'Failed to update profile')
      }
    } catch (error) {
      message.error('Error updating profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDiscardChanges = () => {
    setFormData(originalData)
    setEditingField(null)
    setErrors({})
  }

  return (
    <div className="w-full h-full overflow-scroll bg-[#0c1014] flex flex-row gap-2 p-4" style={{ scrollbarWidth: 'none' }}>
      <div className="flex flex-col py-2 w-auto">
        <div className="w-8 h-8 flex justify-center items-center">
          <img src={InstaIcon} alt="" />
        </div>
        <div className="flex flex-col gap-4 h-8 w-auto pt-10">
          <NavigationBar />
        </div>
      </div>

      <div className="flex w-full h-full gap-4 pt-10">
        <div className='relative w-1/3 h-[90%] overflow-hidden rounded-[32px] border border-white/10 bg-[#07111c]'>

          <div className='absolute -top-20 -left-20 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl'></div>

          <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl'></div>

          <div className='relative z-10 flex h-full flex-col items-center p-8'>

            <div className='mt-4 flex items-center justify-center'>
              <EditableField
                label=""
                displayName={true}
                value={displayName}
                isEditing={editingField === 'displayName'}
                onEditClick={() => handleEditClick('displayName')}
                onChange={(e) => {
                  const [first, last] = e.target.value.split(' ')
                  handleFieldChange('firstName', first)
                  handleFieldChange('lastName', last || '')
                }}
              />
            </div>

            <p className='mt-2 text-sm tracking-wide text-gray-400'>
              I heard you’re looking for me 💕
            </p>

            
            <div className='group relative mt-10'>

              <div className='rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-400 p-[5px] shadow-[0_0_60px_rgba(168,85,247,0.45)]'>

                <img
                  src={profileImage}
                  alt=""
                  className='h-72 w-72 rounded-full object-cover border-[6px] border-[#07111c]'
                />
              </div>

              {
                editingField === 'profilePicture' ? (
                  <div className='mt-4 w-full flex flex-col gap-2'>
                    <label
                      className='w-full cursor-pointer rounded-xl border border-[#3c4f5d] bg-[#1a2633] px-3 py-2 text-center text-white'
                      style={{ fontSize: '14px' }}
                    >
                      {
                        formData.profilePicture instanceof File
                          ? formData.profilePicture.name
                          : 'Choose Image'
                      }

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]

                          if (file) {
                            handleFieldChange('profilePicture', file)
                          }
                        }}
                        className='hidden'
                      />
                    </label>

                    {
                      errors.profilePicture && (
                        <span
                          style={{
                            color: '#ff6b6b',
                            fontSize: '12px'
                          }}
                        >
                          {errors.profilePicture}
                        </span>
                      )
                    }
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick('profilePicture')}
                    className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100'
                  >
                    <div className='rounded-full bg-white/10 p-4 backdrop-blur-md'>
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className='h-7 w-7'
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                  </button>
                )
              }
            </div>

            

          </div>
        </div>
        <div className='relative w-2/3 h-[90%] overflow-hidden rounded-[32px] border border-white/10 bg-[#07111c] p-6'>

          <div className='absolute top-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl'></div>

          <div className='absolute bottom-0 left-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl'></div>

          <div className='relative z-10 flex h-full flex-col'>

            <div className='mb-8 flex items-center justify-between'>

              <div>
                <h1
                  className='text-3xl font-bold text-white'
                  style={{ fontFamily: 'Albert Sans' }}
                >
                  Profile Details
                </h1>

                <div className='mt-3 h-[3px] w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400'></div>
              </div>

              <div className='rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl'>
                <span className='text-sm tracking-wider text-gray-300'>
                  Personal Information
                </span>
              </div>

            </div>

            <div className='flex flex-1 flex-col gap-5 overflow-hidden'>

              <div className='grid grid-cols-2 gap-5'>

                <div className='rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/30 hover:bg-white/[0.07]'>
                  <EditableField
                    label="First Name"
                    value={formData.firstName || user.firstName}
                    isEditing={editingField === 'firstName'}
                    onBlur={() => setEditingField(null)}
                    onEditClick={() => handleEditClick('firstName')}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    error={errors.firstName}
                  />
                </div>

                <div className='rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.07]'>
                  <EditableField
                    label="Last Name"
                    value={formData.lastName || user.lastName}
                    isEditing={editingField === 'lastName'}
                    onBlur={() => setEditingField(null)}
                    onEditClick={() => handleEditClick('lastName')}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    error={errors.lastName}
                  />
                </div>

              </div>

              <div className='grid grid-cols-2 gap-5'>

                <div className='rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.07]'>
                  <EditableField
                    label="Email"
                    value={formData.email || user.email}
                    type="email"
                    onBlur={() => setEditingField(null)}
                    isEditing={editingField === 'email'}
                    onEditClick={() => handleEditClick('email')}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    error={errors.email}
                  />
                </div>

                <div className='rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/30 hover:bg-white/[0.07]'>
                  <EditableField
                    label="Date of Birth"
                    value={formattedDob}
                    type="date"
                    onBlur={() => setEditingField(null)}
                    isEditing={editingField === 'dateOfBirth'}
                    onEditClick={() => handleEditClick('dateOfBirth')}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                    error={errors.dateOfBirth}
                  />
                </div>

              </div>

              <div className='rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.07]'>
                <EditableField
                  label="Mobile Number"
                  value={formData.mobileNumber || user.mobileNumber}
                  type="tel"
                  onBlur={() => setEditingField(null)}
                  isEditing={editingField === 'mobileNumber'}
                  onEditClick={() => handleEditClick('mobileNumber')}
                  onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
                  error={errors.mobileNumber}
                />
              </div>

            </div>

            <div className='mt-6 flex gap-5'>

              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className='flex-1 cursor-pointer rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 px-6 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_45px_rgba(168,85,247,0.55)] active:scale-95'
              >
                Save Changes
              </button>

              <button
                onClick={handleDiscardChanges}
                disabled={loading}
                className='flex-1 cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-semibold text-white backdrop-blur-xl transform transition-all duration-300 ease-out hover:scale-105 hover:bg-white/10 active:scale-95'
              >
                Discard
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className='flex-1 cursor-pointer rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(239,68,68,0.35)] transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_45px_rgba(239,68,68,0.55)] active:scale-95'
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile