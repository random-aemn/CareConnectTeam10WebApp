import { Plus } from 'lucide-react'
import { AppointmentCard } from '../components/care/CareCards'
import { PageLayout } from '../components/ui/PageLayout'
import { appointments } from '../data/careconnect'

export default function AppointmentsPage() {
  return <PageLayout title="Appointments" description="Manage upcoming visits and appointment history." action="Request appointment" actionIcon={<Plus size={16} />}><div className="mb-4 flex h-11 gap-2 border-b border-border"><button className="border-b-2 border-blue px-4 text-sm text-action">Upcoming <span className="rounded-full bg-action px-1.5 py-0.5 text-[9px] text-white">3</span></button><button className="px-4 text-sm text-muted">Past</button></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{appointments.map((appointment) => <AppointmentCard key={appointment.provider} appointment={appointment} />)}</div></PageLayout>
}
