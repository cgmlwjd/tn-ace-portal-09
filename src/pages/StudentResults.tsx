import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, Calendar, Trophy, Target, Download, Eye, MessageSquare } from 'lucide-react';
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
    teacherFeedback: "전반적으로 독해 실력이 향상되었습니다. 특히 문맥 파악 능력이 우수합니다. 쓰기에서는 문법적 정확성을 더 신경 쓰면 좋을 것 같습니다.",
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
    teacherFeedback: "발음과 유창성이 많이 향상되었습니다. 다양한 표현을 사용하려는 노력이 보입니다. 앞으로는 문법적 정확성에 조금 더 신경 쓰시기 바랍니다.",
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
    categories: ["mcq", "short", "math-essay"],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" }
    ],
    created: "2024-01-08",
    duration: 120,
    questions: 15,
    status: 'completed',
    type: 'math',
    score: 92,
    teacherFeedback: "수학적 사고력이 뛰어나며, 특히 서술형 문제에서 논리적으로 풀이 과정을 잘 설명했습니다. 객관식에서 실수를 줄이면 더 좋은 성적을 얻을 수 있을 것입니다.",
    results: {
      mcq: { score: 35, maxScore: 40, timeSpent: '25분', correctAnswers: 7, totalQuestions: 8 },
      short: { score: 28, maxScore: 30, timeSpent: '35분', correctAnswers: 4, totalQuestions: 4 },
      'math-essay': { score: 29, maxScore: 30, timeSpent: '50분', questionsAnswered: 2, totalQuestions: 2 }
    }
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
    score: 88,
    teacherFeedback: "기하 개념을 잘 이해하고 있으며, 도형의 성질을 정확히 파악하여 문제를 해결했습니다. 계산 과정에서 약간의 실수가 있었지만 전반적으로 우수합니다.",
    results: {
      mcq: { score: 32, maxScore: 40, timeSpent: '20분', correctAnswers: 6, totalQuestions: 8 },
      short: { score: 24, maxScore: 30, timeSpent: '45분', correctAnswers: 3, totalQuestions: 4 }
    }
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
    score: 88,
    teacherFeedback: "모든 영역에서 균형 잡힌 실력을 보여주었습니다. 특히 에세이 작성 능력이 향상되었고, 스피킹에서 자신감 있는 모습이 인상적이었습니다. 지속적인 노력으로 더 발전할 수 있을 것입니다.",
    results: {
      reading: { score: 85, maxScore: 100, timeSpent: '35분', correctAnswers: 17, totalQuestions: 20 },
      writing: { score: 90, maxScore: 100, timeSpent: '40분', wordCount: 425, targetWords: '400-500' },
      speaking: { score: 88, maxScore: 100, timeSpent: '25분', questionsAnswered: 8, totalQuestions: 8 },
      essay: { score: 89, maxScore: 100, timeSpent: '50분', wordCount: 385, targetWords: '350-400' }
    }
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
      case 'mcq': return 'bg-red-50 text-red-700 border-red-200';
      case 'short': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'math-essay': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
      'math-essay': '서술형 (수학)'
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
            {/* Teacher Feedback Section */}
            {exam.teacherFeedback && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span>선생님 종합 피드백</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {exam.teacherFeedback}
                  </p>
                </CardContent>
              </Card>
            )}

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
                        {category === 'reading' || category === 'writing' || category === 'mcq' || category === 'short' ? (
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
                        ) : category === 'essay' || category === 'math-essay' ? (
                           <>
                             <div>
                               <span className="text-muted-foreground">{category === 'math-essay' ? '응답:' : '단어수:'}</span>
                               <span className="ml-1 font-medium">{category === 'math-essay' ? `${sectionResult.questionsAnswered}/${sectionResult.totalQuestions}` : sectionResult.wordCount}</span>
                             </div>
                             <div>
                               <span className="text-muted-foreground">{category === 'math-essay' ? '소요시간:' : '목표:'}</span>
                               <span className="ml-1 font-medium">{category === 'math-essay' ? sectionResult.timeSpent : sectionResult.targetWords}</span>
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

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/student/results/${examId}/section/${category}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          상세보기
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