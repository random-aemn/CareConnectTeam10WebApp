import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {clearOperationStore, createOperation, listOperations, saveOperation} from './syncQueue'
import {clearOfflineState, loadOfflineState, saveOfflineState} from './offlineState'
import {initialState} from '../state/careConnectState'
import {hasUnsavedPwaWork} from '../hooks/usePwaLifecycle'

describe('PWA configuration', () => {
    afterEach(async () => {
        await clearOperationStore()
        await clearOfflineState()
        localStorage.clear()
    })

    it('provides the required install identity, icons, categories, and shortcuts', () => {
        const manifest = JSON.parse(readFileSync(resolve('public/manifest.webmanifest'), 'utf8'))
        expect(manifest.display).toBe('standalone')
        expect(manifest.start_url).toBe('/overview')
        expect(manifest.categories).toEqual(expect.arrayContaining(['health', 'medical', 'productivity']))
        expect(manifest.icons).toEqual(expect.arrayContaining([
            expect.objectContaining({sizes: '192x192'}),
            expect.objectContaining({sizes: '512x512', purpose: 'any'}),
            expect.objectContaining({sizes: '512x512', purpose: 'maskable'})
        ]))
        expect(manifest.shortcuts).toHaveLength(4)
    })

    it('uses user-controlled service-worker activation and bounded caches', () => {
        const worker = readFileSync(resolve('public/sw.js'), 'utf8')
        expect(worker).toContain("event.data?.type === 'SKIP_WAITING'")
        expect(worker).toContain('async function trim')
        expect(worker).not.toMatch(/install[\s\S]{0,300}skipWaiting/)
    })

    it('persists queued operations', async () => {
        const operation = createOperation('send-message', {subject: 'Demo'})
        await saveOperation(operation)
        expect(await listOperations()).toEqual([expect.objectContaining({id: operation.id, status: 'waiting'})])
    })

    it('persists approved offline records in IndexedDB', async () => {
        expect(await saveOfflineState(initialState)).toBe(true)
        expect(await loadOfflineState()).toEqual(initialState)
        await clearOfflineState()
        expect(await loadOfflineState()).toBeNull()
    })

    it('preserves an update while an unsaved workflow is open', () => {
        const form = document.createElement('form')
        form.dataset.pwaUnsaved = 'true'
        document.body.append(form)
        expect(hasUnsavedPwaWork()).toBe(true)
        form.remove()
        expect(hasUnsavedPwaWork()).toBe(false)
    })

    it('defines age limits for shell, static, navigation, and approved data caches', () => {
        const worker = readFileSync(resolve('public/sw.js'), 'utf8')
        expect(worker).toContain('SHELL_MAX_AGE')
        expect(worker).toContain('STATIC_MAX_AGE')
        expect(worker).toContain('NAVIGATION_MAX_AGE')
        expect(worker).toContain('5 * 60 * 1000')
        expect(worker).toContain('matchFresh')
    })
})
