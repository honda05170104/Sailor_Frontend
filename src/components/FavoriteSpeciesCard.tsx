import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { getProducts, updateProducts } from '../redux/features/user'
import type { ProductCategory } from '../utils/user'
import { Card, Skeleton } from './Dashboard'

function sameIds(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every((id) => set.has(id))
}

function productIdsOf(category: ProductCategory) {
  return (category.products ?? []).map((product) => String(product.id))
}

function categoriesWithSelection(categories: ProductCategory[], productIds: string[]) {
  const selected = new Set(productIds)
  return categories
    .filter((category) => productIdsOf(category).some((id) => selected.has(id)))
    .map((category) => String(category.id))
}

function FavoriteSpeciesSkeleton() {
  return (
    <SpeciesCard aria-busy="true" aria-label="載入物種中">
      <CardTitle>喜歡的物種</CardTitle>
      <Skeleton $variant="line" />
      <Skeleton $variant="line" />
    </SpeciesCard>
  )
}

export default function FavoriteSpeciesCard() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector(
    (state) => state.userReducer.getProducts,
  )
  const saving = useAppSelector((state) => state.userReducer.updateProducts.loading)
  const saveError = useAppSelector((state) => state.userReducer.updateProducts.error)
  const [selected, setSelected] = useState<string[]>([])
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void dispatch(getProducts())
  }, [dispatch])

  const categories = useMemo(
    () =>
      (data?.categories ?? []).filter(
        (category) => (category.products ?? []).length > 0,
      ),
    [data?.categories],
  )

  useEffect(() => {
    if (!data) return
    const productIds = data.productIds.map(String)
    setSelected(productIds)
    setOpenCategories(categoriesWithSelection(categories, productIds))
    setReady(true)
  }, [categories, data])

  const openCategorySet = useMemo(() => new Set(openCategories), [openCategories])
  const visibleCategories = categories.filter((category) =>
    openCategorySet.has(String(category.id)),
  )
  const savedIds = data?.productIds.map(String) ?? []
  const dirty = ready && !sameIds(selected, savedIds)

  function toggleCategory(category: ProductCategory) {
    const categoryId = String(category.id)
    const productIds = productIdsOf(category)

    if (openCategorySet.has(categoryId)) {
      setOpenCategories((current) => current.filter((id) => id !== categoryId))
      setSelected((current) => current.filter((id) => !productIds.includes(id)))
      return
    }

    setOpenCategories((current) => [...current, categoryId])
  }

  function toggleProduct(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  async function onSave() {
    await dispatch(updateProducts({ productIds: selected }))
  }

  if (loading && !data) {
    return <FavoriteSpeciesSkeleton />
  }

  return (
    <SpeciesCard>
      <CardTitle>喜歡的物種</CardTitle>
      <CardHint>選擇你飼養或喜歡的物種</CardHint>

      {error ? (
        <CardStatus>{error}</CardStatus>
      ) : categories.length ? (
        <>
          <CategoryBlock>
            <ChipRow>
              {categories.map((category) => {
                const id = String(category.id)
                const active = openCategorySet.has(id)
                return (
                  <SpeciesChip
                    key={id}
                    type="button"
                    $active={active}
                    aria-pressed={active}
                    onClick={() => toggleCategory(category)}
                  >
                    {category.name}
                  </SpeciesChip>
                )
              })}
            </ChipRow>
          </CategoryBlock>

          {visibleCategories.length ? (
            visibleCategories.map((category) => (
              <CategoryBlock key={category.id}>
                <CategoryName>{category.name}</CategoryName>
                <ChipRow>
                  {(category.products ?? []).map((product) => {
                    const id = String(product.id)
                    const active = selected.includes(id)
                    return (
                      <SpeciesChip
                        key={id}
                        type="button"
                        $active={active}
                        aria-pressed={active}
                        onClick={() => toggleProduct(id)}
                      >
                        {product.name}
                      </SpeciesChip>
                    )
                  })}
                </ChipRow>
              </CategoryBlock>
            ))
          ) : (
            <CardStatus>請先選擇分類</CardStatus>
          )}
        </>
      ) : (
        <CardStatus>尚無物種</CardStatus>
      )}

      {categories.length ? (
        <>
          <SaveButton type="button" disabled={!dirty || saving} onClick={() => void onSave()}>
            {saving ? '儲存中…' : '儲存'}
          </SaveButton>
          {saveError ? <CardStatus>{saveError}</CardStatus> : null}
        </>
      ) : null}
    </SpeciesCard>
  )
}

const SpeciesCard = styled(Card)`
  margin-top: 0.85rem;
  padding: 1rem 1.1rem 1.05rem;
`

const CardTitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

const CardHint = styled.p`
  margin: 0.35rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
`

const CardStatus = styled.p`
  margin: 0.75rem 0 0;
  color: var(--dash-muted);
  font-size: 0.82rem;
`

const CategoryBlock = styled.div`
  margin-top: 0.95rem;
`

const CategoryName = styled.p`
  margin: 0 0 0.55rem;
  color: var(--dash-muted);
  font-size: 0.78rem;
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

const SaveButton = styled.button`
  width: 100%;
  min-height: 2.7rem;
  margin-top: 1rem;
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
