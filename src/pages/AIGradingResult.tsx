import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, User, Brain, CheckCircle, Edit, Clock, FileText, Video, Mic, ChevronDown, ChevronUp } from 'lucide-react';

export default function AIGradingResult() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
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

  // AI 채점 결과 더미 데이터 (카테고리별 문제별 구조)
  const getAIResultByType = (id: string) => {
    const aiResults = {
      "1": { // 단일 카테고리, 단일 문제
        student: { name: "김민수", grade: "중2", schoolSystem: "korea" },
        exam: { 
          title: "영어 에세이 평가", 
          category: "Essay",
          totalMaxScore: 100
        },
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
                  gradedAt: "2024-01-16 14:35:12",
                  processingTime: "3.2초"
                },
                studentAnswer: {
                  content: "My future dream is to become a doctor. I have always been interested in helping people and making them feel better when they are sick...",
                  wordCount: 142,
                  submittedAt: "2024-01-16 14:30:25"
                }
              }
            ]
          }
        }
      },
      "2": { // 단일 카테고리, 단일 문제 (Speaking)
        student: { name: "이지은", grade: "고1", schoolSystem: "korea" },
        exam: { 
          title: "영어 말하기 평가", 
          category: "Speaking",
          totalMaxScore: 100
        },
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
                  gradedAt: "2024-01-16 14:10:15",
                  processingTime: "5.7초"
                },
                studentAnswer: {
                  content: "음성 답변 (2분 35초) - 전사: Hello! I'm so excited to introduce my hometown to you...",
                  audioLength: "2분 35초",
                  submittedAt: "2024-01-16 13:45:20"
                }
              }
            ]
          }
        }
      },
      "3": { // 단일 카테고리, 여러 문제 (Reading)
        student: { name: "박상현", grade: "중3", schoolSystem: "korea" },
        exam: { 
          title: "영어 독해 평가", 
          category: "Reading",
          totalMaxScore: 100
        },
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
                  gradedAt: "2024-01-16 12:20:45",
                  processingTime: "2.1초"
                },
                studentAnswer: {
                  content: "1. The main cause is human activities. 2. Arctic ice melting, sea level rise, extreme weather...",
                  wordCount: 68,
                  submittedAt: "2024-01-16 12:15:30"
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
                  gradedAt: "2024-01-16 12:22:18",
                  processingTime: "1.8초"
                },
                studentAnswer: {
                  content: "정답: ④ However, we must consider the ethical implications...",
                  wordCount: 35,
                  submittedAt: "2024-01-16 12:18:45"
                }
              }
            ]
          }
        }
      },
      "4": { // 여러 카테고리, 여러 문제
        student: { name: "최수빈", grade: "고2", schoolSystem: "korea" },
        exam: { 
          title: "영어 종합 평가", 
          category: "Reading+Writing+Speaking",
          totalMaxScore: 300
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
                  gradedAt: "2024-01-17 09:18:30",
                  processingTime: "2.1초"
                },
                studentAnswer: {
                  content: "1. The main cause of climate change is human activities...",
                  wordCount: 85,
                  submittedAt: "2024-01-17 09:15:10"
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
                  gradedAt: "2024-01-17 09:19:15",
                  processingTime: "1.8초"
                },
                studentAnswer: {
                  content: "정답: ③ However, recent developments have shown...",
                  wordCount: 45,
                  submittedAt: "2024-01-17 09:16:22"
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
                  gradedAt: "2024-01-17 09:20:30",
                  processingTime: "3.5초"
                },
                studentAnswer: {
                  content: "Learning a second language offers numerous benefits in today's globalized world. First, it enhances cognitive abilities by improving memory and problem-solving skills...",
                  wordCount: 135,
                  submittedAt: "2024-01-17 09:17:45"
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
                  gradedAt: "2024-01-17 09:22:18",
                  processingTime: "5.7초"
                },
                studentAnswer: {
                  content: "음성 답변 (2분 40초) - 전사: My ideal future career is to become a software engineer...",
                  audioLength: "2분 40초",
                  submittedAt: "2024-01-17 09:19:30"
                }
              }
            ]
          }
        }
      },
      "5": { // 단일 카테고리, 여러 문제 (Writing)
        student: { name: "정하늘", grade: "고1", schoolSystem: "korea" },
        exam: { 
          title: "영어 쓰기 평가", 
          category: "Writing",
          totalMaxScore: 200
        },
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
                  gradedAt: "2024-01-17 10:33:22",
                  processingTime: "1.2초"
                },
                studentAnswer: {
                  content: "1. have 2. would 3. that",
                  wordCount: 6,
                  submittedAt: "2024-01-17 10:30:45"
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
                  gradedAt: "2024-01-17 10:35:22",
                  processingTime: "3.8초"
                },
                studentAnswer: {
                  content: "Technology has revolutionized education in numerous ways. Online learning platforms allow students to access courses from anywhere in the world. Interactive software makes learning more engaging through gamification...",
                  wordCount: 115,
                  submittedAt: "2024-01-17 10:32:18"
                }
              }
            ]
          }
        }
      },
      "7": {
        student: { name: "김서연", grade: "중3", schoolSystem: "korea" },
        exam: { 
          title: "통합 영어 평가", 
          category: "Writing+Essay+Speaking",
          totalMaxScore: 300
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
                  gradedAt: "2024-01-17 14:23:15",
                  processingTime: "1.2초"
                },
                studentAnswer: {
                  content: "1. has been 2. would have 3. might be...",
                  wordCount: 15,
                  submittedAt: "2024-01-17 14:20:35"
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
                  gradedAt: "2024-01-17 14:24:22",
                  processingTime: "1.8초"
                },
                studentAnswer: {
                  content: "1. I have been studying English for three years...",
                  wordCount: 25,
                  submittedAt: "2024-01-17 14:21:12"
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
                  gradedAt: "2024-01-17 14:25:18",
                  processingTime: "4.2초"
                },
                studentAnswer: {
                  content: "My dream school would be a place where creativity meets academic excellence...",
                  wordCount: 195,
                  submittedAt: "2024-01-17 14:22:30"
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
                  gradedAt: "2024-01-17 14:26:45",
                  processingTime: "6.1초"
                },
                studentAnswer: {
                  content: "음성 답변 (2분 50초) - 전사: My favorite hobby is drawing. I started it when I was seven...",
                  audioLength: "2분 50초",
                  submittedAt: "2024-01-17 14:23:50"
                }
              }
            ]
          }
        }
      }
    };

    return aiResults[id as keyof typeof aiResults] || aiResults["4"];
  };

  const resultData = getAIResultByType(gradeId || "1");
  
  // Calculate total AI score
  const totalAIScore = Object.values(resultData.categories).reduce((total, category) => {
    return total + category.questions.reduce((catTotal, question) => catTotal + question.aiGrading.score, 0);
  }, 0);

  // Check if it's a single category
  const isSingleCategory = Object.keys(resultData.categories).length === 1;
  const categoryEntries = Object.entries(resultData.categories);
  const singleCategoryData = isSingleCategory ? categoryEntries[0] : null;

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
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI 채점 결과</h1>
                <p className="text-muted-foreground">
                  {isSingleCategory ? 
                    `${singleCategoryData![0]} 영역 자동 채점 완료` : 
                    '카테고리별 문제별 자동 채점 완료'}
                </p>
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
                      총 {Object.values(resultData.categories).reduce((total, cat) => total + cat.questions.length, 0)}개 문제 채점 완료
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 text-lg px-4 py-2">
                  {totalAIScore}/{resultData.exam.totalMaxScore}점
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

          {/* Categories and Questions */}
          {Object.entries(resultData.categories).map(([categoryName, categoryData]) => (
            <Card key={categoryName} className="shadow-bronze mb-6">
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(categoryName)}
                >
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>{categoryName} 카테고리</span>
                    <Badge variant="outline">
                      {categoryData.questions.reduce((total, q) => total + q.aiGrading.score, 0)}/
                      {categoryData.questions.reduce((total, q) => total + q.maxScore, 0)}점
                    </Badge>
                  </div>
                  {expandedCategories[categoryName] ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </CardTitle>
              </CardHeader>
              
              {(expandedCategories[categoryName] ?? true) && (
                <CardContent>
                  <div className="space-y-6">
                    {categoryData.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="border border-border rounded-lg p-4">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            {categoryName} {question.number}번 문제
                          </h3>
                          <Badge className="bg-green-500 hover:bg-green-600">
                            {question.aiGrading.score}/{question.maxScore}점
                          </Badge>
                        </div>

                        {/* Question Text */}
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          <div className="whitespace-pre-line text-foreground text-sm">
                            {question.text.length > 150 
                              ? `${question.text.substring(0, 150)}...` 
                              : question.text}
                          </div>
                        </div>

                        {/* Student Answer */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center space-x-2">
                            {categoryName === 'Speaking' ? <Mic className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            <span>학생 답안</span>
                          </h4>
                          
                          {/* Speaking 카테고리일 때 미디어 플레이어 */}
                          {categoryName === 'Speaking' && (
                            <div className="space-y-3 mb-4">
                              {/* Audio Player */}
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Mic className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">음성 녹음</span>
                                  <Badge variant="outline" className="text-xs">
                                    {(question.studentAnswer as any).audioLength}
                                  </Badge>
                                </div>
                                <audio 
                                  controls 
                                  className="w-full h-8"
                                  src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                                >
                                  브라우저가 오디오를 지원하지 않습니다.
                                </audio>
                              </div>

                              {/* Video Player */}
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Video className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">영상 녹화</span>
                                  <Badge variant="outline" className="text-xs">
                                    {(question.studentAnswer as any).audioLength}
                                  </Badge>
                                </div>
                                <video 
                                  controls 
                                  className="w-full rounded"
                                  style={{ maxHeight: '200px' }}
                                  poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xODUgODBWMTQ1TDIzMCAxMTIuNUwxODUgODBaIiBmaWxsPSIjNkI3Mjg0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTY1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QjcyODQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuuwmOuLueqwgOuPheuztOq4sDwvdGV4dD4KPHN2Zz4="
                                >
                                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                                  브라우저가 비디오를 지원하지 않습니다.
                                </video>
                              </div>
                            </div>
                          )}
                          
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="whitespace-pre-line text-foreground text-sm">
                              {question.studentAnswer.content.length > 100 
                                ? `${question.studentAnswer.content.substring(0, 100)}...` 
                                : question.studentAnswer.content}
                            </div>
                          </div>
                        </div>

                        {/* AI Grading Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {Object.entries(question.aiGrading.breakdown).map(([key, item]: [string, any]) => (
                            <div key={key} className="border border-border rounded p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  {key === 'content' ? '내용' :
                                   key === 'organization' ? '구성' :
                                   key === 'vocabulary' ? '어휘' :
                                   key === 'grammar' ? '문법' :
                                   key === 'pronunciation' ? '발음' :
                                   key === 'fluency' ? '유창성' :
                                   key === 'comprehension' ? '이해도' :
                                   key === 'accuracy' ? '정확성' : key}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {item.score}/{item.maxScore}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.comment}</p>
                            </div>
                          ))}
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">AI 평가</p>
                          <p className="text-xs text-blue-800 dark:text-blue-200">{question.aiGrading.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

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