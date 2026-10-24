import {Pill, Plus} from 'lucide-react'
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
            <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[820px] border-collapse text-left text-xs"><caption className="sr-only">Active medications and today’s doses</caption><thead className="bg-[#f8fafb] text-[9px] font-bold uppercase tracking-wide text-muted"><tr><th scope="col" className="px-5 py-3">Medication</th><th scope="col" className="px-5 py-3">Schedule</th><th scope="col" className="px-5 py-3">Prescriber</th><th scope="col" className="px-5 py-3">Next refill</th><th scope="col" className="px-5 py-3">Status</th><th scope="col" className="px-5 py-3">Today’s dose</th></tr></thead><tbody>{state.medications.map((m) => { const time = m.reminderTimes?.[0] ?? '08:00'; const key = `${today}|${time}`; const taken = m.takenDoses?.includes(key); return <tr key={m.id} className="border-t border-border"><th scope="row" className="px-5 py-4 font-normal"><span className="flex items-center gap-3"><span aria-hidden="true" className="icon-tile icon-tile-warm"><Pill size={17}/></span><span><strong className="block text-ink">{m.name}</strong><span className="text-muted">{m.dosage}</span></span></span></th><td className="px-5 py-4">{m.schedule}</td><td className="px-5 py-4">{m.prescriber}</td><td className="px-5 py-4">{m.refill}</td><td className="px-5 py-4">{m.status}</td><td className="px-5 py-4"><button aria-pressed={taken} onClick={() => { dispatch({type: 'toggle-medication-dose', id: m.id, doseKey: key}); notify(taken ? `${m.name} marked not taken.` : `${m.name} marked as taken.`) }} className={`${taken ? 'border border-[#718692] bg-white text-action' : 'bg-action text-white'} rounded-md px-3 py-2 text-xs`}>{taken ? 'Taken' : 'Mark taken'}</button></td></tr> })}</tbody></table></div>
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
                                className={`${taken ? 'border border-[#718692] bg-white text-action' : 'bg-action text-white'} w-full rounded-md px-3 py-2 text-xs`}>{taken ? 'Taken — undo' : 'Mark dose taken'}</button>
                    </div>
                </div>
            })}</div>
        </Card>
    </PageLayout>
}
