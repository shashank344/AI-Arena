'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { models, templates } from '@/data/mock-data';
import { generateComponentAction, getRecommendationAction, generateUiAction, generateDescriptionAction } from '@/app/actions';
import { SendHorizonal, Bot, Sparkles, Loader2, Menu, Settings, FileJson, BrainCircuit, Wand2, ShoppingBag } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input as UiInput } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChatMessage } from './chat-message';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function MainPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI assistant. Select a model, choose a template, or write your own prompt to get started." }
  ]);
  const [input, setInput] = useState('');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const [productName, setProductName] = useState('');
  const [productKeywords, setProductKeywords] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const [isRecommendationPending, startRecommendationTransition] = useTransition();
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTemplateChange = (templateId: string) => {
    if (!templateId) {
      setInput('');
      return;
    }
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setInput(template.content);
    }
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    startTransition(async () => {
      try {
        const response = await generateComponentAction(input);
        const assistantMessage: Message = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        const err = error as Error;
        toast({
          variant: 'destructive',
          title: 'Error generating response',
          description: err.message,
        });
        setMessages(prev => prev.slice(0, -1)); // Remove the user message if submission failed
      }
    });

    setInput('');
  };

  const handleGenerateUi = () => {
    if (!input.trim() || isPending) return;
    const userMessage: Message = { role: 'user', content: `Generate UI for: ${input}` };
    setMessages(prev => [...prev, userMessage]);

    startTransition(async () => {
      try {
        const response = await generateUiAction(input);
        const assistantMessage: Message = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        const err = error as Error;
        toast({
          variant: 'destructive',
          title: 'Error generating UI',
          description: err.message,
        });
        setMessages(prev => prev.slice(0, -1));
      }
    });
    setInput('');
  }

  const handleGetRecommendation = () => {
    if (!input.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a prompt to get recommendations.',
      });
      return;
    }
    startRecommendationTransition(async () => {
      try {
        setRecommendation(null);
        const result = await getRecommendationAction(input);
        setRecommendation(result.recommendations);
      } catch (error) {
        const err = error as Error;
        toast({
            variant: 'destructive',
            title: 'Error getting recommendations',
            description: err.message,
        });
      }
    });
  };

  const handleGenerateDescription = () => {
    if (!productName.trim() || !productKeywords.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter a product name and keywords.',
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: `Generate description for ${productName}` };
    setMessages(prev => [...prev, userMessage]);

    startTransition(async () => {
      try {
        const response = await generateDescriptionAction({ productName, keywords: productKeywords });
        const assistantMessage: Message = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        const err = error as Error;
        toast({
          variant: 'destructive',
          title: 'Error generating description',
          description: err.message,
        });
        setMessages(prev => prev.slice(0, -1));
      }
    });

    setProductName('');
    setProductKeywords('');
  }

  const LeftPanel = () => (
    <div className="flex flex-col gap-6 p-4 bg-card md:bg-transparent h-full">
      <h1 className="font-headline text-2xl font-bold tracking-tighter flex items-center gap-2">
        <Bot className="text-primary" />
        AI Arena
      </h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model-selector">Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="model-selector" className="w-full" aria-label="Select AI model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    {model.icon === 'BrainCircuit' && <BrainCircuit className="h-4 w-4" />}
                    {model.icon === 'Sparkles' && <Sparkles className="h-4 w-4" />}
                    <span>{model.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-selector">Prompt Templates</Label>
          <Select onValueChange={handleTemplateChange}>
            <SelectTrigger id="template-selector" className="w-full" aria-label="Select prompt template">
              <SelectValue placeholder="Load a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  );

  const RightPanel = () => (
    <div className="flex flex-col gap-6 p-4 bg-card md:bg-transparent h-full">
      <Tabs defaultValue="parameters">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
        </TabsList>
        <TabsContent value="parameters" className="mt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-sm text-muted-foreground">{temperature[0].toFixed(2)}</span>
              </div>
              <Slider id="temperature" min={0} max={1} step={0.01} value={temperature} onValueChange={setTemperature} />
              <p className="text-xs text-muted-foreground">Controls randomness. Lower is more deterministic.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <UiInput
                id="max-tokens"
                type="number"
                value={maxTokens}
                onChange={e => setMaxTokens(Number(e.target.value))}
                className="w-full p-2 border rounded-md bg-transparent text-sm"
              />
              <p className="text-xs text-muted-foreground">The maximum number of tokens to generate.</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tools" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <Sparkles className="text-primary h-5 w-5" />
                    Tool Recommendation
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Get AI-powered suggestions for the best tools and parameters for your prompt.</p>
                <Button onClick={handleGetRecommendation} disabled={isRecommendationPending || !input.trim()} className="w-full">
                    {isRecommendationPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Recommendations'}
                </Button>
                {recommendation && (
                    <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                    <p>{recommendation}</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="product" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <ShoppingBag className="text-primary h-5 w-5" />
                        Product Description
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="product-name">Product Name</Label>
                        <UiInput id="product-name" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Smart Watch" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-keywords">Keywords</Label>
                        <UiInput id="product-keywords" value={productKeywords} onChange={e => setProductKeywords(e.target.value)} placeholder="e.g. fitness, waterproof, long battery" />
                    </div>
                    <Button onClick={handleGenerateDescription} disabled={isPending} className="w-full">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Description'}
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <header className="md:hidden flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <LeftPanel />
            </SheetContent>
          </Sheet>
          <h1 className="font-headline text-lg font-bold tracking-tighter">AI Arena</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-0">
            <RightPanel />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 hidden md:flex flex-col border-r">
          <LeftPanel />
        </aside>

        <main className="flex-1 flex flex-col">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} userPrompt={messages[index-1]?.content ?? ''}/>
            ))}
            {isPending && (
              <div className="flex items-center gap-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-5 h-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4 bg-background">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your prompt here..."
                className="pr-28 min-h-[60px] resize-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleGenerateUi}
                  disabled={!input.trim() || isPending}
                  aria-label="Generate UI"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isPending}
                  aria-label="Send message"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </div>
        </main>

        <aside className="w-80 hidden lg:flex flex-col border-l">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}
