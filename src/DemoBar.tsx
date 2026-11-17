import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Store } from "lucide-react";
import { PRESETS } from "./lib/presets";
import { actions, useApp } from "./lib/state";

export function DemoBar() {
  const { active } = useApp();
  const { pathname, search } = useLocation();
  if (search.includes("previa=1")) return null;
  const inAdmin = pathname.startsWith("/painel");
  return (
    <div className="demobar">
      <div className="demobar-in">
        <span className="demobar-tag">Exemplo ao vivo</span>
        <label className="demobar-pick">
          <span>Ver como</span>
          <select value={active} onChange={(e) => actions.switchTo(e.target.value)} aria-label="Escolher tipo de negócio">
            {PRESETS.map((p) => <option key={p.key} value={p.key}>{p.segment}</option>)}
          </select>
        </label>
        <div className="demobar-chips" role="group" aria-label="Tipo de negócio">
          {PRESETS.map((p) => (
            <button key={p.key} className={active === p.key ? "on" : ""} onClick={() => actions.switchTo(p.key)}>{p.segment}</button>
          ))}
        </div>
        {inAdmin
          ? <Link className="demobar-go" to="/"><Store size={15} /> Ver a loja</Link>
          : <Link className="demobar-go" to="/painel"><LayoutDashboard size={15} /> Painel da loja</Link>}
      </div>
    </div>
  );
}
