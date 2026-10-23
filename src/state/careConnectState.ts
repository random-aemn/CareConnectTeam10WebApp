import {appointments, medications, messages, type Appointment, type Medication, type Message} from '../data/careconnect'

export interface NotificationItem {
    id: number;
    title: string;
    detail: string;
    route: string;
    read: boolean
}

export interface AppState {
    appointments: Appointment[];
    medications: Medication[];
    messages: Message[];
    notifications: NotificationItem[];
    selectedMessageId: number
}

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

export const initialState: AppState = {
    appointments, medications, messages, selectedMessageId: messages[0].id,
    notifications: [
        {
            id: 1,
            title: 'Two unread messages',
            detail: 'New updates from your care team',
            route: '/messages',
            read: false
        },
        {
            id: 2,
            title: 'Two missed doses',
            detail: 'Review today’s medication schedule',
            route: '/medications',
            read: false
        },
        {id: 3, title: 'Upcoming appointment', detail: 'Dr. Sarah Chen at 5:15 PM', route: '/appointments', read: true},
    ],
}

export function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'add-appointment':
            return {...state, appointments: [...state.appointments, action.appointment]}
        case 'update-appointment':
            return {
                ...state,
                appointments: state.appointments.map((item) => item.id === action.appointment.id ? action.appointment : item)
            }
        case 'cancel-appointment':
            return {
                ...state,
                appointments: state.appointments.map((item) => item.id === action.id ? {
                    ...item,
                    status: 'Cancelled'
                } : item)
            }
        case 'add-medication':
            return {...state, medications: [...state.medications, action.medication]}
        case 'toggle-medication-dose':
            return {
                ...state, medications: state.medications.map((item) => {
                    if (item.id !== action.id) return item
                    const doses = item.takenDoses ?? []
                    const takenDoses = doses.includes(action.doseKey) ? doses.filter((key) => key !== action.doseKey) : [...doses, action.doseKey]
                    return {...item, takenDoses, status: takenDoses.length ? 'On track' : item.status}
                })
            }
        case 'send-message':
            return {...state, messages: [action.message, ...state.messages], selectedMessageId: action.message.id}
        case 'reply-message':
            return {
                ...state,
                messages: state.messages.map((item) => item.id === action.id ? {
                    ...item,
                    body: `${item.body}\n\nJordan: ${action.body}`,
                    preview: action.body,
                    time: 'Just now',
                    unread: false
                } : item)
            }
        case 'select-message':
            return {
                ...state,
                selectedMessageId: action.id,
                messages: state.messages.map((item) => item.id === action.id ? {...item, unread: false} : item)
            }
        case 'read-notification':
            return {
                ...state,
                notifications: state.notifications.map((item) => item.id === action.id ? {...item, read: true} : item)
            }
        case 'reset':
            return initialState
    }
}

const STORAGE_KEY = 'careconnect-web-demo-state-v1'

export function loadState(): AppState {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<AppState> | null
        if (!parsed || !Array.isArray(parsed.appointments) || !Array.isArray(parsed.medications) || !Array.isArray(parsed.messages)) return initialState
        return {
            ...initialState,
            ...parsed,
            messages: parsed.messages.map((message) => ({
                ...message,
                direction: message.direction ?? (message.sender === 'You' || message.sender === 'Jordan Davis' ? 'outgoing' : 'incoming'),
                recipient: message.recipient ?? (message.sender === 'You' || message.sender === 'Jordan Davis' ? 'Care team' : 'Jordan Davis')
            }))
        }
    } catch {
        return initialState
    }
}

export function saveState(state: AppState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
