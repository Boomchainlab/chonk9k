import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import ChonkTokenLogo from './ChonkTokenLogo';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type TriviaQuestion = {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardAmount: number;
};

type TriviaPopupProps = {
  onClose: () => void;
};

export default function TriviaPopup({ onClose }: TriviaPopupProps) {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequest<TriviaQuestion>('/api/trivia/random-question');
        setCurrentQuestion(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch trivia question:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchRandomQuestion();
  }, []);

  useEffect(() => {
    if (isLoading || answered || hasError) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAnswered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, answered, hasError]);

  const handleOptionSelect = (optionIndex: number) => {
    if (answered) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = async () => {
    if (selectedOption === null || !currentQuestion) return;

    setAnswered(true);
    const isCorrect = selectedOption === currentQuestion.correctOption;

    if (isCorrect) {
      try {
        // Submit answer to backend to record user's progress and reward
        await apiRequest('/api/trivia/submit-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            selectedOption,
            isCorrect,
          }),
        });

        toast({
          title: 'Correct answer!',
          description: `You've earned ${currentQuestion.rewardAmount} CHONK9K tokens as a reward!`,
          variant: 'default',
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
        toast({
          title: 'Error',
          description: 'Failed to record your answer. Please try again later.',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle the case when we're loading the question
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <ChonkTokenLogo size={24} /> Crypto Trivia Challenge
            </CardTitle>
            <CardDescription className="text-center">Loading your question...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 bg-primary/20 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-primary/20 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-primary/20 rounded w-4/6 mb-6"></div>
              <div className="space-y-3 w-full">
                <div className="h-10 bg-primary/10 rounded w-full"></div>
                <div className="h-10 bg-primary/10 rounded w-full"></div>
                <div className="h-10 bg-primary/10 rounded w-full"></div>
                <div className="h-10 bg-primary/10 rounded w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle error case
  if (hasError || !currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> Error Loading Trivia
            </CardTitle>
            <CardDescription className="text-center">We couldn't load a trivia question at this time.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-4">
            <p className="text-muted-foreground">Please try again later or contact support if the issue persists.</p>
          </CardContent>
          <CardFooter className="flex justify-center pb-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main component when question is loaded
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChonkTokenLogo size={24} />
              <CardTitle>Crypto Trivia</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Time Remaining</span>
              <span>{timeLeft} seconds</span>
            </div>
            <Progress value={(timeLeft / 30) * 100} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="pb-0">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}
              >
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </span>
              <span className="text-xs text-muted-foreground ml-auto flex items-center">
                <Award className="h-3 w-3 mr-1" /> {currentQuestion.rewardAmount} CHONK9K
              </span>
            </div>
            <p className="font-medium mb-4">{currentQuestion.question}</p>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={answered}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${getOptionClass(
                    index,
                    selectedOption,
                    currentQuestion.correctOption,
                    answered
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answered && index === currentQuestion.correctOption && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {answered && currentQuestion.explanation && (
            <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
              <p className="font-medium mb-1">Explanation:</p>
              <p className="text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          {!answered ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="w-full"
              variant={selectedOption === currentQuestion.correctOption ? 'default' : 'outline'}
            >
              {selectedOption === currentQuestion.correctOption ? 'Claim Reward' : 'Close'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-500';
    case 'medium':
      return 'bg-amber-500/20 text-amber-500';
    case 'hard':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-primary/20 text-primary';
  }
}

function getOptionClass(
  optionIndex: number,
  selectedOption: number | null,
  correctOption: number,
  answered: boolean
) {
  if (!answered) {
    return optionIndex === selectedOption
      ? 'border-primary bg-primary/10 font-medium'
      : 'border-border hover:border-primary/50 hover:bg-primary/5';
  }

  if (optionIndex === correctOption) {
    return 'border-green-500 bg-green-500/10 font-medium';
  }

  if (optionIndex === selectedOption) {
    return optionIndex !== correctOption
      ? 'border-red-500 bg-red-500/10 font-medium'
      : 'border-green-500 bg-green-500/10 font-medium';
  }

  return 'border-border opacity-60';
}
