import {Link} from 'react-router-dom'
import {usePageHeadingFocus} from '../hooks/usePageHeadingFocus'

export default function NotFoundPage() {
    const headingRef = usePageHeadingFocus()
    return <div className="p-10"><h1 ref={headingRef} tabIndex={-1} className="font-serif text-3xl font-bold text-navy">Page not found</h1><p
        className="mt-3 text-muted">The requested CareConnect page is not available.</p><Link to="/overview"
                                                                                              className="mt-5 inline-block text-blue underline">Return
        to overview</Link></div>
}
