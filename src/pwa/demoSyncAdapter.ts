import type {QueuedOperation} from './syncQueue'

export interface SyncResult {
    confirmed: boolean
    message?: string
}

export interface SyncAdapter {
    submit(operation: QueuedOperation): Promise<SyncResult>
}

export const demoSyncAdapter: SyncAdapter = {
    async submit() {
        await new Promise((resolve) => window.setTimeout(resolve, 350))
        if (localStorage.getItem('careconnect-demo-force-sync-failure') === 'true') {
            return {confirmed: false, message: 'Demo synchronization is temporarily unavailable.'}
        }
        return {confirmed: true}
    }
}
