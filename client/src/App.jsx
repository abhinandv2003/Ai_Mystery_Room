import { Navigate, Route, Routes } from 'react-router-dom';
import { CreateMysteryPage } from './pages/CreateMysteryPage.jsx';
import { CasePage } from './pages/CasePage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { InvestigationPage } from './pages/InvestigationPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { VerdictPage } from './pages/VerdictPage.jsx';

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreateMysteryPage />} />
    <Route path="/cases/sample" element={<CasePage />} />
    <Route path="/cases/sample/investigate" element={<InvestigationPage />} />
    <Route path="/cases/sample/verdict" element={<VerdictPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
