
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Thermometer, Cloud, Umbrella, Wind, MapPin, Loader2, AlertTriangle, RotateCw, Clock, CalendarDays, Droplet,
  Sun, Moon, CloudSun, CloudMoon, Cloudy, CloudDrizzle, CloudRain, CloudLightning, CloudSnow, CloudFog, Leaf, Gauge
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Types to match what the API route will provide
type WeatherCondition = {
  temp: number;
  condition: string;
  icon: string; // OWM icon code
  humidity?: number;
  windSpeed?: number;
  windDirection?: string;
  feelsLike?: number;
  dt: number;
};

type HourlyForecastItem = {
  dt: number;
  temp: number;
  condition: string;
  icon: string;
  pop: number; // Probability of precipitation
};

type DailyForecastItem = {
  dt: number;
  dayName: string;
  temp_min: number;
  temp_max: number;
  condition: string;
  icon: string;
  pop: number;
};

type AirQuality = {
  aqi: number; // 1-5
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm2_5?: number;
  pm10?: number;
  dt: number;
};

type WeatherData = {
  locationName: string;
  current: WeatherCondition;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQuality;
};

const getLucideIcon = (iconCode: string): React.ElementType => {
  if (!iconCode) return Cloud; // Default icon
  const mainPart = iconCode.substring(0, 2);
  switch (mainPart) {
    case '01': return iconCode.endsWith('n') ? Moon : Sun;
    case '02': return iconCode.endsWith('n') ? CloudMoon : CloudSun;
    case '03': return Cloud;
    case '04': return Cloudy;
    case '09': return CloudDrizzle; // Shower rain
    case '10': return CloudRain;   // Rain
    case '11': return CloudLightning; // Thunderstorm
    case '13': return CloudSnow;   // Snow
    case '50': return CloudFog;    // Mist/Fog
    default: return Cloud; // Fallback for unknown codes
  }
};

const WeatherIcon = ({ iconCode, className, altText }: { iconCode: string; className?: string; altText?: string }) => {
  const IconComponent = getLucideIcon(iconCode || '03d'); // Default to '03d' if iconCode is null/undefined
  return <IconComponent className={cn("h-8 w-8", className)} aria-label={altText || "Weather icon"} />;
};

const AQIIndicator = ({ aqi }: { aqi: number }) => {
  let label = "Unknown";
  let colorClass = "bg-gray-400";
  let textClass = "text-gray-800";

  if (aqi === 1) { label = "Good"; colorClass = "bg-green-500"; textClass = "text-green-800"; }
  else if (aqi === 2) { label = "Fair"; colorClass = "bg-yellow-400"; textClass = "text-yellow-800"; }
  else if (aqi === 3) { label = "Moderate"; colorClass = "bg-orange-400"; textClass = "text-orange-800"; }
  else if (aqi === 4) { label = "Poor"; colorClass = "bg-red-500"; textClass = "text-red-800"; }
  else if (aqi >= 5) { label = "Very Poor"; colorClass = "bg-purple-600"; textClass = "text-purple-100"; }

  return (
    <div className="flex items-center gap-2">
      <span className={cn("px-3 py-1 text-sm font-semibold rounded-full", colorClass, textClass)}>
        AQI: {aqi} ({label})
      </span>
    </div>
  );
};


export function WeatherDisplay() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");

  const fetchWeatherFromApi = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch weather: ${response.statusText}`);
      }
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      console.error("Fetch weather error in component:", err);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setPermissionStatus("granted");
        fetchWeatherFromApi(latitude, longitude);
      },
      (err) => {
        let message = "An unknown error occurred while getting location.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = "Location access denied. Please enable location services in your browser settings to see local weather.";
            break;
          case err.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
        }
        setError(message);
        setPermissionStatus("denied");
        setIsLoading(false);
        setWeatherData(null); 
      }
    );
  }, [fetchWeatherFromApi]);

  useEffect(() => {
    const checkPermissionAndFetch = async () => {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(status.state);
          if (status.state === 'granted') { 
              handleLocationRequest(); 
          } else if (status.state === 'prompt') {
            setIsLoading(false); 
          } else { 
            setError("Location access denied. Enable location services to see local weather.");
            setIsLoading(false);
          }
          
          status.onchange = () => {
            setPermissionStatus(status.state);
            if (status.state === 'granted') handleLocationRequest();
            else if (status.state === 'denied') {
               setError("Location access denied. Enable location services to see local weather.");
               setIsLoading(false); setWeatherData(null);
            } else if (status.state === 'prompt') {
              setIsLoading(false); setWeatherData(null); setError(null);
            }
          };
        } catch (e) { handleLocationRequest(); } // Fallback
      } else { handleLocationRequest(); } // Fallback
    };
    checkPermissionAndFetch();
  }, [handleLocationRequest]);


  if (isLoading && permissionStatus === 'prompt') {
    return (
      <Card className="shadow-xl text-center">
        <CardHeader><CardTitle>Local Weather</CardTitle><CardDescription>Checking location permission...</CardDescription></CardHeader>
        <CardContent><Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" /><p className="mt-4 text-muted-foreground">To provide local weather, we need your location.</p></CardContent>
      </Card>
    );
  }

  if (permissionStatus !== 'granted' && !isLoading) {
    return (
      <Card className="shadow-xl text-center">
        <CardHeader><CardTitle>Location Access Required</CardTitle><CardDescription>To show local weather, please grant location access.</CardDescription></CardHeader>
        <CardContent>
          {error && permissionStatus === 'denied' && ( 
            <Alert variant="destructive" className="mb-4 text-left"><AlertTriangle className="h-4 w-4" /><AlertTitle>Location Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
          )}
          <Button onClick={handleLocationRequest} disabled={isLoading}><MapPin className="mr-2 h-4 w-4" /> Grant Location Access</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
     return <div className="flex flex-col items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">Fetching weather data...</p></div>;
  }
  
  if (error && !weatherData) {
     return (
      <Card className="shadow-xl text-center">
        <CardHeader><CardTitle>Weather Unavailable</CardTitle></CardHeader>
        <CardContent>
           <Alert variant="destructive" className="mb-4 text-left"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error Fetching Weather</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
            <Button onClick={() => location && fetchWeatherFromApi(location.latitude, location.longitude)} disabled={isLoading || !location}><RotateCw className="mr-2 h-4 w-4" /> Retry</Button>
             {!location && permissionStatus === 'denied' && <p className="text-sm text-muted-foreground mt-2">If location access was denied, please grant it and retry.</p>}
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
        <Card className="shadow-xl text-center">
          <CardHeader><CardTitle>Weather Data Not Loaded</CardTitle><CardDescription>Could not load weather information. Please try again.</CardDescription></CardHeader>
          <CardContent>
            <Button onClick={() => location && fetchWeatherFromApi(location.latitude, location.longitude)} className="mt-4" disabled={isLoading || !location}>
             <MapPin className="mr-2 h-4 w-4" /> {location ? 'Refresh Weather' : 'Get Weather'}
            </Button>
          </CardContent>
        </Card>
    );
  }

  const { current, hourly, daily, airQuality, locationName } = weatherData;

  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 md:h-64">
          <Image src="https://placehold.co/1200x400.png" alt="Weather background" layout="fill" objectFit="cover" data-ai-hint="sky clouds" />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">{locationName}</h1>
            <p className="text-lg md:text-xl capitalize">{current.condition}</p>
            {location && <p className="text-xs mt-1">(Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)})</p>}
            <Button variant="outline" size="sm" onClick={() => location && fetchWeatherFromApi(location.latitude, location.longitude)} className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/50"><RotateCw className="mr-2 h-4 w-4" /> Refresh</Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center md:items-start">
              <WeatherIcon iconCode={current.icon} className="h-20 w-20 md:h-24 md:w-24 text-primary mb-2" altText={current.condition} />
              <p className="text-5xl md:text-6xl font-bold">{current.temp}°C</p>
              <p className="text-muted-foreground">Feels like {current.feelsLike}°C</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="flex items-center gap-2"><Droplet className="h-5 w-5 text-primary" /><span>Humidity: {current.humidity}%</span></div>
              <div className="flex items-center gap-2"><Wind className="h-5 w-5 text-primary" /><span>Wind: {current.windSpeed} km/h {current.windDirection}</span></div>
              <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /><span>Updated: {new Date(current.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></div>
              {airQuality && (<div className="flex items-center gap-2 col-span-1 sm:col-span-2"><Gauge className="h-5 w-5 text-primary" /><AQIIndicator aqi={airQuality.aqi} /></div>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {hourly && hourly.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />3-Hourly Forecast (Next 24 Hours)</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {hourly.map((item, index) => (
                  <Card key={index} className="p-4 min-w-[130px] text-center bg-muted/30">
                    <p className="font-semibold text-sm">{new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true })}</p>
                    <WeatherIcon iconCode={item.icon} className="h-10 w-10 mx-auto my-2 text-primary" altText={item.condition} />
                    <p className="text-lg font-bold">{item.temp}°C</p>
                    <p className="text-xs text-muted-foreground capitalize truncate" title={item.condition}>{item.condition}</p>
                    {item.pop > 0 && <p className="text-xs text-blue-500 flex items-center justify-center gap-1"><Umbrella className="h-3 w-3" /> {item.pop}%</p>}
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {daily && daily.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" />5-Day Forecast</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {daily.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <WeatherIcon iconCode={item.icon} className="h-8 w-8 text-primary" altText={item.condition} />
                  <div>
                    <p className="font-semibold">{item.dayName}</p>
                    <p className="text-xs text-muted-foreground capitalize truncate" title={item.condition}>{item.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.temp_max}° / {item.temp_min}°C</p>
                  {item.pop > 0 && <p className="text-xs text-blue-500 flex items-center justify-end gap-1"><Umbrella className="h-3 w-3" /> {item.pop}%</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {airQuality && (
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-primary" />Air Quality Details</CardTitle></CardHeader>
          <CardContent>
            <AQIIndicator aqi={airQuality.aqi} />
            <Separator className="my-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {airQuality.pm2_5 !== undefined && <div><span className="font-medium">PM2.5:</span> {airQuality.pm2_5.toFixed(2)} µg/m³</div>}
              {airQuality.pm10 !== undefined && <div><span className="font-medium">PM10:</span> {airQuality.pm10.toFixed(2)} µg/m³</div>}
              {airQuality.o3 !== undefined && <div><span className="font-medium">Ozone (O₃):</span> {airQuality.o3.toFixed(2)} µg/m³</div>}
              {airQuality.no2 !== undefined && <div><span className="font-medium">NO₂:</span> {airQuality.no2.toFixed(2)} µg/m³</div>}
              {airQuality.so2 !== undefined && <div><span className="font-medium">SO₂:</span> {airQuality.so2.toFixed(2)} µg/m³</div>}
              {airQuality.co !== undefined && <div><span className="font-medium">CO:</span> {airQuality.co.toFixed(2)} µg/m³</div>}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Last updated: {new Date(airQuality.dt * 1000).toLocaleTimeString()}</p>
          </CardContent>
        </Card>
      )}
      
      <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
        Weather data provided by OpenWeatherMap.
      </CardFooter>
    </div>
  );
}
