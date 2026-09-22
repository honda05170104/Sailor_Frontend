import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { getAuthToken } from '../utils/auth'
import { saveReturnTo } from '../utils/returnTo'

function RequireAuth() {
  const location = useLocation()
  const token = getAuthToken()

  if (!token) {
    saveReturnTo(location.pathname)
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}

export default RequireAuth
