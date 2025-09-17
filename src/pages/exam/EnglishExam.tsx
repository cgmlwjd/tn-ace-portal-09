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
import { Clock, Play, Pause, BookOpen, PenTool, FileText, Mic } from 'lucide-react';

// Mock exam content
const examSections = {
  reading: {
    title: 'Reading Section',
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    content: {
      passage: `The concept of artificial intelligence has captivated human imagination for decades. From science fiction novels to blockbuster movies, AI has been portrayed as both humanity's greatest achievement and its potential downfall. However, the reality of AI development is far more nuanced and practical than these dramatic representations suggest.

Modern AI systems are designed to solve specific problems and perform particular tasks. Machine learning algorithms can analyze vast amounts of data to identify patterns, make predictions, and automate decision-making processes. These capabilities have revolutionized industries ranging from healthcare and finance to transportation and entertainment.

Despite significant advances, current AI systems are still narrow in scope. They excel at specific tasks but lack the general intelligence and adaptability that humans possess. The journey toward artificial general intelligence (AGI) - AI that matches human cognitive abilities across all domains - remains a distant goal requiring fundamental breakthroughs in our understanding of intelligence itself.`,
      questions: [
        {
          id: 1,
          question: "What is the main idea of the passage?",
          options: [
            "AI will soon replace human intelligence",
            "Modern AI is more practical than fictional portrayals",
            "AI development should be stopped",
            "Science fiction accurately predicts AI development"
          ]
        },
        {
          id: 2,
          question: "According to the passage, current AI systems are:",
          options: [
            "General purpose and adaptable",
            "Narrow in scope and task-specific",
            "Identical to human intelligence",
            "Purely theoretical concepts"
          ]
        }
      ]
    }
  },
  writing: {
    title: 'Writing Section',
    icon: PenTool,
    color: 'bg-green-50 text-green-700 border-green-200',
    content: {
      questions: [
        {
          id: 1,
          type: 'fill-blank',
          question: 'Complete the sentence: The weather today is _____ than yesterday.',
          instruction: 'Fill in the blank with the appropriate comparative form.'
        },
        {
          id: 2,
          type: 'sentence-completion',
          question: 'Complete this sentence in your own words: "If I could travel anywhere in the world..."',
          instruction: 'Write a complete sentence (minimum 10 words).'
        },
        {
          id: 3,
          type: 'short-answer',
          question: 'Describe your favorite hobby and explain why you enjoy it.',
          instruction: 'Write 2-3 sentences.'
        }
      ]
    }
  },
  essay: {
    title: 'Essay Section',
    icon: FileText,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    content: {
      topics: [
        {
          id: 1,
          title: 'Technology and Education',
          topic: 'The Role of Technology in Modern Education',
          prompt: 'Write an essay discussing how technology has changed education. Include both positive and negative impacts, and provide specific examples to support your points.',
          wordCount: { min: 250, max: 400 }
        }
      ]
    }
  },
  speaking: {
    title: 'Speaking Section',
    icon: Mic,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    content: {
      questions: [
        {
          id: 1,
          section: "Part 1: Introduction",
          type: "Personal Questions",
          question: "Tell me about yourself and your interests.",
          prepTime: 30,
          responseTime: 60,
          instruction: "Introduce yourself and talk about your hobbies or interests."
        },
        {
          id: 2,
          section: "Part 2: Topic Discussion",
          type: "Structured Speaking",
          question: "Describe a memorable experience from your school life.",
          prepTime: 60,
          responseTime: 120,
          instruction: "You should say: what the experience was, when it happened, why it was memorable, and how it affected you."
        }
      ]
    }
  }
};

export default function EnglishExam() {
  const location = useLocation();
  const { examId } = useParams();
  const examData = location.state?.examData;
  const totalTime = location.state?.totalTime || 3600; // Default 60 minutes

  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Get sections based on exam categories
  const sections = examData?.categories?.map((cat: string) => examSections[cat as keyof typeof examSections]).filter(Boolean) || [];
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
    } else if (currentContent && 'topics' in currentContent) {
      totalQuestions = currentContent.topics.length;
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
    
    // Reading Section
    if ('passage' in content) {
      const currentQ = content.questions[currentQuestion];
      const answerKey = `${currentSection}-${currentQuestion}`;
      
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Passage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <span>Reading Passage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line leading-relaxed">{content.passage}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{currentQ.question}</p>
              <RadioGroup
                value={answers[answerKey] || ''}
                onValueChange={(value) => updateAnswer(currentSection, currentQuestion, value)}
                disabled={isPaused}
              >
                {currentQ.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Writing Section
    if ('questions' in content && content.questions[0].type) {
      const currentQ = content.questions[currentQuestion];
      const answerKey = `${currentSection}-${currentQuestion}`;
      
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{currentSectionData.title} - Question {currentQuestion + 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">{currentQ.question}</p>
                <p className="text-sm text-muted-foreground mt-1">{currentQ.instruction}</p>
              </div>
              
              {currentQ.type === 'fill-blank' ? (
                <Input
                  placeholder="Your answer..."
                  value={answers[answerKey] || ''}
                  onChange={(e) => updateAnswer(currentSection, currentQuestion, e.target.value)}
                  disabled={isPaused}
                />
              ) : (
                <Textarea
                  placeholder="Write your response here..."
                  value={answers[answerKey] || ''}
                  onChange={(e) => updateAnswer(currentSection, currentQuestion, e.target.value)}
                  disabled={isPaused}
                  rows={currentQ.type === 'short-answer' ? 3 : 5}
                />
              )}
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Essay Section
    if ('topics' in content) {
      const currentTopic = content.topics[currentQuestion];
      const answerKey = `${currentSection}-${currentQuestion}`;
      const text = answers[answerKey] || '';
      const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{currentTopic.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{currentTopic.topic}</h4>
                <p className="text-sm text-muted-foreground mt-2">{currentTopic.prompt}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>Required: {currentTopic.wordCount.min}-{currentTopic.wordCount.max} words</span>
                  <span className={wordCount < currentTopic.wordCount.min ? 'text-red-600' : wordCount > currentTopic.wordCount.max ? 'text-orange-600' : 'text-green-600'}>
                    Current: {wordCount} words
                  </span>
                </div>
              </div>
              
              <Textarea
                placeholder="Write your essay here..."
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
    
    // Speaking Section
    if ('questions' in content && content.questions[0].section) {
      const currentQ = content.questions[currentQuestion];
      
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Video Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <p className="text-muted-foreground">Video feed would appear here</p>
              </div>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Record
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Question Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <span>{currentQ.section}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Badge variant="outline">{currentQ.type}</Badge>
                <div>
                  <p className="font-medium mb-2">{currentQ.question}</p>
                  <p className="text-sm text-muted-foreground">{currentQ.instruction}</p>
                </div>
                <div className="text-sm">
                  <p>Preparation time: {currentQ.prepTime} seconds</p>
                  <p>Response time: {currentQ.responseTime} seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
      } else if ('topics' in content) {
        sectionQuestions = content.topics.length;
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
                timeRemaining < 300 ? 'bg-red-50 text-red-700' : 'bg-muted'
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
        <div className="space-y-6">
          {/* Section Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  {sections.map((section, index) => (
                    <Badge
                      key={index}
                      variant={index === currentSection ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => !isPaused && setCurrentSection(index)}
                    >
                      {section.title.split(' ')[0]}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Section Content */}
          {renderSectionContent()}
          
          {/* Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={isPaused || (currentSection === 0 && currentQuestion === 0)}
                >
                  Previous
                </Button>
                
                {currentSection === sections.length - 1 && 
                 currentQuestion === (currentSectionData?.content && 'questions' in currentSectionData.content 
                   ? currentSectionData.content.questions.length - 1 
                   : currentSectionData?.content && 'topics' in currentSectionData.content 
                     ? currentSectionData.content.topics.length - 1 
                     : 0) ? (
                  <Button
                    onClick={() => setShowSubmitModal(true)}
                    disabled={isPaused}
                    className="bg-brand-bronze hover:bg-brand-bronze/90"
                  >
                    Submit Exam
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={isPaused}
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      
      <SubmitConfirmationModal
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        sectionName="English Exam"
      />
    </div>
  );
}