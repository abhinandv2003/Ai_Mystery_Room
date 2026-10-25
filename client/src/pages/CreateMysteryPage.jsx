import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Info, LockKeyhole } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Badge, Button, Card, Eyebrow, Field, SelectInput, Textarea } from '../components/common/UI.jsx';
import { sampleCase } from '../mocks/sampleCase.js';

const genres = ['Detective mystery', 'Locked-room mystery', 'Missing-person mystery', 'Theft or heist', 'Suspicious death', 'Corporate mystery'];

export function CreateMysteryPage() {
  const [scenario, setScenario] = useState('');
  const [genre, setGenre] = useState(genres[0]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [setting, setSetting] = useState('Modern-day setting');
  const [suspectCount, setSuspectCount] = useState('4');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setPreviewReady(false);
    if (scenario.trim().length < 30) {
      setError('Add at least 30 characters so there is enough detail to shape a mystery.');
      return;
    }
    setError('');
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      setPreviewReady(true);
    }, 450);
  }

  return <AppShell><main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-signal"><ArrowLeft size={13} /> Back to desk</Link>
    <Eyebrow>New investigation <span className="mx-3 text-line">/</span> Scenario intake</Eyebrow>
    <h1 className="mt-5 max-w-3xl text-5xl font-medium tracking-[-0.06em] text-paper sm:text-7xl">Start with a <span className="font-serif italic text-signal">what if.</span></h1>
    <p className="mt-5 max-w-2xl leading-7 text-muted">Describe a fictional incident. Choose the shape of the case you want to explore.</p>
    <Card className="mt-7 border-[#5f5136] bg-[#d4a95f]/[0.05] p-4 sm:p-5"><div className="flex gap-3"><Info size={16} className="mt-0.5 shrink-0 text-[#e3c88f]" /><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-medium text-paper">Generation preview</h2><Badge tone="evidence">Demo mode</Badge></div><p className="mt-1 text-xs leading-5 text-muted">AI generation is the next build phase. For now, this form checks your scenario and opens a fixed sample case. Your text is not sent to a service or used to alter the sample.</p></div></div></Card>
    <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-6">
      <Field label="Your scenario" htmlFor="scenario" error={error} hint="Use a fictional premise. Keep it between 30 and 2,000 characters.">
        <Textarea id="scenario" name="scenario" value={scenario} onChange={(event) => { setScenario(event.target.value); setError(''); setPreviewReady(false); }} minLength={30} maxLength={2000} rows={7} placeholder="A lighthouse keeper disappears the night the foghorn stops. By morning, the locked keeper’s room is dry, but one page of the logbook is soaked…" aria-describedby="scenario-count" aria-invalid={Boolean(error)} />
        <div id="scenario-count" className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-widest text-muted"><span>{scenario.trim().length < 30 ? `${30 - scenario.trim().length} more characters needed` : 'Scenario length looks good'}</span><span>{scenario.length} / 2,000</span></div>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Mystery type" htmlFor="genre"><SelectInput id="genre" value={genre} onChange={(event) => setGenre(event.target.value)}>{genres.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
        <Field label="Difficulty" htmlFor="difficulty"><SelectInput id="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></SelectInput></Field>
        <Field label="Setting" htmlFor="setting"><SelectInput id="setting" value={setting} onChange={(event) => setSetting(event.target.value)}><option>Modern-day setting</option><option>Historical setting</option><option>Coastal town</option><option>Remote wilderness</option><option>Space station</option><option>Surprise me</option></SelectInput></Field>
        <Field label="Number of suspects" htmlFor="suspects"><SelectInput id="suspects" value={suspectCount} onChange={(event) => setSuspectCount(event.target.value)}>{[3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} suspects</option>)}</SelectInput></Field>
      </div>
      <div className="flex flex-col justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center"><span className="flex items-center gap-2 text-xs text-muted"><LockKeyhole size={13} /> Fictional content only</span><Button type="submit" disabled={checking} className="min-w-52">{checking ? 'Checking scenario…' : 'Preview sample workflow'}</Button></div>
    </form>
    {checking && <p className="mt-4 text-xs text-muted" role="status">Checking the scenario details…</p>}
    {previewReady && <div className="mt-6" role="status"><Card className="border-[#37664a] bg-[#4eaa78]/[0.06] p-5"><Badge tone="success">Ready for the demo</Badge><h2 className="mt-3 text-lg font-medium text-paper">Your scenario passed the length check</h2><p className="mt-2 text-sm leading-6 text-muted">The next screen is the fixed sample case, “{sampleCase.title}”. The selected options and your scenario do not change that case.</p><Button as={Link} to={`/cases/${sampleCase.id}`} icon={ArrowUpRight} className="mt-5">Open sample case</Button></Card></div>}
    <p className="mt-7 border-t border-line pt-5 text-xs leading-5 text-muted">The sample investigation is fictional interface content. Real case creation will be connected after the generation and validation service is implemented.</p>
  </main></AppShell>;
}
