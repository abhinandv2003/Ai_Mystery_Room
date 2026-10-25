import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Archive, ArrowLeft, ArrowUpRight, BookOpen, Check, ChevronRight, CircleHelp, Clock3, FileText, Fingerprint, Gavel, MessageSquareText, Plus, Search, ShieldCheck, Trash2, Users } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Badge, Button, Card, EmptyState, ErrorState, Field, Modal, Textarea } from '../components/common/UI.jsx';
import { demoCaseService } from '../services/demoCaseService.js';
import { evidenceCategories, sampleCase } from '../mocks/sampleCase.js';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'suspects', label: 'Suspects', icon: Users },
  { id: 'evidence', label: 'Evidence', icon: Archive },
  { id: 'timeline', label: 'Timeline', icon: Clock3 },
  { id: 'board', label: 'Board', icon: Fingerprint },
  { id: 'accuse', label: 'Accuse', icon: Gavel },
];

export function InvestigationPage() {
  const caseFile = sampleCase;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabs.some(({ id }) => id === requestedTab) ? requestedTab : 'evidence');
  const [session, setSession] = useState(() => demoCaseService.getSession());
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [category, setCategory] = useState('All evidence');
  const [filterText, setFilterText] = useState('');
  const [accuseId, setAccuseId] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (tabs.some(({ id }) => id === requestedTab)) setActiveTab(requestedTab);
  }, [requestedTab]);

  const filteredEvidence = useMemo(() => caseFile.evidence.filter((item) => {
    const categoryMatch = category === 'All evidence' || item.category === category;
    const query = filterText.trim().toLowerCase();
    return categoryMatch && (!query || `${item.title} ${item.type} ${item.summary}`.toLowerCase().includes(query));
  }), [caseFile.evidence, category, filterText]);

  if (demoCaseService.getVerdict()) return <Navigate to={`/cases/${caseFile.id}/verdict`} replace />;

  function changeTab(id) {
    setActiveTab(id);
    setSearchParams(id === 'evidence' ? {} : { tab: id });
  }

  function toggleEvidence(id) {
    const selectedEvidenceIds = session.selectedEvidence.includes(id)
      ? session.selectedEvidence.filter((item) => item !== id)
      : [...session.selectedEvidence, id];
    setSession(demoCaseService.saveSession({ selectedEvidence: selectedEvidenceIds }));
  }

  function updateNotes(value) {
    setSession(demoCaseService.saveSession({ notes: value }));
  }

  async function submitAccusation() {
    if (!accuseId) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await demoCaseService.submitAccusation(accuseId, reasoning.trim());
      setConfirmOpen(false);
      navigate(`/cases/${caseFile.id}/verdict`);
    } catch (error) {
      setSubmitError(error.message || 'Could not submit the demo accusation.');
    } finally {
      setSubmitting(false);
    }
  }

  return <AppShell><main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-10 lg:px-10">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Link to={`/cases/${caseFile.id}`} className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted hover:text-signal"><ArrowLeft size={13} /> Case briefing</Link><div className="flex items-center gap-2"><Badge tone="evidence">Demo investigation</Badge><span className="font-mono text-[9px] text-muted">{caseFile.reference}</span></div></div>
    <div className="mb-7 flex flex-col gap-2 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Investigation workspace</p><h1 className="mt-2 text-3xl font-medium tracking-[-0.05em] text-paper sm:text-4xl">{caseFile.title}</h1></div><p className="max-w-md text-xs leading-5 text-muted">Compare the records, claims, and timeline. Your board and notes save in this browser.</p></div>
    <nav aria-label="Investigation sections" className="mb-7 grid grid-cols-3 gap-1 border border-line bg-panel p-1 sm:grid-cols-6">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => changeTab(id)} aria-current={activeTab === id ? 'page' : undefined} className={`flex min-h-11 items-center justify-center gap-2 px-2 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${activeTab === id ? 'bg-[#d4fa61] text-ink' : 'text-muted hover:bg-white/[0.04] hover:text-paper'}`}><Icon size={14} /><span>{label}</span>{id === 'board' && session.selectedEvidence.length > 0 && <span className={`font-mono text-[9px] ${activeTab === id ? 'text-ink' : 'text-signal'}`}>{session.selectedEvidence.length}</span>}</button>)}</nav>
    <section aria-live="polite">{activeTab === 'overview' && <OverviewPanel caseFile={caseFile} onNavigate={changeTab} />}{activeTab === 'suspects' && <SuspectsPanel suspects={caseFile.suspects} />}{activeTab === 'evidence' && <EvidencePanel evidence={filteredEvidence} categories={evidenceCategories} category={category} onCategory={setCategory} query={filterText} onQuery={setFilterText} onOpen={setSelectedEvidence} savedIds={session.selectedEvidence} onToggle={toggleEvidence} />}{activeTab === 'timeline' && <TimelinePanel timeline={caseFile.timeline} />}{activeTab === 'board' && <BoardPanel caseFile={caseFile} session={session} onNotes={updateNotes} onRemove={toggleEvidence} onOpen={setSelectedEvidence} />}{activeTab === 'accuse' && <AccusationPanel suspects={caseFile.suspects} selected={accuseId} onSelect={setAccuseId} reasoning={reasoning} onReasoning={setReasoning} onConfirm={() => setConfirmOpen(true)} error={submitError} />}</section>
    <Modal open={Boolean(selectedEvidence)} onClose={() => setSelectedEvidence(null)} title={selectedEvidence?.title ?? 'Evidence'} footer={<Button type="button" onClick={() => setSelectedEvidence(null)} className="w-full sm:w-auto">Close evidence</Button>}>
      {selectedEvidence && <EvidenceViewer evidence={selectedEvidence} saved={session.selectedEvidence.includes(selectedEvidence.id)} onToggle={() => toggleEvidence(selectedEvidence.id)} />}
    </Modal>
    <Modal open={confirmOpen} onClose={() => !submitting && setConfirmOpen(false)} title="Confirm your accusation" footer={<><Button type="button" onClick={() => setConfirmOpen(false)} className="border border-line bg-transparent text-paper hover:bg-white/[0.04] hover:text-paper" disabled={submitting}>Keep investigating</Button><Button type="button" onClick={submitAccusation} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit final accusation'}</Button></>}>
      <div className="flex gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-[#e3c88f]" size={18} /><div><p className="text-sm leading-6 text-paper">You are accusing <strong>{caseFile.suspects.find((person) => person.id === accuseId)?.name}</strong>.</p><p className="mt-2 text-xs leading-5 text-muted">In this demo, the final reveal follows submission and cannot be undone. Your notes and saved evidence will remain available.</p>{submitError && <div className="mt-4"><ErrorState title="Accusation not submitted">{submitError}</ErrorState></div>}</div></div>
    </Modal>
  </main></AppShell>;
}

function OverviewPanel({ caseFile, onNavigate }) {
  return <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]"><Card className="p-5 sm:p-7"><h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#e3c88f]">Incident briefing</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-paper">{caseFile.summary}</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[[Users, `${caseFile.suspects.length} suspects`], [Archive, `${caseFile.evidence.length} evidence items`], [Clock3, `${caseFile.timeline.length} timeline events`]].map(([Icon, label]) => <div key={label} className="flex items-center gap-3 border border-line px-3 py-3"><Icon size={15} className="text-[#e3c88f]" /><span className="text-xs text-paper">{label}</span></div>)}</div></Card><Card className="p-5 sm:p-7"><h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Choose a file</h2><div className="mt-4 space-y-2">{[['suspects', 'Review suspect statements', Users], ['evidence', 'Browse evidence archive', Archive], ['timeline', 'Reconstruct the timeline', Clock3], ['board', 'Open your theory board', Fingerprint], ['accuse', 'Make an accusation', Gavel]].map(([id, label, Icon]) => <button key={id} type="button" onClick={() => onNavigate(id)} className="flex w-full items-center justify-between border border-line px-3 py-3 text-left text-xs text-paper hover:border-[#495347] hover:bg-white/[0.02]"><span className="flex items-center gap-3"><Icon size={14} className="text-muted" />{label}</span><ChevronRight size={14} className="text-muted" /></button>)}</div></Card></div>;
}

function SuspectsPanel({ suspects }) {
  return <div><PanelHeading title="Persons of interest" detail="Each profile contains reported claims and case context." /><div className="mt-4 grid gap-3 md:grid-cols-2">{suspects.map((person) => <Card key={person.id} className="p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center border border-line bg-ink font-mono text-sm text-[#e3c88f]">{person.initials}</div><div><h2 className="text-base font-medium text-paper">{person.name}</h2><p className="mt-1 text-xs text-muted">{person.role} · {person.age}</p></div></div><Badge>Person of interest</Badge></div><div className="mt-5 space-y-4 border-t border-line pt-4"><div><p className="font-mono text-[9px] uppercase tracking-widest text-muted">Possible motive</p><p className="mt-1.5 text-sm leading-6 text-paper/90">{person.motive}</p></div><div><p className="font-mono text-[9px] uppercase tracking-widest text-muted">Reported alibi</p><p className="mt-1.5 text-sm leading-6 text-paper/90">{person.alibi}</p></div><p className="border-l border-[#d4a95f] pl-3 text-xs leading-5 text-muted">{person.detail}</p></div></Card>)}</div><p className="mt-4 flex items-center gap-2 text-[10px] text-muted"><CircleHelp size={13} /> Motives and alibis are claims to investigate; they are not proof.</p></div>;
}

function EvidencePanel({ evidence, categories, category, onCategory, query, onQuery, onOpen, savedIds, onToggle }) {
  return <div><PanelHeading title="Evidence archive" detail="Records, messages, and observations from the fictional case." /><div className="mt-4 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><span className="sr-only">Search evidence</span><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search evidence…" className="h-10 w-full border border-line bg-panel pl-9 pr-3 text-xs text-paper outline-none focus:border-signal" /></label><label className="sm:w-56"><span className="sr-only">Filter evidence category</span><select value={category} onChange={(event) => onCategory(event.target.value)} className="h-10 w-full border border-line bg-panel px-3 text-xs text-paper outline-none focus:border-signal">{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>{evidence.length ? <div className="mt-4 grid gap-3 lg:grid-cols-2">{evidence.map((item) => <EvidenceCard key={item.id} evidence={item} saved={savedIds.includes(item.id)} onOpen={() => onOpen(item)} onToggle={() => onToggle(item.id)} />)}</div> : <div className="mt-4"><EmptyState icon={Search} title="No evidence matches">Try another search or choose a different category.</EmptyState></div>}</div>;
}

function EvidenceCard({ evidence, saved, onOpen, onToggle }) {
  const icon = evidence.category === 'Messages' ? MessageSquareText : evidence.category === 'Records' ? FileText : ShieldCheck;
  const Icon = icon;
  return <Card className="p-4 sm:p-5"><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-ink text-[#e3c88f]"><Icon size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge tone="evidence">{evidence.category}</Badge><span className="font-mono text-[9px] text-muted">{evidence.time}</span></div><h3 className="mt-2 text-sm font-medium text-paper">{evidence.title}</h3><p className="mt-1 text-[10px] text-muted">{evidence.type} · {evidence.source}</p><p className="mt-3 text-xs leading-5 text-muted">{evidence.summary}</p><div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3"><span className="text-[9px] text-muted">{evidence.credibility}</span><div className="flex gap-2"><button type="button" onClick={onToggle} className="inline-flex items-center gap-1.5 border border-line px-2.5 py-2 text-[10px] text-muted hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal">{saved ? <><Check size={12} /> On board</> : <><Plus size={12} /> Add</>}</button><button type="button" onClick={onOpen} className="inline-flex items-center gap-1.5 px-2 py-2 text-[10px] text-signal hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal">Inspect <ArrowUpRight size={12} /></button></div></div></div></div></Card>;
}

function EvidenceViewer({ evidence, saved, onToggle }) {
  return <div><div className="flex flex-wrap items-center gap-2"><Badge tone="evidence">{evidence.type}</Badge><Badge>{evidence.credibility}</Badge><span className="font-mono text-[9px] text-muted">{evidence.time}</span></div><p className="mt-3 text-xs text-muted">Source: {evidence.source}</p><div className="mt-5 border border-line bg-ink p-4 sm:p-5"><p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-muted">Fictional case artifact</p><pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-paper">{evidence.content}</pre></div><div className="mt-4"><p className="font-mono text-[9px] uppercase tracking-widest text-muted">Related persons</p><div className="mt-2 flex flex-wrap gap-2">{evidence.related.map((id) => { const person = sampleCase.suspects.find(({ id: suspectId }) => suspectId === id); return <Badge key={id}>{person?.name ?? 'Unknown'}</Badge>; })}</div></div><Button type="button" onClick={onToggle} className="mt-5 border border-line bg-transparent text-paper hover:bg-white/[0.04] hover:text-paper">{saved ? <><Check size={14} /> Saved to board</> : <><Plus size={14} /> Add to board</>}</Button><p className="mt-4 text-[10px] leading-5 text-muted">This artifact is fictional game content. A person’s statement is a claim; system logs and inspection records are presented as verified observations within the case.</p></div>;
}

function TimelinePanel({ timeline }) {
  return <div><PanelHeading title="Event timeline" detail="A chronological view assembled from case records and statements." /><ol className="mt-6 space-y-0">{timeline.map((event, index) => <li key={`${event.time}-${event.label}`} className="relative grid grid-cols-[82px_18px_1fr] gap-3 pb-7 sm:grid-cols-[100px_22px_1fr] sm:gap-4"><time className="pt-0.5 font-mono text-[10px] text-[#e3c88f]">{event.time}</time><div className="relative flex justify-center"><span className={`relative z-10 mt-1 h-2.5 w-2.5 rounded-full border ${event.verified ? 'border-signal bg-signal' : 'border-[#d4a95f] bg-ink'}`} />{index < timeline.length - 1 && <span className="absolute top-3 h-full w-px bg-line" />}</div><Card className="p-4"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-medium text-paper">{event.label}</h3><Badge tone={event.verified ? 'success' : 'evidence'}>{event.verified ? 'Verified record' : 'Reported claim'}</Badge></div><p className="mt-2 text-xs leading-5 text-muted">{event.detail}</p><p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-muted">Source: {event.source}</p></Card></li>)}</ol></div>;
}

function BoardPanel({ caseFile, session, onNotes, onRemove, onOpen }) {
  const saved = caseFile.evidence.filter((item) => session.selectedEvidence.includes(item.id));
  return <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><Card className="p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-medium text-paper">Pinned evidence</h2><p className="mt-1 text-xs text-muted">Keep the records you want to compare.</p></div><Badge>{saved.length} saved</Badge></div><div className="mt-5 space-y-2">{saved.length ? saved.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border border-line p-3"><button type="button" onClick={() => onOpen(item)} className="min-w-0 flex-1 text-left"><span className="block truncate text-xs font-medium text-paper">{item.title}</span><span className="mt-1 block text-[10px] text-muted">{item.type} · {item.time}</span></button><button type="button" onClick={() => onRemove(item.id)} className="p-2 text-muted hover:text-[#f0978f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal" aria-label={`Remove ${item.title} from board`}><Trash2 size={14} /></button></div>) : <EmptyState icon={Archive} title="Your board is empty">Add an item from the evidence archive when you find something worth connecting.</EmptyState>}</div></Card><Card className="p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-medium text-paper">Investigator notes</h2><p className="mt-1 text-xs text-muted">Your notes are saved in this browser as you type.</p></div><Badge tone="success">Auto-saved</Badge></div><Field label="Working theory" htmlFor="investigation-notes" className="mt-5"><Textarea id="investigation-notes" value={session.notes} onChange={(event) => onNotes(event.target.value)} maxLength={4000} rows={12} placeholder="What does the timeline establish? Which alibi needs another look?" className="min-h-56" /></Field><p className="mt-2 text-right font-mono text-[9px] text-muted">{session.notes.length} / 4,000</p><p className="mt-4 border-t border-line pt-4 text-[10px] leading-5 text-muted">Notes and saved clues do not reveal the solution. Clearing browser storage removes this demo session.</p></Card></div>;
}

function AccusationPanel({ suspects, selected, onSelect, reasoning, onReasoning, onConfirm, error }) {
  return <div className="mx-auto max-w-4xl"><PanelHeading title="Make your accusation" detail="Review your theory, choose one suspect, and confirm to see the demo verdict." /><div className="mt-5 grid gap-3 sm:grid-cols-2">{suspects.map((person) => <button key={person.id} type="button" onClick={() => onSelect(person.id)} aria-pressed={selected === person.id} className={`flex items-center gap-3 border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${selected === person.id ? 'border-signal bg-[#d4fa61]/[0.06]' : 'border-line bg-panel hover:border-[#495347]'}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-ink font-mono text-xs text-[#e3c88f]">{person.initials}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-paper">{person.name}</span><span className="mt-1 block text-xs text-muted">{person.role}</span></span><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected === person.id ? 'border-signal bg-signal text-ink' : 'border-line'}`}>{selected === person.id && <Check size={12} />}</span></button>)}</div><Field label="Why this person? (optional)" htmlFor="accusation-reason" hint="Your explanation will be included in this demo session." className="mt-6"><Textarea id="accusation-reason" value={reasoning} onChange={(event) => onReasoning(event.target.value)} maxLength={2000} rows={4} placeholder="Which evidence connects this suspect to the incident?" /></Field>{error && <div className="mt-4"><ErrorState title="Could not submit accusation">{error}</ErrorState></div>}<div className="mt-6 flex flex-col justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-xs text-muted"><AlertTriangle size={14} className="text-[#e3c88f]" />Your final accusation reveals the sample solution.</p><Button type="button" onClick={onConfirm} disabled={!selected} icon={Gavel}>Review accusation</Button></div></div>;
}

function PanelHeading({ title, detail }) { return <div><h2 className="text-lg font-medium tracking-tight text-paper">{title}</h2><p className="mt-1 text-xs leading-5 text-muted">{detail}</p></div>; }
