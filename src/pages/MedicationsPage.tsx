import { Plus } from 'lucide-react'
import { MedicationRow } from '../components/care/CareCards'
import { Card } from '../components/ui/Primitives'
import { PageLayout } from '../components/ui/PageLayout'
import { medications } from '../data/careconnect'

export default function MedicationsPage() {
  return <PageLayout title="Medications" description="Your active prescriptions and daily schedule." action="Add medication" actionIcon={<Plus size={16} />}>
    <Card className="overflow-hidden"><div className="hidden grid-cols-[32px_1.4fr_1.6fr_1fr_1fr_auto] gap-3 border-b border-border bg-[#f8fafb] px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-muted md:grid"><span /><span>Medication</span><span>Schedule</span><span>Prescriber</span><span>Next refill</span><span>Status</span></div><div className="hidden text-xs md:block">{medications.map((m) => <MedicationRow key={m.name} medication={m} />)}</div><div className="md:hidden">{medications.map((m) => <MedicationRow key={m.name} medication={m} compact />)}</div></Card>
  </PageLayout>
}
