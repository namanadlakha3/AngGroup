import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calculator, IndianRupee, TrendingUp, Calendar, Percent,
  ChevronDown, ChevronUp, Download, RefreshCw, Info
} from 'lucide-react';

/* ─────────────── helpers ─────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));

const fmtLakhs = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${fmt(n)}`;
};

function calcEMI(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

interface AmortRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

function buildAmortization(
  principal: number,
  annualRate: number,
  months: number,
  emi: number
): AmortRow[] {
  const r = annualRate / 12 / 100;
  let balance = principal;
  const rows: AmortRow[] = [];
  for (let m = 1; m <= months; m++) {
    const interest = annualRate === 0 ? 0 : balance * r;
    const prinPart = Math.min(emi - interest, balance);
    balance = Math.max(balance - prinPart, 0);
    rows.push({ month: m, emi, principal: prinPart, interest, balance });
  }
  return rows;
}

/* ─────────────── Slider component ─────────────── */
interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  color?: string;
}

function Slider({ min, max, step, value, onChange, color = '#C9A84C' }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative w-full h-6 flex items-center group">
      {/* Track */}
      <div className="absolute w-full h-1.5 rounded-full bg-black/8" />
      {/* Fill */}
      <div
        className="absolute h-1.5 rounded-full transition-all duration-150"
        style={{ width: `${pct}%`, background: color }}
      />
      {/* Native input (invisible, handles interaction) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="absolute w-full opacity-0 cursor-pointer h-full z-10"
        style={{ WebkitAppearance: 'none' }}
      />
      {/* Thumb */}
      <div
        className="absolute w-5 h-5 rounded-full border-2 shadow-md transition-all duration-150 group-hover:scale-110"
        style={{
          left: `calc(${pct}% - ${pct * 0.2}px)`,
          background: 'white',
          borderColor: color,
          boxShadow: `0 2px 8px ${color}55`,
        }}
      />
    </div>
  );
}

/* ─────────────── Donut chart ─────────────── */
interface DonutProps {
  principal: number;
  interest: number;
  color1?: string;
  color2?: string;
}
function DonutChart({ principal, interest, color1 = '#C9A84C', color2 = '#1A1A1A' }: DonutProps) {
  const total = principal + interest;
  if (total === 0) return null;
  const r = 60;
  const cx = 80;
  const cy = 80;
  const circ = 2 * Math.PI * r;
  const p1 = (principal / total) * circ;

  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-[180px] mx-auto drop-shadow-sm">
      {/* bg ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1ede3" strokeWidth="22" />
      {/* interest arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color2}
        strokeWidth="22"
        strokeDasharray={circ}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* principal arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color1}
        strokeWidth="22"
        strokeDasharray={circ}
        strokeDashoffset={circ - p1}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* center text */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#1A1A1A" fontSize="11" fontFamily="Outfit" fontWeight="600">
        Principal
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#C9A84C" fontSize="14" fontFamily="Outfit" fontWeight="700">
        {Math.round((principal / total) * 100)}%
      </text>
    </svg>
  );
}

/* ─────────────── Main page ─────────────── */
export default function EMICalculatorPage() {
  const { t } = useTranslation();

  // Inputs
  const [propertyPrice, setPropertyPrice] = useState(5000000);    // 50L
  const [downPaymentPct, setDownPaymentPct] = useState(20);       // %
  const [interestRate, setInterestRate] = useState(8.5);           // %
  const [tenureYears, setTenureYears] = useState(15);              // years
  const [processingFeeRate, setProcessingFeeRate] = useState(0.5); // %

  // Advanced toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Amortization toggle
  const [showAmort, setShowAmort] = useState(false);
  const [amortPage, setAmortPage] = useState(1);
  const ROWS_PER_PAGE = 12;

  // Derived
  const loanAmount = useMemo(() =>
    Math.max(0, propertyPrice * (1 - downPaymentPct / 100)),
    [propertyPrice, downPaymentPct]
  );
  const downPaymentAmt = useMemo(() => propertyPrice * (downPaymentPct / 100), [propertyPrice, downPaymentPct]);
  const months = tenureYears * 12;
  const emi = useMemo(() => calcEMI(loanAmount, interestRate, months), [loanAmount, interestRate, months]);
  const totalPayable = emi * months;
  const totalInterest = totalPayable - loanAmount;
  const processingFee = loanAmount * processingFeeRate / 100;

  const amortData = useMemo(() =>
    showAmort ? buildAmortization(loanAmount, interestRate, months, emi) : [],
    [showAmort, loanAmount, interestRate, months, emi]
  );

  const totalAmortPages = Math.ceil(amortData.length / ROWS_PER_PAGE);
  const pagedAmort = amortData.slice((amortPage - 1) * ROWS_PER_PAGE, amortPage * ROWS_PER_PAGE);

  // Reset amort page on input change
  useEffect(() => { setAmortPage(1); }, [loanAmount, interestRate, months]);

  const handleReset = useCallback(() => {
    setPropertyPrice(5000000);
    setDownPaymentPct(20);
    setInterestRate(8.5);
    setTenureYears(15);
    setProcessingFeeRate(0.5);
    setShowAdvanced(false);
  }, []);

  /* ── number input with clamp ── */
  const numInput = (
    label: string,
    value: number,
    set: (v: number) => void,
    min: number,
    max: number,
    prefix?: string,
    suffix?: string,
  ) => (
    <div className="flex items-center gap-2 bg-black/4 rounded-lg px-3 py-2 border border-black/6 focus-within:border-[#C9A84C]/50 transition-colors">
      {prefix && <span className="text-[#C9A84C] font-bold text-sm shrink-0">{prefix}</span>}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => set(Math.min(max, Math.max(min, Number(e.target.value))))}
        className="w-full bg-transparent text-charcoal font-semibold text-sm outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="text-charcoal-muted text-sm shrink-0">{suffix}</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF7] pt-24 pb-20">
      {/* Page header */}
      <div className="bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#C9A84C]/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-96 h-40 bg-[#C9A84C]/5 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
        </div>
        <div className="container mx-auto px-6 py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] mb-5">
              <span className="w-6 h-px bg-[#C9A84C]/50" />
              {t('emi.eyebrow', 'Smart Finance Planning')}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4 leading-tight">
              {t('emi.title', 'EMI Calculator')}
            </h1>
            <p className="text-white/50 text-lg font-light leading-relaxed max-w-xl">
              {t('emi.subtitle', 'Estimate your monthly payments, total interest, and plan your property investment with clarity.')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl -mt-0 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

          {/* ─── LEFT: Inputs ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Property Price */}
            <div className="bg-white rounded-2xl border border-black/6 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                    <IndianRupee size={14} className="text-[#C9A84C]" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {t('emi.property_price', 'Property Price')}
                  </span>
                </div>
                {numInput('', propertyPrice, setPropertyPrice, 500000, 100000000, '₹')}
              </div>
              <Slider
                min={500000} max={100000000} step={100000}
                value={propertyPrice} onChange={setPropertyPrice}
              />
              <div className="flex justify-between mt-2 text-[11px] text-charcoal-muted font-medium">
                <span>₹5 L</span><span>₹10 Cr</span>
              </div>
              <div className="mt-4 text-center">
                <span className="text-3xl font-sans font-bold text-charcoal">{fmtLakhs(propertyPrice)}</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="bg-white rounded-2xl border border-black/6 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1A]/8 flex items-center justify-center">
                    <TrendingUp size={14} className="text-[#1A1A1A]" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {t('emi.down_payment', 'Down Payment')}
                  </span>
                </div>
                {numInput('', downPaymentPct, setDownPaymentPct, 5, 90, undefined, '%')}
              </div>
              <Slider
                min={5} max={90} step={1}
                value={downPaymentPct} onChange={setDownPaymentPct}
                color="#1A1A1A"
              />
              <div className="flex justify-between mt-2 text-[11px] text-charcoal-muted font-medium">
                <span>5%</span><span>90%</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-[#C9A84C]/6 rounded-xl p-3 text-center border border-[#C9A84C]/15">
                  <p className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold mb-1">
                    {t('emi.down_amt', 'Down Payment')}
                  </p>
                  <p className="text-lg font-sans font-bold text-charcoal">{fmtLakhs(downPaymentAmt)}</p>
                </div>
                <div className="bg-[#1A1A1A]/4 rounded-xl p-3 text-center border border-black/6">
                  <p className="text-[10px] uppercase tracking-widest text-charcoal-muted font-bold mb-1">
                    {t('emi.loan_amt', 'Loan Amount')}
                  </p>
                  <p className="text-lg font-sans font-bold text-charcoal">{fmtLakhs(loanAmount)}</p>
                </div>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="bg-white rounded-2xl border border-black/6 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                    <Percent size={14} className="text-[#C9A84C]" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {t('emi.interest_rate', 'Interest Rate (p.a.)')}
                  </span>
                </div>
                {numInput('', interestRate, setInterestRate, 1, 20, undefined, '%')}
              </div>
              <Slider
                min={1} max={20} step={0.1}
                value={interestRate} onChange={setInterestRate}
              />
              <div className="flex justify-between mt-2 text-[11px] text-charcoal-muted font-medium">
                <span>1%</span><span>20%</span>
              </div>
              {/* Quick rate presets */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[7, 8, 8.5, 9, 9.5, 10].map(r => (
                  <button
                    key={r}
                    onClick={() => setInterestRate(r)}
                    className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                      interestRate === r
                        ? 'bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C]'
                        : 'border-black/10 text-charcoal-muted hover:border-[#C9A84C]/40'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="bg-white rounded-2xl border border-black/6 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1A]/8 flex items-center justify-center">
                    <Calendar size={14} className="text-[#1A1A1A]" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {t('emi.tenure', 'Loan Tenure')}
                  </span>
                </div>
                {numInput('', tenureYears, setTenureYears, 1, 30, undefined, t('emi.years', 'yrs'))}
              </div>
              <Slider
                min={1} max={30} step={1}
                value={tenureYears} onChange={setTenureYears}
                color="#1A1A1A"
              />
              <div className="flex justify-between mt-2 text-[11px] text-charcoal-muted font-medium">
                <span>1 {t('emi.yr', 'yr')}</span><span>30 {t('emi.yrs', 'yrs')}</span>
              </div>
              {/* Quick tenure presets */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[5, 10, 15, 20, 25, 30].map(y => (
                  <button
                    key={y}
                    onClick={() => setTenureYears(y)}
                    className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                      tenureYears === y
                        ? 'bg-[#1A1A1A] text-[#E8D08A] border-[#1A1A1A]'
                        : 'border-black/10 text-charcoal-muted hover:border-black/20'
                    }`}
                  >
                    {y}Y
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Toggle */}
            <div className="bg-white rounded-2xl border border-black/6 overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => setShowAdvanced(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-black/2 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                    <Calculator size={14} className="text-[#C9A84C]" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {t('emi.advanced', 'Advanced Options')}
                  </span>
                </div>
                {showAdvanced ? <ChevronUp size={16} className="text-charcoal-muted" /> : <ChevronDown size={16} className="text-charcoal-muted" />}
              </button>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-black/6"
                  >
                    <div className="p-6 space-y-5">
                      {/* Processing Fee */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-sm font-semibold text-charcoal">
                              {t('emi.processing_fee', 'Processing Fee')}
                            </span>
                            <p className="text-[11px] text-charcoal-muted mt-0.5">
                              {t('emi.processing_fee_desc', 'One-time fee charged by the lender')}
                            </p>
                          </div>
                          {numInput('', processingFeeRate, setProcessingFeeRate, 0, 3, undefined, '%')}
                        </div>
                        <Slider
                          min={0} max={3} step={0.1}
                          value={processingFeeRate} onChange={setProcessingFeeRate}
                        />
                        <div className="flex justify-between mt-2 text-[11px] text-charcoal-muted font-medium">
                          <span>0%</span><span>3%</span>
                        </div>
                        {processingFee > 0 && (
                          <p className="text-sm font-semibold text-[#C9A84C] mt-3">
                            {t('emi.fee_amt', 'Fee Amount')}: ₹{fmt(processingFee)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal-muted hover:text-charcoal transition-colors"
            >
              <RefreshCw size={13} />
              {t('emi.reset', 'Reset to Defaults')}
            </button>
          </motion.div>

          {/* ─── RIGHT: Results ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5 lg:sticky lg:top-28 lg:self-start"
          >
            {/* EMI Card */}
            <div className="bg-[#1A1A1A] rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-32 bg-[#C9A84C]/6 rounded-full blur-2xl" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]/80 mb-2">
                  {t('emi.monthly_emi', 'Monthly EMI')}
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl md:text-5xl font-sans font-bold text-white">
                    ₹{fmt(emi)}
                  </span>
                </div>
                <p className="text-white/35 text-xs font-medium">
                  {t('emi.per_month', 'per month for')} {tenureYears} {t('emi.years', 'years')} ({months} {t('emi.months', 'months')})
                </p>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="bg-white rounded-2xl border border-black/6 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-charcoal mb-5">
                {t('emi.payment_breakdown', 'Payment Breakdown')}
              </h3>

              {/* Donut */}
              <DonutChart principal={loanAmount} interest={totalInterest} />

              {/* Legend */}
              <div className="mt-5 space-y-3">
                {[
                  { label: t('emi.principal', 'Principal Amount'), value: loanAmount, color: '#C9A84C', pct: loanAmount / Math.max(1, totalPayable) * 100 },
                  { label: t('emi.total_interest', 'Total Interest'), value: totalInterest, color: '#1A1A1A', pct: totalInterest / Math.max(1, totalPayable) * 100 },
                  { label: t('emi.total_payable', 'Total Payable'), value: totalPayable, color: '#6B6B6B', pct: 100 },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: item.color }} />
                      <span className="text-sm text-charcoal-muted">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-charcoal">{fmtLakhs(item.value)}</span>
                      <span className="text-[10px] text-charcoal-muted ml-1.5">
                        ({item.pct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {showAdvanced && processingFee > 0 && (
                <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-sm text-charcoal-muted">{t('emi.processing_fee', 'Processing Fee')}</span>
                  <span className="text-sm font-bold text-[#C9A84C]">₹{fmt(processingFee)}</span>
                </div>
              )}
            </div>

            {/* Year-wise savings summary */}
            <div className="bg-white rounded-2xl border border-black/6 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-charcoal mb-4">
                {t('emi.annual_summary', 'Annual Summary')}
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: t('emi.annual_emi', 'Annual EMI'), value: emi * 12 },
                  { label: t('emi.total_cost', 'Total Cost (Loan + Interest)'), value: totalPayable },
                  { label: t('emi.effective_cost', 'Effective Property Cost'), value: totalPayable + downPaymentAmt },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-black/4 last:border-0">
                    <span className="text-xs text-charcoal-muted">{row.label}</span>
                    <span className="text-sm font-bold text-charcoal">{fmtLakhs(row.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="flex gap-3 bg-[#C9A84C]/6 border border-[#C9A84C]/20 rounded-xl p-4">
              <Info size={15} className="text-[#C9A84C] shrink-0 mt-0.5" />
              <p className="text-xs text-charcoal-muted leading-relaxed">
                {t('emi.tip', 'Increasing your down payment reduces your EMI and total interest significantly. A 5% higher down payment can save lakhs over the loan tenure.')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ─── Amortization Schedule ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 bg-white rounded-2xl border border-black/6 overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
        >
          <button
            onClick={() => setShowAmort(v => !v)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-black/2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-charcoal">
                {t('emi.amort_title', 'Full Amortization Schedule')}
              </h2>
              <span className="text-[11px] font-semibold text-charcoal-muted bg-black/5 px-2 py-0.5 rounded-full">
                {months} {t('emi.months', 'months')}
              </span>
            </div>
            {showAmort
              ? <ChevronUp size={18} className="text-charcoal-muted" />
              : <ChevronDown size={18} className="text-charcoal-muted" />}
          </button>

          <AnimatePresence>
            {showAmort && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-t border-black/5 overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-[#1A1A1A]">
                      <tr>
                        {[
                          t('emi.col_month', 'Month'),
                          t('emi.col_emi', 'EMI'),
                          t('emi.col_principal', 'Principal'),
                          t('emi.col_interest', 'Interest'),
                          t('emi.col_balance', 'Balance'),
                        ].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#E8D08A]/70">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pagedAmort.map((row, i) => (
                        <tr
                          key={row.month}
                          className={`border-b border-black/4 hover:bg-[#C9A84C]/4 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-black/1'}`}
                        >
                          <td className="px-5 py-3.5 font-semibold text-charcoal-muted text-xs">{row.month}</td>
                          <td className="px-5 py-3.5 font-bold text-charcoal">₹{fmt(row.emi)}</td>
                          <td className="px-5 py-3.5 text-[#C9A84C] font-semibold">₹{fmt(row.principal)}</td>
                          <td className="px-5 py-3.5 text-charcoal-muted">₹{fmt(row.interest)}</td>
                          <td className="px-5 py-3.5 font-semibold text-charcoal">₹{fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalAmortPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-black/5 bg-black/1">
                    <span className="text-xs text-charcoal-muted">
                      {t('emi.showing', 'Showing')} {(amortPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(amortPage * ROWS_PER_PAGE, months)} {t('emi.of', 'of')} {months}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAmortPage(p => Math.max(1, p - 1))}
                        disabled={amortPage === 1}
                        className="px-3 py-1.5 text-xs font-bold border border-black/10 rounded-lg disabled:opacity-30 hover:border-[#C9A84C]/40 transition-colors"
                      >
                        {t('emi.prev', 'Prev')}
                      </button>
                      <span className="text-xs font-semibold text-charcoal-muted px-2">
                        {amortPage} / {totalAmortPages}
                      </span>
                      <button
                        onClick={() => setAmortPage(p => Math.min(totalAmortPages, p + 1))}
                        disabled={amortPage === totalAmortPages}
                        className="px-3 py-1.5 text-xs font-bold border border-black/10 rounded-lg disabled:opacity-30 hover:border-[#C9A84C]/40 transition-colors"
                      >
                        {t('emi.next', 'Next')}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-8 text-[11px] text-charcoal-muted/60 text-center max-w-2xl mx-auto leading-relaxed">
          {t('emi.disclaimer', '* This calculator provides an estimate for informational purposes only. Actual EMI may vary based on lender terms, credit score, and applicable taxes. Please consult a financial advisor before making investment decisions.')}
        </p>
      </div>
    </div>
  );
}
