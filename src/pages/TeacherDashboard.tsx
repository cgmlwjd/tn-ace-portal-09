import React, { useState } from 'react';
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
    created: "2024-01-15",
    duration: "60분",
    questions: 25
  }, {
    id: 2,
    title: "Speaking Test - Level 3",
    categories: ["speaking"],
    created: "2024-01-12",
    duration: "30분",
    questions: 8
  }, {
    id: 3,
    title: "Essay Writing Assessment",
    categories: ["writing", "essay"],
    created: "2024-01-10",
    duration: "90분",
    questions: 3
  }, {
    id: 4,
    title: "Essay 평가 시험",
    categories: ["essay"],
    created: "2024-01-08",
    duration: "120분",
    questions: 2
  }];

  // State declarations
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [recentExamsList, setRecentExamsList] = useState(recentExams);
  
  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const handleExamRegistration = (examData: any) => {
    setRecentExamsList(prev => [examData, ...prev]);
  };
  const pendingGrades = [{
    id: 1,
    studentName: "김민수",
    examTitle: "영어 중간고사 - 2학년",
    submittedAt: "2024-01-16 14:30",
    type: "Essay"
  }, {
    id: 2,
    studentName: "이지은",
    examTitle: "Speaking Test - Level 3",
    submittedAt: "2024-01-16 13:45",
    type: "Speaking"
  }, {
    id: 3,
    studentName: "박상현",
    examTitle: "영어 중간고사 - 2학년",
    submittedAt: "2024-01-16 12:15",
    type: "Reading"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">완료된 시험</p>
                    <p className="text-2xl font-bold">{examStats.completedExams}</p>
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

            <Card className="shadow-bronze">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">임시 저장된 시험</p>
                    <p className="text-2xl font-bold">{examStats.activeExams}</p>
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
                          <p className="text-sm text-muted-foreground">생성일: {exam.created}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exam.categories?.map((category: string) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category === 'reading' ? 'Reading' : 
                               category === 'writing' ? 'Writing' : 
                               category === 'essay' ? 'Essay' : 
                               category === 'speaking' ? 'Speaking' : category}
                            </Badge>
                          ))}
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
                      {pendingGrades.map(grade => <div key={grade.id} className="border border-border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-sm">{grade.studentName}</h5>
                              <p className="text-xs text-muted-foreground">{grade.examTitle}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {grade.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            제출 시간: {grade.submittedAt}
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              AI 채점
                            </Button>
                            <Button size="sm" className="flex-1">
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