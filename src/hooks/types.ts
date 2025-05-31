export interface PokemonProduct {
  id?: string;
  name: string;
  set: string;
  condition: string;
  price: number;
  purchasePrice?: number;
  purchasedFrom?: string;
  status: string;
  notes?: string;
  location?: string;
  stripeLink?: string;
  images?: string[];
}
