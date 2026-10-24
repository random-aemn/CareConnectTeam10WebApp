const VERSION = 'v3'
const SHELL_CACHE = `careconnect-shell-${VERSION}`
const STATIC_CACHE = `careconnect-static-${VERSION}`
const RUNTIME_CACHE = `careconnect-runtime-${VERSION}`
const DATA_CACHE = `careconnect-data-${VERSION}`
const CACHE_PREFIX = 'careconnect-'
const SHELL_MAX_AGE = 30 * 24 * 60 * 60 * 1000
const STATIC_MAX_AGE = 30 * 24 * 60 * 60 * 1000
const NAVIGATION_MAX_AGE = 7 * 24 * 60 * 60 * 1000
const CORE = ['/', '/overview', '/offline.html', '/manifest.webmanifest', '/careconnect.svg', '/icons/careconnect-192.png', '/icons/careconnect-512.png', '/icons/careconnect-maskable-512.png', '/icons/apple-touch-icon.png', '/icons/shortcut-appointments.png', '/icons/shortcut-messages.png', '/icons/shortcut-medication.png', '/icons/shortcut-request.png']

function canCache(request, response) {
    if (!response || response.status !== 200 || !['basic', 'cors'].includes(response.type)) return false
    if (request.headers.has('authorization')) return false
    return !/no-store|private/i.test(response.headers.get('cache-control') ?? '')
}

function stampedResponse(response) {
    const headers = new Headers(response.headers)
    headers.set('x-careconnect-cached-at', String(Date.now()))
    return new Response(response.clone().body, {status: response.status, statusText: response.statusText, headers})
}

async function putStamped(cache, request, response) {
    if (canCache(request, response)) await cache.put(request, stampedResponse(response))
}

async function matchFresh(cache, request, maximumAge) {
    const cached = await cache.match(request)
    if (!cached) return undefined
    const cachedAt = Number(cached.headers.get('x-careconnect-cached-at') ?? '0')
    if (cachedAt && Date.now() - cachedAt <= maximumAge) return cached
    await cache.delete(request)
    return undefined
}

async function fetchAndStore(cache, url) {
    const request = new Request(new URL(url, self.location.origin))
    const response = await fetch(request)
    await putStamped(cache, request, response)
}

async function discoverBuildAssets() {
    try {
        const response = await fetch('/', {cache: 'no-store'})
        const html = await response.clone().text()
        const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map((match) => match[1])
        const cache = await caches.open(SHELL_CACHE)
        await putStamped(cache, new Request(new URL('/', self.location.origin)), response)
        await Promise.allSettled(assets.map((asset) => fetchAndStore(cache, asset)))
    } catch {
        // The offline fallback remains available if build-asset discovery fails.
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(Promise.all([
        caches.open(SHELL_CACHE).then((cache) => Promise.allSettled(CORE.map((url) => fetchAndStore(cache, url)))),
        discoverBuildAssets()
    ]))
})

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && ![SHELL_CACHE, STATIC_CACHE, RUNTIME_CACHE, DATA_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()))
})

async function trim(cacheName, maximum) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    await Promise.all(keys.slice(0, Math.max(0, keys.length - maximum)).map((key) => cache.delete(key)))
}

async function networkFirst(request, cacheName, fallback, maximumAge) {
    const cache = await caches.open(cacheName)
    try {
        const response = await fetch(request)
        await putStamped(cache, request, response)
        void trim(cacheName, 40)
        return response
    } catch {
        return await matchFresh(cache, request, maximumAge) ?? await caches.match(fallback) ?? await caches.match('/offline.html')
    }
}

async function cacheFirst(request) {
    const shell = await caches.open(SHELL_CACHE)
    const shellCached = await matchFresh(shell, request, SHELL_MAX_AGE)
    if (shellCached) return shellCached
    const cache = await caches.open(STATIC_CACHE)
    const cached = await matchFresh(cache, request, STATIC_MAX_AGE)
    if (cached) return cached
    const response = await fetch(request)
    if (canCache(request, response)) {
        await putStamped(cache, request, response)
        void trim(STATIC_CACHE, 80)
    }
    return response
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(STATIC_CACHE)
    const shell = await caches.open(SHELL_CACHE)
    const cached = await matchFresh(shell, request, SHELL_MAX_AGE) ?? await matchFresh(cache, request, STATIC_MAX_AGE)
    const update = fetch(request).then(async (response) => {
        await putStamped(cache, request, response)
        void trim(STATIC_CACHE, 80)
        return response
    }).catch(() => undefined)
    return cached ?? await update
}

async function dataNetworkFirst(request) {
    const cache = await caches.open(DATA_CACHE)
    try {
        const response = await fetch(request)
        if (canCache(request, response)) {
            await cache.put(request, stampedResponse(response))
            void trim(DATA_CACHE, 20)
        }
        return response
    } catch {
        const cached = await cache.match(request)
        const cachedAt = Number(cached?.headers.get('x-careconnect-cached-at') ?? '0')
        if (cached && Date.now() - cachedAt <= 5 * 60 * 1000) return cached
        return caches.match('/offline.html')
    }
}

self.addEventListener('fetch', (event) => {
    const request = event.request
    const url = new URL(request.url)
    if (request.method !== 'GET' || url.origin !== self.location.origin) return
    if (request.mode === 'navigate') return event.respondWith(networkFirst(request, RUNTIME_CACHE, '/', NAVIGATION_MAX_AGE))
    if (url.pathname.startsWith('/api/health/')) return event.respondWith(dataNetworkFirst(request))
    if (request.destination === 'image') return event.respondWith(staleWhileRevalidate(request))
    if (['script', 'style', 'font', 'worker', 'manifest'].includes(request.destination) || url.pathname.startsWith('/assets/')) event.respondWith(cacheFirst(request))
})

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') void self.skipWaiting()
    if (event.data?.type === 'CLEAR_CACHES') event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX)).map((key) => caches.delete(key)))))
})
