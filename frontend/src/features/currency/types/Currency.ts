export type Backing = "BRL" | "USD" | "JPY" | "EUR" | "CNY" | "ARS";

export interface History {
  id: number;
  datetime: string;
  price: number;
  currencyId: number;
}

export interface Currency {
  id?: number;
  name: string;
  description: string;
  status: boolean;
  backing: Backing;
  icon: string; // Agora obrigatório!
  histories?: History[];
}