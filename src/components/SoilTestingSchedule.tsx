
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
  Search, FlaskConical, MapPin, DollarSign, Calendar as CalendarIcon, CheckCircle2, 
  Loader2, Sparkles, XCircle, ClipboardCheck
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

type SoilTestingLab = {
  id: string;
  name: string;
  type: "On-Site Sampling" | "Lab Analysis";
  location: string;
  distance: string;
  price: number;
  status: "Available" | "Booked";
  imageUrl?: string;
  imageHint?: string;
  description: string;
};

const mockLabData: SoilTestingLab[] = [
  {
    id: "1",
    name: "Green Horizon Labs",
    type: "On-Site Sampling",
    location: "Central Valley",
    distance: "10 km away",
    price: 99,
    status: "Available",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "soil testing lab",
    description: "Comprehensive on-site soil sample collection and basic analysis. Full report within 48 hours."
  },
  {
    id: "2",
    name: "Agri-Analytics Inc.",
    type: "Lab Analysis",
    location: "Tech Park",
    distance: "25 km away",
    price: 150,
    status: "Available",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "scientist laboratory",
    description: "Mail-in service for in-depth NPK, pH, and micronutrient testing. Detailed digital report."
  },
  {
    id: "3",
    name: "Farm-Forward Testing",
    type: "On-Site Sampling",
    location: "West Fields",
    distance: "5 km away",
    price: 120,
    status: "Booked",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "technician collecting soil sample",
    description: "Expert technicians collect samples from multiple points on your farm for a complete picture."
  },
  {
    id: "4",
    name: "Soil-Sense Labs",
    type: "Lab Analysis",
    location: "Innovation Hub",
    distance: "30 km away",
    price: 200,
    status: "Available",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "microscope soil sample",
    description: "Advanced analysis including soil composition, organic matter, and custom recommendations."
  }
];

const labTypes = ["All", ...new Set(mockLabData.map(e => e.type))];

type BookingStep = 'idle' | 'confirming' | 'requesting' | 'confirmed';

export function SoilTestingSchedule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const [step, setStep] = useState<BookingStep>('idle');
  const [selectedLab, setSelectedLab] = useState<SoilTestingLab | null>(null);
  const [otp, setOtp] = useState<string>("");

  useEffect(() => {
    if (step !== 'idle') {
      setStep('idle');
      setSelectedLab(null);
    }
  }, [searchTerm, selectedType, bookingDate]);

  const filteredLabs = mockLabData.filter(lab => {
    return (
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "All" || lab.type === selectedType)
    );
  });

  const handleBookNowClick = (lab: SoilTestingLab) => {
    if (lab.status === 'Booked') {
      toast({
        variant: "destructive",
        title: "Fully Booked",
        description: `${lab.name} is not available for the selected date.`,
      });
      return;
    }
    setSelectedLab(lab);
    setStep('confirming');
  };

  const handleConfirmBooking = () => {
    setStep('requesting');
    setTimeout(() => {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setOtp(newOtp);
      setStep('confirmed');
    }, 3000); 
  };
  
  const handleResetFlow = () => {
    setStep('idle');
    setSelectedLab(null);
    setOtp('');
  };
  
  const renderIdleState = () => (
    <>
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Book Soil Testing</CardTitle>
              <CardDescription>Schedule a soil sample collection or analysis with a trusted lab.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by lab name..."
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
                {labTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center gap-4">
              <Label htmlFor="booking-date" className="text-sm font-medium">Appointment Date:</Label>
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

      {filteredLabs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map(lab => (
            <Card key={lab.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={lab.imageUrl || ""}
                  alt={lab.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  data-ai-hint={lab.imageHint || lab.name.toLowerCase()}
                />
                <Badge className={cn("absolute top-2 right-2", lab.status === "Available" ? "bg-green-500" : "bg-destructive")}>
                  {lab.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{lab.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="w-fit">{lab.type}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="text-sm text-muted-foreground">{lab.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{lab.location} ({lab.distance})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-lg">${lab.price} / sample</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleBookNowClick(lab)}
                  disabled={lab.status === 'Booked'}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Book for {format(bookingDate || new Date(), "MMM d")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Labs Found</h3>
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
          <CardDescription>Confirming availability with the lab... Please wait.</CardDescription>
        </Card>
      </div>
    );
  }
  
  if (step === 'confirmed' && selectedLab) {
    return (
       <div className="flex flex-col items-center justify-center h-full py-10">
        <Card className="w-full max-w-lg p-6 text-center animate-in fade-in-50 zoom-in-95">
          <CardHeader className="pb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl sm:text-3xl font-bold">Appointment Confirmed!</CardTitle>
            <CardDescription>Your request for soil testing with {selectedLab.name} has been accepted.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Your One-Time Password (OTP) is:</p>
              <p className="text-4xl font-bold tracking-widest text-primary py-2">{otp}</p>
              <p className="text-xs text-muted-foreground">Share this OTP with the lab technician to confirm your appointment.</p>
            </div>
            <div className="text-left text-sm border-t pt-4">
              <h4 className="font-semibold mb-2">Appointment Details:</h4>
              <p><strong className="text-muted-foreground">Lab:</strong> {selectedLab.name}</p>
              <p><strong className="text-muted-foreground">Date:</strong> {format(bookingDate || new Date(), "PPP")}</p>
              <p><strong className="text-muted-foreground">Service:</strong> {selectedLab.type}</p>
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
          {selectedLab && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl">Confirm Your Appointment</DialogTitle>
                <DialogDescription>
                  Review the details below and confirm your request with {selectedLab.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                 <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={selectedLab.imageUrl || ""}
                      alt={selectedLab.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={selectedLab.imageHint || selectedLab.name.toLowerCase()}
                    />
                  </div>
                  <div className="text-sm">
                    <p><strong className="text-muted-foreground">Lab:</strong> {selectedLab.name}</p>
                    <p><strong className="text-muted-foreground">For Date:</strong> {format(bookingDate || new Date(), "PPP")}</p>
                    <p><strong className="text-muted-foreground">Price:</strong> ${selectedLab.price} / sample</p>
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
