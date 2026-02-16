import { useState, useEffect, useCallback } from "react";

/* ─── GLOSSARY ─── */
const glossary = [
  { term: "Ad Valorem Tax", def: "Latin for 'according to value.' Property taxes based on the assessed value of real estate. This is what creates the lien when unpaid." },
  { term: "Assessed Value", def: "The dollar value a county assessor assigns to a property for tax purposes. Usually a fraction of actual market value." },
  { term: "Tax Lien", def: "A legal claim placed on property when the owner fails to pay property taxes. Must be satisfied before the property can be sold with clear title." },
  { term: "Tax Lien Certificate", def: "A document proving you purchased the right to collect delinquent taxes plus interest. If unredeemed, you can pursue the property." },
  { term: "Tax Lien State", def: "A state where investors buy the tax debt (lien), not the property itself. The owner keeps the property but owes you. You earn interest when they pay." },
  { term: "Tax Deed State", def: "A state where the county sells the actual property at auction to recover unpaid taxes. The winning bidder gets ownership (a deed)." },
  { term: "Hybrid State", def: "A state that uses both tax lien certificates AND tax deed sales. Oklahoma is a hybrid — October is a lien sale, June is a deed sale." },
  { term: "Tax Sale (October)", def: "Oklahoma's first sale, held 1st Monday of October. Investors buy tax lien certificates at 8% interest with a 2-year redemption period." },
  { term: "Over-the-Counter (OTC)", def: "Tax lien certificates that went unsold at auction. Assigned to the county and available for direct purchase from the treasurer's office — often year-round." },
  { term: "Resale (June)", def: "Oklahoma's second sale, held 2nd Monday of June. Properties unredeemed after 2 years auctioned as tax deeds to highest bidder. You get actual ownership." },
  { term: "Commissioner Sale", def: "Third buying opportunity. Properties unsold at June Resale become county-owned, sold at a price approved by the Board of County Commissioners. Year-round." },
  { term: "Struck-Off Property", def: "Property that received no bids at auction and was 'struck off' (assigned) to the county. Sold through Commissioner Sales." },
  { term: "Redemption Period", def: "The window during which a property owner can pay back taxes plus penalties to reclaim their property. Varies by state (6 months to 3 years)." },
  { term: "Tax Deed", def: "A deed transferring actual ownership (fee simple title) of property to the buyer. Much stronger than a lien certificate." },
  { term: "Fee Simple Title", def: "The most complete form of property ownership. A tax deed from a resale grants this level of title to the buyer." },
  { term: "Minimum Bid", def: "The lowest acceptable bid at auction. In Oklahoma's June Resale: the LESSER of (a) 2/3 assessed value OR (b) total delinquent taxes + interest + fees." },
  { term: "Delinquent Taxes", def: "Property taxes that are past due and unpaid. Triggers vary by state — typically 1-3 years before a sale occurs." },
  { term: "Special Assessment", def: "Extra charges on a property for services like mowing, cleaning, or nuisance abatement. Added to the tax bill and create additional liens." },
  { term: "Quiet Title Action", def: "A lawsuit to establish clear ownership and remove competing claims. Sometimes needed after a tax sale to get title insurance." },
  { term: "Due Diligence", def: "Research before buying — checking liens, inspecting property, verifying zoning, assessing market value, confirming no environmental issues." },
  { term: "IRS Lien (Federal Tax Lien)", def: "A lien by the IRS for unpaid federal taxes. CRITICAL: Can survive a tax sale. The IRS has 120 days after sale to redeem." },
  { term: "Encumbrance", def: "Any claim, lien, or restriction on property that may affect value or use. Mortgages, liens, and easements are all encumbrances." },
  { term: "Parcel ID", def: "A unique ID number assigned to every piece of property by the county assessor. Used to look up tax records and ownership." },
  { term: "ROI (Return on Investment)", def: "Profit divided by cost, as a percentage. Buy for $1,000, earn $1,080 back = 8% ROI." },
  { term: "Wholesaling", def: "Buying a property or lien and quickly reselling to another investor for profit without improving it." },
  { term: "Title Search", def: "Research into ownership history and any liens/encumbrances. Essential before buying at a tax sale." },
  { term: "Bid-Down Method", def: "Auction style where investors bid DOWN the interest rate they'll accept. Used in Florida and Arizona. Starts at max rate, lowest bid wins." },
  { term: "Premium Bid", def: "Auction style where investors bid UP the price above the minimum. The overbid amount may go to the original owner." },
  { term: "Right of Redemption", def: "The legal right of a property owner to reclaim their property after a tax sale by paying all owed amounts plus penalties and interest." },
  { term: "LOCCAT", def: "Tulsa County's online mapping tool combining land records from the County Clerk, Assessor, and Treasurer into one searchable map." },
  { term: "Flood Zone", def: "An area designated by FEMA with higher flood risk. May require expensive insurance and be harder to resell." },
  { term: "Zoning", def: "Local rules dictating how property can be used — residential, commercial, industrial, agricultural. Affects what you can do after purchase." },
  { term: "Assignment", def: "Transfer of a tax lien certificate from one investor to another. Must be recorded with the county treasurer." },
  { term: "Endorsement", def: "Adding subsequent years' delinquent taxes to an existing certificate. Increases investment and potential return." },
  { term: "Overbid / Premium", def: "Amount a winning bid exceeds the minimum. Excess may go back to the original property owner." },
  { term: "Redeemable Deed", def: "Used in states like Georgia and Texas. You get a deed but the original owner can redeem within a set period, paying you interest." },
];

/* ─── NATIONAL STATES DATA ─── */
const nationalStates = [
  { state: "Florida", type: "Tax Lien", maxRate: "18%", redemption: "2 years", bidMethod: "Bid-down", otc: true, online: true, platform: "RealAuction / LienHub", saleMonth: "May-June", notes: "Largest tax lien market. 67 counties, all online. Unsold certs struck to county at 18% — buy OTC.", link: "https://www.realauction.com" },
  { state: "Arizona", type: "Tax Lien", maxRate: "16%", redemption: "3 years", bidMethod: "Bid-down", otc: true, online: true, platform: "RealAuction", saleMonth: "February", notes: "42,000+ OTC liens available via Parcel Fair. Maricopa County alone has thousands. All online.", link: "https://maricopa.arizonataxsale.com" },
  { state: "Georgia", type: "Redeemable Deed", maxRate: "20%", redemption: "1 year", bidMethod: "Premium bid", otc: true, online: false, platform: "Courthouse steps", saleMonth: "Varies by county", notes: "20% flat penalty on redemption. Short 1-year period. You get a deed but owner can redeem.", link: "" },
  { state: "New Jersey", type: "Tax Lien", maxRate: "18%", redemption: "2 years", bidMethod: "Bid-down + Premium", otc: true, online: true, platform: "GovEase / RealAuction", saleMonth: "October-December", notes: "High property values = larger certificate amounts. Strong market.", link: "https://www.govease.com" },
  { state: "Indiana", type: "Tax Lien", maxRate: "25%", redemption: "1 year", bidMethod: "Bid-down", otc: true, online: true, platform: "SRI Inc.", saleMonth: "August-October", notes: "Highest rate in the country at 25%. Strong rural opportunities.", link: "https://www.sriservices.com" },
  { state: "Iowa", type: "Tax Lien", maxRate: "24%", redemption: "1 yr 9 mo", bidMethod: "Random", otc: true, online: false, platform: "County treasurer", saleMonth: "June", notes: "24% annual rate. Less competition in rural counties.", link: "" },
  { state: "Alabama", type: "Tax Lien", maxRate: "12%", redemption: "3 years", bidMethod: "Bid-down", otc: true, online: true, platform: "GovEase", saleMonth: "March-June", notes: "12% interest. GovEase handles many county auctions online.", link: "https://www.govease.com" },
  { state: "Colorado", type: "Tax Lien", maxRate: "18%", redemption: "3 years", bidMethod: "Bid-down", otc: true, online: true, platform: "RealAuction", saleMonth: "October-December", notes: "Strong property values in Denver metro. Most counties online.", link: "https://www.realauction.com" },
  { state: "Oklahoma", type: "Hybrid", maxRate: "8%", redemption: "2 years", bidMethod: "Random draw / Highest", otc: true, online: false, platform: "In-person + Treasurer", saleMonth: "Oct (lien) / June (deed)", notes: "YOUR HOME STATE. Lower rate but less competition. OTC + Commissioner Sales available NOW.", link: "https://www2.tulsacounty.org/treasurer/" },
  { state: "Texas", type: "Redeemable Deed", maxRate: "25%", redemption: "6 mo - 2 yr", bidMethod: "Highest bidder", otc: false, online: true, platform: "County / MVBA", saleMonth: "Monthly varies", notes: "25% penalty in first year. Deed states give you ownership. Monthly sales in many counties.", link: "https://mvbalaw.com/tax-sales/month-sales/" },
  { state: "Illinois", type: "Tax Lien", maxRate: "18%", redemption: "2-3 years", bidMethod: "Bid-down", otc: true, online: true, platform: "Varies by county", saleMonth: "October-November", notes: "Cook County (Chicago) is massive. 18% max rate.", link: "" },
  { state: "South Carolina", type: "Tax Lien", maxRate: "12%", redemption: "1 year", bidMethod: "Bid-down", otc: true, online: false, platform: "County treasurer", saleMonth: "October-December", notes: "Short 1-year redemption. If unredeemed, you file for deed.", link: "" },
];

/* ─── ONLINE PLATFORMS ─── */
const platforms = [
  { name: "RealAuction", url: "https://www.realauction.com", states: "FL, AZ, CO, NJ, and more", desc: "Major online tax lien auction platform. Handles annual sales for hundreds of counties. Free to register and research." },
  { name: "LienHub", url: "https://lienhub.com", states: "FL (many counties)", desc: "Florida-focused. Buy tax certificates and county-held OTC certificates online. Pinellas, Charlotte, and other FL counties." },
  { name: "GovEase", url: "https://www.govease.com", states: "AL, NJ, LA, and growing", desc: "Online tax lien and deed auction platform. Growing list of counties. Registration is free." },
  { name: "Parcel Fair", url: "https://parcelfair.com", states: "AZ, OK, and expanding", desc: "Research and map tool for tax liens/deeds. 42,000+ Arizona OTC properties. Step-by-step county purchase guides." },
  { name: "Grant Street Group", url: "https://www.grantstreet.com/tax-sales/", states: "PA, MD, and others", desc: "Handles online tax sales for various municipalities and counties." },
  { name: "SRI Inc.", url: "https://www.sriservices.com", states: "IN", desc: "Manages Indiana's online tax lien sales across many counties." },
  { name: "OK Tax Rolls", url: "https://oktaxrolls.com", states: "OK (all 77 counties)", desc: "Search delinquent tax records across every Oklahoma county. Free." },
  { name: "Tulsa County Properties", url: "https://www2.tulsacounty.org/treasurer/properties-for-sale/county-properties/properties-for-sale-list/", states: "OK (Tulsa)", desc: "Tulsa County's online list of county-owned properties for sale. Includes bid form download." },
  { name: "OK County Treasurer", url: "https://docs.oklahomacounty.org/treasurer/PublicAccess.asp", states: "OK (Oklahoma County)", desc: "Public access search for Oklahoma County properties. Active resale listings available." },
];

/* ─── OK COUNTIES ─── */
const counties = [
  { name: "Tulsa County", phone: "918-596-5071", delinqPhone: "918-596-5070", addr: "218 W. 6th St., 8th Fl, Tulsa OK 74119", website: "www2.tulsacounty.org/treasurer" },
  { name: "Oklahoma County", phone: "405-713-1300", delinqPhone: "405-713-1300", addr: "320 Robert S. Kerr Ave, OKC OK", website: "docs.oklahomacounty.org/treasurer" },
  { name: "Rogers County", phone: "918-923-4960", delinqPhone: "918-923-4960", addr: "219 S. Missouri, Claremore OK", website: "" },
  { name: "Wagoner County", phone: "918-485-2149", delinqPhone: "918-485-2149", addr: "307 E. Cherokee St, Wagoner OK", website: "" },
  { name: "Creek County", phone: "918-224-4509", delinqPhone: "918-224-4509", addr: "222 E. Dewey, Sapulpa OK", website: "" },
  { name: "Okmulgee County", phone: "918-756-3848", delinqPhone: "918-756-3848", addr: "314 W. 7th St, Okmulgee OK", website: "" },
  { name: "Comanche County", phone: "580-355-5786", delinqPhone: "580-355-5786", addr: "315 SW 5th St, Lawton OK", website: "" },
];

/* ─── BUY NOW ─── */
const buyNowOptions = [
  { type: "OK — OTC Tax Lien Certificates", desc: "Unsold certificates from Oklahoma's October 2025 Tax Sale. Buy directly from any county treasurer. Earns 8% per annum, 2-year redemption.", action: "Call the county treasurer and ask for their list of unsold/county-held tax lien certificates available for assignment.", returns: "8% per annum", risk: "Low", statute: "68 O.S. § 3108",
    counties: [{ name: "Tulsa County", phone: "918-596-5071" }, { name: "Oklahoma County", phone: "405-713-1300" }, { name: "Rogers County", phone: "918-923-4960" }, { name: "Creek County", phone: "918-224-4509" }, { name: "Wagoner County", phone: "918-485-2149" }, { name: "Okmulgee County", phone: "918-756-3848" }] },
  { type: "OK — County-Owned Properties", desc: "Properties unsold at June Resale, now county-owned. Sold at price approved by County Commissioners. You get a tax deed (ownership).", action: "Visit Tulsa County's online properties list or call the delinquent tax department.", returns: "Unlimited — ownership at discount", risk: "Medium", statute: "68 O.S. § 3135",
    counties: [{ name: "Tulsa County", phone: "918-596-5070", link: "www2.tulsacounty.org/treasurer/properties-for-sale/county-properties/properties-for-sale-list/" }, { name: "Oklahoma County", phone: "405-713-1300" }] },
  { type: "AZ — OTC Tax Liens (Online)", desc: "Arizona has 42,000+ OTC tax liens available across multiple counties. Up to 16% interest. Many purchasable online through county treasurer sites or Parcel Fair.", action: "Visit parcelfair.com/Arizona to browse OTC liens by county with map search. Or go directly to county treasurer sites.", returns: "Up to 16% per annum", risk: "Low-Medium", statute: "A.R.S. 42-18114",
    counties: [{ name: "Maricopa County", phone: "602-506-8511", link: "treasurer.maricopa.gov" }, { name: "Pima County", phone: "520-724-8341", link: "to.pima.gov" }, { name: "Browse All AZ OTC", phone: "", link: "parcelfair.com/Arizona" }] },
  { type: "FL — County-Held Certificates", desc: "Florida certificates that went unsold are struck to the county at the full 18% interest rate. Available first-come-first-served from tax collector offices.", action: "Contact county tax collectors or use LienHub.com for online OTC purchases.", returns: "18% per annum (full rate)", risk: "Low", statute: "F.S. 197.432",
    counties: [{ name: "Nassau County FL", phone: "904-548-4660", link: "nassautaxes.com" }, { name: "Pinellas County FL", phone: "727-464-7777", link: "lienhub.com" }, { name: "Browse FL Counties", phone: "", link: "lienhub.com" }] },
];

const statusColors = { "Researching": { bg: "#1a1a2e", border: "#e6a919", text: "#e6a919" }, "Target": { bg: "#1a2e1a", border: "#4ade80", text: "#4ade80" }, "Bid Placed": { bg: "#1a1a2e", border: "#60a5fa", text: "#60a5fa" }, "Won": { bg: "#0a2a0a", border: "#22c55e", text: "#22c55e" }, "Flipped": { bg: "#2a1a0a", border: "#f59e0b", text: "#f59e0b" }, "Pass": { bg: "#1a0a0a", border: "#ef4444", text: "#ef4444" } };
const riskLevels = { "Low": "#22c55e", "Medium": "#f59e0b", "High": "#ef4444" };

function fmt(v) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0); }
function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 864e5); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

function Tip({ term, children }) {
  const [show, setShow] = useState(false);
  const entry = glossary.find(g => g.term.toLowerCase() === (term || "").toLowerCase());
  if (!entry) return children || term;
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      <span style={{ borderBottom: "1px dashed #e6a919", color: "#e6a919", cursor: "help", fontWeight: 600 }}>{children || term}</span>
      {show && <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#1a1f2e", border: "1px solid #e6a919", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#c9d1d9", width: 280, zIndex: 999, lineHeight: 1.5, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
        <span style={{ fontWeight: 700, color: "#e6a919", display: "block", marginBottom: 4 }}>{entry.term}</span>{entry.def}
        <span style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 10, height: 10, background: "#1a1f2e", borderRight: "1px solid #e6a919", borderBottom: "1px solid #e6a919" }} />
      </span>}
    </span>
  );
}

export default function TaxLienDashboard() {
  const [data, setData] = useState({ properties: [], budget: 3000, targetReturn: 5000 });
  const [tab, setTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [gSearch, setGSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const ef = { parcelId: "", address: "", county: "Tulsa County", assessedValue: "", minBid: "", estimatedValue: "", status: "Researching", risk: "Medium", notes: "", liens: "", zoning: "", acreage: "", type: "Resale", state: "OK" };
  const [form, setForm] = useState(ef);

  useEffect(() => { try { const s = localStorage.getItem("tlp3"); if (s) setData(JSON.parse(s)); } catch {} }, []);
  const save = useCallback((d) => { setData(d); try { localStorage.setItem("tlp3", JSON.stringify(d)); } catch {} }, []);
  const resetForm = () => { setForm(ef); setEditId(null); setShowForm(false); };
  const saveProperty = () => { if (!form.address) return; const p = { ...form, id: editId || uid(), assessedValue: Number(form.assessedValue) || 0, minBid: Number(form.minBid) || 0, estimatedValue: Number(form.estimatedValue) || 0 }; save({ ...data, properties: editId ? data.properties.map(x => x.id === editId ? p : x) : [...data.properties, p] }); resetForm(); };
  const editProp = (p) => { setForm({ ...p, assessedValue: p.assessedValue + "", minBid: p.minBid + "", estimatedValue: p.estimatedValue + "" }); setEditId(p.id); setShowForm(true); };
  const delProp = (id) => save({ ...data, properties: data.properties.filter(p => p.id !== id) });

  const invested = data.properties.filter(p => ["Bid Placed", "Won"].includes(p.status)).reduce((s, p) => s + p.minBid, 0);
  const estVal = data.properties.filter(p => ["Won", "Target"].includes(p.status)).reduce((s, p) => s + p.estimatedValue, 0);
  const flipped = data.properties.filter(p => p.status === "Flipped").reduce((s, p) => s + (p.estimatedValue - p.minBid), 0);
  const remain = data.budget - invested;
  const targets = data.properties.filter(p => p.status === "Target").length;
  const dJune = daysUntil("2026-06-08"), dOct = daysUntil("2026-10-05");

  const [cl, setCl] = useState(() => { try { return JSON.parse(localStorage.getItem("tlp3-cl")) || {}; } catch { return {}; } });
  const togCl = (k) => { const n = { ...cl, [k]: !cl[k] }; setCl(n); try { localStorage.setItem("tlp3-cl", JSON.stringify(n)); } catch {} };
  const clItems = [
    { p: "DO RIGHT NOW", i: "🟢", items: [{ k: "n1", t: "Call Tulsa County Treasurer (918-596-5071) — OTC certificates" }, { k: "n2", t: "Call Delinquent Tax Dept (918-596-5070) — county-owned list" }, { k: "n3", t: "Browse Tulsa county properties online: tulsacounty.org/treasurer/properties-for-sale" }, { k: "n4", t: "Browse Arizona OTC liens at parcelfair.com/Arizona" }, { k: "n5", t: "Check LienHub.com for Florida county-held certificates" }, { k: "n6", t: "Register on RealAuction.com and GovEase.com (free)" }, { k: "n7", t: "Open dedicated bank account" }] },
    { p: "RESEARCH (Now-May)", i: "📋", items: [{ k: "c1", t: "Study LOCCAT mapping tool" }, { k: "c2", t: "Practice Tulsa County Assessor search" }, { k: "c3", t: "Research past auction results" }, { k: "c4", t: "Learn to identify IRS liens, environmental issues" }, { k: "c5", t: "Build investor buyer list" }, { k: "c6", t: "Study statutes: OK Title 68 Art. 31 / FL Ch. 197 / AZ Title 42 Ch. 18" }] },
    { p: "LIST DROPS (May 15)", i: "📦", items: [{ k: "c10", t: "Download June Resale list from Treasurer" }, { k: "c11", t: "Pre-register at Treasurer's Office" }, { k: "c12", t: "Pre-deposit funds ($500 min)" }, { k: "c13", t: "Drive by every target property" }, { k: "c14", t: "Run title searches" }, { k: "c15", t: "Set max bids for top 10-15 targets" }] },
    { p: "JUNE RESALE (June 8)", i: "🔨", items: [{ k: "c18", t: "Arrive early — scope competition" }, { k: "c19", t: "Stick to max bid limits" }, { k: "c20", t: "Cash/cashier's check ready" }] },
    { p: "FL/AZ ONLINE SALES", i: "🌐", items: [{ k: "f1", t: "FL certificates: May-June (bid down from 18%)" }, { k: "f2", t: "AZ liens: February (bid down from 16%)" }, { k: "f3", t: "Register 2-3 weeks before each sale" }, { k: "f4", t: "Set proxy bids at your minimum acceptable rate" }] },
    { p: "OCTOBER SALE (Oct 5)", i: "🗓️", items: [{ k: "o1", t: "Attend OK October Tax Sale for 8% certificates" }, { k: "o2", t: "Same due diligence as June" }] },
  ];

  const S = {
    app: { fontFamily: "'JetBrains Mono','Fira Code',monospace", background: "linear-gradient(160deg,#0a0a0f 0%,#0d1117 40%,#0a0f1a 100%)", color: "#c9d1d9", minHeight: "100vh" },
    hdr: { background: "linear-gradient(90deg,rgba(230,169,25,0.08),transparent 60%)", borderBottom: "1px solid rgba(230,169,25,0.2)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
    logo: { width: 40, height: 40, background: "linear-gradient(135deg,#e6a919,#f59e0b)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#0a0a0f" },
    nav: { display: "flex", gap: 2, padding: "0 12px", background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" },
    nb: (a) => ({ padding: "12px 12px", background: a ? "rgba(230,169,25,0.1)" : "transparent", border: "none", borderBottom: a ? "2px solid #e6a919" : "2px solid transparent", color: a ? "#e6a919" : "#6b7280", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "inherit", whiteSpace: "nowrap" }),
    ct: { padding: "20px" },
    g: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 20 },
    sc: (c) => ({ background: "rgba(255,255,255,0.02)", border: `1px solid ${c}22`, borderRadius: 12, padding: "16px", position: "relative", overflow: "hidden" }),
    ac: (c) => ({ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c }),
    lb: { fontSize: 10, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 },
    vl: (c) => ({ fontSize: 22, fontWeight: 800, color: c || "#c9d1d9" }),
    cd: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px", marginBottom: 14 },
    ct2: { fontSize: 13, fontWeight: 700, color: "#e6a919", marginBottom: 14, letterSpacing: "0.5px" },
    th: { textAlign: "left", padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 10, letterSpacing: "1px", textTransform: "uppercase" },
    td: { padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 },
    bg: (b, r, t) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: b, border: `1px solid ${r}`, color: t, fontSize: 10, fontWeight: 600 }),
    bt: (v) => ({ padding: "8px 16px", borderRadius: 8, border: v === "p" ? "1px solid #e6a919" : "1px solid rgba(255,255,255,0.1)", background: v === "p" ? "rgba(230,169,25,0.15)" : "rgba(255,255,255,0.03)", color: v === "p" ? "#e6a919" : "#c9d1d9", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }),
    ip: { width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#c9d1d9", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    sl: { width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#c9d1d9", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    fg: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    pb: { width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" },
    pf: (p, c) => ({ width: `${Math.min(p, 100)}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.5s" }),
    ck: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" },
    cb: (on) => ({ width: 18, height: 18, borderRadius: 4, border: `1px solid ${on ? "#e6a919" : "rgba(255,255,255,0.15)"}`, background: on ? "#e6a919" : "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }),
    ov: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
    md: { background: "#12151e", border: "1px solid rgba(230,169,25,0.2)", borderRadius: 16, padding: "24px", width: "100%", maxWidth: 600, maxHeight: "85vh", overflow: "auto" },
    nw: { display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "rgba(74,222,128,0.15)", border: "1px solid #4ade80", color: "#4ade80", fontSize: 10, fontWeight: 700, letterSpacing: "1px", animation: "pulse 2s infinite" },
    lk: { color: "#60a5fa", textDecoration: "none", fontSize: 12 },
  };

  const typeColor = { "Tax Lien": "#60a5fa", "Tax Deed": "#f59e0b", "Hybrid": "#a78bfa", "Redeemable Deed": "#4ade80" };

  /* ─── DASHBOARD ─── */
  const rDash = () => (<>
    <div style={{ ...S.cd, background: "linear-gradient(135deg,rgba(74,222,128,0.05),rgba(230,169,25,0.05))", border: "1px solid rgba(74,222,128,0.2)", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>Available RIGHT NOW — Multiple States</div><span style={S.nw}>BUY TODAY</span></div>
      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>Oklahoma <Tip term="Over-the-Counter (OTC)">OTC certificates</Tip>, Arizona OTC liens (16%), Florida county-held certs (18%), and <Tip term="Commissioner Sale">county-owned properties</Tip> — all purchasable today without waiting for an auction.</div>
      <button style={{ ...S.bt("p"), marginTop: 12 }} onClick={() => setTab("buynow")}>See What's Available Now</button>
    </div>
    <div style={S.g}>
      <div style={S.sc("#e6a919")}><div style={S.ac("#e6a919")} /><div style={S.lb}>Budget</div><div style={S.vl("#e6a919")}>{fmt(data.budget)}</div><div style={{ marginTop: 6 }}><div style={{ ...S.lb, marginBottom: 3 }}>Remaining: {fmt(remain)}</div><div style={S.pb}><div style={S.pf((remain / data.budget) * 100, "#e6a919")} /></div></div></div>
      <div style={S.sc("#4ade80")}><div style={S.ac("#4ade80")} /><div style={S.lb}>Targets</div><div style={S.vl("#4ade80")}>{targets}</div><div style={{ ...S.lb, marginTop: 6 }}>Est: {fmt(estVal)}</div></div>
      <div style={S.sc("#60a5fa")}><div style={S.ac("#60a5fa")} /><div style={S.lb}>Invested</div><div style={S.vl("#60a5fa")}>{fmt(invested)}</div></div>
      <div style={S.sc("#f59e0b")}><div style={S.ac("#f59e0b")} /><div style={S.lb}>Profit</div><div style={S.vl(flipped >= 0 ? "#4ade80" : "#ef4444")}>{fmt(flipped)}</div><div style={{ ...S.lb, marginTop: 6 }}>Goal: {fmt(data.targetReturn - data.budget)}</div></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div style={S.cd}><div style={S.ct2}>Quick Actions</div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button style={S.bt("p")} onClick={() => { setShowForm(true); setTab("properties"); }}>+ Add Property</button>
        <button style={S.bt()} onClick={() => window.open("https://assessor.tulsacounty.org/Property/Search")}>Tulsa Assessor</button>
        <button style={S.bt()} onClick={() => window.open("https://parcelfair.com/Arizona")}>AZ OTC Liens</button>
        <button style={S.bt()} onClick={() => window.open("https://lienhub.com")}>FL LienHub</button>
        <button style={S.bt()} onClick={() => window.open("https://oktaxrolls.com")}>OK Tax Rolls</button>
      </div></div>
      <div style={S.cd}><div style={S.ct2}>Key Dates</div>
        [["OTC / Commissioner (OK)", null, true], ["AZ/FL OTC Liens", null, true], ["OK June Resale List", "~May 15"], ["OK June Resale", `${dJune}d`], ["FL Cert Sale", "May-Jun"], ["OK October Sale", `${dOct}d`]].map(([l, d, n]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 11 }}>{l}</span>{n ? <span style={S.nw}>NOW</span> : <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>{d}</span>}
          </div>))}
      </div>
    </div>
    <div style={{ ...S.cd, marginTop: 14 }}><div style={S.ct2}>Budget</div><div style={S.fg}>
      <div><div style={S.lb}>Investment Budget</div><input style={S.ip} type="number" value={data.budget} onChange={e => save({ ...data, budget: Number(e.target.value) || 0 })} /></div>
      <div><div style={S.lb}>Target Return</div><input style={S.ip} type="number" value={data.targetReturn} onChange={e => save({ ...data, targetReturn: Number(e.target.value) || 0 })} /></div>
    </div></div>
    <div style={{ ...S.cd, marginTop: 14 }}><div style={S.ct2}>Oklahoma's 3-Sale System + Nationwide</div>
      <div style={{ display: "grid", gap: 10 }}>
        [{ n: "1", t: "October Tax Sale (OK)", d: "1st Mon Oct", c: "#60a5fa", x: "Lien certificates at 8%. 2-yr redemption." }, { n: "~", t: "OTC Purchase (OK/AZ/FL)", d: "Year-round", c: "#4ade80", x: "Unsold certs from any state. Buy direct from treasurer — up to 18% in FL." }, { n: "2", t: "June Resale (OK)", d: "2nd Mon June", c: "#f59e0b", x: "Tax deeds. Highest bidder gets fee simple ownership." }, { n: "3", t: "Commissioner Sale (OK)", d: "Year-round", c: "#a78bfa", x: "County-owned properties at negotiated prices." }, { n: "🌐", t: "Online Auctions (FL/AZ/CO/NJ)", d: "Varies", c: "#ec4899", x: "Bid from home via RealAuction, GovEase, LienHub. Up to 25% returns." }].map(s => (
          <div key={s.t} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 8, borderLeft: `3px solid ${s.c}` }}>
            <div style={{ color: s.c, fontWeight: 900, fontSize: 16, minWidth: 20 }}>{s.n}</div>
            <div><div style={{ fontWeight: 700, color: s.c, fontSize: 12 }}>{s.t} <span style={{ color: "#6b7280", fontWeight: 400 }}>— {s.d}</span></div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{s.x}</div></div>
          </div>))}
      </div>
    </div>
  </>);

  /* ─── BUY NOW ─── */
  const rBuy = () => (<>
    <div style={{ ...S.cd, background: "linear-gradient(135deg,rgba(74,222,128,0.05),rgba(230,169,25,0.05))", border: "1px solid rgba(74,222,128,0.2)" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>Buy Today — No Auction Wait</div>
      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>Oklahoma, Arizona, and Florida all have <Tip term="Over-the-Counter (OTC)">OTC</Tip> options available right now. You can purchase from home for AZ and FL.</div>
    </div>
    {buyNowOptions.map(opt => (
      <div key={opt.type} style={{ ...S.cd, marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#e6a919" }}>{opt.type}</div><span style={S.nw}>NOW</span></div>
        <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, marginBottom: 12 }}>{opt.desc}</div>
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 12, marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#e6a919", marginBottom: 6 }}>HOW TO BUY:</div><div style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.6 }}>{opt.action}</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8, marginBottom: 12 }}>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 8 }}><div style={S.lb}>Returns</div><div style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>{opt.returns}</div></div>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 8 }}><div style={S.lb}>Risk</div><div style={{ fontSize: 12, color: riskLevels[opt.risk] || "#f59e0b", fontWeight: 600 }}>{opt.risk}</div></div>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 8 }}><div style={S.lb}>Statute</div><div style={{ fontSize: 12, color: "#60a5fa" }}>{opt.statute}</div></div>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {opt.counties.map(c => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(0,0,0,0.15)", borderRadius: 6, flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{c.name}</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {c.phone && <a href={`tel:${c.phone.replace(/-/g, "")}`} style={{ color: "#4ade80", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{c.phone}</a>}
                {c.link && <a href={c.link.startsWith("http") ? c.link : `https://${c.link}`} target="_blank" rel="noopener noreferrer" style={S.lk}>Visit Site →</a>}
              </div>
            </div>))}
        </div>
      </div>))}
  </>);

  /* ─── NATIONAL ─── */
  const fStates = stateFilter === "all" ? nationalStates : nationalStates.filter(s => s.type === stateFilter);
  const rNational = () => (<>
    <div style={S.cd}><div style={S.ct2}>National Tax Lien & Deed Map — {nationalStates.length} States</div>
      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 12 }}>You're not limited to Oklahoma. Invest in <Tip term="Tax Lien State">tax lien</Tip>, <Tip term="Tax Deed State">tax deed</Tip>, or <Tip term="Hybrid State">hybrid</Tip> states nationwide — many with online auctions you can bid from home.</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["all", "Tax Lien", "Tax Deed", "Hybrid", "Redeemable Deed"].map(f => (
          <button key={f} onClick={() => setStateFilter(f)} style={{ ...S.bt(stateFilter === f ? "p" : ""), fontSize: 11, padding: "6px 12px" }}>{f === "all" ? "All" : f}s</button>))}
      </div>
    </div>
    <div style={{ display: "grid", gap: 10 }}>
      {fStates.map(s => (
        <div key={s.state} style={{ ...S.cd, marginBottom: 0, borderLeft: `3px solid ${typeColor[s.type] || "#6b7280"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
            <div><div style={{ fontWeight: 700, fontSize: 15, color: "#e6a919" }}>{s.state} {s.state === "Oklahoma" && "⭐"}</div><span style={S.bg(`${typeColor[s.type]}15`, typeColor[s.type], typeColor[s.type])}>{s.type}</span></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 900, color: "#4ade80" }}>{s.maxRate}</div><div style={{ fontSize: 10, color: "#6b7280" }}>max return</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 8, marginBottom: 8 }}>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 6 }}><div style={{ ...S.lb, fontSize: 9 }}>Redemption</div><div style={{ fontSize: 12 }}>{s.redemption}</div></div>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 6 }}><div style={{ ...S.lb, fontSize: 9 }}>Bid Method</div><div style={{ fontSize: 12 }}>{s.bidMethod}</div></div>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 6 }}><div style={{ ...S.lb, fontSize: 9 }}>Sale Period</div><div style={{ fontSize: 12 }}>{s.saleMonth}</div></div>
            <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 6 }}><div style={{ ...S.lb, fontSize: 9 }}>Platform</div><div style={{ fontSize: 12 }}>{s.platform}</div></div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            {s.otc && <span style={S.bg("rgba(74,222,128,0.1)", "#4ade80", "#4ade80")}>OTC Available</span>}
            {s.online && <span style={S.bg("rgba(96,165,250,0.1)", "#60a5fa", "#60a5fa")}>Online Auction</span>}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.5 }}>{s.notes}</div>
          {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ ...S.lk, display: "block", marginTop: 6 }}>Visit auction site →</a>}
        </div>))}
    </div>
  </>);

  /* ─── PLATFORMS ─── */
  const rPlatforms = () => (<>
    <div style={S.cd}><div style={S.ct2}>Online Auction Platforms & Research Tools</div>
      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>These are the websites where you can research properties, browse <Tip term="Over-the-Counter (OTC)">OTC</Tip> lists, and bid on <Tip term="Tax Lien Certificate">tax lien certificates</Tip> and <Tip term="Tax Deed">tax deeds</Tip> from your computer.</div>
    </div>
    <div style={{ display: "grid", gap: 10 }}>
      {platforms.map(p => (
        <div key={p.name} style={{ ...S.cd, marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#e6a919" }}>{p.name}</div>
            <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ ...S.lk, fontWeight: 600 }}>Visit →</a>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, marginBottom: 6 }}>{p.desc}</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>States: {p.states}</div>
        </div>))}
    </div>
  </>);

  /* ─── PROPERTIES ─── */
  const rProps = () => (<>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><div style={{ fontSize: 14, fontWeight: 700 }}>{data.properties.length} Properties</div><button style={S.bt("p")} onClick={() => setShowForm(true)}>+ Add</button></div>
    {data.properties.length === 0 ? (
      <div style={{ ...S.cd, textAlign: "center", padding: 40 }}><div style={{ fontSize: 40, marginBottom: 12 }}>🏚️</div><div style={{ color: "#6b7280", marginBottom: 16 }}>No properties yet.</div><button style={S.bt("p")} onClick={() => setShowForm(true)}>Add First Property</button></div>
    ) : (
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr>{["Address", "State", "Type", "Cost", "Value", "ROI", "Risk", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{data.properties.map(p => {
          const roi = p.minBid > 0 ? ((p.estimatedValue / p.minBid - 1) * 100).toFixed(0) : "—";
          const sc = statusColors[p.status] || statusColors["Researching"];
          return (<tr key={p.id} style={{ cursor: "pointer" }} onClick={() => editProp(p)}>
            <td style={S.td}><div style={{ fontWeight: 600, color: "#e6a919" }}>{p.address || "—"}</div><div style={{ fontSize: 10, color: "#6b7280" }}>{p.parcelId} · {p.county}</div></td>
            <td style={S.td}>{p.state || "OK"}</td><td style={S.td}><span style={{ fontSize: 10, color: "#9ca3af" }}>{p.type}</span></td>
            <td style={S.td}>{fmt(p.minBid)}</td><td style={S.td}>{fmt(p.estimatedValue)}</td>
            <td style={{ ...S.td, color: Number(roi) > 50 ? "#4ade80" : "#f59e0b", fontWeight: 700 }}>{roi}%</td>
            <td style={S.td}><span style={{ color: riskLevels[p.risk], fontWeight: 600 }}>{p.risk}</span></td>
            <td style={S.td}><span style={S.bg(sc.bg, sc.border, sc.text)}>{p.status}</span></td>
            <td style={S.td}><button style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }} onClick={e => { e.stopPropagation(); delProp(p.id); }}>✕</button></td>
          </tr>);
        })}</tbody>
      </table></div>
    )}
  </>);

  /* ─── GLOSSARY ─── */
  const fGloss = glossary.filter(g => g.term.toLowerCase().includes(gSearch.toLowerCase()) || g.def.toLowerCase().includes(gSearch.toLowerCase())).sort((a, b) => a.term.localeCompare(b.term));
  const rGloss = () => (<>
    <div style={{ ...S.cd, marginBottom: 14 }}><div style={S.ct2}>Tax Lien Glossary — {glossary.length} Terms</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Hover/tap any <span style={{ borderBottom: "1px dashed #e6a919", color: "#e6a919" }}>highlighted term</span> for instant definitions.</div>
      <input style={S.ip} placeholder="Search..." value={gSearch} onChange={e => setGSearch(e.target.value)} />
    </div>
    <div style={{ display: "grid", gap: 8 }}>{fGloss.map(g => (<div key={g.term} style={{ ...S.cd, marginBottom: 0, padding: "14px 16px" }}><div style={{ fontWeight: 700, color: "#e6a919", fontSize: 13, marginBottom: 6 }}>{g.term}</div><div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>{g.def}</div></div>))}</div>
  </>);

  /* ─── CHECKLIST ─── */
  const rCheck = () => { const tot = clItems.reduce((s, p) => s + p.items.length, 0), dn = Object.values(cl).filter(Boolean).length; return (<>
    <div style={S.cd}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div style={S.ct2}>Progress</div><div style={{ fontSize: 14, fontWeight: 700, color: "#e6a919" }}>{dn}/{tot}</div></div><div style={S.pb}><div style={S.pf((dn / tot) * 100, "#e6a919")} /></div></div>
    {clItems.map(ph => (<div key={ph.p} style={S.cd}><div style={S.ct2}>{ph.i} {ph.p}</div>{ph.items.map(it => (<div key={it.k} style={S.ck} onClick={() => togCl(it.k)}><div style={S.cb(cl[it.k])}>{cl[it.k] && <span style={{ color: "#0a0a0f", fontSize: 12, fontWeight: 900 }}>✓</span>}</div><span style={{ fontSize: 12, color: cl[it.k] ? "#6b7280" : "#c9d1d9", textDecoration: cl[it.k] ? "line-through" : "none" }}>{it.t}</span></div>))}</div>))}
  </>); };

  /* ─── CALC ─── */
  const rCalc = () => { const [c, sC] = useState({ bt: 1200, fe: 300, av: 15000, mv: 25000, ol: 0 }); const tc = c.bt + c.fe + c.ol, m23 = (c.av * 2) / 3, lm = Math.min(m23, tc), pr = c.mv - lm, ro = lm > 0 ? ((pr / lm) * 100).toFixed(0) : 0;
    return (<><div style={S.cd}><div style={S.ct2}>Deal Calculator</div><div style={S.fg}>
      <div><div style={S.lb}><Tip term="Delinquent Taxes">Back Taxes</Tip></div><input style={S.ip} type="number" value={c.bt} onChange={e => sC({ ...c, bt: +e.target.value || 0 })} /></div>
      <div><div style={S.lb}>Fees</div><input style={S.ip} type="number" value={c.fe} onChange={e => sC({ ...c, fe: +e.target.value || 0 })} /></div>
      <div><div style={S.lb}><Tip term="Assessed Value">Assessed Value</Tip></div><input style={S.ip} type="number" value={c.av} onChange={e => sC({ ...c, av: +e.target.value || 0 })} /></div>
      <div><div style={S.lb}>Market Value</div><input style={S.ip} type="number" value={c.mv} onChange={e => sC({ ...c, mv: +e.target.value || 0 })} /></div>
      <div><div style={S.lb}><Tip term="IRS Lien (Federal Tax Lien)">Surviving Liens</Tip></div><input style={S.ip} type="number" value={c.ol} onChange={e => sC({ ...c, ol: +e.target.value || 0 })} /></div>
    </div></div>
    <div style={{ ...S.g, gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
      <div style={S.sc("#e6a919")}><div style={S.ac("#e6a919")} /><div style={S.lb}>2/3 Assessed</div><div style={S.vl("#e6a919")}>{fmt(m23)}</div></div>
      <div style={S.sc("#60a5fa")}><div style={S.ac("#60a5fa")} /><div style={S.lb}>Taxes+Fees</div><div style={S.vl("#60a5fa")}>{fmt(tc)}</div></div>
      <div style={S.sc("#f59e0b")}><div style={S.ac("#f59e0b")} /><div style={S.lb}><Tip term="Minimum Bid">Min Bid</Tip></div><div style={S.vl("#f59e0b")}>{fmt(lm)}</div></div>
      <div style={S.sc(pr > 0 ? "#4ade80" : "#ef4444")}><div style={S.ac(pr > 0 ? "#4ade80" : "#ef4444")} /><div style={S.lb}>Profit</div><div style={S.vl(pr > 0 ? "#4ade80" : "#ef4444")}>{fmt(pr)}</div><div style={{ fontSize: 10, color: "#6b7280" }}><Tip term="ROI (Return on Investment)">ROI</Tip>: {ro}%</div></div>
    </div></>); };

  /* ─── COUNTIES ─── */
  const rCty = () => (<>
    <div style={S.cd}><div style={S.ct2}>Oklahoma County Directory</div></div>
    <div style={{ display: "grid", gap: 10 }}>{counties.map(c => (<div key={c.name} style={{ ...S.cd, marginBottom: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div><div style={{ fontWeight: 700, fontSize: 14, color: "#e6a919" }}>{c.name}</div><div style={{ fontSize: 11, color: "#6b7280" }}>{c.addr}</div></div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80" }}>June 8</div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}><span style={S.bg("rgba(74,222,128,0.1)", "#4ade80", "#4ade80")}>OTC Now</span><span style={S.bg("rgba(167,139,250,0.1)", "#a78bfa", "#a78bfa")}>Commissioner</span></div>
      <div style={{ fontSize: 12 }}>📞 <a href={`tel:${c.phone.replace(/-/g, "")}`} style={S.lk}>{c.phone}</a>{c.delinqPhone !== c.phone && <span> · Delinquent: <a href={`tel:${c.delinqPhone.replace(/-/g, "")}`} style={S.lk}>{c.delinqPhone}</a></span>}</div>
      {c.website && <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" style={{ ...S.lk, display: "block", marginTop: 3, fontSize: 11 }}>{c.website}</a>}
    </div>))}</div>
  </>);

  const tabs = [["dashboard", "Dashboard"], ["buynow", "Buy Now"], ["national", "States"], ["platforms", "Online"], ["properties", "Properties"], ["glossary", "Glossary"], ["checklist", "Checklist"], ["calculator", "Calculator"], ["counties", "OK Counties"]];

  return (
    <div style={S.app}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={S.hdr}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={S.logo}>TL</div><div><div style={{ fontSize: 22, fontWeight: 800, color: "#e6a919", letterSpacing: "-0.5px" }}>TAX LIEN PRO</div><div style={{ fontSize: 10, color: "#6b7280", letterSpacing: "2px", textTransform: "uppercase" }}>National Investment Tracker</div></div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 28, fontWeight: 900, color: dJune <= 30 ? "#ef4444" : "#4ade80", lineHeight: 1 }}>{dJune}</div><div style={{ fontSize: 10, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase" }}>Days to OK June</div></div>
      </div>
      <div style={S.nav}>{tabs.map(([k, l]) => <button key={k} style={S.nb(tab === k)} onClick={() => setTab(k)}>{k === "buynow" ? "🟢 " : ""}{l}</button>)}</div>
      <div style={S.ct}>
        {tab === "dashboard" && rDash()}{tab === "buynow" && rBuy()}{tab === "national" && rNational()}{tab === "platforms" && rPlatforms()}
        {tab === "properties" && rProps()}{tab === "glossary" && rGloss()}{tab === "checklist" && rCheck()}{tab === "calculator" && rCalc()}{tab === "counties" && rCty()}
      </div>
      {showForm && <div style={S.ov} onClick={resetForm}><div style={S.md} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}><div style={{ fontSize: 16, fontWeight: 700, color: "#e6a919" }}>{editId ? "Edit" : "Add"} Property</div><button style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }} onClick={resetForm}>✕</button></div>
        <div style={S.fg}>
          <div><div style={S.lb}>State</div><select style={S.sl} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>{["OK", "FL", "AZ", "GA", "NJ", "IN", "IA", "AL", "CO", "TX", "IL", "SC", "Other"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><div style={S.lb}>County</div><input style={S.ip} value={form.county} onChange={e => setForm({ ...form, county: e.target.value })} /></div>
          <div><div style={S.lb}><Tip term="Parcel ID">Parcel ID</Tip></div><input style={S.ip} value={form.parcelId} onChange={e => setForm({ ...form, parcelId: e.target.value })} /></div>
          <div><div style={S.lb}>Address</div><input style={S.ip} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St" /></div>
          <div><div style={S.lb}>Purchase Type</div><select style={S.sl} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["OTC Certificate", "Resale (June)", "Commissioner Sale", "October Tax Sale", "Online Auction", "County-Held Cert"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><div style={S.lb}><Tip term="Zoning">Zoning</Tip></div><input style={S.ip} value={form.zoning} onChange={e => setForm({ ...form, zoning: e.target.value })} /></div>
          <div><div style={S.lb}><Tip term="Assessed Value">Assessed Value</Tip></div><input style={S.ip} type="number" value={form.assessedValue} onChange={e => setForm({ ...form, assessedValue: e.target.value })} /></div>
          <div><div style={S.lb}>Cost / Bid</div><input style={S.ip} type="number" value={form.minBid} onChange={e => setForm({ ...form, minBid: e.target.value })} /></div>
          <div><div style={S.lb}>Est. Market Value</div><input style={S.ip} type="number" value={form.estimatedValue} onChange={e => setForm({ ...form, estimatedValue: e.target.value })} /></div>
          <div><div style={S.lb}>Status</div><select style={S.sl} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{Object.keys(statusColors).map(s => <option key={s}>{s}</option>)}</select></div>
          <div><div style={S.lb}>Risk</div><select style={S.sl} value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })}>{Object.keys(riskLevels).map(r => <option key={r}>{r}</option>)}</select></div>
          <div><div style={S.lb}><Tip term="Encumbrance">Known Liens</Tip></div><input style={S.ip} value={form.liens} onChange={e => setForm({ ...form, liens: e.target.value })} /></div>
          <div style={{ gridColumn: "1/-1" }}><div style={S.lb}>Notes</div><textarea style={{ ...S.ip, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}><button style={S.bt()} onClick={resetForm}>Cancel</button><button style={S.bt("p")} onClick={saveProperty}>{editId ? "Update" : "Add"}</button></div>
      </div></div>}
    </div>
  );
}
