import { Plus, Reply } from 'lucide-react'
import { MessageRow } from '../components/care/CareCards'
import { Button, Card } from '../components/ui/Primitives'
import { PageLayout } from '../components/ui/PageLayout'
import { messages } from '../data/careconnect'

export default function MessagesPage() {
  return <PageLayout title="Messages" description="2 unread messages from your care team." action="New message" actionIcon={<Plus size={16} />}>
    <Card className="grid min-h-[440px] overflow-hidden md:grid-cols-[40%_60%]"><div className="border-r border-border">{messages.map((m, i) => <MessageRow key={m.sender} message={m} selected={i === 0} />)}</div><article className="hidden p-8 md:block"><p className="text-[9px] font-bold uppercase tracking-wide text-blue">Dr. Sarah Chen · 2h ago</p><h2 className="mt-5 text-lg font-bold text-ink">Your recent lab results</h2><div className="mt-8 max-w-2xl space-y-5 text-sm leading-6 text-ink"><p>Hi Jordan,</p><p>Your CBC and metabolic panel results are in. Overall things look good. I’d like to discuss one value at your next appointment.</p><p>Best,<br />Dr. Sarah Chen</p></div><Button className="mt-6"><Reply size={15} />Reply</Button></article></Card>
  </PageLayout>
}
