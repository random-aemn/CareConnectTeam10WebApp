import {ArrowLeft, Plus, Reply} from 'lucide-react'
import {useState} from 'react'
import {MessageRow} from '../components/care/CareCards'
import {Button, Card} from '../components/ui/Primitives'
import {PageLayout} from '../components/ui/PageLayout'
import {useCareConnect} from '../state/careConnectContext'

export default function MessagesPage() {
    const {state, dispatch, openModal} = useCareConnect();
    const [mobileThread, setMobileThread] = useState(false);
    const selected = state.messages.find((item) => item.id === state.selectedMessageId) ?? state.messages[0];
    const unread = state.messages.filter((item) => item.unread).length
    return <PageLayout title="Messages" description={`${unread} unread messages from your care team.`}
                       action="New message" actionIcon={<Plus size={16}/>}
                       onAction={() => openModal({type: 'message'})}>
        <Card className="grid min-h-[440px] overflow-hidden md:grid-cols-[40%_60%]">
            <div
                className={`${mobileThread ? 'hidden md:block' : 'block'} border-r border-border`}>{state.messages.map((message) =>
                <button key={message.id} onClick={() => {
                    dispatch({type: 'select-message', id: message.id});
                    setMobileThread(true)
                }} aria-current={message.id === selected?.id ? 'true' : undefined} className="block min-h-11 w-full text-left"><MessageRow message={message}
                                                                           selected={message.id === selected?.id}/>
                </button>)}</div>
            {selected && <article className={`${mobileThread ? 'block' : 'hidden'} p-5 md:block md:p-8`}>
                <button className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-action md:hidden"
                        onClick={() => setMobileThread(false)}><ArrowLeft size={17}/>Back to messages
                </button>
                <p className="text-[9px] font-bold uppercase tracking-wide text-blue">{selected.direction === 'outgoing' ? `To: ${selected.recipient}` : `From: ${selected.sender}`} · {selected.time}</p>
                <h2 className="mt-5 text-lg font-bold text-ink">{selected.subject}</h2>
                <div className="mt-8 max-w-2xl whitespace-pre-line text-sm leading-6 text-ink"><p>{selected.body}</p></div>
                {selected.direction === 'incoming' && <Button className="mt-6" onClick={() => openModal({type: 'message', replyTo: selected})}><Reply
                    size={15}/>Reply</Button>}
            </article>}</Card>
    </PageLayout>
}
