
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
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const now = new Date();
  const currentHour = now.getHours(); // 0-23

  // Simulate temperature changes throughout the day
  let baseTempOffset = 0;
  if (currentHour < 6) baseTempOffset = -2;       // Early morning cool: 3 AM -> -2
  else if (currentHour < 10) baseTempOffset = 1;  // Morning: 8 AM -> +1
  else if (currentHour < 14) baseTempOffset = 4;  // Midday warm: 1 PM -> +4
  else if (currentHour < 18) baseTempOffset = 2;  // Afternoon: 4 PM -> +2
  else if (currentHour < 22) baseTempOffset = 0; // Evening: 8 PM -> 0
  else baseTempOffset = -2;                      // Late night: 11 PM -> -2
  
  // Base temperature influenced slightly by latitude and random fluctuation
  const baseTemp = 18 + Math.round(latitude % 3) - 1.5 + baseTempOffset + (Math.random() * 3 - 1.5);

  const conditionsPool = [
    { condition: "Sunny", icon: Sun },
    { condition: "Mostly Sunny", icon: CloudSun },
    { condition: "Partly Cloudy", icon: CloudSun },
    { condition: "Cloudy", icon: Cloud },
    { condition: "Overcast", icon: CloudFog },
    { condition: "Light Drizzle", icon: CloudDrizzle },
    { condition: "Showers", icon: CloudRain },
    { condition: "Thunderstorms Possible", icon: CloudLightning },
  ];
  const getRandomCondition = () => conditionsPool[Math.floor(Math.random() * conditionsPool.length)];

  const currentCond = getRandomCondition();

  const hourlyForecasts: HourlyForecast[] = [];
  for (let i = 0; i < 4; i++) {
    const hourOffset = i * 2;
    const forecastHour = (currentHour + hourOffset) % 24;
    let hourTempOffset = 0;
    if (forecastHour < 6) hourTempOffset = -1;
    else if (forecastHour < 10) hourTempOffset = 0;
    else if (forecastHour < 14) hourTempOffset = 2;
    else if (forecastHour < 18) hourTempOffset = 1;
    else if (forecastHour < 22) hourTempOffset = -0.5;
    else hourTempOffset = -1;
    
    const cond = getRandomCondition();
    hourlyForecasts.push({
      time: hourOffset === 0 ? "Now" : `+${hourOffset} hrs`,
      temp: parseFloat((baseTemp + hourTempOffset + (Math.random() * 2 - 1)).toFixed(1)),
      condition: cond.condition,
      icon: cond.icon,
    });
  }

  const dailyForecasts: DailyForecast[] = [];
  const days = ["Tomorrow", "Day After", "In 3 Days", "In 4 Days", "In 5 Days"];
  for (let i = 0; i < 5; i++) {
    const dailyTempVariation = Math.random() * 4 - 2; // +/- 2 degrees from base for variation
    const highTemp = parseFloat((baseTemp + 2 + dailyTempVariation + (Math.random() * 3 - 1.5)).toFixed(1));
    const lowTemp = parseFloat((baseTemp - 3 + dailyTempVariation + (Math.random() * 2 - 1)).toFixed(1));
    const cond = getRandomCondition();
    dailyForecasts.push({
      day: days[i],
      high: highTemp,
      low: Math.min(highTemp - (Math.random()*3 + 2), lowTemp), // Ensure low is lower than high
      condition: cond.condition,
      icon: cond.icon,
    });
  }

  return {
    location: "Your Current Location",
    current: {
      temp: parseFloat(baseTemp.toFixed(1)),
      condition: currentCond.condition,
      icon: currentCond.icon,
      humidity: Math.floor(45 + Math.random() * 40), // 45-85%
      windSpeed: Math.floor(3 + Math.random() * 22), // 3-25 km/h
      windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      feelsLike: parseFloat((baseTemp + (Math.random() * 2 - 1)).toFixed(1)),
    },
    hourly: hourlyForecasts,
    daily: dailyForecasts,
  };
};

// Mock function to simulate fetching weather alerts
const fetchWeatherAlerts = async (latitude: number, longitude: number): Promise<WeatherAlertInfo[]> => {
  console.log(`Fetching alerts for lat: ${latitude}, lon: ${longitude}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // This is highly simplified. Real 15-day flood/act-of-God prediction is extremely complex.
  // This mock alert is for UI demonstration purposes.
  const alerts: WeatherAlertInfo[] = [];
  if (Math.random() > 0.65) { // Randomly add a mock alert
    alerts.push({
        id: "alert1",
        title: "Advisory: Potential Heavy Rainfall Event",
        description: "Long-range models suggest a possibility of significant rainfall in approximately 10-15 days. Monitor official forecasts for updates.",
        severity: "warning",
        date: new Date(Date.now() + (10 + Math.floor(Math.random()*5)) * 24 * 60 * 60 * 1000).toLocaleDateString(), 
    });
  }
   if (latitude % 10 > 5 && Math.random() > 0.8) { // another condition for a different alert
    alerts.push({
        id: "alert2",
        title: "Info: Seasonal Planting Window Approaching",
        description: "Favorable conditions for planting typical regional crops are expected in the coming weeks. Plan accordingly.",
        severity: "info",
        date: new Date(Date.now() + (5 + Math.floor(Math.random()*3)) * 24 * 60 * 60 * 1000).toLocaleDateString(),
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
          // Fetch both weather data and alerts in parallel
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
           // Don't auto-load, wait for button or further interaction if needed
          setIsLoading(false); 
        } else { // 'denied'
          setError("Location access denied. Please enable location services in your browser settings to see local weather.");
          setIsLoading(false);
        }
        
        status.onchange = () => {
          setPermissionStatus(status.state);
          if (status.state === 'granted') {
            handleLocationRequest();
          } else if (status.state === 'denied') {
             setError("Location access denied. Please enable location services in your browser settings to see local weather.");
             setIsLoading(false); // Stop loading if permission is now denied
             setWeatherData(null); // Clear any old data
          }
        };
      }).catch(() => {
        // Fallback if permission query fails, just try to request once
        handleLocationRequest();
      });
    } else {
      // Fallback for browsers that don't support navigator.permissions.query
      handleLocationRequest();
    }
  }, [handleLocationRequest]);

  if (isLoading && permissionStatus === 'prompt') { // Initial load before permission is known or if waiting for user
    return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Local Weather</CardTitle>
          <CardDescription>Checking location permission...</CardDescription>
        </CardHeader>
        <CardContent>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">To provide local weather, we need your location.</p>
        </CardContent>
      </Card>
    );
  }


  if (permissionStatus !== 'granted' && !isLoading) { // If permission not granted and not actively loading
    return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Location Access Required</CardTitle>
          <CardDescription>To show you the local weather, please grant location access.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && ( 
            <Alert variant="destructive" className="mb-4 text-left">
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
  
  if (isLoading) { // General loading state after permission granted or during retry
     return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Fetching weather data...</p>
      </div>
    );
  }
  
  if (error && !weatherData) { // This shows if permission was granted, but data fetch failed
     return (
      <Card className="shadow-xl text-center">
        <CardHeader>
          <CardTitle>Weather Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
           <Alert variant="destructive" className="mb-4 text-left">
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
    // This might happen if permission was granted but then revoked or if initial load had issues
    return (
        <Card className="shadow-xl text-center">
          <CardHeader>
            <CardTitle>Weather Data Not Loaded</CardTitle>
            <CardDescription>Could not load weather information. Please try granting location access or retrying.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLocationRequest} className="mt-4" disabled={isLoading}>
             <MapPin className="mr-2 h-4 w-4" /> {location ? 'Refresh Weather' : 'Get Weather'}
            </Button>
          </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 md:h-64">
          <Image src="https://placehold.co/1200x400.png" alt="Weather background" layout="fill" objectFit="cover" data-ai-hint="sky clouds" />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-6 text-center">
            <h1 className="text-4xl font-bold">{weatherData.location}</h1>
            <p className="text-xl">{weatherData.current.condition}</p>
            {location && <p className="text-xs mt-1">(Lat: {location.latitude.toFixed(2)}, Lon: {location.longitude.toFixed(2)})</p>}
            <Button variant="outline" size="sm" onClick={handleLocationRequest} className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/50">
                <RotateCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center md:items-start">
              <WeatherIcon iconName={weatherData.current.icon} className="h-24 w-24 text-primary mb-2" />
              <p className="text-6xl font-bold">{weatherData.current.temp}°C</p>
              <p className="text-muted-foreground">Feels like {weatherData.current.feelsLike}°C</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
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
              <AlertTriangle className="h-5 w-5 text-orange-500" /> Weather Alerts & Advisories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherAlerts.map((alert) => (
              <Alert key={alert.id} variant={alert.severity === "danger" ? "destructive" : "default"} 
                     className={cn(
                        alert.severity === "warning" && "border-orange-500/50 text-orange-700 dark:text-orange-400 [&>svg]:text-orange-500",
                        alert.severity === "info" && "border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500"
                     )}
              >
                {alert.severity === "danger" && <AlertTriangle className="h-4 w-4" />}
                {alert.severity === "warning" && <AlertTriangle className="h-4 w-4" />}
                {alert.severity === "info" && <AlertTriangle className="h-4 w-4" /> /* Using same icon, color differentiates */}
                <AlertTitle>{alert.title} - <span className="font-normal text-xs">({alert.date})</span></AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
            <p className="text-xs text-muted-foreground pt-2">
                Important: Long-range predictions for specific events like floods are highly complex and subject to change. Always consult official meteorological sources for critical decisions. These are mock alerts for demonstration.
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
              <Card key={index} className="p-4 flex flex-col items-center text-center bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg">
                <p className="font-medium text-sm">{hour.time}</p>
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
        <CardContent className="space-y-3">
          {weatherData.daily.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <p className="font-medium w-1/3 text-sm">{day.day}</p>
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
        Weather data is illustrative and randomly generated for demonstration. For accurate, real-time weather, integration with a professional weather API is required.
      </CardFooter>
    </div>
  );
}
