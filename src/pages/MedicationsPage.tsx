import {Plus} from 'lucide-react'
import {MedicationRow} from '../components/care/CareCards'
import {Card} from '../components/ui/Primitives'
import {PageLayout} from '../components/ui/PageLayout'
import {useNavigate} from 'react-router-dom'
import {useCareConnect} from '../state/careConnectContext'

export default function MedicationsPage() {
    const navigate = useNavigate();
    const {state, dispatch, notify} = useCareConnect();
    const today = new Date().toISOString().slice(0, 10)
    return <PageLayout title="Medications" description="Your active prescriptions and daily schedule."
                       action="Add medication" actionIcon={<Plus size={16}/>}
                       onAction={() => navigate('/medications/add')}>
        <Card className="overflow-hidden">
            <div
                className="hidden grid-cols-[32px_1.3fr_1.5fr_.8fr_.8fr_auto_1.1fr] gap-3 border-b border-border bg-[#f8fafb] px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-muted md:grid">
                <span/><span>Medication</span><span>Schedule</span><span>Prescriber</span><span>Next refill</span><span>Status</span><span>Today’s dose</span>
            </div>
            <div className="hidden text-xs md:block">{state.medications.map((m) => <MedicationRow key={m.id}
                                                                                                  medication={m}
                                                                                                  interactive/>)}</div>
            <div className="md:hidden">{state.medications.map((m) => {
                const time = m.reminderTimes?.[0] ?? '08:00';
                const key = `${today}|${time}`;
                const taken = m.takenDoses?.includes(key);
                return <div key={m.id} className="border-b border-border last:border-0"><MedicationRow medication={m}
                                                                                                       compact/>
                    <div className="px-4 pb-3">
                        <button aria-pressed={taken} onClick={() => {
                            dispatch({type: 'toggle-medication-dose', id: m.id, doseKey: key});
                            notify(taken ? `${m.name} marked not taken.` : `${m.name} marked as taken.`)
                        }}
                                className={`${taken ? 'border border-[#b8c8d3] bg-white text-action' : 'bg-action text-white'} w-full rounded-md px-3 py-2 text-xs`}>{taken ? 'Taken — undo' : 'Mark dose taken'}</button>
                    </div>
                </div>
            })}</div>
        </Card>
    </PageLayout>
}
