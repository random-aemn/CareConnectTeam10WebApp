import {useEffect, type RefObject} from 'react'

export function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>, openerRef: RefObject<HTMLElement | null>, close: () => void) {
    useEffect(() => {
        if (!active) return
        const container = containerRef.current
        const opener = openerRef.current
        const focusable = () => Array.from(container?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])
        focusable()[0]?.focus()
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); close(); return }
            if (event.key !== 'Tab') return
            const items = focusable()
            if (!items.length) return
            const first = items[0]
            const last = items[items.length - 1]
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
        }
        document.addEventListener('keydown', handleKey)
        return () => { document.removeEventListener('keydown', handleKey); opener?.focus() }
    }, [active, close, containerRef, openerRef])
}
