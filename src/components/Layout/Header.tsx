import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { LogOut, Globe } from 'lucide-react';
import logo from '@/assets/tnacademy-logo.png';

interface HeaderProps {
  onLanguageToggle?: () => void;
  currentLanguage?: 'ko' | 'en';
}

export const Header: React.FC<HeaderProps> = ({ 
  onLanguageToggle, 
  currentLanguage = 'ko' 
}) => {
  const { user, logout } = useAuth();

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return '학생';
      case 'teacher': return '선생님';
      case 'admin': return '관리자';
      default: return '';
    }
  };

  return (
    <header className="bg-background border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={logo} 
              alt="TN Academy" 
              className="h-16 md:h-20 w-auto"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {onLanguageToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLanguageToggle}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
              </Button>
            )}
            
            {user && (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.name} ({getRoleText(user.role)})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};