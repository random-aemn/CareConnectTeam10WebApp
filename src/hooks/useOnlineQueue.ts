import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {demoSyncAdapter} from '../pwa/demoSyncAdapter'
import {clearCareConnectCaches, clearOperationStore, createOperation, listOperations, saveOperation, type QueuedOperation} from '../pwa/syncQueue'

const LAST_SYNC_KEY = 'careconnect-demo-last-sync-v1'

export function useOnlineQueue(onNotice: (message: string) => void) {
    const [online, setOnline] = useState(() => navigator.onLine)
    const [operations, setOperations] = useState<QueuedOperation[]>([])
    const [lastSync, setLastSync] = useState(() => localStorage.getItem(LAST_SYNC_KEY))
    const processing = useRef(false)
    const refresh = useCallback(async () => setOperations(await listOperations()), [])

    const processQueue = useCallback(async () => {
        if (processing.current || !navigator.onLine) return
        processing.current = true
        const waiting = (await listOperations()).filter((item) => item.status === 'waiting' || item.status === 'syncing')
        let confirmed = 0
        if (waiting.length) onNotice(`Demo synchronization started for ${waiting.length} change${waiting.length === 1 ? '' : 's'}.`)
        for (const operation of waiting) {
            const syncing = {...operation, status: 'syncing' as const, attempts: operation.attempts + 1, updatedAt: new Date().toISOString(), error: undefined}
            await saveOperation(syncing)
            await refresh()
            const result = await demoSyncAdapter.submit(syncing)
            if (result.confirmed) confirmed += 1
            await saveOperation(result.confirmed
                ? {...syncing, status: 'synced', updatedAt: new Date().toISOString()}
                : {...syncing, status: syncing.attempts >= 3 ? 'needs-attention' : 'waiting', updatedAt: new Date().toISOString(), error: result.message ?? 'Demo sync failed.'})
        }
        if (confirmed) {
            const timestamp = new Date().toISOString()
            localStorage.setItem(LAST_SYNC_KEY, timestamp)
            setLastSync(timestamp)
            onNotice(`${confirmed} demo change${confirmed === 1 ? '' : 's'} synchronized locally. No information was sent to a healthcare system.`)
        } else if (waiting.length) {
            onNotice('Demo synchronization needs attention. No information was sent to a healthcare system.')
        }
        await refresh()
        processing.current = false
        if ((await listOperations()).some((item) => item.status === 'waiting')) window.setTimeout(() => void processQueue(), 0)
    }, [onNotice, refresh])

    useEffect(() => {
        void refresh().then(() => processQueue())
        const goOffline = () => setOnline(false)
        const goOnline = () => {
            setOnline(true)
            onNotice('Connection restored. Demo synchronization is starting.')
            void processQueue()
        }
        window.addEventListener('offline', goOffline)
        window.addEventListener('online', goOnline)
        return () => {
            window.removeEventListener('offline', goOffline)
            window.removeEventListener('online', goOnline)
        }
    }, [onNotice, processQueue, refresh])

    const queueChange = useCallback(async (type: string, payload: unknown) => {
        await saveOperation(createOperation(type, payload))
        await refresh()
        onNotice(navigator.onLine ? 'Saved locally. Demo synchronization will confirm this change.' : 'Saved locally and waiting to sync.')
        if (navigator.onLine) void processQueue()
    }, [onNotice, processQueue, refresh])

    const retryOperation = useCallback(async (operation: QueuedOperation) => {
        await saveOperation({...operation, status: 'waiting', error: undefined, updatedAt: new Date().toISOString()})
        await refresh()
        if (navigator.onLine) void processQueue()
    }, [processQueue, refresh])

    const clearOfflineData = useCallback(async () => {
        await clearOperationStore()
        await clearCareConnectCaches()
        localStorage.removeItem(LAST_SYNC_KEY)
        setLastSync(null)
        await refresh()
    }, [refresh])

    const pendingSync = useMemo(() => operations.filter((item) => item.status === 'waiting' || item.status === 'syncing').length, [operations])
    const needsAttention = useMemo(() => operations.filter((item) => item.status === 'needs-attention').length, [operations])
    return {online, operations, pendingSync, needsAttention, syncing: operations.some((item) => item.status === 'syncing'), lastSync, queueChange, retryOperation, clearOfflineData}
}
