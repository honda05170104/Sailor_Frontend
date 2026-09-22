import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { lineLogin } from '../redux/features/user'
import { isProfileIncomplete } from '../utils/user'
import {
  clearLineLoginCallback,
  hasLineChannelId,
  startLineLogin,
  takeLineLoginCallback,
} from '../utils/lineAuth'
import { getPostAuthPath } from '../utils/returnTo'

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, data } = useAppSelector(
    (state) => state.userReducer.lineLogin,
  )
  const [oauthError, setOauthError] = useState<string | null>(null)
  const configured = hasLineChannelId()
  const callbackParams = new URLSearchParams(location.search)
  const hasCallback = callbackParams.has('code') || callbackParams.has('error')
  const busy = loading || hasCallback

  useEffect(() => {
    if (data) {
      clearLineLoginCallback()
      const nextPath = getPostAuthPath(
        data.isNew || isProfileIncomplete(data.user),
      )
      navigate(nextPath, { replace: true })
    }
  }, [data, navigate])

  useEffect(() => {
    if (error) clearLineLoginCallback()
  }, [error])

  useEffect(() => {
    if (data) return

    const params = new URLSearchParams(location.search)
    if (!params.has('code') && !params.has('error')) return

    try {
      const payload = takeLineLoginCallback(params)
      navigate('/login', { replace: true })
      if (payload) dispatch(lineLogin(payload))
    } catch (err) {
      navigate('/login', { replace: true })
      setOauthError(err instanceof Error ? err.message : 'LINE 登入失敗')
    }
  }, [data, dispatch, location.search, navigate])

  function onLogin() {
    if (!configured) return
    setOauthError(null)
    void startLineLogin()
  }

  const displayError = oauthError || error

  return (
    <LoginMain>
      <LoginStage>
        <LoginLogo src="/logo.png" alt="水手" width={288} height={288} />
        <LineButton type="button" onClick={onLogin} disabled={busy || !configured}>
          <LineBadge aria-hidden="true">
            <LineLogo src="/line-login.png" alt="" />
          </LineBadge>
          <LineText>{busy ? '登入中…' : '登入 / 註冊'}</LineText>
          <LineSpacer aria-hidden="true" />
        </LineButton>
        {!configured ? <LoginError>尚未設定 VITE_LINE_CHANNEL_ID</LoginError> : null}
        {displayError ? <LoginError>{displayError}</LoginError> : null}
      </LoginStage>
    </LoginMain>
  )
}

export const LoginMain = styled.main`
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: clamp(1.5rem, 4vw, 3rem);
  color: #ffffff;
  background: #000000;
`

export const LoginStage = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 28rem);
  text-align: center;
  animation: ${rise} 700ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 640px) {
    width: min(100%, 22rem);
  }
`

const LoginLogo = styled.img`
  display: block;
  width: min(72vw, 18rem);
  height: auto;
  margin: 0 0 1.25rem;
`

const LineButton = styled.button`
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
  align-items: center;
  width: 100%;
  min-height: 3.5rem;
  margin-top: 2rem;
  padding: 0.25rem;
  border: 0;
  border-radius: 999px;
  background: #6cc762;
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: filter 180ms ease;
  animation: ${rise} 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 120ms;

  &:hover:not(:disabled) {
    filter: brightness(1.04);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.78;
  }
`

const LineBadge = styled.span`
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  border-radius: 50%;
`

const LineLogo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const LineText = styled.span`
  text-align: center;
`

const LineSpacer = styled.span`
  width: 3rem;
  height: 3rem;
`

export const LoginError = styled.p`
  margin: 1rem 0 0;
  max-width: 28ch;
  color: #ff453a;
  font-size: 0.95rem;
`
