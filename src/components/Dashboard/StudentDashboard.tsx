import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, PenTool, FileText, Mic, Clock, CheckCircle } from 'lucide-react';

const examTypes = [
  {
    id: 'reading',
    title: 'Reading Test (리딩)',
    description: '객관식 독해 문제',
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    status: 'available'
  },
  {
    id: 'writing',
    title: 'Writing Test (라이팅)',
    description: '주관식 단문 작성',
    icon: PenTool,
    color: 'bg-green-50 text-green-700 border-green-200',
    status: 'available'
  },
  {
    id: 'essay',
    title: 'Essay Test (에세이)',
    description: '서술식 장문 작성',
    icon: FileText,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    status: 'available'
  },
  {
    id: 'speaking',
    title: 'Speaking Test (말하기)',
    description: '화상 인터뷰 시험',
    icon: Mic,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    status: 'available'
  }
];

const recentResults = [
  { test: 'Reading Test', date: '2024-01-15', score: 85, status: 'completed' },
  { test: 'Writing Test', date: '2024-01-10', score: 78, status: 'completed' },
  { test: 'Essay Test', date: '2024-01-05', score: 92, status: 'completed' },
];

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">학생 대시보드</h1>
        <p className="text-muted-foreground">원하는 시험을 선택하여 응시하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exam Types */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">시험 응시</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examTypes.map((exam) => {
              const Icon = exam.icon;
              return (
                <Card key={exam.id} className="hover:shadow-bronze transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${exam.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exam.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>60분</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-brand-bronze hover:bg-brand-bronze/90 text-primary-foreground shadow-bronze"
                        onClick={() => {
                          // 시험 타입에 따른 라우팅
                          const routeMap = {
                            reading: '/student/exam/reading',
                            writing: '/student/exam/writing',
                            essay: '/student/exam/essay',
                            speaking: '/student/exam/speaking'
                          };
                          navigate(routeMap[exam.id as keyof typeof routeMap]);
                        }}
                      >
                        시험 시작
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Results */}
        <div>
          <h2 className="text-xl font-semibold mb-4">최근 시험 결과</h2>
          <Card>
            <CardContent className="p-0">
              {recentResults.map((result, index) => (
                <div key={index} className="p-4 border-b border-border last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{result.test}</h4>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{result.date}</span>
                    <span className="font-semibold text-brand-bronze">
                      {result.score}점
                    </span>
                  </div>
                </div>
              ))}
              <div className="p-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/student/results')}
                >
                  전체 결과 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};