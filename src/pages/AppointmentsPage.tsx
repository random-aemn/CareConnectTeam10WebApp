import {Plus} from 'lucide-react'
import {AppointmentCard} from '../components/care/CareCards'
import {PageLayout} from '../components/ui/PageLayout'
import {useSearchParams} from 'react-router-dom'
import {useCareConnect} from '../state/careConnectContext'

export default function AppointmentsPage() {
    const {state, openModal} = useCareConnect();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab: 'Upcoming' | 'Past' = searchParams.get('tab') === 'past' ? 'Past' : 'Upcoming';
    const appointments = state.appointments.filter((item) => tab === 'Upcoming' ? item.status === 'Upcoming' : item.status !== 'Upcoming')
    const selectTabWithKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const next = event.key === 'ArrowRight' || event.key === 'End' ? 'past' : 'upcoming'
        setSearchParams({tab: next})
        document.getElementById(`appointments-${next}-tab`)?.focus()
    }
    return <PageLayout title="Appointments" description="Manage upcoming visits and appointment history."
                       action="Request appointment" actionIcon={<Plus size={16}/>}
                       onAction={() => openModal({type: 'appointment'})}>
        <div className="mb-4 flex h-11 gap-2 border-b border-border" role="tablist" aria-label="Appointment views">
            <button id="appointments-upcoming-tab" role="tab" aria-controls="appointments-panel" aria-selected={tab === 'Upcoming'} tabIndex={tab === 'Upcoming' ? 0 : -1} onKeyDown={selectTabWithKey} onClick={() => setSearchParams({tab: 'upcoming'})}
                    className={`${tab === 'Upcoming' ? 'border-blue text-action' : 'border-transparent text-muted'} border-b-2 px-4 text-sm`}>Upcoming <span
                className="rounded-full bg-action px-1.5 py-0.5 text-[9px] text-white">{state.appointments.filter((item) => item.status === 'Upcoming').length}</span>
            </button>
            <button id="appointments-past-tab" role="tab" aria-controls="appointments-panel" aria-selected={tab === 'Past'} tabIndex={tab === 'Past' ? 0 : -1} onKeyDown={selectTabWithKey} onClick={() => setSearchParams({tab: 'past'})}
                    className={`${tab === 'Past' ? 'border-blue text-action' : 'border-transparent text-muted'} border-b-2 px-4 text-sm`}>Past
            </button>
        </div>
        <div id="appointments-panel" role="tabpanel" aria-labelledby={`appointments-${tab.toLowerCase()}-tab`} tabIndex={0}>{appointments.length ?
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{appointments.map((appointment) =>
                <AppointmentCard key={appointment.id} appointment={appointment}/>)}</div> :
            <p className="rounded-md border border-border bg-white p-8 text-center text-muted">No appointments in this
                view.</p>}</div></PageLayout>
}
