import { useEffect, useState, type MouseEvent } from 'react'
import styled, { keyframes } from 'styled-components'

import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { getSpecies, updateSpecies } from '../redux/features/user'
import type { UserProfile } from '../utils/user'
import { Skeleton } from './Dashboard'

const OTHER_MAX_LENGTH = 80

type FavoriteSpeciesModalProps = {
  user?: UserProfile | null
  onClose: () => void
}

export default function FavoriteSpeciesModal({ user, onClose }: FavoriteSpeciesModalProps) {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.userReducer.getSpecies)
  const saving = useAppSelector((state) => state.userReducer.updateSpecies.loading)
  const saveError = useAppSelector((state) => state.userReducer.updateSpecies.error)
  const [selected, setSelected] = useState<string[]>(() =>
    (user?.interestedSpecies ?? []).map((item) => String(item.id)),
  )
  const [otherSpecies, setOtherSpecies] = useState('')

  useEffect(() => {
    if (!data && !loading) void dispatch(getSpecies())
  }, [data, dispatch, loading])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !saving) onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, saving])

  const groups = (data?.groups ?? []).filter((group) => group.options.length > 0)

  function toggleOption(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  async function onSubmit() {
    const result = await dispatch(
      updateSpecies({ speciesIds: selected, otherSpecies: otherSpecies.trim() }),
    )
    if (updateSpecies.fulfilled.match(result)) onClose()
  }

  function onOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !saving) onClose()
  }

  return (
    <Overlay onClick={onOverlayClick}>
      <Modal role="dialog" aria-modal="true" aria-labelledby="favorite-species-title">
        <CloseButton type="button" aria-label="關閉" disabled={saving} onClick={onClose}>
          ✕
        </CloseButton>

        <Header>
          <Title id="favorite-species-title">喜歡的物種</Title>
        </Header>

        <Content>
          {loading && !data ? (
            <div aria-busy="true" aria-label="載入物種中">
              <Skeleton $variant="line" />
              <Skeleton $variant="line" />
            </div>
          ) : null}

          {error ? <Status>{error}</Status> : null}

          {groups.map((group) => (
            <Group key={group.id}>
              <GroupName>{group.name}</GroupName>
              <ChipRow>
                {group.options.map((option) => {
                  const id = String(option.id)
                  const active = selected.includes(id)
                  return (
                    <SpeciesChip
                      key={id}
                      type="button"
                      $active={active}
                      aria-pressed={active}
                      onClick={() => toggleOption(id)}
                    >
                      {option.name}
                    </SpeciesChip>
                  )
                })}
              </ChipRow>
            </Group>
          ))}

          <Group>
            <GroupName as="label" htmlFor="favorite-species-other">
              許願
            </GroupName>
            <OtherInput
              id="favorite-species-other"
              type="text"
              value={otherSpecies}
              maxLength={OTHER_MAX_LENGTH}
              placeholder="想要養什麼？"
              onChange={(event) => setOtherSpecies(event.target.value)}
            />
          </Group>
        </Content>

        <Footer>
          {saveError ? <Status>{saveError}</Status> : null}
          <SubmitButton type="button" disabled={saving} onClick={() => void onSubmit()}>
            {saving ? '送出中…' : '送出'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 24rem;
  max-height: 85vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1c 0%, #0f0f10 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  color: var(--color-white);
  animation: ${fadeIn} 0.3s ease-out;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }
`

const Header = styled.div`
  padding: 1.5rem 3rem 0.5rem 1.25rem;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
`

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 1.25rem 1rem;
`

const Group = styled.div`
  margin-top: 1rem;
`

const GroupName = styled.p`
  display: block;
  margin: 0 0 0.55rem;
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 600;
`

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`

const SpeciesChip = styled.button<{ $active?: boolean }>`
  padding: 0.38rem 0.72rem;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255, 255, 255, 0.08)')};
  color: ${({ $active }) => ($active ? '#000000' : '#d1d1d6')};
  font: inherit;
  font-size: 0.8rem;
  font-weight: 650;
  cursor: pointer;
`

const OtherInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 2.6rem;
  padding: 0 0.9rem;
  border: 1px solid var(--color-glass-border);
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-white);
  font: inherit;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: var(--color-muted);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
  }
`

const Status = styled.p`
  margin: 0.75rem 0 0;
  color: var(--color-muted);
  font-size: 0.82rem;
`

const Footer = styled.div`
  padding: 0 1.25rem 1.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const SubmitButton = styled.button`
  width: 100%;
  min-height: 2.75rem;
  margin-top: 0.9rem;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: #000000;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.45;
  }
`
