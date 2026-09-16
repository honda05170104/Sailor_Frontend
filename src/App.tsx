import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import RequireAuth from './components/RequireAuth'
import RequireProfile from './components/RequireProfile'
import CompleteProfilePage from './pages/CompleteProfilePage'
import ComingSoonPage from './pages/ComingSoonPage'
import CouponsPage from './pages/CouponsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import StoreInfoPage from './pages/StoreInfoPage'
import TransactionsPage from './pages/TransactionsPage'
import VipPage from './pages/VipPage'
import { getAuthToken } from './utils/auth'

function LoginRoute() {
  if (getAuthToken()) {
    return <Navigate to="/" replace />
  }

  return <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />

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
              element={<ComingSoonPage eyebrow="門市服務" title="訂購老鼠" />}
            />
            <Route
              path="/boarding"
              element={<ComingSoonPage eyebrow="門市服務" title="寄宿申請" />}
            />
            <Route path="/store" element={<StoreInfoPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
