import type {AppState} from '../state/careConnectState'

const DATABASE = 'careconnect-demo-offline-v1'
const DATABASE_VERSION = 2
const STORE = 'app-state'
const RECORD_KEY = 'current'
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000

interface StoredState {
    key: string
    savedAt: string
    state: AppState
}

function openDatabase(): Promise<IDBDatabase | null> {
    if (!('indexedDB' in globalThis)) return Promise.resolve(null)
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE, DATABASE_VERSION)
        request.onupgradeneeded = () => {
            const database = request.result
            if (!database.objectStoreNames.contains('operations')) database.createObjectStore('operations', {keyPath: 'id'})
            if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE, {keyPath: 'key'})
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function loadOfflineState(): Promise<AppState | null> {
    const database = await openDatabase()
    if (!database) return null
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE, 'readonly')
        const request = transaction.objectStore(STORE).get(RECORD_KEY)
        request.onsuccess = () => {
            const record = request.result as StoredState | undefined
            if (!record || Date.now() - new Date(record.savedAt).getTime() > RETENTION_MS) resolve(null)
            else resolve(record.state)
        }
        request.onerror = () => reject(request.error)
        transaction.oncomplete = () => database.close()
    })
}

export async function saveOfflineState(state: AppState) {
    const database = await openDatabase()
    if (!database) return false
    return new Promise<boolean>((resolve, reject) => {
        const transaction = database.transaction(STORE, 'readwrite')
        transaction.objectStore(STORE).put({key: RECORD_KEY, savedAt: new Date().toISOString(), state} satisfies StoredState)
        transaction.oncomplete = () => {
            database.close()
            resolve(true)
        }
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function clearOfflineState() {
    const database = await openDatabase()
    if (!database) return
    return new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(STORE, 'readwrite')
        transaction.objectStore(STORE).clear()
        transaction.oncomplete = () => {
            database.close()
            resolve()
        }
        transaction.onerror = () => reject(transaction.error)
    })
}
