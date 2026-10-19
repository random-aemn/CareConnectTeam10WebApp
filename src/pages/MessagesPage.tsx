import { Plus, Reply } from 'lucide-react'
import { MessageRow } from '../components/care/CareCards'
import { Button, Card } from '../components/ui/Primitives'
import { PageLayout } from '../components/ui/PageLayout'
import { useCareConnect } from '../state/CareConnectContext'

export default function MessagesPage() {
  const { state, dispatch, openModal } = useCareConnect(); const selected = state.messages.find((item) => item.id === state.selectedMessageId) ?? state.messages[0]; const unread = state.messages.filter((item) => item.unread).length
  return <PageLayout title="Messages" description={`${unread} unread messages from your care team.`} action="New message" actionIcon={<Plus size={16} />} onAction={() => openModal({ type: 'message' })}>
    <Card className="grid min-h-[440px] overflow-hidden md:grid-cols-[40%_60%]"><div className="border-r border-border">{state.messages.map((message) => <button key={message.id} onClick={() => dispatch({ type: 'select-message', id: message.id })} className="block w-full text-left"><MessageRow message={message} selected={message.id === selected?.id} /></button>)}</div>{selected && <article className="hidden p-8 md:block"><p className="text-[9px] font-bold uppercase tracking-wide text-blue">{selected.sender} · {selected.time}</p><h2 className="mt-5 text-lg font-bold text-ink">{selected.subject}</h2><div className="mt-8 max-w-2xl space-y-5 whitespace-pre-line text-sm leading-6 text-ink"><p>Hi Jordan,</p><p>{selected.body}</p></div><Button className="mt-6" onClick={() => openModal({ type: 'message', replyTo: selected })}><Reply size={15} />Reply</Button></article>}</Card>
  </PageLayout>
}
