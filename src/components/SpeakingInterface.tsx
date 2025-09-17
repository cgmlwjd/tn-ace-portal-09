import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Video, VideoOff, Square, Play, Pause, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeakingInterfaceProps {
  question: {
    id: number;
    section: string;
    type: string;
    question: string;
    prepTime: number;
    responseTime: number;
    instruction: string;
  };
  onComplete?: (recording: Blob | null) => void;
}

export const SpeakingInterface: React.FC<SpeakingInterfaceProps> = ({ question, onComplete }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [mediaPermissions, setMediaPermissions] = useState({
    camera: false,
    microphone: false,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [phase, setPhase] = useState<'setup' | 'preparation' | 'recording' | 'completed'>('setup');
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(question.prepTime);
  const [responseTimeRemaining, setResponseTimeRemaining] = useState(question.responseTime);

  // Check media permissions and start camera/microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        console.log('SpeakingInterface: Initializing media...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        streamRef.current = stream;
        setMediaPermissions({ camera: true, microphone: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('SpeakingInterface: Video stream set successfully');
        }

        toast({
          title: "미디어 권한 허용됨",
          description: "카메라와 마이크에 액세스할 수 있습니다.",
        });

      } catch (error) {
        console.error('SpeakingInterface: 미디어 권한 오류:', error);
        setMediaPermissions({ camera: false, microphone: false });
        toast({
          title: "미디어 권한 오류",
          description: "카메라와 마이크 권한이 필요합니다. 브라우저에서 권한을 허용해주세요.",
          variant: "destructive",
        });
      }
    };

    initializeMedia();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (phase === 'preparation' && prepTimeRemaining > 0) {
      interval = setInterval(() => {
        setPrepTimeRemaining(prev => {
          if (prev <= 1) {
            setPhase('recording');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (phase === 'recording' && isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setResponseTimeRemaining(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [phase, prepTimeRemaining, isRecording, isPaused, responseTimeRemaining]);

  const startPreparation = () => {
    setPhase('preparation');
    setPrepTimeRemaining(question.prepTime);
    toast({
      title: "준비 시간 시작",
      description: `${question.prepTime}초 동안 준비하세요.`,
    });
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      toast({
        title: "스트림 오류",
        description: "미디어 스트림을 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        onComplete?.(recordedBlob);
        setPhase('completed');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setResponseTimeRemaining(question.responseTime);

      toast({
        title: "녹화 시작",
        description: "답변을 녹화하고 있습니다.",
      });

    } catch (error) {
      console.error('녹화 시작 오류:', error);
      toast({
        title: "녹화 오류",
        description: "녹화를 시작할 수 없습니다.",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 'setup':
        return '시작 버튼을 눌러 준비 시간을 시작하세요.';
      case 'preparation':
        return `준비 시간: ${formatTime(prepTimeRemaining)}`;
      case 'recording':
        return `녹화 중: ${formatTime(recordingTime)} / ${formatTime(question.responseTime)}`;
      case 'completed':
        return '답변이 성공적으로 녹화되었습니다.';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Video Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>비디오 인터페이스</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video Feed */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              {mediaPermissions.camera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">카메라 권한을 허용해주세요</p>
                  </div>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">REC</span>
                </div>
              )}
              {isPaused && (
                <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">PAUSED</span>
                </div>
              )}
            </div>

            {/* Media Status */}
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Video className={`h-4 w-4 ${mediaPermissions.camera ? 'text-green-600' : 'text-red-600'}`} />
                <span>{mediaPermissions.camera ? '카메라 연결됨' : '카메라 없음'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className={`h-4 w-4 ${mediaPermissions.microphone ? 'text-green-600' : 'text-red-600'}`} />
                <span>{mediaPermissions.microphone ? '마이크 연결됨' : '마이크 없음'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-2">
              {!mediaPermissions.camera && !mediaPermissions.microphone && (
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <Video className="h-4 w-4 mr-2" />
                  권한 재요청
                </Button>
              )}
              
              {phase === 'setup' && mediaPermissions.camera && mediaPermissions.microphone && (
                <Button 
                  onClick={startPreparation} 
                  className="bg-brand-bronze hover:bg-brand-bronze/90"
                >
                  <Play className="h-4 w-4 mr-2" />
                  준비 시작
                </Button>
              )}
              
              {phase === 'recording' && (
                <>
                  <Button 
                    onClick={isPaused ? resumeRecording : pauseRecording}
                    variant="outline"
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button onClick={stopRecording} variant="destructive">
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>{question.section}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Question Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-muted text-sm rounded">{question.type}</span>
              </div>
              
              <div>
                <p className="font-medium text-lg mb-2">{question.question}</p>
                <p className="text-sm text-muted-foreground">{question.instruction}</p>
              </div>
            </div>

            {/* Timer Info */}
            <div className="space-y-2">
              <div className="text-sm">
                <p>준비 시간: {question.prepTime}초</p>
                <p>답변 시간: {question.responseTime}초</p>
              </div>

              {/* Progress Bar for Preparation */}
              {phase === 'preparation' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>준비 시간</span>
                    <span>{formatTime(prepTimeRemaining)}</span>
                  </div>
                  <Progress 
                    value={((question.prepTime - prepTimeRemaining) / question.prepTime) * 100} 
                    className="w-full"
                  />
                </div>
              )}

              {/* Progress Bar for Recording */}
              {phase === 'recording' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>답변 시간</span>
                    <span>{formatTime(responseTimeRemaining)}</span>
                  </div>
                  <Progress 
                    value={(recordingTime / question.responseTime) * 100} 
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Phase Status */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getPhaseMessage()}
              </AlertDescription>
            </Alert>

            {/* Auto-start recording after preparation */}
            {phase === 'recording' && !isRecording && (
              <Button 
                onClick={startRecording} 
                className="w-full bg-brand-bronze hover:bg-brand-bronze/90"
              >
                <Mic className="h-4 w-4 mr-2" />
                답변 녹화 시작
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};