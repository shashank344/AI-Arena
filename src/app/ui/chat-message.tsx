'use client';

import type { FC } from 'react';
import { Bot, User, Copy, Download, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  userPrompt: string;
}

const textOnlyPrompts = [
    'What is the meaning of the word:',
    'Generate description for',
    'Summarize the following text into three key points:',
    'Explain the following code snippet in plain English',
    'Create a short, engaging Twitter post about the following topic:',
];

export const ChatMessage: FC<ChatMessageProps> = ({ message, userPrompt }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({
      description: 'Code copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = {
      prompt: userPrompt,
      response: message.content,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-arena-response-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      description: 'Response downloaded as JSON.',
    });
  };
  
  const isUser = message.role === 'user';
  const isTextResponse = !isUser && textOnlyPrompts.some(p => userPrompt.startsWith(p));

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <Bot className="w-5 h-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col gap-2 max-w-xl ${isUser ? 'items-end' : ''}`}>
        <Card className={isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
          <CardContent className="p-3 text-sm">
            {isUser ? (
               <p>{message.content}</p>
            ) : isTextResponse ? (
                <p>{message.content}</p>
            ) : (
                <div className="prose prose-sm dark:prose-invert text-foreground">
                    <div className="bg-background dark:bg-black/50 rounded-md">
                        <div className="flex items-center justify-between px-3 py-1.5 border-b">
                            <span className="text-xs font-sans text-muted-foreground">React JSX</span>
                            <div className="flex items-center gap-2">
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleCopy}
                                aria-label="Copy code"
                                >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleDownload}
                                aria-label="Download JSON"
                                >
                                <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <pre className="p-3 overflow-x-auto"><code className="font-code text-xs">{message.content}</code></pre>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
