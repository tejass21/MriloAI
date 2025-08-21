import { useState, useEffect, useRef } from "react";
import { ChatSession, Message, CodeBlock } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

export const useChat = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [folders, setFolders] = useState<{ [key: string]: string[] }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [apiRequestFailed, setApiRequestFailed] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState("");

  // Function to extract code blocks from message
  const extractCodeBlocks = (message: string): CodeBlock[] => {
    const codeBlocks: CodeBlock[] = [];
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(message)) !== null) {
      codeBlocks.push({
        language: match[1] || 'typescript',
        code: match[2].trim()
      });
    }

    return codeBlocks;
  };

  // Get storage key based on user email
  const getStorageKey = (email: string) => `mrilo_chat_history_${email}`;

  // Load chat history from localStorage on mount or when user changes
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        if (user?.email) {
          const storageKey = getStorageKey(user.email);
          const savedHistory = localStorage.getItem(storageKey);
          if (savedHistory) {
            const { 
              messages: savedMessages, 
              chatSessions: savedSessions, 
              favorites: savedFavorites, 
              folders: savedFolders,
              activeChatId: savedActiveChatId 
            } = JSON.parse(savedHistory);

            // Set all the saved data
            setChatSessions(savedSessions || []);
            setFavorites(savedFavorites || []);
            setFolders(savedFolders || {});
            
            // If there was an active chat, restore it
            if (savedActiveChatId) {
              setActiveChatId(savedActiveChatId);
              const activeChat = savedSessions.find(chat => chat.id === savedActiveChatId);
              if (activeChat) {
                setMessages(activeChat.messages);
              }
            } else if (savedSessions.length > 0) {
              // If no active chat but there are sessions, select the most recent one
              const mostRecentChat = savedSessions[0];
              setActiveChatId(mostRecentChat.id);
              setMessages(mostRecentChat.messages);
            } else {
              // No chats exist, start fresh
              setMessages([]);
              setActiveChatId(null);
            }
          } else {
            // No saved history, start fresh
            setMessages([]);
            setChatSessions([]);
            setFavorites([]);
            setFolders({});
            setActiveChatId(null);
          }
        } else {
          // No user logged in, clear everything
          setMessages([]);
          setChatSessions([]);
          setFavorites([]);
          setFolders({});
          setActiveChatId(null);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [user?.email]);

  // Save chat history to localStorage whenever messages, chatSessions, favorites, or folders change
  useEffect(() => {
    const saveChatHistory = () => {
      try {
        if (user?.email) {
          const storageKey = getStorageKey(user.email);
          localStorage.setItem(storageKey, JSON.stringify({
            messages,
            chatSessions,
            favorites,
            folders,
            activeChatId // Save the active chat ID
          }));
        }
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    };

    saveChatHistory();
  }, [messages, chatSessions, favorites, folders, activeChatId, user?.email]);

  // Update messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      const activeChat = chatSessions.find(chat => chat.id === activeChatId);
      if (activeChat) {
        setMessages(activeChat.messages);
      }
    } else {
      setMessages([]);
    }
  }, [activeChatId, chatSessions]);

  // Clear chat history when user signs out
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setChatSessions([]);
      setFavorites([]);
      setFolders({});
      setActiveChatId(null);
      setInput("");
    }
  }, [user]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      const container = chatContainerRef.current;
      if (container) {
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const scrollTop = container.scrollTop;
        
        // If we're near the bottom, scroll to bottom
        if (scrollHeight - (scrollTop + clientHeight) < 200) {
          scrollToBottom();
        }
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        const messagesEnd = document.getElementById('messages-end');
        messagesEnd?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      timestamp: new Date().toISOString()
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessages([]);
    setInput("");
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      text: message,
      isAi: false,
      timestamp: new Date().toISOString()
    };

    // Update messages state
    setMessages(prev => [...prev, userMessage]);

    // Update chat session if active
    if (activeChatId) {
      setChatSessions(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, userMessage],
              title: chat.title === "New Chat" ? message.slice(0, 30) + "..." : chat.title
            }
          : chat
      ));
    }

    setInput("");
    setIsLoading(true);

    try {
      // Check if user has Gemini API key
      const geminiApiKey = localStorage.getItem('gemini_api_key');
      
      if (geminiApiKey) {
        // Use Gemini API directly from frontend
        console.log('Using Gemini API with user key');
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiApiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: message }]
              }
            ],
            generation_config: {
              temperature: 0.6,
              maxOutputTokens: 1200,
            },
            systemInstruction: {
              role: 'system',
              parts: [{
                text: `You're a focused AI Assistant created by Mrilo.

Tejas Bachute is the CEO of Mrilo.

Give short and precise replies (under 15 lines).

If the user says "deep search", then respond with a detailed and longer answer.

Talk like a real human — add light commentary, friendly jokes, and natural conversation flow.

Be a smart buddy, not a boring bot.

Prioritize clarity and usefulness.

If you're unsure, ask questions instead of assuming.

Use a chill, intelligent tone — casual when needed, serious when it matters.

Mix humor and insight where it feels right.

Highlight important details clearly.

If user talks in Hinglish, you can respond the same way.

Avoid over-explaining unless it's a deep search.

Understand the user's intent — don't jump to solutions too fast.

If the user is building something, treat it like your own project.

Show empathy and curiosity when the user is stuck or stressed.

When helping with code, give clean, modern, and optimized solutions.

Brainstorm ideas if asked — don't just execute, contribute.

Stay updated — act like a street-smart engineer.

Avoid generic replies — tailor every answer to the user's style.

Speak with confidence, but not arrogance.

You're not just an assistant — you're a co-pilot, a partner, and a friend in the build journey.

Always add a little personality — make it feel alive.`
              }]
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                           "I'm sorry, I couldn't generate a response at this time.";

          // Extract code blocks from AI response
          const codeBlocks = extractCodeBlocks(aiResponse);

          // Add AI response with code blocks
          const aiMessage: Message = {
            text: aiResponse,
            isAi: true,
            timestamp: new Date().toISOString(),
            codeBlocks
          };

          // Update messages state
          setMessages(prev => [...prev, aiMessage]);

          // Update chat session if active
          if (activeChatId) {
            setChatSessions(prev => prev.map(chat => 
              chat.id === activeChatId 
                ? { ...chat, messages: [...chat.messages, aiMessage] }
                : chat
            ));
          }
          
          return; // Exit early since we handled the response
        }
      }

      // Fallback to Supabase Edge Function (Hugging Face)
      console.log('Using Supabase Edge Function (Hugging Face)');
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message }
      });

      if (error) {
        throw new Error(error.message || "Error calling AI service");
      }

      if (!data || !data.response) {
        throw new Error("Invalid response from AI service");
      }

      // Extract code blocks from AI response
      const codeBlocks = extractCodeBlocks(data.response);

      // Add AI response with code blocks
      const aiMessage: Message = {
        text: data.response,
        isAi: true,
        timestamp: new Date().toISOString(),
        codeBlocks
      };

      // Update messages state
      setMessages(prev => [...prev, aiMessage]);

      // Update chat session if active
      if (activeChatId) {
        setChatSessions(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        ));
      }

    } catch (error) {
      console.error('Message error:', error);
      
      // Set API failure flag
      setApiRequestFailed(true);
      
      // Add error message directly to the chat
      const errorMessage: Message = {
        text: "I'm sorry, I'm having trouble connecting to my knowledge sources right now. Please try again later.",
        isAi: true,
        timestamp: new Date().toISOString()
      };

      // Update messages state
      setMessages(prev => [...prev, errorMessage]);

      // Update chat session if active
      if (activeChatId) {
        setChatSessions(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        ));
      }

      // Show a toast notification
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    setFavorites(prev => prev.filter(id => id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  const onRenameChat = (chatId: string, newTitle: string) => {
    setChatSessions(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle }
        : chat
    ));
  };

  const onToggleFavorite = (chatId: string) => {
    setFavorites(prev => 
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  const onMoveToFolder = (chatId: string, folderName: string) => {
    setFolders(prev => ({
      ...prev,
      [folderName]: [...(prev[folderName] || []), chatId]
    }));
  };

  const onCreateFolder = (folderName: string) => {
    setFolders(prev => ({
      ...prev,
      [folderName]: []
    }));
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    chatSessions,
    activeChatId,
    favorites,
    folders,
    setActiveChatId,
    messagesEndRef,
    chatContainerRef,
    inputRef,
    handleNewChat,
    handleSendMessage,
    onDeleteChat,
    onRenameChat,
    onToggleFavorite,
    onMoveToFolder,
    onCreateFolder,
    apiRequestFailed
  };
};
