import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { apiRequest } from '../lib/queryClient';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, RefreshCw, Check, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
interface TriviaQuiz {
  id: number;
  title: string;
  description: string;
  rewardAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  difficulty: string;
  createdAt: string;
}

interface TriviaQuestion {
  id: number;
  quizId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
  category: string;
}

// Form validation schemas
const quizSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  rewardAmount: z.coerce.number().positive({ message: 'Reward amount must be positive' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  isActive: z.boolean().default(true),
  difficulty: z.enum(['easy', 'medium', 'hard'])
});

const questionSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters' }),
  options: z.array(z.string()).min(2, { message: 'At least 2 options are required' }).max(5, { message: 'Maximum 5 options allowed' }),
  correctAnswer: z.number().min(0, { message: 'Correct answer is required' }),
  explanation: z.string().optional(),
  points: z.coerce.number().int().positive({ message: 'Points must be a positive integer' }).default(1),
  category: z.string().min(2, { message: 'Category is required' })
});

type QuizFormValues = z.infer<typeof quizSchema>;
type QuestionFormValues = z.infer<typeof questionSchema>;

export default function TriviaAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('quizzes');
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questionOptions, setQuestionOptions] = useState<string[]>(['', '']);
  
  // Fetch all quizzes
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['/api/trivia/quizzes'],
    queryFn: async () => {
      try {
        const response = await apiRequest<TriviaQuiz[]>('/api/trivia/quizzes');
        return response;
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        return [];
      }
    }
  });
  
  // Fetch questions for the selected quiz
  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['/api/trivia/quizzes', selectedQuizId, 'questions'],
    queryFn: async () => {
      if (!selectedQuizId) return [];
      try {
        const response = await apiRequest<TriviaQuestion[]>(`/api/trivia/quizzes/${selectedQuizId}/questions`);
        return response;
      } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
      }
    },
    enabled: !!selectedQuizId
  });
  
  // Get the selected quiz
  const selectedQuiz = quizzes?.find(q => q.id === selectedQuizId);
  
  // Quiz Form
  const quizForm = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      rewardAmount: 1000,
      isActive: true,
      difficulty: 'medium'
    }
  });
  
  // Question Form
  const questionForm = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: '',
      options: [],
      correctAnswer: 0,
      explanation: '',
      points: 1,
      category: 'general'
    }
  });
  
  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (data: QuizFormValues) => {
      // Format dates to YYYY-MM-DD
      const formattedData = {
        ...data,
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        endDate: format(data.endDate, 'yyyy-MM-dd')
      };
      
      const response = await apiRequest('/api/trivia/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });
      
      return response;
    },
    onSuccess: () => {
      toast({
        title: 'Quiz Created',
        description: 'The trivia quiz has been successfully created.',
      });
      
      quizForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/trivia/quizzes'] });
    },
    onError: (error) => {
      console.error('Error creating quiz:', error);
      toast({
        title: 'Failed to Create Quiz',
        description: 'There was an error creating the quiz. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: QuestionFormValues & { quizId: number }) => {
      const response = await apiRequest(`/api/trivia/quizzes/${data.quizId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      return response;
    },
    onSuccess: () => {
      toast({
        title: 'Question Added',
        description: 'The question has been successfully added to the quiz.',
      });
      
      questionForm.reset();
      setQuestionOptions(['', '']);
      setIsAddingQuestion(false);
      
      if (selectedQuizId) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/trivia/quizzes', selectedQuizId, 'questions'] 
        });
      }
    },
    onError: (error) => {
      console.error('Error adding question:', error);
      toast({
        title: 'Failed to Add Question',
        description: 'There was an error adding the question. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Handle quiz form submission
  function onSubmitQuiz(data: QuizFormValues) {
    createQuizMutation.mutate(data);
  }
  
  // Handle question form submission
  function onSubmitQuestion(data: QuestionFormValues) {
    if (!selectedQuizId) {
      toast({
        title: 'No Quiz Selected',
        description: 'Please select a quiz first.',
        variant: 'destructive'
      });
      return;
    }
    
    // Set the options from our state
    data.options = questionOptions.filter(opt => opt.trim() !== '');
    
    // Validate that we have at least 2 options
    if (data.options.length < 2) {
      toast({
        title: 'Invalid Options',
        description: 'Please provide at least 2 valid options.',
        variant: 'destructive'
      });
      return;
    }
    
    // Validate that correctAnswer is within range
    if (data.correctAnswer < 0 || data.correctAnswer >= data.options.length) {
      toast({
        title: 'Invalid Correct Answer',
        description: 'The correct answer index must be valid.',
        variant: 'destructive'
      });
      return;
    }
    
    createQuestionMutation.mutate({
      ...data,
      quizId: selectedQuizId
    });
  }
  
  // Handle adding a new option
  const addOption = () => {
    if (questionOptions.length < 5) {
      setQuestionOptions([...questionOptions, '']);
    }
  };
  
  // Handle removing an option
  const removeOption = (index: number) => {
    if (questionOptions.length > 2) {
      const newOptions = [...questionOptions];
      newOptions.splice(index, 1);
      setQuestionOptions(newOptions);
      
      // If we're removing the correct answer or an option before it, update the form
      const currentCorrectAnswer = questionForm.getValues('correctAnswer');
      if (index === currentCorrectAnswer) {
        questionForm.setValue('correctAnswer', 0);
      } else if (index < currentCorrectAnswer) {
        questionForm.setValue('correctAnswer', currentCorrectAnswer - 1);
      }
    }
  };
  
  // Handle updating an option
  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionOptions];
    newOptions[index] = value;
    setQuestionOptions(newOptions);
  };
  
  // Handle selecting a quiz for editing
  const selectQuiz = (quiz: TriviaQuiz) => {
    setSelectedQuizId(quiz.id);
    setActiveTab('questions');
  };
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };
  
  // Helper to get status badge color
  const getStatusBadgeColor = (quiz: TriviaQuiz) => {
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    
    if (!quiz.isActive) return 'secondary';
    if (now < startDate) return 'outline';
    if (now > endDate) return 'destructive';
    return 'default';
  };
  
  // Helper to get status text
  const getStatusText = (quiz: TriviaQuiz) => {
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    
    if (!quiz.isActive) return 'Inactive';
    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Expired';
    return 'Active';
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Trivia Administration</h1>
      <p className="text-muted-foreground mb-6">Create and manage weekly crypto trivia challenges.</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>
          <TabsTrigger value="questions" disabled={!selectedQuizId}>
            {selectedQuizId ? 'Manage Questions' : 'Select a Quiz First'}
          </TabsTrigger>
        </TabsList>
        
        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Trivia Quiz</CardTitle>
              <CardDescription>Set up a new weekly crypto trivia challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...quizForm}>
                <form onSubmit={quizForm.handleSubmit(onSubmitQuiz)} className="space-y-6">
                  <FormField
                    control={quizForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Weekly Crypto Knowledge Challenge" {...field} />
                        </FormControl>
                        <FormDescription>A catchy title for the quiz</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={quizForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Test your knowledge of blockchain and cryptocurrency concepts in this week's challenge."
                            className="min-h-20" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Explain what the quiz is about</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={quizForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>When the quiz becomes available</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={quizForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate = quizForm.getValues('startDate');
                                  return date < new Date() || (startDate && date < startDate);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>When the quiz expires</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={quizForm.control}
                      name="rewardAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reward Amount</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              step={1} 
                              placeholder="1000"
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>$CHONK9K tokens awarded for completion</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={quizForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How challenging the questions will be</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={quizForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Quiz Active</FormLabel>
                          <FormDescription>
                            If checked, the quiz will be available during the scheduled dates
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createQuizMutation.isPending}
                  >
                    {createQuizMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : 'Create Quiz'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Existing Quizzes</CardTitle>
              <CardDescription>View and manage your trivia quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingQuizzes ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading quizzes...</span>
                </div>
              ) : !quizzes || quizzes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No quizzes created yet.</p>
                  <p className="text-sm mt-2">Create your first quiz using the form above.</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date Range</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">{quiz.title}</TableCell>
                          <TableCell>
                            {formatDate(quiz.startDate)} - {formatDate(quiz.endDate)}
                          </TableCell>
                          <TableCell className="capitalize">{quiz.difficulty}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeColor(quiz) as "default" | "destructive" | "secondary" | "outline"}>
                              {getStatusText(quiz)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => selectQuiz(quiz)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Manage Questions
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          {selectedQuiz && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedQuiz.title}</CardTitle>
                      <CardDescription>
                        Manage questions for this quiz
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeColor(selectedQuiz) as "default" | "destructive" | "secondary" | "outline"}>
                      {getStatusText(selectedQuiz)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{selectedQuiz.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Date Range:</span>{' '}
                        {formatDate(selectedQuiz.startDate)} - {formatDate(selectedQuiz.endDate)}
                      </div>
                      <div>
                        <span className="font-semibold">Reward:</span>{' '}
                        {selectedQuiz.rewardAmount} $CHONK9K
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {isAddingQuestion ? (
                      <Form {...questionForm}>
                        <form onSubmit={questionForm.handleSubmit(onSubmitQuestion)} className="space-y-4">
                          <FormField
                            control={questionForm.control}
                            name="question"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question</FormLabel>
                                <FormControl>
                                  <Input placeholder="What is the main purpose of a blockchain consensus mechanism?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-2">
                            <FormLabel>Options</FormLabel>
                            {questionOptions.map((option, index) => (
                              <div key={index} className="flex gap-2 items-center">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(index, e.target.value)}
                                  placeholder={`Option ${index + 1}`}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(index)}
                                  disabled={questionOptions.length <= 2}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant={questionForm.getValues('correctAnswer') === index ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => questionForm.setValue('correctAnswer', index)}
                                >
                                  {questionForm.getValues('correctAnswer') === index ? (
                                    <Check className="h-4 w-4 mr-1" />
                                  ) : null}
                                  Correct
                                </Button>
                              </div>
                            ))}
                            
                            {questionOptions.length < 5 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addOption}
                                size="sm"
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Option
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={questionForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <Input placeholder="blockchain" {...field} />
                                  </FormControl>
                                  <FormDescription>E.g., blockchain, defi, nft</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={questionForm.control}
                              name="points"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Points</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min={1} 
                                      step={1} 
                                      placeholder="1"
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormDescription>Points for correct answer</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={questionForm.control}
                            name="explanation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Explanation (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Consensus mechanisms like Proof of Work and Proof of Stake ensure that all nodes in the network agree on the state of the blockchain."
                                    className="min-h-20" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>Explanation for the correct answer</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end space-x-2 pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsAddingQuestion(false);
                                questionForm.reset();
                                setQuestionOptions(['', '']);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={createQuestionMutation.isPending}
                            >
                              {createQuestionMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Adding...
                                </>
                              ) : 'Add Question'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <Button
                        onClick={() => setIsAddingQuestion(true)}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Question
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Questions in this Quiz</CardTitle>
                  <CardDescription>Review and manage quiz questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingQuestions ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Loading questions...</span>
                    </div>
                  ) : !questions || questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No questions added to this quiz yet.</p>
                      <p className="text-sm mt-2">Add your first question using the form above.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium">
                              {index + 1}. {question.question}
                            </h3>
                            <Badge>{question.category}</Badge>
                          </div>
                          
                          <div className="pl-4 space-y-1 mb-3">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <div className={cn(
                                  "w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs",
                                  optIndex === question.correctAnswer 
                                    ? "bg-green-500 text-white" 
                                    : "border border-muted"
                                )}>
                                  {optIndex === question.correctAnswer && <Check className="h-3 w-3" />}
                                </div>
                                <span className={cn(
                                  optIndex === question.correctAnswer && "font-medium"
                                )}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                              <span className="font-medium">Explanation: </span>
                              {question.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}