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

  // Mock data with same structure as AI grading result
  const getGradingDataByType = (id: string) => {
    const gradingDataTypes = {
      "1": { // 단일 카테고리, 단일 문제
        id: id,
        student: { name: "김민수", grade: "중2", schoolSystem: "korea", studentId: "2024001" },
        exam: { title: "영어 에세이 평가", category: "Essay", totalMaxScore: 100, timeLimit: "60분" },
        categories: {
          "Essay": {
            questions: [
              {
                number: 1,
                text: "다음 주제에 대해 150-200단어로 영어 에세이를 작성하시오.\n\n주제: \"My Future Dream and How to Achieve It\"\n\n- 자신의 미래 꿈이 무엇인지 명확히 서술하시오\n- 그 꿈을 이루기 위한 구체적인 계획을 제시하시오\n- 과정에서 예상되는 어려움과 극복 방법을 언급하시오",
                maxScore: 100,
                aiGrading: {
                  score: 78,
                  breakdown: {
                    content: { score: 20, maxScore: 25, comment: "주제에 적합하고 개인적인 경험이 잘 반영됨" },
                    organization: { score: 18, maxScore: 25, comment: "논리적 구성이 좋으나 결론 부분이 약함" },
                    vocabulary: { score: 20, maxScore: 25, comment: "적절한 어휘 사용, 다양성 부족" },
                    grammar: { score: 20, maxScore: 25, comment: "문법적 오류 몇 개 발견, 전반적으로 양호" }
                  },
                  feedback: "전반적으로 잘 작성된 에세이입니다. 주제에 대한 이해도가 높고 개인적인 목표가 명확하게 드러납니다.",
                  gradedAt: "2024-01-16 14:35:12"
                },
                studentAnswer: {
                  content: "My future dream is to become a doctor. I have always been interested in helping people and making them feel better when they are sick...",
                  wordCount: 142,
                  submittedAt: "2024-01-16 14:30:25",
                  timeSpent: "45분"
                }
              }
            ]
          }
        }
      },
      "2": { // 단일 카테고리, 단일 문제 (Speaking)
        id: id,
        student: { name: "이지은", grade: "고1", schoolSystem: "korea", studentId: "2024002" },
        exam: { title: "영어 말하기 평가", category: "Speaking", totalMaxScore: 100, timeLimit: "30분" },
        categories: {
          "Speaking": {
            questions: [
              {
                number: 1,
                text: "다음 상황에 대해 2-3분간 영어로 말해보세요.\n\n상황: You are introducing your hometown to a foreign friend who is visiting Korea for the first time.\n\n포함할 내용:\n- 고향의 위치와 특징\n- 유명한 장소나 음식\n- 방문을 추천하는 이유",
                maxScore: 100,
                aiGrading: {
                  score: 85,
                  breakdown: {
                    pronunciation: { score: 20, maxScore: 25, comment: "발음이 명확하고 이해하기 쉬움" },
                    fluency: { score: 22, maxScore: 25, comment: "자연스러운 발화, 약간의 망설임 있음" },
                    vocabulary: { score: 21, maxScore: 25, comment: "적절하고 다양한 어휘 사용" },
                    grammar: { score: 22, maxScore: 25, comment: "문법적으로 정확하고 구조가 좋음" }
                  },
                  feedback: "전반적으로 우수한 스피킹 실력을 보여줍니다. 주제에 대해 체계적으로 설명했습니다.",
                  gradedAt: "2024-01-16 14:10:15"
                },
                studentAnswer: {
                  content: "음성 답변 (2분 35초) - 전사: Hello! I'm so excited to introduce my hometown to you...",
                  audioLength: "2분 35초",
                  submittedAt: "2024-01-16 13:45:20",
                  timeSpent: "25분"
                }
              }
            ]
          }
        }
      },
      "3": { // 단일 카테고리, 여러 문제 (Reading)
        id: id,
        student: { name: "박상현", grade: "중3", schoolSystem: "korea", studentId: "2024003" },
        exam: { title: "영어 독해 평가", category: "Reading", totalMaxScore: 100, timeLimit: "50분" },
        categories: {
          "Reading": {
            questions: [
              {
                number: 1,
                text: "다음 글을 읽고 물음에 답하시오.\n\n[Reading Passage 1]\nClimate change is one of the most pressing issues of our time...",
                maxScore: 50,
                aiGrading: {
                  score: 44,
                  breakdown: {
                    comprehension: { score: 23, maxScore: 25, comment: "지문 내용을 정확히 이해함" },
                    accuracy: { score: 21, maxScore: 25, comment: "질문에 대한 정확한 답변" }
                  },
                  feedback: "독해 능력이 우수합니다. 주요 내용을 정확히 파악했습니다.",
                  gradedAt: "2024-01-16 12:20:45"
                },
                studentAnswer: {
                  content: "1. The main cause is human activities. 2. Arctic ice melting, sea level rise, extreme weather...",
                  wordCount: 68,
                  submittedAt: "2024-01-16 12:15:30",
                  timeSpent: "20분"
                }
              },
              {
                number: 2,
                text: "다음 빈칸에 들어갈 가장 적절한 것을 고르시오.\n\n[Reading Passage 2]\nArtificial intelligence has revolutionized...",
                maxScore: 50,
                aiGrading: {
                  score: 42,
                  breakdown: {
                    comprehension: { score: 21, maxScore: 25, comment: "문맥 파악이 우수함" },
                    accuracy: { score: 21, maxScore: 25, comment: "논리적 추론 능력 좋음" }
                  },
                  feedback: "문맥을 잘 이해하고 적절한 선택을 했습니다.",
                  gradedAt: "2024-01-16 12:22:18"
                },
                studentAnswer: {
                  content: "정답: ④ However, we must consider the ethical implications...",
                  wordCount: 35,
                  submittedAt: "2024-01-16 12:18:45",
                  timeSpent: "15분"
                }
              }
            ]
          }
        }
      },
      "4": { // 여러 카테고리, 여러 문제
        id: id,
        student: { name: "최수빈", grade: "고2", schoolSystem: "korea", studentId: "2024004" },
        exam: { title: "영어 종합 평가", category: "Reading+Writing+Speaking", totalMaxScore: 300, timeLimit: "120분" },
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
                  content: "1. The main cause of climate change is human activities...",
                  wordCount: 85,
                  submittedAt: "2024-01-17 09:15:10",
                  timeSpent: "15분"
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
                  content: "Learning a second language offers numerous benefits in today's globalized world...",
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
                  content: "음성 답변 (2분 40초) - 전사: My ideal future career is to become a software engineer...",
                  audioLength: "2분 40초",
                  submittedAt: "2024-01-17 09:19:30",
                  timeSpent: "45분"
                }
              }
            ]
          }
        }
      },
      "5": { // 단일 카테고리, 여러 문제 (Writing)
        id: id,
        student: { name: "정하늘", grade: "고1", schoolSystem: "korea", studentId: "2024005" },
        exam: { title: "영어 쓰기 평가", category: "Writing", totalMaxScore: 200, timeLimit: "90분" },
        categories: {
          "Writing": {
            questions: [
              {
                number: 1,
                text: "다음 빈칸을 적절한 단어로 채우시오.\n\n1. I _____ been studying English for three years.\n2. She _____ have come if she had known.\n3. The book _____ I read was interesting.",
                maxScore: 50,
                aiGrading: {
                  score: 45,
                  breakdown: {
                    accuracy: { score: 23, maxScore: 25, comment: "대부분 정확한 답변" },
                    grammar: { score: 22, maxScore: 25, comment: "문법 이해도 우수" }
                  },
                  feedback: "문법 지식이 탄탄합니다. 시제와 관계사를 잘 이해하고 있습니다.",
                  gradedAt: "2024-01-17 10:33:22"
                },
                studentAnswer: {
                  content: "1. have 2. would 3. that",
                  wordCount: 6,
                  submittedAt: "2024-01-17 10:30:45",
                  timeSpent: "10분"
                }
              },
              {
                number: 2,
                text: "다음 주제로 100-120단어의 글을 작성하시오.\n\n주제: 'The Role of Technology in Education'",
                maxScore: 150,
                aiGrading: {
                  score: 123,
                  breakdown: {
                    content: { score: 32, maxScore: 37, comment: "주제를 잘 이해하고 구체적 예시 제시" },
                    organization: { score: 30, maxScore: 38, comment: "논리적 구성이 우수함" },
                    vocabulary: { score: 31, maxScore: 37, comment: "적절하고 다양한 어휘 사용" },
                    grammar: { score: 30, maxScore: 38, comment: "문법적으로 정확함" }
                  },
                  feedback: "기술과 교육의 관계를 잘 분석했습니다. 구체적인 예시와 함께 설득력 있게 작성했습니다.",
                  gradedAt: "2024-01-17 10:35:22"
                },
                studentAnswer: {
                  content: "Technology has revolutionized education in numerous ways. Online learning platforms allow students to access courses from anywhere...",
                  wordCount: 115,
                  submittedAt: "2024-01-17 10:32:18",
                  timeSpent: "35분"
                }
              }
            ]
          }
        }
      }
    };

    return gradingDataTypes[id as keyof typeof gradingDataTypes] || gradingDataTypes["1"];
  };

  const gradingData = getGradingDataByType(gradeId || "1");

  // Check if it's a single category
  const isSingleCategory = Object.keys(gradingData.categories).length === 1;
  const categoryEntries = Object.entries(gradingData.categories);
  const singleCategoryData = isSingleCategory ? categoryEntries[0] : null;

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
                <p className="text-muted-foreground">
                  {isSingleCategory ? 
                    `${singleCategoryData![0]} 영역 학생 답안 검토 및 채점` : 
                    '카테고리별 문제별 학생 답안 검토 및 채점'}
                </p>
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
          {isSingleCategory && singleCategoryData![1].questions.length === 1 ? (
            /* 단일 카테고리, 단일 문제 - 간소화된 UI */
            <Card className="shadow-bronze mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>{singleCategoryData![0]} 채점</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const question = singleCategoryData![1].questions[0];
                  const categoryName = singleCategoryData![0];
                  const questionKey = `${categoryName}-${question.number}`;
                  
                  return (
                    <div className="space-y-6">
                      {/* Question */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-lg">
                            <FileText className="h-5 w-5" />
                            <span>문제</span>
                            <Badge variant="outline">배점: {question.maxScore}점</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-line text-foreground bg-muted/50 p-4 rounded-lg">
                            {question.text}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Student Answer */}
                      <Card>
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
                      <Card>
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
                                <div key={key} className="border border-border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">
                                      {key === 'content' ? '내용' :
                                       key === 'organization' ? '구성' :
                                       key === 'vocabulary' ? '어휘' :
                                       key === 'grammar' ? '문법' :
                                       key === 'pronunciation' ? '발음' :
                                       key === 'fluency' ? '유창성' :
                                       key === 'comprehension' ? '이해도' :
                                       key === 'accuracy' ? '정확성' : key}
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
                                placeholder="학생에게 전달할 피드백을 작성해주세요..."
                                rows={4}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          ) : (
            /* 다중 카테고리 또는 다중 문제 - 기존 UI */
            Object.entries(gradingData.categories).map(([categoryName, categoryData]) => (
              <Card key={categoryName} className="shadow-bronze mb-6">
                <CardHeader>
                  <CardTitle 
                    className={`flex items-center justify-between ${!isSingleCategory ? 'cursor-pointer' : ''}`}
                    onClick={() => !isSingleCategory && toggleCategory(categoryName)}
                  >
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>{categoryName} {isSingleCategory ? '채점' : '카테고리'}</span>
                      <Badge variant="outline">{categoryData.questions.length}문제</Badge>
                    </div>
                    {!isSingleCategory && (
                      expandedCategories[categoryName] ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                
                {(isSingleCategory || expandedCategories[categoryName] ?? true) && (
                  <CardContent>
                  <div className="space-y-8">
                    {categoryData.questions.map((question, questionIndex) => {
                      const questionKey = `${categoryName}-${question.number}`;
                      
                      return (
                        <div key={questionIndex} className="border-2 border-border rounded-lg p-6">
                          {/* Question Header - 단일 카테고리에서 여러 문제일 때만 문제 번호 표시 */}
                          {(!isSingleCategory || categoryData.questions.length > 1) && (
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">
                                  {categoryName} {question.number}번 문제
                                </h3>
                                <Badge variant="outline" className="text-sm">
                                  배점: {question.maxScore}점
                                </Badge>
                              </div>
                            )}

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
            ))
          )}

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