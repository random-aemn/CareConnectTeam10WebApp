import {useEffect, type RefObject} from 'react'

export function useDismissiblePanel(
    active: boolean,
    triggerRef: RefObject<HTMLElement | null>,
    panelRef: RefObject<HTMLElement | null>,
    dismiss: () => void
) {
    useEffect(() => {
        if (!active) return

        const isInside = (target: EventTarget | null) => target instanceof Node &&
            (triggerRef.current?.contains(target) || panelRef.current?.contains(target))
        const handleKey = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return
            event.preventDefault()
            dismiss()
            window.setTimeout(() => triggerRef.current?.focus())
        }
        const handlePointer = (event: PointerEvent) => {
            if (!isInside(event.target)) dismiss()
        }
        const handleFocus = (event: FocusEvent) => {
            if (!isInside(event.target)) dismiss()
        }

        document.addEventListener('keydown', handleKey)
        document.addEventListener('pointerdown', handlePointer)
        document.addEventListener('focusin', handleFocus)
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.removeEventListener('pointerdown', handlePointer)
            document.removeEventListener('focusin', handleFocus)
        }
    }, [active, dismiss, panelRef, triggerRef])
}
