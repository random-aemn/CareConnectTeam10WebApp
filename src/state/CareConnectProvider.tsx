import {useCallback, useEffect, useReducer, useState, type ReactNode} from 'react'
import {useOnlineQueue} from '../hooks/useOnlineQueue'
import {CareConnectContext, type ModalState} from './careConnectContext'
import {appReducer, loadState, saveState, type AppAction} from './careConnectState'

export function CareConnectProvider({children}: { children: ReactNode }) {
    const [state, rawDispatch] = useReducer(appReducer, undefined, loadState)
    const [modal, setModal] = useState<ModalState>(null)
    const [toast, setToast] = useState('')
    const handleSynced = useCallback((count: number) => setToast(`${count} offline change${count === 1 ? '' : 's'} synced.`), [])
    const {online, pendingSync, queueChange} = useOnlineQueue(handleSynced)
    const dispatch = (action: AppAction) => {
        rawDispatch(action);
        if (!['select-message', 'read-notification'].includes(action.type)) queueChange()
    }
    useEffect(() => saveState(state), [state])
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
        pendingSync
    }}>{children}
        <div className="fixed bottom-10 left-1/2 z-[70] -translate-x-1/2" role="status" aria-live="polite">{toast &&
            <div className="rounded-md bg-navy px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}</div>
    </CareConnectContext.Provider>
}
