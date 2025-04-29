
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AiFeaturesBanner = () => {
  return (
    <section className="py-12 bg-forever-navy text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Discover Your Style</h2>
            <p className="text-lg mb-6">
              Not sure what suits you best? Try our AI-powered tools to find the perfect fit for your unique style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/chat-stylist">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-forever-navy">
                  Chat with AI Stylist
                </Button>
              </Link>
              <Link to="/style-quiz">
                <Button className="bg-forever-orange hover:bg-white hover:text-forever-navy">
                  Take Style Quiz
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -left-4 -top-4 bg-forever-orange rounded-full w-32 h-32 opacity-20"></div>
              <div className="absolute -right-4 -bottom-4 bg-forever-orange rounded-full w-24 h-24 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843"
                alt="Stylish outfits"
                className="rounded-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiFeaturesBanner;
