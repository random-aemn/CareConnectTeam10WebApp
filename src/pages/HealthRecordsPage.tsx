import {Activity} from 'lucide-react'
import {Badge, Card} from '../components/ui/Primitives'
import {PageLayout} from '../components/ui/PageLayout'
import {labs} from '../data/careconnect'
import {useState} from 'react'
import {useCareConnect} from '../state/careConnectContext'

export default function HealthRecordsPage() {
    const [tab, setTab] = useState('Labs');
    const {notify, online} = useCareConnect()
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
    const tabs = ['Labs', 'Vitals', 'Immunizations', 'Documents']
    const selectTabWithKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length
        setTab(tabs[nextIndex])
        document.getElementById(`health-${tabs[nextIndex].toLowerCase()}-tab`)?.focus()
    }
    return <PageLayout title="Health records" description="Lab results, vitals, immunizations, and clinical documents."
                       action="Export summary" actionIcon={<Activity size={16}/>} actionDisabled={!online}
                       actionTitle={online ? undefined : 'Export is unavailable offline'} onAction={exportSummary}>
        <div className="mb-0 flex overflow-x-auto border-b border-border"
             role="tablist" aria-label="Health record categories">{tabs.map((item, index) => <button id={`health-${item.toLowerCase()}-tab`} role="tab"
                                                                                                    aria-controls="health-records-panel"
                                                                                                    aria-selected={tab === item}
                                                                                                    tabIndex={tab === item ? 0 : -1}
                                                                                                    onKeyDown={(event) => selectTabWithKey(event, index)}
                                                                                                    onClick={() => setTab(item)}
                                                                                                    key={item}
                                                                                                    className={`${tab === item ? 'border-blue text-action' : 'border-transparent text-muted'} whitespace-nowrap border-b-2 px-4 py-3 text-sm`}>{item}{item === 'Labs' &&
            <span className="ml-1 rounded-full bg-action px-1.5 text-[9px] text-white">2</span>}</button>)}</div>
        <div id="health-records-panel" role="tabpanel" aria-labelledby={`health-${tab.toLowerCase()}-tab`} tabIndex={0}>{tab === 'Labs' ? <Card className="overflow-x-auto rounded-t-none">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                <caption className="sr-only">Laboratory results</caption>
                <thead className="bg-[#f8fafb] text-[9px] font-bold uppercase text-muted"><tr><th scope="col" className="px-5 py-3">Test</th><th scope="col" className="px-5 py-3">Result</th><th scope="col" className="px-5 py-3">Reference range</th><th scope="col" className="px-5 py-3">Status</th><th scope="col" className="px-5 py-3">Date</th></tr></thead>
                <tbody>{labs.map(([test, result, range, status, date]) => <tr key={test} className="border-t border-border"><th scope="row" className="px-5 py-4 font-normal">{test}</th><td className="px-5 py-4 font-bold">{result}</td><td className="px-5 py-4 text-muted">{range}</td><td className="px-5 py-4"><Badge tone={status === 'High' ? 'danger' : 'success'}>{status}</Badge></td><td className="px-5 py-4 text-muted">{date}</td></tr>)}</tbody>
            </table>
        </Card> : <Card className="rounded-t-none p-5">
            <ul className="space-y-3 text-sm">{info[tab].map((item) => <li key={item}
                                                                           className="rounded-md bg-canvas p-4">{item}</li>)}</ul>
        </Card>}</div>
    </PageLayout>
}
