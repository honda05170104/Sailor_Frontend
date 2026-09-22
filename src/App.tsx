import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import RequireAuth from './components/RequireAuth'
import RequireProfile from './components/RequireProfile'
import ScrollToTop from './components/ScrollToTop'
import CompleteProfilePage from './pages/member/CompleteProfilePage'
import ComingSoonPage from './pages/member/ComingSoonPage'
import CouponsPage from './pages/member/CouponsPage'
import HomePage from './pages/member/HomePage'
import LoginPage from './pages/member/LoginPage'
import ProfilePage from './pages/member/ProfilePage'
import TransactionsPage from './pages/member/TransactionsPage'
import VipPage from './pages/member/VipPage'
import StoreInfoPage from './pages/official/StoreInfoPage'
import { getAuthToken } from './utils/auth'
import { clearReturnToIfMatched, peekReturnTo } from './utils/returnTo'

function LoginRoute() {
  if (getAuthToken()) {
    return <Navigate to={peekReturnTo() || '/'} replace />
  }

  return <LoginPage />
}

function ReturnToJanitor() {
  const location = useLocation()
  const token = getAuthToken()

  useEffect(() => {
    if (!token) return
    clearReturnToIfMatched(location.pathname)
  }, [location.pathname, token])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ReturnToJanitor />
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/store" element={<StoreInfoPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route element={<RequireProfile />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/vip" element={<VipPage />} />
            <Route
              path="/order-mice"
              element={<ComingSoonPage title="訂購老鼠" />}
            />
            <Route
              path="/boarding"
              element={<ComingSoonPage title="寄宿申請" />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
