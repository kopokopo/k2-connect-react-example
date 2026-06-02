import { comics } from "@/lib/comics";
import { ComicCard } from "./ComicCard";

export function ComicGrid() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Our Collection</h2>
        <p className="text-muted-foreground">
          Authentic African comics — pay securely with M-Pesa.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {comics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
    </section>
  );
}
