import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotProps {
  expanded?: boolean;
  onClose?: () => void;
}

export const Chatbot = ({ expanded = false, onClose }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(expanded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Only invert when over footer
  const isInverted = isOverFooter;

  useEffect(() => {
    setIsOpen(expanded);
    setIsExpanded(expanded);
  }, [expanded]);

  // Listen for custom event to open/expand chatbot
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsExpanded(true);
    };

    window.addEventListener('openHowdyHelper', handleOpenChat);
    return () => window.removeEventListener('openHowdyHelper', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || !chatbotRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverFooter(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const callBedrockAgent = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-bedrock`;
    
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        message: userMessage,
        sessionId: sessionId 
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      toast({
        title: "Error",
        description: errorData.error || "Failed to get response from AI agent.",
        variant: "destructive",
      });
      throw new Error("Failed to call Bedrock agent");
    }

    const data = await resp.json();
    
    if (data.response) {
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } else {
      throw new Error("No response from agent");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const messageText = input;
    setInput("");
    setIsLoading(true);

    try {
      await callBedrockAgent(messageText);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
    onClose?.();
  };

  return (
    <>
      {!isOpen && !isExpanded && (
        <div ref={chatbotRef} className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-colors duration-300",
              isInverted
                ? "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background" 
                : ""
            )}
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {isOpen && (
        <div 
          ref={chatbotRef}
          className={cn(
            "rounded-lg shadow-xl flex flex-col transition-all duration-300 overflow-hidden",
            isExpanded
              ? "fixed inset-0 md:inset-4 z-50 w-auto h-auto bg-white border"
              : "fixed bottom-6 right-6 w-96 h-[500px] z-50 bg-white border"
          )}
        >
          {/* Maroon Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-white">
            <h3 className={cn("font-semibold", isExpanded && "text-2xl")}>
              {isExpanded ? "Ask Our Howdy Helper" : "The Howdy Helper"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* White Body */}
          <ScrollArea className="flex-1 p-4 bg-white" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm py-8 text-gray-500">
                  {isExpanded 
                    ? "Howdy! Ask me anything about CMIS programs, events, mentorship, and more!" 
                    : "Hi! I'm here to help you navigate the CMIS portal. Ask me anything!"}
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2">
                    <p className="text-sm italic">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
              />
              <Button type="submit" size="icon" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
