import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ArrowLeft, User, Bot, GraduationCap, MessageSquare } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Mock detailed question data
const mockQuestionDetails = {
  1: { // examId
    reading: [
      {
        id: 1,
        question: "다음 글을 읽고 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.",
        passage: "Climate change is one of the most pressing issues of our time. The effects of global warming are becoming increasingly evident, with rising sea levels, extreme weather patterns, and melting ice caps. Scientists around the world are working to find solutions to this _______ problem.",
        options: ["A) simple", "B) complex", "C) temporary", "D) minor"],
        studentAnswer: "B) complex",
        correctAnswer: "B) complex",
        aiScore: 10,
        aiMaxScore: 10,
        aiFeedback: "정답입니다! 'complex'는 기후 변화가 복잡한 문제임을 잘 나타냅니다.",
        teacherScore: 10,
        teacherMaxScore: 10,
        teacherFeedback: "올바른 답변입니다. 문맥을 잘 파악했네요."
      },
      {
        id: 2,
        question: "다음 글의 제목으로 가장 적절한 것은?",
        passage: "Artificial Intelligence is revolutionizing various industries. From healthcare to transportation, AI is making processes more efficient and accurate. However, there are also concerns about job displacement and privacy issues.",
        options: ["A) The Benefits of AI", "B) AI Problems Only", "C) AI: Benefits and Challenges", "D) Future Technology"],
        studentAnswer: "A) The Benefits of AI",
        correctAnswer: "C) AI: Benefits and Challenges",
        aiScore: 0,
        aiMaxScore: 10,
        aiFeedback: "아쉽게도 틀렸습니다. 지문에서 AI의 장점과 우려사항을 모두 언급하고 있습니다.",
        teacherScore: 2,
        teacherMaxScore: 10,
        teacherFeedback: "글 전체의 내용을 고려해야 합니다. 장점뿐만 아니라 우려사항도 함께 다루고 있어요."
      }
    ],
    writing: [
      {
        id: 3,
        question: "다음 주제에 대해 100단어 이상으로 에세이를 작성하시오: 'The importance of learning English'",
        studentAnswer: "Learning English is very important in today's globalized world. English is the international language of business, science, and technology. Many people around the world speak English as a second language. It helps us communicate with people from different countries and cultures. English also gives us access to more information on the internet. Most websites and academic papers are written in English. By learning English, we can expand our knowledge and opportunities for the future.",
        aiScore: 42,
        aiMaxScore: 50,
        aiFeedback: "좋은 에세이입니다. 문법과 어휘 사용이 적절하며, 주제에 맞는 내용을 잘 작성했습니다. 다만 더 구체적인 예시나 개인적 경험을 추가하면 더 좋을 것 같습니다.",
        teacherScore: 45,
        teacherMaxScore: 50,
        teacherFeedback: "전반적으로 잘 작성된 에세이입니다. 논리적 구조가 좋고 문법 오류도 적습니다. 결론 부분을 더 강화하면 완벽할 것 같아요."
      }
    ]
  },
  2: { // examId
    speaking: [
      {
        id: 1,
        question: "자신의 취미에 대해 1분간 이야기해 주세요.",
        studentAnswer: "[음성 파일] - 학생이 독서와 영화 감상에 대해 이야기함",
        aiScore: 35,
        aiMaxScore: 40,
        aiFeedback: "발음이 명확하고 유창하게 말했습니다. 내용도 충실하네요. 다만 'actually'를 너무 자주 사용한 점이 아쉽습니다.",
        teacherScore: 38,
        teacherMaxScore: 40,
        teacherFeedback: "전반적으로 훌륭한 답변이었습니다. 자연스러운 표현과 좋은 어휘력을 보여주었어요."
      }
    ]
  },
  4: { // examId
    math: [
      {
        id: 1,
        question: "다음 방정식을 풀어라: 2x + 5 = 15",
        studentAnswer: "x = 5",
        correctAnswer: "x = 5",
        aiScore: 10,
        aiMaxScore: 10,
        aiFeedback: "정답입니다! 올바른 풀이 과정을 거쳐 정확한 답을 구했습니다.",
        teacherScore: 10,
        teacherMaxScore: 10,
        teacherFeedback: "완벽합니다. 계산 과정이 정확해요."
      },
      {
        id: 2,
        question: "직각삼각형에서 빗변의 길이가 10, 한 변의 길이가 6일 때, 다른 한 변의 길이를 구하시오.",
        studentAnswer: "8",
        correctAnswer: "8",
        aiScore: 15,
        aiMaxScore: 15,
        aiFeedback: "피타고라스 정리를 올바르게 적용하여 정답을 구했습니다.",
        teacherScore: 15,
        teacherMaxScore: 15,
        teacherFeedback: "훌륭합니다! 피타고라스 정리를 정확히 활용했네요."
      }
    ]
  }
};

export default function StudentQuestionDetail() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { examId, sectionName } = useParams();
  const navigate = useNavigate();
  
  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  // Get question details for this exam and section
  const examDetails = mockQuestionDetails[Number(examId) as keyof typeof mockQuestionDetails];
  const sectionQuestions = examDetails?.[sectionName as keyof typeof examDetails] as any[] || [];

  useEffect(() => {
    if (!examDetails || !sectionQuestions.length) {
      alert('해당 섹션의 상세 결과를 찾을 수 없습니다.');
      navigate(`/student/results/${examId}`);
    }
  }, [examDetails, sectionQuestions, examId, navigate]);

  if (!examDetails || !sectionQuestions.length) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reading': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'writing': return 'bg-green-50 text-green-700 border-green-200';
      case 'essay': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'speaking': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'math': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      reading: 'Reading (영어)',
      writing: 'Writing (영어)',
      essay: 'Essay (영어)',
      speaking: 'Speaking (영어)',
      math: 'Math (수학)'
    };
    return labels[category] || category;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to={`/student/results/${examId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                결과로 돌아가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-brand-bronze" />
                <span>문제별 상세 결과</span>
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={getCategoryColor(sectionName || '')}>
                  {getCategoryLabel(sectionName || '')}
                </Badge>
                <p className="text-muted-foreground">총 {sectionQuestions.length}문제</p>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {sectionQuestions.map((question: any, index: number) => (
              <Card key={question.id} className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="text-lg">
                    문제 {index + 1}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Question */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">문제</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{question.question}</p>
                      {question.passage && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-2">지문:</p>
                          <p className="whitespace-pre-wrap italic">{question.passage}</p>
                        </div>
                      )}
                      {question.options && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-2">선택지:</p>
                          <div className="space-y-1">
                            {question.options.map((option: string, idx: number) => (
                              <p key={idx} className="text-sm">{option}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student Answer */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-foreground">내 답변</h3>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="whitespace-pre-wrap">{question.studentAnswer}</p>
                      {question.correctAnswer && (
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <p className="text-sm text-muted-foreground">
                            정답: <span className="font-semibold text-green-600">{question.correctAnswer}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-foreground">AI 채점 및 피드백</h3>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(question.aiScore, question.aiMaxScore)}`}>
                        {question.aiScore} / {question.aiMaxScore}점
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="whitespace-pre-wrap">{question.aiFeedback}</p>
                    </div>
                  </div>

                  {/* Teacher Feedback */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-foreground">선생님 채점 및 피드백</h3>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(question.teacherScore, question.teacherMaxScore)}`}>
                        {question.teacherScore} / {question.teacherMaxScore}점
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="whitespace-pre-wrap">{question.teacherFeedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}