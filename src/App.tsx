// src/App.tsx

import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  HeartPulse,
  Menu,
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Moon,
  Sun,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./App.css";

// API Ayarları
const API_URL = "http://127.0.0.1:8000/api";
const PSYCHOLOGIST_ID = 1;

// Tema Tipi Tanımı
type Theme = "dark" | "light" | "system";

// --- Bileşenler ---

const ModeToggle = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    return storedTheme || "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    let effectiveTheme = theme;
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    root.classList.add(effectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Açık
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Koyu
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistem
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { href: "#", label: "Hakkımızda" },
    { href: "#", label: "İletişim" },
  ];

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              <HeartPulse className="text-primary" />
              <span>Psikolog</span>
            </Link>
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
              <ModeToggle />
              <Button asChild className="hidden sm:inline-flex">
                <Link to="/randevu">Randevu Al</Link>
              </Button>
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
      </header>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60 animate-in fade-in-0"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-background border-l shadow-2xl p-6 animate-in slide-in-from-right-80"
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
            <nav className="flex flex-col gap-4 mt-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-foreground p-2 rounded-md hover:bg-accent"
              >
                Ana Sayfa
              </Link>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-foreground p-2 rounded-md hover:bg-accent"
                >
                  {link.label}
                </a>
              ))}
              <Button asChild className="w-full mt-4">
                <Link to="/randevu" onClick={() => setIsMenuOpen(false)}>
                  Randevu Al
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => (
  <footer className="border-t">
    <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} Psikolog Randevu Sistemi. Tüm hakları
      saklıdır.
    </div>
  </footer>
);

// --- SAYFALAR ---

const HomePage = () => {
  return (
    <main className="flex-grow">
      <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=3448&auto-format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="relative z-10 p-4 animate-in fade-in slide-in-from-bottom-12 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance text-foreground">
            Daha İyi Bir Sen İçin İlk Adımı At
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground text-balance">
            Profesyonel ve güvenilir psikolog desteğiyle zihinsel sağlığınızı
            güçlendirin.
          </p>
          <Button asChild size="lg" className="mt-8 text-lg">
            <Link to="/randevu">Hemen Randevu Al</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

const AppointmentPage = () => {
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
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: string[]) => {
        setAvailableSlots(data);
        if (data.length === 0) {
          toast.info("Müsait Zaman Yok", {
            description:
              "Seçtiğiniz tarih için müsait randevu bulunmamaktadır.",
          });
        }
      })
      .catch(() =>
        toast.error("İstek Başarısız!", {
          description: "Müsait saatler getirilirken bir sorun oluştu.",
        }),
      )
      .finally(() => setIsLoading(false));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    setIsLoading(true);
    const bookingData = {
      ...formData,
      // DÜZELTME: 'date' yerine 'selectedDate' kullanıldı.
      date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
      time: selectedSlot,
    };

    fetch(`${API_URL}/public/appointments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => {
        toast.success("Başarılı!", {
          description: "Randevunuz başarıyla oluşturulmuştur.",
        });
        setSelectedDate(undefined);
        setSelectedSlot(null);
        setAvailableSlots([]);
        setFormData({ user_name: "", user_surname: "", phone: "" });
      })
      .catch(() =>
        toast.error("Hata!", {
          description: "Randevu oluşturulamadı. Lütfen tekrar deneyin.",
        }),
      )
      .finally(() => setIsLoading(false));
  };

  return (
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
            className="rounded-md border mx-auto sm:mx-0"
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
                <CardDescription>{`Seçilen tarih: ${selectedDate?.toLocaleDateString("tr-TR")} - ${selectedSlot}`}</CardDescription>
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
                        setFormData({ ...formData, user_name: e.target.value })
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "İşleniyor..." : "Randevuyu Onayla"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
};

// --- ANA YAPI VE YÖNLENDİRME ---

const Layout = () => {
  const location = useLocation();
  const showFooter = location.pathname !== "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Outlet />
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/randevu" element={<AppointmentPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
