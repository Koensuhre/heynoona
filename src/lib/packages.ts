export type PackageId = "roze" | "blauw" | "groen";

export interface Package {
  id: PackageId;
  name: string;
  emoji: string;
  price: number;
  priceLabel: string;
  color: string;
  borderColor: string;
  glowColor: string;
  bgClass: string;
  features: string[];
  popular?: boolean;
}

export const PACKAGES: Package[] = [
  {
    id: "roze",
    name: "Roze",
    emoji: "🌸",
    price: 185,
    priceLabel: "€185",
    color: "bg-pink/25",
    borderColor: "border-pink/30",
    glowColor: "hover:shadow-pink/20",
    bgClass: "from-pink/30 to-pink/10",
    features: [
      "2 uur photobooth",
      "Onbeperkt digitale foto's",
      "Achtergrond layout",
      "Foto's digitaal toegestuurd",
      "Prijzen excl. BTW"
    ],
  },
  {
    id: "blauw",
    name: "Blauw",
    emoji: "💙",
    price: 250,
    priceLabel: "€250",
    color: "bg-blue/25",
    borderColor: "border-blue/30",
    glowColor: "hover:shadow-blue/20",
    bgClass: "from-blue/30 to-blue/10",
    features: [
      "2 uur photobooth",
      "Onbeperkt digitale foto's",
      "200 prints",
      "Achtergrond layout",
      "Foto's digitaal toegestuurd",
    ],
    popular: true,
  },
  {
    id: "groen",
    name: "Groen",
    emoji: "💚",
    price: 325,
    priceLabel: "€325",
    color: "bg-green/25",
    borderColor: "border-green/30",
    glowColor: "hover:shadow-green/20",
    bgClass: "from-green/30 to-green/10",
    features: [
      "2 uur photobooth",
      "Onbeperkt digitale foto's",
      "Onbeperkt prints (fair use)",
      "Achtergrond layout",
      "Foto's digitaal toegestuurd",
    ],
  },
];

export const TIME_SLOTS = [
  { start: "10:00", end: "12:00", label: "10:00 – 12:00" },
  { start: "12:00", end: "14:00", label: "12:00 – 14:00" },
  { start: "14:00", end: "16:00", label: "14:00 – 16:00" },
  { start: "16:00", end: "18:00", label: "16:00 – 18:00" },
  { start: "18:00", end: "20:00", label: "18:00 – 20:00" },
  { start: "20:00", end: "22:00", label: "20:00 – 22:00" },
];

export const EVENT_TYPES = [
  "Bruiloft",
  "Babyshower",
  "Verjaardag",
  "Bedrijfsevent",
  "Festival",
  "Opening",
  "Influencer event",
  "Anders",
];

export function getPackageById(id: PackageId): Package | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function formatDateNL(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
