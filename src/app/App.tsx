import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import WorkflowDialogs from '../components/dialogs/WorkflowDialogs'
import { CareConnectProvider } from '../state/CareConnectContext'

const OverviewPage = lazy(() => import('../pages/OverviewPage'))
const AppointmentsPage = lazy(() => import('../pages/AppointmentsPage'))
const MedicationsPage = lazy(() => import('../pages/MedicationsPage'))
const MessagesPage = lazy(() => import('../pages/MessagesPage'))
const HealthRecordsPage = lazy(() => import('../pages/HealthRecordsPage'))
const CareTeamPage = lazy(() => import('../pages/CareTeamPage'))
const PreferencesPage = lazy(() => import('../pages/PreferencesPage'))
const AddMedicationPage = lazy(() => import('../pages/AddMedicationPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function RouteTitle() {
  const location = useLocation()
  useEffect(() => { const title = location.pathname.split('/').filter(Boolean)[0]?.replace('-', ' ') ?? 'Overview'; document.title = `${title.charAt(0).toUpperCase() + title.slice(1)} | CareConnect` }, [location.pathname])
  return null
}

export default function App() {
  return <CareConnectProvider><AppShell><RouteTitle /><Suspense fallback={<div role="status" className="p-8 text-sm text-muted">Loading CareConnect…</div>}><Routes><Route path="/" element={<Navigate to="/overview" replace />} /><Route path="/overview" element={<OverviewPage />} /><Route path="/appointments" element={<AppointmentsPage />} /><Route path="/medications" element={<MedicationsPage />} /><Route path="/medications/add" element={<AddMedicationPage />} /><Route path="/messages" element={<MessagesPage />} /><Route path="/health-records" element={<HealthRecordsPage />} /><Route path="/care-team" element={<CareTeamPage />} /><Route path="/preferences" element={<PreferencesPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></Suspense></AppShell><WorkflowDialogs /></CareConnectProvider>
}
