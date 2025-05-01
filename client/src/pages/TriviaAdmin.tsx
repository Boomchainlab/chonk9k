import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon, PlusCircle, Edit, Eye, Loader2, Calendar, Trophy, Pencil, Save, X, HelpCircle } from 'lucide-react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import { apiRequest } from '@/lib/queryClient';
import { TriviaQuiz, TriviaQuestion } from '@shared/schema';

const TriviaAdmin: React.FC = () => {
  const { account } = useChonkWallet();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<TriviaQuiz[]>([]);
  const [activeTab, setActiveTab] = useState<string>('quizzes');
  
  // Quiz form state
  const [editingQuiz, setEditingQuiz] = useState<Partial<TriviaQuiz> | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  
  // Question form state
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Partial<TriviaQuestion> | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  
  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/trivia/quizzes');
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
        return;
      }
      
      setQuizzes(data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quizzes.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchQuestions = async (quizId: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', `/api/trivia/quizzes/${quizId}/questions`);
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
        return;
      }
      
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load questions.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateQuiz = () => {
    setEditingQuiz({
      title: '',
      description: '',
      rewardAmount: 500,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      difficulty: 'medium'
    });
    setEditingQuizId(null);
  };
  
  const handleEditQuiz = (quiz: TriviaQuiz) => {
    // Format dates for date input
    const formattedQuiz = {
      ...quiz,
      startDate: new Date(quiz.startDate).toISOString().split('T')[0],
      endDate: new Date(quiz.endDate).toISOString().split('T')[0]
    };
    
    setEditingQuiz(formattedQuiz);
    setEditingQuizId(quiz.id);
  };
  
  const handleQuizChange = (field: string, value: any) => {
    setEditingQuiz(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleSaveQuiz = async () => {
    if (!editingQuiz || !editingQuiz.title || !editingQuiz.description || !editingQuiz.startDate || !editingQuiz.endDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSubmittingQuiz(true);
      
      const method = editingQuizId ? 'PUT' : 'POST';
      const endpoint = editingQuizId ? `/api/trivia/quizzes/${editingQuizId}` : '/api/trivia/quizzes';
      
      const response = await apiRequest(method, endpoint, editingQuiz);
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
        return;
      }
      
      toast({
        title: 'Success',
        description: editingQuizId ? 'Quiz updated successfully.' : 'Quiz created successfully.'
      });
      
      setEditingQuiz(null);
      setEditingQuizId(null);
      fetchQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the quiz.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingQuiz(false);
    }
  };
  
  const handleSelectQuizForQuestions = (quizId: number) => {
    setSelectedQuizId(quizId);
    fetchQuestions(quizId);
    setActiveTab('questions');
  };
  
  const handleCreateQuestion = () => {
    if (!selectedQuizId) {
      toast({
        title: 'Error',
        description: 'Please select a quiz first.',
        variant: 'destructive'
      });
      return;
    }
    
    setEditingQuestion({
      quizId: selectedQuizId,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
      category: 'general'
    });
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setEditingQuestionId(null);
  };
  
  const handleEditQuestion = (question: TriviaQuestion) => {
    setEditingQuestion(question);
    setOptions(question.options as string[]);
    setCorrectAnswerIndex(question.correctAnswer);
    setEditingQuestionId(question.id);
  };
  
  const handleQuestionChange = (field: string, value: any) => {
    setEditingQuestion(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSaveQuestion = async () => {
    if (!editingQuestion || !editingQuestion.question || options.some(opt => !opt)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in the question and all options.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSubmittingQuestion(true);
      
      const questionData = {
        ...editingQuestion,
        options,
        correctAnswer: correctAnswerIndex
      };
      
      const method = editingQuestionId ? 'PUT' : 'POST';
      const endpoint = editingQuestionId 
        ? `/api/trivia/questions/${editingQuestionId}` 
        : `/api/trivia/quizzes/${selectedQuizId}/questions`;
      
      const response = await apiRequest(method, endpoint, questionData);
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
        return;
      }
      
      toast({
        title: 'Success',
        description: editingQuestionId ? 'Question updated successfully.' : 'Question created successfully.'
      });
      
      setEditingQuestion(null);
      setEditingQuestionId(null);
      setOptions(['', '', '', '']);
      setCorrectAnswerIndex(0);
      
      if (selectedQuizId) {
        fetchQuestions(selectedQuizId);
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the question.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingQuestion(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-2">
          <ChonkTokenLogo size={60} />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Trivia Admin
          </h1>
        </div>
        <p className="text-gray-400 mb-8">
          Create and manage crypto trivia quizzes with $CHONK9K rewards
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-black/60 border border-gray-800">
            <TabsTrigger value="quizzes" className="text-white data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-white data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-white">
              Questions
            </TabsTrigger>
          </TabsList>
          
          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="mt-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Trivia Quizzes</h2>
              <Button 
                className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                onClick={handleCreateQuiz}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> New Quiz
              </Button>
            </div>
            
            {editingQuiz && (
              <Card className="bg-black/80 border border-[#ff00ff]/30 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                      {editingQuizId ? 'Edit Quiz' : 'Create New Quiz'}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Title</label>
                      <Input
                        value={editingQuiz.title || ''}
                        onChange={(e) => handleQuizChange('title', e.target.value)}
                        placeholder="Quiz Title"
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Difficulty</label>
                      <Select
                        value={editingQuiz.difficulty || 'medium'}
                        onValueChange={(value) => handleQuizChange('difficulty', value)}
                      >
                        <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Start Date</label>
                      <Input
                        type="date"
                        value={editingQuiz.startDate || ''}
                        onChange={(e) => handleQuizChange('startDate', e.target.value)}
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">End Date</label>
                      <Input
                        type="date"
                        value={editingQuiz.endDate || ''}
                        onChange={(e) => handleQuizChange('endDate', e.target.value)}
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Reward Amount (CHONK9K)</label>
                      <Input
                        type="number"
                        value={editingQuiz.rewardAmount || 0}
                        onChange={(e) => handleQuizChange('rewardAmount', parseFloat(e.target.value))}
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Status</label>
                      <Select
                        value={editingQuiz.isActive ? 'active' : 'inactive'}
                        onValueChange={(value) => handleQuizChange('isActive', value === 'active')}
                      >
                        <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <Textarea
                      value={editingQuiz.description || ''}
                      onChange={(e) => handleQuizChange('description', e.target.value)}
                      placeholder="Quiz description"
                      className="bg-black/50 border-gray-700 text-white min-h-[100px]"
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      setEditingQuiz(null);
                      setEditingQuizId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                    onClick={handleSaveQuiz}
                    disabled={isSubmittingQuiz}
                  >
                    {isSubmittingQuiz ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Quiz
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {isLoading && !editingQuiz ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff00ff]" />
              </div>
            ) : quizzes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="bg-black/80 border border-[#ff00ff]/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                            {quiz.title}
                          </span>
                        </CardTitle>
                        <Badge className={quiz.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        {quiz.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-[#ff00ff]" />
                          <span className="text-gray-400">
                            {formatDate(quiz.startDate)} - {formatDate(quiz.endDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-[#00e0ff]" />
                          <span className="text-gray-400 flex items-center">
                            <ChonkTokenLogo size={14} className="mr-1" /> {quiz.rewardAmount} CHONK9K
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <HelpCircle className="h-4 w-4 text-[#ff00ff]" />
                          <span className="text-gray-400">
                            Difficulty: {quiz.difficulty}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
                          onClick={() => handleEditQuiz(quiz)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#00e0ff]/30 text-[#00e0ff] hover:bg-[#00e0ff]/10"
                          onClick={() => handleSelectQuizForQuestions(quiz.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Questions
                        </Button>
                      </div>
                      
                      <Link href={`/trivia/${quiz.id}`}>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          Preview
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/40 rounded-lg border border-gray-800">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-[#ff00ff] opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No Quizzes Yet</h3>
                <p className="text-gray-400 mb-6">
                  Create your first trivia quiz to start challenging your community!
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                  onClick={handleCreateQuiz}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Create Quiz
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Questions Tab */}
          <TabsContent value="questions" className="mt-6">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Trivia Questions</h2>
                {selectedQuizId && quizzes.length > 0 && (
                  <p className="text-gray-400">
                    for: {quizzes.find(q => q.id === selectedQuizId)?.title}
                  </p>
                )}
              </div>
              
              <div className="flex gap-4">
                {!selectedQuizId && (
                  <Select onValueChange={(value) => handleSelectQuizForQuestions(parseInt(value))}>
                    <SelectTrigger className="bg-black/50 border-gray-700 text-white w-[200px]">
                      <SelectValue placeholder="Select a quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizzes.map((quiz) => (
                        <SelectItem key={quiz.id} value={quiz.id.toString()}>
                          {quiz.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <Button 
                  className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                  onClick={handleCreateQuestion}
                  disabled={!selectedQuizId}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> New Question
                </Button>
              </div>
            </div>
            
            {editingQuestion && (
              <Card className="bg-black/80 border border-[#ff00ff]/30 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                      {editingQuestionId ? 'Edit Question' : 'Create New Question'}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Question</label>
                    <Textarea
                      value={editingQuestion.question || ''}
                      onChange={(e) => handleQuestionChange('question', e.target.value)}
                      placeholder="Enter the question"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Category</label>
                      <Select
                        value={editingQuestion.category || 'general'}
                        onValueChange={(value) => handleQuestionChange('category', value)}
                      >
                        <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Crypto</SelectItem>
                          <SelectItem value="blockchain">Blockchain</SelectItem>
                          <SelectItem value="defi">DeFi</SelectItem>
                          <SelectItem value="nft">NFTs</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="history">Crypto History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Points</label>
                      <Input
                        type="number"
                        value={editingQuestion.points || 10}
                        onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-300">Answer Options</label>
                      <p className="text-xs text-gray-400">Select the correct answer using the radio buttons</p>
                    </div>
                    
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="correctAnswer"
                          checked={correctAnswerIndex === index}
                          onChange={() => setCorrectAnswerIndex(index)}
                          className="text-[#ff00ff] focus:ring-[#ff00ff] h-4 w-4"
                        />
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="bg-black/50 border-gray-700 text-white flex-1"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Explanation (Optional)</label>
                    <Textarea
                      value={editingQuestion.explanation || ''}
                      onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                      placeholder="Explanation for the correct answer"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      setEditingQuestion(null);
                      setEditingQuestionId(null);
                      setOptions(['', '', '', '']);
                      setCorrectAnswerIndex(0);
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                    onClick={handleSaveQuestion}
                    disabled={isSubmittingQuestion}
                  >
                    {isSubmittingQuestion ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Question
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {isLoading && !editingQuestion ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff00ff]" />
              </div>
            ) : selectedQuizId ? (
              questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="bg-black/80 border border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <Badge className="bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30 mr-2">
                              Q{index + 1}
                            </Badge>
                            <h3 className="font-medium text-white">{question.question}</h3>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#ff00ff] hover:bg-[#ff00ff]/10 h-8 w-8 p-0"
                              onClick={() => handleEditQuestion(question)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-500/10 h-8 w-8 p-0"
                              onClick={() => {
                                // Delete question handler would go here
                                toast({
                                  title: 'Not Implemented',
                                  description: 'The delete functionality is not yet implemented.',
                                  variant: 'destructive'
                                });
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="ml-6 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(question.options as string[]).map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 text-sm rounded ${optIndex === question.correctAnswer ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-black/30 border border-gray-800 text-gray-300'}`}
                              >
                                {optIndex === question.correctAnswer && (
                                  <CheckCircle className="h-3 w-3 inline-block mr-1 text-green-400" />
                                )}
                                {option}
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Category: {question.category}</span>
                            <span>Points: {question.points}</span>
                          </div>
                          
                          {question.explanation && (
                            <div className="mt-2 p-2 bg-[#00e0ff]/5 border border-[#00e0ff]/20 rounded text-sm text-gray-300">
                              <span className="text-[#00e0ff] font-medium">Explanation:</span> {question.explanation}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-black/40 rounded-lg border border-gray-800">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-[#ff00ff] opacity-50" />
                  <h3 className="text-xl font-medium text-white mb-2">No Questions Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Add some questions to your trivia quiz!
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                    onClick={handleCreateQuestion}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Create Question
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-black/40 rounded-lg border border-gray-800">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-[#ff00ff] opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Select a Quiz</h3>
                <p className="text-gray-400 mb-6">
                  Please select a quiz to manage its questions
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TriviaAdmin;
