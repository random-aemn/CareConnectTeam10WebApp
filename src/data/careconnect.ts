export type StatusTone = 'success' | 'danger' | 'info'

export interface Appointment {
  provider: string
  specialty: string
  date: string
  location: string
  type: 'In person' | 'Telehealth'
}

export interface Medication {
  name: string
  dosage: string
  schedule: string
  prescriber: string
  refill: string
  status: 'Missed' | 'On track'
}

export interface Message {
  initials: string
  sender: string
  subject: string
  preview: string
  time: string
  unread?: boolean
}

export const appointments: Appointment[] = [
  { provider: 'Dr. Sarah Chen', specialty: 'Primary Care', date: 'Today, 5:21 PM', location: 'Northside Medical Center, Suite 210', type: 'In person' },
  { provider: 'Dr. Marcus Webb', specialty: 'Cardiology', date: 'Tomorrow, 11:21 AM', location: 'Telehealth · Video call', type: 'Telehealth' },
  { provider: 'Dr. Priya Nair', specialty: 'Endocrinology', date: 'Fri, Sep 4 · 1:21 PM', location: 'Westfield Health Pavilion, Room 114', type: 'In person' },
]

export const medications: Medication[] = [
  { name: 'Lisinopril', dosage: '10 mg', schedule: 'Once daily · 8:00 AM', prescriber: 'Dr. Chen', refill: 'Sep 14, 2026', status: 'Missed' },
  { name: 'Metformin', dosage: '500 mg', schedule: 'Twice daily · 8:00 AM, 8:00 PM', prescriber: 'Dr. Nair', refill: 'Sep 22, 2026', status: 'Missed' },
  { name: 'Atorvastatin', dosage: '20 mg', schedule: 'Once daily · 9:00 PM', prescriber: 'Dr. Webb', refill: 'Oct 3, 2026', status: 'On track' },
  { name: 'Vitamin D3', dosage: '2,000 IU', schedule: 'Once daily · 8:00 AM', prescriber: 'Dr. Chen', refill: 'Nov 1, 2026', status: 'On track' },
]

export const messages: Message[] = [
  { initials: 'SC', sender: 'Dr. Sarah Chen', subject: 'Your recent lab results', preview: 'Your CBC and metabolic panel results are in. Overall things look good.', time: '2h ago', unread: true },
  { initials: 'NM', sender: 'Northside Medical Center', subject: 'Refill reminder: Lisinopril', preview: 'Your prescription refill is ready to review.', time: '18h ago', unread: true },
  { initials: 'MW', sender: 'Dr. Marcus Webb', subject: 'Pre-appointment instructions', preview: 'Please review these instructions before your visit.', time: '2d ago' },
  { initials: 'AT', sender: 'Appointments Team', subject: 'Appointment confirmed: Dr. Priya Nair', preview: 'Your upcoming appointment has been confirmed.', time: '4d ago' },
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
