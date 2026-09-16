import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { getUser } from '../redux/features/user'
import { isProfileIncomplete } from '../utils/user'

import HomeSkeleton from './HomeSkeleton'

function RequireProfile() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.userReducer.getUser)
  const user = data?.user

  useEffect(() => {
    if (!user && !loading && !error) {
      void dispatch(getUser())
    }
  }, [dispatch, error, loading, user])

  if (loading || (!user && !error)) {
    return <HomeSkeleton />
  }

  if (user && isProfileIncomplete(user)) {
    return <Navigate to="/complete-profile" replace />
  }

  return <Outlet />
}

export default RequireProfile
