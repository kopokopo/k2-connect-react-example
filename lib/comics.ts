export interface Comic {
  id: string;
  title: string;
  issue: string;
  description: string;
  price: number;
  cover: string;
  genre: string;
  inStock: boolean;
  gradient: string;
  accent: string;
}

export const comics: Comic[] = [
  {
    id: "1",
    title: "Nairobi Knights",
    issue: "#1 – Origins",
    description:
      "The birth of Nairobi's first superhero squad, forged from the chaos of a city that never sleeps.",
    price: 500,
    cover: "https://images.unsplash.com/photo-1693902997450-7e912c0d3554?w=400&h=600&fit=crop&q=80",
    genre: "Superhero",
    inStock: true,
    gradient: "from-blue-900 via-blue-800 to-blue-700",
    accent: "#1d4ed8",
  },
  {
    id: "2",
    title: "Savanna Saga",
    issue: "Vol. 2 – The Great Migration",
    description:
      "Warriors ride across endless plains in a battle for the ancient scrolls of the Maasai.",
    price: 650,
    cover: "https://images.unsplash.com/photo-1627394679983-b6cff2bd5c25?w=400&h=600&fit=crop&q=80",
    genre: "Adventure",
    inStock: true,
    gradient: "from-amber-800 via-amber-700 to-yellow-600",
    accent: "#b45309",
  },
  {
    id: "3",
    title: "Mombasa Defenders",
    issue: "#3 – Tide & Fire",
    description:
      "A coastal city under siege. The Defenders must unite sea and land to push back the invaders.",
    price: 550,
    cover: "https://images.unsplash.com/photo-1673902275677-eb4785aee1c3?w=400&h=600&fit=crop&q=80",
    genre: "Action",
    inStock: true,
    gradient: "from-teal-900 via-teal-800 to-cyan-700",
    accent: "#0f766e",
  },
  {
    id: "4",
    title: "Rift Valley Chronicles",
    issue: "#1 – Awakening",
    description:
      "Ancient powers stir beneath the Great Rift Valley. Only one geologist can stop what's coming.",
    price: 700,
    cover: "https://images.unsplash.com/photo-1714829732361-52de32006f5f?w=400&h=600&fit=crop&q=80",
    genre: "Sci-Fi",
    inStock: true,
    gradient: "from-red-900 via-red-800 to-orange-700",
    accent: "#b91c1c",
  },
  {
    id: "5",
    title: "Kilimanjaro Squad",
    issue: "Special Edition",
    description:
      "A daring mountain rescue mission turns into a race against a shadowy organisation.",
    price: 900,
    cover: "https://images.unsplash.com/photo-1768734829789-3f6ddc76a87e?w=400&h=600&fit=crop&q=80",
    genre: "Thriller",
    inStock: false,
    gradient: "from-slate-800 via-slate-700 to-slate-600",
    accent: "#475569",
  },
  {
    id: "6",
    title: "Lake Victoria",
    issue: "#2 – Depths Unknown",
    description:
      "What lurks beneath Africa's largest lake? One diver is about to find out the hard way.",
    price: 600,
    cover: "https://images.unsplash.com/photo-1735295442304-f41c88298de0?w=400&h=600&fit=crop&q=80",
    genre: "Mystery",
    inStock: true,
    gradient: "from-indigo-900 via-purple-800 to-violet-700",
    accent: "#6d28d9",
  },
];
