import {useEffect, useState} from 'react'

export function useOnlineQueue(onSynced: (count: number) => void) {
    const [online, setOnline] = useState(() => navigator.onLine)
    const [pendingSync, setPendingSync] = useState(0)
    useEffect(() => {
        const goOffline = () => setOnline(false)
        const goOnline = () => {
            setOnline(true);
            setPendingSync((count) => {
                if (count) onSynced(count);
                return 0
            })
        }
        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline)
        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline)
        }
    }, [onSynced])
    return {
        online, pendingSync, queueChange: () => {
            if (!navigator.onLine) setPendingSync((count) => count + 1)
        }
    }
}
