import type {ButtonHTMLAttributes, ReactNode} from 'react'

export function Card({children, className = ''}: { children: ReactNode; className?: string }) {
    return <div className={`rounded-[9px] border border-border bg-white shadow-card ${className}`}>{children}</div>
}

export function Button({
                           children,
                           variant = 'primary',
                           className = '',
                           ...props
                       }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
    const styles = variant === 'primary' ? 'bg-action text-white border-action' : variant === 'secondary' ? 'bg-white text-action border-[#718692]' : 'border-transparent bg-transparent text-action'
    return <button
        className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${styles} ${className}`} {...props}>{children}</button>
}

export function Badge({children, tone = 'success'}: { children: ReactNode; tone?: 'success' | 'danger' | 'info' }) {
    const tones = {
        success: 'bg-[#e9f8f1] text-[#13734d]',
        danger: 'bg-[#fff0ed] text-[#c53b20]',
        info: 'bg-[#f3eafa] text-[#7d3fb2]'
    }
    return <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${tones[tone]}`}>{children}</span>
}

export function Avatar({initials, size = 'md'}: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {sm: 'size-7 text-[9px]', md: 'size-9 text-[11px]', lg: 'size-11 text-xs'}
    return <span aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-action font-bold text-white ${sizes[size]}`}>{initials}</span>
}
