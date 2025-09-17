import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { StudentRegistrationModal } from '@/components/StudentRegistrationModal';

const students = [
  { id: 1, name: '김민수', email: 'minsu@example.com', grade: '3학년', status: 'active', joinDate: '2024-01-10' },
  { id: 2, name: '이지현', email: 'jihyun@example.com', grade: '2학년', status: 'active', joinDate: '2024-01-12' },
  { id: 3, name: '박준호', email: 'junho@example.com', grade: '3학년', status: 'inactive', joinDate: '2024-01-08' },
  { id: 4, name: '최서연', email: 'seoyeon@example.com', grade: '1학년', status: 'active', joinDate: '2024-01-15' },
];

const teachers = [
  { id: 1, name: '김영희', email: 'younghee.kim@example.com', subject: '영어', status: 'active', joinDate: '2023-03-15' },
  { id: 2, name: '이철수', email: 'chulsoo.lee@example.com', subject: '수학', status: 'active', joinDate: '2023-05-20' },
  { id: 3, name: '박민정', email: 'minjung.park@example.com', subject: '과학', status: 'inactive', joinDate: '2023-01-10' },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleAddUser = () => {
    console.log('Adding user:', newUserForm);
    // TODO: Implement user addition logic
    setNewUserForm({ name: '', email: '', password: '', role: 'student' });
  };

  const handleStudentRegistration = (studentData: any) => {
    console.log('Registering student:', studentData);
    // TODO: Implement student registration logic
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">관리자 대시보드</h1>
        <p className="text-muted-foreground">학생과 교사 계정을 관리하세요.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 학생 수</p>
                <p className="text-2xl font-bold text-brand-bronze">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-brand-bronze" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 학생</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 교사 수</p>
                <p className="text-2xl font-bold text-brand-bronze">{teachers.length}</p>
              </div>
              <Users className="h-8 w-8 text-brand-bronze" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 교사</p>
                <p className="text-2xl font-bold text-green-600">
                  {teachers.filter(t => t.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>사용자 관리</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="students">학생 관리</TabsTrigger>
                  <TabsTrigger value="teachers">교사 관리</TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">학생 목록</h3>
                    <Button 
                      onClick={() => setIsStudentModalOpen(true)}
                      className="bg-brand-bronze hover:bg-brand-bronze/90 text-primary-foreground shadow-bronze"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      새 학생 추가
                    </Button>
                  </div>
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{student.name}</h4>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                            {student.status === 'active' ? '활성' : '비활성'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-sm text-muted-foreground">{student.grade} • 가입일: {student.joinDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="teachers" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">교사 목록</h3>
                    <Button 
                      variant="outline"
                      className="border-brand-bronze text-brand-bronze hover:bg-brand-bronze hover:text-primary-foreground"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      새 교사 추가
                    </Button>
                  </div>
                  {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{teacher.name}</h4>
                          <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                            {teacher.status === 'active' ? '활성' : '비활성'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        <p className="text-sm text-muted-foreground">{teacher.subject} • 가입일: {teacher.joinDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>빠른 작업</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                새 교사 등록
              </Button>
              
              <Button className="w-full" variant="outline">
                시험 일정 관리
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <StudentRegistrationModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleStudentRegistration}
      />
    </div>
  );
};