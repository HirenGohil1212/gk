
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun, Umbrella, Wind, MapPin, Loader2, AlertTriangle, RotateCw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type WeatherCondition = {
  temp: number;
  condition: string;
  icon: React.ElementType;
  humidity?: number;
  windSpeed?: number;
  windDirection?: string;
  feelsLike?: number;
};

type HourlyForecast = {
  time: string;
  temp: number;
  condition: string;
  icon: React.ElementType;
};

type DailyForecast = {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: React.ElementType;
};

type WeatherData = {
  location: string;
  current: WeatherCondition;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};

type WeatherAlertInfo = {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "info" | "danger";
  date: string;
};

// Mock function to simulate fetching weather data
const fetchWeatherDataForLocation = async (latitude: number, longitude: number): Promise<WeatherData> => {
  console.log(`Fetching weather for lat: ${latitude}, lon: ${longitude}`);
  // In a real app, you'd call a weather API here.
  // For now, return slightly modified mock data.
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  // Example: Slightly adjust temperature based on location for demo
  const baseTemp = 20 + Math.round(latitude % 10); // Simple variation

  return {
    location: "Your Current Location",
    current: {
      temp: baseTemp + 2,
      condition: "Mostly Sunny",
      icon: CloudSun,
      humidity: 60,
      windSpeed: 15,
      windDirection: "SW",
      feelsLike: baseTemp + 3,
    },
    hourly: [
      { time: "Now", temp: baseTemp + 2, condition: "Mostly Sunny", icon: CloudSun },
      { time: "+2 hrs", temp: baseTemp + 1, condition: "Sunny", icon: Sun },
      { time: "+4 hrs", temp: baseTemp, condition: "Clear", icon: Sun },
      { time: "+6 hrs", temp: baseTemp - 2, condition: "Clear", icon: Sun },
    ],
    daily: [
      { day: "Tomorrow", high: baseTemp + 4, low: baseTemp - 2, condition: "Sunny", icon: Sun },
      { day: "Day After", high: baseTemp + 3, low: baseTemp -1, condition: "Partly Cloudy", icon: CloudSun },
      { day: "In 3 Days", high: baseTemp + 1, low: baseTemp - 3, condition: "Light Showers", icon: CloudRain },
      { day: "In 4 Days", high: baseTemp, low: baseTemp - 4, condition: "Cloudy", icon: Cloud },
      { day: "In 5 Days", high: baseTemp + 2, low: baseTemp - 2, condition: "Sunny Intervals", icon: CloudSun },
    ],
  };
};

// Mock function to simulate fetching weather alerts
const fetchWeatherAlerts = async (latitude: number, longitude: number): Promise<WeatherAlertInfo[]> => {
  console.log(`Fetching alerts for lat: ${latitude}, lon: ${longitude}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // This is highly simplified. Real 15-day flood/act-of-God prediction is extremely complex
  // and usually not available via standard weather APIs with such precision.
  // This mock alert is for UI demonstration purposes.
  const alerts: WeatherAlertInfo[] = [];
  if (Math.random() > 0.7) { // Randomly add a mock alert
    alerts.push({
        id: "alert1",
        title: "Potential Heavy Rainfall",
        description: "Forecast models indicate a possibility of heavy rainfall in 10-15 days. Monitor updates closely.",
        severity: "warning",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Approx 12 days from now
    });
  }
  return alerts;
};


const WeatherIcon = ({ iconName, className }: { iconName: React.ElementType; className?: string }) => {
  const IconComponent = iconName;
  return <IconComponent className={cn("h-8 w-8", className)} />;
};

export function WeatherDisplay() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlertInfo[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");

  const handleLocationRequest = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      setPermissionStatus("denied");
      return;
    }

    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setPermissionStatus("granted");
        try {
          const [currentWeather, alerts] = await Promise.all([
            fetchWeatherDataForLocation(latitude, longitude),
            fetchWeatherAlerts(latitude, longitude)
          ]);
          setWeatherData(currentWeather);
          setWeatherAlerts(alerts);
        } catch (err) {
          setError("Failed to fetch weather data. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access denied. Please enable location services in your browser settings to see local weather.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred while getting location.");
            break;
        }
        setPermissionStatus("denied");
        setIsLoading(false);
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this function is stable

  useEffect(() => {
    // Try to get permission status on load, if supported
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(status => {
        setPermissionStatus(status.state);
        if (status.state === 'granted') {
          handleLocationRequest();
        } else if (status.state === 'prompt') {
          setIsLoading(false); 
        } else { 
          setError("Location access denied. Please enable location services in your browser settings to see local weather.");
          setIsLoading(false);
        }
        // It's important to assign the onchange handler *after* the initial state check
        // to avoid potential race conditions or double calls if status changes immediately.
        status.onchange = () => {
          setPermissionStatus(status.state);
          if (status.state === 'granted') handleLocationRequest();
        };
      }).catch(() => {
        // Fallback if permission query fails, just try to request
        handleLocationRequest();
      });
    } else {
      // Fallback for browsers that don't support navigator.permissions.query
      handleLocationRequest();
    }
  }, [handleLocationRequest]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Fetching weather data...</p>
      </div>
    );
  }

  if (permissionStatus !== 'granted' && !weatherData) {
    return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Location Access Required</CardTitle>
          <CardDescription>To show you the local weather, please grant location access.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && ( // Show error here too if permission is not granted but there was an attempt
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleLocationRequest} disabled={isLoading}>
            <MapPin className="mr-2 h-4 w-4" /> Grant Location Access
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (error && !weatherData) { // This shows if permission was granted, but data fetch failed
     return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Weather Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
           <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleLocationRequest} disabled={isLoading}>
             <RotateCw className="mr-2 h-4 w-4" /> Retry
            </Button>
        </CardContent>
      </Card>
    );
  }


  if (!weatherData) {
    // Fallback if somehow weatherData is null despite no error and not loading
    return (
        <div className="text-center py-10">
            <p className="text-muted-foreground">Could not load weather data. Please try again later.</p>
            <Button onClick={handleLocationRequest} className="mt-4" disabled={isLoading}>
             <RotateCw className="mr-2 h-4 w-4" /> Retry
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 md:h-64">
          <Image src="https://placehold.co/1200x400.png" alt="Weather background" layout="fill" objectFit="cover" data-ai-hint="sky clouds" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-6 text-center">
            <h1 className="text-4xl font-bold">{weatherData.location}</h1>
            <p className="text-xl">{weatherData.current.condition}</p>
            {location && <p className="text-xs mt-1">(Lat: {location.latitude.toFixed(2)}, Lon: {location.longitude.toFixed(2)})</p>}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center md:items-start">
              <WeatherIcon iconName={weatherData.current.icon} className="h-24 w-24 text-primary mb-2" />
              <p className="text-6xl font-bold">{weatherData.current.temp}°C</p>
              <p className="text-muted-foreground">Feels like {weatherData.current.feelsLike}°C</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Umbrella className="h-5 w-5 text-primary" />
                <span>Humidity: {weatherData.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                <span>Wind: {weatherData.current.windSpeed} km/h {weatherData.current.windDirection}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {weatherAlerts.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherAlerts.map((alert) => (
              <Alert key={alert.id} variant={alert.severity === "danger" ? "destructive" : "default"} className={cn(alert.severity === "warning" && "border-yellow-500/50 text-yellow-700 [&>svg]:text-yellow-700 dark:border-yellow-500/50 dark:text-yellow-400 dark:[&>svg]:text-yellow-400")}>
                <AlertTriangle className="h-4 w-4" /> {/* Using AlertTriangle for all severities for consistency, color changes based on variant */}
                <AlertTitle>{alert.title} - <span className="font-normal text-xs">({alert.date})</span></AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
            <p className="text-xs text-muted-foreground pt-2">
                Important: Long-range predictions for specific events like floods are highly complex and subject to change. Always consult official meteorological sources for critical decisions.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {weatherData.hourly.map((hour, index) => (
              <Card key={index} className="p-4 flex flex-col items-center text-center bg-muted/20 hover:bg-muted/40 transition-colors">
                <p className="font-medium">{hour.time}</p>
                <WeatherIcon iconName={hour.icon} className="my-2 h-10 w-10 text-primary" />
                <p className="text-lg font-semibold">{hour.temp}°C</p>
                <p className="text-xs text-muted-foreground">{hour.condition}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weatherData.daily.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-md hover:bg-muted/40 transition-colors">
              <p className="font-medium w-1/3">{day.day}</p>
              <div className="w-1/3 flex flex-col items-center">
                <WeatherIcon iconName={day.icon} className="h-7 w-7 text-primary" />
                <p className="text-xs text-muted-foreground mt-1">{day.condition}</p>
              </div>
              <p className="text-sm w-1/3 text-right">
                <span className="font-semibold">{day.high}°</span> / {day.low}°
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
        Weather data is illustrative. For accurate, real-time weather, integration with a professional weather API is required.
      </CardFooter>
    </div>
  );
}

    