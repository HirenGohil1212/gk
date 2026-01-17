
"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowDown, ArrowUp, Minus, Search, Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

type CropPrice = {
  id: string;
  name: string;
  iconUrl?: string; 
  category: string;
  price: number;
  change24h: number; 
  market: "Local" | "National" | "International";
  lastUpdated: string;
  imageHint?: string;
};

export function CropPriceTable() {
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMarket, setSelectedMarket] = useState("All");

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [markets, setMarkets] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchCropPrices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/crop-prices");
        if (!response.ok) {
          throw new Error(`Failed to fetch crop prices: ${response.statusText}`);
        }
        const data: CropPrice[] = await response.json();
        setCropPrices(data);

        // Dynamically populate filters
        const uniqueCategories = ["All", ...new Set(data.map(crop => crop.category))];
        const uniqueMarkets = ["All", ...new Set(data.map(crop => crop.market))];
        setCategories(uniqueCategories);
        setMarkets(uniqueMarkets);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        console.error("Error fetching crop prices:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCropPrices();
  }, []);

  const filteredCrops = cropPrices.filter(crop => {
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

  const renderTableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell><Skeleton className="h-8 w-8 rounded-sm" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  );


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold">Crop Market Prices</CardTitle>
        <CardDescription>Browse current market data for various crops. (Data is currently illustrative)</CardDescription>
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
              disabled={isLoading || !!error}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading || !!error || categories.length <=1}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMarket} onValueChange={setSelectedMarket} disabled={isLoading || !!error || markets.length <=1}>
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

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Data</AlertTitle>
            <AlertDescription>{error} Please try refreshing the page.</AlertDescription>
          </Alert>
        )}

        <Table>
          <TableCaption>Market prices are indicative. For real-time data, API integration is required.</TableCaption>
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
            {isLoading ? renderTableSkeleton() :
             filteredCrops.length > 0 ? filteredCrops.map((crop) => (
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
                  {cropPrices.length === 0 && !error ? 'No crop data available.' : 'No crops match your filters.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
