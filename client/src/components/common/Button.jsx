import React from 'react'

const Button = ({ label, icon, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className='w-full h-full rounded-2xl flex items-center justify-center px-3 py-2'
      style={{
        background: disabled ? '#6a7d95' : 'linear-gradient(90deg, #5ca3ff 0%, #1b71e0 100%)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
      }}
    >
      {icon && (<div className='flex items-center justify-center h-full w-auto'>{icon}</div>)}
      <div className='text-white' style={{
        fontSize: '1.5rem',
        fontFamily: 'Albert Sans',
        fontWeight: '600',
      }}>{label}</div>
    </button>
  )
}

export default Button