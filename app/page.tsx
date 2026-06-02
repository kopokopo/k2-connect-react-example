import { Header } from "@/components/layout/Header";
import { ComicGrid } from "@/components/store/ComicGrid";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="dot-grid relative">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="font-bangers text-6xl tracking-widest">Komiks KE</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-xl">
            Kenya&apos;s home for African comic books. Browse our collection and pay
            instantly with M-Pesa — powered by K2 Connect.
          </p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ComicGrid />
      </main>
    </>
  );
}
