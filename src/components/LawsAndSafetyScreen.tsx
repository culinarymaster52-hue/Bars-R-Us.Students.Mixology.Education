import React, { useMemo, useState } from 'react';
import { US_STATE_ALCOHOL_LAWS } from '../data/BarCraftData';
import { AlcoholLaw } from '../models/AcademyModels';
import {
  Search,
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ExternalLink,
  Award,
} from 'lucide-react';

const EXTERNAL_CERTIFICATION_PORTALS = [
  {
    name: 'TIPS (Training for Intervention ProcedureS)',
    organization: '360training / Health Communications, Inc.',
    url: 'https://www.gettips.com/',
    description:
      'Industry-standard On-Premise & Off-Premise responsible alcohol service certification accepted across US jurisdictions for bartenders, servers, and hospitality managers.',
  },
  {
    name: 'ServSafe Alcohol Certification',
    organization: 'National Restaurant Association',
    url: 'https://www.servsafe.com/ServSafe-Alcohol',
    description:
      'Official National Restaurant Association training covering BAC science, checking IDs, recognizing signs of intoxication, and Dram Shop liability defense.',
  },
  {
    name: 'California ABC — Responsible Beverage Service (RBS)',
    organization: 'CA Dept. of Alcoholic Beverage Control',
    url: 'https://www.abc.ca.gov/education/rbs/',
    description:
      'Mandatory portal for all California on-premise alcohol servers and managers.',
  },
  {
    name: 'Texas TABC Seller / Server Certification',
    organization: 'Texas Alcoholic Beverage Commission',
    url: 'https://www.tabc.texas.gov/services/tabc-certification/',
    description:
      'Official Texas seller/server training portal providing Safe Harbor protection for hospitality employers.',
  },
  {
    name: 'United States Bartenders’ Guild (USBG)',
    organization: 'USBG National Guild & Education',
    url: 'https://www.usbg.org/',
    description:
      'Professional association for career bartenders, barbacks, and hospitality spirits educators.',
  },
  {
    name: 'Cicerone Certification Program',
    organization: 'Certified Beer Server & Cicerone',
    url: 'https://www.cicerone.org/',
    description:
      'Global standard for draft line hygiene, beer styles, off-flavor diagnostics, and proper glassware service.',
  },
];

export const LawsAndSafetyScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainingFilter, setTrainingFilter] = useState<
    'ALL' | 'Mandatory' | 'Voluntary (Incentivized)'
  >('ALL');
  const [happyHourFilter, setHappyHourFilter] = useState<'ALL' | 'ALLOWED' | 'BANNED'>('ALL');
  const [selectedState, setSelectedState] = useState<AlcoholLaw>(
    US_STATE_ALCOHOL_LAWS.find((s) => s.stateCode === 'NY') ?? US_STATE_ALCOHOL_LAWS[0]
  );

  // Widmark BAC Educational Simulator State
  const [guestWeightLbs, setGuestWeightLbs] = useState(165);
  const [standardDrinks, setStandardDrinks] = useState(3);
  const [hoursElapsed, setHoursElapsed] = useState(2);
  const [distributionRatio, setDistributionRatio] = useState<0.68 | 0.55>(0.68);

  const estimatedBac = useMemo(() => {
    const alcoholGrams = standardDrinks * 14;
    const weightGrams = guestWeightLbs * 453.592;
    const rawBac = (alcoholGrams / (weightGrams * distributionRatio)) * 100 - 0.015 * hoursElapsed;
    return Math.max(0, Number(rawBac.toFixed(3)));
  }, [guestWeightLbs, standardDrinks, hoursElapsed, distributionRatio]);

  const filteredStates = useMemo(() => {
    return US_STATE_ALCOHOL_LAWS.filter((st) => {
      if (trainingFilter !== 'ALL' && st.mandatoryServerTraining !== trainingFilter) {
        return false;
      }
      if (happyHourFilter === 'ALLOWED' && !st.happyHourAllowed) return false;
      if (happyHourFilter === 'BANNED' && st.happyHourAllowed) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        st.stateName.toLowerCase().includes(q) ||
        st.stateCode.toLowerCase().includes(q) ||
        st.certificationName.toLowerCase().includes(q) ||
        st.keyComplianceNote.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, trainingFilter, happyHourFilter]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>50 US States & DC Statutory Reference</span>
            <span aria-hidden="true">·</span>
            <span>TIPS / ServSafe Alcohol / RBS / MAST / TABC / BASSET Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Alcohol Service Laws, TIPS & ServSafe Certification
          </h1>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state name, code (e.g. CA, UT, TX) or permit..."
            className="w-full bg-[#0F1623] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Dedicated External Certification Portals Section (TIPS & ServSafe Alcohol) */}
      <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Official National & State Bartender Certification Portals</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-0.5">
              Earn Your Official TIPS & ServSafe Alcohol Certificate
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.gettips.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Official TIPS Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.servsafe.com/ServSafe-Alcohol"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>ServSafe Alcohol Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {EXTERNAL_CERTIFICATION_PORTALS.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-amber-400 font-medium">{portal.organization}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 shrink-0" />
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{portal.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {portal.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-amber-300 truncate">
                {portal.url}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Top Interactive Split: Selected State Statutory Dossier + Widmark BAC Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Selected State Statutory Dossier (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-amber-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Selected Jurisdiction Statutory Dossier ({selectedState.stateCode})</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-300">
                Max Per Se BAC: {selectedState.maxBacLimit.toFixed(2)}%
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mt-1">
              {selectedState.stateName} ({selectedState.stateCode})
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {selectedState.keyComplianceNote}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono tabular-nums">
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
              <div className="text-slate-400 font-sans">Min Bartending Age</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {selectedState.minBartendingAge} yrs
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
              <div className="text-slate-400 font-sans">Wine/Beer Server</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {selectedState.minServerAgeWineBeer} yrs
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
              <div className="text-slate-400 font-sans">Happy Hour Discounts</div>
              <div
                className={`text-sm font-bold mt-1 ${
                  selectedState.happyHourAllowed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {selectedState.happyHourAllowed ? 'Permitted' : 'Prohibited'}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
              <div className="text-slate-400 font-sans">Statutory Last Call</div>
              <div className="text-xs font-bold text-amber-400 mt-1">
                {selectedState.lastCallTime}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <span>
              <strong className="text-slate-100">Credential Program:</strong>{' '}
              {selectedState.certificationName} ({selectedState.mandatoryServerTraining})
            </span>
            <span>
              <strong className="text-slate-100">Dram Shop Standard:</strong>{' '}
              {selectedState.dramShopLiability}
            </span>
          </div>
        </div>

        {/* Widmark Blood Alcohol Concentration (BAC) Educational Simulator (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F1623] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 inline-flex items-center gap-1.5 font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                Widmark BAC & Safe Service Calculator
              </span>
              <span className="text-slate-400">1 drink = 0.6 oz pure ethanol</span>
            </div>

            <div className="mt-3 flex items-baseline justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div>
                <div className="text-xs text-slate-400">Estimated Blood Alcohol</div>
                <div
                  className={`text-2xl font-mono tabular-nums font-bold mt-0.5 ${
                    estimatedBac >= selectedState.maxBacLimit
                      ? 'text-rose-400'
                      : estimatedBac >= 0.05
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {estimatedBac.toFixed(3)}% BAC
                </div>
              </div>
              <div className="text-right text-xs">
                {estimatedBac >= selectedState.maxBacLimit ? (
                  <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                    <ShieldAlert className="w-4 h-4" />
                    Cutoff Service ({selectedState.stateCode} Limit {selectedState.maxBacLimit}%)
                  </span>
                ) : estimatedBac >= 0.05 ? (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    Monitor Pace & Offer Water
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Within Safe Service Range
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Sliders with Explicit Labels, Values & Units */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <label htmlFor="bac-weight">Patron Body Weight: {guestWeightLbs} lbs</label>
                <span className="font-mono tabular-nums text-slate-400">
                  ({Math.round(guestWeightLbs * 0.4536)} kg)
                </span>
              </div>
              <input
                id="bac-weight"
                type="range"
                min={100}
                max={280}
                step={5}
                value={guestWeightLbs}
                onChange={(e) => setGuestWeightLbs(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <label htmlFor="bac-drinks">Standard Drinks Consumed: {standardDrinks} drinks</label>
                <span className="font-mono tabular-nums text-slate-400">
                  ({standardDrinks * 14}g ethanol)
                </span>
              </div>
              <input
                id="bac-drinks"
                type="range"
                min={1}
                max={10}
                step={1}
                value={standardDrinks}
                onChange={(e) => setStandardDrinks(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label htmlFor="bac-hours" className="block text-slate-300 mb-1">
                  Time Elapsed: {hoursElapsed} hrs
                </label>
                <input
                  id="bac-hours"
                  type="range"
                  min={0.5}
                  max={6}
                  step={0.5}
                  value={hoursElapsed}
                  onChange={(e) => setHoursElapsed(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <span className="block text-slate-300 mb-1">Widmark r-Factor</span>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDistributionRatio(0.68)}
                    className={`flex-1 py-1 text-xs rounded-md ${
                      distributionRatio === 0.68
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    r = 0.68
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistributionRatio(0.55)}
                    className={`flex-1 py-1 text-xs rounded-md ${
                      distributionRatio === 0.55
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    r = 0.55
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls & 50-State Table */}
      <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'Mandatory', 'Voluntary (Incentivized)'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTrainingFilter(tf)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  trainingFilter === tf
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tf === 'ALL' ? 'All Training Policies' : `Server Training: ${tf}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'ALLOWED', 'BANNED'] as const).map((hf) => (
              <button
                key={hf}
                type="button"
                onClick={() => setHappyHourFilter(hf)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  happyHourFilter === hf
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {hf === 'ALL'
                  ? 'All Happy Hour Rules'
                  : hf === 'ALLOWED'
                  ? 'Happy Hour Permitted'
                  : 'Happy Hour Prohibited'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">State</th>
                <th className="py-3 px-3 font-semibold">Bartend / Serve Age</th>
                <th className="py-3 px-3 font-semibold">Server Certification</th>
                <th className="py-3 px-3 font-semibold">Max BAC</th>
                <th className="py-3 px-3 font-semibold">Last Call</th>
                <th className="py-3 px-3 font-semibold">Happy Hour</th>
                <th className="py-3 px-3 font-semibold">Dram Shop Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStates.map((st) => {
                const isSelected = st.stateCode === selectedState.stateCode;
                return (
                  <tr
                    key={st.stateCode}
                    onClick={() => setSelectedState(st)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-500/10' : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-slate-100 whitespace-nowrap">
                      {st.stateName} ({st.stateCode})
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-300 whitespace-nowrap">
                      {st.minBartendingAge}y / {st.minServerAgeWineBeer}y
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <span className="font-medium text-slate-200">{st.certificationName}</span>
                      <span className="text-slate-400"> · {st.mandatoryServerTraining}</span>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-amber-400 font-semibold whitespace-nowrap">
                      {st.maxBacLimit.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-300 whitespace-nowrap">
                      {st.lastCallTime}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={
                          st.happyHourAllowed
                            ? 'text-emerald-400 font-medium'
                            : 'text-rose-400 font-medium'
                        }
                      >
                        {st.happyHourAllowed ? 'Permitted' : 'Prohibited'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {st.dramShopLiability}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
