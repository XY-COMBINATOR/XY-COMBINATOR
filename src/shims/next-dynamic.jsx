import { lazy, Suspense } from 'react'

export default function dynamic(loader) {
  const LazyComponent = lazy(async () => {
    const module = await loader()
    return { default: module.default ?? module }
  })

  function DynamicComponent(props) {
    return (
      <Suspense fallback={null}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }

  return DynamicComponent
}
