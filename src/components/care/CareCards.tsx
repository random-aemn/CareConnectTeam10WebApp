import {CalendarDays, ChevronRight, Ellipsis, MessageSquare, Pill, Video} from 'lucide-react'
import {useState} from 'react'
import type {Appointment, Medication, Message} from '../../data/careconnect'
import {Avatar, Badge, Button, Card} from '../ui/Primitives'
import {useCareConnect} from '../../state/careConnectContext'

export function AppointmentCard({appointment}: { appointment: Appointment }) {
    const {openModal, online, notify} = useCareConnect();
    const [menu, setMenu] = useState(false)
    const telehealth = appointment.type === 'Telehealth'
    return <Card className="flex min-h-52 flex-col p-4">
        <div className="flex items-center justify-between"><span className="icon-tile"><CalendarDays
            size={18}/></span><Badge tone={telehealth ? 'info' : 'success'}>{appointment.type}</Badge></div>
        <h3 className="mt-3 text-[13px] font-bold text-ink">{appointment.provider}</h3>
        <p className="mt-1 text-xs text-muted">{appointment.specialty}</p>
        <ul className="mt-4 space-y-1 text-xs text-muted">
            <li>• &nbsp;{appointment.date}</li>
            <li>• &nbsp;{appointment.location}</li>
        </ul>
        <div className="mt-auto flex items-end gap-2 pt-4">{appointment.status === 'Upcoming' && <><Button
            variant="secondary"
            onClick={() => openModal({type: 'appointment', appointment})}>Reschedule</Button>{telehealth &&
            <Button disabled={!online} title={online ? undefined : 'Telehealth requires an internet connection'} onClick={() => online ? openModal({type: 'telehealth', appointment}) : notify('Telehealth requires an internet connection.')}><Video size={15}/>Join</Button>}</>}
            <div className="relative ml-auto">
                <button className="rounded p-2" aria-label={`More options for ${appointment.provider}`}
                        aria-controls={`appointment-menu-${appointment.id}`} aria-expanded={menu} onClick={() => setMenu(!menu)}><Ellipsis size={18}/></button>
                {menu && <div
                    id={`appointment-menu-${appointment.id}`} role="region" aria-label="Appointment options" className="absolute bottom-10 right-0 z-20 w-44 rounded-md border border-border bg-white p-1 text-xs shadow-xl">
                    <button onClick={() => {
                        openModal({type: 'appointment-details', appointment});
                        setMenu(false)
                    }} className="block w-full rounded px-3 py-2 text-left hover:bg-canvas">View details
                    </button>
                    {appointment.status === 'Upcoming' && <button onClick={() => {
                        openModal({type: 'cancel-appointment', appointment});
                        setMenu(false)
                    }} className="block w-full rounded px-3 py-2 text-left text-[#b42318] hover:bg-[#fff0ed]">Cancel
                        appointment</button>}</div>}</div>
        </div>
    </Card>
}

export function MedicationRow({medication, compact = false, interactive = false}: {
    medication: Medication;
    compact?: boolean;
    interactive?: boolean
}) {
    const {dispatch, notify} = useCareConnect();
    const time = medication.reminderTimes?.[0] ?? '08:00';
    const doseKey = `${new Date().toISOString().slice(0, 10)}|${time}`;
    const taken = medication.takenDoses?.includes(doseKey)
    return <div
        className={`grid items-center gap-3 border-b border-border last:border-0 ${compact ? 'grid-cols-[32px_1fr_auto] px-4 py-3' : interactive ? 'grid-cols-[32px_1.3fr_1.5fr_.8fr_.8fr_auto_1.1fr] px-5 py-4' : 'grid-cols-[32px_1.4fr_1.6fr_1fr_1fr_auto] px-5 py-4'}`}>
        <span className="icon-tile icon-tile-warm"><Pill size={17}/></span>
        <div><strong className="block text-xs text-ink">{medication.name} <span
            className="font-normal text-muted">{medication.dosage}</span></strong>{compact &&
            <span className="text-[10px] text-muted">{medication.schedule}</span>}</div>
        {!compact && <>
            <span>{medication.schedule}</span><span>{medication.prescriber}</span><span>{medication.refill}</span></>}
        <Badge tone={medication.status === 'Missed' ? 'danger' : 'success'}>{medication.status}</Badge>
        {interactive &&
            <Button variant={taken ? 'secondary' : 'primary'} className="text-xs" aria-pressed={taken} onClick={() => {
                dispatch({type: 'toggle-medication-dose', id: medication.id, doseKey});
                notify(taken ? `${medication.name} marked not taken.` : `${medication.name} marked as taken.`)
            }}>{taken ? 'Taken' : 'Mark taken'}</Button>}
    </div>
}

export function MessageRow({message, selected = false}: { message: Message; selected?: boolean }) {
    const correspondent = message.direction === 'outgoing' ? `To: ${message.recipient}` : message.sender
    return <div
        className={`grid grid-cols-[34px_1fr_auto] gap-3 border-b border-border p-4 ${selected ? 'bg-[#e8f3ff] shadow-[inset_2px_0_0_#0b68cf]' : 'bg-white'}`}>
        <Avatar initials={message.initials} size="sm"/>
        <div className="min-w-0"><strong className="block truncate text-xs text-ink">{correspondent}</strong><span
            className="block truncate text-[11px] text-ink">{message.subject}</span><span
            className="block truncate text-[10px] text-muted">{message.preview}</span></div>
        <div className="flex items-start gap-2 text-[10px] text-muted"><span>{message.time}</span>{message.unread &&
            <span className="mt-1 size-1.5 rounded-full bg-blue"/>}</div>
    </div>
}

export function SummaryCard({icon, value, label, tone = 'blue', onClick}: {
    icon: React.ReactNode;
    value: string;
    label: string;
    tone?: 'blue' | 'warm';
    onClick?: () => void
}) {
    return <button onClick={onClick} className="text-left"><Card
        className="flex min-h-[84px] items-center gap-3 p-4"><span
        className={`icon-tile size-10 ${tone === 'warm' ? 'icon-tile-warm' : ''}`}>{icon}</span>
        <div><strong className="block text-lg text-ink">{value}</strong><span
            className="block max-w-28 text-[10px] text-muted">{label}</span></div>
        <ChevronRight className="ml-auto text-[#91a6b5]" size={17}/></Card></button>
}

export function SectionHeader({title, subtitle, action, onAction}: {
    title: string;
    subtitle?: string;
    action?: string;
    onAction?: () => void
}) {
    return <div className="mb-3 flex items-end justify-between">
        <div><h2 className="text-sm font-bold text-ink">{title}</h2>{subtitle &&
            <p className="text-[10px] text-muted">{subtitle}</p>}</div>
        {action && <button onClick={onAction} className="inline-flex items-center gap-1 text-blue">{action}<ChevronRight
            size={16}/></button>}</div>
}

export function InlineMessageAction({onClick}: { onClick?: () => void }) {
    return <Button onClick={onClick}><MessageSquare size={15}/>Message</Button>
}
