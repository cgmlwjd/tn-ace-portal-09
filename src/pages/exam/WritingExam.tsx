import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { SubmitConfirmationModal } from '@/components/SubmitConfirmationModal';
import { ArrowLeft, ArrowRight, Clock, PenTool, Save, Flag, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WritingExam() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const totalQuestions = 25;
  const timeRemaining = 38; // minutes

  const sampleQuestions = [
    {
      id: 1,
      type: 'fill-blank',
      question: "Complete the sentence with the correct word:",
      prompt: "The scientist _______ a groundbreaking discovery in renewable energy.",
      options: ["made", "did", "performed", "created"],
      answer: ""
    },
    {
      id: 2,
      type: 'sentence-completion',
      question: "Complete the following sentence in 10-15 words:",
      prompt: "Despite the challenges of remote learning, students have shown remarkable...",
      answer: ""
    },
    {
      id: 3,
      type: 'short-answer',
      question: "Write a brief response (3-5 sentences):",
      prompt: "Explain the importance of time management for students. Provide at least two specific benefits.",
      answer: ""
    },
    {
      id: 4,
      type: 'grammar-correction',
      question: "Identify and correct the grammatical error in the following sentence:",
      prompt: "The students was studying very hard for their upcoming examination because they wants to achieve good grades.",
      answer: ""
    }
  ];

  const currentQuestionData = sampleQuestions[Math.min(currentQuestion - 1, sampleQuestions.length - 1)];

  const handleAnswerChange = (value: string) => {
    setAnswers({...answers, [currentQuestion]: value});
  };

  const renderQuestionInput = () => {
    const answer = answers[currentQuestion] || "";

    switch (currentQuestionData.type) {
      case 'fill-blank':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select or type the correct word:</p>
            <Input 
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Enter your answer..."
              className="text-lg"
            />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Suggested options:</p>
              <div className="flex flex-wrap gap-2">
                {currentQuestionData.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnswerChange(option)}
                    className={answer === option ? "bg-primary text-primary-foreground" : ""}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sentence-completion':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Complete the sentence (10-15 words):</p>
            <Textarea 
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Continue the sentence..."
              rows={2}
              className="text-base"
            />
            <div className="text-xs text-muted-foreground">
              Word count: {answer.split(' ').filter(w => w.length > 0).length} words
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Write your response (3-5 sentences):</p>
            <Textarea 
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write your answer here..."
              rows={5}
              className="text-base"
            />
            <div className="text-xs text-muted-foreground">
              Character count: {answer.length} characters
            </div>
          </div>
        );

      case 'grammar-correction':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Rewrite the sentence with correct grammar:</p>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-sm font-mono">{currentQuestionData.prompt}</p>
            </div>
            <Textarea 
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write the corrected sentence..."
              rows={3}
              className="text-base"
            />
          </div>
        );

      default:
        return (
          <Input 
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Exam Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                  <PenTool className="h-6 w-6" />
                  <span>Writing Test</span>
                </h1>
                <p className="text-muted-foreground">Section 2: Short Answer Questions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{timeRemaining}:00</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="hidden sm:flex"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    재개
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    일시정지
                  </>
                )}
              </Button>
              <Badge variant="outline">
                Question {currentQuestion} of {totalQuestions}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
            </div>
            <Progress value={(currentQuestion / totalQuestions) * 100} className="h-2" />
          </div>

          {/* Pause Overlay */}
          {isPaused && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="max-w-md mx-4">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="text-lg font-semibold">시험이 일시정지되었습니다</div>
                  <p className="text-muted-foreground">이어서 하시려면 재개 버튼을 눌러주세요.</p>
                  <Button onClick={() => setIsPaused(false)} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    재개
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Question Card */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>Question {currentQuestion}</span>
                  <Badge variant="secondary" className="capitalize">
                    {currentQuestionData.type.replace('-', ' ')}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Flag for Review
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="font-medium text-foreground mb-4">
                  {currentQuestionData.question}
                </p>
                
                {currentQuestionData.prompt && (
                  <div className="p-4 bg-accent/30 rounded-lg mb-4">
                    <p className="text-sm font-medium text-foreground">
                      {currentQuestionData.prompt}
                    </p>
                  </div>
                )}
              </div>

              {renderQuestionInput()}

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Answer
                </Button>
                
                <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                  <Button 
                    variant="outline" 
                    disabled={currentQuestion === 1}
                    onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                    className="min-w-fit shrink text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2 lg:text-base lg:px-4 lg:py-2"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                    Previous
                  </Button>

                  <Button variant="outline" className="min-w-fit shrink text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2 lg:text-base lg:px-4 lg:py-2">
                    Save Answer
                  </Button>

                  <Button 
                    variant="outline"
                    disabled={currentQuestion === totalQuestions}
                    onClick={() => setCurrentQuestion(Math.min(totalQuestions, currentQuestion + 1))}
                    className="min-w-fit shrink text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2 lg:text-base lg:px-4 lg:py-2"
                  >
                    Next
                    <ArrowRight className="h-3 w-3 ml-1 sm:h-4 sm:w-4 sm:ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsPaused(!isPaused)}
                    className="min-w-fit shrink text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2 lg:text-base lg:px-4 lg:py-2 sm:hidden w-full mt-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                        재개
                      </>
                    ) : (
                      <>
                        <Pause className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                        일시정지
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Overview */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="text-base">Question Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
                {Array.from({length: totalQuestions}, (_, i) => i + 1).map((q) => (
                  <Button
                    key={q}
                    variant={
                      q === currentQuestion ? "default" : 
                      answers[q] ? "secondary" : "outline"
                    }
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setCurrentQuestion(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-secondary rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-border rounded"></div>
                    <span>Not answered</span>
                  </div>
                </div>
                <div>
                  {Object.keys(answers).length} of {totalQuestions} answered
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card className="shadow-bronze">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ready to submit your Writing section?
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Writing Section
                </Button>
                <p className="text-xs text-muted-foreground">
                  Warning: You cannot change your answers after submission
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      
      <SubmitConfirmationModal
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        sectionName="Writing"
      />
    </div>
  );
}