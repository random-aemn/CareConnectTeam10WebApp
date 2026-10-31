import {useCallback, useEffect, useState} from 'react'

interface InstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{outcome: 'accepted' | 'dismissed'; platform: string}>
}

const VISITS_KEY = 'careconnect-pwa-visits-v1'
const DISMISSED_KEY = 'careconnect-pwa-install-dismissed-v1'
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000

export function hasUnsavedPwaWork() {
    return Boolean(document.querySelector('[data-pwa-unsaved="true"]'))
}

export function usePwaLifecycle(pathname: string) {
    const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)
    const [engaged, setEngaged] = useState(false)
    const [updateRegistration, setUpdateRegistration] = useState<ServiceWorkerRegistration | null>(null)
    const [updateBlocked, setUpdateBlocked] = useState(false)
    const [standalone, setStandalone] = useState(() => window.matchMedia?.('(display-mode: standalone)').matches ?? false)
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

    useEffect(() => {
        const alreadyCounted = sessionStorage.getItem('careconnect-pwa-visit-counted') === 'true'
        const visits = Number(localStorage.getItem(VISITS_KEY) ?? '0') + (alreadyCounted ? 0 : 1)
        if (!alreadyCounted) {
            localStorage.setItem(VISITS_KEY, String(visits))
            sessionStorage.setItem('careconnect-pwa-visit-counted', 'true')
        }
        if (visits >= 2) setEngaged(true)
        const engagementTimer = window.setTimeout(() => setEngaged(true), 30_000)
        const installPrompt = (event: Event) => {
            event.preventDefault()
            setPrompt(event as InstallPromptEvent)
        }
        const installed = () => {
            setPrompt(null)
            setStandalone(true)
        }
        const workflowCompleted = () => setEngaged(true)
        window.addEventListener('beforeinstallprompt', installPrompt)
        window.addEventListener('appinstalled', installed)
        window.addEventListener('careconnect:workflow-complete', workflowCompleted)

        const controllerChanged = () => window.location.reload()
        if ('serviceWorker' in navigator) {
            if (import.meta.env.PROD) {
                void navigator.serviceWorker.register('/sw.js', {updateViaCache: 'none'}).then((registration) => {
                    if (registration.waiting) setUpdateRegistration(registration)
                    registration.addEventListener('updatefound', () => {
                        const worker = registration.installing
                        worker?.addEventListener('statechange', () => {
                            if (worker.state === 'installed' && navigator.serviceWorker.controller) setUpdateRegistration(registration)
                        })
                    })
                    void registration.update()
                })
                navigator.serviceWorker.addEventListener('controllerchange', controllerChanged)
            } else {
                void navigator.serviceWorker.getRegistrations()
                    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
                    .then(async () => {
                        if (!('caches' in globalThis)) return
                        const keys = await caches.keys()
                        await Promise.all(keys.filter((key) => key.startsWith('careconnect-')).map((key) => caches.delete(key)))
                    })
                    .catch(() => undefined)
            }
        }
        return () => {
            window.clearTimeout(engagementTimer)
            window.removeEventListener('beforeinstallprompt', installPrompt)
            window.removeEventListener('appinstalled', installed)
            window.removeEventListener('careconnect:workflow-complete', workflowCompleted)
            navigator.serviceWorker?.removeEventListener('controllerchange', controllerChanged)
        }
    }, [])

    useEffect(() => {
        const viewed = new Set(JSON.parse(sessionStorage.getItem('careconnect-pwa-pages') ?? '[]') as string[])
        viewed.add(pathname)
        sessionStorage.setItem('careconnect-pwa-pages', JSON.stringify([...viewed]))
        if (viewed.size >= 3) setEngaged(true)
    }, [pathname])

    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) ?? '0')
    const recentlyDismissed = Date.now() - dismissedAt < DISMISS_MS
    const showInstall = engaged && !standalone && !recentlyDismissed && (Boolean(prompt) || isIos)

    const install = useCallback(async () => {
        if (!prompt) return
        await prompt.prompt()
        const choice = await prompt.userChoice
        if (choice.outcome === 'dismissed') localStorage.setItem(DISMISSED_KEY, String(Date.now()))
        setPrompt(null)
    }, [prompt])

    const dismissInstall = () => {
        localStorage.setItem(DISMISSED_KEY, String(Date.now()))
        setEngaged(false)
    }

    const applyUpdate = () => {
        if (hasUnsavedPwaWork()) {
            setUpdateBlocked(true)
            return
        }
        setUpdateBlocked(false)
        updateRegistration?.waiting?.postMessage({type: 'SKIP_WAITING'})
    }

    return {showInstall, canPromptInstall: Boolean(prompt), isIos, standalone, install, dismissInstall, updateAvailable: Boolean(updateRegistration), updateBlocked, applyUpdate, deferUpdate: () => setUpdateRegistration(null)}
}
