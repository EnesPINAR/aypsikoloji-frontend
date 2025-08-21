import { useState } from "react";
import "./App.css";
import {
  HeartPulse,
  Menu,
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
} from "lucide-react";

// shadcn/ui bileşenlerini import ediyoruz
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// API Ayarları
const API_URL = "http://127.0.0.1:8000/api";
const PSYCHOLOGIST_ID = 1;

// --- Bileşenler ---

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { href: "#", label: "Ana Sayfa" },
    { href: "#", label: "Hakkımızda" },
    { href: "#", label: "İletişim" },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            className="flex items-center gap-2 text-xl font-bold text-foreground"
          >
            <HeartPulse className="text-primary" />
            <span>Psikolog</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button className="hidden sm:inline-flex">Randevu Al</Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobil Menü */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-background p-6 animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-foreground p-2 rounded-md hover:bg-accent"
                >
                  {link.label}
                </a>
              ))}
              <Button className="w-full mt-4">Randevu Al</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="border-t mt-16">
    <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} Psikolog Randevu Sistemi. Tüm hakları
      saklıdır.
    </div>
  </footer>
);

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_surname: "",
    phone: "",
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    setAvailableSlots([]);
    setSelectedSlot(null);
    setIsLoading(true);

    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const requestUrl = `${API_URL}/public/available-slots/?date=${formattedDate}&psychologist_id=${PSYCHOLOGIST_ID}`;

    fetch(requestUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Sunucu hatası: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: string[]) => {
        setAvailableSlots(data);
        if (data.length === 0) {
          toast.info("Müsait Zaman Yok", {
            description:
              "Seçtiğiniz tarih için müsait randevu bulunmamaktadır.",
          });
        }
      })
      .catch((err) => {
        console.error("HATA OLUŞTU:", err);
        toast.error("İstek Başarısız!", {
          description:
            "Müsait saatler getirilirken bir sorun oluştu. Lütfen Django sunucunuzu ve CORS ayarlarınızı kontrol edin.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    setIsLoading(true);
    const bookingData = {
      ...formData,
      date: `${selectedDate.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      time: selectedSlot,
    };

    fetch(`${API_URL}/public/appointments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Randevu oluşturulamadı.");
        return res.json();
      })
      .then(() => {
        toast.success("Başarılı!", {
          description: "Randevunuz başarıyla oluşturulmuştur.",
        });
        setSelectedDate(undefined);
        setSelectedSlot(null);
        setAvailableSlots([]);
        setFormData({ user_name: "", user_surname: "", phone: "" });
      })
      .catch((err) => {
        toast.error("Hata!", {
          description: "Randevu oluşturulamadı. Lütfen tekrar deneyin.",
        });
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-4">
                <CalendarIcon size={24} /> 1. Adım: Tarih Seçin
              </h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date(new Date().setDate(new Date().getDate() - 1))
                }
                className="rounded-md border mx-auto"
              />
            </section>

            {isLoading && (
              <div className="text-center text-muted-foreground animate-pulse">
                Müsait saatler yükleniyor...
              </div>
            )}

            {availableSlots.length > 0 && !isLoading && (
              <section>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-4">
                  <Clock size={24} /> 2. Adım: Saat Seçin
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </section>
            )}

            {selectedSlot && (
              <section>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-4">
                  <User size={24} /> 3. Adım: Bilgilerinizi Girin
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Randevu Detayları</CardTitle>
                    <CardDescription>
                      {`Seçilen tarih: ${selectedDate?.toLocaleDateString("tr-TR")} - ${selectedSlot}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user_name">Adınız</Label>
                        <Input
                          id="user_name"
                          type="text"
                          required
                          value={formData.user_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              user_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user_surname">Soyadınız</Label>
                        <Input
                          id="user_surname"
                          type="text"
                          required
                          value={formData.user_surname}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              user_surname: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "İşleniyor..." : "Randevuyu Onayla"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
