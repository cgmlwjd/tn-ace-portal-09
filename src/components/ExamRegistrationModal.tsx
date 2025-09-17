import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Upload, Download, BookOpen, FileText, Mic, PenTool, X } from 'lucide-react';

interface ExamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (examData: any) => void;
}

type ExamCategory = 'reading' | 'writing' | 'essay' | 'speaking';

interface SchoolGradeCombination {
  schoolSystem: string;
  grade: string;
}

interface ExamFormData {
  title: string;
  selectedSchoolSystems: string[];
  selectedCombinations: SchoolGradeCombination[];
  examDate: string;
  description: string;
  categories: ExamCategory[];
}

const categoryLabels = {
  reading: { name: 'Reading', icon: BookOpen, color: 'text-blue-500' },
  writing: { name: 'Writing', icon: FileText, color: 'text-green-500' },
  essay: { name: 'Essay', icon: PenTool, color: 'text-purple-500' },
  speaking: { name: 'Speaking', icon: Mic, color: 'text-orange-500' }
};

const schoolSystemLabels = {
  korea: '한국',
  usa: '미국',
  uk: '영국'
};

const gradesBySystem = {
  korea: ["초1", "초2", "초3", "중1", "중2", "중3", "고1", "고2", "고3"],
  usa: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
  uk: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"]
};

export default function ExamRegistrationModal({ isOpen, onClose, onComplete }: ExamRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    selectedSchoolSystems: [],
    selectedCombinations: [],
    examDate: '',
    description: '',
    categories: []
  });

  const handleInputChange = (field: keyof ExamFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSchoolSystemChange = (system: string, checked: boolean) => {
    setFormData(prev => {
      let newSelectedSystems = checked 
        ? [...prev.selectedSchoolSystems, system]
        : prev.selectedSchoolSystems.filter(s => s !== system);
      
      // 학제를 해제하면 관련된 조합들도 제거
      let newCombinations = checked
        ? prev.selectedCombinations
        : prev.selectedCombinations.filter(combo => combo.schoolSystem !== system);

      return {
        ...prev,
        selectedSchoolSystems: newSelectedSystems,
        selectedCombinations: newCombinations
      };
    });
  };

  const handleGradeSelection = (schoolSystem: string, grade: string) => {
    setFormData(prev => {
      const existingIndex = prev.selectedCombinations.findIndex(
        combo => combo.schoolSystem === schoolSystem && combo.grade === grade
      );
      
      let newCombinations;
      if (existingIndex >= 0) {
        // 이미 존재하면 제거
        newCombinations = prev.selectedCombinations.filter((_, index) => index !== existingIndex);
      } else {
        // 존재하지 않으면 추가
        newCombinations = [...prev.selectedCombinations, { schoolSystem, grade }];
      }
      
      return {
        ...prev,
        selectedCombinations: newCombinations
      };
    });
  };

  const removeCombination = (schoolSystem: string, grade: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCombinations: prev.selectedCombinations.filter(
        combo => !(combo.schoolSystem === schoolSystem && combo.grade === grade)
      )
    }));
  };

  const handleCategoryChange = (category: ExamCategory, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.categories.length === 0) {
      alert('최소 1개의 문제 카테고리를 선택해주세요.');
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleComplete = () => {
    const examData = {
      ...formData,
      id: Date.now(),
      created: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    onComplete(examData);
    setCurrentStep(1);
    setFormData({
      title: '',
      selectedSchoolSystems: [],
      selectedCombinations: [],
      examDate: '',
      description: '',
      categories: []
    });
    onClose();
  };

  const isStep1Valid = formData.title && formData.selectedCombinations.length > 0 && formData.examDate && formData.categories.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>새 시험 등록</span>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className={`px-3 py-1 rounded-full ${currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                Step 1
              </span>
              <ChevronRight className="h-4 w-4" />
              <span className={`px-3 py-1 rounded-full ${currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                Step 2
              </span>
            </div>
          </DialogTitle>
          <DialogDescription>
            새로운 시험을 등록하고 문제를 업로드할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Step 1: 기본 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">시험 기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="examTitle">시험 제목 *</Label>
                      <Input 
                        id="examTitle" 
                        placeholder="예: 영어 중간고사 - 2학년"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="examDate">시험 일시 *</Label>
                      <Input 
                        id="examDate" 
                        type="datetime-local"
                        value={formData.examDate}
                        onChange={(e) => handleInputChange('examDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">시험 설명</Label>
                    <Textarea 
                      id="description" 
                      placeholder="시험에 대한 추가 설명을 입력하세요"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 학제/학년 다중 선택 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">학제 및 학년 선택 *</CardTitle>
                  <p className="text-sm text-muted-foreground">학제를 선택한 후, 해당 학제의 학년을 선택하세요.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 학제 선택 (체크박스) */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">학제 선택</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(schoolSystemLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                          <Checkbox
                            id={`school-${key}`}
                            checked={formData.selectedSchoolSystems.includes(key)}
                            onCheckedChange={(checked) => handleSchoolSystemChange(key, checked as boolean)}
                          />
                          <Label htmlFor={`school-${key}`} className="font-medium cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 각 선택된 학제에 대한 학년 선택 */}
                  {formData.selectedSchoolSystems.map((schoolSystem) => {
                    const grades = gradesBySystem[schoolSystem as keyof typeof gradesBySystem] || [];
                    const systemLabel = schoolSystemLabels[schoolSystem as keyof typeof schoolSystemLabels];
                    
                    return (
                      <div key={schoolSystem} className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
                        <Label className="text-base font-medium">{systemLabel} 학년 선택</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {grades.map((grade) => {
                            const isSelected = formData.selectedCombinations.some(
                              combo => combo.schoolSystem === schoolSystem && combo.grade === grade
                            );
                            
                            return (
                              <Button
                                key={grade}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => handleGradeSelection(schoolSystem, grade)}
                              >
                                {grade}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* 선택된 조합 태그 표시 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">선택된 학제-학년 조합</Label>
                    <div className="min-h-[2rem] flex flex-wrap gap-2">
                      {formData.selectedCombinations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">선택된 조합이 없습니다.</p>
                      ) : (
                        formData.selectedCombinations.map((combo, index) => {
                          const systemLabel = schoolSystemLabels[combo.schoolSystem as keyof typeof schoolSystemLabels];
                          return (
                            <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                              <span>{systemLabel}-{combo.grade}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeCombination(combo.schoolSystem, combo.grade)}
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

              {/* 문제 카테고리 선택 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">문제 카테고리 선택 *</CardTitle>
                  <p className="text-sm text-muted-foreground">최소 1개, 최대 4개까지 선택 가능합니다.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(categoryLabels).map(([key, { name, icon: Icon, color }]) => (
                      <div key={key} className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={key}
                          checked={formData.categories.includes(key as ExamCategory)}
                          onCheckedChange={(checked) => handleCategoryChange(key as ExamCategory, checked as boolean)}
                        />
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-5 w-5 ${color}`} />
                          <Label htmlFor={key} className="font-medium cursor-pointer">
                            {name}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 선택된 카테고리 표시 */}
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm text-muted-foreground">선택된 카테고리</Label>
                    <div className="min-h-[2rem] flex flex-wrap gap-2">
                      {formData.categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">선택된 카테고리가 없습니다.</p>
                      ) : (
                        formData.categories.map((category) => {
                          const { name, icon: Icon, color } = categoryLabels[category];
                          return (
                            <Badge key={category} variant="secondary" className="flex items-center gap-1">
                              <Icon className={`h-3 w-3 ${color}`} />
                              {name}
                            </Badge>
                          );
                        })
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Step 2: 문제 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">문제 업로드</CardTitle>
                  <p className="text-sm text-muted-foreground">선택하신 카테고리별로 문제를 업로드해주세요.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {formData.categories.map((category) => {
                      const { name, icon: Icon, color } = categoryLabels[category];
                      return (
                        <div key={category} className="border border-border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <Icon className={`h-5 w-5 ${color}`} />
                            <h3 className="font-semibold">{name} 문제</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>문제 파일 업로드</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    클릭하여 파일을 선택하거나 여기에 드롭하세요
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    지원 형식: PDF, DOC, DOCX
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>템플릿 다운로드</Label>
                                <Button variant="outline" className="w-full">
                                  <Download className="h-4 w-4 mr-2" />
                                  {name} 템플릿 다운로드
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  표준 템플릿을 다운로드하여 문제를 작성하세요
                                </p>
                              </div>
                            </div>

                            {/* 카테고리별 추가 옵션 */}
                            {category === 'speaking' && (
                              <div className="space-y-2">
                                <Label>오디오 파일 (선택사항)</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                  <Mic className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                                  <p className="text-sm text-muted-foreground">
                                    Speaking 문제용 오디오 파일을 업로드하세요
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    지원 형식: MP3, WAV, M4A
                                  </p>
                                </div>
                              </div>
                            )}

                            {(category === 'reading' || category === 'writing') && (
                              <div className="space-y-2">
                                <Label>이미지 파일 (선택사항)</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    문제에 사용할 이미지를 업로드하세요
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    지원 형식: JPG, PNG, GIF
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              
              {currentStep === 2 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  이전
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              {currentStep === 1 && (
                <Button 
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                >
                  다음
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 2 && (
                <Button onClick={handleComplete}>
                  등록 완료
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}