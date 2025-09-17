import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Download, FileText, Users, GraduationCap, CheckSquare } from 'lucide-react';

const quickActions = [
  {
    title: '새 시험 생성',
    description: '새로운 시험을 만들고 문제를 추가하세요',
    icon: Plus,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    action: 'create-exam'
  },
  {
    title: '문제 업로드',
    description: '엑셀 파일로 문제를 일괄 업로드하세요',
    icon: Upload,
    color: 'bg-green-50 text-green-700 border-green-200',
    action: 'upload-questions'
  },
  {
    title: '답안 채점',
    description: '학생들의 답안을 채점하고 피드백을 제공하세요',
    icon: CheckSquare,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    action: 'grade-answers'
  },
  {
    title: '템플릿 다운로드',
    description: '문제 업로드용 엑셀 템플릿을 다운로드하세요',
    icon: Download,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    action: 'download-template'
  }
];

const recentExams = [
  { title: 'Mid-term Reading Test', category: 'Reading', date: '2024-01-20' },
  { title: 'Grammar Practice Test', category: 'Writing', date: '2024-01-18' },
  { title: 'Speaking Assessment', category: 'Speaking', date: '2024-01-15' },
  { title: 'Essay Writing Task', category: 'Essay', date: '2024-01-12' },
];

const pendingGrading = [
  { student: '김민수', test: 'Essay Writing', submitted: '2시간 전' },
  { student: '이지현', test: 'Speaking Test', submitted: '4시간 전' },
  { student: '박준호', test: 'Reading Test', submitted: '1일 전' },
];

export const TeacherDashboard: React.FC = () => {
  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    // TODO: Implement navigation to respective pages
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">선생님 대시보드</h1>
        <p className="text-muted-foreground">시험과 문제를 관리하고 학생들의 답안을 채점하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="hover:shadow-bronze transition-shadow cursor-pointer"
                      onClick={() => handleAction(action.action)}>
                  <CardHeader className="pb-3">
                    <div className={`p-2 rounded-lg ${action.color} w-fit`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Exams */}
          <h2 className="text-xl font-semibold mb-4">최근 시험</h2>
          <Card>
            <CardContent className="p-0">
              {recentExams.map((exam, index) => (
                <div key={index} className="p-4 border-b border-border last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{exam.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {exam.category}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Preview exam:', exam.title)}
                      >
                        미리보기
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{exam.date}</span>
                  </div>
                </div>
              ))}
              <div className="p-4">
                <Button variant="ghost" size="sm" className="w-full">
                  전체 시험 관리
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Grading */}
        <div>
          <h2 className="text-xl font-semibold mb-4">채점 대기</h2>
          <Card>
            <CardContent className="p-0">
              {pendingGrading.map((item, index) => (
                <div key={index} className="p-4 border-b border-border last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{item.student}</h4>
                    <GraduationCap className="h-4 w-4 text-brand-bronze" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{item.test}</p>
                  <p className="text-xs text-muted-foreground">{item.submitted}</p>
                </div>
              ))}
              <div className="p-4">
                <Button size="sm" className="w-full bg-brand-bronze hover:bg-brand-bronze/90 text-primary-foreground shadow-bronze">
                  채점하러 가기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">이번 주 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">생성된 시험</span>
                <span className="font-semibold">3개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">채점 완료</span>
                <span className="font-semibold">24개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">평균 점수</span>
                <span className="font-semibold text-brand-bronze">82.5점</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};