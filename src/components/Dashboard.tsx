import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Award, 
  TreePine, 
  Zap, 
  Target,
  Bell,
  Flame
} from "lucide-react";

interface WasteEntry {
  id: string;
  date: string;
  type: string;
  weight: number;
  points: number;
  color: string;
}

export const Dashboard = () => {
  // Mock data - in real app, this would come from MongoDB via API
  const mockEntries: WasteEntry[] = [
    { id: "1", date: "2024-01-15", type: "E-Waste", weight: 2.5, points: 75, color: "bg-purple-500" },
    { id: "2", date: "2024-01-15", type: "Metal Waste", weight: 1.2, points: 24, color: "bg-yellow-500" },
    { id: "3", date: "2024-01-14", type: "Dry Waste", weight: 3.0, points: 30, color: "bg-blue-500" },
    { id: "4", date: "2024-01-14", type: "Wet Waste", weight: 2.1, points: 21, color: "bg-green-500" },
    { id: "5", date: "2024-01-13", type: "Dry Waste", weight: 1.8, points: 18, color: "bg-blue-500" },
  ];

  const totalPoints = mockEntries.reduce((sum, entry) => sum + entry.points, 0);
  const totalWeight = mockEntries.reduce((sum, entry) => sum + entry.weight, 0);
  
  const todayEntries = mockEntries.filter(entry => entry.date === "2024-01-15");
  const todayPoints = todayEntries.reduce((sum, entry) => sum + entry.points, 0);
  const todayWeight = todayEntries.reduce((sum, entry) => sum + entry.weight, 0);

  const weeklyGoal = 500; // points
  const weeklyProgress = (totalPoints / weeklyGoal) * 100;
  
  const streak = 7; // days
  const treesPlanted = Math.floor(totalWeight * 0.5); // 0.5 trees per kg

  const wasteTypeStats = [
    { type: "Dry Waste", weight: 4.8, points: 48, color: "bg-blue-500", percentage: 45 },
    { type: "Wet Waste", weight: 2.1, points: 21, color: "bg-green-500", percentage: 20 },
    { type: "Metal Waste", weight: 1.2, points: 24, color: "bg-yellow-500", percentage: 11 },
    { type: "E-Waste", weight: 2.5, points: 75, color: "bg-purple-500", percentage: 24 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Eco Dashboard</h1>
          <p className="text-muted-foreground">Track your environmental impact and progress</p>
        </div>
        <Badge variant="outline" className="text-reward border-reward/30">
          <Flame className="h-3 w-3 mr-1" />
          {streak} day streak
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-eco transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Points</p>
                <p className="text-2xl font-bold text-primary">{todayPoints}</p>
              </div>
              <div className="p-2 bg-gradient-eco rounded-lg">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-gentle transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Weight</p>
                <p className="text-2xl font-bold text-foreground">{totalWeight.toFixed(1)}kg</p>
              </div>
              <div className="p-2 bg-secondary rounded-lg">
                <BarChart3 className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-gentle transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">EcoPoints</p>
                <p className="text-2xl font-bold text-accent">{totalPoints}</p>
              </div>
              <div className="p-2 bg-accent/10 rounded-lg">
                <Award className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-gentle transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trees Equivalent</p>
                <p className="text-2xl font-bold text-success">{treesPlanted}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <TreePine className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress & Collection Notice */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Weekly Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{totalPoints} / {weeklyGoal} points</span>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {weeklyProgress >= 100 
                ? "🎉 Goal achieved! Keep up the great work!" 
                : `${(weeklyGoal - totalPoints)} points to reach your weekly goal`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Collection Update
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Next Collection</p>
              <p className="text-sm text-muted-foreground">Tomorrow, 9:00 AM</p>
            </div>
            <Badge variant="outline" className="text-accent">Dry Waste Collection</Badge>
            <Button variant="accent" size="sm" className="w-full">
              Set Reminder
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Waste Breakdown & History */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waste Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wasteTypeStats.map((stat) => (
              <div key={stat.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-foreground">{stat.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{stat.weight}kg</p>
                    <p className="text-xs text-muted-foreground">{stat.points} pts</p>
                  </div>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mockEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${entry.color} rounded-full`}></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.type}</p>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{entry.weight}kg</p>
                    <Badge variant="secondary" className="text-xs">+{entry.points} pts</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact */}
      <Card className="bg-gradient-nature border-success/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TreePine className="h-5 w-5 text-success" />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{totalWeight.toFixed(1)}kg</div>
              <p className="text-sm text-muted-foreground">Waste Diverted from Landfills</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{(totalWeight * 2.3).toFixed(1)}kg</div>
              <p className="text-sm text-muted-foreground">CO₂ Emissions Prevented</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{treesPlanted}</div>
              <p className="text-sm text-muted-foreground">Equivalent Trees Planted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};