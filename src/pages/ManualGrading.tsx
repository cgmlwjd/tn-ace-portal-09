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

  const getCategoryDisplayName = (categoryName: string) => {
    // 수학 시험인지 확인 (시험 제목에 "수학"이 포함된 경우)
    const isMathExam = gradingData.exam.title.includes('수학');
    
    if (isMathExam) {
      const mathCategoryMap: {[key: string]: string} = {
        'MCQ': '객관식',
        'Short': '주관식', 
        'Essay': '서술형'
      };
      return mathCategoryMap[categoryName] || categoryName;
    }
    
    // 영어 시험은 원래 카테고리명 유지
    return categoryName;
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
                  content: "My future dream is to become a doctor. I have always been interested in helping people and making them feel better when they are sick. Ever since I was young, I enjoyed watching medical dramas and reading about different diseases and treatments. The idea of saving lives and making a positive impact on people's health really appeals to me.\n\nTo achieve this dream, I have several concrete plans. First, I need to study very hard in science subjects like biology and chemistry. I am already taking extra classes after school to improve my grades in these areas. Second, I plan to volunteer at the local hospital during summer vacation to gain hands-on experience and learn more about the medical field. This will help me understand what doctors actually do on a daily basis.\n\nI know there will be many difficulties on this path. Medical school is very competitive and expensive, requiring excellent grades and high test scores. Also, studying medicine takes many years - at least 8 years including undergraduate and medical school, plus residency training. The workload will be intense and demanding. However, I believe I can overcome these challenges by staying motivated and working consistently towards my goal. I am willing to make sacrifices now for my future career.\n\nI think helping people as a doctor would be incredibly rewarding, and this motivates me to work hard every day toward achieving my dream.",
                  wordCount: 195,
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
                  content: "음성 답변 (2분 35초)\n\n전사된 내용:\n\"Hello! I'm so excited to introduce my hometown to you. I live in Busan, which is located in the southeastern part of Korea. It's the second largest city in Korea and it's famous for its beautiful beaches and delicious seafood.\n\nOne of the most popular places you should definitely visit is Haeundae Beach. The sand is really soft and clean, and the water is crystal clear. During summer, there are many festivals and events happening there. You can also try our famous local food called 'milmyeon' which is cold buckwheat noodles. It's perfect for hot summer days and very refreshing.\n\nAnother place I highly recommend is Gamcheon Culture Village. It's very colorful and artistic, with painted houses built on hillsides. You can take amazing photos there and buy unique souvenirs made by local artists. The view from the village is breathtaking, especially during sunset.\n\nI think you should visit Busan because it has both modern city life and traditional Korean culture. The people here are very friendly and welcoming to foreigners. The seafood is incredibly fresh since we're right by the ocean. My advice for you is to definitely try the local street food at Jagalchi Fish Market, and don't forget to watch the sunrise at the beach early in the morning. It's truly spectacular and worth waking up early for.\"",
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
                  content: "1. The main cause of climate change is human activities, especially burning fossil fuels like coal, oil, and gas. These activities release greenhouse gases into the atmosphere.\n\n2. Three effects of climate change mentioned in the passage are:\n   - Arctic ice melting at an alarming rate\n   - Sea levels rising due to melting ice\n   - Extreme weather events becoming more frequent and severe\n\n3. The passage suggests several solutions:\n   - Many countries are taking action to reduce greenhouse gas emissions\n   - Using renewable energy sources like solar and wind power which are becoming more affordable\n   - Individual actions such as using public transportation and reducing energy consumption can also make a difference\n\n4. In my opinion, the most effective way to combat climate change is transitioning to renewable energy sources on a global scale. This would address the root cause by reducing our dependence on fossil fuels that release greenhouse gases.",
                  wordCount: 145,
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
                  content: "정답: ④ However, we must consider the ethical implications of AI development and ensure it benefits all of humanity.\n\n이 문제는 인공지능 기술의 발전과 관련된 빈칸추론 문제였습니다. 지문의 흐름을 보면 AI 기술의 긍정적인 측면들이 먼저 제시되었고, 빈칸 뒤에는 조심스럽고 신중한 접근이 필요하다는 내용이 이어집니다. 따라서 'However'로 시작하여 AI의 윤리적 측면을 강조하는 선택지가 가장 적절하다고 판단했습니다. AI 기술이 아무리 발전하더라도 인간의 가치와 윤리를 고려하는 것이 중요하다는 메시지를 담고 있습니다.",
                  wordCount: 156,
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
                  content: "1. The main cause of climate change is human activities, especially the burning of fossil fuels like coal, oil, and natural gas. These activities release carbon dioxide and other greenhouse gases into the atmosphere, which trap heat and cause global temperatures to rise.\n\n2. Three effects of climate change mentioned in the passage are:\n   - Arctic ice is melting at an alarming rate, reducing the polar ice caps\n   - Sea levels are rising due to thermal expansion and melting glaciers\n   - Extreme weather events are becoming more frequent and severe, including hurricanes, droughts, and heatwaves\n\n3. The author suggests several solutions to address climate change:\n   - Many countries are taking action to reduce their greenhouse gas emissions through policy changes\n   - Renewable energy sources like solar and wind power are becoming more affordable and widespread\n   - Individual actions such as using public transportation and reducing energy consumption can make a collective difference",
                  wordCount: 142,
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
                  content: "Learning a second language offers numerous benefits in today's globalized world. First, it enhances cognitive abilities by improving memory and problem-solving skills. Research shows that bilingual individuals often perform better in multitasking and decision-making processes. The mental exercise of switching between languages strengthens brain functions and can even delay age-related cognitive decline.\n\nSecond, learning another language opens up significant career opportunities. Many companies highly value employees who can communicate effectively with international clients and partners. This skill can lead to promotions, higher salaries, and opportunities to work abroad. In our interconnected economy, multilingual professionals are increasingly in demand across various industries.\n\nFinally, language learning allows for deeper cultural understanding and personal growth. When you learn a language, you also learn about the culture, traditions, and perspectives of its speakers. This broadens your worldview, makes you more empathetic towards others, and helps you appreciate diversity in our global community.",
                  wordCount: 148,
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
                  content: "음성 답변 (2분 40초)\n\n전사된 내용:\n\"My ideal future career is to become a software engineer. I have always been fascinated by technology and how it can solve real-world problems. Programming allows me to be creative while also being logical and analytical, which suits my personality perfectly.\n\nI want to work for a technology company that focuses on developing applications that can make people's lives easier and more efficient. For example, I'm particularly interested in creating educational apps that can help students learn more effectively, or healthcare applications that can assist doctors in providing better patient care. I believe technology should be used to benefit society and improve quality of life.\n\nThe reason I chose this career path is because it combines my passion for problem-solving with my desire to make a positive impact on society. Technology is constantly evolving and advancing, so there will always be new challenges and opportunities to learn and grow. I'm excited about the possibility of working on cutting-edge projects and being part of innovations that could change how people work, learn, and communicate.\n\nTo prepare for this career, I'm currently studying computer science and learning various programming languages like Python, Java, and JavaScript. I also participate in coding competitions and work on personal projects to build my portfolio.\"",
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
                  content: "Technology has revolutionized education in numerous ways, transforming how students learn and teachers teach. Online learning platforms allow students to access courses from anywhere in the world, breaking down geographical barriers and making quality education more accessible. Interactive software makes learning more engaging through gamification, virtual simulations, and multimedia content that caters to different learning styles.\n\nMoreover, educational technology enables personalized learning experiences. Adaptive learning systems can adjust the pace and difficulty level based on individual student progress, ensuring that each learner receives appropriate challenges. Digital tools also facilitate collaboration among students through online discussion forums, group projects, and peer review systems.\n\nTeachers benefit from technology as well, as it provides them with powerful tools for creating interactive lessons, tracking student progress, and providing immediate feedback. Virtual reality and augmented reality are opening up new possibilities for immersive learning experiences that were previously impossible in traditional classrooms.\n\nHowever, we must ensure that technology complements rather than replaces human interaction in education, maintaining the essential role of teachers in guiding and inspiring students.",
                  wordCount: 162,
                  submittedAt: "2024-01-17 10:32:18",
                  timeSpent: "35분"
                }
              }
            ]
          }
        }
      },
      "8": { // 수학 중간고사 - 대수 (다중 섹션)
        id: id,
        student: { name: "이수현", grade: "중2", schoolSystem: "korea", studentId: "2024008" },
        exam: { title: "수학 중간고사 - 대수", category: "MCQ+Short+Essay", totalMaxScore: 100, timeLimit: "80분" },
        categories: {
          "MCQ": {
            questions: [
              {
                number: 1,
                text: "다음 방정식의 해는? 2x + 3 = 11\n\n① x = 2\n② x = 3\n③ x = 4\n④ x = 5",
                maxScore: 10,
                aiGrading: {
                  score: 10,
                  breakdown: {
                    accuracy: { score: 10, maxScore: 10, comment: "정답을 올바르게 선택함" }
                  },
                  feedback: "정확한 답을 선택했습니다.",
                  gradedAt: "2024-01-18 10:20:15"
                },
                studentAnswer: {
                  content: "정답: ③ x = 4\n\n풀이: 2x + 3 = 11 → 2x = 8 → x = 4",
                  wordCount: 18,
                  submittedAt: "2024-01-18 10:15:10",
                  timeSpent: "3분"
                }
              },
              {
                number: 2,
                text: "다음 중 일차방정식이 아닌 것은?\n\n① 3x + 5 = 0\n② x² + 2x = 1\n③ 2x - 7 = 3x\n④ 5x = 10",
                maxScore: 10,
                aiGrading: {
                  score: 10,
                  breakdown: {
                    accuracy: { score: 10, maxScore: 10, comment: "이차방정식을 올바르게 구분함" }
                  },
                  feedback: "일차방정식과 이차방정식을 정확히 구분했습니다.",
                  gradedAt: "2024-01-18 10:20:20"
                },
                studentAnswer: {
                  content: "정답: ② x² + 2x = 1\n\n이유: x²이 있어서 이차방정식입니다.",
                  wordCount: 20,
                  submittedAt: "2024-01-18 10:15:25",
                  timeSpent: "2분"
                }
              }
            ]
          },
          "Short": {
            questions: [
              {
                number: 1,
                text: "방정식 3x - 7 = 2x + 5를 풀어라.",
                maxScore: 15,
                aiGrading: {
                  score: 13,
                  breakdown: {
                    accuracy: { score: 8, maxScore: 8, comment: "계산 과정이 정확함" },
                    method: { score: 5, maxScore: 7, comment: "풀이 방법이 적절하나 설명이 부족" }
                  },
                  feedback: "답은 정확하지만 각 단계에 대한 설명을 더 자세히 써주면 좋겠습니다.",
                  gradedAt: "2024-01-18 10:20:25"
                },
                studentAnswer: {
                  content: "3x - 7 = 2x + 5\n3x - 2x = 5 + 7\nx = 12",
                  wordCount: 15,
                  submittedAt: "2024-01-18 10:18:30",
                  timeSpent: "5분"
                }
              }
            ]
          },
          "Essay": {
            questions: [
              {
                number: 1,
                text: "일차방정식 ax + b = 0 (a ≠ 0)의 해가 x = 3일 때, a와 b 사이의 관계를 구하고, 이를 이용하여 구체적인 예를 들어 설명하시오.",
                maxScore: 25,
                aiGrading: {
                  score: 20,
                  breakdown: {
                    concept: { score: 8, maxScore: 10, comment: "개념 이해가 좋음" },
                    reasoning: { score: 7, maxScore: 8, comment: "논리적 사고가 우수함" },
                    presentation: { score: 5, maxScore: 7, comment: "설명이 명확하나 더 체계적일 수 있음" }
                  },
                  feedback: "개념을 잘 이해하고 있으며 예시도 적절합니다. 설명을 더 체계적으로 정리하면 완벽할 것 같습니다.",
                  gradedAt: "2024-01-18 10:20:30"
                },
                studentAnswer: {
                  content: "주어진 조건: ax + b = 0에서 x = 3이 해\n\n해 구하기:\nx = 3을 방정식에 대입하면\na(3) + b = 0\n3a + b = 0\n따라서 b = -3a\n\n관계식: b = -3a\n\n구체적인 예:\na = 2일 때, b = -3(2) = -6\n방정식: 2x - 6 = 0\n확인: 2(3) - 6 = 6 - 6 = 0 ✓\n\na = -1일 때, b = -3(-1) = 3  \n방정식: -x + 3 = 0\n확인: -(3) + 3 = -3 + 3 = 0 ✓\n\n결론: 일차방정식의 해가 주어졌을 때, 계수들 사이의 관계를 구할 수 있고, 이를 통해 다양한 형태의 방정식을 만들 수 있습니다.",
                  wordCount: 185,
                  submittedAt: "2024-01-18 10:25:40",
                  timeSpent: "15분"
                }
              }
            ]
          }
        }
      },
      "9": { // Math 단일 카테고리, 여러 문제 (기하)
        id: id,
        student: { name: "박지호", grade: "고1", schoolSystem: "usa", studentId: "2024009" },
        exam: { title: "Math Comprehensive Test - Geometry", category: "Math", totalMaxScore: 100, timeLimit: "75분" },
        categories: {
          "Math": {
            questions: [
              {
                number: 1,
                text: "원의 중심이 원점이고 반지름이 5인 원의 방정식을 구하고, 점 (3, 4)가 이 원 위에 있는지 확인하시오.",
                maxScore: 20,
                aiGrading: {
                  score: 18,
                  breakdown: {
                    equation: { score: 10, maxScore: 10, comment: "원의 방정식이 정확함" },
                    verification: { score: 8, maxScore: 10, comment: "점이 원 위에 있음을 정확히 확인" }
                  },
                  feedback: "원의 방정식과 점의 위치 확인을 정확히 했습니다.",
                  gradedAt: "2024-01-18 11:35:20"
                },
                studentAnswer: {
                  content: "원의 중심이 원점 (0, 0)이고 반지름이 5인 원의 방정식:\nx² + y² = 25\n\n점 (3, 4)가 원 위에 있는지 확인:\n3² + 4² = 9 + 16 = 25\n방정식을 만족하므로 점 (3, 4)는 이 원 위에 있다.",
                  submittedAt: "2024-01-18 11:30:45",
                  timeSpent: "12분"
                }
              },
              {
                number: 2,
                text: "삼각형 ABC에서 A(1, 2), B(4, 6), C(7, 2)일 때, 다음을 구하시오.\n\n(1) AB의 길이\n(2) 삼각형 ABC의 넓이\n(3) BC의 중점 좌표",
                maxScore: 30,
                aiGrading: {
                  score: 26,
                  breakdown: {
                    distance: { score: 10, maxScore: 10, comment: "거리 공식 정확히 적용" },
                    area: { score: 8, maxScore: 10, comment: "넓이 계산 정확하나 과정 설명 부족" },
                    midpoint: { score: 8, maxScore: 10, comment: "중점 공식 정확히 적용" }
                  },
                  feedback: "모든 계산이 정확합니다. 넓이 구하는 과정을 더 자세히 설명하면 좋겠습니다.",
                  gradedAt: "2024-01-18 11:36:45"
                },
                studentAnswer: {
                  content: "(1) AB의 길이:\nAB = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5\n\n(2) 삼각형 ABC의 넓이:\n신발끈 공식 사용:\n넓이 = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|\n= ½|1(6-2) + 4(2-2) + 7(2-6)|\n= ½|4 + 0 - 28| = ½ × 24 = 12\n\n(3) BC의 중점:\n중점 = ((4+7)/2, (6+2)/2) = (5.5, 4)",
                  submittedAt: "2024-01-18 11:32:20",
                  timeSpent: "18분"
                }
              },
              {
                number: 3,
                text: "직선 2x - 3y + 6 = 0과 직선 x + y - 4 = 0의 교점을 구하고, 두 직선이 수직인지 확인하시오.",
                maxScore: 25,
                aiGrading: {
                  score: 23,
                  breakdown: {
                    intersection: { score: 15, maxScore: 15, comment: "교점 계산이 정확함" },
                    perpendicular: { score: 8, maxScore: 10, comment: "수직 여부 확인 정확하나 설명 보완 필요" }
                  },
                  feedback: "교점 계산은 완벽합니다. 수직 조건에 대한 설명을 더 자세히 하면 좋겠습니다.",
                  gradedAt: "2024-01-18 11:37:30"
                },
                studentAnswer: {
                  content: "교점 구하기:\n2x - 3y + 6 = 0 ... ①\nx + y - 4 = 0 ... ②\n\n②에서 y = 4 - x\n①에 대입: 2x - 3(4-x) + 6 = 0\n2x - 12 + 3x + 6 = 0\n5x = 6\nx = 6/5\n\ny = 4 - 6/5 = 14/5\n\n교점: (6/5, 14/5)\n\n수직 여부 확인:\n직선 ①의 기울기: 2/3\n직선 ②의 기울기: -1\n기울기의 곱: (2/3) × (-1) = -2/3 ≠ -1\n따라서 두 직선은 수직이 아니다.",
                  submittedAt: "2024-01-18 11:33:15",
                  timeSpent: "20분"
                }
              },
              {
                number: 4,
                text: "정사각형 ABCD의 한 변의 길이가 6이고, A(0, 0), B(6, 0)일 때, 나머지 두 점 C, D의 좌표를 구하시오. (두 가지 경우가 있음)",
                maxScore: 25,
                aiGrading: {
                  score: 21,
                  breakdown: {
                    case1: { score: 12, maxScore: 12, comment: "첫 번째 경우 정확" },
                    case2: { score: 9, maxScore: 13, comment: "두 번째 경우 계산 실수" }
                  },
                  feedback: "첫 번째 경우는 완벽합니다. 두 번째 경우의 계산을 다시 확인해보세요.",
                  gradedAt: "2024-01-18 11:38:15"
                },
                studentAnswer: {
                  content: "A(0, 0), B(6, 0)이고 정사각형의 한 변이 6일 때:\n\nCase 1: 반시계 방향으로 정사각형 형성\nC(6, 6), D(0, 6)\n\nCase 2: 시계 방향으로 정사각형 형성  \nC(6, -6), D(0, -6)\n\n검증:\n- AB = 6 (주어진 조건)\n- BC = CD = DA = 6 (정사각형 조건)\n- 모든 내각이 90° (정사각형 조건)\n\n따라서 두 가지 경우: C(6, 6), D(0, 6) 또는 C(6, -6), D(0, -6)",
                  submittedAt: "2024-01-18 11:34:30",
                  timeSpent: "25분"
                }
              }
            ]
          }
        }
      },
      "10": { // Math 단일 카테고리, 여러 문제 (함수)
        id: id,
        student: { name: "최예린", grade: "고1", schoolSystem: "korea", studentId: "2024010" },
        exam: { title: "수학 기말고사 - 함수", category: "Math", totalMaxScore: 100, timeLimit: "90분" },
        categories: {
          "Math": {
            questions: [
              {
                number: 1,
                text: "다음 함수의 정의역과 치역을 구하시오.\n\nf(x) = √(x - 2) + 1",
                maxScore: 20,
                aiGrading: {
                  score: 18,
                  breakdown: {
                    domain: { score: 10, maxScore: 10, comment: "정의역을 정확히 구함" },
                    range: { score: 8, maxScore: 10, comment: "치역 구하기 정확하나 설명 보완 필요" }
                  },
                  feedback: "정의역과 치역을 잘 구했습니다. 치역에 대한 설명을 더 자세히 하면 좋겠습니다.",
                  gradedAt: "2024-01-18 14:50:25"
                },
                studentAnswer: {
                  content: "f(x) = √(x - 2) + 1에서\n\n정의역: 제곱근 안의 값이 0 이상이어야 하므로\nx - 2 ≥ 0\nx ≥ 2\n따라서 정의역은 [2, +∞)\n\n치역: √(x - 2) ≥ 0이므로\n√(x - 2) + 1 ≥ 1\n따라서 치역은 [1, +∞)",
                  submittedAt: "2024-01-18 14:45:20",
                  timeSpent: "15분"
                }
              },
              {
                number: 2,
                text: "함수 f(x) = x² - 4x + 3에 대해 다음을 구하시오.\n\n(1) 이 함수를 완전제곱식으로 나타내시오.\n(2) 꼭짓점의 좌표를 구하시오.\n(3) 축의 방정식을 구하시오.\n(4) 최댓값 또는 최솟값을 구하시오.",
                maxScore: 30,
                aiGrading: {
                  score: 27,
                  breakdown: {
                    completing: { score: 8, maxScore: 8, comment: "완전제곱식 변형 완벽" },
                    vertex: { score: 7, maxScore: 7, comment: "꼭짓점 좌표 정확" },
                    axis: { score: 6, maxScore: 7, comment: "축의 방정식 정확" },
                    extremum: { score: 6, maxScore: 8, comment: "최솟값 정확하나 설명 부족" }
                  },
                  feedback: "모든 계산이 정확합니다. 최솟값을 갖는 이유에 대한 설명을 추가하면 좋겠습니다.",
                  gradedAt: "2024-01-18 14:51:40"
                },
                studentAnswer: {
                  content: "(1) 완전제곱식 변형:\nf(x) = x² - 4x + 3\n= x² - 4x + 4 - 4 + 3\n= (x - 2)² - 1\n\n(2) 꼭짓점: (2, -1)\n\n(3) 축의 방정식: x = 2\n\n(4) a = 1 > 0이므로 아래로 볼록한 포물선\n따라서 최솟값을 가지며, 최솟값은 -1",
                  submittedAt: "2024-01-18 14:46:35",
                  timeSpent: "25분"
                }
              },
              {
                number: 3,
                text: "합성함수를 구하시오.\n\nf(x) = 2x + 1, g(x) = x² - 3일 때,\n(1) (f ∘ g)(x)\n(2) (g ∘ f)(x)\n(3) f(g(2))와 g(f(2))의 값",
                maxScore: 25,
                aiGrading: {
                  score: 23,
                  breakdown: {
                    fog: { score: 8, maxScore: 8, comment: "f∘g 정확히 구함" },
                    gof: { score: 8, maxScore: 8, comment: "g∘f 정확히 구함" },
                    values: { score: 7, maxScore: 9, comment: "함수값 계산 정확하나 과정 설명 부족" }
                  },
                  feedback: "합성함수를 정확히 구했습니다. 함수값 계산 과정을 더 자세히 보여주세요.",
                  gradedAt: "2024-01-18 14:52:20"
                },
                studentAnswer: {
                  content: "(1) (f ∘ g)(x) = f(g(x)) = f(x² - 3)\n= 2(x² - 3) + 1 = 2x² - 6 + 1 = 2x² - 5\n\n(2) (g ∘ f)(x) = g(f(x)) = g(2x + 1)\n= (2x + 1)² - 3 = 4x² + 4x + 1 - 3 = 4x² + 4x - 2\n\n(3) f(g(2)) = f(2² - 3) = f(1) = 2(1) + 1 = 3\ng(f(2)) = g(2(2) + 1) = g(5) = 5² - 3 = 22",
                  submittedAt: "2024-01-18 14:47:15",
                  timeSpent: "20분"
                }
              },
              {
                number: 4,
                text: "역함수를 구하고 그래프의 관계를 설명하시오.\n\nf(x) = 3x - 2 (x ∈ ℝ)에 대해\n(1) 역함수 f⁻¹(x)를 구하시오.\n(2) f(x)와 f⁻¹(x)의 그래프의 관계를 설명하시오.\n(3) f(1)과 f⁻¹(1)의 값을 구하시오.",
                maxScore: 25,
                aiGrading: {
                  score: 21,
                  breakdown: {
                    inverse: { score: 10, maxScore: 10, comment: "역함수를 정확히 구함" },
                    relation: { score: 6, maxScore: 10, comment: "그래프 관계 설명이 부족" },
                    values: { score: 5, maxScore: 5, comment: "함수값 계산 정확" }
                  },
                  feedback: "역함수 계산은 완벽합니다. 그래프 관계에 대한 설명을 더 구체적으로 해주세요.",
                  gradedAt: "2024-01-18 14:53:10"
                },
                studentAnswer: {
                  content: "(1) 역함수 구하기:\ny = 3x - 2에서 x와 y를 바꾸면\nx = 3y - 2\n3y = x + 2\ny = (x + 2)/3\n\n따라서 f⁻¹(x) = (x + 2)/3\n\n(2) 그래프 관계:\nf(x)와 f⁻¹(x)의 그래프는 직선 y = x에 대하여 대칭이다.\n\n(3) f(1) = 3(1) - 2 = 1\nf⁻¹(1) = (1 + 2)/3 = 1",
                  submittedAt: "2024-01-18 14:48:25",
                  timeSpent: "30분"
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
          missingScores.push(`${getCategoryDisplayName(categoryName)} ${question.number}번`);
        } else {
          const score = parseInt(manualScores[key]);
          if (isNaN(score) || score < 0 || score > question.maxScore) {
            missingScores.push(`${getCategoryDisplayName(categoryName)} ${question.number}번 (점수 범위 오류)`);
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
                  <span>{getCategoryDisplayName(singleCategoryData![0])} 채점</span>
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
                      <span>{getCategoryDisplayName(categoryName)} {isSingleCategory ? '채점' : '카테고리'}</span>
                      <Badge variant="outline">{categoryData.questions.length}문제</Badge>
                    </div>
                    {!isSingleCategory && (
                      expandedCategories[categoryName] ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                
                {(isSingleCategory || (expandedCategories[categoryName] ?? true)) && (
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
                                  {getCategoryDisplayName(categoryName)} {question.number}번 문제
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
                                      placeholder={`${getCategoryDisplayName(categoryName)} ${question.number}번 문제에 대한 피드백을 작성해주세요...`}
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