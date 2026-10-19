import { CalendarDays, FileHeart, LayoutGrid, MessageSquare, Pill, Settings, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavigationItem {
  to: string
  label: string
  icon: LucideIcon
  badge?: number
  section?: string
  bottom?: boolean
}

export const navigation: NavigationItem[] = [
  { to: '/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/medications', label: 'Medications', icon: Pill, badge: 2 },
  { to: '/messages', label: 'Messages', icon: MessageSquare, badge: 2 },
  { to: '/health-records', label: 'Health records', icon: FileHeart, section: 'Care' },
  { to: '/care-team', label: 'Care team', icon: Shield },
  { to: '/preferences', label: 'Preferences', icon: Settings, bottom: true },
]
