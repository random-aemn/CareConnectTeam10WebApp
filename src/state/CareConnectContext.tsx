import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react'
import { appointments, medications, messages, type Appointment, type Medication, type Message } from '../data/careconnect'

export interface NotificationItem { id: number; title: string; detail: string; route: string; read: boolean }
export interface AppState { appointments: Appointment[]; medications: Medication[]; messages: Message[]; notifications: NotificationItem[]; selectedMessageId: number }
export type AppAction =
  | { type: 'add-appointment'; appointment: Appointment }
  | { type: 'update-appointment'; appointment: Appointment }
  | { type: 'cancel-appointment'; id: number }
  | { type: 'add-medication'; medication: Medication }
  | { type: 'toggle-medication-dose'; id: number; doseKey: string }
  | { type: 'send-message'; message: Message }
  | { type: 'reply-message'; id: number; body: string }
  | { type: 'select-message'; id: number }
  | { type: 'read-notification'; id: number }
  | { type: 'reset' }

export type ModalState =
  | { type: 'appointment'; appointment?: Appointment }
  | { type: 'message'; replyTo?: Message }
  | { type: 'telehealth'; appointment: Appointment }
  | { type: 'appointment-details'; appointment: Appointment }
  | { type: 'cancel-appointment'; appointment: Appointment }
  | { type: 'discard-medication'; onDiscard: () => void }
  | { type: 'reset-data' }
  | null

export const initialState: AppState = {
  appointments,
  medications,
  messages,
  selectedMessageId: messages[0].id,
  notifications: [
    { id: 1, title: 'Two unread messages', detail: 'New updates from your care team', route: '/messages', read: false },
    { id: 2, title: 'Two missed doses', detail: 'Review today’s medication schedule', route: '/medications', read: false },
    { id: 3, title: 'Upcoming appointment', detail: 'Dr. Sarah Chen at 5:15 PM', route: '/appointments', read: true },
  ],
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'add-appointment': return { ...state, appointments: [...state.appointments, action.appointment] }
    case 'update-appointment': return { ...state, appointments: state.appointments.map((item) => item.id === action.appointment.id ? action.appointment : item) }
    case 'cancel-appointment': return { ...state, appointments: state.appointments.map((item) => item.id === action.id ? { ...item, status: 'Cancelled' } : item) }
    case 'add-medication': return { ...state, medications: [...state.medications, action.medication] }
    case 'toggle-medication-dose': return { ...state, medications: state.medications.map((item) => {
      if (item.id !== action.id) return item
      const doses = item.takenDoses ?? []
      const takenDoses = doses.includes(action.doseKey) ? doses.filter((key) => key !== action.doseKey) : [...doses, action.doseKey]
      return { ...item, takenDoses, status: takenDoses.length ? 'On track' : item.status }
    }) }
    case 'send-message': return { ...state, messages: [action.message, ...state.messages], selectedMessageId: action.message.id }
    case 'reply-message': return { ...state, messages: state.messages.map((item) => item.id === action.id ? { ...item, body: `${item.body}\n\nJordan: ${action.body}`, preview: action.body, time: 'Just now', unread: false } : item) }
    case 'select-message': return { ...state, selectedMessageId: action.id, messages: state.messages.map((item) => item.id === action.id ? { ...item, unread: false } : item) }
    case 'read-notification': return { ...state, notifications: state.notifications.map((item) => item.id === action.id ? { ...item, read: true } : item) }
    case 'reset': return initialState
  }
}

const STORAGE_KEY = 'careconnect-web-demo-state-v1'
function loadState(): AppState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<AppState> | null
    if (!parsed || !Array.isArray(parsed.appointments) || !Array.isArray(parsed.medications) || !Array.isArray(parsed.messages)) return initialState
    return { ...initialState, ...parsed }
  } catch { return initialState }
}

interface ContextValue { state: AppState; dispatch: Dispatch<AppAction>; modal: ModalState; openModal: (modal: Exclude<ModalState, null>) => void; closeModal: () => void; toast: string; notify: (message: string) => void }
const CareConnectContext = createContext<ContextValue | null>(null)

export function CareConnectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)
  const [modal, setModal] = useState<ModalState>(null)
  const [toast, setToast] = useState('')
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3500); return () => window.clearTimeout(timer) }, [toast])
  return <CareConnectContext.Provider value={{ state, dispatch, modal, openModal: setModal, closeModal: () => setModal(null), toast, notify: setToast }}>{children}<div className="fixed bottom-10 left-1/2 z-[70] -translate-x-1/2" role="status" aria-live="polite">{toast && <div className="rounded-md bg-navy px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}</div></CareConnectContext.Provider>
}

export function useCareConnect() { const value = useContext(CareConnectContext); if (!value) throw new Error('useCareConnect must be used inside CareConnectProvider'); return value }
