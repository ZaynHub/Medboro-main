import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Bot, User, Phone, Mail, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { sendChatMessage } from '../utils/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { id: 'book', text: 'How to book an appointment?', icon: '📅' },
  { id: 'insurance', text: 'Check insurance coverage', icon: '🛡️' },
  { id: 'records', text: 'Access medical records', icon: '📋' },
  { id: 'emergency', text: 'Emergency SOS help', icon: '🚑' },
  { id: 'payment', text: 'Payment issues', icon: '💳' },
  { id: 'account', text: 'Account settings', icon: '⚙️' }
];

export function Support() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! 👋 I\'m Medboro AI Assistant. I\'m here to help you with anything related to our app - booking appointments, checking insurance, medical records, or any issues you\'re facing. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Guest","id":"guest"}');

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem(`chat_history_${user.id}`);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage
    if (messages.length > 1) {
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to backend AI
      const response = await sendChatMessage({
        userId: user.id,
        message: text.trim(),
        chatHistory: messages.slice(-10) // Send last 10 messages for context
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if escalation is suggested
      if (response.shouldEscalate) {
        setShowEscalation(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact customer care directly at 1800-MEDBORO (1800-633-2676).',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowEscalation(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    handleSendMessage(action.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConnectToHuman = () => {
    const escalationMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I understand you need personal assistance. Here's how to reach our customer care team:

📞 **Phone Support:** 1800-MEDBORO (1800-633-2676)
   Available 24/7

📧 **Email Support:** support@medboro.com
   Response within 2-4 hours

💬 **Live Chat:** Mon-Sat, 9 AM - 9 PM
   (Currently ${isBusinessHours() ? 'Available' : 'Offline'})

Your chat transcript has been saved. Our team will have full context of your issue when you connect.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, escalationMessage]);
    setShowEscalation(false);
  };

  const isBusinessHours = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 6 && hour >= 9 && hour < 21;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center relative">
              <Bot className="w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-cyan-600"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                AI Support Assistant
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </h1>
              <p className="text-cyan-100 text-sm">Online • Typically replies instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-6 py-6">
        {/* Quick Actions (show only at start) */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3 text-center">Quick actions to get started:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-cyan-500 hover:shadow-md transition-all text-left group"
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-cyan-600 transition-colors">
                    {action.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-500 to-teal-500'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white text-gray-900 shadow-sm border border-gray-200 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Escalation Card */}
        {showEscalation && (
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" />
              Need Personal Assistance?
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              If my suggestions aren't helping, I can connect you to our human customer care team who can provide personalized support.
            </p>
            <Button onClick={handleConnectToHuman} className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Connect to Customer Care
            </Button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Medboro AI • Available 24/7 • Your data is secure
          </p>
        </div>
      </div>
    </div>
  );
}
