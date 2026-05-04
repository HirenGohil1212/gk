
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ShieldCheck, TrendingUp, FlaskConical, Stethoscope, CloudSun, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen -m-4 sm:-mx-6 sm:-mt-4 bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/agriculture1/1200/800"
          alt="Lush green agricultural fields"
          fill
          className="object-cover brightness-[0.4]"
          priority
          data-ai-hint="agriculture landscape"
        />
        <div className="container relative z-10 px-4 md:px-6 text-center text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Empowering Farmers with <br className="hidden sm:inline" />
              <span className="text-accent">Intelligent Agriculture</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg sm:text-xl text-white/80 md:text-2xl">
              GrowKrishi combines AI technology with local expertise to help you increase yields and manage soil health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Link href="/dashboard" passHref>
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold">
                    Go to My Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register" passHref>
                    <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold">
                      Get Started for Free
                    </Button>
                  </Link>
                  <Link href="/auth/login" passHref>
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Farmer Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
            Our platform provides end-to-end solutions designed specifically for the modern farmer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Stethoscope}
            title="Smart Diagnosis"
            description="Instantly identify pests and diseases by uploading a photo. Get accurate treatment suggestions powered by AI."
          />
          <FeatureCard 
            icon={FlaskConical}
            title="Soil Analysis"
            description="Upload soil reports to receive tailored crop recommendations and nutrient management strategies."
          />
          <FeatureCard 
            icon={CloudSun}
            title="Weather Insights"
            description="Hyper-local weather forecasts and specialized alerts to plan your farming activities better."
          />
          <FeatureCard 
            icon={TrendingUp}
            title="Market Pricing"
            description="Stay updated with real-time market prices across local and national markets to sell at the right time."
          />
          <FeatureCard 
            icon={Sprout}
            title="Nutrient Guides"
            description="Detailed guides for over 50+ crops. Learn exactly what your soil needs to thrive."
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Vetted Partners"
            description="Connect with trusted agricultural suppliers and local resources verified by our team."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GrowKrishi</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 AgriAssist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="text-primary h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
