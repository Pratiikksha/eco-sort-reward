import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Zap, Award, Recycle, ArrowRight, TreePine, Users, Target } from "lucide-react";
import heroImage from "@/assets/hero-waste-sorting.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const benefits = [
    {
      icon: Zap,
      title: "AI-Powered Recognition",
      description: "Instantly identify waste types with our advanced machine learning models",
    },
    {
      icon: Award,
      title: "Earn EcoPoints",
      description: "Get rewarded for every piece of waste you sort correctly",
    },
    {
      icon: TreePine,
      title: "Environmental Impact",
      description: "Track your positive contribution to the environment in real-time",
    },
    {
      icon: Users,
      title: "Community Challenges",
      description: "Join eco-warriors in community challenges and leaderboards",
    },
  ];

  const wasteTypes = [
    { name: "Dry Waste", color: "bg-blue-500", points: "+10 pts/kg" },
    { name: "Wet Waste", color: "bg-green-500", points: "+10 pts/kg" },
    { name: "Metal Waste", color: "bg-yellow-500", points: "+20 pts/kg" },
    { name: "E-Waste", color: "bg-purple-500", points: "+30 pts/kg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  AI-Powered Smart
                  <span className="text-primary block">Waste Sorting</span>
                  <span className="text-accent">& Rewards</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Transform waste sorting into a rewarding experience. Use AI to identify waste types instantly and earn EcoPoints for your environmental impact.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={onGetStarted}
                  className="group"
                >
                  Start Sorting, Start Earning
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Waste Items Sorted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">1M+</div>
                  <div className="text-sm text-muted-foreground">EcoPoints Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">500+</div>
                  <div className="text-sm text-muted-foreground">Active Eco-Warriors</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImage} 
                alt="Waste sorting bins" 
                className="w-full rounded-2xl shadow-eco"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-reward p-4 rounded-2xl shadow-reward animate-bounce-gentle">
                <Target className="h-8 w-8 text-reward-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Types Animation */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl font-bold text-foreground">4-Compartment Smart Sorting</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI recognizes and categorizes waste into four main types, each with different reward values
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {wasteTypes.map((type, index) => (
              <Card key={type.name} className="text-center hover:shadow-eco transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-16 h-16 ${type.color} rounded-full mx-auto flex items-center justify-center`}>
                    <Recycle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.points}</p>
                  <div className="text-xs text-primary font-medium">#{index + 1}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose EcoSortX?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience faster segregation, track your eco-impact, and earn instant digital rewards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="hover:shadow-gentle transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 bg-gradient-eco rounded-lg w-fit">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-eco">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of eco-warriors who are already making an impact. Start sorting waste intelligently and earn rewards for your environmental contribution.
            </p>
            <Button 
              variant="accent" 
              size="xl" 
              onClick={onGetStarted}
              className="bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
            >
              Start Your Eco Journey
              <Leaf className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};