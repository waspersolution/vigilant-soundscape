
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CloudSun, Droplets, Thermometer, Wind } from "lucide-react";
import { toast } from "sonner";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we'll use simulated weather data
    // In a real app, you would connect to a weather API
    const getSimulatedWeather = () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Generate random weather data for demo
        const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"];
        const randomWeather: WeatherData = {
          temperature: Math.floor(Math.random() * 25) + 10, // 10-35°C
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
          windSpeed: Math.floor(Math.random() * 20) + 1, // 1-20 km/h
        };
        
        setWeather(randomWeather);
        setLoading(false);
      }, 1000);
    };
    
    getSimulatedWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(getSimulatedWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading && !weather) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Local Weather</CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-2">
            <div className="animate-pulse h-16 w-full bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Local Weather</CardTitle>
        <CardDescription>Current conditions for patrol planning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{weather.condition}</p>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-400" />
                <span className="text-sm text-muted-foreground">{weather.temperature}°C</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-400" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-gray-400" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
