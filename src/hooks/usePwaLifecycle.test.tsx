import {act, renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {usePwaLifecycle} from './usePwaLifecycle'

describe('usePwaLifecycle', () => {
    it('waits for engagement and remembers an install dismissal', async () => {
        localStorage.setItem('careconnect-pwa-visits-v1', '1')
        const prompt = vi.fn().mockResolvedValue(undefined)
        const event = Object.assign(new Event('beforeinstallprompt'), {
            prompt,
            userChoice: Promise.resolve({outcome: 'dismissed', platform: 'web'})
        })
        const {result} = renderHook(() => usePwaLifecycle('/overview'))
        act(() => window.dispatchEvent(event))
        expect(result.current.showInstall).toBe(true)
        await act(() => result.current.install())
        expect(prompt).toHaveBeenCalledOnce()
        expect(localStorage.getItem('careconnect-pwa-install-dismissed-v1')).not.toBeNull()
    })

    it('treats three distinct pages as meaningful engagement', () => {
        const installEvent = Object.assign(new Event('beforeinstallprompt'), {
            prompt: vi.fn().mockResolvedValue(undefined),
            userChoice: Promise.resolve({outcome: 'accepted', platform: 'web'})
        })
        const {result, rerender} = renderHook(({path}) => usePwaLifecycle(path), {initialProps: {path: '/overview'}})
        act(() => window.dispatchEvent(installEvent))
        rerender({path: '/appointments'})
        rerender({path: '/messages'})
        expect(result.current.showInstall).toBe(true)
    })
})
