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
import { ArrowLeft, User, Clock, FileText, Brain, GraduationCap, CheckCircle, Save, Play, Pause, Volume2, SkipBack, SkipForward, Video, Mic } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ManualGrading() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [manualScore, setManualScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [videCurrentTime, setVideoCurrentTime] = useState(0);
  const [audioVolume, setAudioVolume] = useState(1);
  const [videoVolume, setVideoVolume] = useState(1);

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  // Mock data - in real app this would come from API
  const getGradingDataByType = (id: string) => {
    const baseStudent = {
      name: "김민수",
      schoolSystem: "korea",
      grade: "중2", 
      studentId: "2024001"
    };

    const gradingDataTypes = {
      "1": { // Essay
        id: id,
        student: baseStudent,
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
      },
      "2": { // Speaking
        id: id,
        student: { ...baseStudent, name: "이지은", grade: "고1" },
        exam: {
          title: "Speaking Test - Level 3",
          category: "Speaking",
          maxScore: 100,
          timeLimit: "30분"
        },
        question: {
          number: 1,
          text: "다음 상황에 대해 2-3분간 영어로 말해보세요.\n\n상황: You are introducing your hometown to a foreign friend who is visiting Korea for the first time.\n\n포함할 내용:\n- 고향의 위치와 특징\n- 유명한 장소나 음식\n- 방문을 추천하는 이유\n- 외국인 친구에게 주고 싶은 조언",
          type: "speaking",
          maxScore: 100
        },
        studentAnswer: {
          content: "음성 답변 (2분 35초)\n\n전사된 내용:\n\"Hello! I'm so excited to introduce my hometown to you. I live in Busan, which is located in the southeastern part of Korea. It's the second largest city in Korea and it's famous for its beautiful beaches.\n\nOne of the most popular places you should visit is Haeundae Beach. The sand is really soft and the water is clean. You can also try our famous food called 'milmyeon' which is cold noodles. It's perfect for hot summer days. Another place I recommend is Gamcheon Culture Village. It's very colorful and you can take amazing photos there.\n\nI think you should visit Busan because it has both modern city life and traditional Korean culture. The people are very friendly and the seafood is incredibly fresh. My advice for you is to try local street food at Jagalchi Fish Market and don't forget to watch the sunrise at the beach.\"",
          wordCount: null,
          submittedAt: "2024-01-16 13:45:20",
          timeSpent: "25분",
          audioLength: "2분 35초"
        },
        aiGrading: {
          totalScore: 85,
          breakdown: {
            pronunciation: { score: 20, maxScore: 25, comment: "발음이 명확하고 이해하기 쉬움" },
            fluency: { score: 22, maxScore: 25, comment: "자연스러운 발화, 약간의 망설임 있음" },
            vocabulary: { score: 21, maxScore: 25, comment: "적절하고 다양한 어휘 사용" },
            grammar: { score: 22, maxScore: 25, comment: "문법적으로 정확하고 구조가 좋음" }
          },
          feedback: "전반적으로 우수한 스피킹 실력을 보여줍니다. 주제에 대해 체계적으로 설명했고, 구체적인 예시를 들어 설득력을 높였습니다. 발음과 유창성 모두 좋은 수준이며, 청자를 배려한 표현을 사용했습니다.",
          gradedAt: "2024-01-16 14:10:15"
        }
      },
      "3": { // Reading
        id: id,
        student: { ...baseStudent, name: "박상현", schoolSystem: "usa", grade: "Grade 8" },
        exam: {
          title: "영어 중간고사 - 2학년",
          category: "Reading",
          maxScore: 100,
          timeLimit: "50분"
        },
        question: {
          number: 1,
          text: "다음 글을 읽고 물음에 답하시오.\n\n[Reading Passage]\nClimate change is one of the most pressing issues of our time. The Earth's average temperature has risen by approximately 1.1 degrees Celsius since the late 19th century. This warming is primarily caused by human activities, particularly the burning of fossil fuels, which releases greenhouse gases into the atmosphere.\n\nThe effects of climate change are already visible around the world. Arctic ice is melting at an alarming rate, sea levels are rising, and extreme weather events are becoming more frequent and severe. These changes pose serious threats to ecosystems, human health, and economic stability.\n\nHowever, there is still hope. Many countries are taking action to reduce greenhouse gas emissions. Renewable energy sources like solar and wind power are becoming more affordable and widespread. Individual actions, such as using public transportation and reducing energy consumption, can also make a difference.\n\n[Questions]\n1. What is the main cause of current climate change?\n2. List three effects of climate change mentioned in the passage.\n3. What solutions does the author suggest to address climate change?\n4. In your opinion, what is the most effective way to combat climate change? Explain your reasoning.",
          type: "reading",
          maxScore: 100
        },
        studentAnswer: {
          content: "1. The main cause of current climate change is human activities, especially burning fossil fuels that release greenhouse gases into the atmosphere.\n\n2. Three effects of climate change are:\n- Arctic ice melting at a fast rate\n- Sea levels rising\n- Extreme weather events becoming more frequent and severe\n\n3. The author suggests several solutions:\n- Countries reducing greenhouse gas emissions\n- Using renewable energy sources like solar and wind power\n- Individual actions like using public transportation and reducing energy consumption\n\n4. In my opinion, the most effective way to combat climate change is developing and using renewable energy sources. I think this because fossil fuels are the main cause of the problem, so replacing them with clean energy like solar and wind power will have the biggest impact. Also, renewable energy is becoming cheaper, so more people and countries will want to use it.",
          wordCount: 138,
          submittedAt: "2024-01-16 12:15:30",
          timeSpent: "35분"
        },
        aiGrading: {
          totalScore: 88,
          breakdown: {
            comprehension: { score: 23, maxScore: 25, comment: "지문 내용을 정확히 이해하고 답변함" },
            accuracy: { score: 22, maxScore: 25, comment: "질문에 대한 정확하고 완전한 답변" },
            analysis: { score: 21, maxScore: 25, comment: "개인 의견을 논리적으로 설명함" },
            language: { score: 22, maxScore: 25, comment: "명확하고 적절한 영어 표현 사용" }
          },
          feedback: "독해 능력이 뛰어납니다. 지문의 주요 내용을 정확히 파악했고, 세부 정보도 빠뜨리지 않고 답변했습니다. 특히 마지막 주관식 문제에서 자신의 의견을 논리적 근거와 함께 제시한 점이 좋습니다.",
          gradedAt: "2024-01-16 12:20:45"
        }
      }
    };

    return gradingDataTypes[id as keyof typeof gradingDataTypes] || gradingDataTypes["1"];
  };

  const gradingData = getGradingDataByType(gradeId || "1");

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

  const handleAudioPlayPause = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // In real implementation, this would control actual audio element
  };

  const handleVideoPlayPause = () => {
    setIsVideoPlaying(!isVideoPlaying);
    // In real implementation, this would control actual video element
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              {/* Speaking 카테고리일 때 미디어 플레이어 추가 */}
              {gradingData.exam.category === 'Speaking' && (
                <div className="space-y-4 mb-6">
                  {/* Audio Player */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Mic className="h-5 w-5 text-primary" />
                        <span className="font-medium">음성 녹음</span>
                        <Badge variant="outline" className="text-xs">
                          {(gradingData.studentAnswer as any).audioLength}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAudioPlayPause}
                        className="flex items-center space-x-1"
                      >
                        {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span>{isAudioPlaying ? '일시정지' : '재생'}</span>
                      </Button>
                      
                      <div className="flex-1 bg-muted rounded-full h-2 relative">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(audioCurrentTime / 155) * 100}%` }}
                        />
                      </div>
                      
                      <span className="text-sm text-muted-foreground min-w-[60px]">
                        {formatTime(audioCurrentTime)} / 2:35
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <div className="w-16 bg-muted rounded-full h-2 relative">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${audioVolume * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Button variant="ghost" size="sm">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Video className="h-5 w-5 text-primary" />
                        <span className="font-medium">영상 녹화</span>
                        <Badge variant="outline" className="text-xs">
                          {(gradingData.studentAnswer as any).audioLength}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Video Preview Area */}
                    <div className="bg-black/10 border-2 border-dashed border-muted-foreground/30 rounded-lg h-48 flex items-center justify-center mb-3">
                      <div className="text-center">
                        <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">영상 미리보기</p>
                        <p className="text-xs text-muted-foreground">화질: 720p | 크기: 15.2MB</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVideoPlayPause}
                        className="flex items-center space-x-1"
                      >
                        {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span>{isVideoPlaying ? '일시정지' : '재생'}</span>
                      </Button>
                      
                      <div className="flex-1 bg-muted rounded-full h-2 relative">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(videCurrentTime / 155) * 100}%` }}
                        />
                      </div>
                      
                      <span className="text-sm text-muted-foreground min-w-[60px]">
                        {formatTime(videCurrentTime)} / 2:35
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <div className="w-16 bg-muted rounded-full h-2 relative">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${videoVolume * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="whitespace-pre-line text-foreground">
                  {gradingData.studentAnswer.content}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {gradingData.exam.category === 'Speaking' ? (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>음성 길이: {(gradingData.studentAnswer as any).audioLength}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>단어 수: {gradingData.studentAnswer.wordCount}</span>
                  </div>
                )}
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