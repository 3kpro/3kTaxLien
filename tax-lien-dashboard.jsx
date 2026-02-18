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
  { term: "Wholesaling", def: "Getting a property under contract and assigning that contract to an end buyer for a fee — without ever owning the property yourself. Low-capital strategy." },
  { term: "Title Search", def: "Research into ownership history and any liens/encumbrances. Essential before buying at a tax sale." },
  { term: "Bid-Down Method", def: "Auction style where investors bid DOWN the interest rate they'll accept. Used in Florida and Arizona. Starts at max rate, lowest bid wins." },
  { term: "Premium Bid", def: "Auction style where investors bid UP the price above the minimum. The overbid amount may go to the original owner." },
  { term: "Right of Redemption", def: "The legal right of a property owner to reclaim their property after a tax sale by paying all owed amounts plus penalties and interest." },
  { term: "LOCCAT", def: "Tulsa County's online mapping tool combining land records from the County Clerk, Assessor, and Treasurer into one searchable map." },
  { term: "Flood Zone", def: "An area designated by FEMA with higher flood risk. May require expensive insurance and be harder to resell." },
  { term: "Zoning", def: "Local rules dictating how property can be used — residential, commercial, industrial, agricultural. Affects what you can do after purchase." },
  { term: "Assignment", def: "Transfer of a contract or certificate from one party to another. In wholesaling, you assign your purchase agreement to the end buyer for a fee." },
  { term: "Endorsement", def: "Adding subsequent years' delinquent taxes to an existing certificate. Increases investment and potential return." },
  { term: "Overbid / Premium", def: "Amount a winning bid exceeds the minimum. Excess may go back to the original property owner." },
  { term: "Redeemable Deed", def: "Used in states like Georgia and Texas. You get a deed but the original owner can redeem within a set period, paying you interest." },
  { term: "Skip Trace", def: "Finding contact information (phone, address, email) for a property owner using databases and public records. Essential for pre-sale outreach." },
  { term: "Yellow Letter", def: "A handwritten-looking letter on yellow paper sent to distressed property owners. High open rate because it looks personal, not mass-mailed." },
  { term: "Assignment Fee", def: "The profit you earn when you assign (transfer) your purchase contract to an end buyer. Typically $500–$2,000+ per deal." },
  { term: "Double Close", def: "Two back-to-back closings: you buy from the seller (Close A), then immediately sell to your end buyer (Close B). You briefly own the property." },
  { term: "Earnest Money", def: "A good-faith deposit showing you're serious about buying. Typically $100-500 for wholesale deals. Refundable during contingency period." },
  { term: "Warranty Deed", def: "A deed where the seller guarantees clear title and will defend against any claims. Stronger than a quitclaim deed. Preferred in pre-sale deals." },
  { term: "ARV (After Repair Value)", def: "What a property would be worth after renovations. Used to calculate max offer: ARV × 70% - repairs - your fee = max offer to seller." },
  { term: "Bird Dog", def: "Someone who finds deals and passes leads to investors for a flat fee ($500-$1K). The simplest entry point into wholesaling." },
  { term: "Transactional Funding", def: "Short-term (same-day) loan used for double closings. Lender provides cash for Close A, gets repaid from proceeds of Close B." },
  { term: "Purchase Agreement", def: "A binding contract between buyer and seller stating the terms of the property sale. Must include an 'and/or assigns' clause for wholesaling." },
];

/* ─── LETTER TEMPLATES ─── */
const letterTemplates = [
  { name: "Yellow Letter — First Contact", type: "letter", content: `Dear [OWNER NAME],

My name is Carlos and I'm a local real estate investor here in the Tulsa area.

I noticed that your property at [ADDRESS] is currently scheduled for the county tax sale. I understand this can be a stressful situation, and I wanted to reach out before the auction happens.

I'd like to help you avoid losing your property at auction — where you'd walk away with nothing. Instead, I can pay off the back taxes owed to the county AND put cash in your pocket.

There's no cost or obligation to talk. I just want to see if we can find a solution that works for you.

Please call or text me at [YOUR PHONE] anytime. I'm happy to meet in person if that's easier.

Sincerely,
Carlos
[YOUR PHONE]
[YOUR EMAIL]` },
  { name: "Follow-Up Letter (10 days)", type: "letter", content: `Dear [OWNER NAME],

I reached out about a week ago regarding your property at [ADDRESS]. I know you're busy, so I wanted to follow up one more time.

The county tax sale date is approaching ([SALE DATE]), and once that passes, the property sells at auction and you receive nothing from the sale.

I have cash available to close quickly and can handle all the paperwork. You walk away with money instead of losing the property for $0 at auction.

No pressure — just a conversation. Call or text me anytime at [YOUR PHONE].

Best regards,
Carlos` },
  { name: "Door Knock Script", type: "script", content: `"Hi, I'm Carlos. I'm a local real estate investor. I'm looking for [OWNER NAME] — is that you?"

[If yes]:
"Great. I noticed your property has some back taxes owed to the county, and it's currently on the list for the upcoming tax sale. I'm not here to pressure you — I just wanted to let you know that if the county sells it, you'd lose the property and get nothing from the sale.

I can pay off the taxes and put some cash in your hand so you walk away with something. Would you be open to having a quick conversation about it?"

[If they're interested]:
"Perfect. Here's what I can do — I'll take a look at the property, run some numbers, and come back to you with a fair offer within 48 hours. No obligation on your end. Can I get your phone number so I can follow up?"

[If hesitant]:
"I totally understand. Here's my card. The sale date is [DATE], so there's a window before that. If you change your mind or just want to ask questions, call me anytime. No pressure at all."

[If not the owner / renting]:
"No problem at all. Do you happen to know how I could reach the property owner? I'd love to help them out before the tax sale."` },
  { name: "Investor Pitch — Email Blast", type: "email", content: `Subject: Tulsa Tax Sale Deal — [ADDRESS] — Under Contract for [PRICE]

Hey [INVESTOR NAME],

I have a pre-sale tax deal under contract in [COUNTY], Oklahoma:

📍 Address: [ADDRESS]
📐 Lot/Sqft: [SIZE]
💰 All-in cost: [BACK TAXES + SELLER PAYOUT]
🏷️ Assessed Value: [ASSESSED]
📊 Estimated Market Value: [MARKET VALUE]
🔧 Condition: [AS-IS / Needs Work / Vacant Lot]
📋 Assignment Fee: $[FEE]

Why this deal works:
• Seller is signing a warranty deed (not a tax deed — cleaner title)
• No auction competition — this is a direct negotiation
• Close in [X] days, property is ready to flip/hold/rent

Interested? Reply or call me at [PHONE]. First come, first served.

— Carlos
3KPRO.SERVICES` },
  { name: "Purchase Agreement Summary", type: "contract", content: `KEY CLAUSES FOR OK PRE-SALE PURCHASE AGREEMENT:
(Have an attorney review before using)

1. PURCHASE PRICE: $[AMOUNT] — to include payment of all delinquent ad valorem taxes, penalties, interest, and costs to [COUNTY] Treasurer.

2. ASSIGNMENT: "Buyer, and/or Buyer's assigns, may assign this contract to another party without Seller's additional consent. Seller agrees to cooperate with assignment and close with assignee under the same terms."

3. TITLE: Seller conveys property AS-IS via Warranty Deed (or Special Warranty Deed). Buyer acknowledges property may have liens, code violations, or other encumbrances.

4. CONTINGENCIES: Contract contingent upon Buyer's inspection and approval of title report within [7-14] days. Buyer may terminate for any reason during contingency period with full earnest money refund.

5. EARNEST MONEY: Buyer deposits $[100-500] with [title company/attorney] within [3] business days of execution.

6. CLOSING: On or before [DATE — must be before county resale date], at a title company or attorney's office. Seller receives net proceeds of $[AMOUNT] after county treasurer payoff.

7. SELLER REPS: Seller warrants they are the lawful owner, property is not subject to undisclosed liens (other than public record), and Seller has authority to sell.

8. DEFAULT: If Buyer defaults, Seller retains earnest money as liquidated damages. If Seller defaults, Buyer may seek specific performance or return of earnest money.` },
];

/* ─── SKIP TRACE TOOLS ─── */
const skipTraceTools = [
  { name: "BeenVerified", url: "https://www.beenverified.com", cost: "$27/mo", desc: "People search — phone, email, address history. Good for finding heirs and out-of-state owners." },
  { name: "TLOxp (TransUnion)", url: "https://www.tlo.com", cost: "Pay per search", desc: "Professional skip trace. Used by PIs and debt collectors. Most accurate for hard-to-find owners." },
  { name: "FastPeopleSearch", url: "https://www.fastpeoplesearch.com", cost: "Free", desc: "Free people search. Phone numbers and addresses. Good starting point before paying for premium tools." },
  { name: "OK County Clerk Records", url: "https://www.oscn.net", cost: "Free", desc: "Oklahoma court records. Check for probate (deceased owners), liens, and judgments." },
  { name: "Tulsa County Clerk Land Records", url: "https://landrecords.tulsacounty.org", cost: "Free / $1 per page", desc: "Deeds, mortgages, and ownership history. Find who really owns the property." },
  { name: "OK Tax Rolls", url: "https://oktaxrolls.com", cost: "Free", desc: "Search delinquent tax records. Shows owner name, address on file, and taxes owed." },
  { name: "USPS Change of Address", url: "https://www.usps.com", cost: "Free", desc: "If mail is returned, owner may have filed a change of address. USPS doesn't share directly, but returned mail with forwarding address is gold." },
  { name: "Probate Court (if deceased)", url: "", cost: "Free", desc: "If owner is deceased, check county probate court for heirs and estate representatives. They have authority to sell." },
];

/* ─── WHOLESALE PIPELINE STAGES ─── */
const wsStages = [
  { key: "identified", label: "Identified", color: "#6b7280", icon: "🔍", desc: "Pulled from delinquent list, not yet contacted" },
  { key: "contacted", label: "Contacted", color: "#60a5fa", icon: "📨", desc: "Letter sent or door knocked" },
  { key: "responded", label: "Responded", color: "#a78bfa", icon: "💬", desc: "Owner replied — conversation started" },
  { key: "negotiating", label: "Negotiating", color: "#f59e0b", icon: "🤝", desc: "Discussing terms, running numbers" },
  { key: "under_contract", label: "Under Contract", color: "#4ade80", icon: "📝", desc: "Purchase agreement signed with assignment clause" },
  { key: "marketed", label: "Marketing", color: "#ec4899", icon: "📣", desc: "Deal sent to buyer list" },
  { key: "assigned", label: "Assigned / Closed", color: "#22c55e", icon: "💰", desc: "Contract assigned to buyer, fee collected" },
  { key: "dead", label: "Dead Lead", color: "#ef4444", icon: "✕", desc: "No response, no deal, or owner refused" },
];

const wsBuyerTypes = ["Flipper", "Landlord", "Land Investor", "Wholesaler", "Out-of-State Buyer", "Other"];

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
  { type: "OK — OTC Tax Lien Certificates", desc: "Unsold certificates from Oklahoma's October 2025 Tax Sale. Buy directly from any county treasurer.", returns: "8% per annum", risk: "Low", statute: "68 O.S. § 3108", action: "Call the county treasurer and ask for their list of unsold/county-held tax lien certificates available for assignment.", counties: [{ name: "Tulsa County", phone: "918-596-5071" }, { name: "Oklahoma County", phone: "405-713-1300" }, { name: "Rogers County", phone: "918-923-4960" }, { name: "Creek County", phone: "918-224-4509" }] },
  { type: "OK — County-Owned Properties", desc: "Properties unsold at June Resale. You get a tax deed (ownership).", returns: "Unlimited — ownership at discount", risk: "Medium", statute: "68 O.S. § 3135", action: "Browse Tulsa's online list or call delinquent tax dept.", counties: [{ name: "Tulsa County", phone: "918-596-5070", link: "www2.tulsacounty.org/treasurer/properties-for-sale/county-properties/properties-for-sale-list/" }] },
  { type: "AZ — OTC Tax Liens (Online)", desc: "42,000+ OTC liens across Arizona. Up to 16% interest. Purchasable online.", returns: "Up to 16% per annum", risk: "Low-Medium", statute: "A.R.S. 42-18114", action: "Visit parcelfair.com/Arizona to browse or go direct to county treasurer sites.", counties: [{ name: "Maricopa County", phone: "602-506-8511", link: "treasurer.maricopa.gov" }, { name: "Browse All AZ OTC", phone: "", link: "parcelfair.com/Arizona" }] },
  { type: "FL — County-Held Certs (18%)", desc: "Unsold Florida certs at full 18%. First-come-first-served.", returns: "18% per annum", risk: "Low", statute: "F.S. 197.432", action: "Use LienHub.com or contact FL county tax collectors.", counties: [{ name: "Browse FL Counties", phone: "", link: "lienhub.com" }] },
  { type: "Wholesale — Pre-Sale Deals (No Capital)", desc: "Contact distressed owners BEFORE the auction. Get property under contract with assignment clause, then flip the contract to a cash investor for $500–$2,000 per deal.", returns: "$500–$2,000+ per deal", risk: "Low (no capital at risk)", statute: "Standard contract law", action: "Pull delinquent lists → skip trace owners → yellow letter → negotiate → assign contract.", counties: [{ name: "Go to Wholesale Tab", phone: "", link: "" }] },
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
  const [data, setData] = useState({ properties: [], budget: 3000, targetReturn: 5000, leads: [], buyers: [] });
  const [tab, setTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [gSearch, setGSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [wsSubTab, setWsSubTab] = useState("pipeline");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [editLeadId, setEditLeadId] = useState(null);
  const [editBuyerId, setEditBuyerId] = useState(null);
  const [showTemplate, setShowTemplate] = useState(null);

  const ef = { parcelId: "", address: "", county: "Tulsa County", assessedValue: "", minBid: "", estimatedValue: "", status: "Researching", risk: "Medium", notes: "", liens: "", zoning: "", acreage: "", type: "Resale", state: "OK" };
  const [form, setForm] = useState(ef);
  const elfLead = { address: "", county: "Tulsa County", ownerName: "", phone: "", email: "", taxesOwed: "", assessedValue: "", marketValue: "", stage: "identified", offerAmount: "", assignmentFee: "", notes: "", letterSent: "", lastContact: "" };
  const [leadForm, setLeadForm] = useState(elfLead);
  const elfBuyer = { name: "", phone: "", email: "", type: "Flipper", maxBudget: "", areas: "Tulsa, Rogers, Wagoner", preferences: "", deals: 0 };
  const [buyerForm, setBuyerForm] = useState(elfBuyer);

  useEffect(() => { try { const s = localStorage.getItem("tlp4"); if (s) { const p = JSON.parse(s); setData({ leads: [], buyers: [], ...p }); } } catch {} }, []);
  const save = useCallback((d) => { setData(d); try { localStorage.setItem("tlp4", JSON.stringify(d)); } catch {} }, []);

  // Property CRUD
  const resetForm = () => { setForm(ef); setEditId(null); setShowForm(false); };
  const saveProperty = () => { if (!form.address) return; const p = { ...form, id: editId || uid(), assessedValue: Number(form.assessedValue) || 0, minBid: Number(form.minBid) || 0, estimatedValue: Number(form.estimatedValue) || 0 }; save({ ...data, properties: editId ? data.properties.map(x => x.id === editId ? p : x) : [...data.properties, p] }); resetForm(); };
  const editProp = (p) => { setForm({ ...p, assessedValue: p.assessedValue + "", minBid: p.minBid + "", estimatedValue: p.estimatedValue + "" }); setEditId(p.id); setShowForm(true); setTab("properties"); };
  const delProp = (id) => save({ ...data, properties: data.properties.filter(p => p.id !== id) });

  // Lead CRUD
  const resetLead = () => { setLeadForm(elfLead); setEditLeadId(null); setShowLeadForm(false); };
  const saveLead = () => { if (!leadForm.address && !leadForm.ownerName) return; const l = { ...leadForm, id: editLeadId || uid(), taxesOwed: Number(leadForm.taxesOwed) || 0, assessedValue: Number(leadForm.assessedValue) || 0, marketValue: Number(leadForm.marketValue) || 0, offerAmount: Number(leadForm.offerAmount) || 0, assignmentFee: Number(leadForm.assignmentFee) || 0 }; save({ ...data, leads: editLeadId ? data.leads.map(x => x.id === editLeadId ? l : x) : [...data.leads, l] }); resetLead(); };
  const editLead = (l) => { setLeadForm({ ...l, taxesOwed: l.taxesOwed + "", assessedValue: l.assessedValue + "", marketValue: l.marketValue + "", offerAmount: l.offerAmount + "", assignmentFee: l.assignmentFee + "" }); setEditLeadId(l.id); setShowLeadForm(true); };
  const delLead = (id) => save({ ...data, leads: data.leads.filter(l => l.id !== id) });
  const moveLead = (id, stage) => save({ ...data, leads: data.leads.map(l => l.id === id ? { ...l, stage } : l) });

  // Buyer CRUD
  const resetBuyer = () => { setBuyerForm(elfBuyer); setEditBuyerId(null); setShowBuyerForm(false); };
  const saveBuyer = () => { if (!buyerForm.name) return; const b = { ...buyerForm, id: editBuyerId || uid(), maxBudget: Number(buyerForm.maxBudget) || 0, deals: Number(buyerForm.deals) || 0 }; save({ ...data, buyers: editBuyerId ? data.buyers.map(x => x.id === editBuyerId ? b : x) : [...data.buyers, b] }); resetBuyer(); };
  const editBuyer = (b) => { setBuyerForm({ ...b, maxBudget: b.maxBudget + "", deals: b.deals + "" }); setEditBuyerId(b.id); setShowBuyerForm(true); };
  const delBuyer = (id) => save({ ...data, buyers: data.buyers.filter(b => b.id !== id) });

  const invested = data.properties.filter(p => ["Bid Placed", "Won"].includes(p.status)).reduce((s, p) => s + p.minBid, 0);
  const flipped = data.properties.filter(p => p.status === "Flipped").reduce((s, p) => s + (p.estimatedValue - p.minBid), 0);
  const remain = data.budget - invested;
  const targets = data.properties.filter(p => p.status === "Target").length;
  const dJune = daysUntil("2026-06-08"), dOct = daysUntil("2026-10-05");
  const wsFees = (data.leads || []).filter(l => l.stage === "assigned").reduce((s, l) => s + (l.assignmentFee || 0), 0);
  const activeLeads = (data.leads || []).filter(l => !["dead", "assigned"].includes(l.stage)).length;
  const underContract = (data.leads || []).filter(l => ["under_contract", "marketed"].includes(l.stage)).length;

  const [cl, setCl] = useState(() => { try { return JSON.parse(localStorage.getItem("tlp4-cl")) || {}; } catch { return {}; } });
  const togCl = (k) => { const n = { ...cl, [k]: !cl[k] }; setCl(n); try { localStorage.setItem("tlp4-cl", JSON.stringify(n)); } catch {} };
  const clItems = [
    { p: "DO RIGHT NOW", i: "🟢", items: [{ k: "n1", t: "Call Tulsa County Treasurer (918-596-5071) — OTC certificates" }, { k: "n2", t: "Call Delinquent Tax Dept (918-596-5070) — county-owned list" }, { k: "n3", t: "Browse Tulsa county properties online" }, { k: "n4", t: "Browse Arizona OTC liens at parcelfair.com/Arizona" }, { k: "n5", t: "Register on RealAuction.com and GovEase.com (free)" }, { k: "n6", t: "Open dedicated bank account" }] },
    { p: "WHOLESALE — START NOW", i: "🥷", items: [{ k: "w1", t: "Pull delinquent tax list from oktaxrolls.com for Tulsa, Rogers, Creek" }, { k: "w2", t: "Skip trace 20 owners (FastPeopleSearch free, then BeenVerified)" }, { k: "w3", t: "Print & mail 20 yellow letters ($0.50-1.00 each)" }, { k: "w4", t: "Door knock 5 local properties this weekend" }, { k: "w5", t: "Join Tulsa REIA / BiggerPockets to build buyer list" }, { k: "w6", t: "Have attorney review purchase agreement template ($150-300)" }, { k: "w7", t: "Set up Google Voice number for deal calls" }, { k: "w8", t: "Create investor email list (even 5 names to start)" }] },
    { p: "RESEARCH (Now-May)", i: "📋", items: [{ k: "c1", t: "Study LOCCAT mapping tool" }, { k: "c2", t: "Practice Tulsa County Assessor search" }, { k: "c3", t: "Research past auction results" }, { k: "c4", t: "Learn to identify IRS liens, environmental issues" }, { k: "c5", t: "Study statutes: OK Title 68 Art. 31 / FL Ch. 197 / AZ Title 42 Ch. 18" }] },
    { p: "LIST DROPS (May 15)", i: "📦", items: [{ k: "c10", t: "Download June Resale list from Treasurer" }, { k: "c11", t: "Pre-register at Treasurer's Office" }, { k: "c12", t: "Pre-deposit funds ($500 min)" }, { k: "c13", t: "Drive by every target property" }, { k: "c14", t: "Run title searches — set max bids for top 10-15 targets" }] },
    { p: "JUNE RESALE (June 8)", i: "🔨", items: [{ k: "c18", t: "Arrive early — scope competition" }, { k: "c19", t: "Stick to max bid limits" }, { k: "c20", t: "Cash/cashier's check ready" }] },
    { p: "FL/AZ ONLINE SALES", i: "🌐", items: [{ k: "f1", t: "FL certificates: May-June (bid down from 18%)" }, { k: "f2", t: "AZ liens: February (bid down from 16%)" }, { k: "f3", t: "Register 2-3 weeks before each sale" }] },
  ];

  const S = {
    app: { fontFamily: "'JetBrains Mono','Fira Code',monospace", background: "linear-gradient(160deg,#0a0a0f 0%,#0d1117 40%,#0a0f1a 100%)", color: "#c9d1d9", minHeight: "100vh" },
    hdr: { background: "linear-gradient(90deg,rgba(230,169,25,0.08),transparent 60%)", borderBottom: "1px solid rgba(230,169,25,0.2)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
    logo: { width: 40, height: 40, background: "linear-gradient(135deg,#e6a919,#f59e0b)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#0a0a0f" },
    nav: { display: "flex", gap: 2, padding: "0 12px", background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" },
    nb: (a) => ({ padding: "12px 10px", background: a ? "rgba(230,169,25,0.1)" : "transparent", border: "none", borderBottom: a ? "2px solid #e6a919" : "2px solid transparent", color: a ? "#e6a919" : "#6b7280", cursor: "pointer", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "inherit", whiteSpace: "nowrap" }),
    ct: { padding: "20px", maxWidth: 900, margin: "0 auto" },
    g: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 },
    sc: (c) => ({ background: "rgba(255,255,255,0.02)", border: `1px solid ${c}22`, borderRadius: 12, padding: "14px", position: "relative", overflow: "hidden" }),
    ac: (c) => ({ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c }),
    lb: { fontSize: 10, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 },
    vl: (c) => ({ fontSize: 22, fontWeight: 800, color: c || "#c9d1d9" }),
    cd: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px", marginBottom: 12 },
    ct2: { fontSize: 13, fontWeight: 700, color: "#e6a919", marginBottom: 12, letterSpacing: "0.5px" },
    th: { textAlign: "left", padding: "8px 8px", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 9, letterSpacing: "1px", textTransform: "uppercase" },
    td: { padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 11 },
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
    <div style={{ ...S.cd, background: "linear-gradient(135deg,rgba(74,222,128,0.05),rgba(230,169,25,0.05))", border: "1px solid rgba(74,222,128,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>Two Active Plays — Auction + Wholesale</div><span style={S.nw}>ACTIVE</span></div>
      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>Run both strategies simultaneously: buy <Tip term="Over-the-Counter (OTC)">OTC</Tip> liens for passive income AND <Tip term="Wholesaling">wholesale</Tip> pre-sale deals for quick assignment fees — no capital needed for wholesale.</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button style={S.bt("p")} onClick={() => setTab("buynow")}>Buy Now Options</button>
        <button style={{ ...S.bt("p"), background: "rgba(236,72,153,0.15)", borderColor: "#ec4899", color: "#ec4899" }} onClick={() => setTab("wholesale")}>Wholesale Deals</button>
      </div>
    </div>
    <div style={S.g}>
      <div style={S.sc("#e6a919")}><div style={S.ac("#e6a919")} /><div style={S.lb}>Budget</div><div style={S.vl("#e6a919")}>{fmt(data.budget)}</div><div style={{ ...S.lb, marginTop: 4 }}>Remaining: {fmt(remain)}</div><div style={S.pb}><div style={S.pf((remain / data.budget) * 100, "#e6a919")} /></div></div>
      <div style={S.sc("#ec4899")}><div style={S.ac("#ec4899")} /><div style={S.lb}>Wholesale</div><div style={S.vl("#ec4899")}>{fmt(wsFees)}</div><div style={{ ...S.lb, marginTop: 4 }}>{activeLeads} leads · {underContract} under contract</div></div>
      <div style={S.sc("#60a5fa")}><div style={S.ac("#60a5fa")} /><div style={S.lb}>Invested</div><div style={S.vl("#60a5fa")}>{fmt(invested)}</div></div>
      <div style={S.sc("#4ade80")}><div style={S.ac("#4ade80")} /><div style={S.lb}>Total Profit</div><div style={S.vl("#4ade80")}>{fmt(flipped + wsFees)}</div><div style={{ ...S.lb, marginTop: 4 }}>Goal: {fmt(data.targetReturn - data.budget)}</div></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={S.cd}><div style={S.ct2}>Key Dates</div>
        {[["OTC / Commissioner / Wholesale", null, true], ["AZ/FL OTC Liens", null, true], ["OK June Resale", `${dJune}d`], ["OK October Sale", `${dOct}d`]].map(([l, d, n]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 11 }}>{l}</span>{n ? <span style={S.nw}>NOW</span> : <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>{d}</span>}
          </div>))}
      </div>
      <div style={S.cd}><div style={S.ct2}>Quick Links</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <button style={S.bt()} onClick={() => window.open("https://assessor.tulsacounty.org/Property/Search")}>Tulsa Assessor</button>
        <button style={S.bt()} onClick={() => window.open("https://oktaxrolls.com")}>OK Tax Rolls</button>
        <button style={S.bt()} onClick={() => window.open("https://parcelfair.com/Arizona")}>AZ OTC Liens</button>
        <button style={S.bt()} onClick={() => window.open("https://lienhub.com")}>FL LienHub</button>
      </div></div>
    </div>
    <div style={S.cd}><div style={S.ct2}>Budget</div><div style={S.fg}>
      <div><div style={S.lb}>Investment Budget</div><input style={S.ip} type="number" value={data.budget} onChange={e => save({ ...data, budget: Number(e.target.value) || 0 })} /></div>
      <div><div style={S.lb}>Target Return</div><input style={S.ip} type="number" value={data.targetReturn} onChange={e => save({ ...data, targetReturn: Number(e.target.value) || 0 })} /></div>
    </div></div>
  </>);

  /* ─── WHOLESALE ─── */
  const rWholesale = () => {
    const leads = data.leads || [];
    const buyers = data.buyers || [];
    const stg = wsSubTab;
    return (<>
      {/* Sub-navigation */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {[["pipeline", "🔍 Pipeline"], ["buyers", "🤝 Buyers"], ["templates", "📨 Templates"], ["skiptools", "🕵️ Skip Trace"], ["wscalc", "💰 Deal Calc"]].map(([k, l]) => (
          <button key={k} style={{ ...S.bt(wsSubTab === k ? "p" : ""), fontSize: 11, padding: "8px 14px" }} onClick={() => setWsSubTab(k)}>{l}</button>))}
      </div>

      {/* PIPELINE */}
      {stg === "pipeline" && (<>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{leads.length} Leads</div>
          <button style={S.bt("p")} onClick={() => setShowLeadForm(true)}>+ Add Lead</button>
        </div>
        {/* Pipeline summary */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {wsStages.map(s => {
            const cnt = leads.filter(l => l.stage === s.key).length;
            return (<div key={s.key} style={{ flex: "1 0 90px", background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 6px", textAlign: "center", borderTop: `3px solid ${s.color}`, minWidth: 80 }}>
              <div style={{ fontSize: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{cnt}</div>
              <div style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </div>);
          })}
        </div>
        {/* Lead cards */}
        {leads.length === 0 ? (
          <div style={{ ...S.cd, textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🥷</div>
            <div style={{ color: "#6b7280", marginBottom: 8 }}>No leads yet. Start by pulling a delinquent list.</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16, lineHeight: 1.6 }}>
              Go to <a href="https://oktaxrolls.com" target="_blank" rel="noopener noreferrer" style={S.lk}>oktaxrolls.com</a> → pick a county → filter for delinquent properties → <Tip term="Skip Trace">skip trace</Tip> the owners → add them here.
            </div>
            <button style={S.bt("p")} onClick={() => setShowLeadForm(true)}>Add First Lead</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {leads.sort((a, b) => wsStages.findIndex(s => s.key === a.stage) - wsStages.findIndex(s => s.key === b.stage)).map(l => {
              const stageObj = wsStages.find(s => s.key === l.stage) || wsStages[0];
              const profit = l.marketValue && l.offerAmount ? l.marketValue - l.offerAmount : 0;
              return (
                <div key={l.id} style={{ ...S.cd, marginBottom: 0, borderLeft: `3px solid ${stageObj.color}`, cursor: "pointer" }} onClick={() => editLead(l)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#e6a919" }}>{l.address || "No Address"}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{l.ownerName || "Unknown Owner"} · {l.county}</div>
                    </div>
                    <span style={S.bg(`${stageObj.color}20`, stageObj.color, stageObj.color)}>{stageObj.icon} {stageObj.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11, color: "#9ca3af" }}>
                    {l.taxesOwed > 0 && <span>Taxes: <span style={{ color: "#ef4444" }}>{fmt(l.taxesOwed)}</span></span>}
                    {l.offerAmount > 0 && <span>Offer: <span style={{ color: "#f59e0b" }}>{fmt(l.offerAmount)}</span></span>}
                    {l.assignmentFee > 0 && <span>Fee: <span style={{ color: "#4ade80" }}>{fmt(l.assignmentFee)}</span></span>}
                    {profit > 0 && <span>Spread: <span style={{ color: "#4ade80" }}>{fmt(profit)}</span></span>}
                  </div>
                  {/* Stage move buttons */}
                  <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
                    {wsStages.filter(s => s.key !== l.stage).slice(0, 4).map(s => (
                      <button key={s.key} onClick={() => moveLead(l.id, s.key)} style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${s.color}40`, background: `${s.color}10`, color: s.color, fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>{s.icon} {s.label}</button>
                    ))}
                    <button onClick={() => delLead(l.id)} style={{ padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 9, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>)}

      {/* BUYERS */}
      {stg === "buyers" && (<>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{buyers.length} Buyers on List</div>
          <button style={S.bt("p")} onClick={() => setShowBuyerForm(true)}>+ Add Buyer</button>
        </div>
        <div style={{ ...S.cd, background: "rgba(236,72,153,0.05)", border: "1px solid rgba(236,72,153,0.2)", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#ec4899", fontWeight: 700, marginBottom: 6 }}>Where to Find Buyers</div>
          <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.8 }}>
            BiggerPockets forums (biggerpockets.com) · Tulsa REIA meetups · Facebook: "Tulsa Real Estate Investors" · Craigslist → Real Estate → Wanted · Local landlord associations · Title company referrals · Other wholesalers (bird dog deals)
          </div>
        </div>
        {buyers.length === 0 ? (
          <div style={{ ...S.cd, textAlign: "center", padding: 40 }}><div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div><div style={{ color: "#6b7280", marginBottom: 16 }}>No buyers yet. Build your list before you have deals to assign.</div><button style={S.bt("p")} onClick={() => setShowBuyerForm(true)}>Add First Buyer</button></div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {buyers.map(b => (
              <div key={b.id} style={{ ...S.cd, marginBottom: 0, cursor: "pointer" }} onClick={() => editBuyer(b)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div><div style={{ fontWeight: 700, fontSize: 14, color: "#e6a919" }}>{b.name}</div><div style={{ fontSize: 11, color: "#6b7280" }}>{b.type} · Budget: {fmt(b.maxBudget)}</div></div>
                  <span style={S.bg("rgba(74,222,128,0.1)", "#4ade80", "#4ade80")}>{b.deals || 0} deals</span>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                  {b.phone && <span>📞 {b.phone} </span>}{b.email && <span>✉ {b.email} </span>}
                </div>
                {b.areas && <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>Areas: {b.areas}</div>}
                {b.preferences && <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>Prefs: {b.preferences}</div>}
                <button onClick={e => { e.stopPropagation(); delBuyer(b.id); }} style={{ marginTop: 6, padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </>)}

      {/* TEMPLATES */}
      {stg === "templates" && (<>
        <div style={S.cd}><div style={S.ct2}>Letters, Scripts & Contract Templates</div>
          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>Ready-to-use outreach materials. Click to expand. Customize the [BRACKETS] with your deal info.</div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {letterTemplates.map((t, i) => {
            const typeColors = { letter: "#f59e0b", script: "#60a5fa", email: "#ec4899", contract: "#a78bfa" };
            return (
              <div key={i} style={{ ...S.cd, marginBottom: 0, cursor: "pointer" }} onClick={() => setShowTemplate(showTemplate === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={S.bg(`${typeColors[t.type]}15`, typeColors[t.type], typeColors[t.type])}>{t.type}</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</span>
                  </div>
                  <span style={{ color: "#6b7280", fontSize: 12 }}>{showTemplate === i ? "▲" : "▼"}</span>
                </div>
                {showTemplate === i && (
                  <div style={{ marginTop: 12, padding: 14, background: "rgba(0,0,0,0.3)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 11, lineHeight: 1.7, color: "#c9d1d9", fontFamily: "inherit" }}>{t.content}</pre>
                    <button style={{ ...S.bt("p"), marginTop: 10, fontSize: 11 }} onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(t.content); }}>Copy to Clipboard</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>)}

      {/* SKIP TRACE TOOLS */}
      {stg === "skiptools" && (<>
        <div style={S.cd}>
          <div style={S.ct2}><Tip term="Skip Trace">Skip Trace</Tip> Workflow</div>
          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 12 }}>Finding the owner is 80% of the battle. Follow this order: free tools first, then paid tools for hard-to-find owners.</div>
          <div style={{ display: "grid", gap: 6 }}>
            {[
              { step: "1", title: "Pull the delinquent list", desc: "oktaxrolls.com → select county → get owner name and address on file", color: "#e6a919" },
              { step: "2", title: "Free people search", desc: "FastPeopleSearch.com — get phone numbers and current address. Check if they still live there.", color: "#60a5fa" },
              { step: "3", title: "Check county clerk records", desc: "Look for probate (deceased owner), recent deed transfers, or court judgments.", color: "#a78bfa" },
              { step: "4", title: "Paid skip trace (if needed)", desc: "BeenVerified ($27/mo) or TLOxp for hard cases — heirs, out-of-state owners, LLCs.", color: "#f59e0b" },
              { step: "5", title: "Send yellow letter + door knock", desc: "Mail to address on file AND current address if different. Door knock local properties on weekends.", color: "#4ade80" },
              { step: "6", title: "Follow up", desc: "2nd letter at 10 days. Phone call at 14 days. Door knock again at 21 days. Most deals close on follow-up #2-3.", color: "#ec4899" },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
                <div style={{ color: s.color, fontWeight: 900, fontSize: 16, minWidth: 20 }}>{s.step}</div>
                <div><div style={{ fontWeight: 700, color: s.color, fontSize: 12 }}>{s.title}</div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.cd}>
          <div style={S.ct2}>Tools & Resources</div>
          <div style={{ display: "grid", gap: 8 }}>
            {skipTraceTools.map(t => (
              <div key={t.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8, flexWrap: "wrap", gap: 6 }}>
                <div><div style={{ fontWeight: 700, fontSize: 12 }}>{t.name} <span style={{ color: t.cost === "Free" ? "#4ade80" : "#f59e0b", fontWeight: 600 }}>({t.cost})</span></div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{t.desc}</div></div>
                {t.url && <a href={t.url} target="_blank" rel="noopener noreferrer" style={S.lk}>Visit →</a>}
              </div>
            ))}
          </div>
        </div>
      </>)}

      {/* WHOLESALE DEAL CALC */}
      {stg === "wscalc" && (() => {
        const [c, sC] = useState({ taxes: 1200, sellerPayout: 800, repairCost: 3000, arv: 25000, assignFee: 1500 });
        const totalOffer = c.taxes + c.sellerPayout;
        const investorAllIn = totalOffer + c.repairCost + c.assignFee;
        const investorProfit = c.arv - investorAllIn;
        const investorROI = investorAllIn > 0 ? ((investorProfit / investorAllIn) * 100).toFixed(0) : 0;
        const maxOffer = c.arv * 0.7 - c.repairCost - c.assignFee;
        const seventyRule = c.arv * 0.7;
        return (<>
          <div style={S.cd}><div style={S.ct2}>Wholesale Deal Calculator</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12, lineHeight: 1.6 }}>The 70% Rule: Never offer more than 70% of <Tip term="ARV (After Repair Value)">ARV</Tip> minus repairs minus your fee. If the numbers work for your buyer, they work for you.</div>
            <div style={S.fg}>
              <div><div style={S.lb}>Back Taxes Owed</div><input style={S.ip} type="number" value={c.taxes} onChange={e => sC({ ...c, taxes: +e.target.value || 0 })} /></div>
              <div><div style={S.lb}>Seller Cash Payout</div><input style={S.ip} type="number" value={c.sellerPayout} onChange={e => sC({ ...c, sellerPayout: +e.target.value || 0 })} /></div>
              <div><div style={S.lb}>Est. Repair Cost</div><input style={S.ip} type="number" value={c.repairCost} onChange={e => sC({ ...c, repairCost: +e.target.value || 0 })} /></div>
              <div><div style={S.lb}><Tip term="ARV (After Repair Value)">ARV</Tip></div><input style={S.ip} type="number" value={c.arv} onChange={e => sC({ ...c, arv: +e.target.value || 0 })} /></div>
              <div><div style={S.lb}>Your <Tip term="Assignment Fee">Assignment Fee</Tip></div><input style={S.ip} type="number" value={c.assignFee} onChange={e => sC({ ...c, assignFee: +e.target.value || 0 })} /></div>
            </div>
          </div>
          <div style={{ ...S.g, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}>
            <div style={S.sc("#e6a919")}><div style={S.ac("#e6a919")} /><div style={S.lb}>Your Offer to Seller</div><div style={S.vl("#e6a919")}>{fmt(totalOffer)}</div><div style={{ fontSize: 10, color: "#6b7280" }}>Taxes + cash to owner</div></div>
            <div style={S.sc("#4ade80")}><div style={S.ac("#4ade80")} /><div style={S.lb}>Your Fee</div><div style={S.vl("#4ade80")}>{fmt(c.assignFee)}</div><div style={{ fontSize: 10, color: "#6b7280" }}>$0 capital required</div></div>
            <div style={S.sc("#60a5fa")}><div style={S.ac("#60a5fa")} /><div style={S.lb}>Investor All-In</div><div style={S.vl("#60a5fa")}>{fmt(investorAllIn)}</div><div style={{ fontSize: 10, color: "#6b7280" }}>Offer + repairs + fee</div></div>
            <div style={S.sc(investorProfit > 0 ? "#4ade80" : "#ef4444")}><div style={S.ac(investorProfit > 0 ? "#4ade80" : "#ef4444")} /><div style={S.lb}>Investor Profit</div><div style={S.vl(investorProfit > 0 ? "#4ade80" : "#ef4444")}>{fmt(investorProfit)}</div><div style={{ fontSize: 10, color: "#6b7280" }}>ROI: {investorROI}%</div></div>
          </div>
          <div style={S.cd}>
            <div style={S.ct2}>70% Rule Check</div>
            <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280" }}>ARV × 70%</span><span style={{ fontWeight: 700 }}>{fmt(seventyRule)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280" }}>− Repairs</span><span style={{ fontWeight: 700 }}>− {fmt(c.repairCost)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280" }}>− Your Fee</span><span style={{ fontWeight: 700 }}>− {fmt(c.assignFee)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}><span style={{ color: "#e6a919", fontWeight: 700 }}>MAX Offer to Seller</span><span style={{ fontWeight: 900, color: maxOffer > 0 ? "#4ade80" : "#ef4444", fontSize: 16 }}>{fmt(maxOffer)}</span></div>
              <div style={{ fontSize: 11, color: totalOffer <= maxOffer ? "#4ade80" : "#ef4444", fontWeight: 700, marginTop: 4, padding: 8, background: totalOffer <= maxOffer ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)", borderRadius: 6, textAlign: "center" }}>
                {totalOffer <= maxOffer ? `✅ DEAL WORKS — your ${fmt(totalOffer)} offer is ${fmt(maxOffer - totalOffer)} under max` : `❌ OVER MAX — reduce offer by ${fmt(totalOffer - maxOffer)} or find cheaper property`}
              </div>
            </div>
          </div>
        </>);
      })()}
    </>);
  };

  /* ─── BUY NOW ─── */
  const rBuy = () => (<>
    <div style={{ ...S.cd, background: "linear-gradient(135deg,rgba(74,222,128,0.05),rgba(230,169,25,0.05))", border: "1px solid rgba(74,222,128,0.2)" }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>Buy Today — No Auction Wait</div>
      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>Five active plays including <Tip term="Wholesaling">wholesale</Tip> deals requiring zero capital.</div>
    </div>
    {buyNowOptions.map(opt => (
      <div key={opt.type} style={S.cd}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#e6a919" }}>{opt.type}</div><span style={S.nw}>NOW</span></div>
        <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, marginBottom: 10 }}>{opt.desc}</div>
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 10, marginBottom: 10 }}><div style={{ fontSize: 10, fontWeight: 700, color: "#e6a919", marginBottom: 4 }}>HOW:</div><div style={{ fontSize: 11, color: "#c9d1d9", lineHeight: 1.6 }}>{opt.action}</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 8 }}>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 6 }}><div style={{ ...S.lb, fontSize: 8 }}>Returns</div><div style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>{opt.returns}</div></div>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 6 }}><div style={{ ...S.lb, fontSize: 8 }}>Risk</div><div style={{ fontSize: 11, color: riskLevels[opt.risk] || "#f59e0b", fontWeight: 600 }}>{opt.risk}</div></div>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 6 }}><div style={{ ...S.lb, fontSize: 8 }}>Legal Basis</div><div style={{ fontSize: 11, color: "#60a5fa" }}>{opt.statute}</div></div>
        </div>
        {opt.counties && <div style={{ display: "grid", gap: 4 }}>{opt.counties.map(c => (
          <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", background: "rgba(0,0,0,0.15)", borderRadius: 6, flexWrap: "wrap", gap: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 11 }}>{c.name}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {c.phone && <a href={`tel:${c.phone.replace(/-/g, "")}`} style={{ color: "#4ade80", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>{c.phone}</a>}
              {c.link && <a href={c.link.startsWith("http") ? c.link : `https://${c.link}`} target="_blank" rel="noopener noreferrer" style={S.lk}>Visit →</a>}
              {c.name === "Go to Wholesale Tab" && <button style={{ ...S.bt("p"), fontSize: 10, padding: "4px 10px" }} onClick={() => setTab("wholesale")}>Open →</button>}
            </div>
          </div>))}</div>}
      </div>))}
  </>);

  /* Remaining tabs: national, platforms, properties, glossary, checklist, calculator, counties — same as v3 but condensed */
  const fStates = stateFilter === "all" ? nationalStates : nationalStates.filter(s => s.type === stateFilter);
  const rNational = () => (<><div style={S.cd}><div style={S.ct2}>National Tax Lien & Deed Map — {nationalStates.length} States</div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{["all", "Tax Lien", "Tax Deed", "Hybrid", "Redeemable Deed"].map(f => <button key={f} onClick={() => setStateFilter(f)} style={{ ...S.bt(stateFilter === f ? "p" : ""), fontSize: 10, padding: "5px 10px" }}>{f === "all" ? "All" : f}</button>)}</div></div>
    <div style={{ display: "grid", gap: 8 }}>{fStates.map(s => (<div key={s.state} style={{ ...S.cd, marginBottom: 0, borderLeft: `3px solid ${typeColor[s.type] || "#6b7280"}` }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}><div><div style={{ fontWeight: 700, fontSize: 14, color: "#e6a919" }}>{s.state} {s.state === "Oklahoma" && "⭐"}</div><span style={S.bg(`${typeColor[s.type]}15`, typeColor[s.type], typeColor[s.type])}>{s.type}</span></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 900, color: "#4ade80" }}>{s.maxRate}</div></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 6, marginBottom: 6 }}>{[["Redemption", s.redemption], ["Bid", s.bidMethod], ["Sale", s.saleMonth], ["Platform", s.platform]].map(([l, v]) => <div key={l} style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: 5 }}><div style={{ ...S.lb, fontSize: 8 }}>{l}</div><div style={{ fontSize: 11 }}>{v}</div></div>)}</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>{s.otc && <span style={S.bg("rgba(74,222,128,0.1)", "#4ade80", "#4ade80")}>OTC</span>}{s.online && <span style={S.bg("rgba(96,165,250,0.1)", "#60a5fa", "#60a5fa")}>Online</span>}</div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.notes}</div>{s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ ...S.lk, display: "block", marginTop: 4, fontSize: 11 }}>Visit →</a>}</div>))}</div></>);

  const rPlatforms = () => (<><div style={S.cd}><div style={S.ct2}>Online Platforms & Research Tools</div></div><div style={{ display: "grid", gap: 8 }}>{platforms.map(p => <div key={p.name} style={{ ...S.cd, marginBottom: 0 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontWeight: 700, fontSize: 13, color: "#e6a919" }}>{p.name}</span><a href={p.url} target="_blank" rel="noopener noreferrer" style={S.lk}>Visit →</a></div><div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6, marginBottom: 4 }}>{p.desc}</div><div style={{ fontSize: 10, color: "#6b7280" }}>{p.states}</div></div>)}</div></>);

  const rProps = () => (<><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{data.properties.length} Properties</span><button style={S.bt("p")} onClick={() => setShowForm(true)}>+ Add</button></div>
    {data.properties.length === 0 ? <div style={{ ...S.cd, textAlign: "center", padding: 40 }}><div style={{ fontSize: 40, marginBottom: 12 }}>🏚️</div><div style={{ color: "#6b7280", marginBottom: 16 }}>No properties yet.</div><button style={S.bt("p")} onClick={() => setShowForm(true)}>Add First Property</button></div> :
    <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{["Address", "St", "Cost", "Value", "ROI", "Status", ""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>{data.properties.map(p => { const roi = p.minBid > 0 ? ((p.estimatedValue / p.minBid - 1) * 100).toFixed(0) : "—"; const sc = statusColors[p.status]; return <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => editProp(p)}><td style={S.td}><div style={{ fontWeight: 600, color: "#e6a919", fontSize: 11 }}>{p.address}</div><div style={{ fontSize: 9, color: "#6b7280" }}>{p.county}</div></td><td style={S.td}>{p.state}</td><td style={S.td}>{fmt(p.minBid)}</td><td style={S.td}>{fmt(p.estimatedValue)}</td><td style={{ ...S.td, color: Number(roi) > 50 ? "#4ade80" : "#f59e0b", fontWeight: 700 }}>{roi}%</td><td style={S.td}><span style={S.bg(sc.bg, sc.border, sc.text)}>{p.status}</span></td><td style={S.td}><button style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: 4, padding: "3px 6px", cursor: "pointer", fontFamily: "inherit" }} onClick={e => { e.stopPropagation(); delProp(p.id); }}>✕</button></td></tr>; })}</tbody></table></div>}</>);

  const fGloss = glossary.filter(g => g.term.toLowerCase().includes(gSearch.toLowerCase()) || g.def.toLowerCase().includes(gSearch.toLowerCase())).sort((a, b) => a.term.localeCompare(b.term));
  const rGloss = () => (<><div style={S.cd}><div style={S.ct2}>Tax Lien Glossary — {glossary.length} Terms</div><input style={S.ip} placeholder="Search..." value={gSearch} onChange={e => setGSearch(e.target.value)} /></div><div style={{ display: "grid", gap: 6 }}>{fGloss.map(g => <div key={g.term} style={{ ...S.cd, marginBottom: 0, padding: "12px 14px" }}><div style={{ fontWeight: 700, color: "#e6a919", fontSize: 12, marginBottom: 4 }}>{g.term}</div><div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>{g.def}</div></div>)}</div></>);

  const rCheck = () => { const tot = clItems.reduce((s, p) => s + p.items.length, 0), dn = Object.values(cl).filter(Boolean).length; return (<><div style={S.cd}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={S.ct2}>Progress</span><span style={{ fontSize: 14, fontWeight: 700, color: "#e6a919" }}>{dn}/{tot}</span></div><div style={S.pb}><div style={S.pf((dn / tot) * 100, "#e6a919")} /></div></div>
    {clItems.map(ph => <div key={ph.p} style={S.cd}><div style={S.ct2}>{ph.i} {ph.p}</div>{ph.items.map(it => <div key={it.k} style={S.ck} onClick={() => togCl(it.k)}><div style={S.cb(cl[it.k])}>{cl[it.k] && <span style={{ color: "#0a0a0f", fontSize: 12, fontWeight: 900 }}>✓</span>}</div><span style={{ fontSize: 11, color: cl[it.k] ? "#6b7280" : "#c9d1d9", textDecoration: cl[it.k] ? "line-through" : "none" }}>{it.t}</span></div>)}</div>)}</>); };

  const rCalc = () => { const [c, sC] = useState({ bt: 1200, fe: 300, av: 15000, mv: 25000, ol: 0 }); const tc = c.bt + c.fe + c.ol, m23 = (c.av * 2) / 3, lm = Math.min(m23, tc), pr = c.mv - lm, ro = lm > 0 ? ((pr / lm) * 100).toFixed(0) : 0;
    return (<><div style={S.cd}><div style={S.ct2}>Auction Deal Calculator (OK June Resale)</div><div style={S.fg}><div><div style={S.lb}>Back Taxes</div><input style={S.ip} type="number" value={c.bt} onChange={e => sC({ ...c, bt: +e.target.value || 0 })} /></div><div><div style={S.lb}>Fees</div><input style={S.ip} type="number" value={c.fe} onChange={e => sC({ ...c, fe: +e.target.value || 0 })} /></div><div><div style={S.lb}>Assessed Value</div><input style={S.ip} type="number" value={c.av} onChange={e => sC({ ...c, av: +e.target.value || 0 })} /></div><div><div style={S.lb}>Market Value</div><input style={S.ip} type="number" value={c.mv} onChange={e => sC({ ...c, mv: +e.target.value || 0 })} /></div></div></div>
    <div style={{ ...S.g, gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}><div style={S.sc("#e6a919")}><div style={S.ac("#e6a919")} /><div style={S.lb}>2/3 Assessed</div><div style={S.vl("#e6a919")}>{fmt(m23)}</div></div><div style={S.sc("#60a5fa")}><div style={S.ac("#60a5fa")} /><div style={S.lb}>Taxes+Fees</div><div style={S.vl("#60a5fa")}>{fmt(tc)}</div></div><div style={S.sc("#f59e0b")}><div style={S.ac("#f59e0b")} /><div style={S.lb}>Min Bid</div><div style={S.vl("#f59e0b")}>{fmt(lm)}</div></div><div style={S.sc(pr > 0 ? "#4ade80" : "#ef4444")}><div style={S.ac(pr > 0 ? "#4ade80" : "#ef4444")} /><div style={S.lb}>Profit</div><div style={S.vl(pr > 0 ? "#4ade80" : "#ef4444")}>{fmt(pr)}</div><div style={{ fontSize: 10, color: "#6b7280" }}>ROI: {ro}%</div></div></div></>); };

  const rCty = () => (<><div style={S.cd}><div style={S.ct2}>Oklahoma County Directory</div></div><div style={{ display: "grid", gap: 8 }}>{counties.map(c => <div key={c.name} style={{ ...S.cd, marginBottom: 0 }}><div style={{ fontWeight: 700, fontSize: 13, color: "#e6a919" }}>{c.name}</div><div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{c.addr}</div><div style={{ fontSize: 11 }}>📞 <a href={`tel:${c.phone.replace(/-/g, "")}`} style={S.lk}>{c.phone}</a>{c.delinqPhone !== c.phone && <span> · Delinquent: <a href={`tel:${c.delinqPhone.replace(/-/g, "")}`} style={S.lk}>{c.delinqPhone}</a></span>}</div>{c.website && <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" style={{ ...S.lk, fontSize: 10 }}>{c.website}</a>}</div>)}</div></>);

  const tabs = [["dashboard", "Home"], ["wholesale", "🥷 Wholesale"], ["buynow", "🟢 Buy Now"], ["national", "States"], ["platforms", "Online"], ["properties", "Properties"], ["glossary", "Glossary"], ["checklist", "Checklist"], ["calculator", "Calc"], ["counties", "Counties"]];

  return (
    <div style={S.app}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={S.hdr}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={S.logo}>TL</div><div><div style={{ fontSize: 20, fontWeight: 800, color: "#e6a919", letterSpacing: "-0.5px" }}>TAX LIEN PRO</div><div style={{ fontSize: 9, color: "#6b7280", letterSpacing: "2px", textTransform: "uppercase" }}>Auction + Wholesale Tracker</div></div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 26, fontWeight: 900, color: dJune <= 30 ? "#ef4444" : "#4ade80", lineHeight: 1 }}>{dJune}</div><div style={{ fontSize: 9, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase" }}>Days to OK June</div></div>
      </div>
      <div style={S.nav}>{tabs.map(([k, l]) => <button key={k} style={S.nb(tab === k)} onClick={() => setTab(k)}>{l}</button>)}</div>
      <div style={S.ct}>
        {tab === "dashboard" && rDash()}{tab === "wholesale" && rWholesale()}{tab === "buynow" && rBuy()}{tab === "national" && rNational()}{tab === "platforms" && rPlatforms()}
        {tab === "properties" && rProps()}{tab === "glossary" && rGloss()}{tab === "checklist" && rCheck()}{tab === "calculator" && rCalc()}{tab === "counties" && rCty()}
      </div>

      {/* Property Form Modal */}
      {showForm && <div style={S.ov} onClick={resetForm}><div style={S.md} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ fontSize: 15, fontWeight: 700, color: "#e6a919" }}>{editId ? "Edit" : "Add"} Property</div><button style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }} onClick={resetForm}>✕</button></div>
        <div style={S.fg}>
          <div><div style={S.lb}>State</div><select style={S.sl} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>{["OK", "FL", "AZ", "GA", "NJ", "IN", "IA", "AL", "CO", "TX", "IL", "SC", "Other"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><div style={S.lb}>County</div><input style={S.ip} value={form.county} onChange={e => setForm({ ...form, county: e.target.value })} /></div>
          <div><div style={S.lb}>Parcel ID</div><input style={S.ip} value={form.parcelId} onChange={e => setForm({ ...form, parcelId: e.target.value })} /></div>
          <div><div style={S.lb}>Address</div><input style={S.ip} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div><div style={S.lb}>Type</div><select style={S.sl} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["OTC Certificate", "Resale (June)", "Commissioner Sale", "October Tax Sale", "Online Auction", "County-Held Cert", "Wholesale"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><div style={S.lb}>Assessed Value</div><input style={S.ip} type="number" value={form.assessedValue} onChange={e => setForm({ ...form, assessedValue: e.target.value })} /></div>
          <div><div style={S.lb}>Cost / Bid</div><input style={S.ip} type="number" value={form.minBid} onChange={e => setForm({ ...form, minBid: e.target.value })} /></div>
          <div><div style={S.lb}>Est. Market Value</div><input style={S.ip} type="number" value={form.estimatedValue} onChange={e => setForm({ ...form, estimatedValue: e.target.value })} /></div>
          <div><div style={S.lb}>Status</div><select style={S.sl} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{Object.keys(statusColors).map(s => <option key={s}>{s}</option>)}</select></div>
          <div><div style={S.lb}>Risk</div><select style={S.sl} value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })}>{Object.keys(riskLevels).map(r => <option key={r}>{r}</option>)}</select></div>
          <div style={{ gridColumn: "1/-1" }}><div style={S.lb}>Notes</div><textarea style={{ ...S.ip, minHeight: 50 }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "flex-end" }}><button style={S.bt()} onClick={resetForm}>Cancel</button><button style={S.bt("p")} onClick={saveProperty}>{editId ? "Update" : "Add"}</button></div>
      </div></div>}

      {/* Lead Form Modal */}
      {showLeadForm && <div style={S.ov} onClick={resetLead}><div style={S.md} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ fontSize: 15, fontWeight: 700, color: "#ec4899" }}>{editLeadId ? "Edit" : "Add"} Lead</div><button style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }} onClick={resetLead}>✕</button></div>
        <div style={S.fg}>
          <div><div style={S.lb}>Property Address</div><input style={S.ip} value={leadForm.address} onChange={e => setLeadForm({ ...leadForm, address: e.target.value })} /></div>
          <div><div style={S.lb}>County</div><input style={S.ip} value={leadForm.county} onChange={e => setLeadForm({ ...leadForm, county: e.target.value })} /></div>
          <div><div style={S.lb}>Owner Name</div><input style={S.ip} value={leadForm.ownerName} onChange={e => setLeadForm({ ...leadForm, ownerName: e.target.value })} /></div>
          <div><div style={S.lb}>Phone</div><input style={S.ip} value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} /></div>
          <div><div style={S.lb}>Email</div><input style={S.ip} value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} /></div>
          <div><div style={S.lb}>Stage</div><select style={S.sl} value={leadForm.stage} onChange={e => setLeadForm({ ...leadForm, stage: e.target.value })}>{wsStages.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}</select></div>
          <div><div style={S.lb}>Taxes Owed</div><input style={S.ip} type="number" value={leadForm.taxesOwed} onChange={e => setLeadForm({ ...leadForm, taxesOwed: e.target.value })} /></div>
          <div><div style={S.lb}>Assessed Value</div><input style={S.ip} type="number" value={leadForm.assessedValue} onChange={e => setLeadForm({ ...leadForm, assessedValue: e.target.value })} /></div>
          <div><div style={S.lb}>Market Value</div><input style={S.ip} type="number" value={leadForm.marketValue} onChange={e => setLeadForm({ ...leadForm, marketValue: e.target.value })} /></div>
          <div><div style={S.lb}>Your Offer Amount</div><input style={S.ip} type="number" value={leadForm.offerAmount} onChange={e => setLeadForm({ ...leadForm, offerAmount: e.target.value })} /></div>
          <div><div style={S.lb}>Assignment Fee</div><input style={S.ip} type="number" value={leadForm.assignmentFee} onChange={e => setLeadForm({ ...leadForm, assignmentFee: e.target.value })} /></div>
          <div><div style={S.lb}>Letter Sent Date</div><input style={S.ip} type="date" value={leadForm.letterSent} onChange={e => setLeadForm({ ...leadForm, letterSent: e.target.value })} /></div>
          <div style={{ gridColumn: "1/-1" }}><div style={S.lb}>Notes</div><textarea style={{ ...S.ip, minHeight: 50 }} value={leadForm.notes} onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })} /></div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "flex-end" }}><button style={S.bt()} onClick={resetLead}>Cancel</button><button style={{ ...S.bt("p"), background: "rgba(236,72,153,0.15)", borderColor: "#ec4899", color: "#ec4899" }} onClick={saveLead}>{editLeadId ? "Update" : "Add"}</button></div>
      </div></div>}

      {/* Buyer Form Modal */}
      {showBuyerForm && <div style={S.ov} onClick={resetBuyer}><div style={S.md} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ fontSize: 15, fontWeight: 700, color: "#4ade80" }}>{editBuyerId ? "Edit" : "Add"} Buyer</div><button style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }} onClick={resetBuyer}>✕</button></div>
        <div style={S.fg}>
          <div><div style={S.lb}>Name</div><input style={S.ip} value={buyerForm.name} onChange={e => setBuyerForm({ ...buyerForm, name: e.target.value })} /></div>
          <div><div style={S.lb}>Type</div><select style={S.sl} value={buyerForm.type} onChange={e => setBuyerForm({ ...buyerForm, type: e.target.value })}>{wsBuyerTypes.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><div style={S.lb}>Phone</div><input style={S.ip} value={buyerForm.phone} onChange={e => setBuyerForm({ ...buyerForm, phone: e.target.value })} /></div>
          <div><div style={S.lb}>Email</div><input style={S.ip} value={buyerForm.email} onChange={e => setBuyerForm({ ...buyerForm, email: e.target.value })} /></div>
          <div><div style={S.lb}>Max Budget</div><input style={S.ip} type="number" value={buyerForm.maxBudget} onChange={e => setBuyerForm({ ...buyerForm, maxBudget: e.target.value })} /></div>
          <div><div style={S.lb}>Target Areas</div><input style={S.ip} value={buyerForm.areas} onChange={e => setBuyerForm({ ...buyerForm, areas: e.target.value })} /></div>
          <div style={{ gridColumn: "1/-1" }}><div style={S.lb}>Preferences (lot size, property type, etc.)</div><textarea style={{ ...S.ip, minHeight: 50 }} value={buyerForm.preferences} onChange={e => setBuyerForm({ ...buyerForm, preferences: e.target.value })} /></div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "flex-end" }}><button style={S.bt()} onClick={resetBuyer}>Cancel</button><button style={{ ...S.bt("p"), background: "rgba(74,222,128,0.15)", borderColor: "#4ade80", color: "#4ade80" }} onClick={saveBuyer}>{editBuyerId ? "Update" : "Add"}</button></div>
      </div></div>}
    </div>
  );
}
