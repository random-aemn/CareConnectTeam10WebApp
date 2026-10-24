import type {ReactNode} from 'react'
import {Button} from './Primitives'
import {usePageHeadingFocus} from '../../hooks/usePageHeadingFocus'

export function PageLayout({title, description, action, actionIcon, actionDisabled, actionTitle, onAction, children}: {
    title: string;
    description: string;
    action?: string;
    actionIcon?: ReactNode;
    actionDisabled?: boolean;
    actionTitle?: string;
    onAction?: () => void;
    children: ReactNode
}) {
    const headingRef = usePageHeadingFocus()
    return <div className="mx-auto w-full max-w-[1290px] px-5 py-5 md:px-6 md:py-6 lg:px-[30px] lg:py-[30px]">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div><h1 ref={headingRef} tabIndex={-1} className="font-serif text-[26px] font-bold leading-tight text-navy">{title}</h1><p
                className="mt-1 text-xs text-muted">{description}</p></div>
            {action && <Button onClick={onAction} disabled={actionDisabled} title={actionTitle}><span aria-hidden>{actionIcon}</span>{action}</Button>}</div>
        {children}
    </div>
}
