import Image from "next/image";
import { Comic } from "@/lib/comics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "./BuyDialog";

interface ComicCardProps {
  comic: Comic;
}

export function ComicCard({ comic }: ComicCardProps) {
  return (
    <div
      className="flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{ borderTopColor: comic.accent, borderTopWidth: 4 }}
    >
      {/* Cover art */}
      <div
        className={`relative h-56 overflow-hidden ${!comic.inStock ? "grayscale opacity-60" : ""}`}
      >
        <Image
          src={comic.cover}
          alt={`${comic.title} cover`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* darkening overlay so badges stay readable */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Issue badge */}
        <span className="absolute top-2 left-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-sm z-10">
          {comic.issue.split("–")[0].trim()}
        </span>

        {/* Sold-out ribbon */}
        {!comic.inStock && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <div className="absolute -top-1 -right-8 w-36 rotate-45 bg-red-600 py-1 text-center text-[10px] font-bold tracking-widest text-white uppercase">
              Sold Out
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 gap-3">
        <div className="space-y-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bangers text-xl tracking-wide leading-tight">{comic.title}</h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {comic.genre}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{comic.issue}</p>
        </div>

        <p className="text-sm text-muted-foreground flex-1 line-clamp-2">
          {comic.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-bangers text-2xl tracking-wide">
            KES {comic.price.toLocaleString()}
          </span>
          {comic.inStock ? (
            <BuyDialog comic={comic} />
          ) : (
            <Button disabled variant="outline" size="sm">
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
