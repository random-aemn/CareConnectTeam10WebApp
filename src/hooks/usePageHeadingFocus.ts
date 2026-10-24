import {useEffect, useRef} from 'react'

export function usePageHeadingFocus() {
    const headingRef = useRef<HTMLHeadingElement>(null)
    useEffect(() => { headingRef.current?.focus() }, [])
    return headingRef
}
