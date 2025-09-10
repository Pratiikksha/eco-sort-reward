import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gift, 
  Award, 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Users, 
  Crown,
  ShoppingBag,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  brand: string;
  available: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  deadline: string;
  type: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badge: string;
  isCurrentUser?: boolean;
}

export const RewardsPage = () => {
  const [currentPoints] = useState(168); // Mock user points
  const { toast } = useToast();

  const rewards: Reward[] = [
    { id: "1", name: "Amazon Gift Card", description: "₹50 Amazon voucher", cost: 1000, category: "vouchers", brand: "Amazon", available: true },
    { id: "2", name: "Flipkart Voucher", description: "₹100 Flipkart credit", cost: 2000, category: "vouchers", brand: "Flipkart", available: true },
    { id: "3", name: "Swiggy Credits", description: "₹75 food delivery credits", cost: 1500, category: "food", brand: "Swiggy", available: true },
    { id: "4", name: "BookMyShow Voucher", description: "₹200 movie/event tickets", cost: 4000, category: "entertainment", brand: "BookMyShow", available: true },
    { id: "5", name: "Myntra Gift Card", description: "₹150 fashion voucher", cost: 3000, category: "fashion", brand: "Myntra", available: false },
  ];

  const challenges: Challenge[] = [
    { id: "1", title: "E-Waste Champion", description: "Sort 5kg of E-Waste this month", progress: 2.5, target: 5, reward: 500, deadline: "2024-01-31", type: "monthly" },
    { id: "2", title: "Daily Sorter", description: "Sort waste for 7 consecutive days", progress: 4, target: 7, reward: 100, deadline: "2024-01-22", type: "streak" },
    { id: "3", title: "Metal Master", description: "Collect 10kg of metal waste", progress: 8.2, target: 10, reward: 300, deadline: "2024-02-15", type: "target" },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "EcoWarrior_2024", points: 2450, badge: "🏆" },
    { rank: 2, name: "GreenGuru", points: 2201, badge: "🥈" },
    { rank: 3, name: "RecycleKing", points: 1987, badge: "🥉" },
    { rank: 4, name: "You", points: currentPoints, badge: "🌱", isCurrentUser: true },
    { rank: 5, name: "EcoFriend", points: 156, badge: "♻️" },
  ];

  const handleRedeem = (reward: Reward) => {
    if (currentPoints >= reward.cost) {
      toast({
        title: "Reward Redeemed!",
        description: `${reward.name} has been added to your account. Check your email for details.`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.cost - currentPoints} more EcoPoints to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vouchers": return ShoppingBag;
      case "food": return Gift;
      case "entertainment": return Star;
      case "fashion": return Award;
      default: return Gift;
    }
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return "text-success";
    if (percentage >= 70) return "text-warning";
    return "text-primary";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Rewards & Challenges</h1>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-reward p-3 rounded-lg">
            <Zap className="h-5 w-5 text-reward-foreground" />
            <span className="text-lg font-bold text-reward-foreground">{currentPoints} EcoPoints</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="rewards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Rewards Store
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const Icon = getCategoryIcon(reward.category);
              const canRedeem = currentPoints >= reward.cost && reward.available;
              
              return (
                <Card key={reward.id} className={`hover:shadow-gentle transition-all duration-300 ${!reward.available ? 'opacity-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-reward/10 rounded-lg">
                          <Icon className="h-4 w-4 text-reward" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {reward.brand}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{reward.cost}</p>
                        <p className="text-xs text-muted-foreground">EcoPoints</p>
                      </div>
                    </div>
                    <CardTitle className="text-base">{reward.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                    <Button 
                      variant={canRedeem ? "reward" : "outline"}
                      className="w-full"
                      disabled={!canRedeem}
                      onClick={() => handleRedeem(reward)}
                    >
                      {reward.available 
                        ? (canRedeem ? "Redeem Now" : `Need ${reward.cost - currentPoints} more points`)
                        : "Coming Soon"
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => {
              const progressPercentage = (challenge.progress / challenge.target) * 100;
              const isCompleted = progressPercentage >= 100;
              
              return (
                <Card key={challenge.id} className={`hover:shadow-gentle transition-all duration-300 ${isCompleted ? 'border-success/30 bg-success/5' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {challenge.type === "streak" && <Flame className="h-5 w-5 text-reward" />}
                        {challenge.type === "monthly" && <Target className="h-5 w-5 text-primary" />}
                        {challenge.type === "target" && <Award className="h-5 w-5 text-accent" />}
                        {challenge.title}
                      </CardTitle>
                      <Badge variant={isCompleted ? "default" : "outline"} className="bg-gradient-reward text-reward-foreground">
                        +{challenge.reward} pts
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={`font-medium ${getProgressColor(challenge.progress, challenge.target)}`}>
                          {challenge.progress} / {challenge.target}
                        </span>
                      </div>
                      <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                      </p>
                      {isCompleted && (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Completed!
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-reward" />
                Community Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                      entry.isCurrentUser 
                        ? 'bg-primary/10 border-2 border-primary/30' 
                        : 'bg-secondary/30 hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{entry.badge}</span>
                        <div className="text-lg font-bold text-foreground">#{entry.rank}</div>
                      </div>
                      <div>
                        <p className={`font-medium ${entry.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {entry.name}
                        </p>
                        {entry.isCurrentUser && (
                          <Badge variant="outline" className="text-xs text-primary">
                            You
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">{entry.points.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">EcoPoints</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-eco text-primary-foreground">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Climb the Rankings!</h3>
              <p className="text-primary-foreground/90 mb-4">
                Sort more waste and earn EcoPoints to move up the leaderboard
              </p>
              <Button variant="accent" className="bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30">
                Start Sorting Now
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};