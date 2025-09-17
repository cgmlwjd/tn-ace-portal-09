import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Shield } from 'lucide-react';
interface TeacherData {
  teacherId: string;
  teacherName: string;
  password: string;
  contact: string;
  permissions: {
    questionBankEdit: boolean;
    accountManagement: boolean;
    examManagement: boolean;
    analyticsView: boolean;
  };
}
interface TeacherRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacherData: TeacherData) => void;
}
export function TeacherRegistrationModal({
  isOpen,
  onClose,
  onSubmit
}: TeacherRegistrationModalProps) {
  const [formData, setFormData] = useState<TeacherData>({
    teacherId: '',
    teacherName: '',
    password: '',
    contact: '',
    permissions: {
      questionBankEdit: false,
      accountManagement: false,
      examManagement: false,
      analyticsView: false
    }
  });
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
    // Reset form
    setFormData({
      teacherId: '',
      teacherName: '',
      password: '',
      contact: '',
      permissions: {
        questionBankEdit: false,
        accountManagement: false,
        examManagement: false,
        analyticsView: false
      }
    });
    onClose();
  };
  const handleClose = () => {
    // Reset form when closing
    setFormData({
      teacherId: '',
      teacherName: '',
      password: '',
      contact: '',
      permissions: {
        questionBankEdit: false,
        accountManagement: false,
        examManagement: false,
        analyticsView: false
      }
    });
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <UserPlus className="h-6 w-6 text-primary" />
            <span>새 교사 등록</span>
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


          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit">
              <UserPlus className="h-4 w-4 mr-2" />
              교사 등록
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}