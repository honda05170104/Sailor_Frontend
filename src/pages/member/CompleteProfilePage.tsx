import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { DashboardLoading, Status } from '../../components/Dashboard'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getUser, logout, updateProfile } from '../../redux/features/user'
import { LoginError, LoginMain, LoginStage } from './LoginPage'
import { peekReturnTo } from '../../utils/returnTo'
import { isProfileIncomplete } from '../../utils/user'

type BirthdayParts = {
  year: string
  month: string
  day: string
}

function todayParts() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  }
}

function todayIsoDate() {
  const today = todayParts()
  return `${today.year}-${pad2(today.month)}-${pad2(today.day)}`
}

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function splitBirthday(value: string): BirthdayParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return { year: '', month: '', day: '' }
  return { year: match[1], month: match[2], day: match[3] }
}

function clampBirthday(parts: BirthdayParts, today: ReturnType<typeof todayParts>) {
  const next = { ...parts }
  if (next.year === String(today.year) && next.month && Number(next.month) > today.month) {
    next.month = pad2(today.month)
  }
  if (next.year && next.month && next.day) {
    let day = Number(next.day)
    const maxDay = daysInMonth(Number(next.year), Number(next.month))
    if (day > maxDay) day = maxDay
    if (
      next.year === String(today.year) &&
      Number(next.month) === today.month &&
      day > today.day
    ) {
      day = today.day
    }
    next.day = pad2(day)
  }
  const iso = next.year && next.month && next.day ? `${next.year}-${next.month}-${next.day}` : ''
  return { parts: next, iso }
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
  const [birthdayParts, setBirthdayParts] = useState(() =>
    splitBirthday(user?.birthday?.slice(0, 10) ?? ''),
  )
  const [formError, setFormError] = useState<string | null>(null)
  const today = useMemo(() => todayParts(), [])
  const years = useMemo(() => {
    const list: string[] = []
    for (let year = today.year; year >= 1900; year -= 1) list.push(String(year))
    return list
  }, [today.year])
  const months = useMemo(() => {
    const max = birthdayParts.year === String(today.year) ? today.month : 12
    return Array.from({ length: max }, (_, index) => pad2(index + 1))
  }, [birthdayParts.year, today])
  const days = useMemo(() => {
    let max = 31
    if (birthdayParts.year && birthdayParts.month) {
      max = daysInMonth(Number(birthdayParts.year), Number(birthdayParts.month))
      if (
        birthdayParts.year === String(today.year) &&
        Number(birthdayParts.month) === today.month
      ) {
        max = Math.min(max, today.day)
      }
    }
    return Array.from({ length: max }, (_, index) => pad2(index + 1))
  }, [birthdayParts.month, birthdayParts.year, today])

  useEffect(() => {
    if (!user && !getUserState.loading && !getUserState.error) {
      void dispatch(getUser())
    }
  }, [dispatch, getUserState.error, getUserState.loading, user])

  useEffect(() => {
    if (!user) return
    setMobile((current) => current || user.mobile || '')
    const nextBirthday = user.birthday?.slice(0, 10) || ''
    setBirthday((current) => current || nextBirthday)
    setBirthdayParts((current) =>
      current.year || current.month || current.day ? current : splitBirthday(nextBirthday),
    )
  }, [user])

  function onBirthdayPart(key: keyof BirthdayParts, value: string) {
    const next = clampBirthday({ ...birthdayParts, [key]: value }, today)
    setBirthdayParts(next.parts)
    setBirthday(next.iso)
  }

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
          <CompleteField as="div">
            <span>生日</span>
            <DateInputShell>
              <select
                aria-label="年"
                value={birthdayParts.year}
                onChange={(event) => onBirthdayPart('year', event.target.value)}
              >
                <option value="">年</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
              <select
                aria-label="月"
                value={birthdayParts.month}
                onChange={(event) => onBirthdayPart('month', event.target.value)}
              >
                <option value="">月</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {Number(month)}月
                  </option>
                ))}
              </select>
              <select
                aria-label="日"
                value={birthdayParts.day}
                onChange={(event) => onBirthdayPart('day', event.target.value)}
              >
                <option value="">日</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {Number(day)}日
                  </option>
                ))}
              </select>
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
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: 3.25rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 1rem;
  background: #1c1c1e;
  color-scheme: dark;

  &:focus-within {
    outline: 2px solid #6cc762;
    outline-offset: 1px;
  }

  select {
    width: 100%;
    min-width: 0;
    height: 3.25rem;
    padding: 0 0.35rem;
    border: 0;
    background: transparent;
    color: #ffffff;
    font: inherit;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    text-align-last: center;
    appearance: none;
    -webkit-appearance: none;
  }

  select + select {
    border-left: 1px solid rgba(255, 255, 255, 0.12);
  }

  select:focus {
    outline: none;
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
