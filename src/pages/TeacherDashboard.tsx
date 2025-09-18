import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import ExamRegistrationModal from '@/components/ExamRegistrationModal';
import { BookOpen, Users, ClipboardCheck, FileText, Upload, Download, Calendar, Clock, GraduationCap, BarChart3, CheckCircle, AlertCircle, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
export default function TeacherDashboard() {
  // Mock data - declare before using in state
  const examStats = {
    totalExams: 12,
    activeExams: 4,
    completedExams: 8,
    pendingGrading: 23
  };
  
  const recentExams = [{
    id: 1,
    title: "영어 중간고사 - 2학년",
    categories: ["reading", "writing"],
    subjectCombinations: [
      { subject: "english", category: "reading" },
      { subject: "english", category: "writing" }
    ],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" },
      { schoolSystem: "usa", grade: "Grade 8" }
    ],
    created: "2024-01-15",
    examDate: "2024-01-20T09:00",
    duration: "60분",
    questions: 25
  }, {
    id: 2,
    title: "Speaking Test - Level 3",
    categories: ["speaking"],
    subjectCombinations: [
      { subject: "english", category: "speaking" }
    ],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "고1" },
      { schoolSystem: "korea", grade: "고2" }
    ],
    created: "2024-01-12",
    examDate: "2024-01-18T14:00",
    duration: "30분",
    questions: 8
  }, {
    id: 3,
    title: "Essay Writing Assessment",
    categories: ["writing", "essay"],
    subjectCombinations: [
      { subject: "english", category: "writing" },
      { subject: "english", category: "essay" }
    ],
    selectedCombinations: [
      { schoolSystem: "uk", grade: "Year 10" },
      { schoolSystem: "uk", grade: "Year 11" }
    ],
    created: "2024-01-10",
    examDate: "2024-01-25T10:30",
    duration: "90분",
    questions: 3
  }, {
    id: 4,
    title: "Essay 평가 시험",
    categories: ["essay"],
    subjectCombinations: [
      { subject: "english", category: "essay" }
    ],
    selectedCombinations: [
      { schoolSystem: "usa", grade: "Grade 11" },
      { schoolSystem: "usa", grade: "Grade 12" }
    ],
    created: "2024-01-08",
    examDate: "2024-01-22T13:00",
    duration: "120분",
    questions: 2
  }, {
    id: 5,
    title: "수학 중간고사 - 대수",
    categories: ["mcq", "short", "math-essay"],
    subjectCombinations: [
      { subject: "math", category: "객관식" },
      { subject: "math", category: "주관식" },
      { subject: "math", category: "서술형" }
    ],
    selectedCombinations: [
      { schoolSystem: "korea", grade: "중2" },
      { schoolSystem: "korea", grade: "중3" }
    ],
    created: "2024-01-07",
    examDate: "2024-01-15T11:00",
    duration: "80분",
    questions: 20
  }, {
    id: 6,
    title: "Math Test - Geometry",
    categories: ["mcq", "short"],
    subjectCombinations: [
      { subject: "math", category: "객관식" },
      { subject: "math", category: "주관식" }
    ],
    selectedCombinations: [
      { schoolSystem: "usa", grade: "Grade 9" },
      { schoolSystem: "usa", grade: "Grade 10" }
    ],
    created: "2024-01-05",
    examDate: "2024-01-12T15:30",
    duration: "75분",
    questions: 18
  }];

  // State declarations
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [recentExamsList, setRecentExamsList] = useState(recentExams);
  
  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const handleExamRegistration = (examData: any) => {
    setRecentExamsList(prev => [examData, ...prev]);
  };

  const handleAIGrading = async (gradeId: number) => {
    // 첫 번째 토스트: AI 채점 시작
    toast({
      title: "AI 채점 중입니다",
      description: "잠시만 기다려주세요...",
    });

    // 3초 후 두 번째 토스트: 채점 완료
    setTimeout(() => {
      toast({
        title: "채점 완료 되었습니다!",
        description: "AI 채점 결과를 확인해보세요.",
      });
      
      // 1초 후 결과 페이지로 이동
      setTimeout(() => {
        navigate(`/teacher/ai-result/${gradeId}`);
      }, 1000);
    }, 3000);
  };
  const pendingGrades = [{
    id: 1,
    studentName: "김민수",
    examTitle: "영어 중간고사 - 2학년",
    schoolSystem: "korea",
    grade: "중2",
    submittedAt: "2024-01-16 14:30",
    aiGradingTime: "2024-01-16 14:35",
    manualGradingTime: null,
    categories: ["essay"]
  }, {
    id: 2,
    studentName: "이지은",
    examTitle: "Speaking Test - Level 3",
    schoolSystem: "korea", 
    grade: "고1",
    submittedAt: "2024-01-16 13:45",
    aiGradingTime: "2024-01-16 14:10",
    manualGradingTime: "2024-01-16 15:20",
    categories: ["speaking"]
  }, {
    id: 3,
    studentName: "박상현",
    examTitle: "영어 중간고사 - 2학년",
    schoolSystem: "usa",
    grade: "Grade 8",
    submittedAt: "2024-01-16 12:15",
    aiGradingTime: "2024-01-16 12:20",
    manualGradingTime: "2024-01-16 16:45",
    categories: ["reading"]
  }, {
    id: 4,
    studentName: "최수빈",
    examTitle: "영어 종합 평가",
    schoolSystem: "korea",
    grade: "고2",
    submittedAt: "2024-01-17 09:15",
    aiGradingTime: "2024-01-17 09:20",
    manualGradingTime: null,
    categories: ["reading", "writing", "speaking"]
  }, {
    id: 5,
    studentName: "정하늘",
    examTitle: "English Comprehensive Test",
    schoolSystem: "usa",
    grade: "Grade 10",
    submittedAt: "2024-01-17 10:30",
    aiGradingTime: null,
    manualGradingTime: null,
    categories: ["essay", "speaking"]
  }, {
    id: 6,
    studentName: "장민준",
    examTitle: "영어 실력 진단 평가",
    schoolSystem: "uk",
    grade: "Year 9",
    submittedAt: "2024-01-17 11:45",
    aiGradingTime: "2024-01-17 11:50",
    manualGradingTime: "2024-01-17 13:20",
    categories: ["reading", "writing"]
  }, {
    id: 7,
    studentName: "김서연",
    examTitle: "통합 영어 평가",
    schoolSystem: "korea",
    grade: "중3",
    submittedAt: "2024-01-17 14:20",
    aiGradingTime: "2024-01-17 14:25",
    manualGradingTime: null,
    categories: ["writing", "essay", "speaking"]
  }, {
    id: 8,
    studentName: "이수현",
    examTitle: "수학 중간고사 - 대수",
    schoolSystem: "korea",
    grade: "중2",
    submittedAt: "2024-01-18 10:15",
    aiGradingTime: "2024-01-18 10:20",
    manualGradingTime: null,
    categories: ["mcq", "short", "math-essay"]
  }, {
    id: 9,
    studentName: "박지호",
    examTitle: "Math Comprehensive Test - Geometry",
    schoolSystem: "usa",
    grade: "Grade 9",
    submittedAt: "2024-01-18 11:30",
    aiGradingTime: null,
    manualGradingTime: null,
    categories: ["mcq", "short"]
  }, {
    id: 10,
    studentName: "최예린",
    examTitle: "수학 기말고사 - 함수",
    schoolSystem: "korea",
    grade: "고1",
    submittedAt: "2024-01-18 14:45",
    aiGradingTime: "2024-01-18 14:50",
    manualGradingTime: "2024-01-18 16:10",
    categories: ["mcq", "short", "math-essay"]
  }];
  return <div className="min-h-screen flex flex-col bg-background">
      <Header onLanguageToggle={handleLanguageToggle} currentLanguage={currentLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">선생님 대시보드</h1>
                <p className="text-muted-foreground">시험 관리 및 채점 시스템</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-bronze">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">전체 시험</p>
                    <p className="text-2xl font-bold">{examStats.totalExams}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-bronze">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">채점 대기</p>
                    <p className="text-2xl font-bold">{examStats.pendingGrading}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="exams" className="space-y-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-2">
              <TabsTrigger value="exams">시험 관리</TabsTrigger>
              <TabsTrigger value="grading">채점 관리</TabsTrigger>
            </TabsList>

            {/* 시험 관리 탭 */}
            <TabsContent value="exams" className="space-y-6">
              {/* 최근 시험 목록 */}
              <Card className="shadow-bronze">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>최근 시험 목록</span>
                    </CardTitle>
                    <Button 
                      onClick={() => setIsExamModalOpen(true)}
                      className="flex items-center space-x-2 w-full sm:w-auto"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>새 시험 추가하기</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentExamsList.map(exam => <div key={exam.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{exam.title}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">생성일: {exam.created}</p>
                            {exam.examDate && (
                              <p className="text-sm text-muted-foreground">시험일: {new Date(exam.examDate).toLocaleString('ko-KR')}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* 선택된 과목-카테고리 조합 표시 */}
                        {exam.subjectCombinations && exam.subjectCombinations.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">과목 카테고리:</p>
                            <div className="flex flex-wrap gap-2">
                              {exam.subjectCombinations.map((combo: any, index: number) => {
                                const subjectLabel = combo.subject === 'english' ? '영어' : combo.subject === 'math' ? '수학' : combo.subject;
                                const categoryLabels: { [key: string]: string } = {
                                  'reading': 'Reading',
                                  'writing': 'Writing', 
                                  'essay': 'Essay',
                                  'speaking': 'Speaking',
                                  '객관식': '객관식',
                                  '주관식': '주관식',
                                  '서술형': '서술형'
                                };
                                const categoryLabel = categoryLabels[combo.category] || combo.category;
                                
                                return (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {subjectLabel} - {categoryLabel}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* 기존 카테고리 형식 호환성 (이전 시험들을 위해) */}
                        {(!exam.subjectCombinations || exam.subjectCombinations.length === 0) && exam.categories && (
                          <div className="flex flex-wrap gap-2 mb-3">
                             {exam.categories?.map((category: string) => (
                               <Badge key={category} variant="outline" className="text-xs">
                                  {category === 'reading' ? 'Reading (영어)' : 
                                   category === 'writing' ? 'Writing (영어)' : 
                                   category === 'essay' ? 'Essay (영어)' : 
                                   category === 'speaking' ? 'Speaking (영어)' :
                                   category === 'mcq' ? '객관식 (수학)' : 
                                   category === 'short' ? '주관식 (수학)' : 
                                   category === 'math-essay' ? '서술형 (수학)' : category}
                               </Badge>
                            ))}
                          </div>
                        )}

                        {/* 학제-학년 정보 표시 */}
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1">대상 학제-학년:</p>
                          <div className="flex flex-wrap gap-1">
                            {exam.selectedCombinations?.map((combo: any, index: number) => {
                              const systemLabel = combo.schoolSystem === 'korea' ? '한국' : 
                                                combo.schoolSystem === 'usa' ? '미국' : 
                                                combo.schoolSystem === 'uk' ? '영국' : combo.schoolSystem;
                              return (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {systemLabel}-{combo.grade}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-border">
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </Button>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 채점 관리 탭 */}
            <TabsContent value="grading" className="space-y-6">
              <div className="grid lg:grid-cols-1 gap-6">
                {/* 채점 대기 목록 */}
                <Card className="shadow-bronze">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ClipboardCheck className="h-5 w-5" />
                      <span>채점 대기 목록</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingGrades.map(grade => <div key={grade.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h5 className="font-medium text-base text-foreground">{grade.studentName}</h5>
                              <p className="text-sm text-muted-foreground">{grade.examTitle}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {grade.schoolSystem === 'korea' ? '한국' : 
                                   grade.schoolSystem === 'usa' ? '미국' : 
                                   grade.schoolSystem === 'uk' ? '영국' : grade.schoolSystem}-{grade.grade}
                                </Badge>
                                <div className="flex flex-wrap gap-1">
                                   {grade.categories?.map((category: string, idx: number) => (
                                     <Badge key={idx} variant="outline" className="text-xs">
                                       {category === 'reading' ? 'Reading' : 
                                        category === 'writing' ? 'Writing' : 
                                        category === 'essay' ? 'Essay' : 
                                        category === 'speaking' ? 'Speaking' : 
                                        category === 'mcq' ? '객관식' : 
                                        category === 'short' ? '주관식' : 
                                        category === 'math-essay' ? '서술형' : category}
                                     </Badge>
                                   ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              {/* 대기 상태 표시 (오른쪽 위) */}
                              {!grade.aiGradingTime && (
                                <Badge variant="destructive" className="text-xs">
                                  AI 채점 대기
                                </Badge>
                              )}
                              {!grade.manualGradingTime && (
                                <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                                  수동 채점 대기
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">제출 시간</p>
                              <p className="text-sm">{grade.submittedAt}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">AI 채점 시간</p>
                              <p className="text-sm">{grade.aiGradingTime || '미완료'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">수동 채점 시간</p>
                              <p className="text-sm">{grade.manualGradingTime || '미완료'}</p>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              {grade.aiGradingTime && (
                                <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                                  AI 채점 완료
                                </Badge>
                              )}
                              {grade.manualGradingTime && (
                                <Badge variant="default" className="text-xs bg-blue-500 hover:bg-blue-600">
                                  수동 채점 완료
                                </Badge>
                              )}
                            </div>
                          </div>

                          
                          <div className="flex gap-2 pt-3 border-t border-border">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAIGrading(grade.id)}
                              disabled={grade.aiGradingTime ? false : false}
                              className="flex-1"
                            >
                              AI 채점
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/teacher/grading/${grade.id}`)}
                              className="flex-1"
                            >
                              수동 채점
                            </Button>
                          </div>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      
      <ExamRegistrationModal 
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onComplete={handleExamRegistration}
      />
    </div>;
}