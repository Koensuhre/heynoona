import {
  Heart,
  Baby,
  Cake,
  Briefcase,
  PartyPopper,
  DoorOpen,
  Sparkles,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { EVENT_TYPES } from "./packages";

export const EVENT_TYPE_ICONS: Record<string, LucideIcon> = {
  Bruiloft: Heart,
  Babyshower: Baby,
  Verjaardag: Cake,
  Bedrijfsevent: Briefcase,
  Festival: PartyPopper,
  Opening: DoorOpen,
  "Influencer event": Sparkles,
  Anders: MoreHorizontal,
};

export function getEventTypeIcon(type: string): LucideIcon {
  return EVENT_TYPE_ICONS[type] ?? MoreHorizontal;
}

export { EVENT_TYPES };
