import { useState, useEffect, useMemo, useCallback } from "react";

// ==================== STORAGE HELPERS ====================
const STORAGE_KEYS = {
  products: "erp_products",
  clients: "erp_clients",
  orders: "erp_orders",
  materials: "erp_materials",
  prints: "erp_prints",
  settings: "erp_settings",
};

const loadData = async (key, fallback) => {
  try {
    const result = await window.storage.get(key);
    return result ? JSON.parse(result.value) : fallback;
  } catch { return fallback; }
};

const saveData = async (key, data) => {
  try {
    await window.storage.set(key, JSON.stringify(data));
  } catch (e) { console.error("Storage error:", e); }
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ==================== DEFAULT DATA ====================
const PRODUCT_CATEGORIES = [
  "Vasos & Planters", "Organização", "Iluminação & Litofanias",
  "Personalizados", "Fidgets & Brinquedos", "Acessórios Tech", "Cozinha", "Outro"
];

const LICENSE_TYPES = ["Gratuita", "MakerWorld Membership", "Patreon", "Site Externo", "Design Próprio", "Outro"];

const DEFAULT_PRODUCTS = [
  // === LUMA 3D — Designs Próprios ===
  { id: uid(), name: "Vaso Saco (Cloth Planter)", category: "Vasos & Planters", costMaterial: 1.80, printTimeH: 3, price: 22, filament: "PLA", weightG: 90, active: true,
    source: "", notes: "Design próprio LUMA 3D. PLA matte taupe. Parece cerâmica artesanal.",
    license: "Design Próprio", licenseCost: 0, designer: "LUMA 3D" },
  { id: uid(), name: "Vaso Pedra com Prato", category: "Vasos & Planters", costMaterial: 2.20, printTimeH: 4.5, price: 25, filament: "PLA", weightG: 130, active: true,
    source: "", notes: "Design próprio LUMA 3D. PLA speckled marble. Set 2 peças.",
    license: "Design Próprio", licenseCost: 0, designer: "LUMA 3D" },
  { id: uid(), name: "Vaso Canelado com Pernas", category: "Vasos & Planters", costMaterial: 2.50, printTimeH: 5, price: 28, filament: "PLA", weightG: 150, active: true,
    source: "", notes: "Design próprio LUMA 3D. Two-tone preto+dourado. Mid-century modern.",
    license: "Design Próprio", licenseCost: 0, designer: "LUMA 3D" },

  // === TOP 10 MakerWorld — Com Licença Comercial ===
  // #1 Inflated Soft Cloth Planter
  { id: uid(), name: "Inflated Cloth Planter (HpInvent)", category: "Vasos & Planters", costMaterial: 1.80, printTimeH: 3, price: 24, filament: "PLA", weightG: 90, active: true,
    source: "makerworld.com/en/models/452212", notes: "15.9k downloads, 6.5k boosts. Várias séries. PLA matte recomendado.",
    license: "Patreon", licenseCost: 5, designer: "HpInvent" },
  // #2 Planter with Legs
  { id: uid(), name: "Planter with Legs (SabreDesign)", category: "Vasos & Planters", costMaterial: 2.20, printTimeH: 5, price: 26, filament: "PLA", weightG: 120, active: true,
    source: "makerworld.com/en/collections/1776679", notes: "29.4k downloads. #1 planters MakerWorld. Patreon inclui todos os modelos SabreDesign.",
    license: "Patreon", licenseCost: 8, designer: "SabreDesign" },
  // #3 Japandi Vases
  { id: uid(), name: "Japandi Vases (SabreDesign)", category: "Vasos & Planters", costMaterial: 2.80, printTimeH: 6, price: 30, filament: "PLA", weightG: 160, active: true,
    source: "makerworld.com/en/models/964016", notes: "Japandi trend. Woodfill PLA fica incrível. 2 tamanhos. Licença incluída no Patreon SabreDesign.",
    license: "Patreon", licenseCost: 0, designer: "SabreDesign (incluído)" },
  // #4 Mesh Planter — LICENÇA GRATUITA
  { id: uid(), name: "Mesh Planter (Licença GRATUITA)", category: "Vasos & Planters", costMaterial: 1.40, printTimeH: 2.5, price: 18, filament: "PLA", weightG: 65, active: true,
    source: "makerworld.com/en/models/1576430", notes: "LICENÇA COMERCIAL GRATUITA. Zero risco. Textura mesh/rede. Ideal para suculentas.",
    license: "Gratuita", licenseCost: 0, designer: "Ver MakerWorld" },
  // #5 SFERA Organic Planters
  { id: uid(), name: "SFERA Organic Planters (Ikigaiform)", category: "Vasos & Planters", costMaterial: 2.20, printTimeH: 4.5, price: 28, filament: "PLA", weightG: 120, active: true,
    source: "makerworld.com/en/models/2472867", notes: "Design algorítmico Rhino+Grasshopper. Self-watering insert. Escultural. Várias variações.",
    license: "MakerWorld Membership", licenseCost: 8, designer: "Ikigaiform" },
  // #6 Japandi Wabi-Sabi Self-Watering
  { id: uid(), name: "Wabi-Sabi Self-Watering (Ikigaiform)", category: "Vasos & Planters", costMaterial: 1.80, printTimeH: 3.5, price: 25, filament: "PLA", weightG: 90, active: true,
    source: "makerworld.com/en/models/2352787", notes: "Self-watering = USP forte. 4 tamanhos. Ideal bonsai. Licença incluída membership Ikigaiform.",
    license: "MakerWorld Membership", licenseCost: 0, designer: "Ikigaiform (incluído)" },
  // #7 Geometric Origami Pot
  { id: uid(), name: "Geometric Origami Pot (SASSy)", category: "Vasos & Planters", costMaterial: 1.20, printTimeH: 2, price: 18, filament: "PLA", weightG: 60, active: true,
    source: "makerworld.com/en/models/417924", notes: "Vase mode = ultra rápido. Coleção 30+ modelos na mesma licença SASSy.",
    license: "MakerWorld Membership", licenseCost: 5, designer: "SASSy Design" },
  // #8 Parametric Self-Watering Planter
  { id: uid(), name: "Self-Watering c/ Indicador (Collecticraft)", category: "Vasos & Planters", costMaterial: 2.00, printTimeH: 4, price: 25, filament: "PLA", weightG: 100, active: true,
    source: "makerworld.com/en/models/1999811", notes: "Indicador flutuante de nível de água. Paramétrico (MakerLab). USP fortíssimo.",
    license: "Site Externo", licenseCost: 7, designer: "Collecticraft (cubee3d.com)" },
  // #9 Dino Vase / Dragon Planter
  { id: uid(), name: "Dino Vase / Dragon Planter (VASEE)", category: "Vasos & Planters", costMaterial: 1.60, printTimeH: 2.5, price: 20, filament: "PLA", weightG: 80, active: true,
    source: "makerworld.com/en/models/1153561", notes: "Vasos figurativos temáticos. Vendem muito como presentes. Novos modelos diários.",
    license: "Patreon", licenseCost: 4, designer: "VASEE" },
  // #10 Bamboo Plant Pot
  { id: uid(), name: "Bamboo Plant Pot (SASSy)", category: "Vasos & Planters", costMaterial: 1.10, printTimeH: 1.5, price: 15, filament: "PLA", weightG: 55, active: true,
    source: "makerworld.com/en/collections/998917", notes: "Textura bamboo realista. Vase mode = produção rápida. Incluído na licença SASSy.",
    license: "MakerWorld Membership", licenseCost: 0, designer: "SASSy Design (incluído)" },

  // === Outros produtos do catálogo original ===
  { id: uid(), name: "Dragão Articulado Flexi", category: "Fidgets & Brinquedos", costMaterial: 1.80, printTimeH: 3.5, price: 14, filament: "PLA", weightG: 80, active: true,
    source: "makerworld.com/en/models/769341", notes: "Print-in-place. Sem suportes. Cores vivas vendem melhor.",
    license: "Outro", licenseCost: 0, designer: "Verificar licença" },
  { id: uid(), name: "Mini Flexi Axolotl", category: "Fidgets & Brinquedos", costMaterial: 0.80, printTimeH: 1.5, price: 8, filament: "PLA", weightG: 35, active: true,
    source: "makerworld.com/en/models/2326468", notes: "Print-in-place. Ótimo para volume e feiras.",
    license: "Outro", licenseCost: 0, designer: "CritterCRAFT — verificar membership" },
  { id: uid(), name: "Litofania Light Box Personalizada", category: "Iluminação & Litofanias", costMaterial: 3.00, printTimeH: 6, price: 35, filament: "PLA", weightG: 150, active: true,
    source: "makerworld.com/en/collections/1610558", notes: "Cliente envia foto. MakerLab lithophane tool. Kit LED ~3€.",
    license: "Design Próprio", licenseCost: 0, designer: "MakerLab (ferramenta gratuita)" },
  { id: uid(), name: "Light Box Nome LED Personalizado", category: "Iluminação & Litofanias", costMaterial: 3.50, printTimeH: 5, price: 32, filament: "PLA", weightG: 140, active: true,
    source: "makerworld.com/en/models/376274", notes: "Alfabeto completo. LED strip ~2€. Ideal presentes.",
    license: "Patreon", licenseCost: 5, designer: "Infinite Ideas 3D" },
  { id: uid(), name: "Organizador Secretária Modular", category: "Organização", costMaterial: 1.80, printTimeH: 5, price: 20, filament: "PLA", weightG: 110, active: true,
    source: "makerworld.com/en/models/985463", notes: "Snap modular. Vender como kit 3-5 peças.",
    license: "Outro", licenseCost: 0, designer: "Verificar licença" },
  { id: uid(), name: "Cookie Cutters Temáticos (Set 5)", category: "Cozinha", costMaterial: 0.50, printTimeH: 1, price: 12, filament: "PLA", weightG: 25, active: true,
    source: "makerworld.com/en (cookie cutters)", notes: "Ultra rápido. Sets temáticos: Natal, Páscoa, animais.",
    license: "Design Próprio", licenseCost: 0, designer: "MakerLab (ferramenta gratuita)" },
  { id: uid(), name: "Nome 3D Personalizado", category: "Personalizados", costMaterial: 2.00, printTimeH: 4, price: 28, filament: "PLA", weightG: 90, active: true,
    source: "MakerLab - Make My Sign", notes: "MakerLab Sign tool. Tipografia moderna.",
    license: "Design Próprio", licenseCost: 0, designer: "MakerLab (ferramenta gratuita)" },
];

const DEFAULT_MATERIALS = [
  { id: uid(), name: "PLA Branco", type: "PLA", color: "#FFFFFF", weightG: 1000, costPerKg: 20, stock: 2, supplier: "Bambu Lab" },
  { id: uid(), name: "PLA Preto", type: "PLA", color: "#1a1a1a", weightG: 1000, costPerKg: 20, stock: 2, supplier: "Bambu Lab" },
  { id: uid(), name: "PLA Verde Salva", type: "PLA", color: "#8fbc8f", weightG: 1000, costPerKg: 22, stock: 1, supplier: "Bambu Lab" },
  { id: uid(), name: "PLA Terracota", type: "PLA", color: "#cc7755", weightG: 1000, costPerKg: 22, stock: 1, supplier: "eSUN" },
  { id: uid(), name: "PLA Silk Dourado", type: "PLA", color: "#d4a847", weightG: 1000, costPerKg: 26, stock: 1, supplier: "Bambu Lab" },
  { id: uid(), name: "PLA Silk Prateado", type: "PLA", color: "#c0c0c0", weightG: 1000, costPerKg: 26, stock: 1, supplier: "eSUN" },
  { id: uid(), name: "PLA Azul Pastel", type: "PLA", color: "#a8d8ea", weightG: 1000, costPerKg: 22, stock: 1, supplier: "Bambu Lab" },
  { id: uid(), name: "PLA Rosa Pastel", type: "PLA", color: "#f4b8c7", weightG: 1000, costPerKg: 22, stock: 1, supplier: "Bambu Lab" },
  { id: uid(), name: "PETG Transparente", type: "PETG", color: "#e0e8f0", weightG: 1000, costPerKg: 25, stock: 1, supplier: "Bambu Lab" },
  { id: uid(), name: "PETG Branco", type: "PETG", color: "#f5f5f5", weightG: 1000, costPerKg: 25, stock: 1, supplier: "Bambu Lab" },
];

const DEFAULT_SETTINGS = {
  businessName: "Luma 3D",
  electricityCostPerH: 0.08,
  laborCostPerH: 2.0,
  shippingCost: 4.5,
  etsyFeePercent: 6.5,
  vintedFeePercent: 5.0,
  printer: "Bambu Lab P1S",
  currency: "€",
};

const ORDER_STATUS = ["Pendente", "Em Produção", "Impresso", "Embalado", "Enviado", "Entregue", "Cancelado"];
const STATUS_COLORS = {
  "Pendente": "#f59e0b",
  "Em Produção": "#3b82f6",
  "Impresso": "#8b5cf6",
  "Embalado": "#06b6d4",
  "Enviado": "#10b981",
  "Entregue": "#059669",
  "Cancelado": "#ef4444",
};

// ==================== ICONS (inline SVG) ====================
const icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  products: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  clients: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  orders: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
  materials: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  calculator: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 14h2M14 14h2M8 18h2M14 18h2M8 10h8"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:24,height:24}}><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:24,height:24}}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:18,height:18}}><path d="M12 5v14M5 12h14"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:16,height:16}}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:16,height:16}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:18,height:18}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  printer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{width:20,height:20}}><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
};

// ==================== STYLES ====================
const theme = {
  bg: "#0f1117",
  bgCard: "#1a1d27",
  bgInput: "#252833",
  bgHover: "#2a2d3a",
  bgSidebar: "#141620",
  accent: "#6c63ff",
  accentLight: "#8b83ff",
  accentDim: "rgba(108,99,255,0.12)",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#e4e4e7",
  textMuted: "#9ca3af",
  textDim: "#6b7280",
  border: "#2a2d3a",
  borderLight: "#353849",
};

// ==================== COMPONENTS ====================
const Badge = ({ children, color }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
    background: color + "22", color: color, border: `1px solid ${color}33`,
  }}>{children}</span>
);

const StatCard = ({ label, value, sub, color = theme.accent, icon }) => (
  <div style={{
    background: theme.bgCard, borderRadius: 14, padding: "20px 22px",
    border: `1px solid ${theme.border}`, position: "relative", overflow: "hidden",
    flex: "1 1 200px", minWidth: 180,
  }}>
    <div style={{ position: "absolute", top: -10, right: -10, opacity: 0.06, fontSize: 80 }}>{icon}</div>
    <div style={{ fontSize: 12, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: theme.textDim, marginTop: 6 }}>{sub}</div>}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled, small }) => {
  const base = {
    padding: small ? "6px 14px" : "10px 20px",
    borderRadius: 10, border: "none", cursor: disabled ? "default" : "pointer",
    fontWeight: 600, fontSize: small ? 12 : 13, display: "inline-flex",
    alignItems: "center", gap: 6, transition: "all .2s", opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
  const variants = {
    primary: { background: theme.accent, color: "#fff" },
    ghost: { background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}` },
    danger: { background: theme.danger + "18", color: theme.danger, border: `1px solid ${theme.danger}33` },
    success: { background: theme.success + "18", color: theme.success, border: `1px solid ${theme.success}33` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...s }}>{children}</button>;
};

const Input = ({ label, value, onChange, type = "text", placeholder, style: s = {}, options, textarea, readOnly }) => (
  <label style={{ display: "block", marginBottom: 14, ...s }}>
    {label && <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 5, fontWeight: 500 }}>{label}</div>}
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "10px 12px", borderRadius: 8,
        background: theme.bgInput, color: theme.text, border: `1px solid ${theme.border}`,
        fontSize: 14, fontFamily: "inherit", outline: "none",
      }}>
        {options.map(o => <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
          {typeof o === "string" ? o : o.label}
        </option>)}
      </select>
    ) : textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{
        width: "100%", padding: "10px 12px", borderRadius: 8, resize: "vertical",
        background: theme.bgInput, color: theme.text, border: `1px solid ${theme.border}`,
        fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
      }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly} style={{
        width: "100%", padding: "10px 12px", borderRadius: 8, boxSizing: "border-box",
        background: readOnly ? theme.bg : theme.bgInput, color: theme.text,
        border: `1px solid ${theme.border}`, fontSize: 14, fontFamily: "inherit", outline: "none",
      }} />
    )}
  </label>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000, display: "flex",
    alignItems: "center", justifyContent: "center",
    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: 16,
  }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{
      background: theme.bgCard, borderRadius: 16, padding: 28,
      width: "100%", maxWidth: wide ? 700 : 500, maxHeight: "90vh",
      overflow: "auto", border: `1px solid ${theme.border}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, color: theme.text, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }}>{icons.close}</button>
      </div>
      {children}
    </div>
  </div>
);

const EmptyState = ({ text }) => (
  <div style={{ textAlign: "center", padding: 40, color: theme.textDim }}>
    <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📦</div>
    <div>{text}</div>
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 320 }}>
    <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textDim }}>{icons.search}</div>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Pesquisar..."} style={{
      width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10, boxSizing: "border-box",
      background: theme.bgInput, color: theme.text, border: `1px solid ${theme.border}`,
      fontSize: 14, fontFamily: "inherit", outline: "none",
    }} />
  </div>
);

const Table = ({ columns, data, onEdit, onDelete, actions }) => (
  <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${theme.border}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>{columns.map((c, i) => (
          <th key={i} style={{
            padding: "12px 14px", textAlign: "left", fontSize: 11,
            textTransform: "uppercase", letterSpacing: 0.8, color: theme.textMuted,
            background: theme.bg, borderBottom: `1px solid ${theme.border}`,
            whiteSpace: "nowrap",
          }}>{c.label}</th>
        ))}
        {(onEdit || onDelete || actions) && <th style={{
          padding: "12px 14px", textAlign: "right", fontSize: 11,
          background: theme.bg, borderBottom: `1px solid ${theme.border}`, color: theme.textMuted,
        }}>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, ri) => (
          <tr key={row.id || ri} style={{ borderBottom: `1px solid ${theme.border}` }}>
            {columns.map((c, ci) => (
              <td key={ci} style={{
                padding: "12px 14px", color: theme.text, whiteSpace: c.nowrap ? "nowrap" : "normal",
              }}>{c.render ? c.render(row) : row[c.key]}</td>
            ))}
            {(onEdit || onDelete || actions) && (
              <td style={{ padding: "12px 14px", textAlign: "right", whiteSpace: "nowrap" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  {actions && actions(row)}
                  {onEdit && <button onClick={() => onEdit(row)} style={{
                    background: theme.accentDim, border: "none", borderRadius: 6, padding: "6px 8px",
                    cursor: "pointer", color: theme.accent, display: "flex",
                  }}>{icons.edit}</button>}
                  {onDelete && <button onClick={() => onDelete(row.id)} style={{
                    background: theme.danger + "15", border: "none", borderRadius: 6, padding: "6px 8px",
                    cursor: "pointer", color: theme.danger, display: "flex",
                  }}>{icons.trash}</button>}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==================== PAGE: DASHBOARD ====================
const Dashboard = ({ products, orders, clients, materials, settings }) => {
  const totalRevenue = orders.filter(o => o.status !== "Cancelado").reduce((s, o) => s + (o.total || 0), 0);
  const totalCosts = orders.filter(o => o.status !== "Cancelado").reduce((s, o) => s + (o.cost || 0), 0);
  const profit = totalRevenue - totalCosts;
  const activeOrders = orders.filter(o => !["Entregue", "Cancelado"].includes(o.status)).length;
  const thisMonth = orders.filter(o => {
    const d = new Date(o.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.status !== "Cancelado";
  });
  const monthRevenue = thisMonth.reduce((s, o) => s + (o.total || 0), 0);
  const lowStockMaterials = materials.filter(m => m.stock <= 1);

  // License costs — deduplicate by designer
  const licenseCosts = useMemo(() => {
    const seen = new Set();
    let total = 0;
    products.filter(p => p.active && p.licenseCost > 0).forEach(p => {
      const key = p.designer || p.name;
      if (!seen.has(key)) { seen.add(key); total += p.licenseCost; }
    });
    return { total, count: seen.size };
  }, [products]);

  const topProducts = useMemo(() => {
    const counts = {};
    orders.filter(o => o.status !== "Cancelado").forEach(o => {
      (o.items || []).forEach(it => {
        counts[it.productId] = (counts[it.productId] || 0) + (it.qty || 1);
      });
    });
    return Object.entries(counts)
      .map(([id, qty]) => ({ product: products.find(p => p.id === id), qty }))
      .filter(x => x.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders, products]);

  const recentOrders = orders.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const statusDist = useMemo(() => {
    const dist = {};
    orders.forEach(o => { dist[o.status] = (dist[o.status] || 0) + 1; });
    return dist;
  }, [orders]);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        <StatCard label="Receita Total" value={`${totalRevenue.toFixed(0)}${settings.currency}`} sub={`Lucro: ${profit.toFixed(0)}${settings.currency}`} color={theme.success} icon="💰" />
        <StatCard label="Receita Este Mês" value={`${monthRevenue.toFixed(0)}${settings.currency}`} sub={`${thisMonth.length} encomendas`} color={theme.accent} icon="📊" />
        <StatCard label="Encomendas Ativas" value={activeOrders} sub={`${orders.length} total`} color={theme.warning} icon="📦" />
        <StatCard label="Clientes" value={clients.length} sub={`${products.filter(p => p.active).length} produtos ativos`} color="#06b6d4" icon="👥" />
        <StatCard label="Licenças/Mês" value={`${licenseCosts.total}€`} sub={`${licenseCosts.count} subscrições ativas`} color={theme.warning} icon="📜" />
      </div>

      {lowStockMaterials.length > 0 && (
        <div style={{
          background: theme.warning + "12", border: `1px solid ${theme.warning}33`,
          borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, color: theme.warning,
        }}>
          ⚠️ Stock baixo: {lowStockMaterials.map(m => m.name).join(", ")}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <div style={{ background: theme.bgCard, borderRadius: 14, padding: 20, border: `1px solid ${theme.border}` }}>
          <h4 style={{ margin: "0 0 16px", color: theme.text, fontSize: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>Encomendas Recentes</h4>
          {recentOrders.length === 0 ? <div style={{ color: theme.textDim, fontSize: 13 }}>Nenhuma encomenda</div> :
            recentOrders.map(o => (
              <div key={o.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: `1px solid ${theme.border}`,
              }}>
                <div>
                  <div style={{ color: theme.text, fontSize: 13, fontWeight: 500 }}>{o.clientName || "Sem nome"}</div>
                  <div style={{ color: theme.textDim, fontSize: 11 }}>{new Date(o.date).toLocaleDateString("pt-PT")}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Badge color={STATUS_COLORS[o.status] || theme.textMuted}>{o.status}</Badge>
                  <span style={{ color: theme.success, fontWeight: 600, fontSize: 13 }}>{(o.total || 0).toFixed(0)}{settings.currency}</span>
                </div>
              </div>
            ))
          }
        </div>

        <div style={{ background: theme.bgCard, borderRadius: 14, padding: 20, border: `1px solid ${theme.border}` }}>
          <h4 style={{ margin: "0 0 16px", color: theme.text, fontSize: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>Produtos Mais Vendidos</h4>
          {topProducts.length === 0 ? <div style={{ color: theme.textDim, fontSize: 13 }}>Sem dados ainda</div> :
            topProducts.map((tp, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 12, fontWeight: 700,
                  background: theme.accentDim, color: theme.accent,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.text, fontSize: 13, fontWeight: 500 }}>{tp.product.name}</div>
                  <div style={{ color: theme.textDim, fontSize: 11 }}>{tp.product.category}</div>
                </div>
                <div style={{ color: theme.accent, fontWeight: 600, fontSize: 13 }}>{tp.qty}x</div>
              </div>
            ))
          }
        </div>

        <div style={{ background: theme.bgCard, borderRadius: 14, padding: 20, border: `1px solid ${theme.border}` }}>
          <h4 style={{ margin: "0 0 16px", color: theme.text, fontSize: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>Estado das Encomendas</h4>
          {Object.keys(statusDist).length === 0 ? <div style={{ color: theme.textDim, fontSize: 13 }}>Sem dados</div> :
            Object.entries(statusDist).map(([status, count]) => (
              <div key={status} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: theme.text }}>{status}</span>
                  <span style={{ color: theme.textMuted }}>{count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: theme.bg }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: `${(count / orders.length) * 100}%`,
                    background: STATUS_COLORS[status] || theme.textMuted, transition: "width .5s",
                  }} />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

// ==================== PAGE: PRODUCTS ====================
const Products = ({ products, setProducts }) => {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todas");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "Todas" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const openNew = () => {
    setForm({ name: "", category: "Vasos & Planters", costMaterial: 0, printTimeH: 0, price: 0, filament: "PLA", weightG: 0, active: true, source: "", notes: "", license: "Outro", licenseCost: 0, designer: "" });
    setModal("new");
  };

  const openEdit = (p) => { setForm({ ...p }); setModal("edit"); };

  const save = () => {
    if (!form.name) return;
    if (modal === "new") {
      setProducts(prev => [...prev, { ...form, id: uid() }]);
    } else {
      setProducts(prev => prev.map(p => p.id === form.id ? { ...form } : p));
    }
    setModal(null);
  };

  const del = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const margin = (p) => p.price > 0 ? (((p.price - p.costMaterial) / p.price) * 100).toFixed(0) : 0;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar produtos..." />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{
          padding: "10px 14px", borderRadius: 10, background: theme.bgInput, color: theme.text,
          border: `1px solid ${theme.border}`, fontSize: 13, fontFamily: "inherit",
        }}>
          <option value="Todas">Todas as categorias</option>
          {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Btn onClick={openNew}>{icons.plus} Novo Produto</Btn>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {PRODUCT_CATEGORIES.map(cat => {
          const count = products.filter(p => p.category === cat).length;
          if (count === 0) return null;
          return <div key={cat} onClick={() => setCatFilter(catFilter === cat ? "Todas" : cat)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
            background: catFilter === cat ? theme.accent : theme.bgCard,
            color: catFilter === cat ? "#fff" : theme.textMuted,
            border: `1px solid ${catFilter === cat ? theme.accent : theme.border}`,
            transition: "all .2s",
          }}>{cat} ({count})</div>;
        })}
      </div>

      {filtered.length === 0 ? <EmptyState text="Nenhum produto encontrado" /> : (
        <Table
          columns={[
            { label: "Produto", render: r => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: theme.textDim }}>{r.category} • {r.filament}</div>
                {r.notes && <div style={{ fontSize: 10, color: theme.textDim, marginTop: 2, maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.notes}</div>}
              </div>
            )},
            { label: "Preço", nowrap: true, render: r => <span style={{ fontWeight: 600, color: theme.success }}>{r.price}€</span> },
            { label: "Custo", nowrap: true, render: r => <span style={{ color: theme.textMuted }}>{r.costMaterial}€</span> },
            { label: "Margem", nowrap: true, render: r => <Badge color={Number(margin(r)) > 70 ? theme.success : theme.warning}>{margin(r)}%</Badge> },
            { label: "Licença", render: r => (
              <div>
                <Badge color={
                  r.license === "Gratuita" ? theme.success :
                  r.license === "Design Próprio" ? "#06b6d4" :
                  r.license === "Patreon" ? "#f97316" :
                  r.license === "MakerWorld Membership" ? theme.accent :
                  theme.textMuted
                }>{r.license || "—"}</Badge>
                {(r.licenseCost > 0) && <div style={{ fontSize: 10, color: theme.warning, marginTop: 2 }}>{r.licenseCost}€/mês</div>}
                {r.designer && <div style={{ fontSize: 10, color: theme.textDim, marginTop: 1 }}>{r.designer}</div>}
              </div>
            )},
            { label: "Fonte", render: r => r.source ? <a href={`https://${r.source}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: theme.accent, textDecoration: "none" }}>MakerWorld ↗</a> : <span style={{ color: theme.textDim, fontSize: 11 }}>—</span> },
            { label: "Estado", render: r => <Badge color={r.active ? theme.success : theme.danger}>{r.active ? "Ativo" : "Inativo"}</Badge> },
          ]}
          data={filtered}
          onEdit={openEdit}
          onDelete={del}
        />
      )}
      {modal && (
        <Modal title={modal === "new" ? "Novo Produto" : "Editar Produto"} onClose={() => setModal(null)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Nome" value={form.name} onChange={v => setForm(f => ({...f, name: v}))} style={{ gridColumn: "1/-1" }} />
            <Input label="Categoria" value={form.category} onChange={v => setForm(f => ({...f, category: v}))} options={PRODUCT_CATEGORIES} />
            <Input label="Filamento" value={form.filament} onChange={v => setForm(f => ({...f, filament: v}))} options={["PLA", "PETG", "ABS", "TPU"]} />
            <Input label="Preço Venda (€)" type="number" value={form.price} onChange={v => setForm(f => ({...f, price: Number(v)}))} />
            <Input label="Custo Material (€)" type="number" value={form.costMaterial} onChange={v => setForm(f => ({...f, costMaterial: Number(v)}))} />
            <Input label="Tempo Impressão (h)" type="number" value={form.printTimeH} onChange={v => setForm(f => ({...f, printTimeH: Number(v)}))} />
            <Input label="Peso (g)" type="number" value={form.weightG} onChange={v => setForm(f => ({...f, weightG: Number(v)}))} />
            <Input label="Estado" value={form.active ? "true" : "false"} onChange={v => setForm(f => ({...f, active: v === "true"}))} options={[{value:"true",label:"Ativo"},{value:"false",label:"Inativo"}]} />
          </div>
          <div style={{ background: theme.bg, borderRadius: 10, padding: "14px 16px", marginTop: 10, border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 12, color: theme.accent, fontWeight: 600, marginBottom: 10 }}>Licença Comercial</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
              <Input label="Tipo de Licença" value={form.license || "Outro"} onChange={v => setForm(f => ({...f, license: v}))} options={LICENSE_TYPES} />
              <Input label="Custo Licença (€/mês)" type="number" value={form.licenseCost || 0} onChange={v => setForm(f => ({...f, licenseCost: Number(v)}))} />
              <Input label="Designer / Criador" value={form.designer || ""} onChange={v => setForm(f => ({...f, designer: v}))} placeholder="Nome do criador" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", marginTop: 10 }}>
            <Input label="Fonte / URL MakerWorld" value={form.source || ""} onChange={v => setForm(f => ({...f, source: v}))} placeholder="makerworld.com/en/models/..." style={{ gridColumn: "1/-1" }} />
            <Input label="Notas de Produção" value={form.notes || ""} onChange={v => setForm(f => ({...f, notes: v}))} textarea style={{ gridColumn: "1/-1" }} />
          </div>
          {form.price > 0 && (
            <div style={{
              background: theme.bg, borderRadius: 10, padding: 14, marginTop: 14,
              display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center",
            }}>
              <div><span style={{ fontSize: 11, color: theme.textDim }}>Margem: </span><span style={{ fontWeight: 700, color: Number(margin(form)) > 70 ? theme.success : theme.warning }}>{margin(form)}%</span></div>
              <div><span style={{ fontSize: 11, color: theme.textDim }}>Lucro/un: </span><span style={{ fontWeight: 700, color: theme.success }}>{(form.price - form.costMaterial).toFixed(2)}€</span></div>
              <div><span style={{ fontSize: 11, color: theme.textDim }}>Preço mín. (3×custo): </span><span style={{ fontWeight: 600, color: theme.accent }}>{(form.costMaterial * 3).toFixed(2)}€</span></div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ==================== PAGE: CLIENTS ====================
const Clients = ({ clients, setClients, orders }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm({ name: "", email: "", phone: "", address: "", city: "", zip: "", channel: "Etsy", notes: "" }); setModal("new"); };
  const openEdit = (c) => { setForm({ ...c }); setModal("edit"); };

  const save = () => {
    if (!form.name) return;
    if (modal === "new") setClients(prev => [...prev, { ...form, id: uid(), createdAt: new Date().toISOString() }]);
    else setClients(prev => prev.map(c => c.id === form.id ? { ...form } : c));
    setModal(null);
  };

  const del = (id) => setClients(prev => prev.filter(c => c.id !== id));
  const clientOrders = (id) => orders.filter(o => o.clientId === id);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar clientes..." />
        <Btn onClick={openNew}>{icons.plus} Novo Cliente</Btn>
      </div>
      {filtered.length === 0 ? <EmptyState text="Nenhum cliente encontrado" /> : (
        <Table
          columns={[
            { label: "Cliente", render: r => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: theme.textDim }}>{r.email || "—"}</div>
              </div>
            )},
            { label: "Telefone", key: "phone", render: r => <span style={{ color: theme.textMuted }}>{r.phone || "—"}</span> },
            { label: "Cidade", key: "city", render: r => <span style={{ color: theme.textMuted }}>{r.city || "—"}</span> },
            { label: "Canal", render: r => <Badge color={r.channel === "Etsy" ? "#f97316" : r.channel === "Vinted" ? "#06b6d4" : theme.accent}>{r.channel || "—"}</Badge> },
            { label: "Encomendas", render: r => <span style={{ color: theme.accent, fontWeight: 600 }}>{clientOrders(r.id).length}</span> },
            { label: "Gasto Total", render: r => {
              const total = clientOrders(r.id).reduce((s, o) => s + (o.total || 0), 0);
              return <span style={{ color: theme.success, fontWeight: 600 }}>{total.toFixed(0)}€</span>;
            }},
          ]}
          data={filtered}
          onEdit={openEdit}
          onDelete={del}
        />
      )}
      {modal && (
        <Modal title={modal === "new" ? "Novo Cliente" : "Editar Cliente"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Nome" value={form.name} onChange={v => setForm(f => ({...f, name: v}))} style={{ gridColumn: "1/-1" }} />
            <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({...f, email: v}))} />
            <Input label="Telefone" value={form.phone} onChange={v => setForm(f => ({...f, phone: v}))} />
            <Input label="Morada" value={form.address} onChange={v => setForm(f => ({...f, address: v}))} style={{ gridColumn: "1/-1" }} />
            <Input label="Cidade" value={form.city} onChange={v => setForm(f => ({...f, city: v}))} />
            <Input label="Código Postal" value={form.zip} onChange={v => setForm(f => ({...f, zip: v}))} />
            <Input label="Canal" value={form.channel} onChange={v => setForm(f => ({...f, channel: v}))} options={["Etsy", "Vinted", "Instagram", "Direto", "Outro"]} />
            <Input label="Notas" value={form.notes} onChange={v => setForm(f => ({...f, notes: v}))} textarea style={{ gridColumn: "1/-1" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ==================== PAGE: ORDERS ====================
const Orders = ({ orders, setOrders, products, clients, setClients, settings }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = orders.filter(o => {
    const matchSearch = (o.clientName || "").toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const openNew = () => {
    setForm({
      clientId: "", clientName: "", items: [{ productId: products[0]?.id || "", qty: 1, customText: "" }],
      status: "Pendente", channel: "Etsy", shipping: settings.shippingCost, discount: 0, notes: "", date: new Date().toISOString().slice(0, 10),
    });
    setModal("new");
  };

  const openEdit = (o) => { setForm({ ...o, date: (o.date || "").slice(0, 10) }); setModal("edit"); };

  const calcOrder = (f) => {
    let subtotal = 0, cost = 0;
    (f.items || []).forEach(it => {
      const p = products.find(x => x.id === it.productId);
      if (p) { subtotal += p.price * (it.qty || 1); cost += p.costMaterial * (it.qty || 1); }
    });
    const feePercent = f.channel === "Etsy" ? settings.etsyFeePercent : f.channel === "Vinted" ? settings.vintedFeePercent : 0;
    const fee = subtotal * (feePercent / 100);
    const total = subtotal + (Number(f.shipping) || 0) - (Number(f.discount) || 0);
    const totalCost = cost + fee + (Number(f.shipping) || 0);
    return { subtotal, cost, fee, total, totalCost, profit: total - totalCost };
  };

  const save = () => {
    if (!form.clientName && !form.clientId) return;
    const calc = calcOrder(form);
    const orderData = { ...form, total: calc.total, cost: calc.totalCost, profit: calc.profit };
    if (modal === "new") {
      const newOrder = { ...orderData, id: uid() };
      setOrders(prev => [...prev, newOrder]);
      if (form.clientName && !clients.find(c => c.name === form.clientName)) {
        setClients(prev => [...prev, { id: uid(), name: form.clientName, channel: form.channel, createdAt: new Date().toISOString() }]);
      }
    } else {
      setOrders(prev => prev.map(o => o.id === form.id ? orderData : o));
    }
    setModal(null);
  };

  const updateStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  const del = (id) => setOrders(prev => prev.filter(o => o.id !== id));

  const addItem = () => setForm(f => ({ ...f, items: [...(f.items || []), { productId: products[0]?.id || "", qty: 1, customText: "" }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, key, val) => setForm(f => ({
    ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it)
  }));

  const calc = modal ? calcOrder(form) : null;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar encomendas..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
          padding: "10px 14px", borderRadius: 10, background: theme.bgInput, color: theme.text,
          border: `1px solid ${theme.border}`, fontSize: 13, fontFamily: "inherit",
        }}>
          <option value="Todos">Todos os estados</option>
          {ORDER_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <Btn onClick={openNew}>{icons.plus} Nova Encomenda</Btn>
      </div>
      {filtered.length === 0 ? <EmptyState text="Nenhuma encomenda encontrada" /> : (
        <Table
          columns={[
            { label: "Data", nowrap: true, render: r => <span style={{ color: theme.textMuted, fontSize: 12 }}>{new Date(r.date).toLocaleDateString("pt-PT")}</span> },
            { label: "Cliente", render: r => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.clientName || "—"}</div>
                <div style={{ fontSize: 11, color: theme.textDim }}>{r.channel || ""}</div>
              </div>
            )},
            { label: "Itens", render: r => (
              <div style={{ fontSize: 12 }}>{(r.items || []).map(it => {
                const p = products.find(x => x.id === it.productId);
                return p ? `${p.name} ×${it.qty}` : "—";
              }).join(", ")}</div>
            )},
            { label: "Total", nowrap: true, render: r => <span style={{ fontWeight: 700, color: theme.success }}>{(r.total || 0).toFixed(2)}€</span> },
            { label: "Lucro", nowrap: true, render: r => <span style={{ fontWeight: 600, color: (r.profit || 0) >= 0 ? theme.success : theme.danger }}>{(r.profit || 0).toFixed(2)}€</span> },
            { label: "Estado", render: r => <Badge color={STATUS_COLORS[r.status] || theme.textMuted}>{r.status}</Badge> },
          ]}
          data={filtered}
          onEdit={openEdit}
          onDelete={del}
          actions={(row) => (
            <select value={row.status} onChange={e => updateStatus(row.id, e.target.value)} style={{
              padding: "4px 8px", borderRadius: 6, background: theme.bgInput, color: theme.text,
              border: `1px solid ${theme.border}`, fontSize: 11, fontFamily: "inherit",
            }} onClick={e => e.stopPropagation()}>
              {ORDER_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        />
      )}
      {modal && (
        <Modal title={modal === "new" ? "Nova Encomenda" : "Editar Encomenda"} onClose={() => setModal(null)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Nome do Cliente" value={form.clientName} onChange={v => setForm(f => ({...f, clientName: v}))} />
            <Input label="Canal" value={form.channel} onChange={v => setForm(f => ({...f, channel: v}))} options={["Etsy", "Vinted", "Instagram", "Direto"]} />
            <Input label="Data" type="date" value={form.date} onChange={v => setForm(f => ({...f, date: v}))} />
            <Input label="Estado" value={form.status} onChange={v => setForm(f => ({...f, status: v}))} options={ORDER_STATUS} />
          </div>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, marginBottom: 8 }}>Itens</div>
            {(form.items || []).map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 8, flexWrap: "wrap" }}>
                <Input label="" value={it.productId} onChange={v => updateItem(i, "productId", v)}
                  options={products.map(p => ({ value: p.id, label: `${p.name} (${p.price}€)` }))}
                  style={{ flex: "2 1 180px", marginBottom: 0 }} />
                <Input label="" type="number" value={it.qty} onChange={v => updateItem(i, "qty", Number(v))}
                  placeholder="Qty" style={{ flex: "0 0 70px", marginBottom: 0 }} />
                <Input label="" value={it.customText || ""} onChange={v => updateItem(i, "customText", v)}
                  placeholder="Texto personalizado" style={{ flex: "1 1 140px", marginBottom: 0 }} />
                <button onClick={() => removeItem(i)} style={{
                  background: theme.danger + "15", border: "none", borderRadius: 6,
                  padding: "10px", cursor: "pointer", color: theme.danger, display: "flex",
                }}>{icons.trash}</button>
              </div>
            ))}
            <Btn variant="ghost" small onClick={addItem}>{icons.plus} Adicionar Item</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Portes (€)" type="number" value={form.shipping} onChange={v => setForm(f => ({...f, shipping: Number(v)}))} />
            <Input label="Desconto (€)" type="number" value={form.discount} onChange={v => setForm(f => ({...f, discount: Number(v)}))} />
            <Input label="Notas" value={form.notes || ""} onChange={v => setForm(f => ({...f, notes: v}))} textarea style={{ gridColumn: "1/-1" }} />
          </div>
          {calc && (
            <div style={{
              background: theme.bg, borderRadius: 10, padding: 16, marginTop: 14,
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12,
            }}>
              <div><div style={{ fontSize: 11, color: theme.textDim }}>Subtotal</div><div style={{ fontWeight: 700, color: theme.text }}>{calc.subtotal.toFixed(2)}€</div></div>
              <div><div style={{ fontSize: 11, color: theme.textDim }}>Custos</div><div style={{ fontWeight: 700, color: theme.warning }}>{calc.totalCost.toFixed(2)}€</div></div>
              <div><div style={{ fontSize: 11, color: theme.textDim }}>Taxa Plataforma</div><div style={{ fontWeight: 700, color: theme.textMuted }}>{calc.fee.toFixed(2)}€</div></div>
              <div><div style={{ fontSize: 11, color: theme.textDim }}>Total</div><div style={{ fontWeight: 700, color: theme.success, fontSize: 18 }}>{calc.total.toFixed(2)}€</div></div>
              <div><div style={{ fontSize: 11, color: theme.textDim }}>Lucro</div><div style={{ fontWeight: 700, color: calc.profit >= 0 ? theme.success : theme.danger, fontSize: 18 }}>{calc.profit.toFixed(2)}€</div></div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ==================== PAGE: MATERIALS ====================
const Materials = ({ materials, setMaterials }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => { setForm({ name: "", type: "PLA", color: "#ffffff", weightG: 1000, costPerKg: 20, stock: 1, supplier: "" }); setModal("new"); };
  const openEdit = (m) => { setForm({ ...m }); setModal("edit"); };

  const save = () => {
    if (!form.name) return;
    if (modal === "new") setMaterials(prev => [...prev, { ...form, id: uid() }]);
    else setMaterials(prev => prev.map(m => m.id === form.id ? { ...form } : m));
    setModal(null);
  };

  const del = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <Btn onClick={openNew}>{icons.plus} Novo Material</Btn>
      </div>
      {materials.length === 0 ? <EmptyState text="Nenhum material registado" /> : (
        <Table
          columns={[
            { label: "Material", render: r => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: r.color, border: "2px solid " + theme.border, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: theme.textDim }}>{r.supplier || "—"}</div>
                </div>
              </div>
            )},
            { label: "Tipo", render: r => <Badge color={r.type === "PLA" ? theme.accent : r.type === "PETG" ? "#06b6d4" : theme.warning}>{r.type}</Badge> },
            { label: "Custo/kg", nowrap: true, render: r => <span style={{ color: theme.text }}>{r.costPerKg}€</span> },
            { label: "Stock", render: r => (
              <span style={{ fontWeight: 600, color: r.stock <= 1 ? theme.danger : theme.success }}>{r.stock} rolo{r.stock !== 1 ? "s" : ""}</span>
            )},
          ]}
          data={materials}
          onEdit={openEdit}
          onDelete={del}
        />
      )}
      {modal && (
        <Modal title={modal === "new" ? "Novo Material" : "Editar Material"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Nome" value={form.name} onChange={v => setForm(f => ({...f, name: v}))} style={{ gridColumn: "1/-1" }} />
            <Input label="Tipo" value={form.type} onChange={v => setForm(f => ({...f, type: v}))} options={["PLA", "PETG", "ABS", "TPU", "ASA", "Outro"]} />
            <Input label="Cor" type="color" value={form.color} onChange={v => setForm(f => ({...f, color: v}))} />
            <Input label="Custo por Kg (€)" type="number" value={form.costPerKg} onChange={v => setForm(f => ({...f, costPerKg: Number(v)}))} />
            <Input label="Stock (rolos)" type="number" value={form.stock} onChange={v => setForm(f => ({...f, stock: Number(v)}))} />
            <Input label="Fornecedor" value={form.supplier} onChange={v => setForm(f => ({...f, supplier: v}))} style={{ gridColumn: "1/-1" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ==================== PAGE: CALCULATOR ====================
const Calculator = ({ settings }) => {
  const [f, setF] = useState({
    weightG: 100, filamentCostKg: 20, printTimeH: 5, price: 20,
    channel: "Etsy", includeShipping: true, qty: 1,
  });

  const filamentCost = (f.weightG / 1000) * f.filamentCostKg;
  const electricityCost = f.printTimeH * settings.electricityCostPerH;
  const laborCost = f.printTimeH * settings.laborCostPerH;
  const totalCost = filamentCost + electricityCost + laborCost;
  const feePercent = f.channel === "Etsy" ? settings.etsyFeePercent : f.channel === "Vinted" ? settings.vintedFeePercent : 0;
  const fee = f.price * (feePercent / 100);
  const shipping = f.includeShipping ? settings.shippingCost : 0;
  const revenue = f.price * f.qty;
  const totalCostAll = (totalCost * f.qty) + fee + shipping;
  const profit = revenue - totalCostAll;
  const margin = revenue > 0 ? (profit / revenue * 100) : 0;
  const suggestedMin = totalCost * 3;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ background: theme.bgCard, borderRadius: 14, padding: 24, border: `1px solid ${theme.border}`, marginBottom: 20 }}>
        <h4 style={{ margin: "0 0 20px", color: theme.text, fontSize: 16 }}>Dados do Produto</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Input label="Peso Filamento (g)" type="number" value={f.weightG} onChange={v => setF(p => ({...p, weightG: Number(v)}))} />
          <Input label="Custo Filamento (€/kg)" type="number" value={f.filamentCostKg} onChange={v => setF(p => ({...p, filamentCostKg: Number(v)}))} />
          <Input label="Tempo Impressão (h)" type="number" value={f.printTimeH} onChange={v => setF(p => ({...p, printTimeH: Number(v)}))} />
          <Input label="Preço Venda (€)" type="number" value={f.price} onChange={v => setF(p => ({...p, price: Number(v)}))} />
          <Input label="Quantidade" type="number" value={f.qty} onChange={v => setF(p => ({...p, qty: Math.max(1, Number(v))}))} />
          <Input label="Canal" value={f.channel} onChange={v => setF(p => ({...p, channel: v}))} options={["Etsy", "Vinted", "Direto"]} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: theme.textMuted, marginTop: 4, cursor: "pointer" }}>
          <input type="checkbox" checked={f.includeShipping} onChange={e => setF(p => ({...p, includeShipping: e.target.checked}))} />
          Incluir portes ({settings.shippingCost}€)
        </label>
      </div>

      <div style={{ background: theme.bgCard, borderRadius: 14, padding: 24, border: `1px solid ${theme.border}` }}>
        <h4 style={{ margin: "0 0 20px", color: theme.text, fontSize: 16 }}>Análise de Margem</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
          {[
            { label: "Custo Filamento", value: `${filamentCost.toFixed(2)}€`, color: theme.textMuted },
            { label: "Eletricidade", value: `${electricityCost.toFixed(2)}€`, color: theme.textMuted },
            { label: "Mão de obra", value: `${laborCost.toFixed(2)}€`, color: theme.textMuted },
            { label: "Custo Total/un", value: `${totalCost.toFixed(2)}€`, color: theme.warning },
            { label: `Taxa ${f.channel}`, value: `${fee.toFixed(2)}€`, color: theme.textMuted },
            { label: "Receita", value: `${revenue.toFixed(2)}€`, color: theme.accent },
            { label: "Lucro", value: `${profit.toFixed(2)}€`, color: profit >= 0 ? theme.success : theme.danger },
            { label: "Margem", value: `${margin.toFixed(1)}%`, color: margin >= 60 ? theme.success : margin >= 30 ? theme.warning : theme.danger },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: 12, background: theme.bg, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: theme.textDim, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: 14, borderRadius: 10,
          background: theme.accentDim, border: `1px solid ${theme.accent}33`,
          fontSize: 13, color: theme.accent,
        }}>
          💡 Preço mínimo sugerido (3× custo): <strong>{suggestedMin.toFixed(2)}€</strong>
        </div>

        <div style={{ marginTop: 16, height: 14, borderRadius: 7, background: theme.bg, overflow: "hidden", position: "relative" }}>
          <div style={{
            height: "100%", borderRadius: 7, width: `${Math.min(100, Math.max(0, margin))}%`,
            background: margin >= 60 ? theme.success : margin >= 30 ? theme.warning : theme.danger,
            transition: "all .4s",
          }} />
          <div style={{
            position: "absolute", top: 0, left: "60%", height: "100%", width: 2,
            background: theme.text, opacity: 0.3,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: theme.textDim, marginTop: 4 }}>
          <span>0%</span><span>Meta: 60%</span><span>100%</span>
        </div>
      </div>
    </div>
  );
};

// ==================== PAGE: SETTINGS ====================
const Settings = ({ settings, setSettings }) => {
  const [form, setForm] = useState({ ...settings });

  const save = () => { setSettings(form); };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ background: theme.bgCard, borderRadius: 14, padding: 24, border: `1px solid ${theme.border}` }}>
        <h4 style={{ margin: "0 0 20px", color: theme.text, fontSize: 16 }}>Configurações do Negócio</h4>
        <Input label="Nome do Negócio" value={form.businessName} onChange={v => setForm(f => ({...f, businessName: v}))} />
        <Input label="Impressora" value={form.printer} onChange={v => setForm(f => ({...f, printer: v}))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Input label="Custo Eletricidade (€/hora)" type="number" value={form.electricityCostPerH} onChange={v => setForm(f => ({...f, electricityCostPerH: Number(v)}))} />
          <Input label="Custo Mão de Obra (€/hora)" type="number" value={form.laborCostPerH} onChange={v => setForm(f => ({...f, laborCostPerH: Number(v)}))} />
          <Input label="Custo Envio Padrão (€)" type="number" value={form.shippingCost} onChange={v => setForm(f => ({...f, shippingCost: Number(v)}))} />
          <Input label="Moeda" value={form.currency} onChange={v => setForm(f => ({...f, currency: v}))} options={["€", "$", "£"]} />
          <Input label="Taxa Etsy (%)" type="number" value={form.etsyFeePercent} onChange={v => setForm(f => ({...f, etsyFeePercent: Number(v)}))} />
          <Input label="Taxa Vinted (%)" type="number" value={form.vintedFeePercent} onChange={v => setForm(f => ({...f, vintedFeePercent: Number(v)}))} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Btn onClick={save}>Guardar Configurações</Btn>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const PAGES = [
  { id: "dashboard", label: "Dashboard", icon: icons.dashboard },
  { id: "orders", label: "Encomendas", icon: icons.orders },
  { id: "products", label: "Produtos", icon: icons.products },
  { id: "clients", label: "Clientes", icon: icons.clients },
  { id: "materials", label: "Materiais", icon: icons.materials },
  { id: "calculator", label: "Calculadora", icon: icons.calculator },
  { id: "settings", label: "Definições", icon: icons.settings },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [products, setProductsRaw] = useState(DEFAULT_PRODUCTS);
  const [clients, setClientsRaw] = useState([]);
  const [orders, setOrdersRaw] = useState([]);
  const [materials, setMaterialsRaw] = useState(DEFAULT_MATERIALS);
  const [settings, setSettingsRaw] = useState(DEFAULT_SETTINGS);

  const setProducts = useCallback((v) => { setProductsRaw(prev => { const n = typeof v === "function" ? v(prev) : v; saveData(STORAGE_KEYS.products, n); return n; }); }, []);
  const setClients = useCallback((v) => { setClientsRaw(prev => { const n = typeof v === "function" ? v(prev) : v; saveData(STORAGE_KEYS.clients, n); return n; }); }, []);
  const setOrders = useCallback((v) => { setOrdersRaw(prev => { const n = typeof v === "function" ? v(prev) : v; saveData(STORAGE_KEYS.orders, n); return n; }); }, []);
  const setMaterials = useCallback((v) => { setMaterialsRaw(prev => { const n = typeof v === "function" ? v(prev) : v; saveData(STORAGE_KEYS.materials, n); return n; }); }, []);
  const setSettings = useCallback((v) => { setSettingsRaw(prev => { const n = typeof v === "function" ? v(prev) : v; saveData(STORAGE_KEYS.settings, n); return n; }); }, []);

  useEffect(() => {
    (async () => {
      const [p, c, o, m, s] = await Promise.all([
        loadData(STORAGE_KEYS.products, DEFAULT_PRODUCTS),
        loadData(STORAGE_KEYS.clients, []),
        loadData(STORAGE_KEYS.orders, []),
        loadData(STORAGE_KEYS.materials, DEFAULT_MATERIALS),
        loadData(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
      ]);
      setProductsRaw(p); setClientsRaw(c); setOrdersRaw(o); setMaterialsRaw(m); setSettingsRaw(s);
      setLoading(false);
    })();
  }, []);

  const currentPage = PAGES.find(p => p.id === page);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: theme.bg, color: theme.accent, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{icons.printer}</div>
        <div style={{ fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>A carregar...</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", color: theme.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Sidebar overlay mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 998,
      }} />}

      {/* Sidebar */}
      <aside style={{
        width: 240, background: theme.bgSidebar, borderRight: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "fixed", top: 0, bottom: 0, left: sidebarOpen ? 0 : -260,
        zIndex: 999, transition: "left .3s cubic-bezier(.4,0,.2,1)",
        ...(typeof window !== "undefined" && window.innerWidth >= 768 ? { position: "sticky", left: 0 } : {}),
      }}>
        <div style={{
          padding: "20px 20px 16px", borderBottom: `1px solid ${theme.border}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: theme.accentDim,
            display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent,
          }}>{icons.printer}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>{settings.businessName}</div>
            <div style={{ fontSize: 10, color: theme.textDim, letterSpacing: 0.5 }}>ERP • {settings.printer}</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={() => { setPage(p.id); setSidebarOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: page === p.id ? theme.accentDim : "transparent",
              color: page === p.id ? theme.accent : theme.textMuted,
              fontSize: 13, fontWeight: page === p.id ? 600 : 400, fontFamily: "inherit",
              transition: "all .15s", marginBottom: 2, textAlign: "left",
            }}>
              {p.icon} {p.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${theme.border}`, fontSize: 10, color: theme.textDim }}>
          Luma 3D ERP v1.0<br />Bambu Lab P1S
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          padding: "14px 24px", borderBottom: `1px solid ${theme.border}`,
          display: "flex", alignItems: "center", gap: 14, background: theme.bgCard,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "none", border: "none", color: theme.textMuted, cursor: "pointer",
            display: typeof window !== "undefined" && window.innerWidth >= 768 ? "none" : "flex",
            padding: 4,
          }}>{icons.menu}</button>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.text }}>{currentPage?.label}</h2>
          </div>
        </header>

        <div style={{ padding: "24px", maxWidth: 1200 }}>
          {page === "dashboard" && <Dashboard products={products} orders={orders} clients={clients} materials={materials} settings={settings} />}
          {page === "products" && <Products products={products} setProducts={setProducts} />}
          {page === "clients" && <Clients clients={clients} setClients={setClients} orders={orders} />}
          {page === "orders" && <Orders orders={orders} setOrders={setOrders} products={products} clients={clients} setClients={setClients} settings={settings} />}
          {page === "materials" && <Materials materials={materials} setMaterials={setMaterials} />}
          {page === "calculator" && <Calculator settings={settings} />}
          {page === "settings" && <Settings settings={settings} setSettings={setSettings} />}
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; }
        body { margin: 0; background: ${theme.bg}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        select { cursor: pointer; }
        @media (max-width: 767px) {
          aside { position: fixed !important; }
        }
        @media (min-width: 768px) {
          aside { position: sticky !important; left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
