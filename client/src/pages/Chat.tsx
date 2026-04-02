import { useState, useRef, useEffect } from "react";
import { useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Send, Bot, User, MessageCircle, Waves, Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  "Busco um imóvel na praia em SC",
  "Quero investir em imóvel no litoral",
  "Quais regiões vocês atendem?",
  "Quero falar com um corretor",
];

interface ClientData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  budget?: string;
  propertyType?: string;
}

const INITIAL_MESSAGE = `Olá! Sou o consultor virtual da **La Mare**.

Posso ajudar na busca pelo imóvel certo, orientar sobre regiões ou conectar você com nosso time. O que você está buscando?`;

export default function Chat() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const propertyIdParam = params.get("property");

  const { user, isAuthenticated } = useAuth();
  const [sessionId, setSessionId] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onMutate: () => setIsTyping(true),
    onSuccess: (data) => {
      setIsTyping(false);
      if (data.success) {
        setSessionId(data.sessionId);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        }]);
      } else {
        toast.error("Erro ao enviar mensagem");
      }
    },
    onError: () => {
      setIsTyping(false);
      toast.error("Erro de conexão. Tente novamente.");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Welcome message
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: INITIAL_MESSAGE,
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const handleSend = (msg?: string) => {
    const text = msg ?? input.trim();
    if (!text || sendMessage.isPending) return;

    const userMessage: Message = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    sendMessage.mutate({
      sessionId,
      userId: user?.id,
      clientName: clientData.name || user?.name || undefined,
      clientEmail: clientData.email || user?.email || undefined,
      clientPhone: clientData.phone,
      message: text,
      propertyContext: propertyIdParam ? { id: parseInt(propertyIdParam), title: "Imóvel selecionado", city: "", price: 0 } : undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="pt-16 flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-ocean-deep text-white py-8">
          <div className="container">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-ocean border-2 border-white/20 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                  <MessageCircle className="w-3.5 h-3.5" /> Assistente Virtual
                </div>
                <h1 className="font-serif text-2xl font-bold">La Mare_IA</h1>
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Consultora imobiliária disponível agora
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 container py-6 flex gap-6">
          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1" style={{ maxHeight: "calc(100vh - 340px)" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                    msg.role === "assistant" ? "gradient-ocean" : "bg-primary"
                  }`}>
                    {msg.role === "assistant" ? <Waves className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border rounded-tl-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                        <Streamdown>{msg.content}</Streamdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                    <div className={`text-xs mt-1.5 ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-ocean shrink-0 flex items-center justify-center">
                    <Waves className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border border-border rounded-2xl bg-card p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Faça uma pergunta sobre imóveis litorâneos..."
                  className="border-0 focus-visible:ring-0 bg-transparent text-sm"
                  disabled={sendMessage.isPending}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || sendMessage.isPending}
                  size="icon"
                  className="shrink-0 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestions sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-20">
              <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent" /> Sugestões
              </h3>
              <div className="space-y-2">
                {QUICK_QUESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="w-full text-left text-xs text-muted-foreground hover:text-foreground hover:bg-muted p-2.5 rounded-lg transition-colors leading-relaxed"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A La Mare_IA é uma assistente virtual. Para negociações, entre em contacto com um consultor humano.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
