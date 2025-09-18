import React, { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { SubjectCategorySelector } from '@/components/SubjectCategorySelector';

interface SubjectCombination {
  subject: string;
  category: string;
}

export default function SubjectCategorySelectorDemo() {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [selectedCombinations, setSelectedCombinations] = useState<SubjectCombination[]>([]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  };

  const handleCombinationsChange = (combinations: SubjectCombination[]) => {
    setSelectedCombinations(combinations);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLanguageToggle={handleLanguageToggle} currentLanguage={currentLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">과목 및 카테고리 선택</h1>
            <p className="text-muted-foreground">영어 또는 수학을 선택하고 해당 카테고리를 선택하세요.</p>
          </div>

          <SubjectCategorySelector
            selectedCombinations={selectedCombinations}
            onChange={handleCombinationsChange}
          />

          {/* 선택된 조합 미리보기 */}
          {selectedCombinations.length > 0 && (
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">선택된 조합 (JSON):</h3>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                {JSON.stringify(selectedCombinations, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}