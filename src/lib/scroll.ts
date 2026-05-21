export function resetWindowScroll(behavior: ScrollBehavior = 'auto') {
  if (typeof window === 'undefined') {
    return
  }

  window.scrollTo({ top: 0, left: 0, behavior })
}

export function scrollElementIntoView(
  target: HTMLElement | null,
  behavior: ScrollBehavior = 'auto',
) {
  target?.scrollIntoView({ block: 'start', inline: 'nearest', behavior })
}

export function focusElement(target: HTMLElement | null) {
  if (!target) {
    return
  }

  const previousTabIndex = target.getAttribute('tabindex')
  if (previousTabIndex === null) {
    target.setAttribute('tabindex', '-1')
  }

  target.focus({ preventScroll: true })

  if (previousTabIndex === null) {
    window.setTimeout(() => {
      target.removeAttribute('tabindex')
    }, 500)
  }
}

export function focusPageStart() {
  if (typeof document === 'undefined') {
    return
  }

  const target = document.querySelector<HTMLElement>(
    '[data-page-title], h1, main, section',
  )
  focusElement(target)
}

export function resetScrollableContainers(behavior: ScrollBehavior = 'auto') {
  if (typeof document === 'undefined') {
    return
  }

  document.querySelectorAll<HTMLElement>('[data-scroll-root]').forEach((node) => {
    node.scrollTo({ top: 0, left: 0, behavior })
  })
}

export function scrollToPageTop(options?: {
  behavior?: ScrollBehavior
  focus?: boolean
}) {
  if (typeof window === 'undefined') {
    return
  }

  const behavior = options?.behavior ?? 'auto'
  window.requestAnimationFrame(() => {
    resetWindowScroll(behavior)
    resetScrollableContainers(behavior)

    if (options?.focus ?? true) {
      focusPageStart()
    }
  })
}

export function scrollToHash(hash: string, behavior: ScrollBehavior = 'auto') {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = id ? document.getElementById(id) : null

  window.requestAnimationFrame(() => {
    if (target) {
      scrollElementIntoView(target, behavior)
      focusElement(target)
      return
    }

    scrollToPageTop({ behavior, focus: true })
  })
}
