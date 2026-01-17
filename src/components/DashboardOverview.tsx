
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, TrendingUp, Bug, Lightbulb, BookText, BarChart3, FlaskConical, 
  Loader2, AlertTriangle, MapPin, CloudSun as DefaultWeatherIcon 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { WeatherData as ApiWeatherData } from "@/app/api/weather/route"; 
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { getLucideIcon } from "@/lib/weatherUtils";


const QuickActionCard = ({ title, description, href, icon: Icon, image, imageHint }: { title: string; description: string; href: string; icon: React.ElementType; image?: string, imageHint?: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
    <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
      <div className="space-y-1">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
      <Icon className="h-6 w-6 text-primary flex-shrink-0" />
    </CardHeader>
    <CardContent className="flex-grow">
      {image && (
        <div className="mb-4 overflow-hidden rounded-md">
          <Image src={image} alt={title} width={600} height={200} className="object-cover aspect-[3/1]" data-ai-hint={imageHint} />
        </div>
      )}
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
    </CardContent>
    <CardContent className="pt-0"> 
      <Link href={href} passHref>
        <Button variant="outline" size="sm" className="w-full group">
          Go to {title} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

type DashboardWeatherData = Pick<ApiWeatherData, 'current' | 'locationName'>;

export function DashboardOverview() {
  const [weatherData, setWeatherData] = useState<DashboardWeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");

  const fetchDashboardWeather = useCallback(async (latitude: number, longitude: number) => {
    setIsWeatherLoading(true);
    setWeatherError(null);
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch weather: ${response.statusText}`);
      }
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setWeatherError(errorMessage);
      setWeatherData(null);
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  const handleLocationRequest = useCallback(() => {
    if (!navigator.geolocation) {
      setWeatherError("Geolocation is not supported by your browser.");
      setIsWeatherLoading(false);
      setLocationPermissionStatus("denied");
      return;
    }
    setIsWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLocationPermissionStatus("granted");
        fetchDashboardWeather(latitude, longitude);
      },
      () => {
        setWeatherError("Location access denied. Enable to see local weather.");
        setLocationPermissionStatus("denied");
        setIsWeatherLoading(false);
        setWeatherData(null);
      }
    );
  }, [fetchDashboardWeather]);

  useEffect(() => {
    const checkPermissionAndFetch = async () => {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name: 'geolocation' });
          setLocationPermissionStatus(status.state);
          if (status.state === 'granted') {
            handleLocationRequest();
          } else {
            setIsWeatherLoading(false); 
            if (status.state === 'denied') {
              setWeatherError("Location access denied. Enable to see local weather.");
            }
          }
        } catch (e) {
          handleLocationRequest();
        }
      } else {
        handleLocationRequest();
      }
    };
    checkPermissionAndFetch();
  }, [handleLocationRequest]);
  

  const marketAlert = {
    crop: "Maize",
    change: "+7%",
    icon: TrendingUp,
  };

  const pestAlert = {
    message: "High risk of Fall Armyworm reported in your region. Check crops regularly.",
    icon: Bug,
  };
  
  const WeatherSummaryIcon = weatherData?.current?.icon ? getLucideIcon(weatherData.current.icon) : DefaultWeatherIcon;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-6 rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to GrowKrishi!</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Your all-in-one platform for smarter farming.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Get quick insights, diagnose crop issues, and manage your farm effectively.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weather</CardTitle>
             <WeatherSummaryIcon className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            {isWeatherLoading && locationPermissionStatus !== 'denied' && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="text-xs text-muted-foreground">Fetching weather...</p>
              </div>
            )}
            {weatherError && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-xs">{weatherError.length > 50 ? weatherError.substring(0,47) + "..." : weatherError}</p>
              </div>
            )}
            {!isWeatherLoading && !weatherError && weatherData?.current && (
              <>
                <div className="text-2xl font-bold">{weatherData.current.temp}°C</div>
                <p className="text-xs text-muted-foreground capitalize">{weatherData.current.condition}</p>
                <p className="text-xs text-muted-foreground">{weatherData.locationName}</p>
              </>
            )}
             {locationPermissionStatus === 'prompt' && !isWeatherLoading && !weatherData && (
                <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary" onClick={handleLocationRequest}>
                    <MapPin className="mr-1 h-3 w-3" />Grant location access
                </Button>
            )}
            {locationPermissionStatus === 'denied' && !isWeatherLoading && (
                 <p className="text-xs text-muted-foreground">Location access needed for weather.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Alert</CardTitle>
            <marketAlert.icon className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketAlert.crop}: <span className="text-green-500">{marketAlert.change}</span></div>
            <p className="text-xs text-muted-foreground">Prices updated recently</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pest & Disease Alert</CardTitle>
            <pestAlert.icon className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{pestAlert.message}</p>
            <Link href="/diagnosis" passHref>
              <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary">Diagnose now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Access key features of GrowKrishi directly.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="Smart Diagnosis"
              description="Upload an image or describe an issue to get AI-powered crop diagnosis."
              href="/diagnosis"
              icon={Lightbulb}
              image="https://placehold.co/600x200.png"
              imageHint="diseased plant"
            />
            <QuickActionCard
              title="Soil Analysis"
              description="Upload soil reports for AI-driven insights and recommendations."
              href="/soil-analysis"
              icon={FlaskConical}
              image="https://placehold.co/600x200.png"
              imageHint="soil analysis test tube"
            />
            <QuickActionCard
              title="Weather Insights"
              description="Get detailed local weather forecasts and air quality information."
              href="/weather"
              icon={DefaultWeatherIcon} // Using DefaultWeatherIcon (CloudSun) as placeholder
              image="https://placehold.co/600x200.png"
              imageHint="weather forecast"
            />
            <QuickActionCard
              title="Crop Pricing"
              description="Track current market prices for various agricultural products."
              href="/pricing"
              icon={BarChart3}
              image="https://placehold.co/600x200.png"
              imageHint="market chart graph"
            />
            <QuickActionCard
              title="Resource Directory"
              description="Find local suppliers, services, and agricultural resources."
              href="/resources"
              icon={BookText}
              image="https://placehold.co/600x200.png"
              imageHint="farm supplies"
            />
        </CardContent>
      </Card>
    </div>
  );
}
