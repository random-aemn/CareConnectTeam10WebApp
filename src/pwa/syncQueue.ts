export type SyncStatus = 'waiting' | 'syncing' | 'synced' | 'needs-attention'

export interface QueuedOperation {
    id: string
    type: string
    payload: unknown
    createdAt: string
    updatedAt: string
    attempts: number
    status: SyncStatus
    error?: string
}

const DATABASE = 'careconnect-demo-offline-v1'
const DATABASE_VERSION = 2
const STORE = 'operations'
const FALLBACK_KEY = 'careconnect-demo-sync-queue-v1'
const SYNC_HISTORY_RETENTION_MS = 7 * 24 * 60 * 60 * 1000

function fallbackRead(): QueuedOperation[] {
    try {
        return JSON.parse(localStorage.getItem(FALLBACK_KEY) ?? '[]') as QueuedOperation[]
    } catch {
        return []
    }
}

function fallbackWrite(operations: QueuedOperation[]) {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(operations))
}

function openDatabase(): Promise<IDBDatabase | null> {
    if (!('indexedDB' in globalThis)) return Promise.resolve(null)
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE, DATABASE_VERSION)
        request.onupgradeneeded = () => {
            const database = request.result
            if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE, {keyPath: 'id'})
            if (!database.objectStoreNames.contains('app-state')) database.createObjectStore('app-state', {keyPath: 'key'})
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
    const database = await openDatabase()
    if (!database) return null
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE, mode)
        const request = action(transaction.objectStore(STORE))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
        transaction.oncomplete = () => database.close()
    })
}

export async function listOperations(): Promise<QueuedOperation[]> {
    const records = await withStore<QueuedOperation[]>('readonly', (store) => store.getAll())
    const all = records ?? fallbackRead()
    const retained = all.filter((item) => item.status !== 'synced' || Date.now() - new Date(item.updatedAt).getTime() <= SYNC_HISTORY_RETENTION_MS)
    if (retained.length !== all.length) {
        if (records) await Promise.all(all.filter((item) => !retained.includes(item)).map((item) => withStore('readwrite', (store) => store.delete(item.id))))
        else fallbackWrite(retained)
    }
    return retained.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function saveOperation(operation: QueuedOperation) {
    const result = await withStore<IDBValidKey>('readwrite', (store) => store.put(operation))
    if (result === null) fallbackWrite([...fallbackRead().filter((item) => item.id !== operation.id), operation])
}

export async function clearOperationStore() {
    const result = await withStore<undefined>('readwrite', (store) => store.clear())
    if (result === null) localStorage.removeItem(FALLBACK_KEY)
}

export async function clearCareConnectCaches() {
    if (!('caches' in globalThis)) return
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key.startsWith('careconnect-')).map((key) => caches.delete(key)))
}

export function createOperation(type: string, payload: unknown): QueuedOperation {
    const now = new Date().toISOString()
    return {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        payload,
        createdAt: now,
        updatedAt: now,
        attempts: 0,
        status: 'waiting'
    }
}
