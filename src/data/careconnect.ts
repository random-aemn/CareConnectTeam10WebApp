export type StatusTone = 'success' | 'danger' | 'info'

export interface Appointment {
  id: number
  provider: string
  specialty: string
  date: string
  dateValue?: string
  timeValue?: string
  location: string
  type: 'In person' | 'Telehealth'
  status: 'Upcoming' | 'Past' | 'Cancelled'
  notes?: string
}

export interface Medication {
  id: number
  name: string
  dosage: string
  schedule: string
  frequency?: string
  reminderTimes?: string[]
  takenDoses?: string[]
  prescriber: string
  refill: string
  status: 'Missed' | 'On track'
  type?: string
  pharmacy?: string
  instructions?: string
}

export interface Message {
  id: number
  initials: string
  sender: string
  subject: string
  preview: string
  time: string
  unread?: boolean
  body: string
}

export const appointments: Appointment[] = [
  { id: 1, provider: 'Dr. Sarah Chen', specialty: 'Primary Care', date: 'Oct 1, 2026 · 5:15 PM', dateValue: '2026-10-01', timeValue: '17:15', location: 'Northside Medical Center, Suite 210', type: 'In person', status: 'Upcoming' },
  { id: 2, provider: 'Dr. Marcus Webb', specialty: 'Cardiology', date: 'Oct 2, 2026 · 11:15 AM', dateValue: '2026-10-02', timeValue: '11:15', location: 'Telehealth · Video call', type: 'Telehealth', status: 'Upcoming' },
  { id: 3, provider: 'Dr. Priya Nair', specialty: 'Endocrinology', date: 'Oct 4, 2026 · 1:15 PM', dateValue: '2026-10-04', timeValue: '13:15', location: 'Westfield Health Pavilion, Room 114', type: 'In person', status: 'Upcoming' },
  { id: 4, provider: 'Dr. Sarah Chen', specialty: 'Primary Care', date: 'Aug 12, 2026 · 10:00 AM', dateValue: '2026-08-12', timeValue: '10:00', location: 'Northside Medical Center', type: 'In person', status: 'Past' },
]

export const medications: Medication[] = [
  { id: 1, name: 'Lisinopril', dosage: '10 mg', schedule: 'Once daily · 8:00 AM', frequency: 'Once daily', reminderTimes: ['08:00'], takenDoses: [], prescriber: 'Dr. Chen', refill: 'Sep 14, 2026', status: 'Missed' },
  { id: 2, name: 'Metformin', dosage: '500 mg', schedule: 'Twice daily · 8:00 AM, 8:00 PM', frequency: 'Twice daily', reminderTimes: ['08:00', '20:00'], takenDoses: [], prescriber: 'Dr. Nair', refill: 'Sep 22, 2026', status: 'Missed' },
  { id: 3, name: 'Atorvastatin', dosage: '20 mg', schedule: 'Once daily · 9:00 PM', frequency: 'Once daily', reminderTimes: ['21:00'], takenDoses: [], prescriber: 'Dr. Webb', refill: 'Oct 3, 2026', status: 'On track' },
  { id: 4, name: 'Vitamin D3', dosage: '2,000 IU', schedule: 'Once daily · 8:00 AM', frequency: 'Once daily', reminderTimes: ['08:00'], takenDoses: [], prescriber: 'Dr. Chen', refill: 'Nov 1, 2026', status: 'On track' },
]

export const messages: Message[] = [
  { id: 1, initials: 'SC', sender: 'Dr. Sarah Chen', subject: 'Your recent lab results', preview: 'Your CBC and metabolic panel results are in. Overall things look good.', time: '2h ago', unread: true, body: 'Your CBC and metabolic panel results are in. Overall things look good. I’d like to discuss one value at your next appointment.' },
  { id: 2, initials: 'NM', sender: 'Northside Medical Center', subject: 'Refill reminder: Lisinopril', preview: 'Your prescription refill is ready to review.', time: '18h ago', unread: true, body: 'Your Lisinopril prescription is ready for renewal. Please contact the pharmacy if you have any questions.' },
  { id: 3, initials: 'MW', sender: 'Dr. Marcus Webb', subject: 'Pre-appointment instructions', preview: 'Please review these instructions before your visit.', time: '2d ago', body: 'Please review your medication list and have your recent blood pressure readings available for our appointment.' },
  { id: 4, initials: 'AT', sender: 'Appointments Team', subject: 'Appointment confirmed: Dr. Priya Nair', preview: 'Your upcoming appointment has been confirmed.', time: '4d ago', body: 'Your appointment with Dr. Priya Nair is confirmed. Please arrive 15 minutes before the scheduled time.' },
]

export const labs = [
  ['Hemoglobin A1c', '5.8%', '< 5.7%', 'High', 'Sep 15, 2026'],
  ['LDL Cholesterol', '98 mg/dL', '< 100 mg/dL', 'Normal', 'Sep 15, 2026'],
  ['HDL Cholesterol', '62 mg/dL', '> 40 mg/dL', 'Normal', 'Sep 15, 2026'],
  ['Fasting Glucose', '104 mg/dL', '70–99 mg/dL', 'High', 'Sep 15, 2026'],
  ['Creatinine', '0.9 mg/dL', '0.6–1.2 mg/dL', 'Normal', 'Sep 15, 2026'],
  ['TSH', '2.1 mIU/L', '0.4–4.0 mIU/L', 'Normal', 'Aug 3, 2026'],
]

export const careTeam = [
  { initials: 'SC', name: 'Dr. Sarah Chen', role: 'Primary Care Physician', organization: 'Northside Medical Center', phone: '(415) 555-0192', next: 'Today, 5:21 PM' },
  { initials: 'MW', name: 'Dr. Marcus Webb', role: 'Cardiologist', organization: 'Heart & Vascular Institute', phone: '(415) 555-0847', next: 'Tomorrow, 11:21 AM' },
  { initials: 'PN', name: 'Dr. Priya Nair', role: 'Endocrinologist', organization: 'Westfield Health Pavilion', phone: '(415) 555-0334', next: 'Fri, Sep 4 · 1:21 PM' },
  { initials: 'RK', name: 'Dr. Raj Kumar', role: 'Pharmacist', organization: 'CareConnect Pharmacy', phone: '(415) 555-0561', next: '—' },
]
