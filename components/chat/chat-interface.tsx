'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Leaf,
  Send,
  Bot,
  User,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
}

interface ChatInterfaceProps {
  user: User
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'bn', label: 'বাংলা (Bengali)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
]

const suggestedQuestions = [
  'What plants are best for beginners?',
  'How do I start composting at home?',
  'My tomato leaves are turning yellow, what should I do?',
  'What vegetables can I grow on my balcony?',
  'How often should I water my indoor plants?',
  'What are natural pest control methods?',
]

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('en')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          messages,
          id,
          language,
        },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage({ text: question })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-800">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <Bot className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="font-semibold text-emerald-900">PrakritiMitra</h1>
                <p className="text-xs text-emerald-600">Your AI Gardening Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36 border-emerald-200">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="mx-auto max-w-4xl px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <Leaf className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-emerald-900">
                  Welcome to PrakritiMitra!
                </h2>
                <p className="mb-8 max-w-md text-center text-emerald-700">
                  {"I'm your AI-powered gardening companion. Ask me anything about plants, gardening, or sustainable agriculture!"}
                </p>
                
                {/* Suggested Questions */}
                <div className="w-full max-w-2xl">
                  <p className="mb-4 text-center text-sm font-medium text-emerald-600">
                    <Sparkles className="mr-1 inline h-4 w-4" />
                    Try asking me:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="rounded-lg border border-emerald-200 bg-white p-3 text-left text-sm text-emerald-800 transition-all hover:border-emerald-400 hover:bg-emerald-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Bot className="h-4 w-4 text-emerald-600" />
                      </div>
                    )}
                    <Card
                      className={`max-w-[80%] px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'border-emerald-200 bg-white'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        {message.parts.map((part, index) => {
                          if (part.type === 'text') {
                            return (
                              <div
                                key={index}
                                className={`whitespace-pre-wrap ${
                                  message.role === 'user' ? 'text-white' : 'text-emerald-900'
                                }`}
                              >
                                {part.text}
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    </Card>
                    {message.role === 'user' && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Bot className="h-4 w-4 text-emerald-600" />
                    </div>
                    <Card className="border-emerald-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">PrakritiMitra is thinking...</span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-emerald-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about gardening, plant care, or sustainable agriculture..."
              className="min-h-[52px] flex-1 resize-none border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              rows={1}
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-auto bg-emerald-600 px-6 hover:bg-emerald-700"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-emerald-600">
            PrakritiMitra can make mistakes. Always verify important gardening advice.
          </p>
        </form>
      </div>
    </div>
  )
}
