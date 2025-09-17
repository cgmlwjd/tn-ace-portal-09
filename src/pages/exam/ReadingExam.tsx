import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { SubmitConfirmationModal } from '@/components/SubmitConfirmationModal';
import { ArrowLeft, ArrowRight, Clock, BookOpen, Flag, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReadingExam() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const totalQuestions = 40;
  const timeRemaining = 45; // minutes

  const samplePassage = `
    The Internet has revolutionized the way we communicate, learn, and conduct business. In just a few decades, 
    it has transformed from a simple network connecting research institutions to a global infrastructure that 
    affects virtually every aspect of modern life. Social media platforms, online shopping, and remote work 
    have become integral parts of our daily routines.

    However, this digital transformation has also brought challenges. Privacy concerns, cybersecurity threats, 
    and the digital divide between those who have access to technology and those who don't have created new 
    social and economic issues. As we continue to integrate digital technologies into our lives, it's crucial 
    to address these challenges while maximizing the benefits of our connected world.
  `;

  const sampleQuestions = [
    {
      id: 1,
      question: "What is the main topic of the passage?",
      options: [
        "A) The history of computer networks",
        "B) The impact of the Internet on modern society",
        "C) Social media and online shopping",
        "D) Privacy concerns in the digital age"
      ]
    },
    {
      id: 2,
      question: "According to the passage, which of the following is NOT mentioned as a challenge of digital transformation?",
      options: [
        "A) Privacy concerns",
        "B) Cybersecurity threats", 
        "C) Environmental impact",
        "D) Digital divide"
      ]
    }
  ];

  const currentQuestionData = sampleQuestions[Math.min(currentQuestion - 1, sampleQuestions.length - 1)];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Exam Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Reading Comprehension Test</span>
                </h1>
                <p className="text-muted-foreground">Section 1: Multiple Choice Questions</p>
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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Reading Passage */}
            <Card className="shadow-bronze h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Reading Passage</span>
                  <Badge variant="secondary">Questions {currentQuestion}-{Math.min(currentQuestion + 9, totalQuestions)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                    {samplePassage}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Question Panel */}
            <div className="space-y-6">
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Question {currentQuestion}</span>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Flag for Review
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium text-foreground">
                    {currentQuestionData.question}
                  </p>

                  <RadioGroup 
                    value={selectedAnswers[currentQuestion] || ""} 
                    onValueChange={(value) => setSelectedAnswers({...selectedAnswers, [currentQuestion]: value})}
                  >
                    {currentQuestionData.options.map((option, index) => {
                      const optionId = `q${currentQuestion}_option${index}`;
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={optionId} />
                          <Label htmlFor={optionId} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="shadow-bronze">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      disabled={currentQuestion === 1}
                      onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Save Answer
                      </Button>
                      <Button variant="default" className="w-full sm:w-auto">
                        Clear Answer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsPaused(!isPaused)}
                        className="w-full sm:w-auto sm:hidden"
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
                    </div>

                    <Button 
                      variant="outline"
                      disabled={currentQuestion === totalQuestions}
                      onClick={() => setCurrentQuestion(Math.min(totalQuestions, currentQuestion + 1))}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Question Overview */}
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="text-base">Question Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-10 gap-1">
                    {Array.from({length: totalQuestions}, (_, i) => i + 1).map((q) => (
                      <Button
                        key={q}
                        variant={
                          q === currentQuestion ? "default" : 
                          selectedAnswers[q] ? "secondary" : "outline"
                        }
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setCurrentQuestion(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
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
                      {Object.keys(selectedAnswers).length} of {totalQuestions} answered
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Section */}
              <Card className="shadow-bronze">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ready to submit your Reading section?
                    </p>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => setShowSubmitModal(true)}
                    >
                      Submit Reading Section
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Warning: You cannot change your answers after submission
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <SubmitConfirmationModal
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        sectionName="Reading"
      />
    </div>
  );
}