import { Card, Button } from '../components/ui/Primitives'
import { PageLayout } from '../components/ui/PageLayout'

const preferences = [
  ['Desktop notifications', 'Appointments, medications, and new messages'],
  ['Compact layout', 'Show more information in the workspace'],
  ['Appointment reminders', 'Receive a reminder before upcoming visits'],
]

export default function PreferencesPage() {
  return <PageLayout title="Preferences" description="Customize CareConnect for this device.">
    <Card className="max-w-3xl overflow-hidden">{preferences.map(([title, description], i) => <label key={title} className="flex cursor-pointer items-center justify-between border-b border-border p-5"><span><strong className="block text-sm text-ink">{title}</strong><span className="mt-1 block text-[11px] text-muted">{description}</span></span><input type="checkbox" defaultChecked={i !== 1} className="size-4 accent-[#1177e8]" /></label>)}<label className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><span><strong className="block text-sm text-ink">Start page</strong><span className="mt-1 block text-[11px] text-muted">Choose the first page shown at sign in</span></span><select className="h-10 rounded-md border border-[#b8c8d3] bg-white px-3 text-sm"><option>Overview</option><option>Appointments</option><option>Messages</option></select></label><div className="flex justify-end gap-2 bg-[#f8fafb] p-4"><Button variant="secondary">Cancel</Button><Button>Save changes</Button></div></Card>
  </PageLayout>
}
