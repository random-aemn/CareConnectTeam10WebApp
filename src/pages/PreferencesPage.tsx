import {Card, Button} from '../components/ui/Primitives'
import {PageLayout} from '../components/ui/PageLayout'
import {Trash2} from 'lucide-react'
import {useCareConnect} from '../state/careConnectContext'
import {useState} from 'react'

const preferences = [
    ['Desktop notifications', 'Appointments, medications, and new messages'],
    ['Compact layout', 'Show more information in the workspace'],
    ['Appointment reminders', 'Receive a reminder before upcoming visits'],
    ['Offline demo storage', 'Keep approved demo records available on this device for up to 30 days'],
]

type Preferences = {
    desktopNotifications: boolean
    compactLayout: boolean
    appointmentReminders: boolean
    offlineStorage: boolean
    startPage: string
}

const storageKey = 'careconnect-web-preferences-v1'
const defaults: Preferences = {
    desktopNotifications: true,
    compactLayout: false,
    appointmentReminders: true,
    offlineStorage: true,
    startPage: 'Overview'
}

function loadPreferences(): Preferences {
    try {
        const saved = localStorage.getItem(storageKey)
        return saved ? {...defaults, ...JSON.parse(saved)} : defaults
    } catch {
        return defaults
    }
}

export default function PreferencesPage() {
    const {openModal, queuePreferenceChange, clearOfflineData, syncOperations, retrySync, lastSync} = useCareConnect()
    const [saved, setSaved] = useState(loadPreferences)
    const [draft, setDraft] = useState(saved)
    const booleanKeys: Array<keyof Pick<Preferences, 'desktopNotifications' | 'compactLayout' | 'appointmentReminders' | 'offlineStorage'>> = ['desktopNotifications', 'compactLayout', 'appointmentReminders', 'offlineStorage']

    const save = () => {
        localStorage.setItem(storageKey, JSON.stringify(draft))
        setSaved(draft)
        if (draft.offlineStorage) queuePreferenceChange(draft)
        else void clearOfflineData()
    }

    return <PageLayout title="Preferences" description="Customize CareConnect for this device."><div data-pwa-unsaved={JSON.stringify(draft) !== JSON.stringify(saved)}>
        <Card className="max-w-3xl overflow-hidden">{preferences.map(([title, description], i) => <label key={title}
                                                                                                         className="flex cursor-pointer items-center justify-between border-b border-border p-5"><span><strong
            className="block text-sm text-ink">{title}</strong><span
            className="mt-1 block text-[11px] text-muted">{description}</span></span><input type="checkbox"
                                                                                            checked={draft[booleanKeys[i]]}
                                                                                            onChange={(event) => setDraft({
                                                                                                ...draft,
                                                                                                [booleanKeys[i]]: event.target.checked
                                                                                            })}
                                                                                            className="size-4 accent-[#0b68cf]"/></label>)}<label
            className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><span><strong
            className="block text-sm text-ink">Start page</strong><span className="mt-1 block text-[11px] text-muted">Choose the first page shown at sign in</span></span><select
            value={draft.startPage} onChange={(event) => setDraft({...draft, startPage: event.target.value})}
            className="h-10 rounded-md border border-[#718692] bg-white px-3 text-sm">
            <option>Overview</option>
            <option>Appointments</option>
            <option>Messages</option>
        </select></label>
            <div className="flex justify-end gap-2 bg-[#f8fafb] p-4"><Button variant="secondary"
                                                                             onClick={() => setDraft(saved)}>Cancel</Button><Button
                onClick={save}>Save changes</Button></div>
        </Card><Card className="mt-5 max-w-3xl p-5"><h2 className="font-bold text-ink">Demo data</h2><p
        className="mt-1 text-xs text-muted">Restore appointments, medications, messages, and notifications to their
        initial values. Your saved preferences are retained.</p><Button className="mt-4 bg-[#b42318]"
                                                                        onClick={() => openModal({type: 'reset-data'})}><Trash2
        size={16}/>Reset demo data</Button></Card>
        <Card className="mt-5 max-w-3xl p-5"><h2 className="font-bold text-ink">Offline data and demo synchronization</h2>
            <p className="mt-1 text-xs text-muted">This prototype stores approved demo data on this device only. It does not send information to a healthcare system.</p>
            <p className="mt-3 text-xs"><strong>Last demo sync:</strong> {lastSync ? new Date(lastSync).toLocaleString() : 'Not yet synchronized'}</p>
            {syncOperations.length > 0 && <ul className="mt-4 space-y-2" aria-label="Synchronization activity">{syncOperations.slice(0, 8).map((operation) => <li key={operation.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-canvas p-3 text-xs"><span><strong className="block">{operation.type.replaceAll('-', ' ')}</strong><span className="text-muted">{operation.status.replace('-', ' ')}</span></span>{operation.status === 'needs-attention' && <Button variant="secondary" onClick={() => retrySync(operation)}>Retry</Button>}</li>)}</ul>}
            <Button className="mt-4 bg-[#b42318]" onClick={() => {
                if (window.confirm('Clear locally stored demo records, queued changes, and CareConnect caches from this device?')) {
                    const withoutOfflineStorage = {...draft, offlineStorage: false}
                    localStorage.setItem(storageKey, JSON.stringify(withoutOfflineStorage))
                    setDraft(withoutOfflineStorage)
                    setSaved(withoutOfflineStorage)
                    void clearOfflineData()
                }
            }}><Trash2 size={16}/>Clear offline data</Button>
        </Card></div>
    </PageLayout>
}
