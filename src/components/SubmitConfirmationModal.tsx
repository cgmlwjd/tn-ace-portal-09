import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SubmitConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
}

export function SubmitConfirmationModal({ open, onOpenChange, sectionName }: SubmitConfirmationModalProps) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    onOpenChange(false);
    // Navigate to student dashboard after submission
    navigate('/student');
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>정말 제출하시겠습니까?</DialogTitle>
          <DialogDescription>
            제출하면 더 이상 수정할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            취소
          </Button>
          <Button variant="destructive" onClick={handleSubmit} className="w-full sm:w-auto">
            제출
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}