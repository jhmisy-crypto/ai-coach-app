import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LessonSelectPage from "../pages/LessonSelectPage";
import ProblemInputPage from "../pages/ProblemInputPage";
import CoachChatPage from "../pages/CoachChatPage";
import SummaryPage from "../pages/SummaryPage";
import ActionPlanPage from "../pages/ActionPlanPage";
import ReflectionPage from "../pages/ReflectionPage";
import ArchivePage from "../pages/ArchivePage";
import RecordDetailPage from "../pages/RecordDetailPage";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lessons" element={<LessonSelectPage />} />
      <Route path="/problem/:lessonId" element={<ProblemInputPage />} />
      <Route path="/coach/:lessonId" element={<CoachChatPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/summary" element={<SummaryPage />} />
      <Route path="/action" element={<ActionPlanPage />} />
      <Route path="/reflection" element={<ReflectionPage />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/records/:recordId" element={<RecordDetailPage />} />
    </Routes>
  );
}