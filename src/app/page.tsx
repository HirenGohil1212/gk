
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ShieldCheck, TrendingUp, FlaskConical, Stethoscope, CloudSun, ArrowRight, CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import images from "@/app/lib/placeholder-images.json";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen -m-4 sm:-mx-6 sm:-mt-4 bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src={images.hero.url}
          alt={images.hero.alt}
          fill
          className="object-cover brightness-[0.4]"
          priority
          data-ai-hint={images.hero.hint}
        />
        <div className="container relative z-10 px-4 md:px-6 text-center text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Empowering Farmers with <br className="hidden sm:inline" />
              <span className="text-accent">Intelligent Agriculture</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg sm:text-xl text-white/80 md:text-2xl">
              GrowKrishi combines AI technology with agricultural expertise to help you increase yields, manage soil health, and access global markets.
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
            title="AI Crop Diagnosis"
            description="Instantly identify pests and diseases by uploading a photo. Get accurate treatment suggestions powered by advanced AI."
          />
          <FeatureCard 
            icon={FlaskConical}
            title="Soil Analysis"
            description="Upload your soil reports to receive tailored crop recommendations and nutrient management strategies to maximize productivity."
          />
          <FeatureCard 
            icon={CloudSun}
            title="Weather Insights"
            description="Hyper-local weather forecasts and specialized alerts to plan your farming activities better and reduce risks."
          />
          <FeatureCard 
            icon={TrendingUp}
            title="Market Pricing"
            description="Stay updated with real-time market prices across local, national, and international markets to sell your produce at the right time."
          />
          <FeatureCard 
            icon={Sprout}
            title="Nutrient Guides"
            description="Detailed guides for over 50+ crops, herbs, and vegetables. Learn exactly what your soil needs to thrive."
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Vetted Partners"
            description="Connect with trusted agricultural suppliers, logistics providers, and local resources verified by our team."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-24">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-[800px] mx-auto space-y-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Building the Future of Agriculture</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-accent">50k+</p>
                <p className="text-white/60 text-sm">Active Farmers</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-accent">100+</p>
                <p className="text-white/60 text-sm">Vetted Partners</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-accent">95%</p>
                <p className="text-white/60 text-sm">Diagnosis Accuracy</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-accent">12</p>
                <p className="text-white/60 text-sm">Countries Reached</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-24 px-4 md:px-6">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-none p-8 md:p-12 text-center">
            <div className="max-w-[600px] mx-auto space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Grow Smarter?</h2>
                <p className="text-muted-foreground text-lg">
                    Join thousands of farmers who are already using GrowKrishi to transform their fields and livelihoods.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/register">
                        <Button size="lg" className="w-full sm:w-auto">
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <CircleCheck className="h-4 w-4 text-green-500" /> Free Setup
                    </span>
                    <span className="flex items-center gap-1">
                        <CircleCheck className="h-4 w-4 text-green-500" /> No Hidden Fees
                    </span>
                    <span className="flex items-center gap-1">
                        <CircleCheck className="h-4 w-4 text-green-500" /> Expert Support
                    </span>
                </div>
            </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GrowKrishi</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">About Us</Link>
              <Link href="#" className="hover:text-primary">Contact</Link>
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 GrowKrishi. All rights reserved.</p>
          </div>
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
