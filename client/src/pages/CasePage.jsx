import { Link } from 'react-router-dom';
import { ArrowUpRight, ClipboardList, Clock3, Fingerprint, MapPin, Users } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Badge, Card } from '../components/common/UI.jsx';
import { CaseHeader } from '../components/mystery/CaseHeader.jsx';
import { sampleCase } from '../mocks/sampleCase.js';

export function CasePage() {
  const caseFile = sampleCase;
  return <AppShell><main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
    <CaseHeader caseFile={caseFile} />
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.8fr)]">
      <div className="space-y-8">
        <section><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#e3c88f]"><ClipboardList size={14} /> Incident briefing</div><p className="mt-4 max-w-3xl text-base leading-8 text-paper/90">{caseFile.summary}</p></section>
        <section><SectionTitle icon={Fingerprint} title="Investigation objectives" /><div className="mt-4 grid gap-3 sm:grid-cols-3">{caseFile.objectives.map((item, index) => <Card key={item} className="p-4"><span className="font-mono text-[10px] text-signal">0{index + 1}</span><p className="mt-3 text-sm leading-6 text-paper">{item}</p></Card>)}</div></section>
        <section><div className="flex items-end justify-between gap-4"><SectionTitle icon={Users} title="Persons of interest" /><Link to={`/cases/${caseFile.id}/investigate?tab=suspects`} className="text-xs text-signal hover:text-paper">Review all</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{caseFile.suspects.slice(0, 2).map((suspect) => <SuspectPreview key={suspect.id} suspect={suspect} />)}</div></section>
      </div>
      <aside className="space-y-4">
        <Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Case file</h2><Badge tone="evidence">Open</Badge></div><dl className="mt-5 space-y-4"> <Meta icon={MapPin} label="Location" value={caseFile.location} /><Meta icon={Clock3} label="Incident window" value={caseFile.date} /><Meta icon={Users} label="Persons of interest" value={`${caseFile.suspects.length} profiles`} /><Meta icon={ClipboardList} label="Evidence collected" value={`${caseFile.evidence.length} items`} /></dl></Card>
        <Card className="border-[#5f5136] bg-[#d4a95f]/[0.05] p-5"><h2 className="font-medium text-paper">Before you begin</h2><p className="mt-2 text-xs leading-5 text-muted">This is a fixed demo case. Your notes and saved evidence stay in this browser. All people and events are fictional.</p><Link to={`/cases/${caseFile.id}/investigate`} className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-signal hover:text-paper">Start investigation <ArrowUpRight size={14} /></Link></Card>
      </aside>
    </div>
  </main></AppShell>;
}

function SectionTitle({ icon: Icon, title }) { return <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#e3c88f]"><Icon size={14} />{title}</h2>; }
function Meta({ icon: Icon, label, value }) { return <div className="flex gap-3"><Icon size={15} className="mt-0.5 shrink-0 text-muted" /><div><dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted">{label}</dt><dd className="mt-1 text-xs leading-5 text-paper">{value}</dd></div></div>; }
function SuspectPreview({ suspect }) { return <Card className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center border border-line bg-ink font-mono text-xs text-[#e3c88f]">{suspect.initials}</div><div><h3 className="text-sm font-medium text-paper">{suspect.name}</h3><p className="mt-1 text-xs text-muted">{suspect.role}</p></div></div><p className="mt-4 line-clamp-2 text-xs leading-5 text-muted">{suspect.alibi}</p></Card>; }
