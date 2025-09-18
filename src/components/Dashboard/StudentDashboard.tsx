import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calculator, Clock, CheckCircle, Clock2, AlertTriangle } from 'lucide-react';

// Mock exam data based on teacher's exam structure
const mockExams = [
  {
    id: 1,
    title: "영어 중간고사 - 2학년",
    categories: ["reading", "writing"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-15",
    duration: 60,
    questions: 25,
    status: 'available',
    type: 'english'
  },
  {
    id: 2,
    title: "Speaking Test - Level 3",
    categories: ["speaking"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-12",
    duration: 30,
    questions: 8,
    status: 'completed',
    type: 'english',
    score: 85
  },
  {
    id: 3,
    title: "Essay Writing Assessment",
    categories: ["writing", "essay"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-10",
    duration: 90,
    questions: 3,
    status: 'grading',
    type: 'english'
  },
  {
    id: 4,
    title: "수학 중간고사",
    categories: ["mcq", "short", "essay"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-08",
    duration: 120,
    questions: 15,
    status: 'available',
    type: 'math'
  },
  {
    id: 5,
    title: "기하 단원 평가",
    categories: ["mcq", "short"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-05",
    duration: 80,
    questions: 12,
    status: 'completed',
    type: 'math',
    score: 92
  },
  {
    id: 6,
    title: "영어 종합 평가 - 4개 영역",
    categories: ["reading", "writing", "speaking", "essay"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-20",
    duration: 150,
    questions: 40,
    status: 'completed',
    type: 'english',
    score: 88
  },
  {
    id: 7,
    title: "Speaking 실력 평가 - 고급",
    categories: ["speaking"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-25",
    duration: 25,
    questions: 6,
    status: 'grading',
    type: 'english'
  },
  {
    id: 8,
    title: "Speaking 면접 시험",
    categories: ["speaking"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-28",
    duration: 20,
    questions: 5,
    status: 'available',
    type: 'english'
  }
];

const getStatusBadge = (status: string, score?: number) => {
  switch (status) {
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        완료 {score ? `(${score}점)` : ''}
      </Badge>;
    case 'grading':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock2 className="h-3 w-3 mr-1" />
        채점 중
      </Badge>;
    case 'available':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <AlertTriangle className="h-3 w-3 mr-1" />
        미응시
      </Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    reading: 'Reading (영어)',
    writing: 'Writing (영어)',
    essay: 'Essay (영어)',
    speaking: 'Speaking (영어)',
    mcq: '객관식 (수학)',
    short: '주관식 (수학)',
    math: 'Math (수학)'
  };
  return labels[category] || category;
};

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const englishExams = mockExams.filter(exam => exam.type === 'english');
  const mathExams = mockExams.filter(exam => exam.type === 'math');

  // Calculate statistics
  const totalExams = mockExams.length;
  const availableExams = mockExams.filter(exam => exam.status === 'available').length;
  const gradingExams = mockExams.filter(exam => exam.status === 'grading').length;
  const completedExams = mockExams.filter(exam => exam.status === 'completed').length;

  const handleStartExam = (exam: any) => {
    if (exam.status !== 'available') return;
    
    if (exam.type === 'english') {
      navigate(`/student/exam/english/${exam.id}`, { 
        state: { 
          examData: exam,
          totalTime: exam.duration * 60 // Convert to seconds
        } 
      });
    } else if (exam.type === 'math') {
      navigate(`/student/exam/math/${exam.id}`, { 
        state: { 
          examData: exam,
          totalTime: exam.duration * 60 // Convert to seconds
        } 
      });
    }
  };

  const handleViewResults = (exam: any) => {
    if (exam.status === 'completed') {
      navigate(`/student/results/${exam.id}`);
    } else if (exam.status === 'grading') {
      alert('아직 채점이 진행 중입니다. 잠시 후 다시 확인해 주세요.');
    } else {
      alert('아직 결과를 볼 수 없습니다. 시험을 먼저 응시해 주세요.');
    }
  };

  const ExamCard = ({ exam }: { exam: any }) => (
    <Card key={exam.id} className="hover:shadow-bronze transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {exam.type === 'english' ? (
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <BookOpen className="h-5 w-5" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <Calculator className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{exam.title}</CardTitle>
              <p className="text-sm text-muted-foreground">생성일: {exam.created}</p>
            </div>
          </div>
          {getStatusBadge(exam.status, exam.score)}
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {exam.categories?.map((category: string) => (
            <Badge key={category} variant="outline" className="text-xs">
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </div>

      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Exam Info */}
          <div className="text-sm">
            <div>
              <p className="text-muted-foreground">시험 시간</p>
              <p className="font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {exam.duration}분
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-border">
            {exam.status === 'available' ? (
              <Button 
                className="w-full bg-brand-bronze hover:bg-brand-bronze/90 text-primary-foreground shadow-bronze"
                onClick={() => handleStartExam(exam)}
              >
                시험 시작
              </Button>
            ) : exam.status === 'completed' ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleViewResults(exam)}
              >
                결과 보기
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleViewResults(exam)}
              >
                {exam.status === 'grading' ? '채점 중...' : '결과 보기'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">학생 대시보드</h1>
        <p className="text-muted-foreground">배정된 시험을 확인하고 응시하세요.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-bronze hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-blue-50">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 시험</p>
                <p className="text-2xl font-bold text-foreground">{totalExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-bronze hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">미응시</p>
                <p className="text-2xl font-bold text-red-600">{availableExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-bronze hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-yellow-50">
                <Clock2 className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">채점 중</p>
                <p className="text-2xl font-bold text-yellow-600">{gradingExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-bronze hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">완료</p>
                <p className="text-2xl font-bold text-green-600">{completedExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {/* English Exams Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">영어 시험</h2>
            <Badge variant="secondary">{englishExams.length}</Badge>
          </div>
          
          {englishExams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {englishExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">배정된 영어 시험이 없습니다.</p>
            </Card>
          )}
        </div>

        {/* Math Exams Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">수학 시험</h2>
            <Badge variant="secondary">{mathExams.length}</Badge>
          </div>
          
          {mathExams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mathExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">배정된 수학 시험이 없습니다.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};