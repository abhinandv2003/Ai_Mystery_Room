import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CheckCircle2, CircleX, RotateCcw, ShieldCheck } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Badge, Button, Card } from '../components/common/UI.jsx';
import { sampleCase } from '../mocks/sampleCase.js';
import { demoCaseService } from '../services/demoCaseService.js';

export function VerdictPage() {
  const navigate = useNavigate();
  const verdict = demoCaseService.getVerdict();
  if (!verdict) return <Navigate to={`/cases/${sampleCase.id}`} replace />;
  const accused = sampleCase.suspects.find(({ id }) => id === verdict.suspectId);
  const culprit = sampleCase.suspects.find(({ id }) => id === verdict.correctSuspectId);
  const keyEvidence = sampleCase.evidence.filter(({ id }) => verdict.keyEvidenceIds.includes(id));

  function restartDemo() {
    demoCaseService.reset();
    navigate(`/cases/${sampleCase.id}/investigate`);
  }

  return <AppShell><main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
    <Link to={`/cases/${sampleCase.id}`} className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-signal"><ArrowLeft size={13} /> Case briefing</Link>
    <div className={`border p-5 sm:p-8 ${verdict.isCorrect ? 'border-[#37664a] bg-[#4eaa78]/[0.06]' : 'border-[#754442] bg-[#c84b45]/[0.05]'}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className={`flex h-14 w-14 shrink-0 items-center justify-center border ${verdict.isCorrect ? 'border-[#37664a] text-[#8bd0a6]' : 'border-[#754442] text-[#f0978f]'}`}>{verdict.isCorrect ? <CheckCircle2 size={28} /> : <CircleX size={28} />}</div><div><Badge tone={verdict.isCorrect ? 'success' : 'alert'}>{verdict.isCorrect ? 'Correct deduction' : 'Incorrect accusation'}</Badge><h1 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-paper sm:text-5xl">The case is resolved.</h1><p className="mt-2 text-sm leading-6 text-muted">{verdict.isCorrect ? 'Your theory matched the evidence.' : 'The evidence points elsewhere. The complete sample solution is below.'}</p></div></div>
      <div className="mt-7 grid gap-3 border-t border-line pt-6 sm:grid-cols-2"><div><p className="font-mono text-[9px] uppercase tracking-widest text-muted">Your accusation</p><p className="mt-2 text-sm text-paper">{accused?.name ?? 'Unknown suspect'}</p></div><div><p className="font-mono text-[9px] uppercase tracking-widest text-muted">Responsible party</p><p className="mt-2 text-sm text-paper">{culprit?.name ?? 'Unknown suspect'} <span className="text-muted">· {culprit?.role}</span></p></div></div>
    </div>
    <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="p-5 sm:p-7"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#e3c88f]"><ShieldCheck size={14} /> Solution and reconstruction</div><p className="mt-4 text-sm leading-7 text-paper/90">{verdict.explanation}</p>{verdict.reasoning && <div className="mt-5 border-l border-line pl-4"><p className="font-mono text-[9px] uppercase tracking-widest text-muted">Your reasoning</p><p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-paper/80">{verdict.reasoning}</p></div>}<div className="mt-6 border-t border-line pt-5"><h2 className="text-sm font-medium text-paper">Why the other clues misled</h2><ul className="mt-3 space-y-3 text-xs leading-5 text-muted"><li><span className="text-paper">Mara’s lab report:</span> it verifies an early reading but leaves a gap during the outage. Her chalk is normal conservation material; the prepared frame-check note is undated.</li><li><span className="text-paper">Nia’s projection role:</span> she could pause a show, but the control log attributes the scheduled test to the curator’s token, not her booth credential.</li><li><span className="text-paper">Owen’s patrol sheet:</span> it conflicts with the gallery sensor, but his recorded exit occurs after the curator’s entry and does not explain the projection command or brass dust.</li></ul></div></Card>
      <div className="space-y-5"><Card className="p-5 sm:p-6"><h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Key evidence</h2><div className="mt-4 space-y-3">{keyEvidence.map((item) => <div key={item.id} className="border border-line p-3"><div className="flex items-center justify-between gap-2"><h3 className="text-xs font-medium text-paper">{item.title}</h3><Badge tone="evidence">{item.time}</Badge></div><p className="mt-2 text-[11px] leading-5 text-muted">{item.summary}</p><Link to={`/cases/${sampleCase.id}/investigate?tab=evidence`} className="mt-2 inline-flex items-center gap-1 text-[10px] text-signal hover:text-paper">Review archive <ArrowUpRight size={11} /></Link></div>)}</div></Card><Card className="p-5 sm:p-6"><h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Case record</h2><p className="mt-3 text-sm font-medium text-paper">{sampleCase.title}</p><p className="mt-1 text-xs text-muted">{sampleCase.reference} · Fictional sample</p><Button type="button" onClick={restartDemo} icon={RotateCcw} className="mt-5 w-full border border-line bg-transparent text-paper hover:bg-white/[0.04] hover:text-paper">Restart sample investigation</Button></Card></div>
    </section>
  </main></AppShell>;
}
