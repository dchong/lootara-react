export interface PokemonProduct {
  id?: string;
  status: string;
  name: string;
  cardNumber: string;
  set: string;
  condition?: string;
  location?: string;
  purchasePrice?: number;
  purchasedFrom?: string;
  purchaseDate?: Date;
  price?: number;
  soldDate?: Date;
  stripeLink?: string;
  notes?: string;
  images?: string[];
}

export interface BearbrickProduct {
  id?: string;
  status: string;
  name: string;
  size: string;
  series: string;
  condition?: string;
  location?: string;
  purchasePrice?: number;
  purchasedFrom?: string;
  purchaseDate?: Date;
  price?: number;
  soldDate?: Date;
  stripeLink?: string;
  notes?: string;
  images?: string[];
}
