
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, Tractor, MapPin, DollarSign, Calendar as CalendarIcon, CheckCircle2, 
  Loader2, Sparkles, ArrowLeft, XCircle, Info 
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

type Equipment = {
  id: string;
  name: string;
  type: "Tractor" | "Harvester" | "Drone" | "Tiller" | "Seeder";
  location: string;
  distance: string;
  hourlyRate: number;
  status: "Available" | "Booked";
  imageUrl?: string;
  imageHint?: string;
  description: string;
};

const mockEquipmentData: Equipment[] = [
  {
    id: "1",
    name: "John Deere 5050D",
    type: "Tractor",
    location: "Farmville",
    distance: "5 km away",
    hourlyRate: 50,
    status: "Available",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "green tractor field",
    description: "A reliable 50 HP tractor suitable for various farming tasks. Comes with a standard plow attachment."
  },
  {
    id: "2",
    name: "Claas Dominator 150",
    type: "Harvester",
    location: "Grainsville",
    distance: "12 km away",
    hourlyRate: 150,
    status: "Booked",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "combine harvester wheat",
    description: "High-capacity combine harvester for wheat, corn, and soybeans. Efficient and fast."
  },
  {
    id: "3",
    name: "DJI Agras T30",
    type: "Drone",
    location: "Aero Meadows",
    distance: "8 km away",
    hourlyRate: 75,
    status: "Available",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "agricultural drone spraying",
    description: "Advanced agricultural drone for spraying pesticides, fertilizers, and for crop monitoring."
  },
  {
    id: "4",
    name: "Rotary Power Tiller",
    type: "Tiller",
    location: "Farmville",
    distance: "3 km away",
    hourlyRate: 30,
    status: "Available",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "rotary tiller soil",
    description: "Heavy-duty rotary tiller for preparing seedbeds. Easy to operate and maintain."
  },
  {
    id: "5",
    name: "Precision Air Seeder",
    type: "Seeder",
    location: "Seedtown",
    distance: "20 km away",
    hourlyRate: 90,
    status: "Available",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "precision seeder tractor",
    description: "Multi-row air seeder for precise and uniform seed placement, improving crop yield."
  },
  {
    id: "6",
    name: "Massey Ferguson 241",
    type: "Tractor",
    location: "Green Valley",
    distance: "15 km away",
    hourlyRate: 45,
    status: "Booked",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "red tractor farm",
    description: "A classic and versatile tractor, perfect for small to medium-sized farms."
  }
];

const equipmentTypes = ["All", ...new Set(mockEquipmentData.map(e => e.type))];

type BookingStep = 'idle' | 'confirming' | 'requesting' | 'confirmed';

export function EquipmentRental() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const [step, setStep] = useState<BookingStep>('idle');
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [otp, setOtp] = useState<string>("");

  useEffect(() => {
    // Reset if filters change during a booking process
    if (step !== 'idle') {
      setStep('idle');
      setSelectedItem(null);
    }
  }, [searchTerm, selectedType, bookingDate]);


  const filteredEquipment = mockEquipmentData.filter(equipment => {
    return (
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "All" || equipment.type === selectedType)
    );
  });

  const handleBookNowClick = (equipment: Equipment) => {
    if (equipment.status === 'Booked') {
      toast({
        variant: "destructive",
        title: "Already Booked",
        description: `${equipment.name} is not available for the selected date.`,
      });
      return;
    }
    setSelectedItem(equipment);
    setStep('confirming');
  };

  const handleConfirmBooking = () => {
    setStep('requesting');
    setTimeout(() => {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setOtp(newOtp);
      setStep('confirmed');
    }, 3000); // Simulate a 3-second network request
  };
  
  const handleResetFlow = () => {
    setStep('idle');
    setSelectedItem(null);
    setOtp('');
  };
  
  const renderIdleState = () => (
    <>
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Tractor className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Equipment Rental</CardTitle>
              <CardDescription>Find and book nearby agricultural equipment for rent.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by equipment name..."
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
                {equipmentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center gap-4">
              <Label htmlFor="booking-date" className="text-sm font-medium">Booking Date:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="booking-date"
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      !bookingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
           </div>
        </CardContent>
      </Card>

      {filteredEquipment.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map(item => (
            <Card key={item.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl || ""}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  data-ai-hint={item.imageHint || item.name.toLowerCase()}
                />
                <Badge className={cn("absolute top-2 right-2", item.status === "Available" ? "bg-green-500" : "bg-destructive")}>
                  {item.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{item.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="w-fit">{item.type}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{item.location} ({item.distance})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-lg">${item.hourlyRate} / hour</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleBookNowClick(item)}
                  disabled={item.status === 'Booked'}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Book Now for {format(bookingDate || new Date(), "MMM d")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Equipment Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      )}
    </>
  );

  if (step === 'requesting') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <Card className="w-full max-w-md p-8 text-center animate-in fade-in-50 zoom-in-95">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
          <CardTitle className="text-2xl font-bold mb-2">Sending Request</CardTitle>
          <CardDescription>Contacting the equipment owner... Please wait.</CardDescription>
        </Card>
      </div>
    );
  }
  
  if (step === 'confirmed' && selectedItem) {
    return (
       <div className="flex flex-col items-center justify-center h-full py-10">
        <Card className="w-full max-w-lg p-6 text-center animate-in fade-in-50 zoom-in-95">
          <CardHeader className="pb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl sm:text-3xl font-bold">Booking Confirmed!</CardTitle>
            <CardDescription>Your request for the {selectedItem.name} has been accepted.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Your One-Time Password (OTP) is:</p>
              <p className="text-4xl font-bold tracking-widest text-primary py-2">{otp}</p>
              <p className="text-xs text-muted-foreground">Share this OTP with the equipment owner to start your rental.</p>
            </div>
            <div className="text-left text-sm border-t pt-4">
              <h4 className="font-semibold mb-2">Booking Details:</h4>
              <p><strong className="text-muted-foreground">Equipment:</strong> {selectedItem.name}</p>
              <p><strong className="text-muted-foreground">Date:</strong> {format(bookingDate || new Date(), "PPP")}</p>
              <p><strong className="text-muted-foreground">Location:</strong> {selectedItem.location}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleResetFlow}>
              <Sparkles className="mr-2 h-4 w-4" /> Done
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {renderIdleState()}

      <Dialog open={step === 'confirming'} onOpenChange={(isOpen) => !isOpen && handleResetFlow()}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl">Confirm Your Booking</DialogTitle>
                <DialogDescription>
                  Review the details below and confirm your request for the {selectedItem.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                 <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={selectedItem.imageUrl || ""}
                      alt={selectedItem.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={selectedItem.imageHint || selectedItem.name.toLowerCase()}
                    />
                  </div>
                  <div className="text-sm">
                    <p><strong className="text-muted-foreground">Equipment:</strong> {selectedItem.name}</p>
                    <p><strong className="text-muted-foreground">For Date:</strong> {format(bookingDate || new Date(), "PPP")}</p>
                    <p><strong className="text-muted-foreground">Price:</strong> ${selectedItem.hourlyRate} / hour</p>
                  </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleConfirmBooking}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Request
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
