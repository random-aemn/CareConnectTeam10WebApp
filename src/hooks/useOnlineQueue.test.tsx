import {act, renderHook, waitFor} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {clearOperationStore} from '../pwa/syncQueue'
import {useOnlineQueue} from './useOnlineQueue'

describe('useOnlineQueue', () => {
    afterEach(async () => {
        await clearOperationStore()
        localStorage.removeItem('careconnect-demo-force-sync-failure')
        vi.restoreAllMocks()
    })

    it('restores a waiting operation after the hook remounts', async () => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
        const notice = vi.fn()
        const first = renderHook(() => useOnlineQueue(notice))
        await act(() => first.result.current.queueChange('send-message', {body: 'Local demo'}))
        await waitFor(() => expect(first.result.current.pendingSync).toBe(1))
        first.unmount()

        const second = renderHook(() => useOnlineQueue(notice))
        await waitFor(() => expect(second.result.current.pendingSync).toBe(1))
        expect(second.result.current.operations).toHaveLength(1)
    })

    it('retries a failed operation without duplicating it and then requests attention', async () => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
        localStorage.setItem('careconnect-demo-force-sync-failure', 'true')
        const {result} = renderHook(() => useOnlineQueue(vi.fn()))
        await act(() => result.current.queueChange('add-appointment', {id: 42}))
        await waitFor(() => expect(result.current.needsAttention).toBe(1), {timeout: 4000})
        expect(result.current.operations).toHaveLength(1)
        expect(result.current.operations[0]).toEqual(expect.objectContaining({attempts: 3, status: 'needs-attention'}))
    })
})
