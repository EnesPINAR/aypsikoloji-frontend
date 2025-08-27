import { Mail, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IletisimPage() {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            İletişim
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Bize ulaşın.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12">
          <div className="flex-shrink-0">
            <img
              src="https://placehold.co/160x160/E2E8F0/475569?text=Foto"
              alt="Psikolog Adı Soyadı"
              className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-muted"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-foreground">
              Dr. Elif Yılmaz
            </h2>
            <p className="text-primary font-medium mt-1">Klinik Psikolog</p>
            <div className="mt-6 flex flex-col items-center sm:items-start gap-4">
              <a
                href="mailto:elif.yilmaz@ornek.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>elif.yilmaz@ornek.com</span>
              </a>
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="icon">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
