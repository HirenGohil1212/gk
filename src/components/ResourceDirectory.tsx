"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Globe, Search, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Resource = {
  id: string;
  name: string;
  category: "Seeds" | "Fertilizers" | "Equipment" | "Consultancy" | "Logistics";
  description: string;
  contact: {
    phone?: string;
    website?: string;
    address?: string;
  };
  imageUrl?: string;
  imageHint?: string;
};

const resourcesData: Resource[] = [
  {
    id: "1",
    name: "GreenGrow Seeds Co.",
    category: "Seeds",
    description: "Provider of high-yield, disease-resistant crop seeds. Specialized in local varieties.",
    contact: { phone: "555-0101", website: "https://greengrowseeds.example.com", address: "123 Seed Rd, Farmville" },
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "seeds packets",
  },
  {
    id: "2",
    name: "AgriTech Equipment Rentals",
    category: "Equipment",
    description: "Rent modern farming equipment, from tractors to drones. Flexible rental periods.",
    contact: { phone: "555-0102", address: "456 Tractor Ln, Machinery City" },
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "tractor farm",
  },
  {
    id: "3",
    name: "Fertile Fields Nutrition",
    category: "Fertilizers",
    description: "Organic and synthetic fertilizers tailored to soil types and crop needs.",
    contact: { phone: "555-0103", website: "https://fertilefields.example.com" },
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "fertilizer bags",
  },
  {
    id: "4",
    name: "CropSafe Consultants",
    category: "Consultancy",
    description: "Expert advice on pest management, crop rotation, and sustainable farming practices.",
    contact: { phone: "555-0104", website: "https://cropsafe.example.com", address: "789 Advice Ave, Expert Town" },
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "agronomist field",
  },
   {
    id: "5",
    name: "FarmConnect Logistics",
    category: "Logistics",
    description: "Reliable transportation and storage solutions for agricultural produce. Cold chain specialists.",
    contact: { phone: "555-0105", website: "https://farmconnect.example.com", address: "101 Haulage Way, Transport Hub" },
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "truck farm",
  },
];

const categories = ["All", ...new Set(resourcesData.map(r => r.category))];

export function ResourceDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredResources = resourcesData.filter(resource => {
    return (
      (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       resource.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "All" || resource.category === selectedCategory)
    );
  });

  return (
    <div className="space-y-8">
       <Card className="shadow-xl">
        <CardHeader>
            <CardTitle className="text-2xl font-bold">Agricultural Resource Directory</CardTitle>
            <CardDescription>Find local suppliers, services, and other agricultural resources.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                    {categories.map(category => (
                        <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" /> 
                                {category}
                            </div>
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>


      {filteredResources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              {resource.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image src={resource.imageUrl} alt={resource.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={resource.imageHint || resource.category.toLowerCase()} />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{resource.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{resource.category}</Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                {resource.contact.address && (
                  <div className="flex items-start gap-2 text-sm mb-1">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{resource.contact.address}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
                 {resource.contact.phone && (
                    <Button variant="outline" size="sm" asChild className="w-full justify-start">
                        <a href={`tel:${resource.contact.phone}`}>
                            <Phone className="h-4 w-4 mr-2" /> Call {resource.contact.phone}
                        </a>
                    </Button>
                )}
                {resource.contact.website && (
                    <Button variant="outline" size="sm" asChild className="w-full justify-start">
                        <Link href={resource.contact.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" /> Visit Website
                        </Link>
                    </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Resources Found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
