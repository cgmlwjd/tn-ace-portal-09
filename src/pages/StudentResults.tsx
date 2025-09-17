import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, Calendar, Trophy, Target, TrendingUp, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const examResults = [
  {
    id: 1,
    title: 'Reading Comprehension Test',
    category: 'Reading',
    score: 85,
    maxScore: 100,
    date: '2024-01-15',
    duration: '60분',
    status: 'completed',
    details: {
      correctAnswers: 17,
      totalQuestions: 20,
      timeSpent: '45분'
    }
  },
  {
    id: 2,
    title: 'Essay Writing Assessment',
    category: 'Essay',
    score: 92,
    maxScore: 100,
    date: '2024-01-12',
    duration: '90분',
    status: 'completed',
    details: {
      wordCount: 387,
      targetWords: '300-400',
      timeSpent: '78분'
    }
  },
  {
    id: 3,
    title: 'Speaking Interview',
    category: 'Speaking',
    score: 78,
    maxScore: 100,
    date: '2024-01-10',
    duration: '30분',
    status: 'completed',
    details: {
      questionsAnswered: 5,
      totalQuestions: 5,
      timeSpent: '28분'
    }
  },
  {
    id: 4,
    title: 'Grammar & Writing Test',
    category: 'Writing',
    score: 88,
    maxScore: 100,
    date: '2024-01-08',
    duration: '45분',
    status: 'completed',
    details: {
      correctAnswers: 22,
      totalQuestions: 25,
      timeSpent: '42분'
    }
  }
];

export default function StudentResults() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  
  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const averageScore = Math.round(examResults.reduce((acc, result) => acc + result.score, 0) / examResults.length);
  const totalTests = examResults.length;
  const completedTests = examResults.filter(r => r.status === 'completed').length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reading': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Writing': return 'bg-green-50 text-green-700 border-green-200';
      case 'Essay': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Speaking': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
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
              <Link to="/">
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
                <p className="text-muted-foreground">나의 시험 성과를 확인하세요</p>
              </div>
            </div>
            
            <Button variant="outline" className="hidden sm:flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>결과 다운로드</span>
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">평균 점수</p>
                    <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                      {averageScore}점
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-brand-bronze" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">응시한 시험</p>
                    <p className="text-2xl font-bold text-brand-bronze">{totalTests}개</p>
                  </div>
                  <Calendar className="h-8 w-8 text-brand-bronze" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">완료된 시험</p>
                    <p className="text-2xl font-bold text-green-600">{completedTests}개</p>
                  </div>
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">최고 점수</p>
                    <p className="text-2xl font-bold text-brand-bronze">
                      {Math.max(...examResults.map(r => r.score))}점
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-brand-bronze" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {examResults.map((result) => (
              <Card key={result.id} className="shadow-bronze hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={getCategoryColor(result.category)}>
                          {result.category}
                        </Badge>
                        <Badge variant="secondary">{result.duration}</Badge>
                      </div>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {result.date} 응시
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        / {result.maxScore}점
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>점수</span>
                      <span>{Math.round((result.score / result.maxScore) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(result.score / result.maxScore) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {result.category === 'Reading' || result.category === 'Writing' ? (
                      <>
                        <div>
                          <span className="text-muted-foreground">정답률:</span>
                          <span className="ml-1 font-medium">
                            {result.details.correctAnswers}/{result.details.totalQuestions}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">소요시간:</span>
                          <span className="ml-1 font-medium">{result.details.timeSpent}</span>
                        </div>
                      </>
                    ) : result.category === 'Essay' ? (
                      <>
                        <div>
                          <span className="text-muted-foreground">단어수:</span>
                          <span className="ml-1 font-medium">{result.details.wordCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">목표:</span>
                          <span className="ml-1 font-medium">{result.details.targetWords}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-muted-foreground">응답:</span>
                          <span className="ml-1 font-medium">
                            {result.details.questionsAnswered}/{result.details.totalQuestions}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">소요시간:</span>
                          <span className="ml-1 font-medium">{result.details.timeSpent}</span>
                        </div>
                      </>
                    )}
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
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}