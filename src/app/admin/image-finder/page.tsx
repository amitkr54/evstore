"use client";

import { useState, useCallback } from "react";

const PRODUCTS = [{"id":"ola-charger_gun_cap__port_cover-5","name":"Charger Gun Cap / Port Cover","brand":"ola","images":[]},{"id":"ola-crash-guard","name":"Front & Rear Crash Guard + Foldable Footrest + Backrest","brand":"ola","images":[]},{"id":"ola-screen-guard","name":"Tempered Glass Screen Guard (9H Full Cover)","brand":"ola","images":[]},{"id":"ola-tempered_glass_screen_guard_s1x-1","name":"Tempered Glass Screen Guard (S1X / S1X+)","brand":"ola","images":[]},{"id":"ola-charger_socket_cap_premium_tpu_te-4","name":"Charger Socket Cap (Premium TPU, Textured)","brand":"ola","images":[]},{"id":"ola-crash_guard__foldable_footrest_s1-8","name":"Crash Guard + Foldable Footrest (S1X Gen 3)","brand":"ola","images":[]},{"id":"ola-cable-combo","name":"3-Piece Cable Combo — Front & Rear Brake + Accelerator","brand":"ola","images":[]},{"id":"ola-padded_pillion_backrest-12","name":"Padded Pillion Backrest","brand":"ola","images":[]},{"id":"ola-tpu_charger_socket_dust_cap_dustpr-3","name":"TPU Charger Socket Dust Cap (Dustproof + Waterproof)","brand":"ola","images":[]},{"id":"ola-floor_mat__3d_anti-slip_foot_mat-11","name":"Floor Mat / 3D Anti-Slip Foot Mat","brand":"ola","images":[]},{"id":"ola-nano_glass_impossible_fiber_screen-2","name":"Nano Glass Impossible Fiber Screen Guard","brand":"ola","images":[]},{"id":"ola-number_plate_frame__holder-16","name":"Number Plate Frame / Holder","brand":"ola","images":[]},{"id":"ola-ladies__pillion_footrest_heavy_du-13","name":"Ladies / Pillion Footrest (Heavy Duty Iron Rod)","brand":"ola","images":[]},{"id":"ola-mobile_holder_with_usb_charging_ha-15","name":"Mobile Holder with USB Charging (Handlebar)","brand":"ola","images":[]},{"id":"ola-premium_seat_cover__boot_mat_combo-14","name":"Premium Seat Cover + Boot Mat Combo","brand":"ola","images":[]},{"id":"ola-drive_belt__powertrain_belt_oem_c-18","name":"Drive Belt / Powertrain Belt (OEM Compatible)","brand":"ola","images":[]},{"id":"ola-wall_mount_charger_holder_with_lock-6","name":"Wall Mount Charger Holder with Lock & Key","brand":"ola","images":[]},{"id":"ola-rear_shock_absorber_suspension-19","name":"Rear Shock Absorber (Suspension)","brand":"ola","images":[]},{"id":"ola-all-in-one_combo_kit_guard_footres-9","name":"All-In-One Combo Kit (Guard+Footrest+Backrest+Mat)","brand":"ola","images":[]},{"id":"ola-full_body_waterproof_scooter_cover-17","name":"Full Body Waterproof Scooter Cover (UV+Dustproof)","brand":"ola","images":[]},{"id":"tvs-stainless_steel_safety_guard_full_s-3","name":"Stainless Steel Safety Guard Full Set + Foldable Footrest","brand":"tvs","images":[]},{"id":"tvs-9h_tempered_glass_screen_guard_6-i-0","name":"9H Tempered Glass Screen Guard (6-inch TFT)","brand":"tvs","images":[]},{"id":"tvs-nano_glass_speedometer_screen_guard-1","name":"Nano Glass Speedometer Screen Guard","brand":"tvs","images":[]},{"id":"tvs-number_plate_frame_ss_chrome-14","name":"Number Plate Frame (SS Chrome)","brand":"tvs","images":[]},{"id":"tvs-crash_guard__foldable_footrest__m-4","name":"Crash Guard + Foldable Footrest + Mud Guard Combo","brand":"tvs","images":[]},{"id":"tvs-anti-fingerprint_touch_screen_prote-2","name":"Anti-Fingerprint Touch Screen Protector (7-inch)","brand":"tvs","images":[]},{"id":"tvs-premium_seat_cover_narrow_stitch-8","name":"Premium Seat Cover (Narrow Stitch)","brand":"tvs","images":[]},{"id":"tvs-footrest","name":"Ladies / Pillion Footrest (Heavy Duty SS)","brand":"tvs","images":[]},{"id":"tvs-ev_charger_safety_box_wall_mount-7","name":"EV Charger Safety Box Wall Mount + Lock","brand":"tvs","images":[]},{"id":"tvs-mobile_holder_with_usb_charging_ha-11","name":"Mobile Holder with USB Charging (Handlebar)","brand":"tvs","images":[]},{"id":"tvs-3d_anti-slip_floor_mat-9","name":"3D Anti-Slip Floor Mat","brand":"tvs","images":[]},{"id":"tvs-full_body_waterproof_scooter_cover-12","name":"Full Body Waterproof Scooter Cover (UV+Dustproof)","brand":"tvs","images":[]},{"id":"tvs-padded_pillion_backrest-10","name":"Padded Pillion Backrest","brand":"tvs","images":[]},{"id":"tvs-helmet_lock_with_steel_cable-13","name":"Helmet Lock with Steel Cable","brand":"tvs","images":[]},{"id":"tvs-middle_guard__front_mudguard__rea-5","name":"Middle Guard + Front Mudguard + Rear Guard + Footrest","brand":"tvs","images":[]},{"id":"tvs-floormat-combo","name":"7D Floor Mat + Charging Cap Cover","brand":"tvs","images":[]},{"id":"ather-screen-guard","name":"TFT Screen Guard (9H Full Cover) – 450X / 450S","brand":"ather","images":[]},{"id":"ather-screen_protector_2-pack_–_gen_3_20-1","name":"Screen Protector 2-Pack – Gen 3 (2022–2025)","brand":"ather","images":[]},{"id":"ather-3d_anti-slip_floor_mat-7","name":"3D Anti-Slip Floor Mat","brand":"ather","images":[]},{"id":"ather-screen_guard_for_ather_rizta_7-inc-2","name":"Screen Guard for Ather Rizta (7-inch TFT)","brand":"ather","images":[]},{"id":"ather-seat-cover","name":"Premium Seat Cover + Boot Mat","brand":"ather","images":[]},{"id":"ather-front_&_rear_crash_guard__foldable-3","name":"Front & Rear Crash Guard + Foldable Footrest","brand":"ather","images":[]},{"id":"ather-ladies__pillion_footrest_iron_rod-8","name":"Ladies / Pillion Footrest (Iron Rod Heavy Duty)","brand":"ather","images":[]},{"id":"ather-rizta_crash_guard__foldable_footre-5","name":"Rizta Crash Guard + Foldable Footrest Combo","brand":"ather","images":[]},{"id":"ather-padded_pillion_backrest-9","name":"Padded Pillion Backrest","brand":"ather","images":[]},{"id":"ather-mobile_holder_with_usb_charging_ha-12","name":"Mobile Holder with USB Charging (Handlebar)","brand":"ather","images":[]},{"id":"ather-handle_bar_anti-slip_grip_cover-10","name":"Handle Bar Anti-Slip Grip Cover","brand":"ather","images":[]},{"id":"ather-full_body_waterproof_scooter_cover-11","name":"Full Body Waterproof Scooter Cover","brand":"ather","images":[]},{"id":"ather-side_stand_anti-sink_plate-13","name":"Side Stand Anti-Sink Plate","brand":"ather","images":[]},{"id":"ather-4-in-1_combo_kit_footrest_floor_ma-14","name":"4-in-1 Combo Kit (Footrest+Floor Mat+Seat Cover+Screen Guard)","brand":"ather","images":[]},{"id":"ather-stainless_steel_safety_guard_kit_m-4","name":"Stainless Steel Safety Guard Kit (Middle+Front+Rear+Footrest)","brand":"ather","images":[]},{"id":"bajaj-genuine_leather_keychain_chetak_lo-6","name":"Genuine Leather Keychain (Chetak Logo)","brand":"bajaj","images":[]},{"id":"bajaj-9h_speedometer_screen_guard_cluste-0","name":"9H Speedometer Screen Guard (Cluster Protector)","brand":"bajaj","images":[]},{"id":"bajaj-crash-guard","name":"Full-Body Stainless Steel Guard","brand":"bajaj","images":[]},{"id":"bajaj-number_plate_frame_ss_chrome-14","name":"Number Plate Frame (SS Chrome)","brand":"bajaj","images":[]},{"id":"bajaj-footrest","name":"Chetak Integrated Ladies Step","brand":"bajaj","images":[]},{"id":"bajaj-full_tft_screen_protector_anti-scr-1","name":"Full TFT Screen Protector (Anti-Scratch, HD Clear)","brand":"bajaj","images":[]},{"id":"bajaj-premium_seat_cover_waterproof_cush-7","name":"Premium Seat Cover (Waterproof Cushioned)","brand":"bajaj","images":[]},{"id":"bajaj-stainless_steel_foldable_footrest-5","name":"Stainless Steel Foldable Footrest (Standalone)","brand":"bajaj","images":[]},{"id":"bajaj-full_body_waterproof_scooter_cover-12","name":"Full Body Waterproof Scooter Cover","brand":"bajaj","images":[]},{"id":"bajaj-7d_anti-slip_floor_mat_water-resis-8","name":"7D Anti-Slip Floor Mat (Water-Resistant)","brand":"bajaj","images":[]},{"id":"bajaj-padded_pillion_backrest-10","name":"Padded Pillion Backrest","brand":"bajaj","images":[]},{"id":"bajaj-chrome_styling_kit_mirror__badge-13","name":"Chrome Styling Kit (Mirror + Badge Trim)","brand":"bajaj","images":[]},{"id":"bajaj-front_luggage_bag__handlebar_bag-11","name":"Front Luggage Bag / Handlebar Bag","brand":"bajaj","images":[]},{"id":"bajaj-black_safety_guard_kit_middle_fron-3","name":"Black Safety Guard Kit (Middle+Front+Rear+Footrest)","brand":"bajaj","images":[]},{"id":"bajaj-steel_safety_guard_full_set_2025-2","name":"Steel Safety Guard Full Set 2025 + Free Floor Mat + Footrest","brand":"bajaj","images":[]},{"id":"hero-tft_screen_guard_7-inch_v2_pro_pl-0","name":"TFT Screen Guard (7-inch, V2 Pro/Plus/Lite)","brand":"hero","images":[]},{"id":"hero-screen_guard_for_vx2_go__vx2_plus-1","name":"Screen Guard for VX2 Go / VX2 Plus (4.3-inch TFT)","brand":"hero","images":[]},{"id":"hero-pu_leather_seat_cover_front__rear-3","name":"PU Leather Seat Cover (Front + Rear, Waterproof)","brand":"hero","images":[]},{"id":"hero-3d_anti-slip_rubber_floor_mat-4","name":"3D Anti-Slip Rubber Floor Mat","brand":"hero","images":[]},{"id":"hero-number_plate_frame_ss_chrome-11","name":"Number Plate Frame (SS Chrome)","brand":"hero","images":[]},{"id":"hero-footmat__screen_guard__footrest_c-2","name":"Footmat + Screen Guard + Footrest Combo 3-in-1","brand":"hero","images":[]},{"id":"hero-mobile_holder_with_usb_charging_ha-9","name":"Mobile Holder with USB Charging (Handlebar)","brand":"hero","images":[]},{"id":"hero-crash_guard_full_body_set_with_fold-5","name":"Crash Guard Full Body Set with Foldable Footrest","brand":"hero","images":[]},{"id":"hero-padded_pillion_backrest-8","name":"Padded Pillion Backrest","brand":"hero","images":[]},{"id":"hero-full_body_waterproof_scooter_cover-10","name":"Full Body Waterproof Scooter Cover","brand":"hero","images":[]},{"id":"hero-chrome_full_body_crash_guard_vx2-6","name":"Chrome Full Body Crash Guard (VX2)","brand":"hero","images":[]},{"id":"hero-helmet_lock_with_steel_cable-12","name":"Helmet Lock with Steel Cable","brand":"hero","images":[]},{"id":"hero-crash_guard_heavy_duty_black_vx2-7","name":"Crash Guard Heavy Duty Black (VX2)","brand":"hero","images":[]},{"id":"ampere-9h_tft_screen_guard_7-inch_nexus_d-0","name":"9H TFT Screen Guard (7-inch Nexus Display)","brand":"ampere","images":[]},{"id":"ampere-nano_scratch_guard_7-inch_cluster-1","name":"Nano Scratch Guard (7-inch cluster)","brand":"ampere","images":[]},{"id":"ampere-pu_leather_seat_cover_waterproof-2","name":"PU Leather Seat Cover (Waterproof)","brand":"ampere","images":[]},{"id":"ampere-3d_anti-slip_floor_mat-3","name":"3D Anti-Slip Floor Mat","brand":"ampere","images":[]},{"id":"ampere-number_plate_frame_chrome_ss-8","name":"Number Plate Frame (Chrome SS)","brand":"ampere","images":[]},{"id":"ampere-crash_guard__foldable_footrest-4","name":"Crash Guard + Foldable Footrest","brand":"ampere","images":[]},{"id":"ampere-mobile_holder_with_usb_charging_ha-5","name":"Mobile Holder with USB Charging (Handlebar)","brand":"ampere","images":[]},{"id":"ampere-full_body_waterproof_scooter_cover-6","name":"Full Body Waterproof Scooter Cover","brand":"ampere","images":[]},{"id":"ampere-padded_pillion_backrest-7","name":"Padded Pillion Backrest","brand":"ampere","images":[]},{"id":"ampere-helmet_lock_with_steel_cable-9","name":"Helmet Lock with Steel Cable","brand":"ampere","images":[]}];

const BRAND_COLORS: Record<string, string> = {
  ola: "#E8272A", tvs: "#0052A5", ather: "#00A651",
  bajaj: "#1F3A8A", hero: "#6D28D9", ampere: "#B45309"
};

const BRAND_LABELS: Record<string, string> = {
  ola: "OLA Electric", tvs: "TVS iQube", ather: "Ather Energy",
  bajaj: "Bajaj Chetak", hero: "Hero Vida", ampere: "Ampere Nexus"
};

export default function App() {
  const [productImages, setProductImages] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    PRODUCTS.forEach(p => { map[p.id] = []; });
    return map;
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoProgress, setAutoProgress] = useState({ done: 0, total: 0 });
  const [filterBrand, setFilterBrand] = useState("all");
  const [customUrl, setCustomUrl] = useState("");
  const [view, setView] = useState("search"); // 'search' | 'review'

  const filteredProducts = filterBrand === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.brand === filterBrand);

  const product = filteredProducts[currentIdx] || PRODUCTS[0];
  const assignedCount = Object.values(productImages).filter(imgs => imgs.length > 0).length;

  const searchImages = useCallback((prod: any) => {
    const query = encodeURIComponent(`${BRAND_LABELS[prod.brand]} ${prod.name} electric scooter accessory india`);
    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, "_blank");
  }, []);

  const selectImage = (url: string) => {
    setProductImages(prev => {
      const current = prev[product.id] || [];
      if (current.includes(url)) return prev;
      return { ...prev, [product.id]: [...current, url] };
    });
  };

  const removeImage = (productId: string, url: string) => {
    setProductImages(prev => ({
      ...prev,
      [productId]: (prev[productId] || []).filter(u => u !== url)
    }));
  };

  const addCustomUrl = () => {
    if (customUrl.startsWith("http") || customUrl.startsWith("/")) {
      selectImage(customUrl);
      setCustomUrl("");
    }
  };

  const exportJSON = () => {
    // Build the instruction text for how to apply this
    const mapping: Record<string, string[]> = {};
    Object.entries(productImages).forEach(([id, imgs]) => {
      if (imgs.length > 0) mapping[id] = imgs;
    });
    const output = JSON.stringify(mapping, null, 2);
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image-mapping.json";
    a.click();
  };

  const brands = ["all", ...Object.keys(BRAND_COLORS)];

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#0a0a0f", minHeight: "100vh", color: "#e8e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .img-card { cursor: pointer; border-radius: 8px; overflow: hidden; border: 2px solid transparent; transition: all 0.15s; background: #111; }
        .img-card:hover { border-color: #555; transform: scale(1.02); }
        .img-card.selected { border-color: #22c55e; box-shadow: 0 0 12px rgba(34,197,94,0.3); }
        .btn { cursor: pointer; border: none; border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 12px; padding: 8px 16px; transition: all 0.15s; }
        .btn:hover { opacity: 0.85; }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .chip { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
        input { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 6px; color: #e8e8f0; padding: 8px 12px; font-family: 'DM Mono', monospace; font-size: 12px; outline: none; }
        input:focus { border-color: #4444aa; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
            EVParts <span style={{ color: "#6366f1" }}>Image Finder</span>
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{assignedCount}/{PRODUCTS.length} products have images</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#666", background: "#111", padding: "6px 12px", borderRadius: 6 }}>
            {autoRunning ? `⚡ Auto: ${autoProgress.done}/${autoProgress.total}` : `${assignedCount} done`}
          </div>
          <button className="btn" onClick={() => setView(view === "search" ? "review" : "search")}
            style={{ background: "#1a1a2e", color: "#aaa" }}>
            {view === "search" ? "📋 Review All" : "🔍 Search"}
          </button>
          <button className="btn" onClick={exportJSON}
            style={{ background: "#14532d", color: "#86efac" }}>
            ⬇ Export JSON
          </button>
        </div>
      </div>

      {view === "search" ? (
        <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>
          {/* Sidebar */}
          <div style={{ width: 260, borderRight: "1px solid #1a1a2e", overflowY: "auto", padding: "12px 8px" }}>
            <div style={{ padding: "0 8px 8px", display: "flex", flexWrap: "wrap", gap: 4 }}>
              {brands.map(b => (
                <span key={b} className="chip"
                  onClick={() => { setFilterBrand(b); setCurrentIdx(0); }}
                  style={{
                    background: filterBrand === b ? (b === "all" ? "#333" : BRAND_COLORS[b] + "33") : "transparent",
                    borderColor: filterBrand === b ? (b === "all" ? "#555" : BRAND_COLORS[b]) : "#222",
                    color: b === "all" ? "#aaa" : BRAND_COLORS[b] || "#aaa"
                  }}>
                  {b === "all" ? "All" : BRAND_LABELS[b]?.split(" ")[0]}
                </span>
              ))}
            </div>
            {filteredProducts.map((p, i) => {
              const imgs = productImages[p.id] || [];
              return (
                <div key={p.id} onClick={() => setCurrentIdx(i)}
                  style={{
                    padding: "8px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 2,
                    background: i === currentIdx ? "#1a1a2e" : "transparent",
                    borderLeft: `3px solid ${i === currentIdx ? BRAND_COLORS[p.brand] : "transparent"}`
                  }}>
                  <div style={{ fontSize: 11, color: BRAND_COLORS[p.brand], marginBottom: 2 }}>
                    {BRAND_LABELS[p.brand]?.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: 12, color: i === currentIdx ? "#e8e8f0" : "#888", lineHeight: 1.3 }}>
                    {p.name.length > 40 ? p.name.slice(0, 40) + "…" : p.name}
                  </div>
                  <div style={{ fontSize: 10, marginTop: 3, color: imgs.length > 0 ? "#22c55e" : "#ef4444" }}>
                    {imgs.length > 0 ? `✓ ${imgs.length} image${imgs.length > 1 ? "s" : ""}` : "○ no images"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ background: BRAND_COLORS[product.brand] + "22", color: BRAND_COLORS[product.brand], padding: "2px 10px", borderRadius: 20, fontSize: 11 }}>
                  {BRAND_LABELS[product.brand]}
                </span>
                <span style={{ fontSize: 11, color: "#444" }}>{product.id}</span>
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{product.name}</h2>

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                <button className="btn" onClick={() => searchImages(product)} disabled={loading}
                  style={{ background: "#ea4335", color: "#fff" }}>
                  🔍 Open Google Images
                </button>
                <input value={customUrl} onChange={e => setCustomUrl(e.target.value)}
                  placeholder="Or paste image URL directly…" style={{ flex: 1 }}
                  onKeyDown={e => e.key === "Enter" && addCustomUrl()} />
                <button className="btn" onClick={addCustomUrl}
                  style={{ background: "#14532d", color: "#86efac" }}>+ Add</button>
              </div>

              {/* Selected images */}
              {(productImages[product.id] || []).length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "#22c55e", marginBottom: 8 }}>✓ SELECTED IMAGES</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {(productImages[product.id] || []).map((url, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={url} alt="" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "2px solid #22c55e" }}
                          onError={e => { e.currentTarget.style.display = "none"; }} />
                        <button onClick={() => removeImage(product.id, url)}
                          style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", border: "none", borderRadius: "50%", width: 20, height: 20, color: "#fff", cursor: "pointer", fontSize: 12, lineHeight: "20px" }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <button className="btn" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                  style={{ background: "#1a1a2e", color: "#666" }}>← Prev</button>
                <span style={{ fontSize: 11, color: "#444", padding: "8px 12px" }}>
                  {currentIdx + 1} / {filteredProducts.length}
                </span>
                <button className="btn" onClick={() => setCurrentIdx(Math.min(filteredProducts.length - 1, currentIdx + 1))}
                  style={{ background: "#1a1a2e", color: "#666" }}>Next →</button>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ textAlign: "center", padding: 40, color: "#333", marginTop: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
              <div>Click "Open Google Images" to find product photos.</div>
              <div style={{ fontSize: 11, marginTop: 8, color: "#2a2a3e" }}>Right click the image, choose "Copy Image Address", and paste it above!</div>
            </div>
          </div>
        </div>
      ) : (
        // Review view
        <div style={{ padding: 24, overflowY: "auto" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18 }}>Review All Products</h2>
            <div style={{ fontSize: 12, color: "#666" }}>{assignedCount}/{PRODUCTS.length} assigned</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {PRODUCTS.map(p => {
              const imgs = productImages[p.id] || [];
              return (
                <div key={p.id} style={{ background: "#111", borderRadius: 10, overflow: "hidden", border: `1px solid ${imgs.length > 0 ? "#1a3a1a" : "#1a1a1a"}` }}
                  onClick={() => { setView("search"); setCurrentIdx(filteredProducts.indexOf(p)); if (filteredProducts.indexOf(p) === -1) { setFilterBrand("all"); setCurrentIdx(PRODUCTS.indexOf(p)); } }}>
                  <div style={{ height: 100, background: "#0a0a0f", position: "relative", overflow: "hidden" }}>
                    {imgs.length > 0
                      ? <img src={imgs[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; }} />
                      : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#222", fontSize: 24 }}>📦</div>
                    }
                    {imgs.length > 0 && <div style={{ position: "absolute", top: 6, right: 6, background: "#22c55e", color: "#000", borderRadius: 10, padding: "2px 6px", fontSize: 10 }}>✓ {imgs.length}</div>}
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 10, color: BRAND_COLORS[p.brand], marginBottom: 3 }}>{BRAND_LABELS[p.brand]?.split(" ")[0]}</div>
                    <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.3 }}>{p.name.length > 45 ? p.name.slice(0, 45) + "…" : p.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
