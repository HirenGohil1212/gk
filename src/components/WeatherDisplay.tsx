"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun, Thermometer, Umbrella, Wind } from "lucide-react";
import Image from "next/image";

// Mock data
const weatherData = {
  location: "Green Valley Farms",
  current: {
    temp: 26,
    condition: "Partly Cloudy",
    icon: CloudSun,
    humidity: 65,
    windSpeed: 12, // km/h
    windDirection: "NW",
    feelsLike: 28,
  },
  hourly: [
    { time: "3 PM", temp: 27, condition: "Sunny", icon: Sun },
    { time: "6 PM", temp: 24, condition: "Partly Cloudy", icon: CloudSun },
    { time: "9 PM", temp: 22, condition: "Clear", icon: Sun }, // Assuming Sun icon for clear night for simplicity
    { time: "12 AM", temp: 20, condition: "Clear", icon: Sun },
  ],
  daily: [
    { day: "Tomorrow", high: 28, low: 20, condition: "Sunny", icon: Sun },
    { day: "Mon", high: 29, low: 21, condition: "Partly Cloudy", icon: CloudSun },
    { day: "Tue", high: 27, low: 19, condition: "Showers", icon: CloudRain },
    { day: "Wed", high: 25, low: 18, condition: "Thunderstorms", icon: CloudLightning },
    { day: "Thu", high: 26, low: 19, condition: "Cloudy", icon: Cloud },
  ],
};

const WeatherIcon = ({ iconName, className }: { iconName: React.ElementType, className?: string }) => {
  const IconComponent = iconName;
  return <IconComponent className={cn("h-8 w-8", className)} />;
};

export function WeatherDisplay() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 md:h-64">
            <Image src="https://placehold.co/1200x400.png" alt="Weather background" layout="fill" objectFit="cover" data-ai-hint="sky clouds" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-6">
                <h1 className="text-4xl font-bold">{weatherData.location}</h1>
                <p className="text-xl">{weatherData.current.condition}</p>
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
                    {/* Add more details if needed */}
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {weatherData.hourly.map((hour, index) => (
              <Card key={index} className="p-4 flex flex-col items-center text-center bg-muted/30">
                <p className="font-medium">{hour.time}</p>
                <WeatherIcon iconName={hour.icon} className="my-2 h-10 w-10 text-primary" />
                <p className="text-lg font-semibold">{hour.temp}°C</p>
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
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
              <p className="font-medium w-1/3">{day.day}</p>
              <div className="w-1/3 flex justify-center">
                <WeatherIcon iconName={day.icon} className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm w-1/3 text-right">
                <span className="font-semibold">{day.high}°</span> / {day.low}°
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
