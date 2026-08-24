"use client";

import { Check, Package, Pencil, Plus, RefreshCw, RotateCcw, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useState } from "react";

type CategoryRow = {
  id: number;
  shortName: string;
  categoryName: string;
  noOfProducts: number;
  active: boolean;
};

const initialRows: CategoryRow[] = [
  { id: 1, shortName: "ANTI-ALLERGY",   categoryName: "ANTI-ALLERGY",                 noOfProducts: 2, active: true },
  { id: 2, shortName: "PERIOP",         categoryName: "SPREADING AGENT",              noOfProducts: 1, active: true },
  { id: 3, shortName: "ANTI-INFEC",     categoryName: "ANTI-INFECTIVE+STEROID COMB",  noOfProducts: 3, active: true },
  { id: 4, shortName: "ANTI-GLAUCOM",   categoryName: "ANTI-GLAUCOMA",               noOfProducts: 5, active: true },
  { id: 5, shortName: "LUBRICANT",      categoryName: "TEAR SUBSTITUTE",             noOfProducts: 7, active: true },
  { id: 6, shortName: "ANTI-OXIDANT",   categoryName: "ANTI-OXIDANT",               noOfProducts: 3, active: true },
  { id: 7, shortName: "NSAID",          categoryName: "NSAID",                       noOfProducts: 2, active: true },
  { id: 8, shortName: "CORTICOSTERO",   categoryName: "CORTICOSTEROID",             noOfProducts: 2, active: true },
  { id: 9, shortName: "WIPES",          categoryName: "STERILE WIPES",              noOfProducts: 1, active: true },
  { id: 10, shortName: "ANTI-INFECTI",  categoryName: "ANTI-INFECTIVE",             noOfProducts: 2, active: true },
];

// Product popup data keyed by shortName
const productDetails: Record<string, { code: string; name: string; description: string; saleUnit: string; group: string; category: string }[]> = {
  "ANTI-ALLERGY": [
    { code: "P_11854", name: "BEPIREX",  description: "BEPOTASTINE BESILATE", saleUnit: "5ML",  group: "AA", category: "ANTI-ALLERGY" },
    { code: "ZL_PRD_12", name: "PATVIRA", description: "OLOPATADINE",        saleUnit: "3 ML", group: "AA", category: "ANTI-ALLERGY" },
  ],
  "PERIOP": [
    { code: "ZL_PRD_08", name: "HYNIZA", description: "HYLURONIDASE INJECTION", saleUnit: "10", group: "TS", category: "SPREADING AGENT" },
  ],
  "ANTI-INFEC": [
    { code: "ZL_PRD_19", name: "TOBRAWIN",    description: "TOBRAMYCIN",                              saleUnit: "5ML",  group: "AIC", category: "ANTI-INFECTIVE+STEROID COMB" },
    { code: "ZL_PRD_20", name: "TOBRAWIN LP", description: "TOBRAMYCIN AND LOTEPREDNOL ETABONATE",    saleUnit: "5ML",  group: "AIC", category: "ANTI-INFECTIVE+STEROID COMB" },
    { code: "ZL_PRD_27", name: "ZIVIMOX-D",  description: "MOXIFLOXACIN + DEXAMETHASONE",            saleUnit: "5 ML", group: "AIC", category: "ANTI-INFECTIVE+STEROID COMB" },
  ],
  "ANTI-GLAUCOM": [
    { code: "ZL_PRD_02", name: "BRINZIA",   description: "Brinzolamide and Brimonidine",  saleUnit: "10ML", group: "AG", category: "ANTI-GLAUCOMA" },
    { code: "ZL_PRD_03", name: "BRITIVIN",  description: "BRIMONIDINE + TIMOLOL",         saleUnit: "5 ML", group: "AG", category: "ANTI-GLAUCOMA" },
    { code: "ZL_PRD_09", name: "LATOBEST",  description: "LATANOPROST",                   saleUnit: "5ML",  group: "AG", category: "ANTI-GLAUCOMA" },
    { code: "ZL_PRD_16", name: "TIMOBEST",  description: "TIMOLOL",                       saleUnit: "5 ML", group: "AG", category: "ANTI-GLAUCOMA" },
    { code: "ZL_PRD_22", name: "XIATRA",    description: "TRAVOPROST",                    saleUnit: "2.5 ML", group: "AG", category: "ANTI-GLAUCOMA" },
  ],
  "LUBRICANT": [
    { code: "ZL_PRD_05", name: "DUCIRA GEL",    description: "HPMC GEL",                  saleUnit: "10GMS", group: "TS", category: "TEAR SUBSTITUTE" },
    { code: "ZL_PRD_07", name: "FOMIRA",         description: "POLYETHYLENE GLYCOL + PROPYLENE GLYCOL", saleUnit: "10 ML", group: "TS", category: "TEAR SUBSTITUTE" },
    { code: "ZL_PRD_17", name: "TIZTA 10ML",    description: "SODIUM HYALURONATE",        saleUnit: "10ML", group: "TS", category: "TEAR SUBSTITUTE" },
    { code: "ZL_PRD_18", name: "TIZTA 5ML",     description: "SODIUM HYALURONATE",        saleUnit: "5ML",  group: "TS", category: "TEAR SUBSTITUTE" },
    { code: "ZL_PRD_23", name: "ZIVIFRESH",     description: "CARBOXYMETHYL CELLULOSE",   saleUnit: "10 ML", group: "TS", category: "TEAR SUBSTITUTE" },
    { code: "ZL_PRD_24", name: "ZIVIFRESH GEL", description: "CARBOXYMETHYL CELLULOSE",   saleUnit: "10 ML", group: "TS", category: "TEAR SUBSTITUTE" },
    { code: "ZL_PRD_DD", name: "DUCI DROP",     description: "HPMC DROPS",               saleUnit: "10ml", group: "TS", category: "TEAR SUBSTITUTE" },
  ],
  "ANTI-OXIDANT": [
    { code: "ZL_PRD_06", name: "ENVISA",       description: "ASTAXANTHIN + LUTEIN + L GLUTATHION", saleUnit: "10 CAPS", group: "AO", category: "ANTI-OXIDANT" },
    { code: "ZL_PRD_11", name: "MACUMER",      description: "MACULAR ISOMERS",                      saleUnit: "10s",     group: "AO", category: "ANTI-OXIDANT" },
    { code: "ZL_PRD_21", name: "VITTLES JELLY",description: "SUPPLIMENT JELLY",                     saleUnit: "30S",     group: "AO", category: "ANTI-OXIDANT" },
  ],
  "NSAID": [
    { code: "ZL_PRD_04", name: "DEXNOVA",  description: "DEXAMETHASONE", saleUnit: "10ml",  group: "INFLM", category: "NSAID" },
    { code: "ZL_PRD_12", name: "NEPAWEL",  description: "NEPAFENAC",     saleUnit: "5 ML",  group: "INFLM", category: "NSAID" },
  ],
  "CORTICOSTERO": [
    { code: "ZL_PRD_10", name: "LOTIVIZ",  description: "LOTEPREDNOL",           saleUnit: "5 ML",  group: "INFLM", category: "CORTICOSTEROID" },
    { code: "ZL_PRD_14", name: "PREDIRA",  description: "PREDNISOLONE ACETATE",  saleUnit: "10 ML", group: "INFLM", category: "CORTICOSTEROID" },
  ],
  "WIPES": [
    { code: "ZL_PRD_15", name: "STRIOS", description: "STERILE CLEANSING WIPES", saleUnit: "24", group: "WIPES", category: "STERILE WIPES" },
  ],
  "ANTI-INFECTI": [
    { code: "ZL_PRD_25", name: "ZIVIMOX",    description: "MOXIFLOXACIN",           saleUnit: "5 ML", group: "AI", category: "ANTI-INFECTIVE" },
    { code: "ZL_PRD_13", name: "TOBRAWIN",   description: "TOBRAMYCIN",             saleUnit: "5ML",  group: "AI", category: "ANTI-INFECTIVE" },
  ],
};

// ─── Product Detail Modal ────────────────────────────────────────────────────
function ProductModal({ row, onClose }: { row: CategoryRow; onClose: () => void }) {
  const products = productDetails[row.shortName] ?? [];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--panel)", borderRadius:"16px", padding:"0", maxWidth:"780px", width:"92%", boxShadow:"0 24px 64px rgba(0,0,0,0.2)", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"var(--brand)", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ margin:0, fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.75)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Product Details</p>
            <h3 style={{ margin:0, fontSize:"18px", fontWeight:700, color:"#fff" }}>Category: {row.categoryName}</h3>
          </div>
          <button onClick={onClose} type="button" style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:"8px", padding:"6px 8px", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center" }}>
            <X size={18} />
          </button>
        </div>
        {/* Table */}
        <div style={{ overflowX:"auto", padding:"0" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <thead>
              <tr style={{ background:"var(--panel-strong)" }}>
                {["S.No","Product Code","Product Name","Product Description","Sale Unit","Product Group","Product Category"].map(h => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontWeight:600, fontSize:"12px", color:"var(--muted)", borderBottom:"1px solid var(--line)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} style={{ borderBottom:"1px solid var(--line)" }}>
                  <td style={{ padding:"10px 14px", color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                  <td style={{ padding:"10px 14px", fontFamily:"monospace", fontSize:"12px", color:"var(--brand)" }}>{p.code}</td>
                  <td style={{ padding:"10px 14px", fontWeight:600, color:"var(--ink)" }}>{p.name}</td>
                  <td style={{ padding:"10px 14px", color:"var(--muted)", fontSize:"12px" }}>{p.description}</td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ background:"var(--panel-strong)", borderRadius:"6px", padding:"2px 8px", fontSize:"12px", fontWeight:600, color:"var(--ink)" }}>{p.saleUnit}</span>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ background:"#eff6ff", borderRadius:"6px", padding:"2px 8px", fontSize:"12px", fontWeight:700, color:"#2563eb" }}>{p.group}</span>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ background:"#f0fdf4", borderRadius:"6px", padding:"2px 8px", fontSize:"12px", fontWeight:600, color:"#15803d" }}>{p.category}</span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} style={{ padding:"32px", textAlign:"center", color:"var(--muted)" }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid var(--line)", display:"flex", justifyContent:"flex-end" }}>
          <button className="button button-secondary" onClick={onClose} type="button">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Form ─────────────────────────────────────────────────────────
function CategoryForm({ row, onSave, onBack }: { row: Partial<CategoryRow>; onSave: (r: CategoryRow) => void; onBack: () => void }) {
  const [form, setForm] = useState({ shortName: row.shortName ?? "", categoryName: row.categoryName ?? "" });
  const isEdit = !!row.id;

  function save() {
    if (!form.shortName.trim() || !form.categoryName.trim()) return;
    onSave({ id: row.id ?? Date.now(), shortName: form.shortName.trim(), categoryName: form.categoryName.trim(), noOfProducts: row.noOfProducts ?? 0, active: true });
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Product Category" : "Add Product Category"}</h2>
          <p>Manage short names and full category names used across the platform.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Short Name</span>
          <input autoFocus value={form.shortName} onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))} placeholder="e.g. ANTI-ALLERGY" />
        </label>
        <label className="field">
          <span>* Category Name</span>
          <input value={form.categoryName} onChange={e => setForm(f => ({ ...f, categoryName: e.target.value }))} placeholder="e.g. ANTI-ALLERGY" />
        </label>
        <button className="button" onClick={save} type="button"><Check size={16} /> Save</button>
      </div>
    </section>
  );
}

// ─── Bulk Edit View ───────────────────────────────────────────────────────────
function BulkEditView({ rows, onSave, onBack }: { rows: CategoryRow[]; onSave: (rows: CategoryRow[]) => void; onBack: () => void }) {
  const [draft, setDraft] = useState(rows.map(r => ({ ...r })));

  function update(id: number, field: "shortName" | "categoryName", val: string) {
    setDraft(d => d.map(r => r.id === id ? { ...r, [field]: val } : r));
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Bulk Operations</p>
          <h2>Bulk Edit — Product Category</h2>
          <p>Edit all category short names and display names in one go.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>S.No</th><th>Short Name</th><th>Category Name</th></tr>
          </thead>
          <tbody>
            {draft.map((row, i) => (
              <tr key={row.id}>
                <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                <td><input className="subdivision-inline-input" style={{ width:"100%" }} value={row.shortName} onChange={e => update(row.id, "shortName", e.target.value)} /></td>
                <td><input className="subdivision-inline-input" style={{ width:"100%" }} value={row.categoryName} onChange={e => update(row.id, "categoryName", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:"20px" }}>
        <button className="button" onClick={() => onSave(draft)} type="button"><Check size={16} /> Update</button>
      </div>
    </section>
  );
}

// ─── Serial Number Generation View ───────────────────────────────────────────
function SerialNoGenView({ rows, onSave, onBack }: { rows: CategoryRow[]; onSave: (newOrder: CategoryRow[]) => void; onBack: () => void }) {
  const [newNos, setNewNos] = useState<Record<number, string>>({});
  const [generated, setGenerated] = useState(false);

  function generate() {
    const auto: Record<number, string> = {};
    rows.forEach((r, i) => { auto[r.id] = String(i + 1); });
    setNewNos(auto);
    setGenerated(true);
  }

  function clear() { setNewNos({}); setGenerated(false); }

  function save() {
    const pairs = rows.map(r => ({ row: r, newNo: parseInt(newNos[r.id] ?? "0", 10) || 0 }));
    const sorted = [...pairs].sort((a, b) => a.newNo - b.newNo);
    onSave(sorted.map(p => p.row));
    onBack();
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Product Category — Serial No Generation</h2>
          <p>Assign new serial numbers to reorder the category list.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>Short Name</th><th>Category Name</th><th>Existing S.No</th><th>New S.No</th></tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td style={{ fontWeight:600, color:"var(--ink)" }}>{row.shortName}</td>
                <td style={{ color:"var(--muted)" }}>{row.categoryName}</td>
                <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                <td>
                  <input
                    className="subdivision-inline-input"
                    style={{ width:"64px" }}
                    value={newNos[row.id] ?? ""}
                    onChange={e => setNewNos(n => ({ ...n, [row.id]: e.target.value }))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:"20px", display:"flex", gap:"10px" }}>
        {!generated
          ? <button className="button" onClick={generate} type="button"><RefreshCw size={16} /> Generate - Sl No</button>
          : <button className="button" onClick={save} type="button"><Check size={16} /> Save</button>
        }
        <button className="button button-secondary" onClick={clear} type="button"><X size={16} /> Clear</button>
      </div>
    </section>
  );
}

// ─── Reactivation View ────────────────────────────────────────────────────────
function ReactivationView({ inactive, onReactivate, onBack }: { inactive: CategoryRow[]; onReactivate: (id: number) => void; onBack: () => void }) {
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Product Category Reactivation</h2>
          <p>Restore previously deactivated product categories.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      {inactive.length === 0 ? (
        <div className="subdivision-table-card" style={{ textAlign:"center", padding:"48px", color:"var(--muted)" }}>
          <Package size={32} style={{ margin:"0 auto 12px", opacity:0.4 }} />
          <p style={{ margin:0, fontWeight:600 }}>No Records Found</p>
          <p style={{ margin:"4px 0 0", fontSize:"13px" }}>All product categories are currently active.</p>
        </div>
      ) : (
        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr><th>S.No</th><th>Short Name</th><th>Category Name</th><th>Reactivate</th></tr>
            </thead>
            <tbody>
              {inactive.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                  <td style={{ fontWeight:600 }}>{row.shortName}</td>
                  <td style={{ color:"var(--muted)" }}>{row.categoryName}</td>
                  <td>
                    <button className="button" onClick={() => onReactivate(row.id)} type="button" style={{ padding:"5px 14px", fontSize:"12px" }}>
                      <RefreshCw size={13} /> Reactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeactivateDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--panel)", borderRadius:"16px", padding:"32px 28px", maxWidth:"400px", width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
          <span style={{ background:"#fef2f2", borderRadius:"50%", width:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Trash2 size={20} color="#ef4444" />
          </span>
          <div>
            <h3 style={{ margin:0, fontSize:"17px", fontWeight:700, color:"var(--ink)" }}>Deactivate Category?</h3>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"var(--muted)" }}>This can be reversed via Reactivation.</p>
          </div>
        </div>
        <p style={{ fontSize:"14px", color:"var(--ink)", margin:"0 0 24px", lineHeight:1.6 }}>
          Are you sure you want to deactivate <strong>{name}</strong>?
        </p>
        <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end" }}>
          <button className="button button-secondary" onClick={onCancel} type="button">Cancel</button>
          <button onClick={onConfirm} type="button" style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 18px", borderRadius:"8px", border:"none", background:"#ef4444", color:"#fff", fontWeight:600, fontSize:"14px", cursor:"pointer" }}>
            <Trash2 size={14} /> Yes, Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type View = "list" | "add" | "edit" | "bulkEdit" | "serialNo" | "reactivation";

export function ProductCategoryMaster() {
  const [rows, setRows] = useState(initialRows);
  const [inactive, setInactive] = useState<CategoryRow[]>([]);
  const [view, setView] = useState<View>("list");
  const [editTarget, setEditTarget] = useState<CategoryRow | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<CategoryRow | null>(null);
  const [productModal, setProductModal] = useState<CategoryRow | null>(null);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);
  const [draftRow, setDraftRow] = useState<CategoryRow | null>(null);

  // Inline edit
  function beginInline(row: CategoryRow) { setInlineEditId(row.id); setDraftRow({ ...row }); }
  function cancelInline() { setInlineEditId(null); setDraftRow(null); }
  function saveInline() { if (!draftRow) return; setRows(r => r.map(x => x.id === draftRow.id ? draftRow : x)); cancelInline(); }

  function handleSaveForm(row: CategoryRow) {
    setRows(r => r.some(x => x.id === row.id) ? r.map(x => x.id === row.id ? row : x) : [...r, row]);
    setView("list");
  }

  function handleDeactivate() {
    if (!deactivateTarget) return;
    setInactive(i => [...i, { ...deactivateTarget, active: false }]);
    setRows(r => r.filter(x => x.id !== deactivateTarget.id));
    setDeactivateTarget(null);
  }

  function handleReactivate(id: number) {
    const row = inactive.find(r => r.id === id);
    if (!row) return;
    setRows(r => [...r, { ...row, active: true }]);
    setInactive(i => i.filter(r => r.id !== id));
  }

  if (view === "add") return <CategoryForm row={{}} onSave={handleSaveForm} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <CategoryForm row={editTarget} onSave={handleSaveForm} onBack={() => setView("list")} />;
  if (view === "bulkEdit") return <BulkEditView rows={rows} onSave={r => { setRows(r); setView("list"); }} onBack={() => setView("list")} />;
  if (view === "serialNo") return <SerialNoGenView rows={rows} onSave={r => setRows(r)} onBack={() => setView("list")} />;
  if (view === "reactivation") return <ReactivationView inactive={inactive} onReactivate={handleReactivate} onBack={() => setView("list")} />;

  return (
    <>
      {deactivateTarget && <DeactivateDialog name={deactivateTarget.categoryName} onConfirm={handleDeactivate} onCancel={() => setDeactivateTarget(null)} />}
      {productModal && <ProductModal row={productModal} onClose={() => setProductModal(null)} />}

      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>Product Category</h2>
            <p>Create and manage product categories used across the platform.</p>
          </div>
          <div className="subdivision-actions">
            <button className="button button-secondary" onClick={() => setView("reactivation")} type="button"><RefreshCw size={16} /> Reactivation</button>
            <button className="button button-secondary" onClick={() => setView("serialNo")} type="button"><SlidersHorizontal size={16} /> S.No Gen</button>
            <button className="button button-secondary" onClick={() => setView("bulkEdit")} type="button"><Pencil size={16} /> Bulk Edit</button>
            <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add</button>
          </div>
        </div>

        {/* Stats */}
        <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
          <article><span>Total Categories</span><strong>{rows.length}</strong></article>
          <article><span>Total Products</span><strong>{rows.reduce((s, r) => s + r.noOfProducts, 0)}</strong></article>
          <article><span>Inactive</span><strong>{inactive.length}</strong></article>
        </div>

        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Short Name</th>
                <th>Category Name</th>
                <th>No of Products</th>
                <th>Inline Edit</th>
                <th>Edit</th>
                <th>Deactivate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const editing = inlineEditId === row.id && draftRow;
                return (
                  <tr key={row.id}>
                    <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                    <td>
                      {editing
                        ? <input className="subdivision-inline-input" value={draftRow.shortName} onChange={e => setDraftRow({ ...draftRow, shortName: e.target.value })} />
                        : <strong style={{ color:"var(--ink)" }}>{row.shortName}</strong>
                      }
                    </td>
                    <td>
                      {editing
                        ? <input className="subdivision-inline-input" value={draftRow.categoryName} onChange={e => setDraftRow({ ...draftRow, categoryName: e.target.value })} />
                        : <span style={{ color:"var(--muted)", fontSize:"13px" }}>{row.categoryName}</span>
                      }
                    </td>
                    <td>
                      <button
                        onClick={() => setProductModal(row)}
                        type="button"
                        style={{ background:"#eff6ff", border:"none", borderRadius:"999px", padding:"3px 12px", fontSize:"12px", fontWeight:700, color:"#2563eb", cursor:"pointer" }}
                      >
                        {row.noOfProducts}
                      </button>
                    </td>
                    <td>
                      {editing ? (
                        <span className="subdivision-inline-actions">
                          <button aria-label="Update" onClick={saveInline} title="Update" type="button"><Check size={15} /></button>
                          <button aria-label="Cancel" onClick={cancelInline} title="Cancel" type="button"><X size={15} /></button>
                        </span>
                      ) : (
                        <button className="subdivision-icon-button" onClick={() => beginInline(row)} title="Inline Edit" type="button"><Pencil size={15} /></button>
                      )}
                    </td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} title="Edit" type="button"><Pencil size={15} /></button>
                    </td>
                    <td>
                      <button className="subdivision-danger-button" onClick={() => setDeactivateTarget(row)} title="Deactivate" type="button"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
