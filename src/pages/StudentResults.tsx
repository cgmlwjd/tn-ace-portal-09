import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, Calendar, Trophy, Target, Download, Eye } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Mock exam data - matches the structure from StudentDashboard
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
    status: 'completed',
    type: 'english',
    score: 85,
    results: {
      reading: { score: 80, maxScore: 50, timeSpent: '25분', correctAnswers: 16, totalQuestions: 20 },
      writing: { score: 90, maxScore: 50, timeSpent: '35분', wordCount: 387, targetWords: '300-400' }
    }
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
    score: 85,
    results: {
      speaking: { score: 85, maxScore: 100, timeSpent: '28분', questionsAnswered: 5, totalQuestions: 5 }
    }
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
    categories: ["math"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-08",
    duration: 120,
    questions: 15,
    status: 'completed',
    type: 'math',
    score: 92,
    results: {
      math: { score: 92, maxScore: 100, timeSpent: '110분', correctAnswers: 14, totalQuestions: 15 }
    }
  },
  {
    id: 5,
    title: "기하 단원 평가",
    categories: ["math"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-05",
    duration: 80,
    questions: 12,
    status: 'available',
    type: 'math'
  }
];

export default function StudentResults() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  // Find the specific exam
  const exam = mockExams.find(e => e.id.toString() === examId);

  // Access control - redirect if exam not found or not completed
  useEffect(() => {
    if (!exam) {
      alert('시험을 찾을 수 없습니다.');
      navigate('/student');
      return;
    }
    
    if (exam.status !== 'completed') {
      if (exam.status === 'grading') {
        alert('아직 채점이 진행 중입니다. 잠시 후 다시 확인해 주세요.');
      } else {
        alert('아직 결과를 볼 수 없습니다. 시험을 먼저 응시해 주세요.');
      }
      navigate('/student');
      return;
    }
  }, [exam, navigate]);

  if (!exam || exam.status !== 'completed') {
    return null; // Will redirect in useEffect
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reading': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'writing': return 'bg-green-50 text-green-700 border-green-200';
      case 'essay': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'speaking': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'math': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      reading: 'Reading (영어)',
      writing: 'Writing (영어)',
      essay: 'Essay (영어)',
      speaking: 'Speaking (영어)',
      math: 'Math (수학)'
    };
    return labels[category] || category;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/student">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  대시보드
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-brand-bronze" />
                  <span>시험 결과</span>
                </h1>
                <p className="text-muted-foreground">{exam.title} - 결과 상세보기</p>
              </div>
            </div>
            
            <Button variant="outline" className="hidden sm:flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>결과 다운로드</span>
            </Button>
          </div>

          {/* Exam Overview Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {exam.categories?.map((category: string) => (
                      <Badge key={category} variant="outline" className={getCategoryColor(category)}>
                        {getCategoryLabel(category)}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-2xl">{exam.title}</CardTitle>
                  <p className="text-muted-foreground">
                    {exam.created} 응시 | {exam.duration}분 | {exam.questions}문제
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(exam.score || 0)}`}>
                    {exam.score}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    / 100점
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>총 점수</span>
                  <span>{Math.round((exam.score || 0))}%</span>
                </div>
                <Progress 
                  value={exam.score || 0} 
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section Results */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">섹션별 상세 결과</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exam.categories?.map((category: string) => {
                const sectionResult = exam.results?.[category];
                if (!sectionResult) return null;

                return (
                  <Card key={category} className="shadow-bronze hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="outline" className={getCategoryColor(category)}>
                            {getCategoryLabel(category)}
                          </Badge>
                          <CardTitle className="text-lg mt-2">
                            {getCategoryLabel(category)} 결과
                          </CardTitle>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(sectionResult.score)}`}>
                            {sectionResult.score}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            / {sectionResult.maxScore}점
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>점수</span>
                          <span>{Math.round((sectionResult.score / sectionResult.maxScore) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(sectionResult.score / sectionResult.maxScore) * 100} 
                          className="h-2"
                        />
                      </div>

                      {/* Details based on category */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {category === 'reading' || category === 'writing' || category === 'math' ? (
                          <>
                            <div>
                              <span className="text-muted-foreground">정답률:</span>
                              <span className="ml-1 font-medium">
                                {sectionResult.correctAnswers}/{sectionResult.totalQuestions}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">소요시간:</span>
                              <span className="ml-1 font-medium">{sectionResult.timeSpent}</span>
                            </div>
                          </>
                        ) : category === 'essay' ? (
                          <>
                            <div>
                              <span className="text-muted-foreground">단어수:</span>
                              <span className="ml-1 font-medium">{sectionResult.wordCount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">목표:</span>
                              <span className="ml-1 font-medium">{sectionResult.targetWords}</span>
                            </div>
                          </>
                        ) : category === 'speaking' ? (
                          <>
                            <div>
                              <span className="text-muted-foreground">응답:</span>
                              <span className="ml-1 font-medium">
                                {sectionResult.questionsAnswered}/{sectionResult.totalQuestions}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">소요시간:</span>
                              <span className="ml-1 font-medium">{sectionResult.timeSpent}</span>
                            </div>
                          </>
                        ) : null}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          상세보기
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          다운로드
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}