import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Badge, Button } from '../common/UI.jsx';

export function CaseHeader({ caseFile, actionLabel = 'Open investigation', actionTo = `/cases/${caseFile.id}/investigate`, eyebrow = 'Sample case · fixed demo file' }) {
  return <div className="border-b border-line pb-7">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-signal"><ArrowLeft size={13} /> Case desk</Link>
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2"><Badge tone="evidence">{eyebrow}</Badge><Badge>{caseFile.reference}</Badge></div>
        <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.06em] text-paper sm:text-6xl">{caseFile.title}</h1>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted"><span>{caseFile.category}</span><span aria-hidden="true">/</span><span>{caseFile.location}</span><span aria-hidden="true">/</span><span>{caseFile.difficulty}</span></p>
      </div>
      {actionLabel && <Button as={Link} to={actionTo} icon={ArrowUpRight} className="w-fit">{actionLabel}</Button>}
    </div>
  </div>;
}
