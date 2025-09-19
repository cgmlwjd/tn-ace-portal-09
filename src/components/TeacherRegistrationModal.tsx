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
    permissions: {
      questionBankEdit: false,
      accountManagement: false,
      examManagement: false,
      analyticsView: false
    },
    status: '활성'
  });

  // 상태 관리 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        teacherId: editData.email || '',
        teacherName: editData.name || '',
        password: '',
        contact: editData.contact || '',
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
        permissions: {
          questionBankEdit: false,
          accountManagement: false,
          examManagement: false,
          analyticsView: false
        },
        status: '활성'
      });
    }
    // 모달이 열릴 때마다 상태 초기화
    setFormErrors({});
    setSubmitAttempted(false);
    setIsSubmitting(false);
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
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.teacherId.trim()) {
      errors.teacherId = '교사 아이디를 입력해주세요.';
    }
    
    if (!formData.teacherName.trim()) {
      errors.teacherName = '교사 이름을 입력해주세요.';
    }
    
    if (!isEditMode && !formData.password.trim()) {
      errors.password = '비밀번호를 입력해주세요.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      if (!isEditMode) {
        // Reset form only for new registration
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
          },
          status: '활성'
        });
      }
      onClose();
    } catch (error) {
      console.error('교사 등록/수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
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
      },
      status: '활성'
    });
    setFormErrors({});
    setSubmitAttempted(false);
    setIsSubmitting(false);
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

        <div className="space-y-6 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="teacherId">교사 아이디 *</Label>
              <Input 
                id="teacherId" 
                value={formData.teacherId} 
                onChange={e => handleInputChange('teacherId', e.target.value)} 
                placeholder="예: T001" 
                required 
                className={formErrors.teacherId ? "border-red-500" : ""}
              />
              {formErrors.teacherId && (
                <p className="text-sm text-red-500">{formErrors.teacherId}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacherName">교사 이름 *</Label>
              <Input 
                id="teacherName" 
                value={formData.teacherName} 
                onChange={e => handleInputChange('teacherName', e.target.value)} 
                placeholder="예: 김선생" 
                required 
                className={formErrors.teacherName ? "border-red-500" : ""}
              />
              {formErrors.teacherName && (
                <p className="text-sm text-red-500">{formErrors.teacherName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input 
                id="password" 
                type="password" 
                value={formData.password} 
                onChange={e => handleInputChange('password', e.target.value)} 
                placeholder="초기 비밀번호 설정" 
                required 
                className={formErrors.password ? "border-red-500" : ""}
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">연락처</Label>
              <Input 
                id="contact" 
                value={formData.contact} 
                onChange={e => handleInputChange('contact', e.target.value)} 
                placeholder="예: 010-1234-5678" 
              />
            </div>

            <div className="space-y-2">
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
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="활성">활성</SelectItem>
                  <SelectItem value="비활성">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditMode ? '교사 수정 중...' : '교사 등록 중...'}</span>
                </div>
              ) : (
                isEditMode ? '수정' : '등록'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}