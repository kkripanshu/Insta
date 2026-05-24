import React from 'react'
import EditIcon from '../../assets/icons/IC_Edit.svg'

const EditableField = ({ label, value, type = 'text', isEditing, onEditClick, onChange, error, displayName, onBlur }) => {
  return (
    <div className='flex flex-col gap-1 group'>
      <span style={{ color: '#888', fontSize: '14px' }}>{label}</span>
    {isEditing ? (
        <input
          type={type}
          autoFocus
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className='bg-[#1a2633] text-white px-3 py-2 rounded-lg border border-[#3c4f5d] focus:border-[#5ca3ff] outline-none'
          style={{ fontSize: '16px', colorScheme: 'dark' }}
        />
      ) : (
        <div className='flex items-center justify-between'>
            <span
              className={displayName ? 'bg-linear-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent font-bold text-4xl' : 'text-white'}
              style={{ fontSize: displayName ? '2.5rem' : '16px', fontWeight: displayName ? 'bold' : 'normal', }}>{value || 'Not provided'}</span>
          <button
            onClick={onEditClick}
            className='opacity-0 group-hover:opacity-100 transition-opacity ml-2 cursor-pointer'
          >
            <img src={EditIcon} alt="Edit" className='w-5 h-5' style={{ filter: 'brightness(0) invert(1)' }} />
          </button>
        </div>
      )}
      {error && <span style={{ color: '#ff6b6b', fontSize: '12px' }}>{error}</span>}
    </div>
  )
}

export default EditableField
