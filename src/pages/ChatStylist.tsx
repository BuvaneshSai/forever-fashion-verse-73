
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, ShoppingBag, Clock, User, Bot } from "lucide-react";

// Sample product data for recommendations
const recommendedProducts = [
  {
    id: "prod1",
    name: "Classic White Shirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    price: 1200,
    discountPercentage: 20,
  },
  {
    id: "prod2",
    name: "Blue Denim Jeans",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
    price: 1800,
    discountPercentage: 15,
  },
  {
    id: "prod3",
    name: "Floral Summer Dress",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23",
    price: 1500,
    discountPercentage: 25,
  },
];

// Define message types
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  products?: typeof recommendedProducts;
}

const ChatStylist = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm your AI Fashion Stylist. How can I help you today? You can ask me about outfit ideas, style advice, or help finding specific products.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse: Message;
      
      // Simple keyword-based responses (in a real app, this would be handled by a proper NLP service)
      if (input.toLowerCase().includes("outfit") || input.toLowerCase().includes("wear")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          text: "Based on current trends, I recommend these stylish outfit combinations. Would you like to see products for any of these looks?",
          sender: "bot",
          timestamp: new Date(),
          products: recommendedProducts,
        };
      } else if (input.toLowerCase().includes("style") || input.toLowerCase().includes("fashion")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          text: "Your personal style is unique to you! We have various style categories including Classic, Casual, Bold, Minimalist, and more. Have you taken our style quiz yet? It can help identify your fashion preferences.",
          sender: "bot",
          timestamp: new Date(),
        };
      } else if (input.toLowerCase().includes("order") || input.toLowerCase().includes("delivery")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          text: "To check your order status, please provide your order number or email address. I can help you track your package or address any concerns about your delivery.",
          sender: "bot",
          timestamp: new Date(),
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          text: "Thank you for your question! I'd be happy to help with fashion advice, outfit ideas, or finding specific products in our collection. Could you give me more details about what you're looking for?",
          sender: "bot",
          timestamp: new Date(),
        };
      }
      
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const ProductRecommendation = ({ product }: { product: typeof recommendedProducts[0] }) => {
    const discountedPrice = product.discountPercentage 
      ? product.price * (1 - product.discountPercentage / 100) 
      : product.price;
    
    return (
      <Link to={`/product/${product.id}`} className="block">
        <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3 flex-grow">
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <div className="flex items-center text-sm">
              <span className="text-forever-navy font-semibold">
                ₹{discountedPrice.toFixed(0)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-gray-500 line-through ml-2">
                  ₹{product.price.toFixed(0)}
                </span>
              )}
            </div>
          </div>
          <Button size="sm" className="flex-shrink-0">
            View
          </Button>
        </div>
      </Link>
    );
  };
  
  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Chat main area */}
            <div className="flex-grow md:w-3/4">
              <div className="bg-white border rounded-lg shadow-sm">
                {/* Chat header */}
                <div className="p-4 border-b flex items-center">
                  <div className="bg-forever-navy rounded-full w-10 h-10 flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                  <div className="ml-3">
                    <h2 className="font-semibold">Forever AI Stylist</h2>
                    <div className="flex items-center text-xs text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                
                {/* Chat messages */}
                <div className="p-4 h-[500px] overflow-y-auto">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 ${message.sender === "user" ? "flex justify-end" : ""}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-forever-navy text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-start mb-1">
                          {message.sender === "bot" && (
                            <div className="bg-forever-orange rounded-full w-6 h-6 flex items-center justify-center text-white mr-2">
                              <Bot size={14} />
                            </div>
                          )}
                          <div>
                            <p className="whitespace-pre-wrap">{message.text}</p>
                          </div>
                        </div>
                        
                        {/* Product recommendations */}
                        {message.products && (
                          <div className="mt-4 space-y-3">
                            {message.products.map((product) => (
                              <ProductRecommendation key={product.id} product={product} />
                            ))}
                          </div>
                        )}
                        
                        <div className={`text-xs mt-1 ${message.sender === "user" ? "text-white text-opacity-70" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="bg-gray-100 rounded-full p-2 mr-2">
                        <Bot size={16} />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat input */}
                <form onSubmit={handleSendMessage} className="border-t p-4">
                  <div className="flex items-center">
                    <Input
                      placeholder="Ask about outfit ideas, style advice, or product recommendations..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      type="submit" 
                      className="ml-2 bg-forever-navy hover:bg-forever-orange"
                      disabled={!input.trim()}
                    >
                      <SendIcon size={18} />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Quick actions sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white border rounded-lg shadow-sm p-4">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    setInput("I need outfit ideas for a formal event");
                    handleSendMessage();
                  }}>
                    <User size={16} className="mr-2" />
                    Outfit Ideas
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    setInput("What's trending in fashion right now?");
                    handleSendMessage();
                  }}>
                    <ShoppingBag size={16} className="mr-2" />
                    Fashion Trends
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    setInput("Can you track my order?");
                    handleSendMessage();
                  }}>
                    <Clock size={16} className="mr-2" />
                    Track Order
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">AI Tools</h3>
                  <Link to="/style-quiz">
                    <Button variant="default" className="w-full bg-forever-orange hover:bg-forever-navy">
                      Take Style Quiz
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                  <p>Having issues with the AI stylist?</p>
                  <Button variant="link" className="text-forever-navy p-0 h-auto">
                    Contact Customer Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ChatStylist;
