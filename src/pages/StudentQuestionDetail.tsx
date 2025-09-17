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
  },
  6: { // examId - 영어 종합 평가
    reading: [
      {
        id: 1,
        question: "다음 글을 읽고 주제를 가장 잘 나타내는 것을 고르시오.",
        passage: "Social media has transformed the way people communicate and share information. While it has brought people closer together across great distances, it has also raised concerns about privacy, mental health, and the spread of misinformation. As we continue to integrate these platforms into our daily lives, we must carefully consider both their benefits and drawbacks.",
        options: ["A) Social media benefits", "B) Social media problems", "C) Social media's dual impact", "D) Future of communication"],
        studentAnswer: "C) Social media's dual impact",
        correctAnswer: "C) Social media's dual impact",
        aiScore: 15,
        aiMaxScore: 15,
        aiFeedback: "완벽한 답변입니다! 지문의 핵심 내용인 소셜미디어의 양면성을 정확히 파악했습니다.",
        teacherScore: 15,
        teacherMaxScore: 15,
        teacherFeedback: "훌륭합니다. 지문의 전체적인 흐름을 잘 이해했네요."
      },
      {
        id: 2,
        question: "다음 빈칸에 들어갈 말로 가장 적절한 것은?",
        passage: "Regular exercise is essential for maintaining good health. It not only strengthens the body but also _______ mental well-being by reducing stress and improving mood.",
        options: ["A) damages", "B) enhances", "C) ignores", "D) complicates"],
        studentAnswer: "B) enhances",
        correctAnswer: "B) enhances",
        aiScore: 10,
        aiMaxScore: 10,
        aiFeedback: "정답입니다! 운동이 정신 건강을 향상시킨다는 문맥을 정확히 파악했습니다.",
        teacherScore: 10,
        teacherMaxScore: 10,
        teacherFeedback: "맞습니다. 문맥상 긍정적인 의미의 단어가 들어가야 함을 잘 알았네요."
      }
    ],
    writing: [
      {
        id: 3,
        question: "다음 주제에 대해 150단어 이상으로 에세이를 작성하시오: 'The role of technology in education'",
        studentAnswer: "Technology has revolutionized education in numerous ways. First, it has made learning more accessible through online courses and digital resources. Students can now access information from anywhere in the world and learn at their own pace. Second, interactive tools like educational apps and virtual reality make learning more engaging and fun. These technologies help students understand complex concepts through visual and hands-on experiences. Third, technology enables personalized learning, allowing teachers to adapt their methods to individual student needs. However, we must also be careful not to rely too heavily on technology and maintain the human connection that is essential in education. In conclusion, when used appropriately, technology can greatly enhance the educational experience.",
        aiScore: 92,
        aiMaxScore: 100,
        aiFeedback: "뛰어난 에세이입니다! 구조가 체계적이고 구체적인 예시가 잘 포함되어 있습니다. 문법과 어휘 사용도 매우 우수합니다.",
        teacherScore: 95,
        teacherMaxScore: 100,
        teacherFeedback: "탁월한 작문입니다. 논리적 구성과 균형 잡힌 관점이 인상적이에요. 결론 부분도 매우 효과적입니다."
      }
    ],
    speaking: [
      {
        id: 4,
        question: "최근에 본 영화에 대해 2분간 이야기해 주세요. (줄거리, 감상, 추천 이유)",
        studentAnswer: "[음성 파일] - 학생이 '기생충' 영화에 대해 상세히 설명하며 사회적 메시지와 영화적 기법에 대해 논의함",
        aiScore: 88,
        aiMaxScore: 100,
        aiFeedback: "매우 유창하고 체계적인 발표였습니다. 발음이 명확하고 내용이 구체적이며 개인적 견해가 잘 표현되었습니다. 약간의 문법적 실수가 있었지만 전체적으로 훌륭합니다.",
        teacherScore: 90,
        teacherMaxScore: 100,
        teacherFeedback: "정말 인상적인 발표였어요! 영화에 대한 깊이 있는 이해와 비판적 사고가 잘 드러났습니다. 자신감 있는 발표 태도도 좋았어요."
      }
    ],
    essay: [
      {
        id: 5,
        question: "다음 주제에 대해 300단어 이상의 논증 에세이를 작성하시오: 'Should students be allowed to use smartphones in school?'",
        studentAnswer: "The question of whether students should be allowed to use smartphones in school is a complex issue that requires careful consideration of both benefits and drawbacks. I believe that smartphones should be permitted in schools, but with clear guidelines and restrictions.\n\nFirstly, smartphones can serve as powerful educational tools. They provide instant access to information, educational apps, and online resources that can enhance learning. Students can use them for research, language translation, and accessing digital textbooks. In emergency situations, smartphones also ensure that students can contact their parents or emergency services immediately.\n\nHowever, critics argue that smartphones can be distracting and may negatively impact face-to-face social interactions. There are valid concerns about cyberbullying, inappropriate content access, and the potential for academic dishonesty during exams.\n\nTo address these concerns, schools should implement a balanced approach. Smartphones could be allowed during breaks and specific class activities but restricted during lessons and examinations. Teachers should be trained to integrate smartphone technology effectively into their curriculum while maintaining classroom discipline.\n\nIn conclusion, rather than completely banning smartphones, schools should embrace them as part of modern education while establishing clear policies to minimize their negative effects. This approach prepares students for a technology-driven world while maintaining the integrity of the learning environment.",
        aiScore: 89,
        aiMaxScore: 100,
        aiFeedback: "매우 잘 구성된 논증 에세이입니다. 균형 잡힌 관점과 구체적인 해결책 제시가 훌륭합니다. 문단 구성과 논리적 흐름이 매우 좋습니다.",
        teacherScore: 92,
        teacherMaxScore: 100,
        teacherFeedback: "뛰어난 논증 에세이네요! 양쪽 관점을 공정하게 다루고 실용적인 해결책을 제시한 점이 특히 좋습니다. 영어 실력이 많이 늘었어요."
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