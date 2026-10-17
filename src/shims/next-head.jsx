import { useEffect } from 'react'

function Head({ children }) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const nodes = (Array.isArray(children) ? children : [children]).flat(Infinity).filter(Boolean)

    const cleanups = []

    nodes.forEach((node) => {
      const { type, props } = node
      if (!props) return

      if (type === 'title' && props.children) {
        const previous = document.title
        document.title = props.children
        cleanups.push(() => {
          document.title = previous
        })
      }

      if (type === 'meta') {
        const name = props.name || props.property
        if (!name) return
        const attribute = props.name ? 'name' : 'property'
        let tag = document.head.querySelector(`meta[${attribute}="${name}"]`)
        if (!tag) {
          tag = document.createElement('meta')
          tag.setAttribute(attribute, name)
          document.head.appendChild(tag)
        }
        const previous = tag.getAttribute('content')
        if (props.content !== undefined) tag.setAttribute('content', props.content)
        cleanups.push(() => {
          if (previous === null) tag.remove()
          else tag.setAttribute('content', previous)
        })
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [children])

  return null
}

export default Head
