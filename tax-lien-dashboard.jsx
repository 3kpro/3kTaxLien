import { useState, useEffect, useCallback } from "react";

/* ─── GLOSSARY DATA ─── */
const glossary = [
  { term: "Ad Valorem Tax", def: "Latin for 'according to value.' Property taxes based on the assessed value of real estate. This is what creates the lien when unpaid." },
  { term: "Assessed Value", def: "The dollar value a county assessor assigns to a property for tax purposes. Usually a fraction of actual market value in Oklahoma." },
  { term: "Tax Lien", def: "A legal claim placed on property when the owner fails to pay property taxes. The lien must be satisfied before the property can be sold with clear title." },
  { term: "Tax Lien Certificate", def: "A document issued at Oklahoma's October Tax Sale proving you purchased the right to collect delinquent taxes plus 8% annual interest. If unredeemed in 2 years, you can pursue the property." },
  { term: "Tax Sale (October)", def: "Oklahoma's first sale, held the 1st Monday of October each year. Investors buy tax lien certificates at 8% interest with a 2-year redemption period." },
  { term: "Over-the-Counter (OTC)", def: "Tax lien certificates that went unsold at the October auction. These are assigned to the county and can be purchased directly from the treasurer's office anytime before the 2-year redemption expires. Available NOW." },
  { term: "Resale (June)", def: "Oklahoma's second sale, held the 2nd Monday of June. Properties unredeemed after 2 years are auctioned as tax deeds to the highest bidder. You get actual ownership." },
  { term: "Commissioner Sale", def: "The third buying opportunity. Properties unsold at the June Resale become county-owned and can be purchased at a price approved by the Board of County Commissioners. Often available year-round." },
  { term: "Struck-Off Property", def: "Property that received no bids at auction and was 'struck off' (assigned) to the county. These become county-owned and are sold through Commissioner Sales." },
  { term: "Redemption Period", def: "The window during which a property owner can pay back taxes plus penalties to reclaim their property. In Oklahoma, it's 2 years from the October Tax Sale date." },
  { term: "Tax Deed", def: "A deed issued at the June Resale that transfers actual ownership (fee simple title) of the property to the winning bidder. Much stronger than a lien certificate." },
  { term: "Fee Simple Title", def: "The most complete form of property ownership. A tax deed from a June Resale grants this level of title to the buyer." },
  { term: "Minimum Bid", def: "The lowest acceptable bid at Oklahoma's June Resale. It's the LESSER of: (a) 2/3 of assessed value, OR (b) total delinquent taxes + interest + fees + costs." },
  { term: "Delinquent Taxes", def: "Property taxes that are past due and unpaid. In Oklahoma, taxes unpaid for 3+ years trigger the resale process." },
  { term: "Special Assessment", def: "Extra charges placed on a property by a city/county for services like mowing, cleaning, or nuisance abatement. These are added to the tax bill and create additional liens." },
  { term: "Quiet Title Action", def: "A lawsuit filed to establish clear ownership of property and remove any competing claims. Sometimes needed after purchasing at a tax sale to get title insurance." },
  { term: "Due Diligence", def: "The research you do before buying — checking for other liens, inspecting the property, verifying zoning, assessing market value, and confirming there are no environmental issues." },
  { term: "IRS Lien (Federal Tax Lien)", def: "A lien placed by the IRS for unpaid federal taxes. CRITICAL: These can survive a tax sale. The IRS has 120 days after the sale to redeem. Always check for these." },
  { term: "Encumbrance", def: "Any claim, lien, or restriction on a property that may affect its value or your ability to use it freely. Mortgages, liens, and easements are all encumbrances." },
  { term: "Parcel ID", def: "A unique identification number assigned to every piece of property by the county assessor. Used to look up tax records, ownership, and property details." },
  { term: "ROI (Return on Investment)", def: "Your profit divided by your cost, expressed as a percentage. Example: Buy a lien for $1,000, earn $1,080 back = 8% ROI." },
  { term: "Wholesaling", def: "Buying a property (or lien) and quickly reselling it to another investor for a profit without improving it. A common strategy with tax sale properties." },
  { term: "Title Search", def: "Research into a property's ownership history and any liens or encumbrances. Essential before buying at a tax sale to know what you're getting into." },
  { term: "LOCCAT", def: "Tulsa County's online mapping tool that combines land records from the County Clerk, Assessor, and Treasurer into one searchable map." },
  { term: "Flood Zone", def: "An area designated by FEMA as having a higher risk of flooding. Properties in flood zones may require expensive insurance and can be harder to resell." },
  { term: "Zoning", def: "Local government rules that dictate how property can be used — residential, commercial, industrial, agricultural, etc. Affects what you can do with a property after purchase." },
  { term: "Assignment", def: "The transfer of a tax lien certificate from one investor to another. In Oklahoma, assignments must be recorded with the county treasurer." },
  { term: "Endorsement", def: "Adding subsequent years' delinquent taxes to an existing tax lien certificate. Increases your total investment but also your potential return." },
  { term: "Overbid / Premium", def: "The amount a winning bid exceeds the minimum bid at auction. Excess proceeds may go back to the original property owner in some cases." },
];

/* ─── BUY NOW DATA ─── */
const buyNowOptions = [
  {
    type: "OTC Tax Lien Certificates",
    desc: "Unsold certificates from the October 2025 Tax Sale. Buy directly from any county treasurer's office. Earns 8% per annum with a 2-year redemption period.",
    action: "Call the county treasurer and ask for their list of unsold/county-held tax lien certificates available for assignment purchase.",
    counties: [
      { name: "Tulsa County", phone: "918-596-5071", addr: "218 W. 6th St., 8th Fl, Tulsa" },
      { name: "Oklahoma County", phone: "405-713-1300", addr: "320 Robert S. Kerr Ave, OKC" },
      { name: "Rogers County", phone: "918-923-4960", addr: "219 S. Missouri, Claremore" },
      { name: "Creek County", phone: "918-224-4509", addr: "222 E. Dewey, Sapulpa" },
      { name: "Wagoner County", phone: "918-485-2149", addr: "307 E. Cherokee, Wagoner" },
      { name: "Okmulgee County", phone: "918-756-3848", addr: "314 W. 7th St, Okmulgee" },
    ],
    returns: "8% per annum interest", risk: "Low", minInvest: "Varies — as low as a few hundred dollars", statute: "68 O.S. § 3108",
  },
  {
    type: "County-Owned Properties (Commissioner Sale)",
    desc: "Properties that went unsold at the June Resale and are now owned by the county. Sold at a price approved by the Board of County Commissioners. You get a tax deed (actual ownership).",
    action: "Contact the treasurer's delinquent tax department for the county-owned properties list. Submit a 'Proposed Bid on County Property' form.",
    counties: [
      { name: "Tulsa County", phone: "918-596-5070", addr: "218 W. 6th St., 8th Fl, Tulsa" },
      { name: "Oklahoma County", phone: "405-713-1300", addr: "320 Robert S. Kerr Ave, OKC" },
    ],
    returns: "Unlimited — you own the property at potentially huge discount", risk: "Medium", minInvest: "Varies by property", statute: "68 O.S. § 3135",
  },
];

/* ─── COUNTIES ─── */
const counties = [
  { name: "Tulsa County", phone: "918-596-5071", delinqPhone: "918-596-5070", addr: "218 W. 6th St., 8th Floor, Tulsa OK 74119", website: "www2.tulsacounty.org/treasurer" },
  { name: "Oklahoma County", phone: "405-713-1300", delinqPhone: "405-713-1300", addr: "320 Robert S. Kerr Ave, OKC OK", website: "docs.oklahomacounty.org/treasurer" },
  { name: "Rogers County", phone: "918-923-4960", delinqPhone: "918-923-4960", addr: "219 S. Missouri, Claremore OK", website: "" },
  { name: "Wagoner County", phone: "918-485-2149", delinqPhone: "918-485-2149", addr: "307 E. Cherokee St, Wagoner OK", website: "" },
  { name: "Creek County", phone: "918-224-4509", delinqPhone: "918-224-4509", addr: "222 E. Dewey, Sapulpa OK", website: "" },
  { name: "Okmulgee County", phone: "918-756-3848", delinqPhone: "918-756-3848", addr: "314 W. 7th St, Okmulgee OK", website: "" },
  { name: "Comanche County", phone: "580-355-5786", delinqPhone: "580-355-5786", addr: "315 SW 5th St, Lawton OK", website: "" },
];

const statusColors = {
  "Researching": { bg: "#1a1a2e", border: "#e6a919", text: "#e6a919" },
  "Target": { bg: "#1a2e1a", border: "#4ade80", text: "#4ade80" },
  "Bid Placed": { bg: "#1a1a2e", border: "#60a5fa", text: "#60a5fa" },
  "Won": { bg: "#0a2a0a", border: "#22c55e", text: "#22c55e" },
  "Flipped": { bg: "#2a1a0a", border: "#f59e0b", text: "#f59e0b" },
  "Pass": { bg: "#1a0a0a", border: "#ef4444", text: "#ef4444" },
};
const riskLevels = { "Low": "#22c55e", "Medium": "#f59e0b", "High": "#ef4444" };

function fmt(v) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0); }
function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / (864e5)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

/* ─── TOOLTIP ─── */
function Tip({ term, children }) {
  const [show, setShow] = useState(false);
  const entry = glossary.find(g => g.term.toLowerCase() === (term || "").toLowerCase());
  if (!entry) return children || term;
  return (
    <span style={{ position: "relative", display: "inline" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}>
      <span style={{ borderBottom: "1px dashed #e6a919", color: "#e6a919", cursor: "help", fontWeight: 600 }}>
        {children || term}
      </span>
      {show && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "#1a1f2e", border: "1px solid #e6a919", borderRadius: 8, padding: "10px 14px",
          fontSize: 12, color: "#c9d1d9", width: 280, zIndex: 999, lineHeight: 1.5, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          pointerEvents: "none" }}>
          <span style={{ fontWeight: 700, color: "#e6a919", display: "block", marginBottom: 4 }}>{entry.term}</span>
          {entry.def}
          <span style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: 10, height: 10, background: "#1a1f2e", borderRight: "1px solid #e6a919", borderBottom: "1px solid #e6a919" }} />
        </span>
      )}
    </span>
  );
}

/* ─── MAIN ─── */
export default function TaxLienDashboard() {
  const [data, setData] = useState({ properties: [], budget: 3000, targetReturn: 5000 });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [glossarySearch, setGlossarySearch] = useState("");
  const emptyForm = { parcelId: "", address: "", county: "Tulsa County", assessedValue: "", minBid: "", estimatedValue: "", status: "Researching", risk: "Medium", notes: "", liens: "", zoning: "", acreage: "", type: "Resale" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { try { const s = localStorage.getItem("tlp2"); if (s) setData(JSON.parse(s)); } catch (e) { } }, []);
  const save = useCallback((d) => { setData(d); try { localStorage.setItem("tlp2", JSON.stringify(d)); } catch (e) { } }, []);
  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowAddForm(false); };
  const handleSaveProperty = () => { if (!form.address) return; const p = { ...form, id: editingId || uid(), assessedValue: Number(form.assessedValue) || 0, minBid: Number(form.minBid) || 0, estimatedValue: Number(form.estimatedValue) || 0 }; const props = editingId ? data.properties.map(x => x.id === editingId ? p : x) : [...data.properties, p]; save({ ...data, properties: props }); resetForm(); };
  const handleEdit = (p) => { setForm({ ...p, assessedValue: p.assessedValue + "", minBid: p.minBid + "", estimatedValue: p.estimatedValue + "" }); setEditingId(p.id); setShowAddForm(true); };
  const handleDelete = (id) => { save({ ...data, properties: data.properties.filter(p => p.id !== id) }); };

  const totalInvested = data.properties.filter(p => ["Bid Placed", "Won"].includes(p.status)).reduce((s, p) => s + p.minBid, 0);
  const totalEstValue = data.properties.filter(p => ["Won", "Target"].includes(p.status)).reduce((s, p) => s + p.estimatedValue, 0);
  const totalFlipped = data.properties.filter(p => p.status === "Flipped").reduce((s, p) => s + (p.estimatedValue - p.minBid), 0);
  const remaining = data.budget - totalInvested;
  const targetProps = data.properties.filter(p => p.status === "Target").length;
  const daysToAuction = daysUntil("2026-06-08");
  const daysToOctober = daysUntil("2026-10-05");

  const [checklist, setChecklist] = useState(() => { try { const s = localStorage.getItem("tlp2-cl"); return s ? JSON.parse(s) : {}; } catch { return {}; } });
  const toggleCheck = (k) => { const n = { ...checklist, [k]: !checklist[k] }; setChecklist(n); try { localStorage.setItem("tlp2-cl", JSON.stringify(n)); } catch { } };
  const checklistItems = [
    { phase: "DO RIGHT NOW", icon: "🟢", items: [
      { key: "n1", text: "Call Tulsa County Treasurer (918-596-5071) — ask about OTC tax lien certificates from Oct 2025 sale" },
      { key: "n2", text: "Call Delinquent Tax Dept (918-596-5070) — get county-owned properties list" },
      { key: "n3", text: "Call 2-3 surrounding county treasurers for their OTC certificate lists" },
      { key: "n4", text: "Visit Treasurer's office to understand the process in person" },
      { key: "n5", text: "Open dedicated bank account for tax lien investing" },
    ] },
    { phase: "RESEARCH (Now-May)", icon: "📋", items: [
      { key: "c1", text: "Study LOCCAT mapping tool for property research" },
      { key: "c2", text: "Practice with Tulsa County Assessor's property search" },
      { key: "c3", text: "Research past auction results — understand price patterns" },
      { key: "c4", text: "Learn to identify IRS liens, environmental issues, flood zones" },
      { key: "c5", text: "Build investor buyer list — REI meetups, BiggerPockets" },
      { key: "c6", text: "Study Oklahoma Statute Title 68, Article 31" },
    ] },
    { phase: "LIST DROPS (May 15)", icon: "📦", items: [
      { key: "c10", text: "Download June Resale property list from Treasurer's website" },
      { key: "c11", text: "Pre-register at Treasurer's Office" },
      { key: "c12", text: "Pre-deposit funds ($500 min)" },
      { key: "c13", text: "Research every target — drive by, assess condition" },
      { key: "c14", text: "Run title searches — identify surviving liens" },
      { key: "c15", text: "Set max bid limits for top 10-15 targets" },
    ] },
    { phase: "JUNE RESALE (June 8)", icon: "🔨", items: [
      { key: "c18", text: "Arrive early — scope competition" },
      { key: "c19", text: "Stick to max bid limits" },
      { key: "c20", text: "Have cash/cashier's check ready" },
    ] },
    { phase: "POST-AUCTION", icon: "📈", items: [
      { key: "c22", text: "Wait for Resale Deed to be filed" },
      { key: "c23", text: "Market properties to investor list" },
      { key: "c24", text: "List on Craigslist, FB Marketplace, BiggerPockets" },
    ] },
    { phase: "OCTOBER SALE (Oct 5)", icon: "🗓️", items: [
      { key: "o1", text: "Attend October Tax Sale for 8% lien certificates" },
      { key: "o2", text: "Same due diligence as June" },
      { key: "o3", text: "Consider endorsing certificates with subsequent year taxes" },
    ] },
  ];

  const S = {
    app: { fontFamily: "'JetBrains Mono','Fira Code',monospace", background: "linear-gradient(160deg,#0a0a0f 0%,#0d1117 40%,#0a0f1a 100%)", color: "#c9d1d9", minHeight: "100vh" },
    header: { background: "linear-gradient(90deg,rgba(230,169,25,0.08) 0%,transparent 60%)", borderBottom: "1px solid rgba(230,169,25,0.2)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
    logoIcon: { width: 40, height: 40, background: "linear-gradient(135deg,#e6a919,#f59e0b)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#0a0a0f" },
    nav: { display: "flex", gap: 2, padding: "0 16px", background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" },
    navBtn: (a) => ({ padding: "12px 14px", background: a ? "rgba(230,169,25,0.1)" : "transparent", border: "none", borderBottom: a ? "2px solid #e6a919" : "2px solid transparent", color: a ? "#e6a919" : "#6b7280", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "inherit", whiteSpace: "nowrap" }),
    content: { padding: "20px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 20 },
    sc: (c) => ({ background: "rgba(255,255,255,0.02)", border: `1px solid ${c}22`, borderRadius: 12, padding: "16px", position: "relative", overflow: "hidden" }),
    accent: (c) => ({ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c }),
    label: { fontSize: 10, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 },
    val: (c) => ({ fontSize: 22, fontWeight: 800, color: c || "#c9d1d9" }),
    card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px", marginBottom: 14 },
    cardT: { fontSize: 13, fontWeight: 700, color: "#e6a919", marginBottom: 14, letterSpacing: "0.5px" },
    th: { textAlign: "left", padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase" },
    td: { padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 },
    badge: (bg, br, tx) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: bg, border: `1px solid ${br}`, color: tx, fontSize: 10, fontWeight: 600 }),
    btn: (v) => ({ padding: "8px 16px", borderRadius: 8, border: v === "primary" ? "1px solid #e6a919" : "1px solid rgba(255,255,255,0.1)", background: v === "primary" ? "rgba(230,169,25,0.15)" : "rgba(255,255,255,0.03)", color: v === "primary" ? "#e6a919" : "#c9d1d9", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }),
    input: { width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#c9d1d9", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    select: { width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#c9d1d9", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    fg: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    pbar: { width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" },
    pfill: (p, c) => ({ width: `${Math.min(p, 100)}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.5s" }),
    chk: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" },
    chkBox: (on) => ({ width: 18, height: 18, borderRadius: 4, border: `1px solid ${on ? "#e6a919" : "rgba(255,255,255,0.15)"}`, background: on ? "#e6a919" : "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }),
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
    modal: { background: "#12151e", border: "1px solid rgba(230,169,25,0.2)", borderRadius: 16, padding: "24px", width: "100%", maxWidth: 600, maxHeight: "85vh", overflow: "auto" },
    now: { display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "rgba(74,222,128,0.15)", border: "1px solid #4ade80", color: "#4ade80", fontSize: 10, fontWeight: 700, letterSpacing: "1px", animation: "pulse 2s infinite" },
  };

  const renderDashboard = () => (
    <>
      <div style={{ ...S.card, background: "linear-gradient(135deg,rgba(74,222,128,0.05),rgba(230,169,25,0.05))", border: "1px solid rgba(74,222,128,0.2)", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>Available RIGHT NOW — No Auction Needed</div>
          <span style={S.now}>BUY TODAY</span>
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
          Oklahoma counties have <Tip term="Over-the-Counter (OTC)">OTC tax lien certificates</Tip> and <Tip term="Commissioner Sale">county-owned properties</Tip> available for purchase today. No waiting for the June auction.
        </div>
        <button style={{ ...S.btn("primary"), marginTop: 12 }} onClick={() => setActiveTab("buynow")}>See What's Available Now</button>
      </div>
      <div style={S.grid}>
        <div style={S.sc("#e6a919")}><div style={S.accent("#e6a919")} /><div style={S.label}>Budget</div><div style={S.val("#e6a919")}>{fmt(data.budget)}</div><div style={{ marginTop: 6 }}><div style={{ ...S.label, marginBottom: 3 }}>Remaining: {fmt(remaining)}</div><div style={S.pbar}><div style={S.pfill((remaining / data.budget) * 100, "#e6a919")} /></div></div></div>
        <div style={S.sc("#4ade80")}><div style={S.accent("#4ade80")} /><div style={S.label}>Target Properties</div><div style={S.val("#4ade80")}>{targetProps}</div><div style={{ ...S.label, marginTop: 6 }}>Est. Value: {fmt(totalEstValue)}</div></div>
        <div style={S.sc("#60a5fa")}><div style={S.accent("#60a5fa")} /><div style={S.label}>Invested</div><div style={S.val("#60a5fa")}>{fmt(totalInvested)}</div><div style={{ ...S.label, marginTop: 6 }}>Potential ROI: {totalInvested > 0 ? ((totalEstValue / totalInvested - 1) * 100).toFixed(0) : 0}%</div></div>
        <div style={S.sc("#f59e0b")}><div style={S.accent("#f59e0b")} /><div style={S.label}>Profit Realized</div><div style={S.val(totalFlipped >= 0 ? "#4ade80" : "#ef4444")}>{fmt(totalFlipped)}</div><div style={{ ...S.label, marginTop: 6 }}>Goal: {fmt(data.targetReturn - data.budget)}</div><div style={{ ...S.pbar, marginTop: 3 }}><div style={S.pfill(data.targetReturn - data.budget > 0 ? (totalFlipped / (data.targetReturn - data.budget)) * 100 : 0, "#f59e0b")} /></div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={S.card}>
          <div style={S.cardT}>Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button style={S.btn("primary")} onClick={() => { setShowAddForm(true); setActiveTab("properties"); }}>+ Add Property</button>
            <button style={S.btn()} onClick={() => window.open("https://assessor.tulsacounty.org/Property/Search", "_blank")}>Tulsa Assessor Search</button>
            <button style={S.btn()} onClick={() => window.open("https://www2.tulsacounty.org/treasurer/properties-for-sale/county-properties/", "_blank")}>County Properties</button>
            <button style={S.btn()} onClick={() => window.open("https://ais-usc-tulsacounty-web.azurewebsites.net/FullMapView", "_blank")}>LOCCAT Map</button>
            <button style={S.btn()} onClick={() => window.open("https://oktaxrolls.com/", "_blank")}>OK Tax Rolls</button>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardT}>Key Dates</div>
          {[["OTC Certificates", null, true], ["County-Owned Props", null, true], ["June Resale List", "~May 15"], ["June Resale Auction", `${daysToAuction} days`], ["October Tax Sale", `${daysToOctober} days`]].map(([l, d, now]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 12 }}>{l}</span>
              {now ? <span style={S.now}>NOW</span> : <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>{d}</span>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...S.card, marginTop: 14 }}>
        <div style={S.cardT}>Budget Settings</div>
        <div style={S.fg}>
          <div><div style={S.label}>Investment Budget</div><input style={S.input} type="number" value={data.budget} onChange={e => save({ ...data, budget: Number(e.target.value) || 0 })} /></div>
          <div><div style={S.label}>Target Return</div><input style={S.input} type="number" value={data.targetReturn} onChange={e => save({ ...data, targetReturn: Number(e.target.value) || 0 })} /></div>
        </div>
      </div>
      <div style={{ ...S.card, marginTop: 14 }}>
        <div style={S.cardT}>Oklahoma's 3-Sale Tax System</div>
        <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.7, marginBottom: 12 }}>Oklahoma has <strong style={{ color: "#e6a919" }}>three</strong> distinct buying opportunities each year, plus <Tip term="Over-the-Counter (OTC)">OTC</Tip> purchases between sales:</div>
        <div style={{ display: "grid", gap: 10 }}>
          {[{ n: "1", t: "October Tax Sale", d: "1st Monday of October", c: "#60a5fa", x: "Buy tax lien certificates at 8% annual interest. 2-year redemption period." },
          { n: "~", t: "OTC (Over-the-Counter)", d: "Available year-round", c: "#4ade80", x: "Unsold certificates from October assigned to county. Buy anytime from treasurer's office." },
          { n: "2", t: "June Resale Auction", d: "2nd Monday of June", c: "#f59e0b", x: "Properties unredeemed after 2+ years sold as tax deeds. Highest bidder gets fee simple ownership." },
          { n: "3", t: "Commissioner Sale", d: "Year-round", c: "#a78bfa", x: "Properties unsold at June Resale. County-owned, sold at price approved by commissioners." },
          ].map(s => (
            <div key={s.t} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 8, borderLeft: `3px solid ${s.c}` }}>
              <div style={{ color: s.c, fontWeight: 900, fontSize: 16, minWidth: 20 }}>{s.n}</div>
              <div><div style={{ fontWeight: 700, color: s.c, fontSize: 12 }}>{s.t} <span style={{ color: "#6b7280", fontWeight: 400 }}>— {s.d}</span></div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{s.x}</div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderBuyNow = () => (
    <>
      <div style={{ ...S.card, background: "linear-gradient(135deg,rgba(74,222,128,0.05),rgba(230,169,25,0.05))", border: "1px solid rgba(74,222,128,0.2)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>Buy Today — No Auction Required</div>
        <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
          Oklahoma law (<Tip term="Over-the-Counter (OTC)">68 O.S. § 3108</Tip>) allows <Tip term="Over-the-Counter (OTC)">OTC purchase</Tip> of unsold <Tip term="Tax Lien Certificate">tax lien certificates</Tip> anytime.
          <Tip term="Struck-Off Property">Struck-off properties</Tip> are available through <Tip term="Commissioner Sale">Commissioner Sales</Tip> year-round.
        </div>
      </div>
      {buyNowOptions.map(opt => (
        <div key={opt.type} style={{ ...S.card, marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e6a919" }}>{opt.type}</div><span style={S.now}>AVAILABLE NOW</span>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, marginBottom: 12 }}>{opt.desc}</div>
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e6a919", marginBottom: 6 }}>HOW TO BUY:</div>
            <div style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.6 }}>{opt.action}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 8 }}><div style={S.label}>Returns</div><div style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>{opt.returns}</div></div>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 8 }}><div style={S.label}>Risk</div><div style={{ fontSize: 12, color: riskLevels[opt.risk], fontWeight: 600 }}>{opt.risk}</div></div>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 8 }}><div style={S.label}>Min Invest</div><div style={{ fontSize: 12 }}>{opt.minInvest}</div></div>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 8 }}><div style={S.label}>Statute</div><div style={{ fontSize: 12, color: "#60a5fa" }}>{opt.statute}</div></div>
          </div>
          <div style={S.label}>Counties to Contact:</div>
          <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
            {opt.counties.map(c => (
              <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(0,0,0,0.15)", borderRadius: 6 }}>
                <div><span style={{ fontWeight: 600, fontSize: 12 }}>{c.name}</span><span style={{ fontSize: 11, color: "#6b7280", marginLeft: 8 }}>{c.addr}</span></div>
                <a href={`tel:${c.phone.replace(/-/g, "")}`} style={{ color: "#4ade80", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{c.phone}</a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  const renderProperties = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{data.properties.length} Properties</div>
        <button style={S.btn("primary")} onClick={() => setShowAddForm(true)}>+ Add</button>
      </div>
      {data.properties.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏚️</div>
          <div style={{ color: "#6b7280", marginBottom: 16 }}>No properties yet. Start with <Tip term="Over-the-Counter (OTC)">OTC certificates</Tip>!</div>
          <button style={S.btn("primary")} onClick={() => setShowAddForm(true)}>Add First Property</button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>{["Address", "County", "Type", "Cost", "Est. Value", "ROI", "Risk", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{data.properties.map(p => {
              const roi = p.minBid > 0 ? ((p.estimatedValue / p.minBid - 1) * 100).toFixed(0) : "—";
              const sc = statusColors[p.status] || statusColors["Researching"];
              return (<tr key={p.id} style={{ cursor: "pointer" }} onClick={() => handleEdit(p)}>
                <td style={S.td}><div style={{ fontWeight: 600, color: "#e6a919" }}>{p.address || "—"}</div><div style={{ fontSize: 10, color: "#6b7280" }}>{p.parcelId}</div></td>
                <td style={S.td}>{p.county}</td><td style={S.td}><span style={{ fontSize: 10, color: "#9ca3af" }}>{p.type || "Resale"}</span></td>
                <td style={S.td}>{fmt(p.minBid)}</td><td style={S.td}>{fmt(p.estimatedValue)}</td>
                <td style={{ ...S.td, color: Number(roi) > 50 ? "#4ade80" : Number(roi) > 0 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{roi}%</td>
                <td style={S.td}><span style={{ color: riskLevels[p.risk], fontWeight: 600 }}>{p.risk}</span></td>
                <td style={S.td}><span style={S.badge(sc.bg, sc.border, sc.text)}>{p.status}</span></td>
                <td style={S.td}><button style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }} onClick={e => { e.stopPropagation(); handleDelete(p.id); }}>✕</button></td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      )}
    </>
  );

  const filteredGlossary = glossary.filter(g => g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || g.def.toLowerCase().includes(glossarySearch.toLowerCase())).sort((a, b) => a.term.localeCompare(b.term));
  const renderGlossary = () => (
    <>
      <div style={{ ...S.card, marginBottom: 14 }}>
        <div style={S.cardT}>Tax Lien Glossary — {glossary.length} Terms</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Hover or tap any <span style={{ borderBottom: "1px dashed #e6a919", color: "#e6a919" }}>highlighted term</span> throughout the dashboard for quick definitions.</div>
        <input style={S.input} placeholder="Search terms..." value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)} />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {filteredGlossary.map(g => (
          <div key={g.term} style={{ ...S.card, marginBottom: 0, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, color: "#e6a919", fontSize: 13, marginBottom: 6 }}>{g.term}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>{g.def}</div>
          </div>
        ))}
      </div>
    </>
  );

  const renderChecklist = () => {
    const total = checklistItems.reduce((s, p) => s + p.items.length, 0);
    const done = Object.values(checklist).filter(Boolean).length;
    return (<>
      <div style={S.card}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={S.cardT}>Progress</div><div style={{ fontSize: 14, fontWeight: 700, color: "#e6a919" }}>{done}/{total}</div></div><div style={S.pbar}><div style={S.pfill((done / total) * 100, "#e6a919")} /></div></div>
      {checklistItems.map(phase => (
        <div key={phase.phase} style={S.card}>
          <div style={S.cardT}>{phase.icon} {phase.phase}</div>
          {phase.items.map(item => (
            <div key={item.key} style={S.chk} onClick={() => toggleCheck(item.key)}>
              <div style={S.chkBox(checklist[item.key])}>{checklist[item.key] && <span style={{ color: "#0a0a0f", fontSize: 12, fontWeight: 900 }}>✓</span>}</div>
              <span style={{ fontSize: 12, color: checklist[item.key] ? "#6b7280" : "#c9d1d9", textDecoration: checklist[item.key] ? "line-through" : "none" }}>{item.text}</span>
            </div>
          ))}
        </div>
      ))}
    </>);
  };

  const renderCalc = () => {
    const [c, sC] = useState({ bt: 1200, fees: 300, av: 15000, mv: 25000, ol: 0 });
    const tc = c.bt + c.fees + c.ol, mb23 = (c.av * 2) / 3, lmb = Math.min(mb23, tc), pr = c.mv - lmb, roi = lmb > 0 ? ((pr / lmb) * 100).toFixed(0) : 0;
    return (<>
      <div style={S.card}><div style={S.cardT}>Deal Calculator</div>
        <div style={S.fg}>
          <div><div style={S.label}><Tip term="Delinquent Taxes">Back Taxes</Tip></div><input style={S.input} type="number" value={c.bt} onChange={e => sC({ ...c, bt: Number(e.target.value) || 0 })} /></div>
          <div><div style={S.label}>Fees & Costs</div><input style={S.input} type="number" value={c.fees} onChange={e => sC({ ...c, fees: Number(e.target.value) || 0 })} /></div>
          <div><div style={S.label}><Tip term="Assessed Value">Assessed Value</Tip></div><input style={S.input} type="number" value={c.av} onChange={e => sC({ ...c, av: Number(e.target.value) || 0 })} /></div>
          <div><div style={S.label}>Est. Market Value</div><input style={S.input} type="number" value={c.mv} onChange={e => sC({ ...c, mv: Number(e.target.value) || 0 })} /></div>
          <div><div style={S.label}><Tip term="IRS Lien (Federal Tax Lien)">Surviving Liens</Tip></div><input style={S.input} type="number" value={c.ol} onChange={e => sC({ ...c, ol: Number(e.target.value) || 0 })} /></div>
        </div>
      </div>
      <div style={{ ...S.grid, gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        <div style={S.sc("#e6a919")}><div style={S.accent("#e6a919")} /><div style={S.label}>2/3 Assessed</div><div style={S.val("#e6a919")}>{fmt(mb23)}</div></div>
        <div style={S.sc("#60a5fa")}><div style={S.accent("#60a5fa")} /><div style={S.label}>Taxes+Fees</div><div style={S.val("#60a5fa")}>{fmt(tc)}</div></div>
        <div style={S.sc("#f59e0b")}><div style={S.accent("#f59e0b")} /><div style={S.label}><Tip term="Minimum Bid">Min Bid</Tip></div><div style={S.val("#f59e0b")}>{fmt(lmb)}</div><div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>Lesser of the two</div></div>
        <div style={S.sc(pr > 0 ? "#4ade80" : "#ef4444")}><div style={S.accent(pr > 0 ? "#4ade80" : "#ef4444")} /><div style={S.label}>Profit</div><div style={S.val(pr > 0 ? "#4ade80" : "#ef4444")}>{fmt(pr)}</div><div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}><Tip term="ROI (Return on Investment)">ROI</Tip>: {roi}%</div></div>
      </div>
    </>);
  };

  const renderCounties = () => (
    <>
      <div style={S.card}><div style={S.cardT}>Oklahoma County Directory</div><div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>All counties hold the <Tip term="Tax Sale (October)">October Tax Sale</Tip> and <Tip term="Resale (June)">June Resale</Tip> annually. <Tip term="Over-the-Counter (OTC)">OTC certificates</Tip> and <Tip term="Commissioner Sale">Commissioner Sale</Tip> properties may be available now.</div></div>
      <div style={{ display: "grid", gap: 10 }}>
        {counties.map(c => (
          <div key={c.name} style={{ ...S.card, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div><div style={{ fontWeight: 700, fontSize: 14, color: "#e6a919" }}>{c.name}</div><div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{c.addr}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}>June 8, 2026</div><div style={{ fontSize: 10, color: "#6b7280" }}>{daysToAuction} days</div></div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={S.badge("rgba(74,222,128,0.1)", "#4ade80", "#4ade80")}>OTC Now</span>
              <span style={S.badge("rgba(167,139,250,0.1)", "#a78bfa", "#a78bfa")}>Commissioner</span>
              <span style={S.badge("rgba(96,165,250,0.1)", "#60a5fa", "#60a5fa")}>Oct Sale</span>
            </div>
            <div style={{ fontSize: 12 }}>Treasurer: <a href={`tel:${c.phone.replace(/-/g, "")}`} style={{ color: "#60a5fa", textDecoration: "none" }}>{c.phone}</a>
              {c.delinqPhone !== c.phone && <span style={{ marginLeft: 12 }}>Delinquent: <a href={`tel:${c.delinqPhone.replace(/-/g, "")}`} style={{ color: "#60a5fa", textDecoration: "none" }}>{c.delinqPhone}</a></span>}
            </div>
            {c.website && <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#60a5fa", textDecoration: "none", display: "block", marginTop: 4 }}>{c.website}</a>}
          </div>
        ))}
      </div>
      <div style={{ ...S.card, marginTop: 14 }}><div style={S.cardT}>Research Links</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[["Tulsa Assessor", "https://assessor.tulsacounty.org/Property/Search"], ["Tulsa Properties for Sale", "https://www2.tulsacounty.org/treasurer/properties-for-sale/"], ["LOCCAT Map", "https://ais-usc-tulsacounty-web.azurewebsites.net/FullMapView"], ["OK County Treasurer", "https://docs.oklahomacounty.org/treasurer/PublicAccess.asp"], ["OK Tax Rolls", "https://www.oktaxrolls.com/"], ["Parcel Fair", "https://parcelfair.com/Oklahoma"], ["OK Statutes Title 68", "https://law.justia.com/codes/oklahoma/title-68/"]].map(([l, u]) => <a key={u} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{l}</a>)}
      </div></div>
    </>
  );

  const tabs = [["dashboard", "Dashboard"], ["buynow", "Buy Now"], ["properties", "Properties"], ["glossary", "Glossary"], ["checklist", "Checklist"], ["calculator", "Calculator"], ["counties", "Counties"]];

  return (
    <div style={S.app}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={S.logoIcon}>TL</div>
          <div><div style={{ fontSize: 22, fontWeight: 800, color: "#e6a919", letterSpacing: "-0.5px" }}>TAX LIEN PRO</div><div style={{ fontSize: 10, color: "#6b7280", letterSpacing: "2px", textTransform: "uppercase" }}>Oklahoma Investment Tracker</div></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: daysToAuction <= 30 ? "#ef4444" : daysToAuction <= 60 ? "#f59e0b" : "#4ade80", lineHeight: 1 }}>{daysToAuction}</div>
          <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase" }}>Days to June Resale</div>
        </div>
      </div>
      <div style={S.nav}>{tabs.map(([k, l]) => <button key={k} style={S.navBtn(activeTab === k)} onClick={() => setActiveTab(k)}>{k === "buynow" ? "🟢 " : ""}{l}</button>)}</div>
      <div style={S.content}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "buynow" && renderBuyNow()}
        {activeTab === "properties" && renderProperties()}
        {activeTab === "glossary" && renderGlossary()}
        {activeTab === "checklist" && renderChecklist()}
        {activeTab === "calculator" && renderCalc()}
        {activeTab === "counties" && renderCounties()}
      </div>
      {showAddForm && (
        <div style={S.overlay} onClick={resetForm}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e6a919" }}>{editingId ? "Edit" : "Add"} Property</div>
              <button style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280", fontSize: 16, border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }} onClick={resetForm}>✕</button>
            </div>
            <div style={S.fg}>
              <div><div style={S.label}><Tip term="Parcel ID">Parcel ID</Tip></div><input style={S.input} value={form.parcelId} onChange={e => setForm({ ...form, parcelId: e.target.value })} placeholder="e.g. 12345-67-89" /></div>
              <div><div style={S.label}>Address</div><input style={S.input} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St" /></div>
              <div><div style={S.label}>County</div><select style={S.select} value={form.county} onChange={e => setForm({ ...form, county: e.target.value })}>{counties.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select></div>
              <div><div style={S.label}>Purchase Type</div><select style={S.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["OTC Certificate", "Resale (June)", "Commissioner Sale", "October Tax Sale"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><div style={S.label}>Acreage</div><input style={S.input} value={form.acreage} onChange={e => setForm({ ...form, acreage: e.target.value })} placeholder="0.25" /></div>
              <div><div style={S.label}><Tip term="Zoning">Zoning</Tip></div><input style={S.input} value={form.zoning} onChange={e => setForm({ ...form, zoning: e.target.value })} placeholder="Residential..." /></div>
              <div><div style={S.label}><Tip term="Assessed Value">Assessed Value</Tip></div><input style={S.input} type="number" value={form.assessedValue} onChange={e => setForm({ ...form, assessedValue: e.target.value })} /></div>
              <div><div style={S.label}><Tip term="Minimum Bid">Cost / Min Bid</Tip></div><input style={S.input} type="number" value={form.minBid} onChange={e => setForm({ ...form, minBid: e.target.value })} /></div>
              <div><div style={S.label}>Est. Market Value</div><input style={S.input} type="number" value={form.estimatedValue} onChange={e => setForm({ ...form, estimatedValue: e.target.value })} /></div>
              <div><div style={S.label}>Status</div><select style={S.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><div style={S.label}>Risk</div><select style={S.select} value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })}>{Object.keys(riskLevels).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
              <div><div style={S.label}><Tip term="Encumbrance">Known Liens</Tip></div><input style={S.input} value={form.liens} onChange={e => setForm({ ...form, liens: e.target.value })} placeholder="IRS, municipal..." /></div>
              <div style={{ gridColumn: "1/-1" }}><div style={S.label}>Notes</div><textarea style={{ ...S.input, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Drive-by notes..." /></div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={S.btn()} onClick={resetForm}>Cancel</button>
              <button style={S.btn("primary")} onClick={handleSaveProperty}>{editingId ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
