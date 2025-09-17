import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, User, Clock, FileText, Brain, GraduationCap, CheckCircle, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ManualGrading() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [manualScore, setManualScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  // Mock data - in real app this would come from API
  const gradingData = {
    id: gradeId,
    student: {
      name: "김민수",
      schoolSystem: "korea",
      grade: "중2",
      studentId: "2024001"
    },
    exam: {
      title: "영어 중간고사 - 2학년",
      category: "Essay",
      maxScore: 100,
      timeLimit: "60분"
    },
    question: {
      number: 1,
      text: "다음 주제에 대해 150-200단어로 영어 에세이를 작성하시오.\n\n주제: \"My Future Dream and How to Achieve It\"\n\n- 자신의 미래 꿈이 무엇인지 명확히 서술하시오\n- 그 꿈을 이루기 위한 구체적인 계획을 제시하시오\n- 과정에서 예상되는 어려움과 극복 방법을 언급하시오",
      type: "essay",
      maxScore: 100
    },
    studentAnswer: {
      content: "My future dream is to become a doctor. I have always been interested in helping people and making them feel better when they are sick.\n\nTo achieve this dream, I have several plans. First, I need to study very hard in science subjects like biology and chemistry. I am already taking extra classes after school to improve my grades. Second, I plan to volunteer at the local hospital during summer vacation to gain experience and learn more about medical work.\n\nI know there will be many difficulties on this path. Medical school is very competitive and expensive. Also, studying medicine takes many years and requires a lot of dedication. However, I believe I can overcome these challenges by staying motivated and working consistently towards my goal.\n\nI think helping people as a doctor would be very rewarding, and this motivates me to work hard every day.",
      wordCount: 142,
      submittedAt: "2024-01-16 14:30:25",
      timeSpent: "45분"
    },
    aiGrading: {
      totalScore: 78,
      breakdown: {
        content: { score: 20, maxScore: 25, comment: "주제에 적합하고 개인적인 경험이 잘 반영됨" },
        organization: { score: 18, maxScore: 25, comment: "논리적 구성이 좋으나 결론 부분이 약함" },
        vocabulary: { score: 20, maxScore: 25, comment: "적절한 어휘 사용, 다양성 부족" },
        grammar: { score: 20, maxScore: 25, comment: "문법적 오류 몇 개 발견, 전반적으로 양호" }
      },
      feedback: "전반적으로 잘 작성된 에세이입니다. 주제에 대한 이해도가 높고 개인적인 목표가 명확하게 드러납니다. 다만 단어 수가 요구사항(150-200단어)에 약간 부족하고, 결론 부분을 더 강화할 필요가 있습니다.",
      gradedAt: "2024-01-16 14:35:12"
    }
  };

  const handleSubmit = async () => {
    if (!manualScore) {
      toast({
        title: "점수를 입력해주세요",
        description: "수동 채점 점수는 필수 입력 항목입니다.",
        variant: "destructive"
      });
      return;
    }

    const score = parseInt(manualScore);
    if (isNaN(score) || score < 0 || score > gradingData.question.maxScore) {
      toast({
        title: "점수 범위 오류",
        description: `점수는 0-${gradingData.question.maxScore} 범위 내에서 입력해주세요.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "수동 채점 완료",
        description: "채점 결과가 성공적으로 저장되었습니다.",
      });
      setIsSubmitting(false);
      navigate('/teacher');
    }, 1000);
  };

  const handleTempSave = async () => {
    setIsSaving(true);
    
    // Simulate API call for temporary save
    setTimeout(() => {
      toast({
        title: "임시 저장 완료",
        description: "채점 내용이 임시 저장되었습니다.",
      });
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLanguageToggle={handleLanguageToggle} currentLanguage={currentLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/teacher')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              대시보드로 돌아가기
            </Button>
            
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">수동 채점</h1>
                <p className="text-muted-foreground">학생 답안 검토 및 채점</p>
              </div>
            </div>
          </div>

          {/* Student & Exam Info */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>학생 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">학생명</p>
                  <p className="font-semibold">{gradingData.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">학제-학년</p>
                  <Badge variant="secondary">
                    {gradingData.student.schoolSystem === 'korea' ? '한국' : '미국'}-{gradingData.student.grade}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">시험명</p>
                  <p className="font-semibold">{gradingData.exam.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">제출시간</p>
                  <p className="text-sm">{gradingData.studentAnswer.submittedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>문제 {gradingData.question.number}</span>
                <Badge variant="outline">{gradingData.exam.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-foreground bg-muted/50 p-4 rounded-lg">
                {gradingData.question.text}
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>배점: {gradingData.question.maxScore}점</span>
                <span>제한시간: {gradingData.exam.timeLimit}</span>
              </div>
            </CardContent>
          </Card>

          {/* Student Answer */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle>학생 답안</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="whitespace-pre-line text-foreground">
                  {gradingData.studentAnswer.content}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>단어 수: {gradingData.studentAnswer.wordCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>소요시간: {gradingData.studentAnswer.timeSpent}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Grading Results */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI 채점 결과</span>
                <Badge className="bg-green-500 hover:bg-green-600">
                  {gradingData.aiGrading.totalScore}/{gradingData.question.maxScore}점
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(gradingData.aiGrading.breakdown).map(([key, item]) => (
                    <div key={key} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">
                          {key === 'content' ? '내용' :
                           key === 'organization' ? '구성' :
                           key === 'vocabulary' ? '어휘' :
                           key === 'grammar' ? '문법' : key}
                        </span>
                        <Badge variant="outline">{item.score}/{item.maxScore}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.comment}</p>
                    </div>
                  ))}
                </div>
                
                {/* AI Feedback */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">AI 종합 평가</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{gradingData.aiGrading.feedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Grading Form */}
          <Card className="shadow-bronze">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>수동 채점</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="manual-score">점수 (0-{gradingData.question.maxScore})</Label>
                    <Input
                      id="manual-score"
                      type="number"
                      min="0"
                      max={gradingData.question.maxScore}
                      value={manualScore}
                      onChange={(e) => setManualScore(e.target.value)}
                      placeholder={`점수를 입력하세요 (최대 ${gradingData.question.maxScore}점)`}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-muted-foreground">
                      <p>AI 채점: {gradingData.aiGrading.totalScore}점</p>
                      <p>차이: {manualScore ? Math.abs(parseInt(manualScore) - gradingData.aiGrading.totalScore) : 0}점</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="feedback">선생님 피드백</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="학생에게 전달할 피드백을 작성해주세요..."
                    rows={5}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSaving}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? '저장 중...' : '채점 완료'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleTempSave}
                    disabled={isSubmitting || isSaving}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? '저장 중...' : '임시 저장'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/teacher')}
                    disabled={isSubmitting || isSaving}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}