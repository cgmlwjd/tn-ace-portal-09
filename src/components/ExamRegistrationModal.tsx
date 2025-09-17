import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Upload, Download, BookOpen, FileText, Mic, PenTool, X } from 'lucide-react';

interface ExamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (examData: any) => void;
}

type ExamCategory = 'reading' | 'writing' | 'essay' | 'speaking';

interface ExamFormData {
  title: string;
  schoolSystem: string[];
  grade: string[];
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

const gradeLabels: Record<string, string> = {
  'elementary-1': '초등 1학년',
  'elementary-2': '초등 2학년',
  'elementary-3': '초등 3학년',
  'elementary-4': '초등 4학년',
  'elementary-5': '초등 5학년',
  'elementary-6': '초등 6학년',
  'middle-1': '중등 1학년',
  'middle-2': '중등 2학년',
  'middle-3': '중등 3학년',
  'high-1': '고등 1학년',
  'high-2': '고등 2학년',
  'high-3': '고등 3학년',
  'grade-1': 'Grade 1',
  'grade-2': 'Grade 2',
  'grade-3': 'Grade 3',
  'grade-4': 'Grade 4',
  'grade-5': 'Grade 5',
  'grade-6': 'Grade 6',
  'grade-7': 'Grade 7',
  'grade-8': 'Grade 8',
  'grade-9': 'Grade 9',
  'grade-10': 'Grade 10',
  'grade-11': 'Grade 11',
  'grade-12': 'Grade 12',
  'year-1': 'Year 1',
  'year-2': 'Year 2',
  'year-3': 'Year 3',
  'year-4': 'Year 4',
  'year-5': 'Year 5',
  'year-6': 'Year 6',
  'year-7': 'Year 7',
  'year-8': 'Year 8',
  'year-9': 'Year 9',
  'year-10': 'Year 10',
  'year-11': 'Year 11',
  'year-12': 'Year 12',
  'year-13': 'Year 13'
};

export default function ExamRegistrationModal({ isOpen, onClose, onComplete }: ExamRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    schoolSystem: [],
    grade: [],
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
    setFormData(prev => ({
      ...prev,
      schoolSystem: checked 
        ? [...prev.schoolSystem, system]
        : prev.schoolSystem.filter(s => s !== system),
      grade: [] // 학제 변경 시 학년 초기화
    }));
  };

  const handleGradeChange = (grade: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      grade: checked 
        ? [...prev.grade, grade]
        : prev.grade.filter(g => g !== grade)
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

  const removeSchoolSystem = (system: string) => {
    setFormData(prev => ({
      ...prev,
      schoolSystem: prev.schoolSystem.filter(s => s !== system),
      grade: [] // 학제 제거 시 학년도 초기화
    }));
  };

  const removeGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grade: prev.grade.filter(g => g !== grade)
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
      schoolSystem: [],
      grade: [],
      examDate: '',
      description: '',
      categories: []
    });
    onClose();
  };

  const isStep1Valid = formData.title && formData.schoolSystem.length > 0 && formData.grade.length > 0 && formData.examDate && formData.categories.length > 0;

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
                  
                   {/* 학제 선택 */}
                   <div className="space-y-3">
                     <Label>학제 * (여러개 선택 가능)</Label>
                     <div className="grid grid-cols-3 gap-3">
                       {[
                         { value: 'korea', label: '한국' },
                         { value: 'usa', label: '미국' },
                         { value: 'uk', label: '영국' }
                       ].map(({ value, label }) => (
                         <div key={value} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                           <Checkbox
                             id={`school-${value}`}
                             checked={formData.schoolSystem.includes(value)}
                             onCheckedChange={(checked) => handleSchoolSystemChange(value, checked as boolean)}
                           />
                           <Label htmlFor={`school-${value}`} className="font-medium cursor-pointer">
                             {label}
                           </Label>
                         </div>
                       ))}
                     </div>
                     
                     {/* 선택된 학제 태그 표시 */}
                     <div className="space-y-2">
                       <Label className="text-sm text-muted-foreground">선택된 학제</Label>
                       <div className="min-h-[2rem] flex flex-wrap gap-2">
                         {formData.schoolSystem.length === 0 ? (
                           <p className="text-sm text-muted-foreground">선택된 학제가 없습니다.</p>
                         ) : (
                           formData.schoolSystem.map((system) => (
                             <Badge key={system} variant="secondary" className="flex items-center gap-1">
                               {schoolSystemLabels[system as keyof typeof schoolSystemLabels]}
                               <X 
                                 className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                 onClick={() => removeSchoolSystem(system)}
                               />
                             </Badge>
                           ))
                         )}
                       </div>
                     </div>
                   </div>

                   {/* 학년 선택 */}
                   {formData.schoolSystem.length > 0 && (
                    <div className="space-y-3">
                      <Label>학년 * (여러개 선택 가능)</Label>
                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                         {formData.schoolSystem.includes('korea') && (
                          <>
                            {[
                              { value: 'elementary-1', label: '초등 1학년' },
                              { value: 'elementary-2', label: '초등 2학년' },
                              { value: 'elementary-3', label: '초등 3학년' },
                              { value: 'elementary-4', label: '초등 4학년' },
                              { value: 'elementary-5', label: '초등 5학년' },
                              { value: 'elementary-6', label: '초등 6학년' },
                              { value: 'middle-1', label: '중등 1학년' },
                              { value: 'middle-2', label: '중등 2학년' },
                              { value: 'middle-3', label: '중등 3학년' },
                              { value: 'high-1', label: '고등 1학년' },
                              { value: 'high-2', label: '고등 2학년' },
                              { value: 'high-3', label: '고등 3학년' }
                            ].map(({ value, label }) => (
                              <div key={value} className="flex items-center space-x-2 p-2 border border-border rounded hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  id={`grade-${value}`}
                                  checked={formData.grade.includes(value)}
                                  onCheckedChange={(checked) => handleGradeChange(value, checked as boolean)}
                                />
                                <Label htmlFor={`grade-${value}`} className="text-xs cursor-pointer">
                                  {label}
                                </Label>
                              </div>
                            ))}
                          </>
                        )}
                        {formData.schoolSystem.includes('usa') && (
                          <>
                            {[
                              { value: 'grade-1', label: 'Grade 1' },
                              { value: 'grade-2', label: 'Grade 2' },
                              { value: 'grade-3', label: 'Grade 3' },
                              { value: 'grade-4', label: 'Grade 4' },
                              { value: 'grade-5', label: 'Grade 5' },
                              { value: 'grade-6', label: 'Grade 6' },
                              { value: 'grade-7', label: 'Grade 7' },
                              { value: 'grade-8', label: 'Grade 8' },
                              { value: 'grade-9', label: 'Grade 9' },
                              { value: 'grade-10', label: 'Grade 10' },
                              { value: 'grade-11', label: 'Grade 11' },
                              { value: 'grade-12', label: 'Grade 12' }
                            ].map(({ value, label }) => (
                              <div key={value} className="flex items-center space-x-2 p-2 border border-border rounded hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  id={`grade-${value}`}
                                  checked={formData.grade.includes(value)}
                                  onCheckedChange={(checked) => handleGradeChange(value, checked as boolean)}
                                />
                                <Label htmlFor={`grade-${value}`} className="text-xs cursor-pointer">
                                  {label}
                                </Label>
                              </div>
                            ))}
                          </>
                        )}
                        {formData.schoolSystem.includes('uk') && (
                          <>
                            {[
                              { value: 'year-1', label: 'Year 1' },
                              { value: 'year-2', label: 'Year 2' },
                              { value: 'year-3', label: 'Year 3' },
                              { value: 'year-4', label: 'Year 4' },
                              { value: 'year-5', label: 'Year 5' },
                              { value: 'year-6', label: 'Year 6' },
                              { value: 'year-7', label: 'Year 7' },
                              { value: 'year-8', label: 'Year 8' },
                              { value: 'year-9', label: 'Year 9' },
                              { value: 'year-10', label: 'Year 10' },
                              { value: 'year-11', label: 'Year 11' },
                              { value: 'year-12', label: 'Year 12' },
                              { value: 'year-13', label: 'Year 13' }
                            ].map(({ value, label }) => (
                              <div key={value} className="flex items-center space-x-2 p-2 border border-border rounded hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  id={`grade-${value}`}
                                  checked={formData.grade.includes(value)}
                                  onCheckedChange={(checked) => handleGradeChange(value, checked as boolean)}
                                />
                                <Label htmlFor={`grade-${value}`} className="text-xs cursor-pointer">
                                  {label}
                                </Label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      
                      {/* 선택된 학년 태그 표시 - [학제 - 학년] 형태로 표시 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">선택된 학년</Label>
                        <div className="min-h-[2rem] flex flex-wrap gap-2">
                          {formData.grade.length === 0 ? (
                            <p className="text-sm text-muted-foreground">선택된 학년이 없습니다.</p>
                          ) : (
                            formData.grade.map((grade) => {
                              // 학년에 따라 해당 학제 찾기
                              let schoolSystemName = '';
                              if (grade.startsWith('elementary-') || grade.startsWith('middle-') || grade.startsWith('high-')) {
                                schoolSystemName = '한국';
                              } else if (grade.startsWith('grade-')) {
                                schoolSystemName = '미국';
                              } else if (grade.startsWith('year-')) {
                                schoolSystemName = '영국';
                              }
                              
                              return (
                                <Badge key={grade} variant="secondary" className="flex items-center gap-1">
                                  [{schoolSystemName} - {gradeLabels[grade]}]
                                  <X 
                                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                    onClick={() => removeGrade(grade)}
                                  />
                                </Badge>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}

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
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">문제 업로드</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    선택한 카테고리: {formData.categories.map(cat => categoryLabels[cat].name).join(', ')}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {formData.categories.map((category) => {
                      const { name, icon: Icon, color } = categoryLabels[category];
                      return (
                        <div key={category} className="border border-border rounded-lg p-6 space-y-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <Icon className={`h-6 w-6 ${color}`} />
                            <h3 className="text-lg font-semibold">{name} 문제</h3>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">엑셀 파일 업로드</Label>
                              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground mb-2">
                                  {name} 문제 파일을 업로드하세요
                                </p>
                                <Button variant="outline" size="sm">파일 선택</Button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-medium">템플릿 다운로드</Label>
                              <div className="flex flex-col space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                  <Download className="h-4 w-4 mr-2" />
                                  {name} 템플릿 다운로드
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  {name} 문제 업로드 형식을 확인하세요
                                </p>
                              </div>
                            </div>
                          </div>

                          {category === 'speaking' && (
                            <div className="border-t border-border pt-4">
                              <Label className="text-sm font-medium block mb-2">
                                음성 파일 (Speaking 시험용)
                              </Label>
                              <Input type="file" accept="audio/*" className="text-sm" />
                            </div>
                          )}

                          {(category === 'reading' || category === 'writing') && (
                            <div className="border-t border-border pt-4">
                              <Label className="text-sm font-medium block mb-2">
                                이미지 파일 (도형/그림 문제용)
                              </Label>
                              <Input type="file" accept="image/*" multiple className="text-sm" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 네비게이션 버튼 */}
          <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-border space-y-3 sm:space-y-0">
            <div>
              {currentStep === 2 && (
                <Button variant="outline" onClick={handlePrevious} className="w-full sm:w-auto">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  이전
                </Button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                취소
              </Button>
              {currentStep === 1 ? (
                <Button onClick={handleNext} disabled={!isStep1Valid} className="w-full sm:w-auto">
                  다음
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="w-full sm:w-auto">
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