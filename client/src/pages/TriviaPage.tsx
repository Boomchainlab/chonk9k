import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trophy, Check, AlertTriangle } from 'lucide-react';

interface TriviaQuiz {
  id: number;
  title: string;
  description: string;
  rewardAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  difficulty: string;
}

interface TriviaQuestion {
  id: number;
  quizId: number;
  question: string;
  options: string[];
  category: string;
  points: number;
}

interface TriviaSubmission {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  completed: boolean;
  rewardClaimed: boolean;
  submittedAt: string;
}

const mockUserId = 1; // In a real app, this would come from auth context

export default function TriviaPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentAnswers, setCurrentAnswers] = useState<number[]>([]);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  
  // Get current active quiz
  const { data: currentQuiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['/api/trivia/current-quiz'],
    queryFn: async () => {
      try {
        const response = await apiRequest<TriviaQuiz>('/api/trivia/current-quiz');
        return response;
      } catch (error) {
        // If there's no active quiz, return null
        if (error instanceof Response && error.status === 404) {
          return null;
        }
        throw error;
      }
    }
  });
  
  // Get questions for the current quiz
  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['/api/trivia/quizzes', currentQuiz?.id, 'questions'],
    queryFn: async () => {
      if (!currentQuiz) return [];
      const response = await apiRequest<TriviaQuestion[]>(`/api/trivia/quizzes/${currentQuiz.id}/questions`);
      return response;
    },
    enabled: !!currentQuiz
  });
  
  // Get user's submission for this quiz
  const { data: userSubmission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ['/api/trivia/quizzes', currentQuiz?.id, 'submissions', mockUserId],
    queryFn: async () => {
      if (!currentQuiz) return null;
      try {
        const response = await apiRequest<TriviaSubmission>(
          `/api/trivia/quizzes/${currentQuiz.id}/submissions/${mockUserId}`
        );
        return response;
      } catch (error) {
        // If there's no submission yet, return null
        if (error instanceof Response && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!currentQuiz
  });
  
  // Initialize answers array
  useEffect(() => {
    if (questions?.length) {
      setCurrentAnswers(new Array(questions.length).fill(-1));
    }
  }, [questions]);
  
  // Handle answer selection
  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    setCurrentAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };
  
  // Submit quiz answers
  const submitAnswersMutation = useMutation({
    mutationFn: async () => {
      if (!currentQuiz) throw new Error('No active quiz');
      if (!questions?.length) throw new Error('No questions loaded');
      
      // Make sure all questions are answered
      if (currentAnswers.some(a => a === -1)) {
        throw new Error('Please answer all questions before submitting');
      }
      
      const response = await apiRequest(`/api/trivia/quizzes/${currentQuiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: mockUserId,
          answers: currentAnswers
        })
      });
      
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: 'Quiz Submitted!',
        description: `You scored ${data.score} out of ${data.totalQuestions} questions.`,
      });
      
      setSubmissionId(data.submission.id);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['/api/trivia/quizzes', currentQuiz?.id, 'submissions', mockUserId] 
      });
    },
    onError: (error) => {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit answers',
        variant: 'destructive'
      });
    }
  });
  
  // Claim rewards
  const claimRewardMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      const response = await apiRequest(`/api/trivia/submissions/${submissionId}/claim-reward`, {
        method: 'POST'
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: 'Reward Claimed!',
        description: `You received ${data.rewardAmount} $CHONK9K tokens!`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['/api/trivia/quizzes', currentQuiz?.id, 'submissions', mockUserId] 
      });
    },
    onError: (error) => {
      console.error('Error claiming reward:', error);
      toast({
        title: 'Failed to Claim Reward',
        description: 'Something went wrong while claiming your reward.',
        variant: 'destructive'
      });
    }
  });
  
  // Helper to format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };
  
  const isLoading = isLoadingQuiz || isLoadingQuestions || isLoadingSubmission;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Weekly Crypto Trivia Challenge</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Test your crypto knowledge and earn $CHONK9K tokens!
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading trivia challenge...</span>
        </div>
      ) : !currentQuiz ? (
        <Card>
          <CardHeader>
            <CardTitle>No Active Trivia Challenge</CardTitle>
            <CardDescription>
              There's no active trivia challenge right now. Please check back later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Trivia challenges are posted weekly with new questions about cryptocurrency, blockchain, and the crypto ecosystem.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : userSubmission?.completed ? (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Completed</CardTitle>
            <CardDescription>
              You've already completed this week's trivia challenge!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center flex-col my-6">
                <Trophy className="h-16 w-16 text-yellow-500 mb-2" />
                <h3 className="text-xl font-bold">Your Score: {userSubmission.score}</h3>
                <p className="text-muted-foreground">
                  {questions?.length ? `Out of ${questions.length} questions` : ''}
                </p>
              </div>
              
              {userSubmission.score > 0 && !userSubmission.rewardClaimed && (
                <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <AlertTitle>Reward Available!</AlertTitle>
                  <AlertDescription>
                    You can claim your $CHONK9K token reward now.
                  </AlertDescription>
                </Alert>
              )}
              
              {userSubmission.rewardClaimed && (
                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertTitle>Reward Claimed!</AlertTitle>
                  <AlertDescription>
                    You've already claimed your $CHONK9K tokens for this quiz.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            {userSubmission.score > 0 && !userSubmission.rewardClaimed && (
              <Button 
                className="w-full sm:w-auto" 
                onClick={() => claimRewardMutation.mutate(userSubmission.id)}
                disabled={claimRewardMutation.isPending}
              >
                {claimRewardMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Claim {currentQuiz.rewardAmount} $CHONK9K Tokens
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{currentQuiz.title}</CardTitle>
            <CardDescription>
              {currentQuiz.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-between mb-6 text-sm">
              <div>
                <span className="font-medium">Available:</span>{' '}
                {formatDateRange(currentQuiz.startDate, currentQuiz.endDate)}
              </div>
              <div>
                <span className="font-medium">Difficulty:</span>{' '}
                <span className="capitalize">{currentQuiz.difficulty}</span>
              </div>
              <div>
                <span className="font-medium">Reward:</span>{' '}
                {currentQuiz.rewardAmount} $CHONK9K
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            {questions && questions.length > 0 ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  submitAnswersMutation.mutate();
                }}
                className="space-y-8"
              >
                {questions.map((question, qIndex) => (
                  <div key={question.id} className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="bg-muted/40 p-4 rounded-md">
                      <RadioGroup
                        value={currentAnswers[qIndex]?.toString()}
                        onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}
                      >
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2 py-2">
                            <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                            <Label htmlFor={`q${qIndex}-o${oIndex}`} className="cursor-pointer">{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    {qIndex < questions.length - 1 && <Separator />}
                  </div>
                ))}
                
                {currentAnswers.some(a => a === -1) && (
                  <Alert variant="destructive" className="mt-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Incomplete Answers</AlertTitle>
                    <AlertDescription>
                      Please answer all questions before submitting.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={currentAnswers.some(a => a === -1) || submitAnswersMutation.isPending}
                >
                  {submitAnswersMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : 'Submit Answers'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No questions available for this quiz.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}