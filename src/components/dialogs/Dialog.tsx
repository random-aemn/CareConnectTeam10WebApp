import {X} from 'lucide-react'
import {useEffect, useId, useRef, type FormEvent, type ReactNode} from 'react'

export function Dialog({title, description, children, actions, onClose, onSubmit}: {
    title: string;
    description?: string;
    children: ReactNode;
    actions: ReactNode;
    onClose: () => void;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}) {
    const ref = useRef<HTMLDialogElement>(null)
    const opener = useRef<HTMLElement | null>(null)
    const titleId = useId()
    const descriptionId = useId()
    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        dialog.showModal()
        const initialFocusTimer = window.setTimeout(() => dialog.querySelector<HTMLElement>('[autofocus], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])')?.focus())
        return () => {
            window.clearTimeout(initialFocusTimer)
            const target = opener.current;
            window.setTimeout(() => target?.isConnected && target.focus())
        }
    }, [])
    return <dialog ref={ref} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onCancel={(event) => {
        event.preventDefault();
        onClose()
    }}
                   className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-xl border-0 bg-white p-0 text-ink shadow-2xl backdrop:bg-[#06263a]/60">
        <form method="dialog" onSubmit={onSubmit} data-pwa-unsaved={onSubmit ? true : undefined}>
            <header className="flex items-start justify-between border-b border-border px-5 py-4">
                <div><h2 id={titleId} className="font-serif text-xl font-bold text-navy">{title}</h2>{description &&
                    <p id={descriptionId} className="mt-1 text-xs text-muted">{description}</p>}</div>
                <button type="button" onClick={onClose} aria-label={`Close ${title}`}
                        className="rounded-md p-2 hover:bg-canvas"><X size={18}/></button>
            </header>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-5">{children}</div>
            <footer
                className="flex flex-wrap justify-end gap-2 border-t border-border bg-[#f8fafb] px-5 py-4">{actions}</footer>
        </form>
    </dialog>
}

export function Field({label, required, children, hint}: {
    label: string;
    required?: boolean;
    children: ReactNode;
    hint?: string
}) {
    return <label className="block text-xs font-bold text-ink"><span>{label}{required &&
        <span aria-hidden="true" className="text-[#c53b20]"> *</span>}</span>
        <div
            className="mt-2 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-[#718692] [&_input]:p-3 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-[#718692] [&_select]:bg-white [&_select]:p-3 [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-[#718692] [&_textarea]:p-3">{children}</div>
        {hint && <small className="mt-1 block font-normal text-muted">{hint}</small>}</label>
}
