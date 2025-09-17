import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnglishExam from "./pages/exam/EnglishExam";
import MathExam from "./pages/exam/MathExam";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentResults from "./pages/StudentResults";
import StudentQuestionDetail from "./pages/StudentQuestionDetail";
import ManualGrading from "./pages/ManualGrading";
import AIGradingResult from "./pages/AIGradingResult";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student/exam/english/:examId" element={<EnglishExam />} />
            <Route path="/student/exam/math/:examId" element={<MathExam />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/grading/:gradeId" element={<ManualGrading />} />
            <Route path="/teacher/ai-result/:gradeId" element={<AIGradingResult />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/results/:examId" element={<StudentResults />} />
          <Route path="/student/results/:examId/section/:sectionName" element={<StudentQuestionDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
