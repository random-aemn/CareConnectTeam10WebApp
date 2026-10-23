import {useState, type FormEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import type {Appointment, Message} from '../../data/careconnect'
import {useCareConnect} from '../../state/careConnectContext'
import {Button} from '../ui/Primitives'
import {Dialog, Field} from './Dialog'

const todayValue = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
const formatAppointmentDate = (dateValue: string, timeValue: string) => {
    const date = new Date(`${dateValue}T${timeValue}:00`);
    return `${new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date)} · ${new Intl.DateTimeFormat(undefined, {hour: 'numeric', minute: '2-digit'}).format(date)}`
}
const timeOptions = Array.from({length: 40}, (_, index) => {
    const minutes = 8 * 60 + index * 15;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return {
        value,
        label: new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: '2-digit'
        }).format(new Date(`2000-01-01T${value}:00`))
    }
})

export default function WorkflowDialogs() {
    const {modal, closeModal, dispatch, notify} = useCareConnect()
    const navigate = useNavigate()
    const [appointmentError, setAppointmentError] = useState('')
    if (!modal) return null

    const submitAppointment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const provider = String(data.get('provider'));
        const dateValue = String(data.get('date'));
        const timeValue = String(data.get('time'))
        if (dateValue < todayValue()) {
            setAppointmentError('Choose today or a future date.');
            return
        }
        const old = modal.type === 'appointment' ? modal.appointment : undefined
        const appointment: Appointment = {
            id: old?.id ?? Date.now(),
            provider,
            specialty: old?.specialty ?? 'Requested visit',
            date: formatAppointmentDate(dateValue, timeValue),
            dateValue,
            timeValue,
            location: old?.location ?? 'Location to be confirmed',
            type: old?.type ?? 'In person',
            status: 'Upcoming',
            notes: String(data.get('notes') ?? '')
        }
        dispatch({type: old ? 'update-appointment' : 'add-appointment', appointment});
        closeModal();
        navigate('/appointments');
        notify(old ? 'Appointment rescheduled.' : 'Appointment request submitted.')
    }
    const submitMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = String(data.get('body') ?? '').trim();
        if (!body) return
        const replyTo = modal.type === 'message' ? modal.replyTo : undefined
        if (replyTo) dispatch({type: 'reply-message', id: replyTo.id, body})
        else {
            const recipient = String(data.get('provider'));
            const message: Message = {
                id: Date.now(),
                initials: 'JD',
                sender: 'Jordan Davis',
                recipient,
                direction: 'outgoing',
                subject: String(data.get('subject')),
                preview: body,
                body,
                time: 'Just now',
                unread: false
            };
            dispatch({type: 'send-message', message})
        }
        closeModal();
        navigate('/messages');
        notify(replyTo ? 'Reply sent.' : 'Message sent.')
    }

    if (modal.type === 'appointment') return <Dialog
        title={modal.appointment ? 'Reschedule appointment' : 'Request an appointment'}
        description="We’ll confirm with you within 24 hours." onClose={closeModal} onSubmit={submitAppointment}
        actions={<><Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button><Button
            type="submit">{modal.appointment ? 'Save changes' : 'Submit request'}</Button></>}>
        <Field label="Provider" required><select name="provider" defaultValue={modal.appointment?.provider ?? ''}
                                                 required>
            <option value="">Choose a provider…</option>
            <option>Dr. Sarah Chen</option>
            <option>Dr. Marcus Webb</option>
            <option>Dr. Priya Nair</option>
        </select></Field>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Preferred date" required><input name="date" type="date"
                                                                                                 min={todayValue()}
                                                                                                 defaultValue={modal.appointment?.dateValue}
                                                                                                 required/></Field><Field
            label="Preferred time" required><select name="time" defaultValue={modal.appointment?.timeValue ?? ''}
                                                    required>
            <option value="">Choose a time…</option>
            {timeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select></Field></div>
        {appointmentError && <p className="text-xs text-[#d94b2b]" role="alert">{appointmentError}</p>}<Field
        label="Additional information"><textarea name="notes" defaultValue={modal.appointment?.notes}
                                                 placeholder="Symptoms, reason for visit, or other details…"/></Field>
    </Dialog>
    if (modal.type === 'message') return <Dialog
        title={modal.replyTo ? `Reply to ${modal.replyTo.sender}` : 'New message'}
        description="Send a secure message to your care team." onClose={closeModal} onSubmit={submitMessage}
        actions={<><Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button><Button type="submit">Send
            message</Button></>}>
        <Field label="To" required><select name="provider" defaultValue={modal.replyTo?.sender ?? modal.recipient ?? ''}
                                           disabled={!!modal.replyTo} required>
            <option value="">Select a provider…</option>
            <option>Dr. Sarah Chen</option>
            <option>Dr. Marcus Webb</option>
            <option>Dr. Priya Nair</option>
            <option>Dr. Raj Kumar</option>
            <option>Northside Medical Center</option>
        </select></Field><Field label="Subject" required><input name="subject"
                                                                defaultValue={modal.replyTo ? `Re: ${modal.replyTo.subject}` : ''}
                                                                disabled={!!modal.replyTo} required
                                                                placeholder="What is this about?"/></Field><Field
        label="Message" required><textarea name="body" required placeholder="Write your message…"/></Field>
    </Dialog>
    if (modal.type === 'telehealth') return <Dialog title="Join telehealth visit"
                                                    description={`Appointment with ${modal.appointment.provider}.`}
                                                    onClose={closeModal} actions={<><Button variant="secondary"
                                                                                            onClick={closeModal}>Cancel</Button><Button
        onClick={() => {
            closeModal();
            notify('Telehealth preflight complete. A meeting link will be supplied by your provider.')
        }}>Continue</Button></>}><p>Check that you have a reliable internet connection and a private place for your
        visit.</p><p>The production service would request camera and microphone access immediately before joining.</p>
    </Dialog>
    if (modal.type === 'appointment-details') return <Dialog title="Appointment details" onClose={closeModal}
                                                             actions={<Button onClick={closeModal}>Done</Button>}>
        <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm">
            <dt className="font-bold">Provider</dt>
            <dd>{modal.appointment.provider}</dd>
            <dt className="font-bold">Specialty</dt>
            <dd>{modal.appointment.specialty}</dd>
            <dt className="font-bold">Date and time</dt>
            <dd>{modal.appointment.date}</dd>
            <dt className="font-bold">Location</dt>
            <dd>{modal.appointment.location}</dd>
        </dl>
    </Dialog>
    if (modal.type === 'help') return <Dialog title="CareConnect help" description="Keyboard and navigation guidance."
                                              onClose={closeModal} actions={<Button onClick={closeModal}>Done</Button>}>
        <div className="space-y-3 text-sm"><p><kbd>Ctrl/Cmd + K</kbd> focuses search.</p><p><kbd>Tab</kbd> moves between
            controls.</p><p><kbd>Esc</kbd> closes dialogs and menus.</p><p>Use the navigation menu to move among
            appointments, medications, messages, records, care team, and preferences.</p><p>When offline, changes are
            saved on this device and queued for synchronization.</p></div>
    </Dialog>
    if (modal.type === 'cancel-appointment') return <Dialog title="Cancel appointment?"
                                                            description="The appointment will move to your past appointments."
                                                            onClose={closeModal}
                                                            actions={<><Button variant="secondary" onClick={closeModal}>Keep
                                                                appointment</Button><Button className="bg-[#b42318]"
                                                                                            onClick={() => {
                                                                                                dispatch({
                                                                                                    type: 'cancel-appointment',
                                                                                                    id: modal.appointment.id
                                                                                                });
                                                                                                closeModal();
                                                                                                notify('Appointment cancelled.')
                                                                                            }}>Cancel
                                                                appointment</Button></>}><p>Cancel your appointment
        with {modal.appointment.provider} on {modal.appointment.date}?</p></Dialog>
    if (modal.type === 'discard-medication') return <Dialog title="Discard medication changes?"
                                                            description="Your entered medication details will not be saved."
                                                            onClose={closeModal}
                                                            actions={<><Button variant="secondary" onClick={closeModal}>Continue
                                                                editing</Button><Button className="bg-[#b42318]"
                                                                                        onClick={() => {
                                                                                            const action = modal.onDiscard;
                                                                                            closeModal();
                                                                                            action()
                                                                                        }}>Discard changes</Button></>}>
        <p>You have unsaved changes in the medication form.</p></Dialog>
    return <Dialog title="Reset demo data?" description="This replaces all locally saved prototype changes."
                   onClose={closeModal}
                   actions={<><Button variant="secondary" onClick={closeModal}>Keep current data</Button><Button
                       className="bg-[#b42318]" onClick={() => {
                       dispatch({type: 'reset'});
                       closeModal();
                       notify('Demo data reset.')
                   }}>Reset demo data</Button></>}><p>Appointments, medications, messages, and notifications will return
        to their initial values.</p></Dialog>
}
