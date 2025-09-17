import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: StudentFormData) => void;
}

interface StudentFormData {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  studentId: string;
  password: string;
  educationSystem: 'korean' | 'american' | 'british';
  grade: string;
  contact: string;
  classNumber: string;
  memo: string;
}

const gradeOptions = {
  korean: [
    '초1', '초2', '초3', '초4', '초5', '초6',
    '중1', '중2', '중3',
    '고1', '고2', '고3'
  ],
  american: [
    'K', 'grade 1', 'grade 2', 'grade 3', 'grade 4', 'grade 5',
    'grade 6', 'grade 7', 'grade 8',
    'grade 9', 'grade 10', 'grade 11', 'grade 12'
  ],
  british: [
    'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
    'Year 7', 'Year 8', 'Year 9',
    'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ]
};

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    birthDate: '',
    gender: 'male',
    studentId: '',
    password: '',
    educationSystem: 'korean',
    grade: '',
    contact: '',
    classNumber: '',
    memo: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      name: '',
      birthDate: '',
      gender: 'male',
      studentId: '',
      password: '',
      educationSystem: 'korean',
      grade: '',
      contact: '',
      classNumber: '',
      memo: ''
    });
    onClose();
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 학생 등록</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="학생 이름을 입력하세요"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일 *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* 성별 */}
          <div className="space-y-3">
            <Label>성별 *</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">남성</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">여성</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 아이디 및 비밀번호 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">아이디 *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="로그인에 사용할 아이디를 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
          </div>

          {/* 학제 및 학년 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>학제 *</Label>
              <Select
                value={formData.educationSystem}
                onValueChange={(value: 'korean' | 'american' | 'british') => {
                  handleInputChange('educationSystem', value);
                  handleInputChange('grade', ''); // 학제 변경 시 학년 초기화
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="학제를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="korean">한국</SelectItem>
                  <SelectItem value="american">미국</SelectItem>
                  <SelectItem value="british">영국</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>학년 *</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => handleInputChange('grade', value)}
                disabled={!formData.educationSystem}
              >
                <SelectTrigger>
                  <SelectValue placeholder="학년을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions[formData.educationSystem]?.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 연락처 및 반 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">연락처</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classNumber">반</Label>
              <Input
                id="classNumber"
                value={formData.classNumber}
                onChange={(e) => handleInputChange('classNumber', e.target.value)}
                placeholder="A반, 1반 등"
              />
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea
              id="memo"
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              placeholder="학생에 대한 추가 정보나 특이사항을 입력하세요"
              rows={3}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.birthDate || !formData.studentId || !formData.password || !formData.educationSystem || !formData.grade}
            className="bg-brand-bronze hover:bg-brand-bronze/90 text-primary-foreground"
          >
            등록
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};