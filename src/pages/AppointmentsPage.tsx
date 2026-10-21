import { Plus } from 'lucide-react'
import { AppointmentCard } from '../components/care/CareCards'
import { PageLayout } from '../components/ui/PageLayout'
import { useState } from 'react'
import { useCareConnect } from '../state/CareConnectContext'

export default function AppointmentsPage() {
  const { state, openModal } = useCareConnect(); const [tab, setTab] = useState<'Upcoming' | 'Past'>('Upcoming'); const appointments = state.appointments.filter((item) => tab === 'Upcoming' ? item.status === 'Upcoming' : item.status !== 'Upcoming')
  return <PageLayout title="Appointments" description="Manage upcoming visits and appointment history." action="Request appointment" actionIcon={<Plus size={16} />} onAction={() => openModal({ type: 'appointment' })}><div className="mb-4 flex h-11 gap-2 border-b border-border" role="tablist"><button role="tab" aria-selected={tab === 'Upcoming'} onClick={() => setTab('Upcoming')} className={`${tab === 'Upcoming' ? 'border-blue text-action' : 'border-transparent text-muted'} border-b-2 px-4 text-sm`}>Upcoming <span className="rounded-full bg-action px-1.5 py-0.5 text-[9px] text-white">{state.appointments.filter((item) => item.status === 'Upcoming').length}</span></button><button role="tab" aria-selected={tab === 'Past'} onClick={() => setTab('Past')} className={`${tab === 'Past' ? 'border-blue text-action' : 'border-transparent text-muted'} border-b-2 px-4 text-sm`}>Past</button></div>{appointments.length ? <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}</div> : <p className="rounded-md border border-border bg-white p-8 text-center text-muted">No appointments in this view.</p>}</PageLayout>
}
