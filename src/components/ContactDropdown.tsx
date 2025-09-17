import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, MessageCircle, Phone } from 'lucide-react';

export const ContactDropdown: React.FC = () => {
  const handleKakaoContact = () => {
    // 카카오톡 상담 링크로 이동
    window.open('https://pf.kakao.com/_TNAcademy', '_blank');
  };

  const handlePhoneContact = () => {
    // 전화 걸기
    window.location.href = 'tel:010-1234-5678';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className="bg-brand-bronze hover:bg-brand-bronze/90 text-primary-foreground shadow-bronze"
        >
          문의하기
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background border border-border shadow-lg"
      >
        <DropdownMenuItem 
          onClick={handleKakaoContact}
          className="flex items-center space-x-3 py-3 cursor-pointer hover:bg-accent"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full">
            <MessageCircle className="h-4 w-4 text-yellow-800" />
          </div>
          <span className="font-medium">카카오톡으로 문의</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handlePhoneContact}
          className="flex items-center space-x-3 py-3 cursor-pointer hover:bg-accent"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
            <Phone className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">전화로 문의</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};