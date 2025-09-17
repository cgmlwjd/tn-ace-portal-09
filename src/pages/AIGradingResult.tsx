import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, User, Brain, CheckCircle, Edit, Clock, FileText, Video, Mic } from 'lucide-react';

export default function AIGradingResult() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  // AI 채점 결과 더미 데이터
  const getAIResultByType = (id: string) => {
    const aiResults = {
      "1": {
        student: { name: "김민수", grade: "중2", schoolSystem: "korea" },
        exam: { title: "영어 중간고사 - 2학년", category: "Essay" },
        question: { number: 1, maxScore: 100 },
        aiGrading: {
          totalScore: 78,
          breakdown: {
            content: { score: 20, maxScore: 25, comment: "주제에 적합하고 개인적인 경험이 잘 반영됨" },
            organization: { score: 18, maxScore: 25, comment: "논리적 구성이 좋으나 결론 부분이 약함" },
            vocabulary: { score: 20, maxScore: 25, comment: "적절한 어휘 사용, 다양성 부족" },
            grammar: { score: 20, maxScore: 25, comment: "문법적 오류 몇 개 발견, 전반적으로 양호" }
          },
          feedback: "전반적으로 잘 작성된 에세이입니다. 주제에 대한 이해도가 높고 개인적인 목표가 명확하게 드러납니다. 다만 단어 수가 요구사항(150-200단어)에 약간 부족하고, 결론 부분을 더 강화할 필요가 있습니다.",
          gradedAt: "2024-01-16 14:35:12",
          processingTime: "3.2초"
        },
        studentAnswer: {
          content: "My future dream is to become a doctor. I have always been interested in helping people and making them feel better when they are sick...",
          wordCount: 142,
          submittedAt: "2024-01-16 14:30:25"
        }
      },
      "2": {
        student: { name: "이지은", grade: "고1", schoolSystem: "korea" },
        exam: { title: "Speaking Test - Level 3", category: "Speaking" },
        question: { number: 1, maxScore: 100 },
        aiGrading: {
          totalScore: 85,
          breakdown: {
            pronunciation: { score: 20, maxScore: 25, comment: "발음이 명확하고 이해하기 쉬움" },
            fluency: { score: 22, maxScore: 25, comment: "자연스러운 발화, 약간의 망설임 있음" },
            vocabulary: { score: 21, maxScore: 25, comment: "적절하고 다양한 어휘 사용" },
            grammar: { score: 22, maxScore: 25, comment: "문법적으로 정확하고 구조가 좋음" }
          },
          feedback: "전반적으로 우수한 스피킹 실력을 보여줍니다. 주제에 대해 체계적으로 설명했고, 구체적인 예시를 들어 설득력을 높였습니다.",
          gradedAt: "2024-01-16 14:10:15",
          processingTime: "5.7초"
        },
        studentAnswer: {
          content: "음성 답변 (2분 35초) - 전사된 내용: Hello! I'm so excited to introduce my hometown to you...",
          audioLength: "2분 35초",
          submittedAt: "2024-01-16 13:45:20"
        }
      },
      "3": {
        student: { name: "박상현", grade: "Grade 8", schoolSystem: "usa" },
        exam: { title: "영어 중간고사 - 2학년", category: "Reading" },
        question: { number: 1, maxScore: 100 },
        aiGrading: {
          totalScore: 88,
          breakdown: {
            comprehension: { score: 23, maxScore: 25, comment: "지문 내용을 정확히 이해하고 답변함" },
            accuracy: { score: 22, maxScore: 25, comment: "질문에 대한 정확하고 완전한 답변" },
            analysis: { score: 21, maxScore: 25, comment: "개인 의견을 논리적으로 설명함" },
            language: { score: 22, maxScore: 25, comment: "명확하고 적절한 영어 표현 사용" }
          },
          feedback: "독해 능력이 뛰어납니다. 지문의 주요 내용을 정확히 파악했고, 세부 정보도 빠뜨리지 않고 답변했습니다.",
          gradedAt: "2024-01-16 12:20:45",
          processingTime: "2.1초"
        },
        studentAnswer: {
          content: "1. The main cause of current climate change is human activities, especially burning fossil fuels...",
          wordCount: 138,
          submittedAt: "2024-01-16 12:15:30"
        }
      },
      "4": {
        student: { name: "최수빈", grade: "고2", schoolSystem: "korea" },
        exam: { title: "영어 종합 평가", category: "Reading+Writing+Speaking" },
        question: { number: 1, maxScore: 300 },
        aiGrading: {
          totalScore: 245,
          breakdown: {
            reading: { score: 85, maxScore: 100, comment: "독해 능력이 우수하며 세부 내용 파악이 정확함" },
            writing: { score: 78, maxScore: 100, comment: "문법과 어휘 사용이 적절하나 구성력 향상 필요" },
            speaking: { score: 82, maxScore: 100, comment: "발음과 유창성이 좋으나 어휘 다양성 부족" }
          },
          feedback: "전반적으로 균형 잡힌 영어 실력을 보여줍니다. 특히 독해와 말하기 영역에서 우수한 성과를 거두었으며, 쓰기 영역의 구성력을 보완하면 더욱 향상될 것입니다.",
          gradedAt: "2024-01-17 09:20:30",
          processingTime: "8.4초"
        },
        studentAnswer: {
          content: "종합 답안 - Reading: 지문 분석 완료, Writing: 에세이 작성, Speaking: 2분 40초 음성 답변",
          wordCount: null,
          submittedAt: "2024-01-17 09:15:10"
        }
      },
      "5": {
        student: { name: "정하늘", grade: "Grade 10", schoolSystem: "usa" },
        exam: { title: "English Comprehensive Test", category: "Essay+Speaking" },
        question: { number: 1, maxScore: 200 },
        aiGrading: {
          totalScore: 168,
          breakdown: {
            essay: { score: 85, maxScore: 100, comment: "논리적 구성과 창의적 아이디어가 돋보임" },
            speaking: { score: 83, maxScore: 100, comment: "자연스러운 표현과 정확한 발음이 인상적" }
          },
          feedback: "창의성과 논리성을 겸비한 우수한 답안입니다. 에세이의 구성력과 스피킹의 자연스러움이 특히 뛰어나며, 고급 어휘 활용도 돋보입니다.",
          gradedAt: "2024-01-17 10:35:22",
          processingTime: "6.7초"
        },
        studentAnswer: {
          content: "Essay: 180단어 에세이 + Speaking: 3분 15초 음성 답변",
          wordCount: 180,
          audioLength: "3분 15초",
          submittedAt: "2024-01-17 10:30:45"
        }
      },
      "7": {
        student: { name: "김서연", grade: "중3", schoolSystem: "korea" },
        exam: { title: "통합 영어 평가", category: "Writing+Essay+Speaking" },
        question: { number: 1, maxScore: 300 },
        aiGrading: {
          totalScore: 238,
          breakdown: {
            writing: { score: 78, maxScore: 100, comment: "문법 정확도가 높고 표현이 자연스러움" },
            essay: { score: 82, maxScore: 100, comment: "논증 구조가 명확하고 설득력이 있음" },
            speaking: { score: 78, maxScore: 100, comment: "발음은 좋으나 유창성 개선이 필요" }
          },
          feedback: "전 영역에서 고른 실력을 보여주는 우수한 답안입니다. 특히 에세이 작성 능력이 뛰어나며, 스피킹 영역의 유창성을 더 키운다면 완벽할 것입니다.",
          gradedAt: "2024-01-17 14:25:18",
          processingTime: "9.1초"
        },
        studentAnswer: {
          content: "Writing: 단답형+서술형 답안, Essay: 200단어 에세이, Speaking: 2분 50초 음성 답변",
          wordCount: 200,
          audioLength: "2분 50초",
          submittedAt: "2024-01-17 14:20:35"
        }
      }
    };

    return aiResults[id as keyof typeof aiResults] || aiResults["1"];
  };

  const resultData = getAIResultByType(gradeId || "1");

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
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI 채점 결과</h1>
                <p className="text-muted-foreground">자동 채점이 완료되었습니다</p>
              </div>
            </div>
          </div>

          {/* Processing Info */}
          <Card className="shadow-bronze mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-foreground">AI 채점 완료</p>
                    <p className="text-sm text-muted-foreground">
                      처리시간: {resultData.aiGrading.processingTime} | 채점시간: {resultData.aiGrading.gradedAt}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 text-lg px-4 py-2">
                  {resultData.aiGrading.totalScore}/{resultData.question.maxScore}점
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>학생 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">학생명</p>
                  <p className="font-semibold">{resultData.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">학제-학년</p>
                  <Badge variant="secondary">
                    {resultData.student.schoolSystem === 'korea' ? '한국' : 
                     resultData.student.schoolSystem === 'usa' ? '미국' : '영국'}-{resultData.student.grade}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">시험명</p>
                  <p className="font-semibold">{resultData.exam.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Grading Breakdown */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI 세부 채점 결과</span>
                <Badge variant="outline">{resultData.exam.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(resultData.aiGrading.breakdown).map(([key, item]) => (
                    <div key={key} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">
                          {key === 'content' ? '내용' :
                           key === 'organization' ? '구성' :
                           key === 'vocabulary' ? '어휘' :
                           key === 'grammar' ? '문법' :
                           key === 'pronunciation' ? '발음' :
                           key === 'fluency' ? '유창성' :
                           key === 'comprehension' ? '이해도' :
                           key === 'accuracy' ? '정확성' :
                           key === 'analysis' ? '분석력' :
                           key === 'language' ? '언어사용' : key}
                        </span>
                        <Badge variant="outline" className="font-bold">
                          {item.score}/{item.maxScore}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.comment}</p>
                      
                      {/* Progress bar */}
                      <div className="mt-2 w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* AI Feedback */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">AI 종합 평가</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{resultData.aiGrading.feedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Answer Preview */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {resultData.exam.category.includes('Speaking') ? <Mic className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                <span>학생 답안 미리보기</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Speaking 카테고리가 포함된 경우 미디어 플레이어 추가 */}
              {resultData.exam.category.includes('Speaking') && (
                <div className="space-y-4 mb-6">
                  {/* Audio Player */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Mic className="h-5 w-5 text-primary" />
                        <span className="font-medium">음성 녹음</span>
                        <Badge variant="outline" className="text-xs">
                          {(resultData.studentAnswer as any).audioLength || "2분 35초"}
                        </Badge>
                      </div>
                    </div>
                    
                    <audio 
                      controls 
                      className="w-full"
                      src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                    >
                      브라우저가 오디오를 지원하지 않습니다.
                    </audio>
                  </div>

                  {/* Video Player */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Video className="h-5 w-5 text-primary" />
                        <span className="font-medium">영상 녹화</span>
                        <Badge variant="outline" className="text-xs">
                          {(resultData.studentAnswer as any).audioLength || "2분 35초"}
                        </Badge>
                      </div>
                    </div>
                    
                    <video 
                      controls 
                      className="w-full rounded-lg"
                      style={{ maxHeight: '300px' }}
                      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xODUgODBWMTQ1TDIzMCAxMTIuNUwxODUgODBaIiBmaWxsPSIjNkI3Mjg0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTY1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QjcyODQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuuwmOuLueqwkOuPheuztOq4sDwvdGV4dD4KPHN2Zz4="
                    >
                      <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                      브라우저가 비디오를 지원하지 않습니다.
                    </video>
                  </div>
                </div>
              )}
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="whitespace-pre-line text-foreground text-sm">
                  {resultData.studentAnswer.content.length > 200 
                    ? `${resultData.studentAnswer.content.substring(0, 200)}...` 
                    : resultData.studentAnswer.content}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {resultData.exam.category.includes('Speaking') ? (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>음성 길이: {(resultData.studentAnswer as any).audioLength || "2분 35초"}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>단어 수: {(resultData.studentAnswer as any).wordCount}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>제출시간: {resultData.studentAnswer.submittedAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              size="lg"
              onClick={() => navigate(`/teacher/grading/${gradeId}`)}
              className="flex-1"
            >
              <Edit className="h-5 w-5 mr-2" />
              수동 채점 하러가기
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/teacher')}
              className="flex-1"
            >
              대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}