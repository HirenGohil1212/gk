"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CloudSun, TrendingUp, Bug, Lightbulb, BookText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const QuickActionCard = ({ title, description, href, icon: Icon, image, imageHint }: { title: string; description: string; href: string; icon: React.ElementType; image?: string, imageHint?: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <Icon className="h-6 w-6 text-primary" />
    </CardHeader>
    <CardContent>
      {image && (
        <div className="mb-4 overflow-hidden rounded-md">
          <Image src={image} alt={title} width={600} height={200} className="object-cover aspect-[3/1]" data-ai-hint={imageHint} />
        </div>
      )}
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Link href={href} passHref>
        <Button variant="outline" size="sm" className="w-full group">
          Go to {title} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export function DashboardOverview() {
  // Mock data
  const weatherSummary = {
    temp: "28°C",
    condition: "Sunny with light breeze",
    icon: CloudSun,
  };

  const marketAlert = {
    crop: "Maize",
    change: "+7%",
    icon: TrendingUp,
  };

  const pestAlert = {
    message: "High risk of Fall Armyworm reported in your region. Check crops regularly.",
    icon: Bug,
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-6 rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to AgriAssist!</CardTitle>
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
            <weatherSummary.icon className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherSummary.temp}</div>
            <p className="text-xs text-muted-foreground">{weatherSummary.condition}</p>
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

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActionCard
          title="Smart Diagnosis"
          description="Upload an image or describe an issue to get AI-powered crop diagnosis."
          href="/diagnosis"
          icon={Lightbulb}
          image="https://placehold.co/600x200.png"
          imageHint="diseased plant"
        />
        <QuickActionCard
          title="Resource Directory"
          description="Find local suppliers, services, and agricultural resources."
          href="/resources"
          icon={BookText}
          image="https://placehold.co/600x200.png"
          imageHint="farm supplies"
        />
      </div>
    </div>
  );
}
