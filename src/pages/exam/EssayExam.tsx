import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { SubmitConfirmationModal } from '@/components/SubmitConfirmationModal';
import { ArrowLeft, ArrowRight, Clock, FileText, Save, Eye, Flag, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EssayExam() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [currentEssay, setCurrentEssay] = useState(1);
  const [essays, setEssays] = useState<{[key: number]: string}>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const totalEssays = 3;
  const timeRemaining = 78; // minutes

  const essayTopics = [
    {
      id: 1,
      title: "Argumentative Essay",
      topic: "The Role of Technology in Education",
      prompt: `Some people believe that technology has greatly improved education by making learning more accessible and interactive. Others argue that excessive use of technology in classrooms distracts students and reduces face-to-face interaction with teachers and peers.

Write an argumentative essay discussing both sides of this issue. Take a clear position on whether technology has been more beneficial or harmful to education, and support your argument with specific examples and reasoning.

Your essay should be 300-400 words and include:
• A clear thesis statement
• At least two main supporting arguments
• Consideration of the opposing viewpoint
• A strong conclusion`,
      minWords: 300,
      maxWords: 400
    },
    {
      id: 2,
      title: "Descriptive Essay",
      topic: "A Place That Changed Your Perspective",
      prompt: `Think of a place you have visited that significantly changed your perspective on life, culture, or yourself. This could be a country, city, natural location, or even a building.

Write a descriptive essay about this place and explain how it influenced your thinking. Use vivid sensory details to help the reader understand what made this place special and transformative.

Your essay should be 250-350 words and include:
• Detailed descriptions using sensory language
• Clear explanation of how the place affected you
• Specific examples or moments that were meaningful
• Reflective conclusion about the lasting impact`,
      minWords: 250,
      maxWords: 350
    },
    {
      id: 3,
      title: "Opinion Essay",
      topic: "The Future of Work",
      prompt: `As artificial intelligence and automation continue to develop, many jobs traditionally done by humans are being replaced by machines. Some experts predict that this will create new opportunities and improve quality of life, while others worry about widespread unemployment and social disruption.

Write an opinion essay expressing your views on how artificial intelligence and automation will affect the future of work. Discuss what changes you think will occur and how society should prepare for them.

Your essay should be 350-450 words and include:
• Your clear opinion on the topic
• At least three specific predictions or recommendations
• Examples to support your points
• Discussion of potential challenges and solutions`,
      minWords: 350,
      maxWords: 450
    }
  ];

  const currentEssayData = essayTopics[currentEssay - 1];
  const currentText = essays[currentEssay] || "";
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;

  const handleTextChange = (value: string) => {
    setEssays({...essays, [currentEssay]: value});
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Exam Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                  <FileText className="h-6 w-6" />
                  <span>Essay Writing Test</span>
                </h1>
                <p className="text-muted-foreground">Section 3: Extended Writing Tasks</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
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
                Essay {currentEssay} of {totalEssays}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round((currentEssay / totalEssays) * 100)}%</span>
            </div>
            <Progress value={(currentEssay / totalEssays) * 100} className="h-2" />
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
            {/* Essay Prompt */}
            <Card className="shadow-bronze h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{currentEssayData.title}</div>
                    <div className="text-sm text-muted-foreground font-normal">{currentEssayData.topic}</div>
                  </div>
                  <Badge variant="secondary">
                    {currentEssayData.minWords}-{currentEssayData.maxWords} words
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                    {currentEssayData.prompt}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Writing Area */}
            <div className="space-y-6">
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>Essay {currentEssay}: {currentEssayData.title}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isPreviewMode ? 'Edit' : 'Preview'}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Flag for Review
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPreviewMode ? (
                    <div className="min-h-[400px] p-4 border border-border rounded-md bg-accent/20">
                      <div className="prose prose-sm max-w-none">
                        {currentText ? (
                          <div className="whitespace-pre-wrap text-foreground">
                            {currentText}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">No content written yet...</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Textarea 
                      value={currentText}
                      onChange={(e) => handleTextChange(e.target.value)}
                      placeholder={`Begin writing your ${currentEssayData.title.toLowerCase()} here...`}
                      rows={18}
                      className="text-base leading-relaxed resize-none"
                    />
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className={`${
                        wordCount < currentEssayData.minWords ? 'text-red-500' :
                        wordCount > currentEssayData.maxWords ? 'text-red-500' :
                        'text-green-600'
                      }`}>
                        Words: {wordCount}
                      </span>
                      <span className="text-muted-foreground">
                        Target: {currentEssayData.minWords}-{currentEssayData.maxWords}
                      </span>
                      <span className="text-muted-foreground">
                        Characters: {currentText.length}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Auto-save
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="shadow-bronze">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
                    <Button 
                      variant="outline" 
                      disabled={currentEssay === 1}
                      onClick={() => setCurrentEssay(Math.max(1, currentEssay - 1))}
                      className="w-full lg:w-auto order-1 lg:order-1"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous Essay
                    </Button>

                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto order-3 lg:order-2">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Save Draft
                      </Button>
                      <Button variant="default" className="w-full sm:w-auto">
                        Save & Continue
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
                      disabled={currentEssay === totalEssays}
                      onClick={() => setCurrentEssay(Math.min(totalEssays, currentEssay + 1))}
                      className="w-full lg:w-auto order-2 lg:order-3"
                    >
                      Next Essay
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Essay Overview */}
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="text-base">Essay Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {essayTopics.map((essay) => {
                      const hasContent = essays[essay.id] && essays[essay.id].trim().length > 0;
                      const words = hasContent ? essays[essay.id].trim().split(/\s+/).length : 0;
                      
                      return (
                        <div
                          key={essay.id}
                          className={`p-3 border border-border rounded-lg cursor-pointer transition-colors ${
                            essay.id === currentEssay ? 'bg-primary/10 border-primary' : ''
                          }`}
                          onClick={() => setCurrentEssay(essay.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{essay.title}</div>
                              <div className="text-xs text-muted-foreground">{essay.topic}</div>
                            </div>
                            <div className="text-right">
                              <Badge variant={hasContent ? "default" : "secondary"}>
                                {words} words
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Section */}
              <Card className="shadow-bronze">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ready to submit all your essays?
                    </p>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => setShowSubmitModal(true)}
                    >
                      Submit Essay Section
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Warning: You cannot modify your essays after submission
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
        sectionName="Essay"
      />
    </div>
  );
}