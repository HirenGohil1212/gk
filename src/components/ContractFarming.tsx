
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
import { Award, DollarSign, MapPin, Sprout, Handshake, ArrowRight, CheckCircle2, Crosshair } from "lucide-react";
import Image from "next/image";

export function ContractFarming() {
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
            alt="Farmers shaking hands in a field"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            data-ai-hint="contract farming agreement"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <h1 className="text-4xl md:text-5xl font-bold">GrowKrishi Contract Farming</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl">
              Your Gateway to Professional Farming and Direct Sourcing.
            </p>
          </div>
        </div>
      </Card>

      {/* For Farmers & Exporters Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* For Land-Seekers */}
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <MapPin className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">Lease Land & Start Farming</CardTitle>
                <CardDescription>Turn your agricultural ambitions into reality.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
             <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Access Vetted Land</h4>
                    <p className="text-sm text-muted-foreground">Find verified, fertile land parcels ready for cultivation, saving you time and effort.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Expert Guidance Included</h4>
                    <p className="text-sm text-muted-foreground">Receive support from our expert agronomists from day one to maximize your yield.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Secure & Fair Agreements</h4>
                    <p className="text-sm text-muted-foreground">We facilitate transparent and fair leasing contracts that protect your interests.</p>
                </div>
            </div>
          </CardContent>
          <CardFooter>
             <Button
              className="w-full"
              onClick={() =>
                handleButtonClick(
                  "Land Leasing Portal Coming Soon",
                  "Our platform for exploring and leasing agricultural land is under development. Please check back soon!"
                )
              }
            >
              Explore Leasing Opportunities <ArrowRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* For FMCG Companies */}
        <Card className="shadow-lg bg-primary/5 flex flex-col">
          <CardHeader>
             <div className="flex items-center gap-4">
              <Handshake className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">Source with Confidence</CardTitle>
                <CardDescription>A one-stop solution for FMCG & Food Businesses.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Assured Quality & Consistency</h4>
                    <p className="text-sm text-muted-foreground">Get a consistent supply of produce that meets your exact specifications and quality standards.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Crosshair className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Precision & Full Traceability</h4>
                    <p className="text-sm text-muted-foreground">Gain complete visibility from seed to harvest, ensuring accountability and safety.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Fair & Stable Pricing</h4>
                    <p className="text-sm text-muted-foreground">Reduce intermediaries to lock in fair prices and build a stable, direct-from-farm supply chain.</p>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() =>
                handleButtonClick(
                  "FMCG Sourcing Portal Coming Soon",
                  "Our portal for direct sourcing is currently being built. Contact us to become an early partner."
                )
              }
            >
              Become a Sourcing Partner <ArrowRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

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
