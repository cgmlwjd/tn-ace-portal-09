import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SubmitConfirmationModal } from '@/components/SubmitConfirmationModal';
import { Clock, Play, Pause, Calculator, Image as ImageIcon } from 'lucide-react';

// Mock math exam content
const mockMathQuestions = [
  {
    id: 1,
    type: 'multiple-choice',
    question: '다음 식의 값을 구하시오: 3x + 5 = 14',
    options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
    correctAnswer: 'x = 3',
    images: []
  },
  {
    id: 2,
    type: 'short-answer',
    question: '다음 도형의 넓이를 구하시오.',
    instruction: '계산 과정을 포함하여 답하시오.',
    images: ['/api/placeholder/300/200'] // Placeholder for math diagram
  },
  {
    id: 3,
    type: 'problem-solving',
    question: '철수는 사과 12개를 가지고 있었습니다. 친구들에게 3개씩 나누어 주었을 때, 몇 명의 친구에게 나누어 줄 수 있는지 구하시오.',
    instruction: '풀이 과정을 자세히 작성하시오.',
    images: []
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: '다음 그래프에서 함수의 최댓값은?',
    options: ['2', '4', '6', '8'],
    correctAnswer: '6',
    images: ['/api/placeholder/400/300'] // Placeholder for graph
  },
  {
    id: 5,
    type: 'calculation',
    question: '다음 계산을 하시오: 2.5 × 4.8 + 1.2 ÷ 0.3',
    instruction: '소수점 둘째 자리까지 구하시오.',
    images: []
  }
];

export default function MathExam() {
  const location = useLocation();
  const { examId } = useParams();
  const examData = location.state?.examData;
  const totalTime = location.state?.totalTime || 4800; // Default 80 minutes

  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  
  const totalQuestions = mockMathQuestions.length;
  
  // Timer effect
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setShowSubmitModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (!isPaused) {
      setCurrentQuestion(index);
    }
  };

  const updateAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const currentQ = mockMathQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const renderQuestion = () => {
    if (!currentQ) return null;

    return (
      <Card className="overflow-hidden">
        {/* Question Header with Gradient Background */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Calculator className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900">
                    문제 {currentQuestion + 1}
                  </h3>
                  <p className="text-sm text-indigo-600">
                    총 {totalQuestions}문제 중
                  </p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-indigo-100 text-indigo-700 border-indigo-200"
              >
                {currentQ.type}
              </Badge>
            </div>
            
            {/* Progress indicator */}
            <div className="w-full bg-white/50 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Question Text */}
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
              <p className="text-lg font-medium text-gray-900 mb-2">{currentQ.question}</p>
              {currentQ.instruction && (
                <p className="text-sm text-gray-600 italic">{currentQ.instruction}</p>
              )}
            </div>

            {/* Question Images */}
            {currentQ.images && currentQ.images.length > 0 && (
              <div className="space-y-4">
                {currentQ.images.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 rounded-full bg-gray-100">
                        <ImageIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">문제 도표 {index + 1}</span>
                    </div>
                    <div className="aspect-video bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm">
                      <p className="text-gray-500 font-medium">수학 문제 이미지가 여기에 표시됩니다</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Input */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <h4 className="font-semibold text-gray-900">답안 작성</h4>
              </div>
              
              {currentQ.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {currentQ.options?.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={option}
                        checked={answers[currentQ.id] === option}
                        onChange={(e) => updateAnswer(currentQ.id, e.target.value)}
                        disabled={isPaused}
                        className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span className="text-gray-700 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              ) : currentQ.type === 'calculation' || currentQ.type === 'short-answer' ? (
                <div className="space-y-3">
                  <Input
                    placeholder="답을 입력하세요..."
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => updateAnswer(currentQ.id, e.target.value)}
                    disabled={isPaused}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="계산 과정을 포함하여 답을 작성하세요..."
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => updateAnswer(currentQ.id, e.target.value)}
                    disabled={isPaused}
                    rows={8}
                    className="resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-muted-foreground">시험 데이터를 불러올 수 없습니다.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      {/* Exam Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{examData.title}</h1>
              <p className="text-muted-foreground">
                수학 시험 ({currentQuestion + 1}/{totalQuestions})
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeRemaining < 600 ? 'bg-red-50 text-red-700' : 'bg-muted'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
              </div>
              
              {/* Pause/Resume Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="p-8 max-w-md">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">시험이 일시정지되었습니다</h3>
              <p className="text-muted-foreground mb-4">
                Resume 버튼을 클릭하여 시험을 계속 진행하세요.
              </p>
              <Button onClick={togglePause}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            </div>
          </Card>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {renderQuestion()}
            
            {/* Navigation */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={isPaused || currentQuestion === 0}
                  >
                    이전 문제
                  </Button>
                  
                  {currentQuestion === totalQuestions - 1 ? (
                    <Button
                      onClick={() => setShowSubmitModal(true)}
                      disabled={isPaused}
                      className="bg-brand-bronze hover:bg-brand-bronze/90"
                    >
                      시험 제출
                    </Button>
                  ) : (
                    <Button
                      onClick={nextQuestion}
                      disabled={isPaused}
                    >
                      다음 문제
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Overview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">문제 개요</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {mockMathQuestions.map((_, index) => (
                    <Button
                      key={index}
                      variant={index === currentQuestion ? "default" : answers[mockMathQuestions[index].id] ? "secondary" : "outline"}
                      size="sm"
                      className="aspect-square p-0"
                      onClick={() => goToQuestion(index)}
                      disabled={isPaused}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
                    <span>현재 문제</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-secondary rounded-sm"></div>
                    <span>답안 작성</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-background border border-border rounded-sm"></div>
                    <span>미작성</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      
      <SubmitConfirmationModal
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        sectionName="Math Exam"
      />
    </div>
  );
}