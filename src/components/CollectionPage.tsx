import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Truck, History, Bell, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CollectionSchedule {
  id: string;
  waste_type: string;
  scheduled_date: string;
  scheduled_time: string;
  area: string;
  status: string;
  notes?: string;
}

interface CollectionHistory {
  id: string;
  waste_type: string;
  collected_date: string;
  collected_time?: string;
  weight_collected_kg?: number;
  collection_area?: string;
}

export const CollectionPage = () => {
  const [schedules, setSchedules] = useState<CollectionSchedule[]>([]);
  const [history, setHistory] = useState<CollectionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('collection_schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (schedulesError) throw schedulesError;

      // Fetch history
      const { data: historyData, error: historyError } = await supabase
        .from('collection_history')
        .select('*')
        .eq('user_id', user.id)
        .order('collected_date', { ascending: false });

      if (historyError) throw historyError;

      setSchedules(schedulesData || []);
      setHistory(historyData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch collection data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSampleSchedule = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sampleSchedules = [
        {
          user_id: user.id,
          waste_type: 'Dry',
          scheduled_date: '2025-01-15',
          scheduled_time: '09:00:00',
          area: 'Residential Block A',
          status: 'scheduled',
          notes: 'Regular weekly collection'
        },
        {
          user_id: user.id,
          waste_type: 'Wet',
          scheduled_date: '2025-01-16',
          scheduled_time: '08:30:00',
          area: 'Residential Block A',
          status: 'scheduled',
          notes: 'Organic waste collection'
        }
      ];

      const { error } = await supabase
        .from('collection_schedules')
        .insert(sampleSchedules);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sample collection schedules created",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getWasteTypeColor = (type: string) => {
    const colors = {
      'Dry': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      'Wet': 'bg-green-500/10 text-green-700 dark:text-green-300',
      'Metal': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
      'E-Waste': 'bg-red-500/10 text-red-700 dark:text-red-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      'completed': 'bg-green-500/10 text-green-700 dark:text-green-300',
      'missed': 'bg-red-500/10 text-red-700 dark:text-red-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-700';
  };

  const isUpcomingSoon = (date: string, time: string) => {
    const scheduleDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffHours = (scheduleDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading collection data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Collection Management</h1>
        <p className="text-xl text-muted-foreground">
          Stay updated with waste collection schedules for your area
        </p>
      </div>

      {schedules.length === 0 && (
        <Card className="mb-6 border-dashed">
          <CardContent className="text-center py-8">
            <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Collection Schedules</h3>
            <p className="text-muted-foreground mb-4">
              No collection schedules found. Create some sample data to get started.
            </p>
            <Button onClick={createSampleSchedule}>
              Create Sample Schedules
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Collections</TabsTrigger>
          <TabsTrigger value="history">Collection History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {schedules
            .filter(schedule => schedule.status === 'scheduled')
            .map((schedule) => (
              <Card key={schedule.id} className="relative overflow-hidden">
                {isUpcomingSoon(schedule.scheduled_date, schedule.scheduled_time) && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-300 animate-pulse">
                      <Bell className="h-3 w-3 mr-1" />
                      Due Soon
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <span>{schedule.waste_type} Waste Collection</span>
                      </CardTitle>
                      <CardDescription>{schedule.notes}</CardDescription>
                    </div>
                    <Badge className={getWasteTypeColor(schedule.waste_type)}>
                      {schedule.waste_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(schedule.scheduled_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{schedule.scheduled_time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{schedule.area}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge className={getStatusColor(schedule.status)}>
                      {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

          {schedules.filter(schedule => schedule.status === 'scheduled').length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No upcoming collections scheduled.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {history.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-primary" />
                    <span>{record.waste_type} Collection</span>
                  </div>
                  <Badge className={getWasteTypeColor(record.waste_type)}>
                    {record.waste_type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(record.collected_date).toLocaleDateString()}</span>
                  </div>
                  {record.collected_time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{record.collected_time}</span>
                    </div>
                  )}
                  {record.weight_collected_kg && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Weight:</span>
                      <span>{record.weight_collected_kg} kg</span>
                    </div>
                  )}
                  {record.collection_area && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{record.collection_area}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {history.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
                <p className="text-muted-foreground">
                  Collection history will appear here once waste has been collected.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};