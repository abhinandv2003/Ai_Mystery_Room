import { Link } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';

export function AppShell({ children }) {
  return <div className="min-h-screen bg-ink text-paper">
    <header className="relative z-10 border-b border-line">
      <nav aria-label="Main navigation" className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-paper">
          <span className="flex h-8 w-8 items-center justify-center border border-line text-signal"><Fingerprint size={17} strokeWidth={1.5} /></span>
          <span>AI MYSTERY ROOM<span className="ml-2 font-mono text-[9px] font-normal text-muted">/ CASE DESK</span></span>
        </Link>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:block">Fictional cases · Real deduction</span>
        <Link to="/create" className="border border-line px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-paper transition hover:border-signal hover:text-signal">New case <span aria-hidden="true">↗</span></Link>
      </nav>
    </header>
    {children}
  </div>;
}
