import { Bell, ChevronRight, HelpCircle, Menu, Search, ShieldCheck, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navigation } from '../app/route-config'
import { Avatar } from '../components/ui/Primitives'

function BrandBar() {
  return <div className="fixed inset-x-0 top-0 z-40 flex h-[30px] items-center justify-center bg-navy text-[11px] font-bold text-white"><ShieldCheck size={12} className="mr-1.5" />CareConnect</div>
}

function BrowserBar() {
  const location = useLocation()
  return <div className="fixed inset-x-0 top-[30px] z-40 hidden h-[34px] items-center justify-center border-b border-border bg-white sm:flex"><div className="flex h-6 w-[420px] items-center rounded border border-[#cbd8e0] bg-[#f5f8fa] px-2 text-xs text-muted"><span className="mr-2 size-1.5 rounded-full bg-[#1c9b6d]" /><span className="mx-auto">careconnect.health{location.pathname}</span></div></div>
}

function Toolbar() {
  return <div className="fixed inset-x-0 top-[64px] z-40 hidden h-[52px] items-center border-b border-border bg-white px-4 md:flex md:pl-[76px] lg:pl-4">
    <div className="hidden gap-5 text-sm text-ink lg:flex"><span>▣ New appointment</span><span>□ New message</span><span>◇ Add medication</span></div>
    <label className="relative mx-auto hidden md:block"><Search className="absolute left-3 top-2.5 text-muted" size={15} /><input aria-label="Search CareConnect" placeholder="Search CareConnect" className="h-9 w-[300px] rounded-md border border-[#cbd8e0] bg-[#f8fafb] pl-9 pr-3 text-sm outline-none focus:border-blue" /></label>
    <div className="ml-auto flex items-center gap-4"><Bell size={18} /><HelpCircle size={17} /><Avatar initials="JD" size="sm" /><div className="hidden text-[10px] leading-tight xl:block"><strong className="block">Jordan Davis</strong><span className="text-muted">Patient</span></div><ChevronRight size={16} /></div>
  </div>
}

function NavItems({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return <nav aria-label="Primary navigation" className="flex h-full flex-col">
    <p className={`${compact ? 'sr-only' : 'px-3 pb-2'} text-[9px] font-bold uppercase tracking-[.18em] text-[#8eb0c4]`}>Workspace</p>
    {navigation.filter((item) => !item.bottom).map((item) => {
      const Icon = item.icon
      return <NavLink key={item.to} to={item.to} onClick={onNavigate} title={compact ? item.label : undefined} className={({ isActive }) => `mx-2 flex h-10 items-center rounded-md text-sm transition-colors ${compact ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive ? 'bg-[#0f5f8c] text-white shadow-[inset_3px_0_0_#28a0ff]' : 'text-[#d7e4eb] hover:bg-white/10'}`}>
        <Icon size={18} /><span className={compact ? 'sr-only' : ''}>{item.label}</span>{'badge' in item && <span className={`${compact ? 'absolute ml-7 -mt-6' : 'ml-auto'} flex size-[18px] items-center justify-center rounded-full bg-[#ef5b2a] text-[9px] font-bold text-white`}>{item.badge}</span>}
      </NavLink>
    })}
    <div className="mt-auto">
      {navigation.filter((item) => item.bottom).map((item) => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} onClick={onNavigate} title={compact ? item.label : undefined} className={({ isActive }) => `mx-2 flex h-10 items-center rounded-md text-sm ${compact ? 'justify-center' : 'gap-3 px-3'} ${isActive ? 'bg-[#0f5f8c] text-white' : 'text-[#d7e4eb]'}`}><Icon size={18} /><span className={compact ? 'sr-only' : ''}>{item.label}</span></NavLink> })}
      {!compact && <div className="mx-3 mt-2 border-t border-white/10 pt-3 text-[9px] text-[#7899ab]">♢ &nbsp; HIPAA-secure session</div>}
    </div>
  </nav>
}

function DesktopSidebar() { return <aside className="fixed bottom-6 left-0 top-[116px] z-30 hidden w-[210px] bg-navy px-1 py-4 lg:block"><NavItems /></aside> }
function TabletSidebar() { return <aside className="fixed bottom-6 left-0 top-[116px] z-30 hidden w-16 bg-navy py-4 md:block lg:hidden"><NavItems compact /></aside> }

function MobileHeader() {
  const [open, setOpen] = useState(false)
  return <>
    <div className="fixed inset-x-0 top-[30px] z-40 flex h-[64px] items-center border-b border-border bg-white px-3 md:hidden"><button onClick={() => setOpen(true)} aria-expanded={open} aria-label="Open navigation" className="rounded-md border border-border p-2"><Menu size={20} /></button><strong className="ml-3 text-sm text-ink">Overview</strong><div className="ml-auto flex items-center gap-4"><Bell size={18} /><Avatar initials="JD" size="sm" /><ChevronRight size={15} /></div></div>
    {open && <div className="fixed inset-0 z-50 bg-black/40 md:hidden"><aside className="h-full w-72 bg-navy p-3"><div className="mb-6 flex items-center justify-between text-white"><strong>CareConnect</strong><button onClick={() => setOpen(false)} aria-label="Close navigation" className="rounded p-2"><X /></button></div><NavItems onNavigate={() => setOpen(false)} /></aside></div>}
  </>
}

function StatusBar() { return <div className="fixed inset-x-0 bottom-0 z-40 flex h-6 items-center border-t border-border bg-white px-3 text-[9px] text-muted"><span className="mr-1.5 size-1.5 rounded-full bg-[#1a9c6a]" />Connected securely<span className="ml-auto hidden sm:block">Last synced just now &nbsp;&nbsp;&nbsp; CareConnect v3.4.1</span></div> }

export default function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-canvas"><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-white focus:p-3">Skip to content</a><BrandBar /><BrowserBar /><Toolbar /><DesktopSidebar /><TabletSidebar /><MobileHeader /><main id="main-content" className="min-h-screen pb-12 pt-[118px] md:ml-16 lg:ml-[210px]">{children}</main><StatusBar /></div>
}
