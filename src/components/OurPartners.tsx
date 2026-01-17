
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
    Sprout,
    Building2,
    Globe,
    Warehouse,
    Factory,
    Wrench,
    Landmark,
    FlaskConical,
    ArrowRight,
    Users
} from "lucide-react";
import Image from "next/image";

const partnerTypes = [
  {
    icon: Sprout,
    title: "Farmers & Growers",
    description: "The backbone of our ecosystem. We empower you with technology, market access, and fair pricing.",
  },
  {
    icon: Building2,
    title: "FMCGs & Buyers",
    description: "Source high-quality, traceable produce directly from farms, ensuring consistency and reliability for your products.",
  },
  {
    icon: Globe,
    title: "Exporters",
    description: "Access a verified network of farmers and a streamlined logistics process to take Indian agriculture global.",
  },
  {
    icon: Warehouse,
    title: "Storage & Logistics Providers",
    description: "Become a crucial link in our supply chain, providing state-of-the-art warehousing and transportation services.",
  },
  {
    icon: Factory,
    title: "Agro-Processing Units",
    description: "Partner with us to add value to raw produce, creating processed goods for domestic and international markets.",
  },
  {
    icon: Wrench,
    title: "Service Providers",
    description: "Offer your expertise and services, from equipment rental and drone spraying to soil testing and advisory.",
  },
  {
    icon: Landmark,
    title: "Financial Institutions",
    description: "Collaborate to provide accessible credit, insurance, and financial products tailored for the agricultural sector.",
  },
  {
    icon: FlaskConical,
    title: "Research & Agronomy Experts",
    description: "Join us in our mission to innovate and disseminate best practices in farming and crop management.",
  },
];


export function OurPartners() {
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
            alt="A network of partners"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            data-ai-hint="business partners handshake"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <h1 className="text-4xl md:text-5xl font-bold">Join Our Agricultural Ecosystem</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl">
             We believe in the power of collaboration. Discover how you can be a part of the GrowKrishi network.
            </p>
          </div>
        </div>
      </Card>

      {/* Partners Grid Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Our Valued Partners</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our success is built on a network of diverse and dedicated partners, each playing a vital role.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerTypes.map((partner, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                    <partner.icon className="h-10 w-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="mb-2 text-lg sm:text-xl">{partner.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{partner.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
       <Card className="bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground text-center p-8 md:p-12 shadow-xl">
         <CardHeader className="items-center p-0">
            <Users className="h-12 w-12" />
            <CardTitle className="text-2xl sm:text-3xl font-bold mt-4">Become a GrowKrishi Partner</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg max-w-2xl mt-2">
                Are you ready to innovate, grow, and create a lasting impact in the agricultural sector? Let's connect.
            </CardDescription>
         </CardHeader>
         <CardContent className="mt-6 p-0">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white hover:text-primary border-2 border-white font-bold text-base"
               onClick={() =>
                handleButtonClick(
                  "Partnership Portal Coming Soon",
                  "Our platform for onboarding new partners is under development. Please check back soon for more information on how to join our ecosystem!"
                )
              }
            >
              Be Our Partner Now <ArrowRight className="ml-2 h-5 w-5" />
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
