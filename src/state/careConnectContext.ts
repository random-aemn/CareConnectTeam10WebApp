import {createContext, useContext} from 'react'
import type {Appointment, Message} from '../data/careconnect'
import type {AppAction, AppState} from './careConnectState'
import type {QueuedOperation} from '../pwa/syncQueue'

export type ModalState =
    | { type: 'appointment'; appointment?: Appointment }
    | { type: 'message'; replyTo?: Message; recipient?: string }
    | { type: 'telehealth'; appointment: Appointment }
    | { type: 'appointment-details'; appointment: Appointment }
    | { type: 'cancel-appointment'; appointment: Appointment }
    | { type: 'discard-medication'; onDiscard: () => void }
    | { type: 'reset-data' }
    | { type: 'help' }
    | null

export interface CareConnectValue {
    state: AppState;
    dispatch: (action: AppAction) => void;
    modal: ModalState;
    openModal: (modal: Exclude<ModalState, null>) => void;
    closeModal: () => void;
    toast: string;
    notify: (message: string) => void;
    online: boolean;
    pendingSync: number;
    needsAttention: number;
    syncing: boolean;
    lastSync: string | null;
    syncOperations: QueuedOperation[];
    queuePreferenceChange: (payload: unknown) => void;
    retrySync: (operation: QueuedOperation) => void;
    clearOfflineData: () => Promise<void>
}

export const CareConnectContext = createContext<CareConnectValue | null>(null)

export function useCareConnect() {
    const value = useContext(CareConnectContext);
    if (!value) throw new Error('useCareConnect must be used inside CareConnectProvider');
    return value
}
