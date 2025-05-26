
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Sprout, Leaf, Flower, Info } from "lucide-react";
import Image from "next/image";

type CropNutrientInfo = {
  id: string;
  name: string;
  type: "Crop" | "Vegetable" | "Herb";
  imageUrl?: string;
  imageHint?: string;
  primaryNutrients: string[];
  secondaryNutrients: string[];
  microNutrients: string[];
  optimalPH: string;
  notes?: string;
};

const mockCropData: CropNutrientInfo[] = [
  {
    id: "1",
    name: "Tomato",
    type: "Vegetable",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "tomato plant",
    primaryNutrients: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"],
    secondaryNutrients: ["Calcium (Ca)", "Magnesium (Mg)"],
    microNutrients: ["Boron (B)", "Manganese (Mn)", "Zinc (Zn)"],
    optimalPH: "6.0 - 6.8",
    notes: "Requires consistent watering and well-drained soil. Benefits from staking or caging."
  },
  {
    id: "2",
    name: "Wheat",
    type: "Crop",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "wheat field",
    primaryNutrients: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"],
    secondaryNutrients: ["Sulfur (S)"],
    microNutrients: ["Copper (Cu)", "Zinc (Zn)", "Manganese (Mn)"],
    optimalPH: "6.0 - 7.0",
    notes: "Nitrogen is crucial during early growth stages. Monitor for rust diseases."
  },
  {
    id: "3",
    name: "Basil",
    type: "Herb",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "basil leaves",
    primaryNutrients: ["Nitrogen (N)", "Potassium (K)"],
    secondaryNutrients: ["Magnesium (Mg)"],
    microNutrients: ["Iron (Fe)"],
    optimalPH: "6.0 - 7.5",
    notes: "Prefers full sun and regular harvesting of leaves encourages more growth."
  },
  {
    id: "4",
    name: "Corn (Maize)",
    type: "Crop",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "corn field",
    primaryNutrients: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"],
    secondaryNutrients: ["Magnesium (Mg)", "Sulfur (S)"],
    microNutrients: ["Zinc (Zn)", "Boron (B)"],
    optimalPH: "5.8 - 6.5",
    notes: "Heavy feeder, especially nitrogen. Ensure adequate pollination for full ears."
  },
  {
    id: "5",
    name: "Lettuce",
    type: "Vegetable",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "lettuce head",
    primaryNutrients: ["Nitrogen (N)", "Potassium (K)"],
    secondaryNutrients: ["Calcium (Ca)"],
    microNutrients: ["Molybdenum (Mo)"],
    optimalPH: "6.0 - 7.0",
    notes: "Cool-weather crop. Shallow roots require consistent moisture."
  },
  {
    id: "6",
    name: "Rosemary",
    type: "Herb",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "rosemary sprig",
    primaryNutrients: ["Low N", "Phosphorus (P)", "Potassium (K)"],
    secondaryNutrients: [],
    microNutrients: [],
    optimalPH: "6.0 - 7.0",
    notes: "Drought-tolerant once established. Prefers well-drained, slightly alkaline soil."
  },
  {
    id: "7",
    name: "Potato",
    type: "Vegetable",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "potatoes plant",
    primaryNutrients: ["Potassium (K)", "Nitrogen (N)", "Phosphorus (P)"],
    secondaryNutrients: ["Magnesium (Mg)", "Calcium (Ca)"],
    microNutrients: ["Boron (B)", "Manganese (Mn)"],
    optimalPH: "4.8 - 6.5",
    notes: "Prefers acidic soil. Hill soil around plants as they grow to protect tubers."
  },
  {
    id: "8",
    name: "Soybean",
    type: "Crop",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "soybean plant",
    primaryNutrients: ["Phosphorus (P)", "Potassium (K)"], // Nitrogen-fixing
    secondaryNutrients: ["Calcium (Ca)", "Magnesium (Mg)", "Sulfur (S)"],
    microNutrients: ["Manganese (Mn)", "Molybdenum (Mo)", "Boron (B)"],
    optimalPH: "6.0 - 6.8",
    notes: "Nitrogen-fixing legume. Ensure proper inoculation with Bradyrhizobium japonicum."
  },
   {
    id: "9",
    name: "Mint",
    type: "Herb",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "mint leaves",
    primaryNutrients: ["Nitrogen (N)"],
    secondaryNutrients: [],
    microNutrients: [],
    optimalPH: "6.5 - 7.0",
    notes: "Can be invasive; best grown in containers or with root barriers. Prefers moist soil."
  },
  {
    id: "10",
    name: "Carrot",
    type: "Vegetable",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "carrots plant",
    primaryNutrients: ["Potassium (K)", "Phosphorus (P)"],
    secondaryNutrients: [],
    microNutrients: ["Boron (B)"],
    optimalPH: "6.0 - 6.8",
    notes: "Requires loose, deep soil free of stones for good root development."
  }
];

const cropTypes = ["All", ...new Set(mockCropData.map(c => c.type))];

const TypeIcon = ({ type }: { type: CropNutrientInfo["type"] }) => {
  if (type === "Crop") return <Leaf className="h-4 w-4 text-green-600" />;
  if (type === "Vegetable") return <Flower className="h-4 w-4 text-orange-500" />;
  if (type === "Herb") return <Sprout className="h-4 w-4 text-teal-500" />;
  return null;
};

export function CropNutrientGuide() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredCrops = mockCropData.filter(crop => {
    return (
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "All" || crop.type === selectedType)
    );
  });

  const renderNutrientList = (title: string, nutrients: string[]) => {
    if (nutrients.length === 0) return null;
    return (
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-1">{title}</h4>
        <div className="flex flex-wrap gap-1">
          {nutrients.map(nutrient => (
            <Badge key={nutrient} variant="secondary" className="text-xs">{nutrient}</Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl font-bold">Crop Nutrient Guide</CardTitle>
                <CardDescription>Explore nutrient needs for various crops, vegetables, and herbs. (Illustrative Data)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by crop name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      {type !== "All" && <TypeIcon type={type as CropNutrientInfo["type"]} />}
                      {type}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredCrops.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map(crop => (
            <Card key={crop.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              {crop.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image 
                    src={crop.imageUrl} 
                    alt={crop.name} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-t-lg" 
                    data-ai-hint={crop.imageHint || crop.name.toLowerCase()}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{crop.name}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <TypeIcon type={crop.type} />
                        {crop.type}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                {renderNutrientList("Primary Nutrients", crop.primaryNutrients)}
                {renderNutrientList("Secondary Nutrients", crop.secondaryNutrients)}
                {renderNutrientList("Micronutrients", crop.microNutrients)}
                {crop.optimalPH && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Optimal pH</h4>
                    <p className="text-sm">{crop.optimalPH}</p>
                  </div>
                )}
              </CardContent>
              {crop.notes && (
                <CardFooter className="border-t pt-4">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    <span>{crop.notes}</span>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Crops Found</h3>
            <p className="text-muted-foreground">Try adjusting your search term or filter.</p>
          </CardContent>
        </Card>
      )}
      <CardFooter className="mt-8 justify-center">
        <p className="text-xs text-muted-foreground">
          Disclaimer: The nutrient information provided is illustrative and for general guidance only. Always refer to specific soil tests and local agricultural expertise for precise recommendations.
        </p>
      </CardFooter>
    </div>
  );
}
