import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Fingerprint, Search, Sparkles } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Badge, Button, Card, Eyebrow } from '../components/common/UI.jsx';
import { sampleCase } from '../mocks/sampleCase.js';

export function HomePage() {
  return <AppShell>
    <main className="relative mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-7xl flex-col px-6 pb-8 pt-12 sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
      <div className="pointer-events-none absolute right-[11%] top-24 hidden h-72 w-72 rounded-full border border-line/60 md:block"><div className="absolute inset-7 rounded-full border border-dashed border-line" /><div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_28px_4px_rgba(212,250,97,0.25)]" /><Fingerprint className="absolute inset-0 m-auto h-24 w-24 text-[#465047]" strokeWidth={0.7} /></div>
      <Eyebrow><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-signal" /> An interactive detective game</Eyebrow>
      <h1 className="mt-7 max-w-4xl text-[clamp(3.4rem,9vw,7.6rem)] font-medium leading-[0.94] tracking-[-0.075em] text-paper">Every clue<br />leaves a <span className="font-serif italic text-signal">trace.</span></h1>
      <p className="mt-8 max-w-lg text-base leading-7 text-muted sm:text-lg">Turn a story into a fictional investigation. Follow the evidence, test each alibi, and find the detail that changes everything.</p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button as={Link} to="/create" icon={ArrowUpRight}>Create your mystery</Button>
        <Button as={Link} to={`/cases/${sampleCase.id}`} icon={Search} className="border border-line bg-transparent text-paper hover:border-signal hover:bg-transparent hover:text-signal">Explore the sample case</Button>
      </div>
      <div className="mt-7 flex items-start gap-3 border-l-2 border-[#d4a95f] pl-4 text-xs leading-5 text-muted"><Sparkles size={14} className="mt-0.5 shrink-0 text-[#e3c88f]" /><p><span className="text-paper">Sample file available.</span> Mystery generation is being built; the sample is a fixed, fictional case for exploring the interface.</p></div>
      <div className="mt-12 grid gap-3 border-t border-line pt-7 sm:grid-cols-3 sm:gap-5 sm:pt-9">
        <Feature icon={<Search />} number="01" title="Look closer" text="Read the briefing and inspect each clue at your own pace." />
        <Feature icon={<Fingerprint />} number="02" title="Connect the clues" text="Compare verified records with each suspect’s account." />
        <Feature icon={<ArrowDownRight />} number="03" title="Make your call" text="Build a theory, accuse a suspect, then review the case." />
      </div>
      <Card className="mt-7 grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div><div className="flex flex-wrap items-center gap-2"><Badge tone="evidence">Ready to investigate</Badge><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{sampleCase.reference}</span></div><h2 className="mt-3 text-xl font-medium tracking-tight text-paper">{sampleCase.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">A projection fails at a city museum. When the lights return, a one-of-a-kind miniature is gone.</p></div>
        <Link to={`/cases/${sampleCase.id}`} className="font-mono text-[10px] uppercase tracking-widest text-signal hover:text-paper">Open case <span aria-hidden="true">↗</span></Link>
      </Card>
      <footer className="mt-8 flex items-center justify-between border-t border-line/70 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#647069]"><span>AI Mystery Room</span><span>Every case is fictional</span><span>Case desk · 001</span></footer>
    </main>
  </AppShell>;
}

function Feature({ icon, number, title, text }) {
  return <article className="group border border-line/80 bg-panel/50 p-5 transition-colors hover:border-[#495347] sm:p-6"><div className="flex items-center justify-between text-signal"><span className="font-mono text-[10px]">{number}</span><span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span></div><h2 className="mt-5 text-lg font-medium tracking-tight text-paper">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{text}</p></article>;
}
