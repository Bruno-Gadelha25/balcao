export type FontKey = "trattoria" | "poster" | "bairro" | "elegante" | "pista" | "moderna";
export type Style = "cardapio" | "poster" | "bairro" | "editorial" | "showroom";
export type Corners = "reto" | "suave" | "redondo";
export type Mode = "pedido" | "interesse";

export type Choice = { name: string; price: number };
export type OptionGroup = {
  id: string;
  name: string;
  min: number; // 1 = obrigatório
  max: number; // 1 = escolha única
  choices: Choice[];
};

export type Product = {
  id: string;
  cat: string;
  name: string;
  desc: string;
  price: number; // em reais
  oldPrice?: number;
  image: string;
  badge?: string;
  soldOut?: boolean;
  options?: OptionGroup[];
  specs?: [string, string][];
};

export type Category = { id: string; name: string };

export type Theme = {
  accent: string;
  onAccent: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  line: string;
  font: FontKey;
  corners: Corners;
  style: Style;
};

export type Store = {
  key: string;
  segment: string;
  name: string;
  tagline: string;
  cover: string;
  heroImage?: string;
  city: string;
  whatsapp: string; // só dígitos, com DDD. Vazio = modo demonstração
  instagram: string;
  hours: string;
  open: boolean;
  eta: string;
  deliveryFee: number;
  minOrder: number;
  delivery: boolean;
  pickup: boolean;
  payments: string[];
  mode: Mode;
  labels: { add: string; bag: string; cta: string };
  theme: Theme;
  categories: Category[];
  products: Product[];
};

export type OrderItem = { name: string; qty: number; unit: number; extras: string[]; note?: string };
export type OrderStatus = "novo" | "preparo" | "saiu" | "entregue" | "cancelado";
export type Order = {
  id: string;
  number: number;
  createdAt: string;
  kind: "pedido" | "interesse";
  customer: string;
  phone: string;
  fulfillment: "entrega" | "retirada";
  address?: string;
  payment?: string;
  change?: string;
  note?: string;
  items: OrderItem[];
  fee: number;
  total: number;
  status: OrderStatus;
};
