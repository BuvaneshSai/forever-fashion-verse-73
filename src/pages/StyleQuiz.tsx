
import { useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Quiz questions and options
const quizQuestions = [
  {
    id: 1,
    question: "Which colors do you prefer wearing most often?",
    options: [
      { id: "a", text: "Neutrals (Black, White, Grey, Beige)", style: "minimalist" },
      { id: "b", text: "Bright and vibrant colors", style: "bold" },
      { id: "c", text: "Earth tones (Brown, Olive, Rust)", style: "classic" },
      { id: "d", text: "Pastels and soft shades", style: "romantic" },
    ],
  },
  {
    id: 2,
    question: "What type of fit do you prefer for your everyday clothes?",
    options: [
      { id: "a", text: "Loose and comfortable", style: "casual" },
      { id: "b", text: "Well-tailored and structured", style: "classic" },
      { id: "c", text: "Form-fitting to show off my shape", style: "bold" },
      { id: "d", text: "Oversized or experimental silhouettes", style: "avant-garde" },
    ],
  },
  {
    id: 3,
    question: "Which footwear do you reach for most often?",
    options: [
      { id: "a", text: "Sneakers or comfortable flats", style: "casual" },
      { id: "b", text: "Elegant heels or formal shoes", style: "classic" },
      { id: "c", text: "Statement shoes or trendy designs", style: "bold" },
      { id: "d", text: "Boots or ankle boots", style: "edgy" },
    ],
  },
  {
    id: 4,
    question: "How would you describe your ideal shopping experience?",
    options: [
      { id: "a", text: "Finding timeless pieces that last for years", style: "classic" },
      { id: "b", text: "Discovering the latest trends and unique items", style: "bold" },
      { id: "c", text: "Getting basics that can be mixed and matched easily", style: "minimalist" },
      { id: "d", text: "Finding comfortable items that also look put-together", style: "casual" },
    ],
  },
  {
    id: 5,
    question: "Which of these occasions do you dress up for most often?",
    options: [
      { id: "a", text: "Office or professional settings", style: "classic" },
      { id: "b", text: "Casual outings with friends", style: "casual" },
      { id: "c", text: "Special events or nights out", style: "bold" },
      { id: "d", text: "Creative or artistic environments", style: "avant-garde" },
    ],
  },
  {
    id: 6,
    question: "Which of these style icons do you admire most?",
    options: [
      { id: "a", text: "Audrey Hepburn or George Clooney (timeless elegance)", style: "classic" },
      { id: "b", text: "Rihanna or Harry Styles (experimental and bold)", style: "bold" },
      { id: "c", text: "Jennifer Aniston or Ryan Gosling (casual sophistication)", style: "casual" },
      { id: "d", text: "Zendaya or Timothée Chalamet (trendy and fashion-forward)", style: "avant-garde" },
    ],
  },
];

// Style definitions with product recommendations
const styleDefinitions = {
  classic: {
    title: "Classic Elegance",
    description: "Your style is timeless and sophisticated. You value quality over quantity and prefer well-tailored pieces that never go out of style.",
    recommendations: [
      { id: "prod1", name: "Classic White Shirt", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10", price: 1200, discountPercentage: 20 },
      { id: "prod5", name: "Winter Jacket", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7", price: 3500, discountPercentage: 0 },
      { id: "prod2", name: "Blue Denim Jeans", image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c", price: 1800, discountPercentage: 15 },
    ],
  },
  casual: {
    title: "Casual Cool",
    description: "You prioritize comfort while still looking put-together. Your wardrobe consists of versatile, relaxed pieces that can be dressed up or down.",
    recommendations: [
      { id: "prod6", name: "Casual T-Shirt", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820", price: 800, discountPercentage: 0 },
      { id: "prod2", name: "Blue Denim Jeans", image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c", price: 1800, discountPercentage: 15 },
      { id: "prod4", name: "Sports Running Shoes", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", price: 2200, discountPercentage: 10 },
    ],
  },
  bold: {
    title: "Bold & Expressive",
    description: "You're not afraid to stand out and express yourself through fashion. You love vibrant colors, unique patterns, and statement pieces.",
    recommendations: [
      { id: "prod3", name: "Floral Summer Dress", image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23", price: 1500, discountPercentage: 25 },
      { id: "prod5", name: "Winter Jacket", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7", price: 3500, discountPercentage: 0 },
      { id: "prod4", name: "Sports Running Shoes", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", price: 2200, discountPercentage: 10 },
    ],
  },
  minimalist: {
    title: "Minimalist Chic",
    description: "You believe less is more. Your wardrobe consists of clean lines, neutral colors, and high-quality basics that can be effortlessly combined.",
    recommendations: [
      { id: "prod1", name: "Classic White Shirt", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10", price: 1200, discountPercentage: 20 },
      { id: "prod2", name: "Blue Denim Jeans", image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c", price: 1800, discountPercentage: 15 },
      { id: "prod6", name: "Casual T-Shirt", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820", price: 800, discountPercentage: 0 },
    ],
  },
  avant-garde: {
    title: "Avant-Garde Explorer",
    description: "You're a fashion pioneer who loves to experiment with cutting-edge trends, unique silhouettes, and unexpected combinations.",
    recommendations: [
      { id: "prod5", name: "Winter Jacket", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7", price: 3500, discountPercentage: 0 },
      { id: "prod3", name: "Floral Summer Dress", image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23", price: 1500, discountPercentage: 25 },
      { id: "prod4", name: "Sports Running Shoes", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", price: 2200, discountPercentage: 10 },
    ],
  },
  edgy: {
    title: "Edgy & Modern",
    description: "Your style is bold and contemporary with a hint of rebellion. You're drawn to modern silhouettes, dark colors, and interesting details.",
    recommendations: [
      { id: "prod5", name: "Winter Jacket", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7", price: 3500, discountPercentage: 0 },
      { id: "prod2", name: "Blue Denim Jeans", image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c", price: 1800, discountPercentage: 15 },
      { id: "prod4", name: "Sports Running Shoes", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", price: 2200, discountPercentage: 10 },
    ],
  },
  romantic: {
    title: "Romantic & Feminine",
    description: "You're drawn to soft, flowing fabrics, delicate details, and feminine silhouettes. Your style is graceful and subtly elegant.",
    recommendations: [
      { id: "prod3", name: "Floral Summer Dress", image: "https://images.unsplash.com/photo-1496217590455-aa63a8550c23", price: 1500, discountPercentage: 25 },
      { id: "prod1", name: "Classic White Shirt", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10", price: 1200, discountPercentage: 20 },
      { id: "prod6", name: "Casual T-Shirt", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820", price: 800, discountPercentage: 0 },
    ],
  },
};

const ProductCard = ({ product }: { product: any }) => {
  const discountedPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100) 
    : product.price;
  
  return (
    <Link to={`/product/${product.id}`} className="product-card group">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-forever-navy font-semibold">
              ₹{discountedPrice.toFixed(0)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-gray-500 line-through ml-2">
                  ₹{product.price.toFixed(0)}
                </span>
                <span className="ml-2 bg-forever-orange text-white text-xs px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const StyleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [styleResult, setStyleResult] = useState<keyof typeof styleDefinitions | null>(null);
  
  const progress = (currentQuestion / quizQuestions.length) * 100;
  
  const handleAnswer = (styleType: string) => {
    const newAnswers = [...answers, styleType];
    setAnswers(newAnswers);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Determine style based on answers
      determineStyle(newAnswers);
      setQuizCompleted(true);
    }
  };
  
  const determineStyle = (allAnswers: string[]) => {
    // Count occurrences of each style
    const styleCounts: Record<string, number> = {};
    allAnswers.forEach((style) => {
      styleCounts[style] = (styleCounts[style] || 0) + 1;
    });
    
    // Find the style with the most occurrences
    let dominantStyle = Object.keys(styleCounts).reduce((a, b) => 
      styleCounts[a] > styleCounts[b] ? a : b
    );
    
    // Set the result
    setStyleResult(dominantStyle as keyof typeof styleDefinitions);
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setStyleResult(null);
  };
  
  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-forever-navy mb-2">
              AI Style Quiz
            </h1>
            <p className="text-gray-600">
              Answer a few questions to discover your personal style and get personalized recommendations.
            </p>
          </div>
          
          {!quizCompleted ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <CardTitle className="mt-4 text-xl">
                  {quizQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.style)}
                    className="w-full text-left p-4 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetQuiz}
                >
                  Start Over
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="animate-fade-in">
              {styleResult && (
                <>
                  <Card className="mb-8">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">Your Style: {styleDefinitions[styleResult].title}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {styleDefinitions[styleResult].description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="w-full h-40 overflow-hidden rounded-md mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843" 
                          alt="Style inspiration" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button onClick={resetQuiz} variant="outline" className="mr-4">
                        Retake Quiz
                      </Button>
                      <Button>
                        Shop This Style
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Recommended for Your Style</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {styleDefinitions[styleResult].recommendations.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="text-center">
                <Link to="/chat-stylist">
                  <Button className="bg-forever-navy hover:bg-forever-orange">
                    Chat with our AI Stylist for More Recommendations
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default StyleQuiz;
