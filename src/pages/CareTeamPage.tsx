import { CalendarDays, MessageSquare, Plus } from 'lucide-react'
import { InlineMessageAction } from '../components/care/CareCards'
import { Avatar, Button, Card } from '../components/ui/Primitives'
import { PageLayout } from '../components/ui/PageLayout'
import { careTeam } from '../data/careconnect'

export default function CareTeamPage() {
  return <PageLayout title="Care team" description="Your providers, specialists, and support staff." action="New message" actionIcon={<Plus size={16} />}><div className="grid gap-4 md:grid-cols-2">{careTeam.map((member) => <Card key={member.name} className="p-5"><div className="flex gap-4"><Avatar initials={member.initials} size="lg" /><div><h2 className="text-sm font-bold text-action">{member.name}</h2><p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-blue">{member.role}</p><p className="mt-2 text-[10px] text-muted">{member.organization}</p></div></div><dl className="mt-5 grid grid-cols-2 gap-6 border-b border-border pb-4 text-[10px]"><div><dt className="font-bold uppercase text-muted">Phone</dt><dd className="mt-1 font-bold text-ink">{member.phone}</dd></div><div><dt className="font-bold uppercase text-muted">Next appointment</dt><dd className="mt-1 font-bold text-ink">{member.next}</dd></div></dl><div className="mt-4 flex flex-wrap gap-2"><InlineMessageAction />{member.next !== '—' && <Button variant="secondary"><CalendarDays size={15} />Book visit</Button>}</div></Card>)}</div><span className="sr-only"><MessageSquare /></span></PageLayout>
}
