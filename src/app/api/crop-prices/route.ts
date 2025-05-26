
import { NextResponse, type NextRequest } from 'next/server';

// Type definition for a single crop price - matches the frontend component
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

// The same mock data previously in CropPriceTable.tsx
// In a real scenario, this data would be fetched from an external API.
const cropPricesData: CropPrice[] = [
  { id: "1", name: "Wheat", category: "Grains", price: 250, change24h: 2.5, market: "National", lastUpdated: "2h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "wheat icon" },
  { id: "2", name: "Corn (Maize)", category: "Grains", price: 180, change24h: -1.2, market: "Local", lastUpdated: "1h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "corn icon" },
  { id: "3", name: "Soybeans", category: "Oilseeds", price: 550, change24h: 0.8, market: "International", lastUpdated: "30m ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "soybean icon" },
  { id: "4", name: "Rice", category: "Grains", price: 320, change24h: 1.0, market: "National", lastUpdated: "5h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "rice icon" },
  { id: "5", name: "Tomatoes", category: "Vegetables", price: 80, change24h: 5.2, market: "Local", lastUpdated: "45m ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "tomato icon" },
  { id: "6", name: "Potatoes", category: "Vegetables", price: 60, change24h: -0.5, market: "Local", lastUpdated: "3h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "potato icon" },
  { id: "7", name: "Cotton", category: "Fibers", price: 700, change24h: 0.0, market: "International", lastUpdated: "1d ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "cotton icon" },
  { id: "8", name: "Apples", category: "Fruits", price: 120, change24h: 3.1, market: "Local", lastUpdated: "4h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "apple fruit" },
  { id: "9", name: "Coffee Beans (Arabica)", category: "Beverages", price: 2200, change24h: -2.0, market: "International", lastUpdated: "6h ago", iconUrl: "https://placehold.co/40x40.png", imageHint: "coffee beans" },
  { id: "10", name: "Sugar", category: "Sweeteners", price: 400, change24h: 0.5, market: "National", lastUpdated: "Just now", iconUrl: "https://placehold.co/40x40.png", imageHint: "sugar cubes" },
];


export async function GET(request: NextRequest) {
  // In a real application, you would fetch data from an external API here.
  // You might use an API key from process.env.CROP_PRICE_API_KEY
  // For example:
  // const apiKey = process.env.CROP_PRICE_API_KEY;
  // if (!apiKey) {
  //   return NextResponse.json({ error: 'Crop price API key not configured' }, { status: 500 });
  // }
  // const externalApiResponse = await fetch(`https://api.examplecropdata.com/prices?key=${apiKey}`);
  // if (!externalApiResponse.ok) {
  //   return NextResponse.json({ error: 'Failed to fetch crop prices from external source' }, { status: externalApiResponse.status });
  // }
  // const data = await externalApiResponse.json();
  // For now, we return the mock data.
  
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(cropPricesData);
}
