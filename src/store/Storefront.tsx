import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Minus, Plus, ShoppingBag, ArrowDown, X, Check, Bike, Store as StoreIcon, AtSign, ChevronRight } from "lucide-react";
import { actions, useApp } from "../lib/state";
import { brl, themeVars, waLink, SALES_WA } from "../lib/ui";
import type { Choice, Order, Product, Store } from "../lib/types";
import { DemoBar } from "../DemoBar";

type Line = { key: string; product: Product; qty: number; picks: Record<string, Choice[]>; note: string };

const unitPrice = (p: Product, picks: Record<string, Choice[]>) =>
  p.price + Object.values(picks).flat().reduce((s, c) => s + c.price, 0);
const extrasOf = (picks: Record<string, Choice[]>) => Object.values(picks).flat().map((c) => c.name);

export function Storefront() {
  const { store } = useApp();
  const [cat, setCat] = useState<string | undefined>(store.categories[0]?.id);
  const [open, setOpen] = useState<Product | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [done, setDone] = useState<Order | null>(null);
  const sections = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setLines([]);
    setCat(store.categories[0]?.id);
    document.title = `${store.name} · ${store.mode === "interesse" ? "estoque online" : store.theme.style === "editorial" ? "loja online" : "pedidos online"}`;
  }, [store.key]); // eslint-disable-line

  const visibleCats = store.categories.filter((c) => store.products.some((p) => p.cat === c.id));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * unitPrice(l.product, l.picks), 0);
  const isCar = store.mode === "interesse";
  const featured = store.products.find((p) => !p.soldOut && /mais/i.test(p.badge ?? "")) ?? store.products.find((p) => !p.soldOut);
  const goCat = (id: string) => sections.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Destaca a categoria visível ao rolar
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setCat(e.target.getAttribute("data-cat") || undefined)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    Object.values(sections.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [store.key, visibleCats.length]);

  const add = (product: Product, qty: number, picks: Record<string, Choice[]>, note: string) => {
    const key = product.id + JSON.stringify(picks) + note;
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      return found ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)) : [...ls, { key, product, qty, picks, note }];
    });
    setOpen(null);
  };

  return (
    <div className={`sf font-${store.theme.font} st-${store.theme.style}`} style={themeVars(store.theme)}>
      <DemoBar />
      <div className="sf-top">
        <div className="wrap sf-top-in">
          <a className="sf-logo" href="#topo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <span className="sf-mark">{store.name.slice(0, 1)}</span>
            <span className="sf-logo-name">{store.name}</span>
          </a>
          <nav className="sf-cats" aria-label="Categorias">
            {visibleCats.map((c) => (
              <button key={c.id} className={cat === c.id ? "on" : ""} onClick={() => goCat(c.id)}>{c.name}</button>
            ))}
          </nav>
          {!isCar && (
            <button className="sf-topbag" onClick={() => setBagOpen(true)} aria-label={`${store.labels.bag}: ${count} itens`}>
              <ShoppingBag size={19} />
              {count > 0 && <em>{count}</em>}
            </button>
          )}
        </div>
      </div>

      <Hero store={store} onStart={() => visibleCats[0] && goCat(visibleCats[0].id)} />
      {featured && <Feature store={store} p={featured} onOpen={() => setOpen(featured)} />}

      <main className="wrap sf-main">
        {visibleCats.map((c) => (
          <section key={c.id} data-cat={c.id} ref={(el) => { sections.current[c.id] = el; }} className="sf-sec">
            <h2>{c.name}</h2>
            <div className="sf-grid">
              {store.products.filter((p) => p.cat === c.id).map((p) =>
                store.theme.style === "cardapio"
                  ? <MenuItem key={p.id} p={p} onOpen={() => setOpen(p)} />
                  : <Card key={p.id} p={p} isCar={isCar} onOpen={() => setOpen(p)} />,
              )}
            </div>
          </section>
        ))}
      </main>

      <footer className="sf-foot">
        <div className="wrap">
          <div>
            <strong>{store.name}</strong>
            <span>{store.hours}</span>
            <span>{store.payments.join(", ")}</span>
          </div>
          <div className="sf-foot-r">
            {store.instagram && <span><AtSign size={15} /> {store.instagram}</span>}
            <span className="made">Loja feita pela <a href="/" onClick={(e) => { e.preventDefault(); window.open(waLink(SALES_WA, "Oi! Vi o Balcão e quero uma loja assim pro meu negócio."), "_blank"); }}>Sites Express</a></span>
          </div>
        </div>
      </footer>

      {!isCar && count > 0 && !bagOpen && (
        <button className="sf-bagbar" onClick={() => setBagOpen(true)}>
          <span className="n">{count}</span>
          <span>Ver {store.labels.bag.toLowerCase()}</span>
          <strong>{brl(subtotal)}</strong>
        </button>
      )}

      {open && (isCar
        ? <CarSheet store={store} product={open} onClose={() => setOpen(null)} onDone={(o) => { setOpen(null); setDone(o); }} />
        : <ProductSheet store={store} product={open} onClose={() => setOpen(null)} onAdd={add} />)}

      {bagOpen && (
        <Bag
          store={store}
          lines={lines}
          setLines={setLines}
          subtotal={subtotal}
          onClose={() => setBagOpen(false)}
          onDone={(o) => { setLines([]); setBagOpen(false); setDone(o); }}
        />
      )}

      {done && <Done store={store} order={done} onClose={() => setDone(null)} />}
    </div>
  );
}

function fromPrice(p: Product) {
  const req = p.options?.filter((o) => o.min > 0) ?? [];
  const low = req.reduce((s, o) => s + Math.min(...o.choices.map((c) => c.price)), 0);
  return { value: p.price + Math.min(0, low), from: low < 0 };
}

function Hero({ store, onStart }: { store: Store; onStart: () => void }) {
  const st = store.theme.style;
  const cta = (
    <div className="hero-ctas">
      <button className="hero-btn" onClick={onStart}>{store.mode === "interesse" ? "Ver estoque" : store.theme.style === "editorial" ? "Ver coleção" : "Ver cardápio"} <ArrowDown size={18} /></button>
    </div>
  );
  const facts = (
    <ul className="sf-facts">
      <li className={store.open ? "is-open" : "is-closed"}><span className="dot" /> {store.open ? "Aberto agora" : "Fechado agora"}</li>
      <li><Clock size={15} /> {store.eta}</li>
      {store.mode === "pedido" && store.delivery && <li><Bike size={15} /> Entrega {store.deliveryFee ? brl(store.deliveryFee) : "grátis"}</li>}
      <li><MapPin size={15} /> {store.city}</li>
    </ul>
  );
  if (st === "cardapio") {
    const dish = store.heroImage ?? store.products[1]?.image.replace("w=800", "w=1000");
    return (
      <header className="hero hero-cardapio">
        <div className="wrap hero-in">
          <div className="hero-txt">
            <h1>{store.name}</h1>
            <p>{store.tagline}</p>
            {facts}
            {cta}
          </div>
          {dish && <img className="hero-dish" src={dish} alt="" />}
        </div>
      </header>
    );
  }
  if (st === "poster") {
    return (
      <header className="hero hero-poster">
        <div className="wrap hero-in">
          <div className="hero-txt">
            <h1>{store.name}</h1>
            <p>{store.tagline}</p>
            {facts}
            {cta}
          </div>
          <figure className="hero-sticker"><img src={store.cover.replace("w=1600", "w=900")} alt="" /></figure>
        </div>
      </header>
    );
  }
  if (st === "bairro") {
    return (
      <header className="hero hero-bairro">
        <div className="wrap hero-in">
          <div className="hero-txt">
            <span className="hero-open">{store.open ? "Aberto agora" : "Fechado agora"}</span>
            <h1>{store.name}</h1>
            <p>{store.tagline}</p>
            {facts}
            {cta}
          </div>
          <img className="hero-pic" src={store.cover.replace("w=1600", "w=900")} alt="" />
        </div>
      </header>
    );
  }
  if (st === "editorial") {
    return (
      <header className="hero hero-editorial">
        <div className="hero-txt">
          <h1>{store.name}</h1>
          <p>{store.tagline}</p>
          {facts}
          {cta}
        </div>
        <img className="hero-pic" src={store.cover} alt="" />
      </header>
    );
  }
  return (
    <header className="hero hero-showroom">
      <img className="hero-bg" src={store.cover} alt="" />
      <div className="wrap hero-in">
        <h1>{store.name}</h1>
        <p>{store.tagline}</p>
        {facts}
        {cta}
      </div>
    </header>
  );
}

function Feature({ store, p, onOpen }: { store: Store; p: Product; onOpen: () => void }) {
  const fp = fromPrice(p);
  const isCar = store.mode === "interesse";
  return (
    <section className="feat" aria-label="Destaque da casa">
      <div className="wrap feat-in">
        <div className="feat-txt">
          <span className="feat-kicker">{p.badge ?? "Destaque"}</span>
          <h2>{p.name}</h2>
          <p>{p.desc}</p>
          <div className="feat-buy">
            <span className="feat-price">{fp.from && <small>a partir de</small>}{brl(fp.value)}</span>
            <button className="hero-btn solid" onClick={onOpen}>{isCar ? "Ver detalhes" : store.labels.add}</button>
          </div>
        </div>
        <div className="feat-media"><img src={p.image.replace("w=800", "w=1400")} alt={p.name} /></div>
      </div>
    </section>
  );
}

function MenuItem({ p, onOpen }: { p: Product; onOpen: () => void }) {
  const fp = fromPrice(p);
  return (
    <button className={`mi${p.soldOut ? " sold" : ""}`} onClick={onOpen} disabled={p.soldOut}>
      <img src={p.image.replace("w=800", "w=320")} alt={p.name} loading="lazy" />
      <span className="mi-body">
        <span className="mi-row">
          <strong>{p.name}</strong>
          <i className="mi-dots" aria-hidden />
          <span className="mi-price">{fp.from && <small>a partir de </small>}{brl(fp.value)}</span>
        </span>
        <span className="mi-desc">{p.desc}</span>
        {(p.badge || p.soldOut || p.oldPrice) && (
          <span className="mi-tags">
            {p.soldOut ? <em className="out">Esgotado</em> : p.badge && <em>{p.badge}</em>}
            {p.oldPrice && <s>{brl(p.oldPrice)}</s>}
          </span>
        )}
      </span>
    </button>
  );
}

function Card({ p, isCar, onOpen }: { p: Product; isCar: boolean; onOpen: () => void }) {
  const fp = fromPrice(p);
  return (
    <button className={`sf-card${p.soldOut ? " sold" : ""}`} onClick={onOpen} disabled={p.soldOut}>
      <span className="sf-card-img">
        <img src={p.image} alt={p.name} loading="lazy" />
        {p.soldOut ? <em className="out">Esgotado</em> : p.badge && <em>{p.badge}</em>}
      </span>
      <span className="sf-card-body">
        <strong>{p.name}</strong>
        {!isCar && <span className="desc">{p.desc}</span>}
        {p.specs && (
          <span className="specs">
            {p.specs.slice(0, 3).map(([k, v]) => <span key={k}><small>{k}</small>{v}</span>)}
          </span>
        )}
        <span className="price-row">
          <span className="price">{fp.from && <small>a partir de </small>}{brl(fp.value)}</span>
          {p.oldPrice && <s>{brl(p.oldPrice)}</s>}
          <span className="add" aria-hidden>{isCar ? <ChevronRight size={18} /> : <Plus size={18} />}</span>
        </span>
      </span>
    </button>
  );
}

function Sheet({ onClose, children, label }: { onClose: () => void; children: React.ReactNode; label: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={label} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <button className="sheet-x" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        {children}
      </div>
    </div>
  );
}

function ProductSheet({ store, product: p, onClose, onAdd }: { store: Store; product: Product; onClose: () => void; onAdd: (p: Product, q: number, picks: Record<string, Choice[]>, note: string) => void }) {
  const [picks, setPicks] = useState<Record<string, Choice[]>>(() => {
    const init: Record<string, Choice[]> = {};
    p.options?.forEach((o) => { if (o.min === 1 && o.max === 1) init[o.id] = [o.choices.find((c) => c.price === 0) ?? o.choices[0]]; });
    return init;
  });
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const missing = p.options?.find((o) => (picks[o.id]?.length ?? 0) < o.min);
  const total = unitPrice(p, picks) * qty;

  const toggle = (gid: string, max: number, c: Choice) =>
    setPicks((cur) => {
      const list = cur[gid] ?? [];
      const has = list.some((x) => x.name === c.name);
      if (max === 1) return { ...cur, [gid]: has && !p.options?.find((o) => o.id === gid)?.min ? [] : [c] };
      if (has) return { ...cur, [gid]: list.filter((x) => x.name !== c.name) };
      if (list.length >= max) return cur;
      return { ...cur, [gid]: [...list, c] };
    });

  return (
    <Sheet onClose={onClose} label={p.name}>
      <img className="sheet-img" src={p.image.replace("w=800", "w=1200")} alt={p.name} />
      <div className="sheet-body">
        <h3>{p.name}</h3>
        <p className="muted">{p.desc}</p>
        {p.options?.map((o) => (
          <fieldset key={o.id} className="opt">
            <legend>
              {o.name}
              <span className={o.min ? "req" : "free"}>{o.min ? "Obrigatório" : o.max > 1 ? `Até ${o.max}` : "Opcional"}</span>
            </legend>
            {o.choices.map((c) => {
              const on = picks[o.id]?.some((x) => x.name === c.name) ?? false;
              return (
                <label key={c.name} className={`choice${on ? " on" : ""}`}>
                  <input type={o.max === 1 ? "radio" : "checkbox"} name={o.id} checked={on} onChange={() => toggle(o.id, o.max, c)} />
                  <span className="box">{on && <Check size={14} />}</span>
                  <span className="cname">{c.name}</span>
                  {c.price !== 0 && <span className="cprice">{c.price > 0 ? "+ " : "− "}{brl(Math.abs(c.price))}</span>}
                </label>
              );
            })}
          </fieldset>
        ))}
        <label className="field">
          <span>Alguma observação?</span>
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex.: sem cebola, bem passado..." maxLength={140} />
        </label>
      </div>
      <div className="sheet-foot">
        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos um"><Minus size={16} /></button>
          <span aria-live="polite">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Mais um"><Plus size={16} /></button>
        </div>
        <button className="btn-accent grow" disabled={!!missing} onClick={() => onAdd(p, qty, picks, note.trim())}>
          {missing ? `Escolha: ${missing.name.toLowerCase()}` : <>{store.labels.add} <span>{brl(total)}</span></>}
        </button>
      </div>
    </Sheet>
  );
}

function CarSheet({ store, product: p, onClose, onDone }: { store: Store; product: Product; onClose: () => void; onDone: (o: Order) => void }) {
  const [down, setDown] = useState(30);
  const [months, setMonths] = useState(48);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trade, setTrade] = useState(false);
  const rate = 0.0179;
  const financed = p.price * (1 - down / 100);
  const pmt = financed * (rate / (1 - Math.pow(1 + rate, -months)));
  const ok = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;

  const send = () => {
    const extras = [`Entrada ${down}% (${brl(p.price * down / 100)})`, `${months}x de ~${brl(Math.round(pmt))}`];
    if (trade) extras.push("Tem carro na troca");
    const order = actions.addOrder({ kind: "interesse", customer: name.trim(), phone, fulfillment: "retirada", items: [{ name: p.name, qty: 1, unit: p.price, extras }], fee: 0, total: p.price });
    if (store.whatsapp) window.open(waLink(store.whatsapp, `Olá! Tenho interesse no ${p.name} (${brl(p.price)}).\n${extras.join("\n")}\nNome: ${name}\nTelefone: ${phone}`), "_blank");
    onDone(order);
  };

  return (
    <Sheet onClose={onClose} label={p.name}>
      <img className="sheet-img wide" src={p.image.replace("w=800", "w=1400")} alt={p.name} />
      <div className="sheet-body">
        {p.badge && <span className="pill-badge">{p.badge}</span>}
        <h3>{p.name}</h3>
        <p className="big-price">{brl(p.price)} {p.oldPrice && <s>{brl(p.oldPrice)}</s>}</p>
        <p className="muted">{p.desc}</p>
        {p.specs && (
          <dl className="specs-grid">
            {p.specs.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
        )}
        <div className="fin">
          <h4>Simule o financiamento</h4>
          <label className="range">
            <span>Entrada <b>{down}% · {brl(Math.round(p.price * down / 100))}</b></span>
            <input type="range" min={10} max={80} step={5} value={down} onChange={(e) => setDown(+e.target.value)} />
          </label>
          <div className="seg">
            {[24, 36, 48, 60].map((m) => (
              <button key={m} className={months === m ? "on" : ""} onClick={() => setMonths(m)}>{m}x</button>
            ))}
          </div>
          <p className="pmt"><span>Parcelas de cerca de</span><b>{brl(Math.round(pmt))}</b></p>
          <p className="tiny muted">Simulação com taxa de 1,79% ao mês. Valor final depende da análise de crédito.</p>
        </div>
        <div className="lead">
          <h4>Quero saber mais</h4>
          <label className="field"><span>Seu nome</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label className="field"><span>WhatsApp</span><input value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} inputMode="tel" autoComplete="tel" placeholder="(61) 90000-0000" /></label>
          <label className="check"><input type="checkbox" checked={trade} onChange={(e) => setTrade(e.target.checked)} /> Tenho um carro pra dar na troca</label>
        </div>
      </div>
      <div className="sheet-foot">
        <button className="btn-accent grow" disabled={!ok} onClick={send}>{ok ? store.labels.cta : "Preencha nome e WhatsApp"}</button>
      </div>
    </Sheet>
  );
}

function Bag({ store, lines, setLines, subtotal, onClose, onDone }: {
  store: Store; lines: Line[]; setLines: React.Dispatch<React.SetStateAction<Line[]>>; subtotal: number; onClose: () => void; onDone: (o: Order) => void;
}) {
  const [step, setStep] = useState<"bag" | "dados">("bag");
  const [ful, setFul] = useState<"entrega" | "retirada">(store.delivery ? "entrega" : "retirada");
  const [f, setF] = useState({ name: "", phone: "", address: "", payment: store.payments[0] ?? "", change: "", note: "" });
  const fee = ful === "entrega" ? store.deliveryFee : 0;
  const total = subtotal + fee;
  const belowMin = store.minOrder > 0 && subtotal < store.minOrder;
  const ready = f.name.trim().length > 1 && f.phone.replace(/\D/g, "").length >= 10 && (ful === "retirada" || f.address.trim().length > 5);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const items = useMemo(() => lines.map((l) => ({ name: l.product.name, qty: l.qty, unit: unitPrice(l.product, l.picks), extras: extrasOf(l.picks), note: l.note || undefined })), [lines]);

  const submit = () => {
    const order = actions.addOrder({
      kind: "pedido", customer: f.name.trim(), phone: f.phone, fulfillment: ful,
      address: ful === "entrega" ? f.address.trim() : undefined, payment: f.payment,
      change: /dinheiro/i.test(f.payment) ? f.change : undefined, note: f.note.trim() || undefined,
      items, fee, total,
    });
    if (store.whatsapp) window.open(waLink(store.whatsapp, orderText(store, order)), "_blank");
    onDone(order);
  };

  return (
    <Sheet onClose={onClose} label={store.labels.bag}>
      <div className="sheet-body bag">
        <h3>{step === "bag" ? `Sua ${store.labels.bag.toLowerCase()}` : "Quase lá"}</h3>
        {step === "bag" ? (
          <>
            {lines.length === 0 && <p className="muted">Está vazia. Escolha algo no cardápio.</p>}
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.key}>
                  <img src={l.product.image.replace("w=800", "w=160")} alt="" />
                  <div>
                    <strong>{l.product.name}</strong>
                    {(extrasOf(l.picks).length > 0 || l.note) && <span className="muted tiny">{[...extrasOf(l.picks), l.note].filter(Boolean).join(" · ")}</span>}
                    <span className="lp">{brl(unitPrice(l.product, l.picks) * l.qty)}</span>
                  </div>
                  <div className="qty sm">
                    <button aria-label="Menos um" onClick={() => setLines((ls) => ls.flatMap((x) => (x.key === l.key ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])))}><Minus size={14} /></button>
                    <span>{l.qty}</span>
                    <button aria-label="Mais um" onClick={() => setLines((ls) => ls.map((x) => (x.key === l.key ? { ...x, qty: x.qty + 1 } : x)))}><Plus size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="form">
            {store.delivery && store.pickup && (
              <div className="seg big">
                <button className={ful === "entrega" ? "on" : ""} onClick={() => setFul("entrega")}><Bike size={16} /> Entrega</button>
                <button className={ful === "retirada" ? "on" : ""} onClick={() => setFul("retirada")}><StoreIcon size={16} /> Retirar na loja</button>
              </div>
            )}
            <label className="field"><span>Nome</span><input value={f.name} onChange={set("name")} autoComplete="name" /></label>
            <label className="field"><span>WhatsApp</span><input value={f.phone} onChange={(e) => setF({ ...f, phone: maskPhone(e.target.value) })} inputMode="tel" autoComplete="tel" placeholder="(61) 90000-0000" /></label>
            {ful === "entrega" && <label className="field"><span>Endereço completo</span><input value={f.address} onChange={set("address")} autoComplete="street-address" placeholder="Rua, número, complemento, bairro" /></label>}
            <label className="field"><span>Pagamento</span>
              <select value={f.payment} onChange={set("payment")}>{store.payments.map((p) => <option key={p}>{p}</option>)}</select>
            </label>
            {/dinheiro/i.test(f.payment) && <label className="field"><span>Troco para quanto?</span><input value={f.change} onChange={set("change")} inputMode="decimal" placeholder="Ex.: 100" /></label>}
            <label className="field"><span>Observação</span><textarea rows={2} value={f.note} onChange={set("note")} maxLength={200} /></label>
          </div>
        )}
        <dl className="sum">
          <div><dt>Subtotal</dt><dd>{brl(subtotal)}</dd></div>
          {store.delivery && <div><dt>Entrega</dt><dd>{ful === "retirada" ? "Retirada" : fee ? brl(fee) : "Grátis"}</dd></div>}
          <div className="tot"><dt>Total</dt><dd>{brl(total)}</dd></div>
        </dl>
        {belowMin && <p className="warn">Pedido mínimo de {brl(store.minOrder)}. Faltam {brl(store.minOrder - subtotal)}.</p>}
      </div>
      <div className="sheet-foot">
        {step === "dados" && <button className="btn-ghost" onClick={() => setStep("bag")}>Voltar</button>}
        {step === "bag"
          ? <button className="btn-accent grow" disabled={!lines.length || belowMin} onClick={() => setStep("dados")}>Continuar <span>{brl(total)}</span></button>
          : <button className="btn-accent grow" disabled={!ready} onClick={submit}>{ready ? <>{store.labels.cta} <span>{brl(total)}</span></> : "Preencha seus dados"}</button>}
      </div>
    </Sheet>
  );
}

function Done({ store, order, onClose }: { store: Store; order: Order; onClose: () => void }) {
  return (
    <Sheet onClose={onClose} label="Pedido enviado">
      <div className="sheet-body done">
        <span className="done-ico"><Check size={30} /></span>
        <h3>{order.kind === "interesse" ? "Recebemos seu interesse!" : `Pedido #${order.number} enviado!`}</h3>
        {store.whatsapp ? (
          <p className="muted">A conversa abriu no WhatsApp da loja. É só tocar em enviar.</p>
        ) : (
          <p className="muted">Isto é uma demonstração. Na loja de verdade, o pedido chega no <b>WhatsApp do dono</b> e aparece na hora no <b>painel da loja</b>.</p>
        )}
        <div className="done-ctas">
          <Link className="btn-accent" to="/painel" onClick={onClose}>Ver no painel da loja</Link>
          <a className="btn-ghost" href={waLink(SALES_WA, `Oi! Testei o Balcão (${store.segment}) e quero uma loja assim pro meu negócio.`)} target="_blank" rel="noopener">Quero uma loja assim</a>
        </div>
      </div>
    </Sheet>
  );
}

export function orderText(store: Store, o: Order) {
  const L = [`*Pedido #${o.number}* · ${store.name}`, ""];
  o.items.forEach((i) => {
    L.push(`${i.qty}x ${i.name} — ${brl(i.unit * i.qty)}`);
    if (i.extras.length) L.push(`   ${i.extras.join(", ")}`);
    if (i.note) L.push(`   Obs.: ${i.note}`);
  });
  L.push("", o.fee ? `Entrega: ${brl(o.fee)}` : o.fulfillment === "retirada" ? "Retirada na loja" : "Entrega grátis", `*Total: ${brl(o.total)}*`, "");
  L.push(`Nome: ${o.customer}`, `WhatsApp: ${o.phone}`);
  if (o.address) L.push(`Endereço: ${o.address}`);
  if (o.payment) L.push(`Pagamento: ${o.payment}${o.change ? ` (troco para ${o.change})` : ""}`);
  if (o.note) L.push(`Obs.: ${o.note}`);
  return L.join("\n");
}

export function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}
