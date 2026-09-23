import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { DashboardLoading, Status } from '../../components/Dashboard'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getUser, logout, updateProfile } from '../../redux/features/user'
import { LoginError, LoginMain, LoginStage } from './LoginPage'
import { peekReturnTo } from '../../utils/returnTo'
import { isProfileIncomplete } from '../../utils/user'

function todayIsoDate() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('886') && digits.length === 12) {
    return `0${digits.slice(3)}`
  }
  return digits
}

function validatePhone(value: string) {
  const phone = normalizePhone(value)
  if (!/^09\d{8}$/.test(phone)) return '請輸入有效的手機號碼'
  return null
}

function validateBirthday(value: string) {
  if (!value) return '請選擇生日'
  if (value > todayIsoDate()) return '生日不能是未來日期'
  if (value < '1900-01-01') return '請輸入有效的生日'
  return null
}

export default function CompleteProfilePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.userReducer.getUser.data?.user)
  const getUserState = useAppSelector((state) => state.userReducer.getUser)
  const { loading, error } = useAppSelector((state) => state.userReducer.updateProfile)
  const loggingOut = useAppSelector((state) => state.userReducer.logout.loading)
  const [mobile, setMobile] = useState(user?.mobile ?? '')
  const [birthday, setBirthday] = useState(user?.birthday?.slice(0, 10) ?? '')
  const [formError, setFormError] = useState<string | null>(null)
  const maxBirthday = useMemo(() => todayIsoDate(), [])

  useEffect(() => {
    if (!user && !getUserState.loading && !getUserState.error) {
      void dispatch(getUser())
    }
  }, [dispatch, getUserState.error, getUserState.loading, user])

  useEffect(() => {
    if (!user) return
    setMobile((current) => current || user.mobile || '')
    setBirthday((current) => current || user.birthday?.slice(0, 10) || '')
  }, [user])

  if (getUserState.loading && !user) {
    return (
      <DashboardLoading>
        <Status>載入中…</Status>
      </DashboardLoading>
    )
  }

  if (user && !isProfileIncomplete(user)) {
    return <Navigate to={peekReturnTo() || '/'} replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextMobile = normalizePhone(mobile)
    const phoneError = validatePhone(nextMobile)
    const birthdayError = validateBirthday(birthday)
    const message = phoneError || birthdayError
    if (message) {
      setFormError(message)
      return
    }

    setFormError(null)
    const result = await dispatch(updateProfile({ mobile: nextMobile, birthday }))
    if (updateProfile.fulfilled.match(result)) {
      navigate(peekReturnTo() || '/', { replace: true })
    }
  }

  return (
    <LoginMain>
      <CompleteStage>
        <CompleteTitle>完成註冊</CompleteTitle>
        <CompleteLead>請填寫電話與生日，才能開始使用</CompleteLead>
        <CompleteForm onSubmit={(event) => void onSubmit(event)}>
          <CompleteField>
            <span>電話</span>
            <input
              type="tel"
              name="mobile"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="0912345678"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              required
            />
          </CompleteField>
          <CompleteField>
            <span>生日</span>
            <DateInputShell>
              <input
                type="date"
                name="birthday"
                value={birthday}
                max={maxBirthday}
                min="1900-01-01"
                onChange={(event) => setBirthday(event.target.value)}
                required
              />
            </DateInputShell>
          </CompleteField>
          <CompleteSubmit type="submit" disabled={loading}>
            {loading ? '儲存中…' : '完成'}
          </CompleteSubmit>
        </CompleteForm>
        {formError || error ? <LoginError>{formError || error}</LoginError> : null}
        <CompleteLogout
          type="button"
          disabled={loggingOut}
          onClick={() => void dispatch(logout())}
        >
          {loggingOut ? '登出中…' : '登出'}
        </CompleteLogout>
      </CompleteStage>
    </LoginMain>
  )
}

const CompleteStage = styled(LoginStage)`
  align-items: stretch;
  text-align: left;
`

const CompleteTitle = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  text-align: center;
`

const CompleteLead = styled.p`
  margin: 0.75rem 0 0;
  color: var(--muted);
  font-size: 1rem;
  text-align: center;
`

const CompleteForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-width: 0;
  margin-top: 2rem;
`

const CompleteField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;

  input {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    min-height: 3.25rem;
    padding: 0 1rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 1rem;
    background: #1c1c1e;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 500;
  }

  input:focus {
    outline: 2px solid #6cc762;
    outline-offset: 1px;
  }
`

const DateInputShell = styled.span`
  display: block;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 1rem;
  background: #1c1c1e;

  &:focus-within {
    outline: 2px solid #6cc762;
    outline-offset: 1px;
  }

  input[type='date'] {
    display: block;
    height: 3.25rem;
    min-height: 3.25rem;
    padding-right: 0.75rem;
    border: 0;
    border-radius: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    text-align: left;

    &:focus {
      outline: none;
    }

    &::-webkit-date-and-time-value {
      text-align: left;
      min-height: 1.5em;
    }

    &::-webkit-datetime-edit {
      padding: 0;
      overflow: hidden;
    }

    &::-webkit-calendar-picker-indicator {
      margin: 0 0 0 0.35rem;
      filter: invert(1);
      opacity: 0.7;
    }
  }
`

const CompleteSubmit = styled.button`
  width: 100%;
  min-height: 3.5rem;
  margin-top: 0.5rem;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: #000000;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.78;
  }
`

const CompleteLogout = styled.button`
  width: 100%;
  margin-top: 1rem;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.78;
  }
`
