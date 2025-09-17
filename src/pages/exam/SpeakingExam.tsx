import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { SubmitConfirmationModal } from '@/components/SubmitConfirmationModal';
import { ArrowLeft, ArrowRight, Clock, Mic, MicOff, Video, VideoOff, Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SpeakingExam() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const totalQuestions = 15;
  const timeRemaining = 28; // minutes

  const speakingQuestions = [
    {
      id: 1,
      section: "Self Introduction",
      question: "Please introduce yourself. Tell me about your name, age, grade, and your favorite subjects in school.",
      preparationTime: 30,
      responseTime: 60,
      type: "personal"
    },
    {
      id: 2,
      section: "Topic Discussion",
      question: "Describe your favorite hobby. What do you enjoy about it? How often do you do it? Would you recommend it to other students? Why or why not?",
      preparationTime: 45,
      responseTime: 90,
      type: "descriptive"
    },
    {
      id: 3,
      section: "Opinion Question",
      question: "Some people think students should wear school uniforms, while others believe students should be free to choose their own clothes. What is your opinion? Give specific reasons to support your answer.",
      preparationTime: 60,
      responseTime: 120,
      type: "opinion"
    },
    {
      id: 4,
      section: "Role Play",
      question: "Imagine you are at a restaurant with your family. You want to order food but the waiter doesn't speak your language very well. Practice ordering your meal and asking questions about the menu.",
      preparationTime: 45,
      responseTime: 90,
      type: "roleplay"
    }
  ];

  const currentQuestionData = speakingQuestions[Math.min(currentQuestion - 1, speakingQuestions.length - 1)];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
      // Start recording simulation
    }
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
                  <Mic className="h-6 w-6" />
                  <span>Speaking Test</span>
                </h1>
                <p className="text-muted-foreground">Section 4: Interactive Speaking Assessment</p>
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
            {/* Video Interface */}
            <Card className="shadow-bronze">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Video Interface</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden mb-4">
                  {isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <Video className="h-12 w-12" />
                        </div>
                        <p className="text-sm">Your video feed would appear here</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <VideoOff className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Camera is off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>REC {formatTime(recordingTime)}</span>
                    </div>
                  )}
                </div>

                {/* Media Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant={isMicOn ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsMicOn(!isMicOn)}
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={isRecording ? "destructive" : "default"}
                    onClick={toggleRecording}
                    className="px-6"
                  >
                    {isRecording ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  <Button
                    variant={isVideoOn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Audio Level Indicator */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Volume2 className="h-4 w-4" />
                    <span>Audio Level</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Panel */}
            <div className="space-y-6">
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">Question {currentQuestion}</div>
                      <Badge variant="secondary" className="mt-1">
                        {currentQuestionData.section}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {currentQuestionData.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-accent/30 rounded-lg">
                    <p className="font-medium text-foreground">
                      {currentQuestionData.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="font-medium text-blue-600">Preparation Time</div>
                      <div>{currentQuestionData.preparationTime} seconds</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="font-medium text-green-600">Response Time</div>
                      <div>{currentQuestionData.responseTime} seconds</div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <h4 className="font-medium text-sm mb-2">Instructions:</h4>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• You will have {currentQuestionData.preparationTime} seconds to prepare your answer</li>
                      <li>• You will have {currentQuestionData.responseTime} seconds to record your response</li>
                      <li>• Speak clearly and look at the camera</li>
                      <li>• You can record your answer only once</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Timer Card */}
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="text-base">Response Timer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-mono font-bold text-primary">
                      {formatTime(currentQuestionData.responseTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time allocated for this response
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        타이머 시작
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="shadow-bronze">
                <CardContent className="pt-6">
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
                </CardContent>
              </Card>

              {/* Question Overview */}
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="text-base">Speaking Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Self Introduction", "Topic Discussion", "Opinion Questions", "Role Play"].map((section, index) => {
                      const questionsInSection = Math.ceil(totalQuestions / 4);
                      const sectionStart = index * questionsInSection + 1;
                      const sectionEnd = Math.min((index + 1) * questionsInSection, totalQuestions);
                      const isCurrentSection = currentQuestion >= sectionStart && currentQuestion <= sectionEnd;
                      
                      return (
                        <div key={section} className={`p-3 border border-border rounded ${isCurrentSection ? 'bg-primary/10 border-primary' : ''}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{section}</span>
                            <Badge variant={isCurrentSection ? "default" : "secondary"}>
                              Questions {sectionStart}-{sectionEnd}
                            </Badge>
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
                      Ready to submit your Speaking section?
                    </p>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => setShowSubmitModal(true)}
                    >
                      Submit Speaking Section
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Warning: You cannot re-record your responses after submission
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
        sectionName="Speaking"
      />
    </div>
  );
}