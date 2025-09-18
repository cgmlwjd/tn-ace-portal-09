import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

interface SubjectCombination {
  subject: string;
  category: string;
}

interface SubjectCategorySelectorProps {
  selectedCombinations: SubjectCombination[];
  onChange: (combinations: SubjectCombination[]) => void;
}

const subjectLabels = {
  english: '영어',
  math: '수학'
};

const categoriesBySubject = {
  english: ['reading', 'writing', 'essay', 'speaking'],
  math: ['객관식', '주관식', '서술형']
};

const categoryLabels = {
  reading: 'Reading',
  writing: 'Writing',
  essay: 'Essay', 
  speaking: 'Speaking',
  객관식: '객관식',
  주관식: '주관식',
  서술형: '서술형'
};

export const SubjectCategorySelector: React.FC<SubjectCategorySelectorProps> = ({ 
  selectedCombinations, 
  onChange 
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleCategorySelection = (subject: string, category: string) => {
    const combinationExists = selectedCombinations.some(
      combo => combo.subject === subject && combo.category === category
    );

    let newCombinations: SubjectCombination[];
    if (combinationExists) {
      // Remove combination
      newCombinations = selectedCombinations.filter(
        combo => !(combo.subject === subject && combo.category === category)
      );
    } else {
      // Add combination
      newCombinations = [...selectedCombinations, { subject, category }];
    }

    onChange(newCombinations);
  };

  const removeCombination = (subject: string, category: string) => {
    const newCombinations = selectedCombinations.filter(
      combo => !(combo.subject === subject && combo.category === category)
    );
    onChange(newCombinations);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">학제 및 학년 선택 *</CardTitle>
        <p className="text-sm text-muted-foreground">학제를 선택한 후, 해당 학제의 학년을 선택하세요.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 과목 선택 */}
        <div className="space-y-4">
          <Label className="text-base font-medium">학제 선택</Label>
          <RadioGroup 
            value={selectedSubject}
            onValueChange={handleSubjectChange}
            className="grid grid-cols-3 gap-4"
          >
            {Object.entries(subjectLabels).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem 
                  value={key} 
                  id={`subject-${key}`}
                />
                <Label htmlFor={`subject-${key}`} className="font-medium cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 선택된 과목에 대한 카테고리 선택 */}
        {selectedSubject && (
          <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
            <Label className="text-base font-medium">
              {subjectLabels[selectedSubject as keyof typeof subjectLabels]} 학년 선택
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {categoriesBySubject[selectedSubject as keyof typeof categoriesBySubject]?.map((category) => {
                const isSelected = selectedCombinations.some(
                  combo => combo.subject === selectedSubject && combo.category === category
                );
                
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleCategorySelection(selectedSubject, category)}
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* 선택된 학제·학년 조합 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">선택된 학제·학년 조합</Label>
          <div className="min-h-[2rem] flex flex-wrap gap-2">
            {selectedCombinations.length === 0 ? (
              <p className="text-sm text-muted-foreground">선택된 조합이 없습니다.</p>
            ) : (
              selectedCombinations.map((combo, index) => {
                const subjectLabel = subjectLabels[combo.subject as keyof typeof subjectLabels];
                const categoryDisplay = categoryLabels[combo.category as keyof typeof categoryLabels];
                
                return (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                    <span>{subjectLabel}-{categoryDisplay}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeCombination(combo.subject, combo.category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};