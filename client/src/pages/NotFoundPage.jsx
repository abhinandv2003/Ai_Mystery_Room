import { Link } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Button, Eyebrow } from '../components/common/UI.jsx';

export function NotFoundPage() {
  return <AppShell><main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-20 sm:px-10">
    <Eyebrow>File not found · 404</Eyebrow><h1 className="mt-5 text-6xl font-medium tracking-[-0.06em] text-paper">Dead end.</h1>
    <p className="mt-4 text-muted">This file does not exist in the case room.</p><Button as={Link} to="/" className="mt-8 w-fit">Return to the desk</Button>
  </main></AppShell>;
}
