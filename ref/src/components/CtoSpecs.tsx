import React from "react";

interface CtoSpecsProps {
  onBack: () => void;
}

export const CtoSpecs: React.FC<CtoSpecsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-deep text-slate-50 font-sans p-6 md:p-12 selection:bg-cyan-400/30 selection:text-cyan-400">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-6">
          <div>
            <h1 className="font-oxanium text-3xl font-bold text-white tracking-widest mb-2">
              SYSTEM ARCHITECTURE & UI SPECS
            </h1>
            <p className="font-mono text-xs text-slate-400 uppercase">
              Final Specifications
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 py-2 px-4 rounded font-mono text-xs font-bold bg-[#1E293B] hover:bg-[#334155] text-white transition-colors"
          >
            ← BACK TO APP
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-cyan-400 font-bold tracking-[2px] border-b border-[#1E293B] pb-2">
              Global Typography
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <div className="font-outfit text-2xl text-white mb-2 font-bold tracking-wide">
                  Outfit
                </div>
                <div className="text-xs text-slate-400 mb-4 h-10">
                  Application Default (sans-serif)
                </div>
                <ul className="text-sm text-slate-300 space-y-2">
                   <li><strong>CSS:</strong> <code className="text-cyan-400">font-outfit</code></li>
                   <li><strong>Usage:</strong> Global body, tooltips, tags, exact stats.</li>
                </ul>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <div className="font-oxanium text-2xl text-white mb-2 font-bold tracking-widest uppercase">
                  Oxanium
                </div>
                <div className="text-xs text-slate-400 mb-4 h-10">
                  Display & Headings
                </div>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li><strong>CSS:</strong> <code className="text-cyan-400">font-oxanium</code></li>
                  <li><strong>Usage:</strong> Master headers, category titles, token symbols.</li>
                </ul>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <div className="font-mono text-2xl text-white mb-2 font-bold">
                  Space Mono
                </div>
                <div className="text-xs text-slate-400 mb-4 h-10">
                  Terminal & Data (monospace)
                </div>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li><strong>CSS:</strong> <code className="text-cyan-400">font-mono</code></li>
                  <li><strong>Usage:</strong> Terminal expandable viewport data, addresses, technical hashes.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-cyan-400 font-bold tracking-[2px] border-b border-[#1E293B] pb-2">
              Core Architecture & Layout
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <ul className="text-sm font-mono text-slate-300 space-y-3 list-none">
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Responsive Grid:</strong> Single column on mobile, hardware-accelerated 2-column flex rails on desktop. Maximum width is constrained to <code>max-w-[1400px]</code> for readable modular grids.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Color Palette:</strong> Deep slate/charcoal backgrounds (<code>#0B0F19</code> apps, <code>#070A10</code> headers) combined with high-contrast neon category accents.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Score Expire State (TTL):</strong> Sonar scores are bound to a strict 24-hour Time-To-Live. Tokens with expired scores use a static faded hourglass icon, and terminal readouts display <code>[ SIGNAL EXPIRED ]</code> via conditional rendering.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Sorting:</strong> Discovery feed tokens are strictly sorted by Live Sonar Score descending (highest surface first).</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Search & Filter:</strong> Interactive token array subsets handled globally; sticky headers prevent filter-loss during scroll on mobile.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-cyan-400 font-bold tracking-[2px] border-b border-[#1E293B] pb-2">
              Terminal Viewport Rendering
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <ul className="text-sm font-mono text-slate-300 space-y-3 list-none">
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Terminal Ambient Background:</strong> Single solid stretch (<code>#0F1624</code>) per row, unified upon expansion, simulating a CLI shell environment without horizontal dividers.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Grid Alignment:</strong> Strictly aligned data rows via Flexbox. The left "key" column enforces fixed spatial limits (<code>w-[190px] whitespace-nowrap</code>), forcing all right panel value data to start flush down the same vertical axis.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Data Type-On Effect:</strong> Values within the Terminal trigger an asymmetric synthetic readout effect resembling an instant CLI terminal boot sequence.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Neon Context Key Contrast:</strong> Labels for rows (e.g. <code>@contract</code>, <code>@supply</code>) drop fully saturated neon colors in favor of ~60% opacity with <code>text-shadow</code> to reduce optical halation.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Tooltips:</strong> Radix-UI powered custom single and dual line formatted popovers matching minimal dark CLI aesthetic with 200ms trigger deltas.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-cyan-400 font-bold tracking-[2px] border-b border-[#1E293B] pb-2">
              Theming & Category Accents
            </h2>
            <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded bg-[#0B0F19]">
                  <div className="text-[10px] font-mono text-white/50 tracking-wide uppercase">App Canvas</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">#0B0F19</div>
                </div>
                <div className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded" style={{ backgroundColor: "rgba(0,170,204,0.1)" }}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#00AACC]"></div>
                  <div className="text-[10px] font-mono text-[#00AACC] tracking-wide uppercase">Tech Accent</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">#00AACC</div>
                </div>
                <div className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded" style={{ backgroundColor: "rgba(204,85,0,0.1)" }}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#CC5500]"></div>
                  <div className="text-[10px] font-mono text-[#CC5500] tracking-wide uppercase">Meme Accent</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">#CC5500</div>
                </div>
                <div className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded" style={{ backgroundColor: "rgba(46,186,14,0.1)" }}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#2EBA0E]"></div>
                  <div className="text-[10px] font-mono text-[#2EBA0E] tracking-wide uppercase">RWA Accent</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">#2EBA0E</div>
                </div>
                <div className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded" style={{ backgroundColor: "rgba(138,0,230,0.1)" }}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#8A00E6]"></div>
                  <div className="text-[10px] font-mono text-[#8A00E6] tracking-wide uppercase">Presale Accent</div>
                  <div className="text-xs font-mono font-bold text-white mt-1">#8A00E6</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
