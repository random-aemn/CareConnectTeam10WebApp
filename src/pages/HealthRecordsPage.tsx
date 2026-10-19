import { Activity } from 'lucide-react'
import { Badge, Card } from '../components/ui/Primitives'
import { PageLayout } from '../components/ui/PageLayout'
import { labs } from '../data/careconnect'

export default function HealthRecordsPage() {
  return <PageLayout title="Health records" description="Lab results, vitals, immunizations, and clinical documents." action="Export summary" actionIcon={<Activity size={16} />}>
    <div className="mb-0 flex overflow-x-auto border-b border-border"><button className="whitespace-nowrap border-b-2 border-blue px-4 py-3 text-sm text-action">Labs <span className="rounded-full bg-action px-1.5 text-[9px] text-white">2</span></button>{['Vitals', 'Immunizations', 'Documents'].map((tab) => <button key={tab} className="px-5 py-3 text-sm text-muted">{tab}</button>)}</div>
    <Card className="overflow-hidden rounded-t-none"><div className="hidden grid-cols-[1.4fr_1fr_1fr_.65fr_.8fr] bg-[#f8fafb] px-5 py-3 text-[9px] font-bold uppercase text-muted md:grid"><span>Test</span><span>Result</span><span>Reference range</span><span>Status</span><span>Date</span></div>{labs.map(([test, result, range, status, date]) => <div key={test} className="grid gap-2 border-t border-border px-5 py-4 text-xs md:grid-cols-[1.4fr_1fr_1fr_.65fr_.8fr]"><span>{test}</span><strong>{result}</strong><span className="text-muted">{range}</span><span><Badge tone={status === 'High' ? 'danger' : 'success'}>{status}</Badge></span><span className="text-muted">{date}</span></div>)}</Card>
  </PageLayout>
}
