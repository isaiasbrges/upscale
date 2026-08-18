import {
  Banknote, Camera, Check, Coffee, Coins, Crown, Gem, Gift, Heart,
  Laptop, Package, Percent, Pizza, Plane, ShoppingCart, Smartphone,
  Star, Ticket, Trophy, Wallet, Zap,
} from "lucide-react";

export const prizeIcons = {
  Gift, Gem, Trophy, Star, Crown, Coins, Package, Percent, ShoppingCart,
  Ticket, Zap, Heart, Camera, Smartphone, Laptop, Plane, Coffee, Pizza,
  Wallet, Banknote,
} as const;

export type PrizeIconName = keyof typeof prizeIcons;
export const prizeIconNames = Object.keys(prizeIcons) as PrizeIconName[];
export { Check };

export function getPrizeIcon(name?: string | null) {
  return name && name in prizeIcons
    ? prizeIcons[name as PrizeIconName]
    : Gift;
}
