import { Activity, CalendarDays, Inbox, Pill } from 'lucide-react'
import { AppointmentCard, MedicationRow, MessageRow, SectionHeader, SummaryCard } from '../components/care/CareCards'
import { Button, Card } from '../components/ui/Primitives'
import { useCareConnect } from '../state/CareConnectContext'

export default function OverviewPage() {
  const { state, openModal } = useCareConnect(); const appointments = state.appointments.filter((item) => item.status === 'Upcoming').slice(0, 3); const { medications, messages } = state
  return <div className="mx-auto w-full max-w-[1290px] px-5 py-5 md:px-6 md:py-6 lg:px-[30px] lg:py-[30px]">
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row"><div><p className="text-[9px] font-bold uppercase tracking-[.09em] text-blue">Sunday, August 30</p><h1 className="mt-1 font-serif text-[26px] font-bold leading-tight text-navy">Good morning, Jordan</h1><p className="mt-1 text-xs text-muted">Here’s what needs your attention today.</p></div><Button variant="secondary"><Activity size={17} />View health summary</Button></div>
    <section aria-label="Today at a glance" className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3"><SummaryCard icon={<CalendarDays size={18} />} value="3" label="Upcoming appointments" /><SummaryCard icon={<Pill size={18} />} value="2" label="Missed doses today" tone="warm" /><SummaryCard icon={<Inbox size={18} />} value="2" label="Unread messages" /></section>
    <section className="mt-7"><SectionHeader title="Upcoming appointments" subtitle="Your next visits at a glance" action="View all" /><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{appointments.map((appointment) => <AppointmentCard key={appointment.provider} appointment={appointment} />)}</div></section>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <section><Card><div className="border-b border-border p-4"><SectionHeader title="Medication reminders" subtitle="Today’s schedule" action="View all" /></div>{medications.slice(0, 3).map((medication) => <MedicationRow key={medication.name} medication={medication} compact />)}</Card></section>
      <section><Card><div className="border-b border-border p-4"><div className="flex items-center justify-between"><SectionHeader title="Recent messages" subtitle="From your care team" /><button aria-label="New message" onClick={() => openModal({ type: 'message' })} className="rounded p-2 text-xl">+</button></div></div>{messages.slice(0, 3).map((message) => <MessageRow key={message.id} message={message} />)}</Card></section>
    </div>
  </div>
}
