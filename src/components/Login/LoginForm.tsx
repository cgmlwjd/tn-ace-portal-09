import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth, type UserRole } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserRole>('student');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(username, password)) {
      toast({
        title: '로그인 성공',
        description: '환영합니다!',
      });
    } else {
      toast({
        title: '로그인 실패',
        description: '아이디 또는 비밀번호가 올바르지 않습니다.',
        variant: 'destructive',
      });
    }
  };

  const quickLogin = (role: UserRole) => {
    const credentials = {
      student: { username: 'student', password: '1234' },
      teacher: { username: 'teacher', password: '1234' },
      admin: { username: 'admin', password: '1234' },
    };
    
    setUserType(role);
    setUsername(credentials[role].username);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-accent p-4">
      <Card className="w-full max-w-md shadow-bronze">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand-dark">TN Academy 로그인</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>사용자 타입</Label>
              <RadioGroup 
                value={userType} 
                onValueChange={(value: UserRole) => setUserType(value)}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="cursor-pointer">학생</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher" className="cursor-pointer">선생님</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="cursor-pointer">관리자</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" variant="default">
              로그인
            </Button>
          </form>
          
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground text-center mb-4">
              테스트 계정으로 빠른 로그인:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => quickLogin('student')}
                className="text-xs"
              >
                학생 (student / 1234)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => quickLogin('teacher')}
                className="text-xs"
              >
                선생님 (teacher / 1234)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => quickLogin('admin')}
                className="text-xs"
              >
                관리자 (admin / 1234)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};