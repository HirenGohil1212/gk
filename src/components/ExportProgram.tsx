
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, DollarSign, Ship, Sprout, Handshake, ArrowRight } from "lucide-react";
import Image from "next/image";

export function ExportProgram() {
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
            data-ai-hint="global trade agriculture"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center text-white p-6">
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
            Our program is a complete solution that handles everything from quality assurance to international logistics, creating value for both farmers and buyers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>1. Quality & Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We partner with farmers who meet stringent quality and sustainability benchmarks. Our selection process ensures only the best produce enters the global market.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>2. Fair & Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We establish a fair market price that benefits the farmer while remaining competitive for the buyer. Our model ensures transparency at every step.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Ship className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>3. Seamless Logistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>From packaging and certification to shipping and customs, we manage the entire logistics chain to ensure timely and safe delivery anywhere in the world.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* For Farmers & Exporters Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* For Farmers */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Sprout className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">Are You a Farmer?</CardTitle>
                <CardDescription>Join our network to get access to international markets.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <h3 className="font-semibold text-lg">How We Select Our Farmers:</h3>
             <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">Quality First:</span> Consistent delivery of high-quality produce.</li>
                <li><span className="font-medium text-foreground">Sustainable Practices:</span> Commitment to eco-friendly and sustainable farming methods.</li>
                <li><span className="font-medium text-foreground">Certification Ready:</span> Willingness to meet international export standards and certifications.</li>
             </ul>
             <p className="pt-4">
                Ready to take your farm global? We provide the guidance and connections you need.
             </p>
          </CardContent>
          <CardContent>
             <Button className="w-full">Connect with Us <ArrowRight className="ml-2" /></Button>
          </CardContent>
        </Card>

        {/* For Exporters/Buyers */}
        <Card className="shadow-lg bg-primary/5">
          <CardHeader>
             <div className="flex items-center gap-4">
              <Handshake className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">Are You an Exporter or Buyer?</CardTitle>
                <CardDescription>Source premium produce directly from our network of verified farmers.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg">Why Partner with GrowKrishi?</h3>
             <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">Verified Quality:</span> Direct access to a curated network of reliable, quality-conscious farmers.</li>
                <li><span className="font-medium text-foreground">Simplified Sourcing:</span> We act as your single point of contact, managing sourcing, quality checks, and pricing negotiation.</li>
                <li><span className="font-medium text-foreground">Direct from Farm:</span> Reduce intermediaries and get fresher produce with clear traceability.</li>
             </ul>
             <p className="pt-4">
                Looking for reliable agricultural sourcing? Find your next partnership here.
             </p>
          </CardContent>
          <CardContent>
            <Button className="w-full" variant="secondary">Start Sourcing <ArrowRight className="ml-2" /></Button>
          </CardContent>
        </Card>
      </div>

       {/* Investor Attraction Point */}
       <Card className="bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground text-center p-8 shadow-xl">
         <CardHeader>
            <CardTitle className="text-3xl font-bold">An Investment in Global Food Security</CardTitle>
         </CardHeader>
         <CardContent className="max-w-3xl mx-auto">
            <p className="text-lg">
                The GrowKrishi Export Program isn't just about trade; it's about building a sustainable and equitable food supply chain. By bridging the gap between local Indian farmers and global demand, we are creating a scalable, profitable, and impactful business model. We are seeking partners and investors to help us expand our reach and empower more communities.
            </p>
            <Button variant="outline" className="mt-6 bg-transparent text-white hover:bg-white hover:text-primary">
                Contact Our Investor Relations Team
            </Button>
         </CardContent>
       </Card>

    </div>
  );
}
