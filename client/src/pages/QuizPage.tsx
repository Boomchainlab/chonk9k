import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, HelpCircle, Timer, Trophy, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import { apiRequest } from '@/lib/queryClient';
import { TriviaQuiz, TriviaQuestion } from '@shared/schema';

const QuizPage: React.FC = () => {
  const [, params] = useRoute('/trivia/:id');
  const quizId = params?.id;
  const { account } = useChonkWallet();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [quiz, setQuiz] = useState<TriviaQuiz | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(900); // 15 minutes in seconds
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number, correctAnswers: number } | null>(null);
  
  // Load quiz and questions
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch quiz details
        const quizResponse = await apiRequest('GET', `/api/trivia/quizzes/${quizId}`);
        const quizData = await quizResponse.json();
        
        if (quizData.error) {
          toast({
            title: 'Error',
            description: quizData.error,
            variant: 'destructive'
          });
          return;
        }
        
        setQuiz(quizData.quiz);
        
        // Fetch questions
        const questionsResponse = await apiRequest('GET', `/api/trivia/quizzes/${quizId}/questions`);
        const questionsData = await questionsResponse.json();
        
        if (questionsData.error) {
          toast({
            title: 'Error',
            description: questionsData.error,
            variant: 'destructive'
          });
          return;
        }
        
        setQuestions(questionsData.questions);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the quiz. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuizData();
    
    // Set up the timer
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizId, toast]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    if (!account || !quizId) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet to submit the quiz.',
        variant: 'destructive'
      });
      return;
    }
    
    // Check if all questions have been answered
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < questions.length) {
      toast({
        title: 'Incomplete Quiz',
        description: `Please answer all questions. You've answered ${answeredQuestions} out of ${questions.length} questions.`,
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const submission = {
        userId: account,
        quizId: parseInt(quizId),
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: parseInt(questionId),
          selectedAnswer
        }))
      };
      
      const response = await apiRequest('POST', `/api/trivia/quizzes/${quizId}/submit`, submission);
      const result = await response.json();
      
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        });
        return;
      }
      
      setQuizSubmitted(true);
      setQuizResult({
        score: result.score,
        correctAnswers: result.correctAnswers
      });
      
      toast({
        title: 'Quiz Submitted',
        description: `Your score: ${result.score}%`,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit the quiz. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderQuestion = () => {
    if (questions.length === 0) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <Card className="bg-black/80 border border-[#ff00ff]/30 mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Badge className="bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <Badge className="bg-[#00e0ff]/20 text-[#00e0ff] border border-[#00e0ff]/30 flex items-center">
              <Timer className="h-3 w-3 mr-1" /> {formatTime(remainingTime)}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-white mt-2">
            {currentQuestion.question}
          </CardTitle>
          {currentQuestion.category && (
            <CardDescription className="text-gray-400">
              Category: {currentQuestion.category}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString() || ''}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${answers[currentQuestion.id] === index ? 'border-[#ff00ff]/70 bg-[#ff00ff]/10' : 'border-gray-800 bg-black/50'} hover:border-[#ff00ff]/50 transition-colors`}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  className="text-[#ff00ff]"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`text-${answers[currentQuestion.id] === index ? 'white' : 'gray-300'} cursor-pointer flex-1`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            className="border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || Object.keys(answers).length !== questions.length}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  const renderQuizProgress = () => {
    return (
      <Card className="bg-black/80 border border-[#ff00ff]/30 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className={`w-8 h-8 p-0 font-medium ${answers[question.id] !== undefined ? 'bg-[#ff00ff]/20 border-[#ff00ff]/70 text-white' : 'border-gray-700 text-gray-400'}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderQuizResult = () => {
    if (!quizResult || !quiz) return null;
    
    const { score, correctAnswers } = quizResult;
    
    return (
      <Card className="bg-black/80 border border-[#ff00ff]/30 mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
              Quiz Result
            </span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            {quiz.title} - {new Date(quiz.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#ff00ff]/30 flex items-center justify-center bg-[#ff00ff]/10">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                {score}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-black/50 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Correct Answers</p>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <p className="text-xl font-medium text-white">{correctAnswers}/{questions.length}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-black/50 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Reward</p>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-4 w-4 text-[#ff00ff]" />
                <p className="text-xl font-medium text-white flex items-center">
                  <ChonkTokenLogo size={16} className="mr-1" /> {quiz.rewardAmount} CHONK9K
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#00e0ff]/10 border border-[#00e0ff]/30 rounded-lg p-4">
            <p className="text-center text-white">
              Congratulations! You've completed the quiz. Your reward will be available to claim once the quiz period ends.
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Link href="/trivia">
            <Button className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white">
              Return to Trivia Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/trivia">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trivia
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <ChonkTokenLogo size={50} />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                {quiz?.title || 'Loading Quiz...'}
              </h1>
              {quiz && (
                <p className="text-gray-400">
                  Difficulty: {quiz.difficulty} | Reward: {quiz.rewardAmount} CHONK9K
                </p>
              )}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-[#ff00ff]" />
          </div>
        ) : quiz && questions.length > 0 ? (
          quizSubmitted ? (
            renderQuizResult()
          ) : (
            <>
              {renderQuizProgress()}
              {renderQuestion()}
            </>
          )
        ) : (
          <Card className="bg-black/80 border border-[#ff00ff]/30">
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-[#ff00ff]/50" />
              <h3 className="text-xl font-medium text-white mb-2">Quiz Not Found</h3>
              <p className="text-gray-400 mb-6">
                The quiz you're looking for doesn't exist or has ended. Please check the trivia page for current challenges.
              </p>
              <Link href="/trivia">
                <Button className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white">
                  Return to Trivia
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
