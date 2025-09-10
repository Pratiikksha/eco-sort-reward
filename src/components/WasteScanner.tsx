import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import wasteTypesImage from "@/assets/waste-types-icons.jpg";

interface ClassificationResult {
  type: string;
  confidence: number;
  points: number;
  color: string;
}

export const WasteScanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [weight, setWeight] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const wasteTypes = [
    { name: "Dry Waste", points: 10, color: "bg-blue-500", examples: "Paper, plastic bottles, packaging" },
    { name: "Wet Waste", points: 10, color: "bg-green-500", examples: "Food scraps, organic matter" },
    { name: "Metal Waste", points: 20, color: "bg-yellow-500", examples: "Aluminum cans, metal containers" },
    { name: "E-Waste", points: 30, color: "bg-purple-500", examples: "Electronics, batteries, cables" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
        setIsConfirmed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIClassification = async () => {
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI classification result
    const mockResults = [
      { type: "Dry Waste", confidence: 0.92, points: 10, color: "bg-blue-500" },
      { type: "Wet Waste", confidence: 0.87, points: 10, color: "bg-green-500" },
      { type: "Metal Waste", confidence: 0.94, points: 20, color: "bg-yellow-500" },
      { type: "E-Waste", confidence: 0.89, points: 30, color: "bg-purple-500" },
    ];
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setResult(randomResult);
    setIsProcessing(false);
  };

  const handleConfirmEntry = () => {
    if (!result || !weight) {
      toast({
        title: "Missing Information",
        description: "Please add weight information to confirm the entry.",
        variant: "destructive",
      });
      return;
    }

    const totalPoints = result.points * parseFloat(weight);
    
    // Here you would typically save to MongoDB via API
    // For now, we'll show a success message
    
    setIsConfirmed(true);
    toast({
      title: "Waste Entry Confirmed!",
      description: `Added ${weight}kg ${result.type} • Earned ${totalPoints} EcoPoints`,
    });

    // Reset after confirmation
    setTimeout(() => {
      setSelectedImage(null);
      setResult(null);
      setWeight("");
      setIsConfirmed(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">AI Waste Scanner</h1>
        <p className="text-muted-foreground">
          Upload an image of your waste and let our AI classify it instantly
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Upload Waste Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="eco"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {selectedImage && (
              <Button
                variant="accent"
                onClick={simulateAIClassification}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {isProcessing ? "Analyzing..." : "Scan with AI"}
              </Button>
            )}
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Uploaded waste"
                className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-gentle"
              />
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-8">
              <div className="animate-pulse-eco">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">AI is analyzing your waste...</p>
              </div>
            </div>
          )}

          {/* Classification Result */}
          {result && !isProcessing && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Classification Result</h3>
                  <Badge variant="outline" className="text-primary">
                    {Math.round(result.confidence * 100)}% confidence
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${result.color} rounded-full`}></div>
                    <span className="font-medium text-foreground">{result.type}</span>
                    <Badge variant="secondary">+{result.points} pts/kg</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="Enter weight in kg"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="eco"
                        onClick={handleConfirmEntry}
                        disabled={!weight || isConfirmed}
                        className="w-full"
                      >
                        {isConfirmed ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Confirmed!
                          </>
                        ) : (
                          "Confirm Entry"
                        )}
                      </Button>
                    </div>
                  </div>

                  {weight && (
                    <div className="bg-gradient-reward/10 p-3 rounded-lg">
                      <p className="text-sm font-medium text-foreground">
                        Total EcoPoints: {result.points * parseFloat(weight || "0")} points
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Waste Types Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Types Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {wasteTypes.map((type) => (
              <div key={type.name} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className={`w-4 h-4 ${type.color} rounded-full flex-shrink-0`}></div>
                <div>
                  <h4 className="font-medium text-foreground">{type.name}</h4>
                  <p className="text-xs text-muted-foreground">{type.examples}</p>
                  <p className="text-xs font-medium text-primary">+{type.points} pts/kg</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>AI accuracy improves with clear, well-lit images</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};