import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  LogIn, 
  BookOpen, 
  PenTool, 
  FileText, 
  Mic, 
  BarChart3, 
  Users, 
  UserCheck, 
  Settings,
  FileQuestion,
  GraduationCap
} from 'lucide-react';

const sitemapData = {
  name: 'TN Academy',
  icon: Home,
  children: [
    {
      name: '로그인/회원가입',
      icon: LogIn,
      path: '/login',
      description: '학생/교사/관리자 로그인'
    },
    {
      name: '학생 대시보드',
      icon: GraduationCap,
      path: '/student',
      description: '학생용 메인 페이지',
      children: [
        {
          name: '시험 응시',
          icon: FileQuestion,
          description: '4가지 시험 유형',
          children: [
            { name: '리딩 (객관식)', icon: BookOpen, path: '/student/exam/reading' },
            { name: '라이팅 (주관식 단문)', icon: PenTool, path: '/student/exam/writing' },
            { name: '에세이 (서술식 장문)', icon: FileText, path: '/student/exam/essay' },
            { name: '말하기 (화상 인터뷰)', icon: Mic, path: '/student/exam/speaking' }
          ]
        },
        {
          name: '시험 결과 확인',
          icon: BarChart3,
          path: '/student/results',
          description: '개인 성적 및 분석'
        }
      ]
    },
    {
      name: '선생님 대시보드',
      icon: Users,
      path: '/teacher',
      description: '교사용 관리 페이지',
      children: [
        {
          name: '시험 등록/문제 관리',
          icon: FileQuestion,
          path: '/teacher/exams',
          description: '시험 생성 및 문제 업로드'
        },
        {
          name: '채점 (자동+수동)',
          icon: UserCheck,
          path: '/teacher/grading',
          description: 'AI 자동채점 및 수동채점'
        }
      ]
    },
    {
      name: '관리자 페이지',
      icon: Settings,
      path: '/admin',
      description: '시스템 관리',
      children: [
        {
          name: '학생 관리',
          icon: GraduationCap,
          path: '/admin/students',
          description: '학생 계정 관리'
        },
        {
          name: '교사 관리',
          icon: Users,
          path: '/admin/teachers',
          description: '교사 계정 관리'
        }
      ]
    }
  ]
};

const footerLinks = [
  { name: '이용약관', path: '/terms' },
  { name: '개인정보처리방침', path: '/privacy' },
  { name: '문의하기', path: '/contact' }
];

interface SitemapNodeProps {
  node: any;
  level?: number;
}

const SitemapNode: React.FC<SitemapNodeProps> = ({ node, level = 0 }) => {
  const Icon = node.icon;
  const indentClass = level > 0 ? `ml-${level * 6}` : '';
  
  return (
    <div className={`${indentClass} mb-2`}>
      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:shadow-card transition-shadow">
        <div className="flex-shrink-0">
          <div className="p-2 rounded-lg bg-accent">
            <Icon className="h-4 w-4 text-accent-foreground" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm">{node.name}</h4>
            {node.path && (
              <Badge variant="outline" className="text-xs">
                {node.path}
              </Badge>
            )}
          </div>
          {node.description && (
            <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
          )}
        </div>
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map((child: any, index: number) => (
            <SitemapNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const SitemapViewer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">사이트맵</h1>
        <p className="text-muted-foreground">TN Academy 웹앱의 전체 구조를 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Sitemap */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>메인 사이트 구조</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SitemapNode node={sitemapData} />
            </CardContent>
          </Card>
        </div>

        {/* Footer Links & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Footer 링크</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {footerLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                  <span className="text-sm">{link.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {link.path}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">테스트 계정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">학생</h4>
                <p className="text-xs text-muted-foreground">student / 1234</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">교사</h4>
                <p className="text-xs text-muted-foreground">teacher / 1234</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">관리자</h4>
                <p className="text-xs text-muted-foreground">admin / 1234</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">개발 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">UI 프로토타입</span>
                  <Badge className="bg-green-100 text-green-800">완료</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">인증 시스템</span>
                  <Badge className="bg-yellow-100 text-yellow-800">UI만</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">데이터베이스</span>
                  <Badge variant="outline">예정</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">실제 기능</span>
                  <Badge variant="outline">예정</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};