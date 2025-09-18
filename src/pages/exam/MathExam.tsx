import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SubmitConfirmationModal } from '@/components/SubmitConfirmationModal';
import { Clock, Play, Pause, Calculator, PenTool, FileText } from 'lucide-react';

// Mock math exam content with sections
const examSections = {
  mcq: {
    title: '객관식 (MCQ)',
    icon: Calculator,
    color: 'bg-red-50 text-red-700 border-red-200',
    content: {
      questions: [
        {
          id: 1,
          question: '다음 식의 값을 구하시오: 3x + 5 = 14',
          options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
          correctAnswer: 'x = 3'
        },
        {
          id: 2,
          question: '다음 중 소수가 아닌 것은?',
          options: ['7', '9', '11', '13'],
          correctAnswer: '9'
        },
        {
          id: 3,
          question: '삼각형의 내각의 합은?',
          options: ['90도', '120도', '180도', '360도'],
          correctAnswer: '180도'
        },
        {
          id: 4,
          question: '2³ × 2² = ?',
          options: ['2⁵', '2⁶', '4⁵', '4⁶'],
          correctAnswer: '2⁵'
        },
        {
          id: 5,
          question: '원의 넓이 공식은?',
          options: ['πr', '2πr', 'πr²', '2πr²'],
          correctAnswer: 'πr²'
        }
      ]
    }
  },
  short: {
    title: '주관식 (Short Answer)',
    icon: PenTool,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    content: {
      questions: [
        {
          id: 1,
          question: '다음 연립방정식을 풀어 x, y의 값을 구하시오.\n2x + 3y = 7\nx - y = 1',
          instruction: '계산 과정을 포함하여 답하시오.'
        },
        {
          id: 2,
          question: '직각삼각형에서 빗변이 5cm, 한 변이 3cm일 때 나머지 한 변의 길이를 구하시오.',
          instruction: '피타고라스 정리를 이용하여 계산하시오.'
        },
        {
          id: 3,
          question: '다음 이차방정식의 해를 구하시오: x² - 5x + 6 = 0',
          instruction: '인수분해 또는 근의 공식을 사용하시오.'
        },
        {
          id: 4,
          question: '함수 f(x) = 2x² - 4x + 1에서 x = 2일 때 함수값을 구하시오.',
          instruction: '단계별로 계산 과정을 보이시오.'
        }
      ]
    }
  },
  essay: {
    title: '서술형 (Essay)',
    icon: FileText,
    color: 'bg-green-50 text-green-700 border-green-200',
    content: {
      questions: [
        {
          id: 1,
          question: '확률과 통계 문제 해결',
          prompt: '한 학급에 남학생 15명, 여학생 10명이 있습니다. 이 중에서 임의로 3명을 선택할 때, 남학생 2명과 여학생 1명이 선택될 확률을 구하고, 이를 구하는 과정을 자세히 설명하시오.',
          instruction: '조합의 개념을 사용하여 단계별로 해결 과정을 서술하고, 최종 답을 분수와 소수로 모두 표현하시오.',
          minWords: 150,
          maxWords: 300
        },
        {
          id: 2,
          question: '함수의 그래프와 최댓값 문제',
          prompt: '이차함수 y = -x² + 4x + 5의 그래프의 성질을 분석하고, 이 함수의 최댓값과 그때의 x값을 구하시오. 또한 이 함수가 x축과 만나는 점의 좌표를 구하시오.',
          instruction: '완전제곱식으로 변형하는 과정, 꼭짓점 좌표 구하기, 판별식 이용한 교점 구하기 등의 방법을 모두 활용하여 단계적으로 해결하시오.',
          minWords: 200,
          maxWords: 400
        }
      ]
    }
  }
};

export default function MathExam() {
  const location = useLocation();
  const { examId } = useParams();
  const examData = location.state?.examData;
  const totalTime = location.state?.totalTime || 4800; // Default 80 minutes

  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Get sections based on exam categories (mcq, short, math-essay -> essay)
  const sections = examData?.categories?.map((cat: string) => {
    const sectionKey = cat === 'math-essay' ? 'essay' : cat;
    return examSections[sectionKey as keyof typeof examSections];
  }).filter(Boolean) || [];
  const currentSectionData = sections[currentSection];
  
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

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(0);
    }
  };

  const nextQuestion = () => {
    const currentContent = currentSectionData?.content;
    let totalQuestions = 0;
    
    if (currentContent && 'questions' in currentContent) {
      totalQuestions = currentContent.questions.length;
    }
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      nextSection();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      prevSection();
    }
  };

  const updateAnswer = (sectionIndex: number, questionIndex: number, answer: any) => {
    const key = `${sectionIndex}-${questionIndex}`;
    setAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const renderSectionContent = () => {
    if (!currentSectionData) return null;
    
    const Icon = currentSectionData.icon;
    const content = currentSectionData.content;
    
    // MCQ Section (객관식)
    if (currentSectionData.title === '객관식 (MCQ)' && 'questions' in content) {
      const currentQ = content.questions[currentQuestion];
      const answerKey = `${currentSection}-${currentQuestion}`;
      
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{currentSectionData.title} - 문제 {currentQuestion + 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-lg font-medium mb-4">{currentQ.question}</p>
              </div>
              
              <RadioGroup
                value={answers[answerKey] || ''}
                onValueChange={(value) => updateAnswer(currentSection, currentQuestion, value)}
                disabled={isPaused}
                className="space-y-3"
              >
                {currentQ.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer font-medium">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Short Answer Section (주관식)
    if (currentSectionData.title === '주관식 (Short Answer)' && 'questions' in content) {
      const currentQ = content.questions[currentQuestion];
      const answerKey = `${currentSection}-${currentQuestion}`;
      
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{currentSectionData.title} - 문제 {currentQuestion + 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-lg mb-2">{currentQ.question}</p>
                <p className="text-sm text-muted-foreground">{currentQ.instruction}</p>
              </div>
              
              <Textarea
                placeholder="계산 과정과 답을 작성하세요..."
                value={answers[answerKey] || ''}
                onChange={(e) => updateAnswer(currentSection, currentQuestion, e.target.value)}
                disabled={isPaused}
                rows={8}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Essay Section (서술형)
    if (currentSectionData.title === '서술형 (Essay)' && 'questions' in content) {
      const currentQ = content.questions[currentQuestion];
      const answerKey = `${currentSection}-${currentQuestion}`;
      const text = answers[answerKey] || '';
      const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{currentQ.question}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">{currentQ.prompt}</h4>
                <p className="text-sm text-muted-foreground mt-2">{currentQ.instruction}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>권장 단어 수: {currentQ.minWords}-{currentQ.maxWords} 단어</span>
                  <span className={wordCount < currentQ.minWords ? 'text-red-600' : wordCount > currentQ.maxWords ? 'text-orange-600' : 'text-green-600'}>
                    현재: {wordCount} 단어
                  </span>
                </div>
              </div>
              
              <Textarea
                placeholder="자세한 해결 과정과 답안을 작성하세요..."
                value={text}
                onChange={(e) => updateAnswer(currentSection, currentQuestion, e.target.value)}
                disabled={isPaused}
                rows={15}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };

  const getTotalProgress = () => {
    let totalQuestions = 0;
    let currentPos = 0;
    
    sections.forEach((section, sIdx) => {
      const content = section.content;
      let sectionQuestions = 0;
      
      if ('questions' in content) {
        sectionQuestions = content.questions.length;
      }
      
      if (sIdx < currentSection) {
        currentPos += sectionQuestions;
      } else if (sIdx === currentSection) {
        currentPos += currentQuestion;
      }
      
      totalQuestions += sectionQuestions;
    });
    
    return (currentPos / totalQuestions) * 100;
  };

  if (!examData || sections.length === 0) {
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
                {currentSectionData?.title} ({currentSection + 1}/{sections.length})
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
            <Progress value={getTotalProgress()} className="h-2" />
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
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">시험 섹션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = currentSection === index;
                  const content = section.content;
                  let questionCount = 0;
                  
                  if ('questions' in content) {
                    questionCount = content.questions.length;
                  }
                  
                  return (
                    <Button
                      key={index}
                      variant={isActive ? "default" : "outline"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => {
                        if (!isPaused) {
                          setCurrentSection(index);
                          setCurrentQuestion(0);
                        }
                      }}
                      disabled={isPaused}
                    >
                      <div className="flex items-start space-x-3 text-left">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs opacity-70">{questionCount}개 문제</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderSectionContent()}
            
            {/* Navigation */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={isPaused || (currentSection === 0 && currentQuestion === 0)}
                  >
                    이전 문제
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      섹션 {currentSection + 1}/{sections.length}
                    </Badge>
                    <Badge variant="outline">
                      문제 {currentQuestion + 1}/{currentSectionData?.content && 'questions' in currentSectionData.content ? currentSectionData.content.questions.length : 0}
                    </Badge>
                  </div>
                  
                  {currentSection === sections.length - 1 && 
                   currentQuestion === (currentSectionData?.content && 'questions' in currentSectionData.content ? currentSectionData.content.questions.length - 1 : 0) ? (
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