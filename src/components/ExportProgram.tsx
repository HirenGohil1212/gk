
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Award, DollarSign, Ship, Sprout, Handshake, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import Image from "next/image";

export function ExportProgram() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: "", description: "" });

  const handleButtonClick = (title: string, description: string) => {
    setAlertContent({ title, description });
    setIsAlertOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Card className="shadow-xl overflow-hidden border-none">
        <div className="relative h-64 md:h-80">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Global farming connection"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            data-ai-hint="global trade agriculture"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <h1 className="text-4xl md:text-5xl font-bold">GrowKrishi Export Program</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl">
              Connecting Quality Indian Farmers with Global Buyers. A transparent, end-to-end ecosystem for agricultural trade.
            </p>
          </div>
        </div>
      </Card>

      {/* How It Works Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">From Local Farms to Global Tables</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our program handles everything from quality assurance to international logistics, creating value for both farmers and buyers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>1. Quality & Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We partner with farmers who meet stringent quality and sustainability benchmarks to ensure the best produce.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>2. Fair & Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Our model ensures a fair market price that benefits the farmer while remaining competitive for the buyer.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Ship className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>3. Seamless Logistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We manage the entire logistics chain, from packaging and certification to shipping and customs.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* For Farmers & Exporters Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* For Farmers */}
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Sprout className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">For Farmers: Go Global</CardTitle>
                <CardDescription>Expand your reach beyond local markets.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
             <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Access International Buyers</h4>
                    <p className="text-sm text-muted-foreground">Sell your produce to a global audience and get the price you deserve.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Fair & Fast Payments</h4>
                    <p className="text-sm text-muted-foreground">Benefit from our transparent pricing and timely payment cycles.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Logistics Handled</h4>
                    <p className="text-sm text-muted-foreground">We manage packaging, shipping, and customs, so you can focus on farming.</p>
                </div>
            </div>
          </CardContent>
          <CardFooter>
             <Button
              className="w-full"
              onClick={() =>
                handleButtonClick(
                  "Feature Coming Soon",
                  "The Farmer Network portal is under development. Stay tuned!"
                )
              }
            >
              Join Our Farmer Network <ArrowRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* For Exporters/Buyers */}
        <Card className="shadow-lg bg-primary/5 flex flex-col">
          <CardHeader>
             <div className="flex items-center gap-4">
              <Handshake className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">For Buyers & Exporters</CardTitle>
                <CardDescription>Source premium produce, simplified.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Verified Quality</h4>
                    <p className="text-sm text-muted-foreground">Access our curated network of reliable, quality-conscious farmers.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Simplified Sourcing</h4>
                    <p className="text-sm text-muted-foreground">A single point of contact for sourcing, quality checks, and negotiation.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Direct-from-Farm</h4>
                    <p className="text-sm text-muted-foreground">Reduce intermediaries and get fresher produce with clear traceability.</p>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                handleButtonClick(
                  "Get in Touch!",
                  "Our buyer portal is launching soon. Please check back later for early access."
                )
              }
            >
              Start Sourcing with Us <ArrowRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

       {/* Investor Attraction Point */}
       <Card className="bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground text-center p-8 shadow-xl">
         <CardHeader className="items-center">
            <TrendingUp className="h-12 w-12" />
            <CardTitle className="text-3xl font-bold">A Strategic Investment in Agri-Tech</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg max-w-2xl">
                Our model creates a scalable, profitable, and impactful ecosystem for global agricultural trade, bridging the gap between local farmers and global demand.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Button
              variant="outline"
              className="bg-transparent text-white hover:bg-white hover:text-primary border-white"
              onClick={() =>
                handleButtonClick(
                  "Let's Collaborate",
                  "We're excited to discuss partnership opportunities. Please check back for contact information."
                )
              }
            >
              Partner With Us
            </Button>
         </CardContent>
       </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
