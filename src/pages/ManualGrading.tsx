import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, User, Clock, FileText, Brain, GraduationCap, CheckCircle, Save, Video, Mic, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ManualGrading() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [manualScores, setManualScores] = useState<{[categoryQuestion: string]: string}>({});
  const [feedbacks, setFeedbacks] = useState<{[categoryQuestion: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Mock data - in real app this would come from API
  const getGradingDataByType = (id: string) => {
    const baseStudent = {
      name: "최수빈",
      schoolSystem: "korea",
      grade: "고2", 
      studentId: "2024001"
    };

    const gradingDataTypes = {
      "4": {
        id: id,
        student: baseStudent,
        exam: {
          title: "영어 종합 평가",
          category: "Reading+Writing+Speaking",
          totalMaxScore: 300,
          timeLimit: "120분"
        },
        categories: {
          "Reading": {
            questions: [
              {
                number: 1,
                text: "다음 글을 읽고 물음에 답하시오.\n\n[Reading Passage]\nClimate change is one of the most pressing issues...",
                maxScore: 50,
                aiGrading: {
                  score: 42,
                  breakdown: {
                    comprehension: { score: 23, maxScore: 25, comment: "지문 내용을 정확히 이해함" },
                    accuracy: { score: 19, maxScore: 25, comment: "대부분 정확한 답변" }
                  },
                  feedback: "독해 능력이 우수합니다. 주요 내용을 정확히 파악했습니다.",
                  gradedAt: "2024-01-17 09:18:30"
                },
                studentAnswer: {
                  content: "1. The main cause of climate change is human activities, especially burning fossil fuels...",
                  wordCount: 85,
                  submittedAt: "2024-01-17 09:15:10",
                  timeSpent: "15분"
                }
              },
              {
                number: 2, 
                text: "다음 빈칸에 들어갈 가장 적절한 것을 고르시오.\n\nThe concept of artificial intelligence has been around...",
                maxScore: 50,
                aiGrading: {
                  score: 43,
                  breakdown: {
                    comprehension: { score: 22, maxScore: 25, comment: "문맥 파악이 정확함" },
                    accuracy: { score: 21, maxScore: 25, comment: "논리적 추론이 뛰어남" }
                  },
                  feedback: "문맥을 정확히 이해하고 논리적으로 추론했습니다.",
                  gradedAt: "2024-01-17 09:19:15"
                },
                studentAnswer: {
                  content: "정답: ③ However, recent developments have shown that AI can significantly improve educational outcomes...",
                  wordCount: 45,
                  submittedAt: "2024-01-17 09:16:22",
                  timeSpent: "8분"
                }
              }
            ]
          },
          "Writing": {
            questions: [
              {
                number: 1,
                text: "다음 주제로 100-150단어의 글을 작성하시오.\n\n주제: 'The Benefits of Learning a Second Language'",
                maxScore: 100,
                aiGrading: {
                  score: 78,
                  breakdown: {
                    content: { score: 19, maxScore: 25, comment: "주제에 적합한 내용" },
                    organization: { score: 20, maxScore: 25, comment: "논리적 구성이 우수" },
                    vocabulary: { score: 19, maxScore: 25, comment: "적절한 어휘 사용" },
                    grammar: { score: 20, maxScore: 25, comment: "문법적으로 정확" }
                  },
                  feedback: "주제를 잘 이해하고 논리적으로 구성했습니다. 어휘 다양성을 더 높이면 좋겠습니다.",
                  gradedAt: "2024-01-17 09:20:30"
                },
                studentAnswer: {
                  content: "Learning a second language offers numerous benefits in today's globalized world. First, it enhances cognitive abilities by improving memory and problem-solving skills. Research shows that bilingual individuals often perform better in multitasking and decision-making processes.\n\nSecond, learning another language opens up career opportunities. Many companies value employees who can communicate with international clients and partners. This skill can lead to promotions and higher salaries.\n\nFinally, it allows for deeper cultural understanding. When you learn a language, you also learn about the culture, traditions, and perspectives of its speakers. This broadens your worldview and makes you more empathetic towards others.",
                  wordCount: 135,
                  submittedAt: "2024-01-17 09:17:45",
                  timeSpent: "35분"
                }
              }
            ]
          },
          "Speaking": {
            questions: [
              {
                number: 1,
                text: "다음 질문에 대해 2-3분간 영어로 답변하시오.\n\n'Describe your ideal future career and explain why you want to pursue it.'",
                maxScore: 100,
                aiGrading: {
                  score: 82,
                  breakdown: {
                    pronunciation: { score: 21, maxScore: 25, comment: "발음이 명확하고 자연스러움" },
                    fluency: { score: 20, maxScore: 25, comment: "유창하지만 약간의 망설임 있음" },
                    vocabulary: { score: 20, maxScore: 25, comment: "적절한 어휘 사용" },
                    grammar: { score: 21, maxScore: 25, comment: "문법적으로 정확한 구조" }
                  },
                  feedback: "전반적으로 우수한 스피킹 실력을 보여줍니다. 자신의 목표를 명확하게 표현했습니다.",
                  gradedAt: "2024-01-17 09:22:18"
                },
                studentAnswer: {
                  content: "음성 답변 (2분 40초)\n\n전사된 내용:\n\"My ideal future career is to become a software engineer. I have always been fascinated by technology and how it can solve real-world problems. Programming allows me to be creative while also being logical and analytical.\n\nI want to work for a tech company that focuses on developing applications that can make people's lives easier. For example, I'm interested in creating educational apps that can help students learn more effectively or healthcare apps that can assist doctors in providing better patient care.\n\nThe reason I chose this career is because it combines my passion for problem-solving with my desire to make a positive impact on society. Technology is constantly evolving, so there will always be new challenges and opportunities to learn and grow.\"",
                  wordCount: null,
                  audioLength: "2분 40초",
                  submittedAt: "2024-01-17 09:19:30",
                  timeSpent: "45분"
                }
              }
            ]
          }
        }
      },
      "7": {
        id: id,
        student: { ...baseStudent, name: "김서연", grade: "중3" },
        exam: {
          title: "통합 영어 평가",
          category: "Writing+Essay+Speaking",
          totalMaxScore: 300,
          timeLimit: "100분"
        },
        categories: {
          "Writing": {
            questions: [
              {
                number: 1,
                text: "다음 빈칸을 적절한 단어로 채우시오.",
                maxScore: 25,
                aiGrading: {
                  score: 22,
                  breakdown: {
                    accuracy: { score: 22, maxScore: 25, comment: "정확한 답변" }
                  },
                  feedback: "문법 지식이 우수합니다.",
                  gradedAt: "2024-01-17 14:23:15"
                },
                studentAnswer: {
                  content: "1. has been 2. would have 3. might be 4. should have 5. will be",
                  wordCount: 15,
                  submittedAt: "2024-01-17 14:20:35",
                  timeSpent: "10분"
                }
              },
              {
                number: 2,
                text: "다음 문장을 영어로 번역하시오.",
                maxScore: 25,
                aiGrading: {
                  score: 20,
                  breakdown: {
                    accuracy: { score: 20, maxScore: 25, comment: "대부분 정확한 번역" }
                  },
                  feedback: "번역 실력이 좋습니다. 자연스러운 표현을 사용했습니다.",
                  gradedAt: "2024-01-17 14:24:22"
                },
                studentAnswer: {
                  content: "1. I have been studying English for three years.\n2. She would have come if she had known about the party.\n3. The book that I read yesterday was very interesting.",
                  wordCount: 25,
                  submittedAt: "2024-01-17 14:21:12",
                  timeSpent: "15분"
                }
              }
            ]
          },
          "Essay": {
            questions: [
              {
                number: 1,
                text: "다음 주제로 150-200단어의 에세이를 작성하시오.\n\n주제: 'My Dream School and Why'",
                maxScore: 100,
                aiGrading: {
                  score: 82,
                  breakdown: {
                    content: { score: 21, maxScore: 25, comment: "창의적이고 구체적인 내용" },
                    organization: { score: 20, maxScore: 25, comment: "논증 구조가 명확" },
                    vocabulary: { score: 20, maxScore: 25, comment: "적절한 어휘 선택" },
                    grammar: { score: 21, maxScore: 25, comment: "문법적으로 정확" }
                  },
                  feedback: "창의적인 아이디어와 명확한 논증 구조가 돋보입니다.",
                  gradedAt: "2024-01-17 14:25:18"
                },
                studentAnswer: {
                  content: "My dream school would be a place where creativity meets academic excellence. It would have modern facilities including science laboratories, art studios, and a well-equipped library with both physical books and digital resources.\n\nThe school would offer diverse programs that cater to different interests and talents. Students could choose from various subjects like robotics, music production, creative writing, and environmental science. Small class sizes would ensure personalized attention from teachers.\n\nMost importantly, my dream school would foster a supportive environment where students feel safe to express their ideas and make mistakes. There would be no strict uniform policies, allowing students to express their individuality while maintaining respect for others.",
                  wordCount: 195,
                  submittedAt: "2024-01-17 14:22:30",
                  timeSpent: "40분"
                }
              }
            ]
          },
          "Speaking": {
            questions: [
              {
                number: 1,
                text: "다음 질문에 대해 2-3분간 영어로 답변하시오.\n\n'What is your favorite hobby and how did you start it?'",
                maxScore: 100,
                aiGrading: {
                  score: 78,
                  breakdown: {
                    pronunciation: { score: 20, maxScore: 25, comment: "발음은 좋으나 억양 개선 필요" },
                    fluency: { score: 18, maxScore: 25, comment: "유창성 개선이 필요" },
                    vocabulary: { score: 20, maxScore: 25, comment: "적절한 어휘 사용" },
                    grammar: { score: 20, maxScore: 25, comment: "문법적으로 정확" }
                  },
                  feedback: "발음은 좋으나 유창성을 더 키우면 완벽할 것입니다.",
                  gradedAt: "2024-01-17 14:26:45"
                },
                studentAnswer: {
                  content: "음성 답변 (2분 50초)\n\n전사된 내용:\n\"My favorite hobby is drawing. I started it when I was seven years old. My grandmother gave me a set of colored pencils for my birthday, and I immediately fell in love with creating art.\n\nAt first, I only drew simple things like flowers and animals. But as I got older, I became more interested in drawing people and landscapes. I spend about two hours every day practicing my drawing skills.\n\nWhat I love most about drawing is that it helps me relax and express my emotions. When I'm stressed about school or other things, I can just sit down with my sketchbook and let my creativity flow. It's like meditation for me.\"",
                  wordCount: null,
                  audioLength: "2분 50초",
                  submittedAt: "2024-01-17 14:23:50",
                  timeSpent: "35분"
                }
              }
            ]
          }
        }
      }
    };

    return gradingDataTypes[id as keyof typeof gradingDataTypes] || gradingDataTypes["4"];
  };

  const gradingData = getGradingDataByType(gradeId || "4");

  const handleSubmit = async () => {
    // Check if all questions have scores
    let missingScores = [];
    
    Object.entries(gradingData.categories).forEach(([categoryName, categoryData]) => {
      categoryData.questions.forEach((question) => {
        const key = `${categoryName}-${question.number}`;
        if (!manualScores[key]) {
          missingScores.push(`${categoryName} ${question.number}번`);
        } else {
          const score = parseInt(manualScores[key]);
          if (isNaN(score) || score < 0 || score > question.maxScore) {
            missingScores.push(`${categoryName} ${question.number}번 (점수 범위 오류)`);
          }
        }
      });
    });
    
    if (missingScores.length > 0) {
      toast({
        title: "점수를 입력해주세요",
        description: `다음 문제들의 점수를 확인해주세요: ${missingScores.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setShowSubmitDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmitDialog(false);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "수동 채점 완료",
        description: "모든 문제의 채점 결과가 성공적으로 저장되었습니다.",
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
        <div className="max-w-6xl mx-auto">
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
                <p className="text-muted-foreground">카테고리별 문제별 학생 답안 검토 및 채점</p>
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
                  <p className="text-sm text-muted-foreground">총 문제 수</p>
                  <p className="text-sm">
                    {Object.values(gradingData.categories).reduce((total, cat) => total + cat.questions.length, 0)}문제
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories and Questions for Manual Grading */}
          {Object.entries(gradingData.categories).map(([categoryName, categoryData]) => (
            <Card key={categoryName} className="shadow-bronze mb-6">
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(categoryName)}
                >
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>{categoryName} 카테고리</span>
                    <Badge variant="outline">{categoryData.questions.length}문제</Badge>
                  </div>
                  {expandedCategories[categoryName] ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </CardTitle>
              </CardHeader>
              
              {(expandedCategories[categoryName] ?? true) && (
                <CardContent>
                  <div className="space-y-8">
                    {categoryData.questions.map((question, questionIndex) => {
                      const questionKey = `${categoryName}-${question.number}`;
                      
                      return (
                        <div key={questionIndex} className="border-2 border-border rounded-lg p-6">
                          {/* Question Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">
                              {categoryName} {question.number}번 문제
                            </h3>
                            <Badge variant="outline" className="text-sm">
                              배점: {question.maxScore}점
                            </Badge>
                          </div>

                          {/* Question Text */}
                          <Card className="mb-6">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                <FileText className="h-5 w-5" />
                                <span>문제</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="whitespace-pre-line text-foreground bg-muted/50 p-4 rounded-lg">
                                {question.text}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Student Answer */}
                          <Card className="mb-6">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                {categoryName === 'Speaking' ? <Mic className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                <span>학생 답안</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Speaking 카테고리일 때 미디어 플레이어 */}
                              {categoryName === 'Speaking' && (
                                <div className="space-y-4 mb-6">
                                  {/* Audio Player */}
                                  <div className="bg-muted/50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Mic className="h-5 w-5 text-primary" />
                                      <span className="font-medium">음성 녹음</span>
                                      <Badge variant="outline" className="text-xs">
                                        {(question.studentAnswer as any).audioLength}
                                      </Badge>
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
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Video className="h-5 w-5 text-primary" />
                                      <span className="font-medium">영상 녹화</span>
                                      <Badge variant="outline" className="text-xs">
                                        {(question.studentAnswer as any).audioLength}
                                      </Badge>
                                    </div>
                                    <video 
                                      controls 
                                      className="w-full rounded-lg"
                                      style={{ maxHeight: '300px' }}
                                      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xODUgODBWMTQ1TDIzMCAxMTIuNUwxODUgODBaIiBmaWxsPSIjNkI3Mjg0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTY1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QjcyODQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuuwmOuLueqwgOuPheuztOq4sDwvdGV4dD4KPHN2Zz4="
                                    >
                                      <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                                      브라우저가 비디오를 지원하지 않습니다.
                                    </video>
                                  </div>
                                </div>
                              )}
                              
                              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                                <div className="whitespace-pre-line text-foreground">
                                  {question.studentAnswer.content}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                {categoryName === 'Speaking' ? (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>음성 길이: {(question.studentAnswer as any).audioLength}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <FileText className="h-4 w-4" />
                                    <span>단어 수: {question.studentAnswer.wordCount}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>소요시간: {question.studentAnswer.timeSpent}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* AI Grading Results */}
                          <Card className="mb-6">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                <Brain className="h-5 w-5" />
                                <span>AI 채점 결과</span>
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  {question.aiGrading.score}/{question.maxScore}점
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {/* Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Object.entries(question.aiGrading.breakdown).map(([key, item]: [string, any]) => (
                                    <div key={key} className="border border-border rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium capitalize">
                                          {key === 'content' ? '내용' :
                                           key === 'organization' ? '구성' :
                                           key === 'vocabulary' ? '어휘' :
                                           key === 'grammar' ? '문법' :
                                           key === 'pronunciation' ? '발음' :
                                           key === 'fluency' ? '유창성' :
                                           key === 'comprehension' ? '이해도' :
                                           key === 'accuracy' ? '정확성' : key}
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
                                  <p className="text-sm text-blue-800 dark:text-blue-200">{question.aiGrading.feedback}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Manual Grading Form */}
                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-lg">
                                <CheckCircle className="h-5 w-5" />
                                <span>수동 채점</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <Label htmlFor={`manual-score-${questionKey}`}>
                                      점수 (0-{question.maxScore})
                                    </Label>
                                    <Input
                                      id={`manual-score-${questionKey}`}
                                      type="number"
                                      min="0"
                                      max={question.maxScore}
                                      value={manualScores[questionKey] || ''}
                                      onChange={(e) => setManualScores(prev => ({
                                        ...prev,
                                        [questionKey]: e.target.value
                                      }))}
                                      placeholder={`점수를 입력하세요 (최대 ${question.maxScore}점)`}
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <div className="text-sm text-muted-foreground">
                                      <p>AI 채점: {question.aiGrading.score}점</p>
                                      <p>차이: {manualScores[questionKey] ? 
                                        Math.abs(parseInt(manualScores[questionKey]) - question.aiGrading.score) : 0}점
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor={`feedback-${questionKey}`}>선생님 피드백</Label>
                                  <Textarea
                                    id={`feedback-${questionKey}`}
                                    value={feedbacks[questionKey] || ''}
                                    onChange={(e) => setFeedbacks(prev => ({
                                      ...prev,
                                      [questionKey]: e.target.value
                                    }))}
                                    placeholder={`${categoryName} ${question.number}번 문제에 대한 피드백을 작성해주세요...`}
                                    rows={3}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {/* 종합 피드백 */}
          <Card className="shadow-bronze mb-6">
            <CardHeader>
              <CardTitle>종합 피드백</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={feedbacks['general'] || ''}
                onChange={(e) => setFeedbacks(prev => ({
                  ...prev,
                  ['general']: e.target.value
                }))}
                placeholder="전체 시험에 대한 종합적인 피드백을 작성해주세요..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
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
      </main>

      <Footer />
      
      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>채점 완료 확인</AlertDialogTitle>
            <AlertDialogDescription>
              모든 문제의 채점을 완료하시겠습니까? 채점 완료 후에는 수정할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              완료
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}