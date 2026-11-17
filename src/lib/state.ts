import { useSyncExternalStore } from "react";
import { PRESETS, presetByKey } from "./presets";
import type { Order, OrderStatus, Store } from "./types";

const K = {
  active: "balcao:v2:ativa",
  store: (k: string) => `balcao:v2:loja:${k}`,
  orders: (k: string) => `balcao:v2:pedidos:${k}`,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo anônimo ou sem espaço: segue só na memória */
  }
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const NAMES = ["Mariana Souza", "Rafael Lima", "Juliana Costa", "Pedro Henrique", "Camila Rocha", "Lucas Almeida", "Ana Beatriz", "Thiago Martins", "Fernanda Alves", "Gabriel Santos", "Larissa Melo", "Bruno Carvalho"];
const STREETS = ["SQN 210 Bloco C, ap 304", "Rua 12 Norte, lote 5, ap 1102", "QS 3 Rua 420, casa 8", "SHCGN 704 Bloco F, casa 12", "Av. das Araucárias, 1835", "CLN 405 Bloco B, sala 9"];

type Snapshot = { active: string; store: Store; orders: Order[] };

let listeners = new Set<() => void>();
let snap: Snapshot = load(read(K.active, PRESETS[0].key));

function load(key: string): Snapshot {
  const base = presetByKey(key);
  const saved = read<Store | null>(K.store(base.key), null);
  const store = saved && saved.key === base.key ? { ...clone(base), ...saved } : clone(base);
  let orders = read<Order[] | null>(K.orders(base.key), null);
  if (!orders) {
    orders = seedOrders(store);
    write(K.orders(base.key), orders);
  }
  return { active: base.key, store, orders };
}

function emit(next: Snapshot) {
  snap = next;
  listeners.forEach((l) => l());
}

export function useApp() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => snap,
  );
}

export const actions = {
  switchTo(key: string) {
    write(K.active, key);
    emit(load(key));
  },
  updateStore(patch: Partial<Store> | ((s: Store) => Store)) {
    const store = typeof patch === "function" ? patch(clone(snap.store)) : { ...snap.store, ...patch };
    write(K.store(store.key), store);
    emit({ ...snap, store });
  },
  resetStore() {
    try {
      localStorage.removeItem(K.store(snap.active));
      localStorage.removeItem(K.orders(snap.active));
    } catch {
      /* nada */
    }
    emit(load(snap.active));
  },
  addOrder(o: Omit<Order, "id" | "number" | "createdAt" | "status">): Order {
    const number = Math.max(100, ...snap.orders.map((x) => x.number)) + 1;
    const order: Order = { ...o, id: crypto.randomUUID(), number, createdAt: new Date().toISOString(), status: "novo" };
    const orders = [order, ...snap.orders];
    write(K.orders(snap.active), orders);
    emit({ ...snap, orders });
    return order;
  },
  setStatus(id: string, status: OrderStatus) {
    const orders = snap.orders.map((o) => (o.id === id ? { ...o, status } : o));
    write(K.orders(snap.active), orders);
    emit({ ...snap, orders });
  },
};

// Sincroniza entre abas (loja numa aba, painel na outra)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith("balcao:")) emit(load(read(K.active, snap.active)));
  });
}

/* Pedidos de exemplo para o painel não abrir vazio */

function seedOrders(store: Store): Order[] {
  const now = Date.now();
  const rnd = mulberry(store.key.length * 9301);
  const out: Order[] = [];
  const count = store.mode === "interesse" ? 7 : 14;
  for (let i = 0; i < count; i++) {
    const minutesAgo = i < 3 ? 6 + i * 11 : 40 + i * 95 + Math.floor(rnd() * 60);
    const created = new Date(now - minutesAgo * 60000);
    const pick = () => store.products[Math.floor(rnd() * store.products.length)];
    const items = store.mode === "interesse"
      ? [{ name: pick().name, qty: 1, unit: 0, extras: [rnd() > 0.5 ? "Quer financiar" : "Tem carro na troca"] }]
      : Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => {
          const p = pick();
          const extra = p.options?.[0]?.choices[Math.floor(rnd() * p.options[0].choices.length)];
          return { name: p.name, qty: 1 + Math.floor(rnd() * 2), unit: p.price + (extra?.price ?? 0), extras: extra ? [extra.name] : [] };
        });
    const sub = items.reduce((s, it) => s + it.qty * it.unit, 0);
    const entrega = store.delivery && (!store.pickup || rnd() > 0.3);
    const fee = store.mode === "pedido" && entrega ? store.deliveryFee : 0;
    const status: OrderStatus = i === 0 ? "novo" : i === 1 ? "preparo" : i === 2 ? "saiu" : i === 9 ? "cancelado" : "entregue";
    out.push({
      id: `seed-${store.key}-${i}`,
      number: 100 + count - i,
      createdAt: created.toISOString(),
      kind: store.mode,
      customer: NAMES[Math.floor(rnd() * NAMES.length)],
      phone: `(61) 9${8000 + Math.floor(rnd() * 1999)}-${1000 + Math.floor(rnd() * 8999)}`,
      fulfillment: entrega ? "entrega" : "retirada",
      address: entrega ? STREETS[Math.floor(rnd() * STREETS.length)] : undefined,
      payment: store.payments[Math.floor(rnd() * store.payments.length)],
      items,
      fee,
      total: sub + fee,
      status: store.mode === "interesse" && status !== "cancelado" ? (i < 2 ? "novo" : "entregue") : status,
    });
  }
  return out;
}

function mulberry(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
