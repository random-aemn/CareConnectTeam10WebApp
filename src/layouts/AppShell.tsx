import {
    Bell,
    CalendarPlus,
    ChevronRight,
    CircleHelp,
    Download,
    Menu,
    MessageSquarePlus,
    Pill,
    Search,
    ShieldCheck,
    X
} from 'lucide-react'
import {useCallback, useEffect, useMemo, useRef, useState, type ReactNode} from 'react'
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {navigation} from '../app/route-config'
import {Avatar} from '../components/ui/Primitives'
import {useCareConnect} from '../state/careConnectContext'
import {useKeyboardShortcut} from '../hooks/useKeyboardShortcut'
import {usePwaLifecycle} from '../hooks/usePwaLifecycle'
import {useDismissiblePanel} from '../hooks/useDismissiblePanel'

function BrandBar() {
    return <header
        className="fixed inset-x-0 top-0 z-40 flex h-[30px] items-center justify-center bg-navy text-[11px] font-bold text-white">
        <ShieldCheck size={12} className="mr-1.5"/>CareConnect</header>
}

function QuickActions({compact = false, onAction}: { compact?: boolean; onAction?: () => void }) {
    const {openModal} = useCareConnect();
    const navigate = useNavigate()
    const style = compact ? 'w-full justify-start rounded-md px-3 py-2 text-sm text-white hover:bg-white/10' : 'inline-flex items-center gap-2 text-sm text-ink hover:text-blue'
    return <div className={compact ? 'mb-5 space-y-1 border-b border-white/10 pb-4' : 'hidden gap-5 lg:flex'}>
        <button className={style} onClick={() => {
            openModal({type: 'appointment'});
            onAction?.()
        }}><CalendarPlus size={17}/>New appointment
        </button>
        <button className={style} onClick={() => {
            openModal({type: 'message'});
            onAction?.()
        }}><MessageSquarePlus size={17}/>New message
        </button>
        <button className={style} onClick={() => {
            navigate('/medications/add');
            onAction?.()
        }}><Pill size={17}/>Add medication
        </button>
        {compact && <button className={style} onClick={() => {
            openModal({type: 'help'});
            onAction?.()
        }}><CircleHelp size={17}/>Help</button>}</div>
}

function Toolbar({showInstall, install}: {showInstall: boolean; install: () => Promise<void>}) {
    const {state, dispatch, openModal} = useCareConnect();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [menu, setMenu] = useState<'notifications' | 'profile' | null>(null);
    const searchRef = useRef<HTMLInputElement>(null)
    const notificationsButtonRef = useRef<HTMLButtonElement>(null)
    const notificationsPanelRef = useRef<HTMLDivElement>(null)
    const profileButtonRef = useRef<HTMLButtonElement>(null)
    const profilePanelRef = useRef<HTMLDivElement>(null)
    const closeNotifications = useCallback(() => setMenu((current) => current === 'notifications' ? null : current), [])
    const closeProfile = useCallback(() => setMenu((current) => current === 'profile' ? null : current), [])
    useDismissiblePanel(menu === 'notifications', notificationsButtonRef, notificationsPanelRef, closeNotifications)
    useDismissiblePanel(menu === 'profile', profileButtonRef, profilePanelRef, closeProfile)
    const handleKey = useCallback((event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            searchRef.current?.focus()
        }
    }, [])
    useKeyboardShortcut(handleKey)
    const results = useMemo<Array<{ key: string; label: string; detail: string; route: string; messageId?: number }>>(() => {
        const query = search.trim().toLowerCase();
        if (!query) return [];
        return [...state.appointments.filter((x) => `${x.provider} ${x.specialty}`.toLowerCase().includes(query)).map((x) => ({
            key: `appointment-${x.id}`,
            label: x.provider,
            detail: `${x.date} · ${x.status}`,
            route: `/appointments?tab=${x.status === 'Upcoming' ? 'upcoming' : 'past'}`
        })), ...state.medications.filter((x) => x.name.toLowerCase().includes(query)).map((x) => ({
            key: `medication-${x.id}`,
            label: x.name,
            detail: 'Medication',
            route: '/medications'
        })), ...state.messages.filter((x) => `${x.sender} ${x.recipient} ${x.subject}`.toLowerCase().includes(query)).map((x) => ({
            key: `message-${x.id}`,
            label: x.subject,
            detail: x.direction === 'outgoing' ? `To: ${x.recipient}` : x.sender,
            route: '/messages',
            messageId: x.id
        }))].slice(0, 8)
    }, [search, state])
    const choose = (result: (typeof results)[number]) => {
        if (result.messageId) dispatch({type: 'select-message', id: result.messageId});
        navigate(result.route);
        setSearch('')
    }
    return <div
        className="fixed inset-x-0 top-[30px] z-40 hidden h-[52px] items-center border-b border-border bg-white px-4 md:flex md:pl-[76px] lg:pl-4">
        <QuickActions/>
        <div className="relative mx-auto hidden md:block"><label><Search className="absolute left-3 top-2.5 text-muted"
                                                                         size={15}/><span className="sr-only">Search CareConnect</span><input
            ref={searchRef} type="search" role="searchbox" aria-label="Search CareConnect" aria-controls={search ? 'desktop-search-results' : undefined} value={search}
            onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => {
                if (event.key === 'Escape' && search) {
                    event.preventDefault();
                    setSearch('')
                }
            }} placeholder="Search CareConnect (Ctrl/Cmd+K)"
            className="h-9 w-[300px] rounded-md border border-[#718692] bg-[#f8fafb] pl-9 pr-3 text-sm focus:border-blue"/></label><span
            className="sr-only" role="status" aria-live="polite">{search ? results.length ? `${results.length} search result${results.length === 1 ? '' : 's'} available.` : 'No matches found.' : ''}</span>{search &&
            <div id="desktop-search-results" className="absolute top-11 w-full overflow-hidden rounded-md border border-border bg-white shadow-xl"
                 role="region" aria-label="Search results">{results.length ? results.map((result) => <button key={result.key}
                                                                                  onClick={() => choose(result)}
                                                                                  className="block w-full border-b border-border px-4 py-3 text-left text-xs hover:bg-[#e8f3ff]">
                <strong className="block">{result.label}</strong><span className="text-muted">{result.detail}</span>
            </button>) : <p className="p-4 text-xs text-muted">No matches found.</p>}</div>}</div>
        <div className="ml-auto flex items-center gap-3">
            {showInstall && <button className="hidden items-center gap-2 rounded-md border border-[#718692] px-3 text-xs lg:flex" onClick={() => void install()}><Download size={15}/>Install CareConnect</button>}
            <div className="relative">
                <button ref={notificationsButtonRef} aria-label="Notifications" aria-controls={menu === 'notifications' ? 'desktop-notifications-menu' : undefined} aria-expanded={menu === 'notifications'}
                        onClick={() => setMenu(menu === 'notifications' ? null : 'notifications')}
                        className="relative rounded-md p-2"><Bell
                    size={18}/>{state.notifications.some((item) => !item.read) &&
                    <span className="absolute right-1 top-1 size-2 rounded-full bg-[#c2411f]"/>}</button>
                {menu === 'notifications' && <div ref={notificationsPanelRef} id="desktop-notifications-menu" role="region" aria-label="Notifications"
                    className="absolute right-0 top-11 w-80 rounded-md border border-border bg-white p-2 shadow-xl"><h2
                    className="px-3 py-2 text-sm font-bold">Notifications</h2>{state.notifications.map((item) => <button
                    key={item.id} onClick={() => {
                    dispatch({type: 'read-notification', id: item.id});
                    navigate(item.route);
                    setMenu(null)
                }} className="relative block w-full rounded px-3 py-2 text-left hover:bg-[#e8f3ff]"><strong
                    className="block text-xs">{item.title}</strong><span
                    className="text-[10px] text-muted">{item.detail}</span>{!item.read &&
                    <span className="absolute right-3 top-4 size-2 rounded-full bg-blue"/>}</button>)}</div>}</div>
            <button aria-label="Help" className="rounded-md p-2" onClick={() => openModal({type: 'help'})}><CircleHelp
                size={18}/></button>
            <div className="relative">
                <button ref={profileButtonRef} aria-label="Profile menu" onClick={() => setMenu(menu === 'profile' ? null : 'profile')}
                        aria-controls={menu === 'profile' ? 'desktop-profile-menu' : undefined} aria-expanded={menu === 'profile'} className="flex items-center gap-3 rounded-md p-1"><Avatar
                    initials="JD" size="sm"/>
                    <div className="hidden text-left text-[10px] leading-tight xl:block"><strong className="block">Jordan
                        Davis</strong><span className="text-muted">Patient</span></div>
                    <ChevronRight size={16}/></button>
                {menu === 'profile' && <div ref={profilePanelRef} id="desktop-profile-menu" role="region" aria-label="Profile options"
                    className="absolute right-0 top-11 w-48 rounded-md border border-border bg-white p-2 text-sm shadow-xl">
                    <button onClick={() => {
                        navigate('/health-records');
                        setMenu(null)
                    }} className="block w-full rounded px-3 py-2 text-left hover:bg-[#e8f3ff]">View health records
                    </button>
                    <button onClick={() => {
                        navigate('/preferences');
                        setMenu(null)
                    }} className="block w-full rounded px-3 py-2 text-left hover:bg-[#e8f3ff]">Preferences
                    </button>
                </div>}</div>
        </div>
    </div>
}

function NavItems({compact = false, onNavigate}: { compact?: boolean; onNavigate?: () => void }) {
    return <nav aria-label="Primary navigation" className="flex h-full flex-col">
        <p className={`${compact ? 'sr-only' : 'px-3 pb-2'} text-[9px] font-bold uppercase tracking-[.18em] text-[#8eb0c4]`}>Workspace</p>
        {navigation.filter((item) => !item.bottom).map((item) => {
            const Icon = item.icon
            return <NavLink key={item.to} to={item.to} onClick={onNavigate} title={compact ? item.label : undefined}
                            className={({isActive}) => `mx-2 flex h-10 items-center rounded-md text-sm transition-colors ${compact ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive ? 'bg-[#0f5f8c] text-white shadow-[inset_3px_0_0_#28a0ff]' : 'text-[#d7e4eb] hover:bg-white/10'}`}>
                <Icon size={18}/><span className={compact ? 'sr-only' : ''}>{item.label}</span>{'badge' in item && <span
                className={`${compact ? 'absolute ml-7 -mt-6' : 'ml-auto'} flex size-[18px] items-center justify-center rounded-full bg-[#c2411f] text-[9px] font-bold text-white`}>{item.badge}</span>}
            </NavLink>
        })}
        <div className="mt-auto">
            {navigation.filter((item) => item.bottom).map((item) => {
                const Icon = item.icon;
                return <NavLink key={item.to} to={item.to} onClick={onNavigate} title={compact ? item.label : undefined}
                                className={({isActive}) => `mx-2 flex h-10 items-center rounded-md text-sm ${compact ? 'justify-center' : 'gap-3 px-3'} ${isActive ? 'bg-[#0f5f8c] text-white' : 'text-[#d7e4eb]'}`}><Icon
                    size={18}/><span className={compact ? 'sr-only' : ''}>{item.label}</span></NavLink>
            })}
            {!compact &&
                <div className="mx-3 mt-2 border-t border-white/10 pt-3 text-[9px] text-[#7899ab]">♢ &nbsp; HIPAA-secure
                    session</div>}
        </div>
    </nav>
}

function DesktopSidebar() {
    return <aside className="fixed bottom-0 left-0 top-[82px] z-30 hidden w-[210px] bg-navy px-1 py-4 lg:block">
        <NavItems/></aside>
}

function TabletSidebar() {
    return <aside className="fixed bottom-0 left-0 top-[82px] z-30 hidden w-16 bg-navy py-4 md:block lg:hidden">
        <NavItems compact/></aside>
}

function MobileHeader() {
    const [open, setOpen] = useState(false);
    const [panel, setPanel] = useState<'notifications' | 'profile' | null>(null);
    const [search, setSearch] = useState('');
    const {state, dispatch} = useCareConnect();
    const navigate = useNavigate()
    const drawerRef = useRef<HTMLDialogElement>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    const notificationsButtonRef = useRef<HTMLButtonElement>(null)
    const notificationsPanelRef = useRef<HTMLDivElement>(null)
    const profileButtonRef = useRef<HTMLButtonElement>(null)
    const profilePanelRef = useRef<HTMLDivElement>(null)
    const closeNotifications = useCallback(() => setPanel((current) => current === 'notifications' ? null : current), [])
    const closeProfile = useCallback(() => setPanel((current) => current === 'profile' ? null : current), [])
    useDismissiblePanel(panel === 'notifications', notificationsButtonRef, notificationsPanelRef, closeNotifications)
    useDismissiblePanel(panel === 'profile', profileButtonRef, profilePanelRef, closeProfile)
    const closeDrawer = useCallback(() => {
        if (drawerRef.current?.open) drawerRef.current.close()
        setOpen(false)
        window.setTimeout(() => menuButtonRef.current?.focus())
    }, [])
    useEffect(() => {
        const drawer = drawerRef.current
        if (open && drawer && !drawer.open) drawer.showModal()
    }, [open])
    const mobileResults = useMemo<Array<{ key: string; label: string; detail: string; route: string; messageId?: number }>>(() => {
        const query = search.trim().toLowerCase();
        if (!query) return [];
        return [...state.appointments.filter((item) => item.provider.toLowerCase().includes(query)).map((item) => ({
            key: `appointment-${item.id}`,
            label: item.provider,
            detail: `${item.date} · ${item.status}`,
            route: `/appointments?tab=${item.status === 'Upcoming' ? 'upcoming' : 'past'}`
        })), ...state.medications.filter((item) => item.name.toLowerCase().includes(query)).map((item) => ({
            key: `medication-${item.id}`,
            label: item.name,
            detail: 'Medication',
            route: '/medications'
        })), ...state.messages.filter((item) => `${item.sender} ${item.recipient} ${item.subject}`.toLowerCase().includes(query)).map((item) => ({
            key: `message-${item.id}`,
            label: item.subject,
            detail: item.direction === 'outgoing' ? `To: ${item.recipient}` : item.sender,
            route: '/messages',
            messageId: item.id
        }))].slice(0, 6)
    }, [search, state])
    return <>
        <div
            className="fixed inset-x-0 top-[30px] z-40 flex h-[64px] items-center border-b border-border bg-white px-3 md:hidden">
            <button ref={menuButtonRef} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-controls="mobile-navigation-drawer" aria-expanded={open} aria-label="Open navigation"
                    className="rounded-md border border-border p-2"><Menu size={20}/></button>
            <strong className="ml-3 text-sm text-ink">CareConnect</strong>
            <div className="ml-auto flex items-center gap-2">
                <button ref={notificationsButtonRef} aria-label="Notifications" aria-controls={panel === 'notifications' ? 'mobile-notifications-menu' : undefined} aria-expanded={panel === 'notifications'}
                        onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')}
                        className="relative rounded p-2"><Bell
                    size={18}/>{state.notifications.some((item) => !item.read) &&
                    <span className="absolute right-1 top-1 size-2 rounded-full bg-[#c2411f]"/>}</button>
                <button ref={profileButtonRef} aria-label="Profile menu" aria-controls={panel === 'profile' ? 'mobile-profile-menu' : undefined} aria-expanded={panel === 'profile'} onClick={() => setPanel(panel === 'profile' ? null : 'profile')}
                        className="flex items-center gap-1 rounded p-1"><Avatar initials="JD" size="sm"/><ChevronRight
                    size={15}/></button>
            </div>
            {panel === 'notifications' && <div ref={notificationsPanelRef} id="mobile-notifications-menu" role="region" aria-label="Notifications"
                className="absolute right-3 top-16 w-[calc(100%-1.5rem)] rounded-md border border-border bg-white p-2 shadow-xl">
                <h2 className="p-2 text-sm font-bold">Notifications</h2>{state.notifications.map((item) => <button
                key={item.id} className="block w-full rounded p-3 text-left hover:bg-[#e8f3ff]" onClick={() => {
                dispatch({type: 'read-notification', id: item.id});
                navigate(item.route);
                setPanel(null)
            }}><strong className="block text-xs">{item.title}</strong><span
                className="text-[10px] text-muted">{item.detail}</span></button>)}</div>}{panel === 'profile' && <div
            ref={profilePanelRef} id="mobile-profile-menu" role="region" aria-label="Profile options" className="absolute right-3 top-16 w-52 rounded-md border border-border bg-white p-2 text-sm shadow-xl">
            <button className="block w-full rounded p-3 text-left hover:bg-[#e8f3ff]" onClick={() => {
                navigate('/health-records');
                setPanel(null)
            }}>View health records
            </button>
            <button className="block w-full rounded p-3 text-left hover:bg-[#e8f3ff]" onClick={() => {
                navigate('/preferences');
                setPanel(null)
            }}>Preferences
            </button>
        </div>}</div>
        <dialog ref={drawerRef} id="mobile-navigation-drawer" aria-label="Navigation menu" onCancel={(event) => {
            event.preventDefault();
            closeDrawer()
        }} className="m-0 h-full max-h-none w-72 max-w-none overflow-y-auto border-0 bg-navy p-3 backdrop:bg-black/40 md:hidden">
                <div className="mb-4 flex items-center justify-between text-white"><strong>CareConnect</strong>
                    <button autoFocus onClick={closeDrawer} aria-label="Close navigation" className="rounded p-2"><X/>
                    </button>
                </div>
                <div className="relative mb-4"><Search className="absolute left-3 top-2.5 text-[#8eb0c4]"
                                                       size={16}/><input value={search}
                                                                         onChange={(event) => setSearch(event.target.value)}
                                                                         onKeyDown={(event) => {
                                                                             if (event.key === 'Escape' && search) {
                                                                                 event.preventDefault();
                                                                                 event.stopPropagation();
                                                                                 setSearch('')
                                                                             }
                                                                         }}
                                                                         type="search" role="searchbox" aria-label="Search CareConnect" aria-controls={search ? 'mobile-search-results' : undefined}
                                                                         placeholder="Search CareConnect"
                                                                         className="h-10 w-full rounded-md border border-white/20 bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-[#8eb0c4]"/><span
                    className="sr-only" role="status" aria-live="polite">{search ? mobileResults.length ? `${mobileResults.length} search result${mobileResults.length === 1 ? '' : 's'} available.` : 'No matches found.' : ''}</span>{search &&
                    <div id="mobile-search-results" role="region" aria-label="Search results"
                        className="mt-1 overflow-hidden rounded-md bg-white">{mobileResults.length ? mobileResults.map((result) =>
                            <button key={result.key}
                                    className="block w-full border-b border-border p-3 text-left text-xs text-ink"
                                    onClick={() => {
                                        if (result.messageId) dispatch({type: 'select-message', id: result.messageId});
                                        navigate(result.route);
                                         closeDrawer();
                                        setSearch('')
                                    }}><strong className="block">{result.label}</strong><span className="text-[10px] text-muted">{result.detail}</span></button>) :
                        <p className="p-3 text-xs text-muted">No matches found.</p>}</div>}</div>
                <QuickActions compact onAction={closeDrawer}/><NavItems onNavigate={closeDrawer}/>
        </dialog>
    </>
}

function ConnectionStatus() {
    const {online, pendingSync, needsAttention, syncing, lastSync} = useCareConnect()
    if (online && !pendingSync && !needsAttention && !syncing) return null
    const last = lastSync ? new Date(lastSync).toLocaleString() : 'not yet synchronized'
    return <div role="status" className={`fixed inset-x-0 bottom-0 z-50 px-4 py-3 text-center text-sm font-semibold text-white ${online ? 'bg-action' : 'bg-[#8a3b12]'}`}>
        {!online ? `You’re offline. Cached information may not be current. Changes are saved locally and will sync when the connection returns.` : syncing ? 'Demo synchronization is in progress.' : 'Some locally saved changes are waiting to synchronize.'}
        {pendingSync > 0 && ` ${pendingSync} change${pendingSync === 1 ? '' : 's'} waiting.`}
        {needsAttention > 0 && ` ${needsAttention} change${needsAttention === 1 ? '' : 's'} need attention.`} Last demo sync: {last}.
    </div>
}

export default function AppShell({children}: { children: ReactNode }) {
    const location = useLocation()
    const pwa = usePwaLifecycle(location.pathname)
    return <div className="min-h-screen bg-canvas">{ <a href="#main-content"
                                                      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-white focus:p-3">Skip
        to content</a> }<BrandBar/><Toolbar showInstall={pwa.showInstall && pwa.canPromptInstall} install={pwa.install}/><DesktopSidebar/><TabletSidebar/><MobileHeader/>
        <main id="main-content"
              className="min-h-screen pb-12 pt-[94px] md:ml-16 md:pt-[82px] lg:ml-[210px]">{children}</main>
        <ConnectionStatus/>
        {pwa.showInstall && <div className="fixed bottom-5 left-1/2 z-[60] w-[min(92vw,34rem)] -translate-x-1/2 rounded-lg border border-border bg-white p-4 shadow-xl" role="region" aria-label="Install CareConnect"><strong className="text-sm">Install CareConnect</strong><p className="mt-1 text-xs text-muted">Install for faster access and offline availability of previously viewed demo records.</p>{pwa.isIos && !pwa.canPromptInstall && <p className="mt-2 text-xs">In Safari, use Share, then Add to Home Screen.</p>}<div className="mt-3 flex gap-2">{pwa.canPromptInstall && <button className="rounded-md bg-action px-4 py-2 text-xs font-bold text-white" onClick={() => void pwa.install()}>Install</button>}<button className="rounded-md border border-[#718692] px-4 py-2 text-xs" onClick={pwa.dismissInstall}>Not now</button></div></div>}
        {pwa.updateAvailable && <div className="fixed bottom-5 right-5 z-[65] max-w-sm rounded-lg bg-navy p-4 text-white shadow-xl" role="status"><strong className="text-sm">A new version of CareConnect is available.</strong><p className="mt-1 text-xs text-[#d7e4eb]">Locally saved work will be preserved.</p>{pwa.updateBlocked && <p className="mt-2 text-xs font-bold text-white">Save or cancel the open form before updating.</p>}<div className="mt-3 flex gap-2"><button className="rounded bg-white px-3 py-2 text-xs font-bold text-navy" onClick={pwa.applyUpdate}>Update now</button><button className="rounded border border-white/50 px-3 py-2 text-xs" onClick={pwa.deferUpdate}>Later</button></div></div>}
    </div>
}
