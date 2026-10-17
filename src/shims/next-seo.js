import { useEffect } from 'react'

export function NextSeo({ title, description }) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const previousTitle = document.title
    if (title) document.title = title

    let meta = document.head.querySelector('meta[name="description"]')
    let previousDescription
    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      previousDescription = meta.getAttribute('content')
      meta.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (previousDescription !== undefined && meta) {
        if (previousDescription === null) meta.remove()
        else meta.setAttribute('content', previousDescription)
      }
    }
  }, [title, description])

  return null
}

export default { NextSeo }
