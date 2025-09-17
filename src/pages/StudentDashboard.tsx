import React from 'react';
import { StudentDashboard as StudentDashboardComponent } from '@/components/Dashboard/StudentDashboard';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function StudentDashboard() {
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en'>('ko');
  
  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLanguageToggle={handleLanguageToggle}
        currentLanguage={currentLanguage}
      />
      <main className="flex-1">
        <StudentDashboardComponent />
      </main>
      <Footer />
    </div>
  );
}