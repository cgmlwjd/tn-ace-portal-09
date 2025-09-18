import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield } from 'lucide-react';
interface TeacherData {
  teacherId: string;
  teacherName: string;
  password: string;
  contact: string;
  subject: '영어' | '수학' | '';
  permissions: {
    questionBankEdit: boolean;
    accountManagement: boolean;
    examManagement: boolean;
    analyticsView: boolean;
  };
  status?: '활성' | '비활성';
}
interface TeacherRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacherData: TeacherData) => void;
  editData?: any;
  isEditMode?: boolean;
}
export function TeacherRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
  isEditMode = false
}: TeacherRegistrationModalProps) {
  const [formData, setFormData] = useState<TeacherData>({
    teacherId: '',
    teacherName: '',
    password: '',
    contact: '',
    subject: '',
    permissions: {
      questionBankEdit: false,
      accountManagement: false,
      examManagement: false,
      analyticsView: false
    },
    status: '활성'
  });

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        teacherId: editData.email || '',
        teacherName: editData.name || '',
        password: '',
        contact: editData.contact || '',
        subject: editData.subject || '',
        permissions: {
          questionBankEdit: false,
          accountManagement: false,
          examManagement: false,
          analyticsView: false
        },
        status: editData.status || '활성'
      });
    } else {
      setFormData({
        teacherId: '',
        teacherName: '',
        password: '',
        contact: '',
        subject: '',
        permissions: {
          questionBankEdit: false,
          accountManagement: false,
          examManagement: false,
          analyticsView: false
        },
        status: '활성'
      });
    }
  }, [isEditMode, editData, isOpen]);
  const handleInputChange = (field: keyof Omit<TeacherData, 'permissions'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handlePermissionChange = (permission: keyof TeacherData['permissions'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditMode) {
      // Reset form only for new registration
      setFormData({
        teacherId: '',
        teacherName: '',
        password: '',
        contact: '',
        subject: '',
        permissions: {
          questionBankEdit: false,
          accountManagement: false,
          examManagement: false,
          analyticsView: false
        },
        status: '활성'
      });
    }
    onClose();
  };
  const handleClose = () => {
    // Reset form when closing
    setFormData({
      teacherId: '',
      teacherName: '',
      password: '',
      contact: '',
      subject: '',
      permissions: {
        questionBankEdit: false,
        accountManagement: false,
        examManagement: false,
        analyticsView: false
      },
      status: '활성'
    });
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <UserPlus className="h-6 w-6 text-primary" />
            <span>{isEditMode ? '교사 정보 수정' : '새 교사 등록'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherId">교사 아이디 *</Label>
                  <Input id="teacherId" value={formData.teacherId} onChange={e => handleInputChange('teacherId', e.target.value)} placeholder="예: T001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherName">교사 이름 *</Label>
                  <Input id="teacherName" value={formData.teacherName} onChange={e => handleInputChange('teacherName', e.target.value)} placeholder="예: 김선생" required />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호 *</Label>
                  <Input id="password" type="password" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="초기 비밀번호 설정" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">연락처</Label>
                  <Input id="contact" value={formData.contact} onChange={e => handleInputChange('contact', e.target.value)} placeholder="예: 010-1234-5678" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 담당 과목 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">담당 과목</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="subject">담당 과목 *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value: '영어' | '수학') => {
                    setFormData(prev => ({
                      ...prev,
                      subject: value
                    }));
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="담당 과목을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="영어">영어</SelectItem>
                    <SelectItem value="수학">수학</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 상태 선택 */}
          {isEditMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">상태 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label>교사 상태 *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: '활성' | '비활성') => {
                      setFormData(prev => ({
                        ...prev,
                        status: value
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="활성">활성</SelectItem>
                      <SelectItem value="비활성">비활성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}


          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" disabled={!formData.teacherName || !formData.teacherId || !formData.subject || (!isEditMode && !formData.password)}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isEditMode ? '교사 수정' : '교사 등록'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}