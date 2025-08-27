export function HakkimizdaPage() {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Hakkımızda
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Uzmanımızla tanışın.
          </p>
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
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
