import {Activity} from 'lucide-react'
import {Badge, Card} from '../components/ui/Primitives'
import {PageLayout} from '../components/ui/PageLayout'
import {labs} from '../data/careconnect'
import {useState} from 'react'
import {useCareConnect} from '../state/careConnectContext'

export default function HealthRecordsPage() {
    const [tab, setTab] = useState('Labs');
    const {notify} = useCareConnect()
    const exportSummary = () => {
        const text = ['CareConnect health summary', ...labs.map((row) => row.join(' | '))].join('\n');
        const url = URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'careconnect-health-summary.txt';
        link.click();
        URL.revokeObjectURL(url);
        notify('Health summary exported.')
    }
    const info: Record<string, string[]> = {
        Vitals: ['Blood pressure — 118/76 mmHg', 'Heart rate — 72 bpm', 'Weight — 164 lb'],
        Immunizations: ['Influenza — Sep 12, 2026', 'COVID-19 booster — May 8, 2026', 'Tdap — Mar 18, 2024'],
        Documents: ['Annual wellness summary — Aug 12, 2026', 'Cardiology visit notes — Jul 20, 2026']
    }
    return <PageLayout title="Health records" description="Lab results, vitals, immunizations, and clinical documents."
                       action="Export summary" actionIcon={<Activity size={16}/>} onAction={exportSummary}>
        <div className="mb-0 flex overflow-x-auto border-b border-border"
             role="tablist">{['Labs', 'Vitals', 'Immunizations', 'Documents'].map((item) => <button role="tab"
                                                                                                    aria-selected={tab === item}
                                                                                                    onClick={() => setTab(item)}
                                                                                                    key={item}
                                                                                                    className={`${tab === item ? 'border-blue text-action' : 'border-transparent text-muted'} whitespace-nowrap border-b-2 px-4 py-3 text-sm`}>{item}{item === 'Labs' &&
            <span className="ml-1 rounded-full bg-action px-1.5 text-[9px] text-white">2</span>}</button>)}</div>
        {tab === 'Labs' ? <Card className="overflow-hidden rounded-t-none">
            <div
                className="hidden grid-cols-[1.4fr_1fr_1fr_.65fr_.8fr] bg-[#f8fafb] px-5 py-3 text-[9px] font-bold uppercase text-muted md:grid">
                <span>Test</span><span>Result</span><span>Reference range</span><span>Status</span><span>Date</span>
            </div>
            {labs.map(([test, result, range, status, date]) => <div key={test}
                                                                    className="grid gap-2 border-t border-border px-5 py-4 text-xs md:grid-cols-[1.4fr_1fr_1fr_.65fr_.8fr]">
                <span>{test}</span><strong>{result}</strong><span className="text-muted">{range}</span><span><Badge
                tone={status === 'High' ? 'danger' : 'success'}>{status}</Badge></span><span
                className="text-muted">{date}</span></div>)}</Card> : <Card className="rounded-t-none p-5">
            <ul className="space-y-3 text-sm">{info[tab].map((item) => <li key={item}
                                                                           className="rounded-md bg-canvas p-4">{item}</li>)}</ul>
        </Card>}
    </PageLayout>
}
