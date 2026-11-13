import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  Home,
  Landmark,
  Menu,
  MoreHorizontal,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type View = "timeline" | "vault" | "trust";
type SheetMode = "renewal" | "vault" | "architecture" | "audit" | "obligation" | null;
type DocumentRecord = {
  name: string;
  provider: string;
  category: string;
  reference: string;
  amount: string;
  date: string;
  expiry: string;
  terms: string;
  initials: string;
  tone: "green" | "coral" | "blue" | "gold";
};

const documents: DocumentRecord[] = [
  {
    name: "Home internet agreement",
    provider: "WE Egypt",
    category: "Connectivity",
    reference: "Contract · 2406–8819",
    amount: "EGP 650 / month",
    date: "Issued 15 Jun 2025",
    expiry: "Expires 27 Jun 2026",
    terms: "Mega 200 Mbps · 12-month term · zero early termination fee",
    initials: "WE",
    tone: "green",
  },
  {
    name: "Quarterly maintenance invoice",
    provider: "Nakhala Compound",
    category: "Home & property",
    reference: "Invoice · NK–Q2–061",
    amount: "EGP 4,850",
    date: "Issued 01 Jun 2026",
    expiry: "Due 01 Jul 2026",
    terms: "Quarterly compound maintenance · Unit B12",
    initials: "N",
    tone: "gold",
  },
  {
    name: "Prepaid electricity statement",
    provider: "North Cairo Electricity",
    category: "Utilities",
    reference: "Meter · 8831–402",
    amount: "Balance EGP 86",
    date: "Checked 15 Jun 2026",
    expiry: "Recharge recommended",
    terms: "Prepaid meter · Estimated 3 days remaining",
    initials: "NC",
    tone: "coral",
  },
  {
    name: "Tenancy agreement",
    provider: "Nakhala Residence",
    category: "Home & property",
    reference: "Lease · NKR–B12–25",
    amount: "EGP 26,000 / month",
    date: "Starts 01 Sep 2025",
    expiry: "Renews 31 Aug 2026",
    terms: "Annual lease · Two-month renewal notice",
    initials: "NR",
    tone: "blue",
  },
];

const documentByReference = (reference: string) =>
  documents.find((document) => document.reference === reference) ?? documents[0] ?? {
    name: "Household record",
    provider: "Beeti",
    category: "Home",
    reference: "Record",
    amount: "Not available",
    date: "Not available",
    expiry: "Not available",
    terms: "Illustrative household record",
    initials: "B",
    tone: "green" as const,
  };

const auditSeed = [
  { title: "Prepaid electricity balance checked", detail: "Routine status check · no external action", time: "Today, 09:14", icon: "check" },
  { title: "WE renewal comparison prepared", detail: "Vodafone Egypt offer verified · awaiting approval", time: "Today, 08:42", icon: "shield" },
  { title: "Compound invoice added to vault", detail: "Nakhala Compound · EGP 4,850 · due 01 Jul", time: "Yesterday, 16:20", icon: "file" },
];

const currency = (value: number) => `EGP ${value.toLocaleString("en-EG")}`;

function SectionHeading({ title, detail, action }: { title: string; detail?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
      <div>
        <h2 className="font-editorial text-2xl text-foreground">{title}</h2>
        {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusMark({ tone = "green" }: { tone?: "green" | "gold" | "coral" | "blue" }) {
  return <span aria-hidden="true" className={cn("status-mark", `status-mark-${tone}`)} />;
}

export function BeetiCommandCenter() {
  const [view, setView] = useState<View>("timeline");
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRecord>(documentByReference("Contract · 2406–8819"));
  const [selectedObligation, setSelectedObligation] = useState("Prepaid electricity meter");
  const [search, setSearch] = useState("");
  const [request, setRequest] = useState("");
  const [delegatedTask, setDelegatedTask] = useState("");
  const [approval, setApproval] = useState<"pending" | "authorized" | "declined">("pending");
  const [audit, setAudit] = useState(auditSeed);
  const [parseTokens, setParseTokens] = useState(182);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return documents;
    return documents.filter((document) =>
      [document.name, document.provider, document.category, document.reference].some((value) =>
        value.toLocaleLowerCase().includes(query),
      ),
    );
  }, [search]);

  const openDocument = (document: DocumentRecord) => {
    setSelectedDocument(document);
    setSheetMode("vault");
  };

  const delegateTask = () => {
    const cleanRequest = request.trim();
    if (!cleanRequest) return;
    setDelegatedTask(cleanRequest);
    setRequest("");
  };

  const reviewObligation = (name: string) => {
    setSelectedObligation(name);
    setSheetMode("obligation");
  };

  const decideApproval = (decision: "authorized" | "declined") => {
    if (approval !== "pending") return;
    setApproval(decision);
    const action = decision === "authorized" ? "Agent authorized — Vodafone offer change simulated and verified" : "WE renewal proposal declined";
    setAudit((current) => [
      { title: action, detail: decision === "authorized" ? "Demo only · no provider contacted · savings estimate EGP 350 / month" : "No changes made · original WE plan remains active", time: "Just now", icon: decision === "authorized" ? "check" : "shield" },
      ...current,
    ]);
  };

  const openVault = () => setView("vault");

  return (
    <div className="beeti-app min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="beeti-sidebar hidden w-[232px] shrink-0 flex-col border-r border-border px-5 py-7 lg:flex">
          <button className="mb-12 flex items-center gap-3 text-left" onClick={() => setView("timeline")} aria-label="Beeti home">
            <span className="brand-symbol"><Home size={17} strokeWidth={1.7} /></span>
            <span className="leading-none">
              <span className="block text-[18px] font-semibold tracking-normal">beeti</span>
              <span className="mt-1 block font-arabic text-[15px] text-primary" lang="ar" dir="rtl">بيتي</span>
            </span>
          </button>

          <div className="mb-3 px-3 text-[11px] font-semibold uppercase text-muted-foreground">Household</div>
          <Button variant="ghost" className="mb-8 h-auto justify-start gap-3 px-3 py-3 text-left" onClick={() => setMenuOpen((open) => !open)}>
            <span className="household-avatar">N</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Nakhala Household</span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Cairo, Egypt</span>
            </span>
            <ChevronDown size={15} className="text-muted-foreground" />
          </Button>
          {menuOpen && (
            <div className="-mt-7 mb-5 ml-2 border-l border-border py-2 pl-4 text-xs text-muted-foreground">
              <p>Home · New Administrative Capital</p>
              <p className="mt-1">2 household members</p>
            </div>
          )}

          <nav aria-label="Main navigation" className="space-y-1">
            <NavButton active={view === "timeline"} icon={<Home size={17} />} label="Life timeline" onClick={() => setView("timeline")} />
            <NavButton active={view === "vault"} icon={<FileText size={17} />} label="Personal vault" count="4" onClick={openVault} />
            <NavButton active={view === "trust"} icon={<ShieldCheck size={17} />} label="Trust center" count={approval === "pending" ? "1" : undefined} onClick={() => setView("trust")} />
          </nav>

          <div className="my-8 border-t border-border" />
          <button className="architecture-link group flex items-center gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-accent" onClick={() => setSheetMode("architecture")}>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><SlidersHorizontal size={15} /></span>
            <span>
              <span className="block text-sm font-medium">Quiet by design</span>
              <span className="mt-1 block text-xs text-muted-foreground">85% routine, no tokens</span>
            </span>
            <ArrowRight size={14} className="ml-auto text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <div className="mt-auto border-t border-border pt-5">
            <button className="flex w-full items-center gap-3 px-2 text-left" onClick={() => setSheetMode("audit")}>
              <span className="member-avatar">MA</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">Mohammed A.</span>
                <span className="mt-1 block text-xs text-muted-foreground">View activity log</span>
              </span>
              <MoreHorizontal size={18} className="text-muted-foreground" />
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="topbar flex items-center justify-between border-b border-border px-5 py-4 sm:px-8 lg:px-11">
            <div className="flex items-center gap-3">
              <button className="brand-symbol lg:hidden" onClick={() => setView("timeline")} aria-label="Beeti home"><Home size={16} /></button>
              <div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="lg:hidden font-semibold text-foreground">beeti <span className="font-arabic text-primary" lang="ar">بيتي</span></span>
                  <span className="hidden lg:inline">Sunday, 15 June 2026</span>
                  <span className="hidden lg:inline text-border">/</span>
                  <span className="hidden lg:inline">Nakhala Household</span>
                </div>
                <p className="mt-1 text-sm font-medium lg:hidden">Cairo, Egypt</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><StatusMark /> All systems calm</span>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications" title="Notifications">
                <Bell size={17} />
                {approval === "pending" && <span className="notification-dot" />}
              </Button>
              <button className="member-avatar" onClick={() => setSheetMode("audit")} aria-label="Open household activity log">MA</button>
            </div>
          </header>

          <div className="mx-auto max-w-[1190px] px-5 pb-14 pt-8 sm:px-8 sm:pt-10 lg:px-11 lg:pt-12">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h1 className="font-editorial text-[40px] leading-[1.06] sm:text-[48px]">Your home,<br className="sm:hidden" /> in good hands.</h1>
                <p className="mt-3 text-[15px] text-muted-foreground">A clear view of what needs tending, and what’s already taken care of.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-primary" />
                <span>Everything is up to date</span>
              </div>
            </div>

            <section className="metric-strip mb-8 grid grid-cols-2 border-y border-border py-4 sm:grid-cols-3 sm:py-5" aria-label="Household overview">
              <Metric value="4" label="Active obligations" detail="1 needs your attention" />
              <Metric value={approval === "authorized" ? "EGP 350" : "EGP 0"} label="Verified monthly savings" detail={approval === "authorized" ? "Vodafone switch · simulated" : "Waiting for your review"} />
              <button onClick={() => setSheetMode("architecture")} className="col-span-2 flex items-center justify-between px-1 py-4 text-left transition-colors hover:bg-accent/60 sm:col-span-1 sm:pl-6 sm:py-1">
                <div><div className="text-[26px] font-medium leading-none">85<span className="text-primary">%</span></div><div className="mt-2 text-xs text-muted-foreground">Routine work, zero tokens</div></div>
                <ArrowUpRight size={16} className="mr-2 text-muted-foreground" />
              </button>
            </section>

            <section className="delegate-bar mb-10" aria-label="Delegate a household task">
              <div className="flex items-center gap-2 text-[13px] font-medium text-foreground"><Send size={15} className="text-primary" /> What would you like handled?</div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Textarea
                  value={request}
                  onChange={(event) => setRequest(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); delegateTask(); } }}
                  placeholder="Delegate any household administrative task…"
                  aria-label="Describe a household task"
                  className="min-h-11 resize-none border-0 bg-transparent px-0 py-3 shadow-none focus-visible:ring-0 sm:flex-1"
                />
                <Button onClick={delegateTask} disabled={!request.trim()} className="h-10 gap-2 self-end px-4 sm:self-center"><span>Prepare task</span><ArrowRight size={15} /></Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Beeti prepares the next steps. You stay in control before anything is sent.</p>
            </section>

            {delegatedTask && (
              <section className="task-result mb-10 border-l-2 border-primary pl-5" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs text-muted-foreground">New task · ready for review</p><p className="mt-1 font-medium">{delegatedTask}</p></div>
                  <Button variant="outline" size="sm" onClick={() => setSheetMode("audit")}>View task plan <ArrowRight size={14} /></Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Outcome: a prepared plan with provider, timing, and cost checks. Nothing will be sent without your approval.</p>
              </section>
            )}

            <div className="mb-6 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-6" role="tablist" aria-label="Household views">
                <ViewTab active={view === "timeline"} onClick={() => setView("timeline")}>Life timeline</ViewTab>
                <ViewTab active={view === "vault"} onClick={() => setView("vault")}>Personal vault</ViewTab>
                <ViewTab active={view === "trust"} onClick={() => setView("trust")}>Trust center</ViewTab>
              </div>
              <span className="hidden pb-3 text-xs text-muted-foreground md:inline">Illustrative demo · no provider connected</span>
            </div>

            {view === "timeline" && (
              <div className="grid gap-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.8fr)] xl:gap-14">
                <section aria-labelledby="timeline-heading">
                  <div className="mb-6 flex items-end justify-between">
                    <div><h2 id="timeline-heading" className="font-editorial text-[25px]">Coming up</h2><p className="mt-1 text-sm text-muted-foreground">Four things on your household calendar</p></div>
                    <button className="text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground" onClick={() => setSheetMode("audit")}>Recent activity</button>
                  </div>
                  <TimelineGroup date="TODAY · 15 JUN" first>
                    <TimelineRow icon={<Zap size={17} />} iconTone="coral" title="Prepaid electricity meter" subtitle="North Cairo Electricity · EGP 86 remaining" when="Today" status="Low balance" statusTone="coral" onClick={() => reviewObligation("Prepaid electricity meter")} actionLabel="Check details" />
                  </TimelineGroup>
                  <TimelineGroup date="IN 2 DAYS · 17 JUN">
                    <TimelineRow icon={<Landmark size={17} />} iconTone="gold" title="Compound maintenance" subtitle="Nakhala Compound · Quarterly fee EGP 4,850" when="17 Jun" status="Due soon" statusTone="gold" onClick={() => openDocument(documentByReference("Invoice · NK–Q2–061"))} actionLabel="View invoice" />
                  </TimelineGroup>
                  <TimelineGroup date="IN 5 DAYS · 20 JUN">
                    <TimelineRow icon={<Clock3 size={17} />} iconTone="blue" title="Family clinic follow-up" subtitle="Dr. Yasmine Adel · New Cairo Medical Center" when="20 Jun · 5:30 PM" status="Scheduled" statusTone="blue" onClick={() => reviewObligation("Family clinic follow-up")} actionLabel="Appointment details" />
                  </TimelineGroup>
                  <TimelineGroup date="IN 12 DAYS · 27 JUN" last>
                    <article className="timeline-feature">
                      <div className="flex items-start gap-4">
                        <span className="event-icon event-icon-green mt-1"><FileCheck2 size={18} /></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div><h3 className="text-[17px] font-semibold">WE Home Fiber</h3><p className="mt-1 text-sm text-muted-foreground">Mega 200 Mbps · EGP 650 / month</p></div>
                            <span className="flex items-center gap-2 text-xs font-medium text-primary"><StatusMark /> Renewal review</span>
                          </div>
                          <div className="my-4 grid grid-cols-2 gap-4 border-y border-primary/15 py-3 sm:grid-cols-3">
                            <div><p className="text-[11px] text-muted-foreground">Current plan</p><p className="mt-1 text-sm font-medium">EGP 650 / mo</p></div>
                            <div><p className="text-[11px] text-muted-foreground">Alternative found</p><p className="mt-1 text-sm font-medium">EGP 300 / mo</p></div>
                            <div className="col-span-2 sm:col-span-1"><p className="text-[11px] text-muted-foreground">Potential saving</p><p className="mt-1 text-sm font-semibold text-primary">EGP 350 / mo</p></div>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs text-muted-foreground">Contract ends in 12 days · no termination fee</p>
                            <Button size="sm" onClick={() => setSheetMode("renewal")}>Review action <ArrowRight size={14} /></Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </TimelineGroup>
                  <div className="mt-7 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
                    <CheckCircle2 size={17} className="text-primary" /><span>Electricity recharge completed · 12 Jun</span>
                    <button className="ml-auto text-xs underline decoration-border underline-offset-4" onClick={() => setSheetMode("audit")}>Activity log</button>
                  </div>
                </section>

                <aside className="min-w-0">
                  <section className="border-t-2 border-primary pt-4" aria-labelledby="approval-heading">
                    <div className="flex items-start justify-between gap-3">
                      <div><h2 id="approval-heading" className="font-editorial text-[24px]">Your decision</h2><p className="mt-1 text-sm text-muted-foreground">One action is waiting for you</p></div>
                      <ShieldCheck size={20} className="mt-1 text-primary" />
                    </div>
                    <div className="mt-6 border-b border-border pb-5">
                      <p className="text-sm font-semibold">Lower your home internet bill</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">A comparable Vodafone Egypt plan may reduce the bill, with no cancellation charge.</p>
                      <div className="my-4 flex items-baseline gap-2"><span className="font-editorial text-[32px] text-primary">EGP 350</span><span className="text-xs text-muted-foreground">less each month</span></div>
                      {approval === "pending" ? (
                        <Button variant="outline" className="w-full justify-between" onClick={() => setSheetMode("renewal")}>Review the comparison <ArrowRight size={15} /></Button>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 size={16} />{approval === "authorized" ? "Reviewed · demo action verified" : "Proposal declined · no changes"}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-b border-border py-4">
                      <div><p className="text-[11px] text-muted-foreground">Risk</p><p className="mt-1 flex items-center gap-2 text-sm font-medium"><StatusMark /> Low</p></div>
                      <div><p className="text-[11px] text-muted-foreground">Reversibility</p><p className="mt-1 text-sm font-medium">Can be changed</p></div>
                    </div>
                    <button className="mt-4 flex w-full items-center justify-between py-2 text-left text-sm text-muted-foreground hover:text-foreground" onClick={() => setSheetMode("audit")}>See the full approval trail <ArrowRight size={15} /></button>
                  </section>

                  <section className="mt-10 border-t border-border pt-5">
                    <div className="flex items-center justify-between"><h2 className="font-editorial text-[22px]">Household at a glance</h2><span className="text-xs text-muted-foreground">This month</span></div>
                    <button onClick={openVault} className="flex w-full items-center gap-4 border-b border-border py-4 text-left hover:bg-accent/50">
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"><FileText size={16} /></span>
                      <span className="flex-1"><span className="block text-sm font-medium">4 documents in your vault</span><span className="mt-1 block text-xs text-muted-foreground">Contracts, bills and home records</span></span><ArrowRight size={15} className="text-muted-foreground" />
                    </button>
                    <button onClick={() => setSheetMode("architecture")} className="flex w-full items-center gap-4 py-4 text-left hover:bg-accent/50">
                      <span className="flex size-9 items-center justify-center rounded-full bg-brand-coral/15 text-brand-coral"><SlidersHorizontal size={16} /></span>
                      <span className="flex-1"><span className="block text-sm font-medium">Quiet, efficient routines</span><span className="mt-1 block text-xs text-muted-foreground">Routine dates checked without AI calls</span></span><ArrowRight size={15} className="text-muted-foreground" />
                    </button>
                  </section>
                </aside>
              </div>
            )}

            {view === "vault" && (
              <VaultView documents={filteredDocuments} search={search} onSearch={setSearch} onOpen={openDocument} />
            )}

            {view === "trust" && (
              <TrustView approval={approval} audit={audit} onReview={() => setSheetMode("renewal")} onAudit={() => setSheetMode("audit")} />
            )}
          </div>

          <footer className="mx-auto max-w-[1190px] border-t border-border px-5 py-5 text-xs text-muted-foreground sm:px-8 lg:px-11">
            <div className="flex flex-wrap items-center justify-between gap-3"><span>Beeti · بيتي <span className="mx-1 text-border">/</span> Illustrative household demo</span><span>Actions shown here do not contact providers or change services.</span></div>
          </footer>
        </main>
      </div>

      <Sheet open={sheetMode !== null} onOpenChange={(open) => { if (!open) setSheetMode(null); }}>
        <SheetContent side="right" className="w-full overflow-y-auto border-l border-border bg-background p-0 sm:max-w-[560px]">
          {sheetMode === "renewal" && (
            <RenewalSheet approval={approval} onDecision={decideApproval} onVault={() => openDocument(documentByReference("Contract · 2406–8819"))} />
          )}
          {sheetMode === "vault" && <VaultSheet document={selectedDocument} />}
          {sheetMode === "architecture" && <ArchitectureSheet parseTokens={parseTokens} setParseTokens={setParseTokens} />}
          {sheetMode === "audit" && <AuditSheet entries={audit} task={delegatedTask} />}
          {sheetMode === "obligation" && <ObligationSheet title={selectedObligation} onVault={openVault} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NavButton({ active, icon, label, count, onClick }: { active: boolean; icon: React.ReactNode; label: string; count?: string | undefined; onClick: () => void }) {
  return <Button variant="ghost" onClick={onClick} aria-current={active ? "page" : undefined} className={cn("w-full justify-start gap-3 px-3", active && "bg-accent font-semibold text-primary")}>
    {icon}<span className="flex-1 text-left">{label}</span>{count && <span className="min-w-5 text-center text-xs text-muted-foreground">{count}</span>}
  </Button>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="px-1 py-4 sm:py-1 sm:pr-6"><div className="text-[26px] font-medium leading-none">{value}</div><div className="mt-2 text-xs font-medium">{label}</div><div className="mt-1 text-[11px] text-muted-foreground">{detail}</div></div>;
}

function ViewTab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button role="tab" aria-selected={active} onClick={onClick} className={cn("relative py-3 text-sm text-muted-foreground transition-colors hover:text-foreground", active && "font-semibold text-primary after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:bg-primary")}>{children}</button>;
}

function TimelineGroup({ date, first, last, children }: { date: string; first?: boolean; last?: boolean; children: React.ReactNode }) {
  return <div className={cn("timeline-group", first && "timeline-group-first", last && "timeline-group-last")}>
    <div className="timeline-date"><span className="timeline-node" /><span>{date}</span></div>
    <div className="timeline-content">{children}</div>
  </div>;
}

function TimelineRow({ icon, iconTone, title, subtitle, when, status, statusTone, onClick, actionLabel }: { icon: React.ReactNode; iconTone: string; title: string; subtitle: string; when: string; status: string; statusTone: "green" | "gold" | "coral" | "blue"; onClick: () => void; actionLabel: string }) {
  return <button onClick={onClick} className="timeline-row group flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-accent/50 sm:py-[18px]">
    <span className={cn("event-icon shrink-0", `event-icon-${iconTone}`)}>{icon}</span>
    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{subtitle}</span><span className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground sm:hidden"><StatusMark tone={statusTone} />{status} · {when}</span></span>
    <span className="hidden min-w-[102px] text-right sm:block"><span className="flex items-center justify-end gap-2 text-xs font-medium"><StatusMark tone={statusTone} />{status}</span><span className="mt-2 block text-[11px] text-muted-foreground">{when}</span></span>
    <span className="sr-only">{actionLabel}</span><ArrowRight size={15} className="mr-1 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
  </button>;
}

function VaultView({ documents: entries, search, onSearch, onOpen }: { documents: DocumentRecord[]; search: string; onSearch: (value: string) => void; onOpen: (document: DocumentRecord) => void }) {
  return <section aria-labelledby="vault-heading">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><h2 id="vault-heading" className="font-editorial text-[30px]">Personal vault</h2><p className="mt-2 max-w-lg text-sm text-muted-foreground">A clear record of the agreements and household services that keep home running.</p></div><div className="text-sm text-muted-foreground">{entries.length} of {documents.length} documents</div></div>
    <div className="relative mb-5 max-w-lg"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search contracts, bills, providers…" aria-label="Search household documents" className="pl-10" /></div>
    <div className="grid gap-x-10 md:grid-cols-[minmax(0,1.25fr)_minmax(270px,0.75fr)]">
      <div>
        <div className="grid grid-cols-[1fr_auto] border-b border-border py-3 text-[11px] font-semibold uppercase text-muted-foreground"><span>Document</span><span>Next date</span></div>
        {entries.length ? entries.map((document) => <button key={document.reference} onClick={() => onOpen(document)} className="group grid w-full grid-cols-[1fr_auto] items-center gap-3 border-b border-border py-4 text-left transition-colors hover:bg-accent/50">
          <span className="flex min-w-0 items-center gap-3"><span className={cn("doc-icon", `doc-icon-${document.tone}`)}>{document.initials}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{document.name}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{document.provider} · {document.category}</span></span></span>
          <span className="text-right"><span className="block text-xs font-medium">{document.expiry.replace("Expires ", "")}</span><span className="mt-1 block text-[11px] text-muted-foreground">{document.amount}</span></span>
        </button>) : <div className="py-12 text-center text-sm text-muted-foreground">No household documents match “{search}”.</div>}
      </div>
      <div className="mt-8 border-t border-border pt-5 md:mt-0">
        <h3 className="font-editorial text-[22px]">At a glance</h3>
        <p className="mt-1 text-sm text-muted-foreground">Key dates extracted from your records</p>
        <div className="mt-4 space-y-0">
          <VaultDate label="Internet agreement" date="27 Jun" note="12 days · review renewal" tone="coral" />
          <VaultDate label="Nakhala maintenance" date="01 Jul" note="Quarterly · EGP 4,850" tone="gold" />
          <VaultDate label="Tenancy agreement" date="31 Aug" note="Renewal notice required" tone="blue" />
        </div>
        <div className="mt-6 border-t border-border pt-4"><div className="flex items-center gap-2 text-sm font-medium"><ShieldCheck size={16} className="text-primary" />Private to your household</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Documents shown are illustrative. Your demo does not upload or store personal files.</p></div>
      </div>
    </div>
  </section>;
}

function VaultDate({ label, date, note, tone }: { label: string; date: string; note: string; tone: string }) {
  return <div className="flex items-start gap-3 border-b border-border py-3"><span className={cn("mt-1 size-2 rounded-full", `bg-brand-${tone}`)} /><div className="flex-1"><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div><span className="text-xs font-medium">{date}</span></div>;
}

function TrustView({ approval, audit, onReview, onAudit }: { approval: "pending" | "authorized" | "declined"; audit: typeof auditSeed; onReview: () => void; onAudit: () => void }) {
  return <section aria-labelledby="trust-heading">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><h2 id="trust-heading" className="font-editorial text-[30px]">Trust center</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Nothing acts on your behalf without a clear proposal and your approval.</p></div><button onClick={onAudit} className="flex items-center gap-2 text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"><Clock3 size={15} />Full activity trail</button></div>
    {approval === "pending" ? <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="border-t-2 border-primary pt-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-muted-foreground">Awaiting review · 12 days until renewal</p><h3 className="mt-2 font-editorial text-[26px]">Switch to a lower monthly rate</h3><p className="mt-2 text-sm text-muted-foreground">WE Mega 200 Mbps → Vodafone VDSL Super</p></div><StatusMark /></div>
        <div className="my-7 grid grid-cols-2 border-y border-border">
          <div className="border-r border-border py-5 pr-5"><p className="text-xs text-muted-foreground">Current · WE Egypt</p><p className="mt-3 text-[15px] font-semibold">Mega 200 Mbps</p><p className="mt-2 font-editorial text-[27px]">EGP 650<span className="ml-1 font-sans text-xs font-normal text-muted-foreground">/ mo</span></p><p className="mt-2 text-xs text-muted-foreground">Contract ends 27 Jun</p></div>
          <div className="py-5 pl-5"><p className="text-xs text-muted-foreground">Alternative · Vodafone Egypt</p><p className="mt-3 text-[15px] font-semibold">VDSL Super</p><p className="mt-2 font-editorial text-[27px] text-primary">EGP 300<span className="ml-1 font-sans text-xs font-normal text-muted-foreground">/ mo</span></p><p className="mt-2 text-xs text-muted-foreground">Equivalent speed · checked 15 Jun</p></div>
        </div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs text-muted-foreground">Estimated net savings</p><p className="mt-1 font-editorial text-[30px] text-primary">EGP 350 <span className="font-sans text-sm text-muted-foreground">/ month</span></p></div><p className="text-xs text-muted-foreground">EGP 4,200 / year</p></div>
        <div className="flex flex-wrap gap-2"><Button onClick={onReview}>Review full proposal <ArrowRight size={15} /></Button><Button variant="ghost" onClick={onAudit}>View audit trail</Button></div>
      </div>
      <div className="border-t border-border pt-5">
        <h3 className="font-editorial text-[22px]">Policy &amp; safeguards</h3>
        <div className="mt-5 space-y-4">
          <TrustFact title="Risk level" value="Low" note="Plan comparison verified against listed terms" />
          <TrustFact title="Reversibility" value="Can be changed" note="No long-term lock-in in this offer" />
          <TrustFact title="Termination fee" value="EGP 0" note="WE agreement states no early cancellation penalty" />
          <TrustFact title="Your approval" value="Required" note="No message is sent until you authorize the demo action" />
        </div>
        <div className="mt-7 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Sample proposal for demonstration. Provider rates and availability are illustrative, not live quotations.</div>
      </div>
    </div> : <div className="max-w-2xl border-t-2 border-primary pt-6"><div className="flex items-center gap-3"><CheckCircle2 size={22} className="text-primary" /><h3 className="font-editorial text-[25px]">{approval === "authorized" ? "Approval recorded" : "Proposal declined"}</h3></div><p className="mt-3 text-sm text-muted-foreground">{approval === "authorized" ? "The demo action was simulated, the comparison verified, and the result added to your activity trail. No provider was contacted." : "No changes were made. The WE plan remains as listed in this demo."}</p><button onClick={onAudit} className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">Open the audit trail <ArrowRight size={15} /></button></div>}
    <div className="mt-10 border-t border-border pt-5"><div className="flex items-center justify-between"><h3 className="font-editorial text-[22px]">Recent decisions</h3><button className="text-xs text-muted-foreground underline decoration-border underline-offset-4" onClick={onAudit}>See all</button></div><div className="mt-2">{audit.slice(0, 2).map((entry, index) => <AuditRow key={`${entry.time}-${index}`} entry={entry} />)}</div></div>
  </section>;
}

function TrustFact({ title, value, note }: { title: string; value: string; note: string }) {
  return <div className="grid grid-cols-[minmax(100px,0.65fr)_1fr] gap-3 border-b border-border pb-3"><div className="text-xs text-muted-foreground">{title}</div><div><p className="text-sm font-semibold">{value}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p></div></div>;
}

function SheetIntro({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="border-b border-border px-6 pb-6 pt-8 sm:px-8"><div className="flex items-start gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</span><div className="pr-5"><SheetTitle className="font-editorial text-[26px] font-normal leading-tight">{title}</SheetTitle><SheetDescription className="mt-2 text-sm leading-6">{description}</SheetDescription></div></div></div>;
}

function RenewalSheet({ approval, onDecision, onVault }: { approval: "pending" | "authorized" | "declined"; onDecision: (decision: "authorized" | "declined") => void; onVault: () => void }) {
  return <div className="flex min-h-full flex-col">
    <SheetIntro icon={<ShieldCheck size={19} />} title="Review the renewal" description="A lower monthly rate was found for your home internet. Review each term before deciding." />
    <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6 sm:px-8">
      <section><h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Plan comparison</h3><div className="grid grid-cols-2 border-y border-border">
        <div className="border-r border-border py-4 pr-4"><p className="text-xs text-muted-foreground">CURRENT · WE EGYPT</p><p className="mt-3 text-sm font-semibold">Mega 200 Mbps</p><p className="mt-2 font-editorial text-[25px]">EGP 650<span className="ml-1 font-sans text-xs text-muted-foreground">/ month</span></p></div>
        <div className="py-4 pl-4"><p className="text-xs text-muted-foreground">ALTERNATIVE · VODAFONE EGYPT</p><p className="mt-3 text-sm font-semibold">VDSL Super</p><p className="mt-2 font-editorial text-[25px] text-primary">EGP 300<span className="ml-1 font-sans text-xs text-muted-foreground">/ month</span></p></div>
      </div><div className="flex items-baseline justify-between py-4"><span className="text-sm">Verified net savings</span><span className="text-right"><strong className="font-editorial text-[27px] text-primary">EGP 350</strong><span className="ml-1 text-xs text-muted-foreground">/ month</span><span className="mt-1 block text-xs text-muted-foreground">EGP 4,200 / year</span></span></div></section>

      <section><h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Policy &amp; risk</h3><div className="border-y border-border">
        <DetailLine label="Risk assessment" value="Low risk" valueTone="good" />
        <DetailLine label="Service speed" value="Equivalent 200 Mbps" />
        <DetailLine label="Termination penalty" value="None · EGP 0" />
        <DetailLine label="Reversibility" value="Can be changed" last />
      </div></section>

      <section><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold uppercase text-muted-foreground">Message prepared for provider</h3><span className="text-[11px] text-muted-foreground">Not sent</span></div>
        <div className="message-preview"><p className="text-xs text-muted-foreground">To · Vodafone Egypt</p><p className="mt-3 text-sm leading-6">Hello, I’m interested in switching my household’s home internet to the VDSL Super plan at EGP 300 per month. Please confirm the 200 Mbps speed, installation availability in New Administrative Capital, and any one-time fees before proceeding. Thank you.</p></div>
      </section>

      <button onClick={onVault} className="flex w-full items-center justify-between border-t border-border pt-4 text-left text-sm"><span><span className="block font-medium">Source document</span><span className="mt-1 block text-xs text-muted-foreground">WE home internet agreement · Expires 27 Jun</span></span><ArrowRight size={16} className="text-muted-foreground" /></button>
      {approval !== "pending" && <div className="border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">{approval === "authorized" ? "Authorized and verified in demo mode. No provider was contacted." : "Proposal declined. No changes were made."}</div>}
    </div>
    <div className="sticky bottom-0 border-t border-border bg-background px-6 py-4 sm:px-8">
      {approval === "pending" ? <><p className="mb-3 text-[11px] leading-5 text-muted-foreground">Authorizing simulates a verified action for this demo. It will not contact Vodafone or change your service.</p><div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => onDecision("declined")}>Decline</Button><Button className="flex-1" onClick={() => onDecision("authorized")}>Authorize agent <ArrowRight size={15} /></Button></div></> : <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary"><CheckCircle2 size={17} />Decision recorded in the activity trail</div>}
    </div>
  </div>;
}

function DetailLine({ label, value, valueTone, last }: { label: string; value: string; valueTone?: "good"; last?: boolean }) {
  return <div className={cn("flex items-center justify-between gap-4 py-3", !last && "border-b border-border")}><span className="text-xs text-muted-foreground">{label}</span><span className={cn("text-sm font-medium", valueTone === "good" && "text-primary")}>{value}</span></div>;
}

function VaultSheet({ document }: { document: DocumentRecord }) {
  return <div>
    <SheetIntro icon={<FileText size={19} />} title={document.name} description={`${document.provider} · ${document.category}`} />
    <div className="px-6 py-6 sm:px-8">
      <div className="document-preview" aria-label="Illustrative document preview">
        <div className="flex items-start justify-between border-b border-border pb-4"><div><p className="font-editorial text-[19px]">{document.provider}</p><p className="mt-1 text-[9px] text-muted-foreground">HOUSEHOLD SERVICE RECORD</p></div><span className="doc-preview-mark">{document.initials}</span></div>
        <div className="mt-5"><p className="text-[9px] font-semibold uppercase text-muted-foreground">{document.category} · {document.reference}</p><h3 className="mt-3 font-editorial text-[22px]">{document.name}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{document.terms}</p></div>
        <div className="my-5 space-y-3">{["ACCOUNT HOLDER", "SERVICE ADDRESS", "CONTRACT DETAILS"].map((label, index) => <div key={label}><p className="text-[8px] font-semibold text-muted-foreground">{label}</p><div className={cn("document-line", index === 2 && "w-2/3")} /></div>)}</div>
        <div className="flex items-end justify-between border-t border-border pt-4"><div><p className="text-[8px] font-semibold text-muted-foreground">AMOUNT</p><p className="mt-1 text-sm font-medium">{document.amount}</p></div><div className="text-right"><p className="text-[8px] font-semibold text-muted-foreground">STATUS DATE</p><p className="mt-1 text-xs">{document.date}</p></div></div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">Illustrative preview · no personal document stored</p>
      <h3 className="mt-8 border-b border-border pb-3 text-xs font-semibold uppercase text-muted-foreground">Extracted details</h3>
      <div>
        <DetailLine label="Provider" value={document.provider} />
        <DetailLine label="Reference" value={document.reference.replace("Contract · ", "")} />
        <DetailLine label="Amount" value={document.amount} />
        <DetailLine label="Issued" value={document.date.replace("Issued ", "")} />
        <DetailLine label="Next date" value={document.expiry} />
        <DetailLine label="Terms" value={document.terms} last />
      </div>
      <div className="mt-7 border-t border-border pt-4"><p className="flex items-center gap-2 text-sm font-medium"><ShieldCheck size={16} className="text-primary" />Household document</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Details shown are sample content created for this interactive demo.</p></div>
    </div>
  </div>;
}

function ArchitectureSheet({ parseTokens, setParseTokens }: { parseTokens: number; setParseTokens: (tokens: number) => void }) {
  return <div>
    <SheetIntro icon={<SlidersHorizontal size={19} />} title="Quiet by design" description="Routine household tracking is deterministic. Language models are reserved for structured work that needs interpretation." />
    <div className="px-6 py-6 sm:px-8">
      <div className="mb-7 grid grid-cols-2 border-y border-border py-5">
        <div className="border-r border-border pr-4"><p className="font-editorial text-[34px] text-primary">85%</p><p className="mt-2 text-sm font-medium">Handled deterministically</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Dates, reminders, statuses and household schedule rules.</p></div>
        <div className="pl-4"><p className="font-editorial text-[34px]">0</p><p className="mt-2 text-sm font-medium">Tokens for routine checks</p><p className="mt-1 text-xs leading-5 text-muted-foreground">No model call to notice a date or change a status.</p></div>
      </div>
      <div className="mb-7 border-b border-border pb-6"><h3 className="font-editorial text-[22px]">A small, structured model call</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Document extraction and negotiation drafts use a compact, cached JSON schema instead of open-ended chat.</p>
        <div className="mt-5 flex items-end justify-between gap-4"><label htmlFor="token-count" className="text-sm font-medium">Document parse estimate</label><div className="flex items-center gap-2"><Input id="token-count" type="number" inputMode="numeric" min={0} max={500} step={10} value={parseTokens} onChange={(event) => setParseTokens(Math.max(0, Math.min(500, Number(event.target.value) || 0)))} className="w-24 text-right" /><span className="text-xs text-muted-foreground">tokens</span></div></div>
        <input aria-label="Adjust document parse token estimate" className="mt-4 w-full accent-primary" type="range" min={0} max={500} step={10} value={parseTokens} onChange={(event) => setParseTokens(Number(event.target.value))} />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>0 tokens</span><span>Sample: 182</span><span>500</span></div>
        <div className="mt-5 flex items-center justify-between"><span className="text-sm">Structured document extraction</span><span className="text-sm font-semibold text-primary">{parseTokens} / &lt;250 tokens</span></div>
      </div>
      <div className="space-y-4"><ArchitectureStep number="01" title="Local rules" detail="Expiry dates, due dates and routine status transitions." value="No tokens" /><ArchitectureStep number="02" title="Compact schema" detail="Provider, amount, dates and terms, returned as cached JSON." value="Under 250" /><ArchitectureStep number="03" title="Approval boundary" detail="The person at home reviews any consequential action first." value="Always human-led" /></div>
      <div className="mt-7 border-t border-border pt-4 text-[11px] leading-5 text-muted-foreground">Architecture figures are illustrative design targets, not measured production telemetry. The 85% share is a product claim shown for demo purposes.</div>
    </div>
  </div>;
}

function ArchitectureStep({ number, title, detail, value }: { number: string; title: string; detail: string; value: string }) {
  return <div className="flex items-start gap-3"><span className="pt-0.5 font-mono text-xs text-primary">{number}</span><div className="flex-1"><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div><span className="pt-0.5 text-right text-[11px] font-medium">{value}</span></div>;
}

function AuditSheet({ entries, task }: { entries: typeof auditSeed; task: string }) {
  return <div>
    <SheetIntro icon={<Clock3 size={19} />} title="Activity trail" description="A plain record of what changed, what was proposed, and what is still waiting for you." />
    <div className="px-6 py-6 sm:px-8">
      {task && <div className="mb-6 border-l-2 border-primary pl-4"><p className="text-[11px] text-muted-foreground">Prepared task · awaiting your review</p><p className="mt-1 text-sm font-medium">{task}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">A plan is ready. No provider messages or external actions were performed.</p></div>}
      <div className="border-t border-border">{entries.map((entry, index) => <AuditRow key={`${entry.time}-${index}`} entry={entry} />)}</div>
      <div className="mt-8 border-t border-border pt-5"><h3 className="text-sm font-medium">Approval boundary</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">No consequential action is taken until a household member reviews and authorizes it. This demo records decisions only in the current page session.</p></div>
    </div>
  </div>;
}

function AuditRow({ entry }: { entry: (typeof auditSeed)[number] }) {
  const icon = entry.icon === "check" ? <CheckCircle2 size={15} /> : entry.icon === "file" ? <FileText size={15} /> : <ShieldCheck size={15} />;
  return <div className="flex gap-3 border-b border-border py-4"><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">{icon}</span><div className="min-w-0 flex-1"><p className="text-sm font-medium leading-5">{entry.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.detail}</p></div><time className="shrink-0 pt-1 text-[10px] text-muted-foreground">{entry.time}</time></div>;
}

function ObligationSheet({ title, onVault }: { title: string; onVault: () => void }) {
  const electricity = title.includes("electricity");
  const clinic = title.includes("clinic");
  const icon = electricity ? <Zap size={18} /> : clinic ? <Clock3 size={18} /> : <Landmark size={18} />;
  const detail = electricity ? "North Cairo Electricity · Prepaid meter 8831–402" : clinic ? "Dr. Yasmine Adel · New Cairo Medical Center" : "Nakhala Compound · New Administrative Capital";
  return <div><SheetIntro icon={icon} title={title} description={detail} /><div className="px-6 py-6 sm:px-8"><div className="space-y-0 border-y border-border">{electricity ? <><DetailLine label="Meter balance" value="EGP 86" valueTone="good" /><DetailLine label="Estimated remaining" value="About 3 days" /><DetailLine label="Next step" value="Recharge prepaid card" last /></> : clinic ? <><DetailLine label="Appointment" value="20 Jun · 5:30 PM" /><DetailLine label="Location" value="New Cairo Medical Center" /><DetailLine label="Household member" value="Nakhala Household" last /></> : <><DetailLine label="Quarterly fee" value="EGP 4,850" /><DetailLine label="Due date" value="17 Jun 2026" /><DetailLine label="Property" value="Unit B12 · Nakhala" last /></>}</div><div className="mt-6 border-l-2 border-primary pl-4"><p className="text-sm font-medium">Next step</p><p className="mt-2 text-xs leading-5 text-muted-foreground">We’ll keep this obligation visible and prepare a reminder. Any payment or booking remains yours to approve.</p></div><Button variant="outline" className="mt-6 w-full justify-between" onClick={onVault}>See the related household record <ArrowRight size={15} /></Button></div></div>;
}