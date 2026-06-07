"use client";
import { useState, useEffect, useRef } from "react";
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Settings, Package, Tag, ArrowLeft, Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

type Product = { id: string; name: string; brand: string; compatibleModels: string[]; category: string; salePrice: number; wholesaleCost: number; description: string; longDescription: string; images: string[]; stock: number; rating: number; reviewCount: number; tags: string[]; frequentlyBoughtWith: string[]; isBestseller?: boolean; isNew?: boolean; };
type BrandInfo = { id: string; name: string; displayName: string; models: string[]; color: string; gradient: string; logo: string; };
type StoreSettings = { shippingThreshold: number; shippingFee: number; whatsappNumber: string; upiId: string; storeName: string; };
type StoreData = { settings: StoreSettings; brands: BrandInfo[]; products: Product[]; };

const emptyProduct: Product = { id: "", name: "", brand: "", compatibleModels: [], category: "cables", salePrice: 0, wholesaleCost: 0, description: "", longDescription: "", images: [], stock: 100, rating: 4.5, reviewCount: 0, tags: [], frequentlyBoughtWith: [], isBestseller: false, isNew: false };
const emptyBrand: BrandInfo = { id: "", name: "", displayName: "", models: [], color: "#00e676", gradient: "from-green-500 to-green-700", logo: "⚡" };

// ── Image Uploader Component ─────────────────────────────────────────
function ImageUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const showMsg = (msg: string) => { setUploadMsg(msg); setTimeout(() => setUploadMsg(""), 4000); };

  // Upload files from device
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.url) newUrls.push(data.url);
        else showMsg(`❌ ${data.error || "Upload failed"}`);
      } catch { showMsg("❌ Network error during upload"); }
    }
    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      showMsg(`✅ ${newUrls.length} image(s) saved to your site!`);
    }
    setUploading(false);
  };

  // Download image from external URL → save to your own server (no hotlinking!)
  const downloadFromUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setDownloading(true);
    showMsg("⏳ Downloading image to your server...");
    try {
      const res = await fetch("/api/upload", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange([...images, data.url]);
        setUrlInput("");
        showMsg("✅ Image downloaded & saved to your site!");
      } else {
        showMsg(`❌ ${data.error || "Download failed"}`);
      }
    } catch { showMsg("❌ Network error"); }
    setDownloading(false);
  };

  const removeImage = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const busy = uploading || downloading;

  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-400 mb-1 font-medium">Product Images</label>

      {/* Current Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <img
                src={img}
                alt={`Product image ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%236B7280' font-size='11'%3ENo image%3C/text%3E%3C/svg%3E"; }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <button onClick={() => removeImage(idx)} className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-all" title="Remove">
                  <X size={14} />
                </button>
              </div>
              {idx === 0 && <span className="absolute top-1 left-1 text-[9px] bg-green-500/80 text-white px-1.5 py-0.5 rounded font-bold">Main</span>}
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${dragOver ? "border-green-400 bg-green-400/10" : "border-white/10 hover:border-white/25"}`}
        style={{ background: dragOver ? undefined : "rgba(255,255,255,0.02)" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !busy && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-6 pointer-events-none">
          {uploading
            ? <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            : <Upload size={22} className="text-gray-500" />}
          <p className="text-sm text-gray-400 font-medium">{uploading ? "Uploading..." : "Click or drag & drop images from your device"}</p>
          <p className="text-xs text-gray-600">JPG, PNG, WEBP up to 5MB • Multiple files supported</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {/* Download from competitor URL → saved to YOUR server */}
      <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(79,158,255,0.06)", border: "1px solid rgba(79,158,255,0.15)" }}>
        <p className="text-xs text-blue-400 font-semibold flex items-center gap-1.5">
          <LinkIcon size={12} /> Paste competitor image URL — we copy it to YOUR server
        </p>
        <p className="text-xs text-gray-500">Image is downloaded and saved to your site. Visitors will load it from <strong className="text-gray-400">your domain</strong>, not the competitor&apos;s.</p>
        <div className="flex gap-2">
          <input
            className="input-dark text-xs flex-1"
            placeholder="https://competitor.com/products/cable-image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); downloadFromUrl(); } }}
            disabled={busy}
          />
          <button
            onClick={downloadFromUrl}
            disabled={!urlInput.trim() || busy}
            className="btn-primary text-xs py-2 px-4 disabled:opacity-40 flex-shrink-0"
          >
            {downloading
              ? <><div className="w-3 h-3 border border-black/40 border-t-transparent rounded-full animate-spin" /> Saving...</>
              : <><ImageIcon size={13} /> Download & Save</>}
          </button>
        </div>
      </div>

      {uploadMsg && (
        <p className="text-xs font-medium px-1" style={{ color: uploadMsg.startsWith("✅") ? "#4ade80" : uploadMsg.startsWith("⏳") ? "#60a5fa" : "#f87171" }}>
          {uploadMsg}
        </p>
      )}
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────────
export default function AdminPage() {
  const [data, setData] = useState<StoreData | null>(null);
  const [tab, setTab] = useState<"products" | "brands" | "settings">("products");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  useEffect(() => { fetch("/api/admin").then(r => r.json()).then(setData).catch(() => setMsg("Failed to load data")); }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true); setMsg("");
    try {
      const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) setMsg("✅ Saved successfully!");
      else setMsg("❌ Save failed");
    } catch { setMsg("❌ Network error"); }
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" /></div>;

  const updateProduct = (idx: number, field: string, value: unknown) => {
    const p = [...data.products]; (p[idx] as Record<string, unknown>)[field] = value; setData({ ...data, products: p });
  };
  const addProduct = () => { const p = { ...emptyProduct, id: `new-${Date.now()}` }; setData({ ...data, products: [...data.products, p] }); setExpandedProduct(p.id); };
  const deleteProduct = (idx: number) => { const p = [...data.products]; p.splice(idx, 1); setData({ ...data, products: p }); };
  const updateBrand = (idx: number, field: string, value: unknown) => { const b = [...data.brands]; (b[idx] as Record<string, unknown>)[field] = value; setData({ ...data, brands: b }); };
  const addBrand = () => { const b = { ...emptyBrand, id: `brand-${Date.now()}` }; setData({ ...data, brands: [...data.brands, b] }); setExpandedBrand(b.id); };
  const deleteBrand = (idx: number) => { const b = [...data.brands]; b.splice(idx, 1); setData({ ...data, brands: b }); };
  const updateSettings = (field: string, value: unknown) => { setData({ ...data, settings: { ...data.settings, [field]: value } }); };

  const inputCls = "input-dark text-sm";
  const labelCls = "block text-xs text-gray-400 mb-1 font-medium";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-xl glass-light flex items-center justify-center hover:bg-white/10 transition-all"><ArrowLeft size={16} /></Link>
          <div>
            <h1 className="section-heading text-2xl text-white">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Edit products, brands & store settings locally</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm font-medium">{msg}</span>}
          <button onClick={save} disabled={saving} className="btn-primary px-6" id="save-all-btn">
            <Save size={16} /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([["products", Package, `Products (${data.products.length})`], ["brands", Tag, `Brands (${data.brands.length})`], ["settings", Settings, "Store Settings"]] as const).map(([t, Icon, label]) => (
          <button key={t} onClick={() => setTab(t as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? "bg-green-400/15 text-green-400 border border-green-400/30" : "glass-light text-gray-400 hover:text-white"}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <div className="space-y-3">
          <button onClick={addProduct} className="btn-secondary text-sm w-full py-3" id="add-product-btn"><Plus size={16} /> Add New Product</button>
          {data.products.map((p, i) => {
            const isOpen = expandedProduct === p.id;
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                {/* Collapsed header row */}
                <button onClick={() => setExpandedProduct(isOpen ? null : p.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.images[0]
                      ? <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10" />
                      : <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-secondary)" }}><ImageIcon size={18} className="text-gray-600" /></div>
                    }
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{p.name || "Untitled Product"}</p>
                      <p className="text-xs text-gray-500">{p.brand} • ₹{p.salePrice} • Stock: {p.stock}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p.isBestseller && <span className="badge badge-orange text-[9px]">Bestseller</span>}
                    {p.isNew && <span className="badge badge-green text-[9px]">New</span>}
                    {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  </div>
                </button>

                {/* Expanded editor */}
                {isOpen && (
                  <div className="px-4 pb-5 space-y-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                      <div><label className={labelCls}>Product ID (URL slug)</label><input className={inputCls} value={p.id} onChange={e => updateProduct(i, "id", e.target.value)} placeholder="e.g. ola-brake-cable" /></div>
                      <div className="col-span-2 sm:col-span-1"><label className={labelCls}>Product Name</label><input className={inputCls} value={p.name} onChange={e => updateProduct(i, "name", e.target.value)} /></div>
                      <div><label className={labelCls}>Brand</label>
                        <select className={inputCls} value={p.brand} onChange={e => updateProduct(i, "brand", e.target.value)}>
                          <option value="">Select brand</option>
                          {data.brands.map(b => <option key={b.id} value={b.id}>{b.displayName}</option>)}
                        </select>
                      </div>
                      <div><label className={labelCls}>Category</label>
                        <select className={inputCls} value={p.category} onChange={e => updateProduct(i, "category", e.target.value)}>
                          {["cables", "protection", "comfort", "guards"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div><label className={labelCls}>Sale Price (₹)</label><input type="number" className={inputCls} value={p.salePrice} onChange={e => updateProduct(i, "salePrice", +e.target.value)} /></div>
                      <div><label className={labelCls}>Wholesale Cost (₹) 🔒</label><input type="number" className={inputCls} value={p.wholesaleCost} onChange={e => updateProduct(i, "wholesaleCost", +e.target.value)} /></div>
                      <div><label className={labelCls}>Stock (units)</label><input type="number" className={inputCls} value={p.stock} onChange={e => updateProduct(i, "stock", +e.target.value)} /></div>
                      <div><label className={labelCls}>Rating (1–5)</label><input type="number" step="0.1" min="1" max="5" className={inputCls} value={p.rating} onChange={e => updateProduct(i, "rating", +e.target.value)} /></div>
                      <div><label className={labelCls}>Review Count</label><input type="number" className={inputCls} value={p.reviewCount} onChange={e => updateProduct(i, "reviewCount", +e.target.value)} /></div>
                    </div>

                    <div><label className={labelCls}>Short Description</label><input className={inputCls} value={p.description} onChange={e => updateProduct(i, "description", e.target.value)} /></div>
                    <div><label className={labelCls}>Long Description</label><textarea rows={3} className={inputCls + " resize-none"} value={p.longDescription} onChange={e => updateProduct(i, "longDescription", e.target.value)} /></div>
                    <div><label className={labelCls}>Compatible Models (comma separated)</label><input className={inputCls} value={p.compatibleModels.join(", ")} onChange={e => updateProduct(i, "compatibleModels", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></div>

                    {/* ── IMAGE UPLOADER ── */}
                    <ImageUploader
                      images={p.images}
                      onChange={(imgs) => updateProduct(i, "images", imgs)}
                    />

                    <div><label className={labelCls}>Tags (comma separated)</label><input className={inputCls} value={p.tags.join(", ")} onChange={e => updateProduct(i, "tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></div>
                    <div><label className={labelCls}>Frequently Bought With (product IDs, comma separated)</label><input className={inputCls} value={p.frequentlyBoughtWith.join(", ")} onChange={e => updateProduct(i, "frequentlyBoughtWith", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></div>
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={!!p.isBestseller} onChange={e => updateProduct(i, "isBestseller", e.target.checked)} className="accent-green-400" /> Bestseller</label>
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={!!p.isNew} onChange={e => updateProduct(i, "isNew", e.target.checked)} className="accent-green-400" /> New Arrival</label>
                    </div>
                    <button onClick={() => deleteProduct(i)} className="btn-secondary text-sm text-red-400 border-red-500/20 hover:border-red-500/40 w-full"><Trash2 size={14} /> Delete This Product</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── BRANDS TAB ── */}
      {tab === "brands" && (
        <div className="space-y-3">
          <button onClick={addBrand} className="btn-secondary text-sm w-full py-3" id="add-brand-btn"><Plus size={16} /> Add New Brand</button>
          {data.brands.map((b, i) => {
            const isOpen = expandedBrand === b.id;
            return (
              <div key={b.id} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <button onClick={() => setExpandedBrand(isOpen ? null : b.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${b.color}20`, border: `1px solid ${b.color}40` }}>
                      <BrandLogo logo={b.logo} className="w-5 h-5" color={b.color} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{b.displayName || "Untitled Brand"}</p>
                      <p className="text-xs text-gray-500">{b.models.length} models • ID: {b.id}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                      <div><label className={labelCls}>Brand ID (slug)</label><input className={inputCls} value={b.id} onChange={e => updateBrand(i, "id", e.target.value)} /></div>
                      <div><label className={labelCls}>Display Name</label><input className={inputCls} value={b.displayName} onChange={e => { updateBrand(i, "displayName", e.target.value); updateBrand(i, "name", e.target.value); }} /></div>
                      <div><label className={labelCls}>Logo (emoji or SVG)</label><input className={inputCls} value={b.logo} onChange={e => updateBrand(i, "logo", e.target.value)} /></div>
                      <div><label className={labelCls}>Brand Color (hex)</label><input type="color" className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" value={b.color} onChange={e => updateBrand(i, "color", e.target.value)} /></div>
                      <div className="col-span-2"><label className={labelCls}>Models (comma separated)</label><input className={inputCls} value={b.models.join(", ")} onChange={e => updateBrand(i, "models", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></div>
                    </div>
                    <button onClick={() => deleteBrand(i)} className="btn-secondary text-sm text-red-400 border-red-500/20 hover:border-red-500/40 w-full"><Trash2 size={14} /> Delete This Brand</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {tab === "settings" && (
        <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="font-bold text-white section-heading text-lg">Store Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Store Name</label><input className={inputCls} value={data.settings.storeName} onChange={e => updateSettings("storeName", e.target.value)} /></div>
            <div><label className={labelCls}>WhatsApp Number (with country code, no +)</label><input className={inputCls} value={data.settings.whatsappNumber} onChange={e => updateSettings("whatsappNumber", e.target.value)} placeholder="919876543210" /></div>
            <div><label className={labelCls}>UPI ID (VPA)</label><input className={inputCls} value={data.settings.upiId} onChange={e => updateSettings("upiId", e.target.value)} placeholder="yourname@upi" /></div>
            <div><label className={labelCls}>Free Shipping Threshold (₹)</label><input type="number" className={inputCls} value={data.settings.shippingThreshold} onChange={e => updateSettings("shippingThreshold", +e.target.value)} /></div>
            <div><label className={labelCls}>Shipping Fee Below Threshold (₹)</label><input type="number" className={inputCls} value={data.settings.shippingFee} onChange={e => updateSettings("shippingFee", +e.target.value)} /></div>
          </div>
          <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(79,158,255,0.08)", border: "1px solid rgba(79,158,255,0.2)" }}>
            <p className="text-blue-400 font-semibold mb-2">ℹ️ How Image Upload Works</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
              <li>Go to <strong className="text-white">Products tab</strong> → expand any product → scroll to <strong className="text-white">Product Images</strong></li>
              <li>Click the upload zone or drag &amp; drop image files (JPG, PNG, WEBP)</li>
              <li>Images are saved to <code className="text-blue-300">public/products/</code> on your machine</li>
              <li>After uploading, click <strong className="text-white">Save All Changes</strong> to update the store</li>
              <li>Before deploying to Vercel, commit the new images in <code className="text-blue-300">public/products/</code> to GitHub</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(0,230,118,0.06)", border: "1px solid rgba(0,230,118,0.2)" }}>
            <p className="text-green-400 font-semibold mb-2">🚀 Deployment Checklist</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
              <li>Changes saved to <code className="text-green-300">src/data/data.json</code> on your machine</li>
              <li>Run <code className="text-green-300">npm run dev</code> to preview changes locally</li>
              <li>Push to GitHub → Vercel auto-deploys (free)</li>
              <li>This admin panel only works locally — Vercel filesystem is read-only</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
