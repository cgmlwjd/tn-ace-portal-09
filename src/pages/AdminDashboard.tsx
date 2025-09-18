import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { 
  Users, 
  GraduationCap, 
  Shield, 
  Search, 
  UserPlus, 
  Edit, 
  Trash2,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react';
import { StudentRegistrationModal } from '@/components/StudentRegistrationModal';
import { TeacherRegistrationModal } from '@/components/TeacherRegistrationModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  const { toast } = useToast();

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };
  const handleStudentRegistration = (studentData: any) => {
    console.log('Registering student:', studentData);
    // TODO: Implement student registration logic
  };

  const handleTeacherRegistration = (teacherData: any) => {
    console.log('Registering teacher:', teacherData);
    // TODO: Implement teacher registration logic
    toast({
      title: "교사 등록 완료",
      description: "새 교사가 성공적으로 등록되었습니다.",
    });
  };

  const handleStudentEdit = (student: any) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleTeacherEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setIsTeacherModalOpen(true);
  };

  const handleStudentUpdate = (studentData: any) => {
    setPendingUpdate({ type: 'student', data: studentData });
    setShowConfirmDialog(true);
  };

  const handleTeacherUpdate = (teacherData: any) => {
    setPendingUpdate({ type: 'teacher', data: teacherData });
    setShowConfirmDialog(true);
  };

  const confirmUpdate = () => {
    if (pendingUpdate) {
      console.log('Updating:', pendingUpdate);
      // TODO: Implement actual update logic
      toast({
        title: `${pendingUpdate.type === 'student' ? '학생' : '교사'} 정보 업데이트 완료`,
        description: "정보가 성공적으로 수정되었습니다.",
      });
      setShowConfirmDialog(false);
      setPendingUpdate(null);
      setEditingStudent(null);
      setEditingTeacher(null);
      setIsStudentModalOpen(false);
      setIsTeacherModalOpen(false);
    }
  };

  const closeModals = () => {
    setEditingStudent(null);
    setEditingTeacher(null);
    setIsStudentModalOpen(false);
    setIsTeacherModalOpen(false);
  };

  // Mock data
  const systemStats = {
    totalStudents: 156,
    activeStudents: 142,
    totalTeachers: 8,
    activeTeachers: 7,
    totalExams: 45,
    systemUptime: '99.8%'
  };

  const students = [
    {
      id: 1,
      name: '김민수',
      email: 'minsu.kim@student.com',
      grade: '2학년',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20 14:30',
      examsTaken: 12
    },
    {
      id: 2,
      name: '이지은',
      email: 'jieun.lee@student.com',
      grade: '3학년',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-20 09:15',
      examsTaken: 18
    },
    {
      id: 3,
      name: '박상현',
      email: 'sanghyun.park@student.com',
      grade: '1학년',
      status: 'inactive',
      joinDate: '2023-12-20',
      lastLogin: '2024-01-18 16:45',
      examsTaken: 8
    },
    {
      id: 4,
      name: '최유나',
      email: 'yuna.choi@student.com',
      grade: '2학년',
      status: 'active',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-20 11:20',
      examsTaken: 15
    }
  ];

  const teachers = [
    {
      id: 1,
      name: '이선생',
      email: 'teacher.lee@tnacademy.com',
      subject: '영어',
      status: 'active',
      joinDate: '2023-09-01',
      lastLogin: '2024-01-20 08:30',
      examsCreated: 25
    },
    {
      id: 2,
      name: '김교수',
      email: 'prof.kim@tnacademy.com',
      subject: '수학',
      status: 'active',
      joinDate: '2023-08-15',
      lastLogin: '2024-01-19 17:45',
      examsCreated: 18
    },
    {
      id: 3,
      name: '박선생',
      email: 'teacher.park@tnacademy.com',
      subject: '과학',
      status: 'inactive',
      joinDate: '2023-11-01',
      lastLogin: '2024-01-17 14:20',
      examsCreated: 12
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">관리자 대시보드</h1>
                <p className="text-muted-foreground">시스템 및 사용자 관리</p>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-bronze">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">전체 학생</p>
                    <p className="text-2xl font-bold">{systemStats.totalStudents}</p>
                    <p className="text-xs text-green-600">활성: {systemStats.activeStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-bronze">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">전체 교사</p>
                    <p className="text-2xl font-bold">{systemStats.totalTeachers}</p>
                    <p className="text-xs text-green-600">활성: {systemStats.activeTeachers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-2">
              <TabsTrigger value="students">학생 관리</TabsTrigger>
              <TabsTrigger value="teachers">교사 관리</TabsTrigger>
            </TabsList>

            {/* 학생 관리 탭 */}
            <TabsContent value="students" className="space-y-6">
              {/* 검색 및 추가 */}
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>학생 관리</span>
                    </div>
                    <Button onClick={() => setIsStudentModalOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      새 학생 추가
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="학생 이름 또는 이메일로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="학년" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="1">1학년</SelectItem>
                        <SelectItem value="2">2학년</SelectItem>
                        <SelectItem value="3">3학년</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 학생 목록 */}
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-foreground">{student.name}</h4>
                              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                {student.status === 'active' ? '활성' : '비활성'}
                              </Badge>
                              <Badge variant="outline">{student.grade}</Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                              <span className="text-sm text-muted-foreground">{student.email}</span>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-muted-foreground">
                                <span>최근 로그인: {student.lastLogin}</span>
                                <span>응시한 시험: {student.examsTaken}회</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStudentEdit(student)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="text-sm">수정</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* 교사 관리 탭 */}
            <TabsContent value="teachers" className="space-y-6">
              {/* 검색 및 추가 */}
              <Card className="shadow-bronze">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5" />
                      <span>교사 관리</span>
                    </div>
                    <Button onClick={() => setIsTeacherModalOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      새 교사 추가
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="교사 이름 또는 이메일로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="과목" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="english">영어</SelectItem>
                        <SelectItem value="math">수학</SelectItem>
                        <SelectItem value="science">과학</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 교사 목록 */}
                  <div className="space-y-3">
                    {filteredTeachers.map((teacher) => (
                      <div key={teacher.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-foreground">{teacher.name}</h4>
                              <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                                {teacher.status === 'active' ? '활성' : '비활성'}
                              </Badge>
                              <Badge variant="outline">{teacher.subject}</Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                              <span className="text-sm text-muted-foreground">{teacher.email}</span>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-muted-foreground">
                                <span>최근 로그인: {teacher.lastLogin}</span>
                                <span>생성한 시험: {teacher.examsCreated}개</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleTeacherEdit(teacher)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="text-sm">수정</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </TabsContent>
          </Tabs>
        </div>
      </main>

      <StudentRegistrationModal
        isOpen={isStudentModalOpen}
        onClose={closeModals}
        onSubmit={editingStudent ? handleStudentUpdate : handleStudentRegistration}
        editData={editingStudent}
        isEditMode={!!editingStudent}
      />

      <TeacherRegistrationModal
        isOpen={isTeacherModalOpen}
        onClose={closeModals}
        onSubmit={editingTeacher ? handleTeacherUpdate : handleTeacherRegistration}
        editData={editingTeacher}
        isEditMode={!!editingTeacher}
      />

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정보 수정 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 수정하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}