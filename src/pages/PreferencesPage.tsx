import { Card, Button } from '../components/ui/Primitives'
import { PageLayout } from '../components/ui/PageLayout'
import { Trash2 } from 'lucide-react'
import { useCareConnect } from '../state/CareConnectContext'
import { useState } from 'react'

const preferences = [
  ['Desktop notifications', 'Appointments, medications, and new messages'],
  ['Compact layout', 'Show more information in the workspace'],
  ['Appointment reminders', 'Receive a reminder before upcoming visits'],
]

type Preferences = {
  desktopNotifications: boolean
  compactLayout: boolean
  appointmentReminders: boolean
  startPage: string
}

const storageKey = 'careconnect-web-preferences-v1'
const defaults: Preferences = { desktopNotifications: true, compactLayout: false, appointmentReminders: true, startPage: 'Overview' }

function loadPreferences(): Preferences {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
  } catch {
    return defaults
  }
}

export default function PreferencesPage() {
  const { openModal, notify } = useCareConnect()
  const [saved, setSaved] = useState(loadPreferences)
  const [draft, setDraft] = useState(saved)
  const booleanKeys: Array<keyof Pick<Preferences, 'desktopNotifications' | 'compactLayout' | 'appointmentReminders'>> = ['desktopNotifications', 'compactLayout', 'appointmentReminders']

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(draft))
    setSaved(draft)
    notify('Preferences saved')
  }

  return <PageLayout title="Preferences" description="Customize CareConnect for this device.">
    <Card className="max-w-3xl overflow-hidden">{preferences.map(([title, description], i) => <label key={title} className="flex cursor-pointer items-center justify-between border-b border-border p-5"><span><strong className="block text-sm text-ink">{title}</strong><span className="mt-1 block text-[11px] text-muted">{description}</span></span><input type="checkbox" checked={draft[booleanKeys[i]]} onChange={(event) => setDraft({ ...draft, [booleanKeys[i]]: event.target.checked })} className="size-4 accent-[#1177e8]" /></label>)}<label className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><span><strong className="block text-sm text-ink">Start page</strong><span className="mt-1 block text-[11px] text-muted">Choose the first page shown at sign in</span></span><select value={draft.startPage} onChange={(event) => setDraft({ ...draft, startPage: event.target.value })} className="h-10 rounded-md border border-[#b8c8d3] bg-white px-3 text-sm"><option>Overview</option><option>Appointments</option><option>Messages</option></select></label><div className="flex justify-end gap-2 bg-[#f8fafb] p-4"><Button variant="secondary" onClick={() => setDraft(saved)}>Cancel</Button><Button onClick={save}>Save changes</Button></div></Card><Card className="mt-5 max-w-3xl p-5"><h2 className="font-bold text-ink">Demo data</h2><p className="mt-1 text-xs text-muted">Restore appointments, medications, messages, and notifications to their initial values. Your saved preferences are retained.</p><Button className="mt-4 bg-[#b42318]" onClick={() => openModal({ type: 'reset-data' })}><Trash2 size={16} />Reset demo data</Button></Card>
  </PageLayout>
}
