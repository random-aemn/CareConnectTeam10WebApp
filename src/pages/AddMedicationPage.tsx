import {ArrowLeft, Plus, ShieldCheck, X} from 'lucide-react'
import {useState, type FormEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import {Field} from '../components/dialogs/Dialog'
import {Button, Card} from '../components/ui/Primitives'
import type {Medication} from '../data/careconnect'
import {useCareConnect} from '../state/careConnectContext'
import {usePageHeadingFocus} from '../hooks/usePageHeadingFocus'

export default function AddMedicationPage() {
    const navigate = useNavigate();
    const headingRef = usePageHeadingFocus()
    const {dispatch, openModal} = useCareConnect();
    const [dirty, setDirty] = useState(false);
    const [times, setTimes] = useState(['08:00'])
    const cancel = () => dirty ? openModal({
        type: 'discard-medication',
        onDiscard: () => navigate('/medications')
    }) : navigate('/medications')
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get('name') ?? '').trim();
        const dose = String(data.get('dose') ?? '').trim()
        const medication: Medication = {
            id: Date.now(),
            name,
            dosage: `${dose} ${data.get('unit')}`,
            schedule: `${data.get('frequency')} · ${times.map(formatTime).join(', ')}`,
            frequency: String(data.get('frequency')),
            reminderTimes: times,
            takenDoses: [],
            prescriber: String(data.get('doctor')),
            refill: String(data.get('refill') || 'Not scheduled'),
            status: 'On track',
            type: String(data.get('type')),
            pharmacy: String(data.get('pharmacy')),
            instructions: String(data.get('instructions'))
        }
        dispatch({type: 'add-medication', medication});
        navigate('/medications')
    }
    return <form onSubmit={submit} onChange={() => setDirty(true)} data-pwa-unsaved={dirty}
                 className="mx-auto w-full max-w-[1290px] px-5 py-5 md:px-6 lg:px-[30px]">
        <div className="mb-6 flex flex-wrap items-center gap-4">
            <button type="button" onClick={cancel} aria-label="Back to medications"
                    className="rounded-md border border-border bg-white p-2"><ArrowLeft/></button>
            <div><h1 ref={headingRef} tabIndex={-1} className="font-serif text-[26px] font-bold text-navy">Add Medication</h1><p
                className="text-xs text-muted">Create a medication schedule and reminders.</p></div>
            <div className="ml-auto flex gap-2"><Button type="button" variant="secondary"
                                                        onClick={cancel}>Cancel</Button><Button type="submit">Save
                medication</Button></div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
            <FormSection number="1" title="Medication details">
                <fieldset>
                    <legend className="mb-2 text-xs font-bold">Type</legend>
                    <div
                        className="grid grid-cols-2 gap-2 sm:grid-cols-4">{['Prescription', 'OTC', 'Supplement', 'Vitamin'].map((type, index) =>
                        <label key={type} className="rounded-md border border-border p-3 text-center text-xs"><input
                            type="radio" name="type" value={type} defaultChecked={index === 0} className="mr-2"/>{type}
                        </label>)}</div>
                </fieldset>
                <Field label="Medication name" required><input name="name" required
                                                               placeholder="e.g. Lisinopril"/></Field>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Dosage" required><input name="dose" type="number"
                                                                                                 min="0.01" step="any" required
                                                                                                 inputMode="decimal"
                                                                                                 onKeyDown={(event) => {
                                                                                                     if (['e', 'E', '+', '-'].includes(event.key)) event.preventDefault()
                                                                                                 }}
                                                                                                 onInput={(event) => {
                                                                                                     if (event.currentTarget.value.length > 5) event.currentTarget.value = event.currentTarget.value.slice(0, 5)
                                                                                                 }}/></Field><Field
                    label="Unit"><select name="unit">
                    <option>mg</option>
                    <option>mcg</option>
                    <option>mL</option>
                    <option>IU</option>
                    <option>Tablets/Capsules</option>
                </select></Field></div>
            </FormSection>
            <FormSection number="2" title="Schedule and reminders"><Field label="Frequency"><select name="frequency">
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times</option>
                <option>As needed</option>
            </select></Field>
                <div><p className="text-xs font-bold">Reminder times</p>
                    <div className="mt-2 flex flex-wrap gap-2">{times.map((time, index) => <span key={`${time}${index}`}
                                                                                                 className="inline-flex items-center gap-2 rounded-full bg-[#e8f3ff] px-3 py-2 text-xs"><input
                        aria-label={`Reminder ${index + 1}`} type="time" value={time}
                        onChange={(event) => setTimes(times.map((item, i) => i === index ? event.target.value : item))}
                        className="bg-transparent"/><button type="button" aria-label={`Remove reminder ${index + 1}`}
                                                            onClick={() => setTimes(times.filter((_, i) => i !== index))}><X
                        size={14}/></button></span>)}<Button type="button" variant="secondary"
                                                             onClick={() => setTimes([...times, times.length ? '20:00' : '08:00'])}><Plus
                        size={15}/>Add time</Button></div>
                </div>
                <Field label="Prescribing doctor"><select name="doctor">
                    <option>Dr. Sarah Chen</option>
                    <option>Dr. Marcus Webb</option>
                    <option>Dr. Priya Nair</option>
                </select></Field><Field label="Refill date"><input name="refill" type="date"/></Field></FormSection>
            <FormSection number="3" title="Pharmacy and instructions" wide><Field label="Pharmacy or notes"><input
                name="pharmacy" placeholder="e.g. CVS on Main St."/></Field><Field label="Instructions"><textarea
                name="instructions" placeholder="Take with food and water."/></Field></FormSection>
        </div>
        <div
            className="sticky bottom-6 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-white p-4 shadow-lg">
            <span className="flex items-center gap-2 text-xs text-muted"><ShieldCheck size={16}/>Medication details are stored locally for this demo.</span>
            <div className="flex gap-2"><Button type="button" variant="secondary"
                                                onClick={cancel}>Cancel</Button><Button type="submit">Save
                medication</Button></div>
        </div>
    </form>
}

function FormSection({number, title, wide, children}: {
    number: string;
    title: string;
    wide?: boolean;
    children: React.ReactNode
}) {
    return <Card className={`${wide ? 'lg:col-span-2' : ''} space-y-5 p-5`}><h2
        className="flex items-center gap-3 font-bold text-ink"><span
        className="flex size-7 items-center justify-center rounded-full bg-action text-xs text-white">{number}</span>{title}
    </h2>{children}</Card>
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit'
    }).format(new Date(`2000-01-01T${value}:00`))
}
