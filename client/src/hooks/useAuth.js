import { useEffect, useState } from 'react'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // placeholder: simulate auth check
    setLoading(false)
  }, [])

  return { user, setUser, loading }
}

export default useAuth
