import {useCallback, useEffect, useReducer, useRef, useState, type ReactNode} from 'react'
import {useOnlineQueue} from '../hooks/useOnlineQueue'
import {CareConnectContext, type ModalState} from './careConnectContext'
import {appReducer, clearSavedState, loadState, type AppAction} from './careConnectState'
import {clearOfflineState, loadOfflineState, saveOfflineState} from '../pwa/offlineState'

export function CareConnectProvider({children}: { children: ReactNode }) {
    const [state, rawDispatch] = useReducer(appReducer, undefined, loadState)
    const [modal, setModal] = useState<ModalState>(null)
    const [toast, setToast] = useState('')
    const [storageHydrated, setStorageHydrated] = useState(false)
    const initialStateRef = useRef(state)
    const handleNotice = useCallback((message: string) => setToast(message), [])
    const {online, operations, pendingSync, needsAttention, syncing, lastSync, queueChange, retryOperation, clearOfflineData: clearQueueData} = useOnlineQueue(handleNotice)
    const clearOfflineData = async () => {
        await clearQueueData()
        await clearOfflineState()
        clearSavedState()
        rawDispatch({type: 'reset'})
        setToast('Offline demo data cleared from this device.')
    }
    const dispatch = (action: AppAction) => {
        rawDispatch(action);
        if (!['select-message', 'read-notification', 'reset'].includes(action.type)) {
            void queueChange(action.type, action)
            window.dispatchEvent(new Event('careconnect:workflow-complete'))
        }
    }
    useEffect(() => {
        let active = true
        void loadOfflineState().then(async (persisted) => {
            if (!active) return
            if (persisted) rawDispatch({type: 'hydrate', state: persisted})
            else await saveOfflineState(initialStateRef.current)
            clearSavedState()
            if (active) setStorageHydrated(true)
        })
        return () => {
            active = false
        }
    }, [])
    useEffect(() => {
        if (!storageHydrated) return
        try {
            const preferences = JSON.parse(localStorage.getItem('careconnect-web-preferences-v1') ?? '{}') as {offlineStorage?: boolean}
            if (preferences.offlineStorage === false) void clearOfflineState()
            else void saveOfflineState(state)
        } catch {
            void saveOfflineState(state)
        }
    }, [state, storageHydrated])
    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(''), 3500);
        return () => window.clearTimeout(timer)
    }, [toast])
    return <CareConnectContext.Provider value={{
        state,
        dispatch,
        modal,
        openModal: setModal,
        closeModal: () => setModal(null),
        toast,
        notify: setToast,
        online,
        pendingSync,
        needsAttention,
        syncing,
        lastSync,
        syncOperations: operations,
        queuePreferenceChange: (payload) => void queueChange('update-preferences', payload),
        retrySync: (operation) => void retryOperation(operation),
        clearOfflineData
    }}>{children}
        <div className="fixed bottom-10 left-1/2 z-[70] -translate-x-1/2" role="status" aria-live="polite">{toast &&
            <div className="rounded-md bg-navy px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}</div>
    </CareConnectContext.Provider>
}
