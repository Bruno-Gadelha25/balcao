import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home, ReceiptText, Package, Palette, Settings, BadgeCheck, ExternalLink, Plus, Trash2, Pencil, X, RotateCcw,
  MessageCircle, Clock, Bike, Store as StoreIcon, Check,
} from "lucide-react";
import { actions, useApp } from "../lib/state";
import { brl, FONTS, readableOn, themeVars, waLink, SALES_WA } from "../lib/ui";
import type { Corners, FontKey, Style, Order, OrderStatus, Product, Store, Theme } from "../lib/types";
import { DemoBar } from "../DemoBar";
import { orderText } from "../store/Storefront";

type Tab = "inicio" | "pedidos" | "produtos" | "aparencia" | "loja" | "plano";
const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "pedidos", label: "Pedidos", icon: ReceiptText },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "loja", label: "Configurações", icon: Settings },
  { id: "plano", label: "Plano", icon: BadgeCheck },
];

export function Admin() {
  const { store, orders } = useApp();
  const [tab, setTab] = useState<Tab>("inicio");
  const fresh = orders.filter((o) => o.status === "novo").length;

  return (
    <div className="adm" style={{ ...themeVars(store.theme) }}>
      <DemoBar />
      <div className="adm-shell">
        <aside className="adm-side">
          <div className="adm-store">
            <span className="adm-mark">{store.name.slice(0, 1)}</span>
            <div><strong>{store.name}</strong><span>{store.segment}</span></div>
          </div>
          <nav>
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
                <t.icon size={18} /> <span>{t.label}</span>
                {t.id === "pedidos" && fresh > 0 && <em>{fresh}</em>}
              </button>
            ))}
          </nav>
          <Link className="adm-view" to="/"><ExternalLink size={16} /> Ver minha loja</Link>
        </aside>
        <main className="adm-main">
          {tab === "inicio" && <Inicio store={store} orders={orders} go={setTab} />}
          {tab === "pedidos" && <Pedidos store={store} orders={orders} />}
          {tab === "produtos" && <Produtos store={store} />}
          {tab === "aparencia" && <Aparencia store={store} />}
          {tab === "loja" && <Loja store={store} />}
          {tab === "plano" && <Plano store={store} />}
        </main>
      </div>
    </div>
  );
}

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const ago = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  if (m < 24 * 60) return `há ${Math.floor(m / 60)} h`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

function Head({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="adm-head">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {children && <div className="adm-head-act">{children}</div>}
    </div>
  );
}

/* ---------- Início ---------- */
function Inicio({ store, orders, go }: { store: Store; orders: Order[]; go: (t: Tab) => void }) {
  const today = orders.filter((o) => isToday(o.createdAt) && o.status !== "cancelado");
  const revenue = today.reduce((s, o) => s + o.total, 0);
  const lead = store.mode === "interesse";
  const top = useMemo(() => {
    const m = new Map<string, number>();
    orders.filter((o) => o.status !== "cancelado").forEach((o) => o.items.forEach((i) => m.set(i.name, (m.get(i.name) ?? 0) + i.qty)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);
  const max = top[0]?.[1] ?? 1;
  const hour = new Date().getHours();
  const hi = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <section className={`adm-banner font-${store.theme.font}`}>
        <img src={store.cover} alt="" />
        <div className="adm-banner-in">
          <span className="adm-hi">{hi}! Este é o resumo de hoje.</span>
          <h1>{store.name}</h1>
          <div className="adm-banner-act">
            <Link className="banner-btn" to="/"><ExternalLink size={16} /> Ver minha loja</Link>
            <button className={`banner-open${store.open ? " on" : ""}`} onClick={() => actions.updateStore({ open: !store.open })}>
              <span className="dot" /> {store.open ? "Aberta: recebendo pedidos" : "Fechada: toque para abrir"}
            </button>
          </div>
        </div>
      </section>
      <div className="kpis">
        <div className="kpi"><span>{lead ? "Interessados hoje" : "Pedidos hoje"}</span><b>{today.length}</b></div>
        {!lead && <div className="kpi"><span>Faturamento hoje</span><b>{brl(revenue)}</b></div>}
        {!lead && <div className="kpi"><span>Ticket médio</span><b>{brl(today.length ? Math.round(revenue / today.length) : 0)}</b></div>}
        <div className="kpi accent"><span>Esperando você</span><b>{orders.filter((o) => o.status === "novo").length}</b></div>
      </div>
      <div className="adm-cols">
        <section className="card">
          <div className="card-h"><h2>{lead ? "Últimos interessados" : "Últimos pedidos"}</h2><button className="link" onClick={() => go("pedidos")}>Ver todos</button></div>
          <ul className="mini-orders">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id}>
                <span className="n">#{o.number}</span>
                <span className="who"><strong>{o.customer}</strong><small>{o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</small></span>
                <span className="when">{ago(o.createdAt)}</span>
                <StatusPill s={o.status} lead={lead} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <div className="card-h"><h2>{lead ? "Mais procurados" : "Mais vendidos"}</h2></div>
          <ul className="bars">
            {top.map(([n, q]) => (
              <li key={n}><span>{n}</span><i style={{ width: `${(q / max) * 100}%` }} /><b>{q}</b></li>
            ))}
          </ul>
          <div className="tip">
            <strong>Dica</strong>
            <p>Coloque um selo como "Mais pedido" ou "Promoção" nos produtos que você quer vender mais. Fica em Produtos.</p>
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------- Pedidos ---------- */
const FLOW: OrderStatus[] = ["novo", "preparo", "saiu", "entregue"];
const LABEL: Record<OrderStatus, string> = { novo: "Novo", preparo: "Em preparo", saiu: "Saiu pra entrega", entregue: "Concluído", cancelado: "Cancelado" };
const LEAD_LABEL: Record<OrderStatus, string> = { novo: "Novo contato", preparo: "Em conversa", saiu: "Visita marcada", entregue: "Atendido", cancelado: "Perdido" };

function StatusPill({ s, lead }: { s: OrderStatus; lead?: boolean }) {
  return <span className={`st st-${s}`}>{(lead ? LEAD_LABEL : LABEL)[s]}</span>;
}

function Pedidos({ store, orders }: { store: Store; orders: Order[] }) {
  const [filter, setFilter] = useState<"abertos" | "todos" | OrderStatus>("abertos");
  const lead = store.mode === "interesse";
  const L = lead ? LEAD_LABEL : LABEL;
  const list = orders.filter((o) => (filter === "todos" ? true : filter === "abertos" ? ["novo", "preparo", "saiu"].includes(o.status) : o.status === filter));

  return (
    <>
      <Head title={lead ? "Interessados" : "Pedidos"} sub="Os pedidos da loja chegam aqui na hora. Mude o andamento com um toque." />
      <div className="filters">
        {(["abertos", "novo", "preparo", "saiu", "entregue", "cancelado", "todos"] as const).map((f) => (
          <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
            {f === "abertos" ? "Em aberto" : f === "todos" ? "Todos" : L[f]}
            <em>{orders.filter((o) => (f === "todos" ? true : f === "abertos" ? ["novo", "preparo", "saiu"].includes(o.status) : o.status === f)).length}</em>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="empty">Nenhum pedido aqui. Faça um pedido de teste na loja e ele aparece nesta tela.</p>}
      <div className="orders">
        {list.map((o) => {
          const next = FLOW[FLOW.indexOf(o.status) + 1];
          return (
            <article key={o.id} className={`order st-b-${o.status}`}>
              <header>
                <strong>#{o.number}</strong>
                <StatusPill s={o.status} lead={lead} />
                <span className="when"><Clock size={13} /> {hhmm(o.createdAt)} · {ago(o.createdAt)}</span>
              </header>
              <div className="order-who">
                <b>{o.customer}</b>
                <span>{o.phone}</span>
                {!lead && <span className="ful">{o.fulfillment === "entrega" ? <><Bike size={14} /> {o.address}</> : <><StoreIcon size={14} /> Retirada na loja</>}</span>}
              </div>
              <ul className="order-items">
                {o.items.map((i, k) => (
                  <li key={k}>
                    <span>{i.qty}x {i.name}{i.extras.length > 0 && <small>{i.extras.join(" · ")}</small>}{i.note && <small>Obs.: {i.note}</small>}</span>
                    {!lead && <b>{brl(i.unit * i.qty)}</b>}
                  </li>
                ))}
              </ul>
              <footer>
                <span className="tot">{lead ? brl(o.total) : <>Total <b>{brl(o.total)}</b>{o.payment && <small>{o.payment}</small>}</>}</span>
                <div className="order-act">
                  <a className="icon-btn" title="Chamar no WhatsApp" href={waLink(o.phone, lead ? `Olá, ${o.customer.split(" ")[0]}! Aqui é da ${store.name}, sobre o ${o.items[0]?.name}.` : `Olá, ${o.customer.split(" ")[0]}! Aqui é da ${store.name}. Seu pedido #${o.number} foi recebido.`)} target="_blank" rel="noopener"><MessageCircle size={17} /></a>
                  {!lead && <button className="icon-btn" title="Copiar pedido" onClick={() => navigator.clipboard?.writeText(orderText(store, o))}><ReceiptText size={17} /></button>}
                  {o.status !== "cancelado" && o.status !== "entregue" && <button className="btn-ghost sm" onClick={() => actions.setStatus(o.id, "cancelado")}>{lead ? "Perdido" : "Cancelar"}</button>}
                  {next && o.status !== "cancelado" && <button className="btn-accent sm" onClick={() => actions.setStatus(o.id, next)}>{L[next]}</button>}
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Produtos ---------- */
function Produtos({ store }: { store: Store }) {
  const [edit, setEdit] = useState<Product | null>(null);
  const [newCat, setNewCat] = useState("");
  const blank = (): Product => ({ id: `n${Date.now()}`, cat: store.categories[0]?.id ?? "geral", name: "", desc: "", price: 0, image: store.products[0]?.image ?? "" });
  const save = (p: Product) => {
    actions.updateStore((s) => ({ ...s, products: s.products.some((x) => x.id === p.id) ? s.products.map((x) => (x.id === p.id ? p : x)) : [...s.products, p] }));
    setEdit(null);
  };

  return (
    <>
      <Head title="Produtos" sub={`${store.products.length} itens em ${store.categories.length} categorias.`}>
        <button className="btn-accent" onClick={() => setEdit(blank())}><Plus size={16} /> Novo produto</button>
      </Head>
      {store.categories.map((c) => {
        const items = store.products.filter((p) => p.cat === c.id);
        return (
          <section key={c.id} className="card prod-cat">
            <div className="card-h">
              <input className="cat-name" value={c.name} aria-label="Nome da categoria" onChange={(e) => actions.updateStore((s) => ({ ...s, categories: s.categories.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)) }))} />
              <span className="muted">{items.length} itens</span>
              {items.length === 0 && <button className="icon-btn" title="Apagar categoria" onClick={() => actions.updateStore((s) => ({ ...s, categories: s.categories.filter((x) => x.id !== c.id) }))}><Trash2 size={16} /></button>}
            </div>
            <ul className="prod-list">
              {items.map((p) => (
                <li key={p.id} className={p.soldOut ? "sold" : ""}>
                  <img src={p.image.replace("w=800", "w=160")} alt="" />
                  <div className="pl-main">
                    <strong>{p.name}</strong>
                    <span>{brl(p.price)}{p.oldPrice ? <s> {brl(p.oldPrice)}</s> : null}{p.badge ? <em>{p.badge}</em> : null}</span>
                  </div>
                  <label className="switch" title="Disponível">
                    <input type="checkbox" checked={!p.soldOut} onChange={(e) => save({ ...p, soldOut: !e.target.checked })} />
                    <i /><span>{p.soldOut ? "Esgotado" : "À venda"}</span>
                  </label>
                  <button className="icon-btn" title="Editar" onClick={() => setEdit(p)}><Pencil size={16} /></button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <form className="card add-cat" onSubmit={(e) => { e.preventDefault(); if (!newCat.trim()) return; actions.updateStore((s) => ({ ...s, categories: [...s.categories, { id: `c${Date.now()}`, name: newCat.trim() }] })); setNewCat(""); }}>
        <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nova categoria, ex.: Combos" aria-label="Nova categoria" />
        <button className="btn-ghost" type="submit"><Plus size={16} /> Criar categoria</button>
      </form>
      {edit && <ProductEditor store={store} product={edit} onClose={() => setEdit(null)} onSave={save} />}
    </>
  );
}

function ProductEditor({ store, product, onClose, onSave }: { store: Store; product: Product; onClose: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState<Product>(product);
  const exists = store.products.some((x) => x.id === product.id);
  const num = (v: string) => Math.max(0, Number(v.replace(",", ".")) || 0);
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Editar produto" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="sheet editor" onSubmit={(e) => { e.preventDefault(); if (p.name.trim()) onSave({ ...p, name: p.name.trim() }); }}>
        <button type="button" className="sheet-x" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        <div className="sheet-body">
          <h3>{exists ? "Editar produto" : "Novo produto"}</h3>
          <div className="ed-img">
            {p.image && <img src={p.image} alt="" />}
            <label className="field"><span>Link da foto</span><input value={p.image} onChange={(e) => setP({ ...p, image: e.target.value })} placeholder="https://..." /></label>
          </div>
          <label className="field"><span>Nome</span><input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} required /></label>
          <label className="field"><span>Descrição</span><textarea rows={3} value={p.desc} onChange={(e) => setP({ ...p, desc: e.target.value })} /></label>
          <div className="row2">
            <label className="field"><span>Preço (R$)</span><input inputMode="decimal" value={p.price || ""} onChange={(e) => setP({ ...p, price: num(e.target.value) })} /></label>
            <label className="field"><span>Preço antigo (opcional)</span><input inputMode="decimal" value={p.oldPrice || ""} onChange={(e) => setP({ ...p, oldPrice: num(e.target.value) || undefined })} /></label>
          </div>
          <div className="row2">
            <label className="field"><span>Categoria</span>
              <select value={p.cat} onChange={(e) => setP({ ...p, cat: e.target.value })}>{store.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </label>
            <label className="field"><span>Selo (opcional)</span><input value={p.badge ?? ""} onChange={(e) => setP({ ...p, badge: e.target.value || undefined })} placeholder="Mais pedido, Novo, -20%..." maxLength={18} /></label>
          </div>
          {p.options && p.options.length > 0 && (
            <div className="ed-opts">
              <span className="lbl">Opções que o cliente escolhe</span>
              {p.options.map((o) => <span key={o.id} className="chip">{o.name} · {o.choices.length}</span>)}
              <p className="tiny muted">Tamanhos, sabores e adicionais. A Sites Express ajusta isso pra você.</p>
            </div>
          )}
        </div>
        <div className="sheet-foot">
          {exists && <button type="button" className="btn-ghost danger" onClick={() => { actions.updateStore((s) => ({ ...s, products: s.products.filter((x) => x.id !== p.id) })); onClose(); }}><Trash2 size={16} /> Apagar</button>}
          <button className="btn-accent grow" type="submit" disabled={!p.name.trim()}>Salvar produto</button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Aparência ---------- */
const STYLES: { id: Style; name: string; hint: string }[] = [
  { id: "cardapio", name: "Cardápio", hint: "Lista com fotos redondas, como menu de cantina" },
  { id: "poster", name: "Pôster", hint: "Cards fortes com borda grossa, cara de rua" },
  { id: "bairro", name: "Balcão de bairro", hint: "Linhas compactas, rápido de escolher" },
  { id: "editorial", name: "Editorial", hint: "Fotos em pé, ritmo de revista de moda" },
  { id: "showroom", name: "Showroom", hint: "Fotos largas e ficha técnica" },
];

const PALETTES: { name: string; t: Partial<Theme> }[] = [
  { name: "Cantina", t: { accent: "#C8321F", bg: "#FFFDF9", surface: "#FFFFFF", text: "#2B1810", muted: "#7D6656", line: "#EFE3D3" } },
  { name: "Mostarda", t: { accent: "#D7261E", bg: "#F6C445", surface: "#FFF7DF", text: "#1A1A1A", muted: "#5A4A1E", line: "#1A1A1A" } },
  { name: "Azulejo", t: { accent: "#0F6B45", bg: "#F7F8F4", surface: "#FFFFFF", text: "#17271F", muted: "#5B6A61", line: "#DDE5DF" } },
  { name: "Pedra", t: { accent: "#5B5F3A", bg: "#ECE8E1", surface: "#F6F3EE", text: "#1A1A1A", muted: "#6E6960", line: "#D6D0C5" } },
  { name: "Asfalto", t: { accent: "#E5322D", bg: "#EEF0F2", surface: "#FFFFFF", text: "#15181C", muted: "#66707C", line: "#D9DDE2" } },
  { name: "Açaí", t: { accent: "#6B2FA3", bg: "#F7F2FB", surface: "#FFFFFF", text: "#24152F", muted: "#6F5F7C", line: "#E6DAF0" } },
  { name: "Maré", t: { accent: "#0E7C86", bg: "#EEF6F6", surface: "#FFFFFF", text: "#0F2A2D", muted: "#557074", line: "#D3E6E7" } },
  { name: "Noite", t: { accent: "#F2B33D", bg: "#16181D", surface: "#20232A", text: "#F3F1EC", muted: "#A3A5AB", line: "#30343C" } },
];

function Aparencia({ store }: { store: Store }) {
  const t = store.theme;
  const setT = (patch: Partial<Theme>) => {
    const next = { ...t, ...patch };
    if (patch.accent) next.onAccent = readableOn(patch.accent);
    actions.updateStore({ theme: next });
  };
  return (
    <>
      <Head title="Aparência" sub="Mude e veja a loja na hora, aqui do lado." />
      <div className="look">
        <div className="look-form">
          <section className="card">
            <h2>Identidade</h2>
            <label className="field"><span>Nome da loja</span><input value={store.name} onChange={(e) => actions.updateStore({ name: e.target.value })} maxLength={32} /></label>
            <label className="field"><span>Frase de apresentação</span><input value={store.tagline} onChange={(e) => actions.updateStore({ tagline: e.target.value })} maxLength={80} /></label>
            <label className="field"><span>Foto de capa (link)</span><input value={store.cover} onChange={(e) => actions.updateStore({ cover: e.target.value })} /></label>
          </section>
          <section className="card">
            <h2>Paletas prontas</h2>
            <div className="palettes">
              {PALETTES.map((p) => (
                <button key={p.name} className={t.accent === p.t.accent && t.bg === p.t.bg ? "on" : ""} onClick={() => setT({ ...p.t, onAccent: readableOn(p.t.accent!) })}>
                  <span className="sw" style={{ background: p.t.bg }}><i style={{ background: p.t.accent }} /><i style={{ background: p.t.text }} /></span>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="colors">
              <ColorField label="Cor principal" value={t.accent} onChange={(v) => setT({ accent: v })} />
              <ColorField label="Fundo" value={t.bg} onChange={(v) => setT({ bg: v })} />
              <ColorField label="Cartões" value={t.surface} onChange={(v) => setT({ surface: v })} />
              <ColorField label="Texto" value={t.text} onChange={(v) => setT({ text: v })} />
            </div>
          </section>
          <section className="card">
            <h2>Letras</h2>
            <div className="fonts">
              {(Object.keys(FONTS) as FontKey[]).map((k) => (
                <button key={k} className={t.font === k ? "on" : ""} onClick={() => setT({ font: k })}>
                  <span style={{ fontFamily: FONTS[k].display, textTransform: FONTS[k].upper ? "uppercase" : "none" }}>{store.name.split(" ")[0] || "Loja"}</span>
                  <small>{FONTS[k].label}</small>
                </button>
              ))}
            </div>
          </section>
          <section className="card">
            <h2>Formato</h2>
            <span className="lbl">Cantos</span>
            <div className="seg">
              {(["reto", "suave", "redondo"] as Corners[]).map((c) => (
                <button key={c} className={t.corners === c ? "on" : ""} onClick={() => setT({ corners: c })}>{c[0].toUpperCase() + c.slice(1)}</button>
              ))}
            </div>
          </section>
          <section className="card">
            <h2>Estilo da vitrine</h2>
            <div className="styles">
              {STYLES.map((x) => (
                <button key={x.id} className={t.style === x.id ? "on" : ""} onClick={() => setT({ style: x.id })}>
                  <span className={`sty sty-${x.id}`} aria-hidden><i /><i /><i /></span>
                  <b>{x.name}</b>
                  <small>{x.hint}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
        <div className="look-preview" aria-label="Prévia da loja">
          <div className="phone"><iframe title="Prévia da loja" src="/?previa=1" /></div>
        </div>
      </div>
    </>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="color">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} />
      <span><b>{label}</b><small>{value}</small></span>
    </label>
  );
}

/* ---------- Configurações ---------- */
function Loja({ store }: { store: Store }) {
  const [pay, setPay] = useState("");
  const up = (p: Partial<Store>) => actions.updateStore(p);
  return (
    <>
      <Head title="Configurações" sub="Contato, horário, entrega e pagamento.">
        <button className="btn-ghost" onClick={() => confirm("Voltar tudo desta loja para o exemplo original?") && actions.resetStore()}><RotateCcw size={16} /> Restaurar exemplo</button>
      </Head>
      <div className="adm-cols">
        <section className="card">
          <h2>Contato</h2>
          <label className="field"><span>WhatsApp que recebe os pedidos</span><input value={store.whatsapp} onChange={(e) => up({ whatsapp: e.target.value.replace(/[^\d() -]/g, "") })} inputMode="tel" placeholder="Deixe vazio na demonstração" /></label>
          <label className="field"><span>Instagram</span><input value={store.instagram} onChange={(e) => up({ instagram: e.target.value })} /></label>
          <label className="field"><span>Bairro e cidade</span><input value={store.city} onChange={(e) => up({ city: e.target.value })} /></label>
          <label className="field"><span>Horário de funcionamento</span><input value={store.hours} onChange={(e) => up({ hours: e.target.value })} /></label>
          <label className="switch big"><input type="checkbox" checked={store.open} onChange={(e) => up({ open: e.target.checked })} /><i /><span>{store.open ? "Loja aberta agora" : "Loja fechada agora"}</span></label>
        </section>
        <section className="card">
          <h2>Como vende</h2>
          <div className="seg">
            <button className={store.mode === "pedido" ? "on" : ""} onClick={() => up({ mode: "pedido" })}>Sacola e pedido</button>
            <button className={store.mode === "interesse" ? "on" : ""} onClick={() => up({ mode: "interesse" })}>Só interesse (carros, imóveis)</button>
          </div>
          {store.mode === "pedido" && (
            <>
              <label className="switch"><input type="checkbox" checked={store.delivery} onChange={(e) => up({ delivery: e.target.checked })} /><i /><span>Faz entrega</span></label>
              <label className="switch"><input type="checkbox" checked={store.pickup} onChange={(e) => up({ pickup: e.target.checked })} /><i /><span>Cliente pode retirar</span></label>
              <div className="row2">
                <label className="field"><span>Taxa de entrega (R$)</span><input inputMode="decimal" value={store.deliveryFee} onChange={(e) => up({ deliveryFee: Math.max(0, Number(e.target.value.replace(",", ".")) || 0) })} /></label>
                <label className="field"><span>Pedido mínimo (R$)</span><input inputMode="decimal" value={store.minOrder} onChange={(e) => up({ minOrder: Math.max(0, Number(e.target.value.replace(",", ".")) || 0) })} /></label>
              </div>
            </>
          )}
          <label className="field"><span>Tempo de entrega ou aviso</span><input value={store.eta} onChange={(e) => up({ eta: e.target.value })} /></label>
          <span className="lbl">Formas de pagamento</span>
          <div className="chips">
            {store.payments.map((p) => (
              <span key={p} className="chip">{p}<button aria-label={`Remover ${p}`} onClick={() => up({ payments: store.payments.filter((x) => x !== p) })}><X size={13} /></button></span>
            ))}
          </div>
          <form className="inline" onSubmit={(e) => { e.preventDefault(); if (pay.trim()) { up({ payments: [...store.payments, pay.trim()] }); setPay(""); } }}>
            <input value={pay} onChange={(e) => setPay(e.target.value)} placeholder="Ex.: Vale-refeição" aria-label="Nova forma de pagamento" />
            <button className="btn-ghost" type="submit"><Plus size={16} /> Adicionar</button>
          </form>
        </section>
        <section className="card">
          <h2>Textos dos botões</h2>
          <label className="field"><span>Botão de adicionar</span><input value={store.labels.add} onChange={(e) => up({ labels: { ...store.labels, add: e.target.value } })} maxLength={22} /></label>
          <label className="field"><span>Nome da sacola</span><input value={store.labels.bag} onChange={(e) => up({ labels: { ...store.labels, bag: e.target.value } })} maxLength={14} /></label>
          <label className="field"><span>Botão final</span><input value={store.labels.cta} onChange={(e) => up({ labels: { ...store.labels, cta: e.target.value } })} maxLength={22} /></label>
        </section>
      </div>
    </>
  );
}

/* ---------- Plano ---------- */
function Plano({ store }: { store: Store }) {
  const items = ["Loja com a sua cara: cores, letras, fotos e textos", "Pedidos no WhatsApp e no painel, sem taxa por venda", "Cardápio ou catálogo ilimitado, com tamanhos e adicionais", "Hospedagem, domínio, segurança e atualizações", "Alterações quando você pedir, pelo WhatsApp", "Suporte de gente de verdade"];
  return (
    <>
      <Head title="Seu plano" sub="Você cuida da loja. A gente cuida do sistema." />
      <div className="plan-card">
        <div className="plan-top">
          <span className="plan-name">Balcão</span>
          <span className="plan-status"><Check size={14} /> Ativo</span>
        </div>
        <div className="plan-price"><b>R$ 197</b><span>por mês de manutenção</span></div>
        <p className="muted">Implantação sob orçamento, com preço fechado antes de começar. A Sites Express monta a loja inteira pra você. Se preferir, você mesmo muda tudo por este painel.</p>
        <ul>{items.map((i) => <li key={i}><Check size={16} /> {i}</li>)}</ul>
        <a className="btn-accent" href={waLink(SALES_WA, `Oi! Vi o painel do Balcão (${store.segment}) e quero uma loja assim pro meu negócio.`)} target="_blank" rel="noopener"><MessageCircle size={17} /> Quero uma loja assim</a>
      </div>
    </>
  );
}
