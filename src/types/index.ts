import { Timestamp } from "firebase/firestore";

export type PokemonProduct = {
  id: string;
  name: string;
  cardNumber: string;
  set: string;
  condition?: string;
  purchasePrice?: number;
  purchasedFrom?: string;
  purchaseDate?: Date | Timestamp;
  price?: number;
  soldDate?: Date | Timestamp;
  stripeLink?: string;
  notes?: string;
  location?: string;
  listedOn?: string;
  images?: string[];
  status: string;
  orderNumber?: string;
  platformFees?: number;
  shippingMaterialCost?: number;
  postageCost?: number;
  shipDate?: Date | Timestamp;
  tracking?: string;
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
