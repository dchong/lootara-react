export type PokemonProduct = {
  id: string;
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
  type: "pokemon";
};

export type BearbrickProduct = {
  id: string;
  status: string;
  name: string;
  size?: string;
  series?: string;
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
  type: "bearbrick";
};

export type BaseProduct = PokemonProduct | BearbrickProduct;
