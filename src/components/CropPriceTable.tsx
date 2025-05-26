"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, Minus, Search } from "lucide-react";
import Image from "next/image";

type CropPrice = {
  id: string;
  name: string;
  iconUrl?: string; // URL to an icon image
  category: string;
  price: number;
  change24h: number; // percentage
  market: "Local" | "National" | "International";
  lastUpdated: string;
  imageHint?: string;
};

// Mock data
const cropPricesData: CropPrice[] = [
  { id: "1", name: "Wheat", category: "Grains", price: 250, change24h: 2.5, market: "National", lastUpdated: "2h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "wheat icon" },
  { id: "2", name: "Corn (Maize)", category: "Grains", price: 180, change24h: -1.2, market: "Local", lastUpdated: "1h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "corn icon" },
  { id: "3", name: "Soybeans", category: "Oilseeds", price: 550, change24h: 0.8, market: "International", lastUpdated: "30m ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "soybean icon" },
  { id: "4", name: "Rice", category: "Grains", price: 320, change24h: 1.0, market: "National", lastUpdated: "5h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "rice icon" },
  { id: "5", name: "Tomatoes", category: "Vegetables", price: 80, change24h: 5.2, market: "Local", lastUpdated: "45m ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "tomato icon" },
  { id: "6", name: "Potatoes", category: "Vegetables", price: 60, change24h: -0.5, market: "Local", lastUpdated: "3h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "potato icon" },
  { id: "7", name: "Cotton", category: "Fibers", price: 700, change24h: 0.0, market: "International", lastUpdated: "1d ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "cotton icon" },
];

const categories = ["All", ...new Set(cropPricesData.map(crop => crop.category))];
const markets = ["All", ...new Set(cropPricesData.map(crop => crop.market))];


export function CropPriceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMarket, setSelectedMarket] = useState("All");

  const filteredCrops = cropPricesData.filter(crop => {
    return (
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || crop.category === selectedCategory) &&
      (selectedMarket === "All" || crop.market === selectedMarket)
    );
  });

  const PriceChangeIndicator = ({ change }: { change: number }) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crop Market Prices</CardTitle>
        <CardDescription>Browse current market data for various crops.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search crops..."
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
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by market" />
            </SelectTrigger>
            <SelectContent>
              {markets.map(market => (
                <SelectItem key={market} value={market}>{market}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableCaption>Market prices are indicative and subject to change.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Icon</TableHead>
              <TableHead>Crop Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price ($/unit)</TableHead>
              <TableHead className="text-right">Change (24h)</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCrops.length > 0 ? filteredCrops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>
                  {crop.iconUrl && (
                    <Image src={crop.iconUrl} alt={crop.name} width={32} height={32} className="rounded-sm" data-ai-hint={crop.imageHint || crop.name.toLowerCase()} />
                  )}
                </TableCell>
                <TableCell className="font-medium">{crop.name}</TableCell>
                <TableCell>{crop.category}</TableCell>
                <TableCell className="text-right">${crop.price.toFixed(2)}</TableCell>
                <TableCell className={`text-right flex items-center justify-end gap-1 ${crop.change24h > 0 ? 'text-green-600' : crop.change24h < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  <PriceChangeIndicator change={crop.change24h} />
                  {crop.change24h.toFixed(1)}%
                </TableCell>
                <TableCell>{crop.market}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{crop.lastUpdated}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No crops match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
