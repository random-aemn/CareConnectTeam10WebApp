import {lazy, Suspense, useEffect} from 'react'
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import WorkflowDialogs from '../components/dialogs/WorkflowDialogs'
import {CareConnectProvider} from '../state/CareConnectProvider'
import {useCareConnect} from '../state/careConnectContext'

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
    useEffect(() => {
        const title = location.pathname.split('/').filter(Boolean)[0]?.replace('-', ' ') ?? 'Overview';
        document.title = `${title.charAt(0).toUpperCase() + title.slice(1)} | CareConnect`
    }, [location.pathname])
    return null
}

function ShortcutLauncher() {
    const location = useLocation()
    const {openModal} = useCareConnect()
    useEffect(() => {
        const action = new URLSearchParams(location.search).get('action')
        if (action === 'request-appointment') openModal({type: 'appointment'})
    }, [location.search, openModal])
    return null
}

function StandaloneStartPage() {
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (!window.matchMedia?.('(display-mode: standalone)').matches || location.pathname !== '/overview') return
        if (sessionStorage.getItem('careconnect-start-page-restored') === 'true') return
        sessionStorage.setItem('careconnect-start-page-restored', 'true')
        try {
            const preference = JSON.parse(localStorage.getItem('careconnect-web-preferences-v1') ?? '{}') as {startPage?: string}
            const routes: Record<string, string> = {Appointments: '/appointments', Messages: '/messages'}
            if (preference.startPage && routes[preference.startPage]) navigate(routes[preference.startPage], {replace: true})
        } catch {
            // Invalid local preferences fall back to Overview.
        }
    }, [location.pathname, navigate])
    return null
}

export default function App() {
    return <CareConnectProvider><AppShell><RouteTitle/><ShortcutLauncher/><StandaloneStartPage/><Suspense
        fallback={<div role="status" className="p-8 text-sm text-muted">Loading CareConnect…</div>}><Routes><Route
        path="/" element={<Navigate to="/overview" replace/>}/><Route path="/overview" element={<OverviewPage/>}/><Route
        path="/appointments" element={<AppointmentsPage/>}/><Route path="/medications"
                                                                   element={<MedicationsPage/>}/><Route
        path="/medications/add" element={<AddMedicationPage/>}/><Route path="/messages"
                                                                       element={<MessagesPage/>}/><Route
        path="/health-records" element={<HealthRecordsPage/>}/><Route path="/care-team"
                                                                      element={<CareTeamPage/>}/><Route
        path="/preferences" element={<PreferencesPage/>}/><Route path="*" element={
        <NotFoundPage/>}/></Routes></Suspense></AppShell><WorkflowDialogs/></CareConnectProvider>
}
