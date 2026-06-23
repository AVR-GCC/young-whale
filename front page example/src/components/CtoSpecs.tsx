import React from "react";

interface CtoSpecsProps {
  onBack: () => void;
}

export const CtoSpecs: React.FC<CtoSpecsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-6">
          <div>
            <h1 className="font-oxanium text-3xl font-bold text-white tracking-widest mb-2">
              FOR CTO
            </h1>
            <p className="font-mono text-xs text-[#94A3B8] uppercase">
              Section 1: Typography System
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
            <h2 className="font-oxanium text-xl text-[#00E5D2] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              Global Fonts
            </h2>
            <p className="text-sm text-slate-400">
              The application uses three primary font families imported via
              Google Fonts:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <div className="font-outfit text-2xl text-white mb-2 font-bold tracking-wide">
                  Outfit
                </div>
                <div className="text-xs text-slate-400 mb-4 h-10">
                  Application Default (sans-serif)
                </div>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>
                    <strong>Weights:</strong> 300, 400, 500, 600, 700
                  </li>
                  <li>
                    <strong>CSS Var:</strong>{" "}
                    <code className="text-[#00E5D2]">--font-outfit</code>
                  </li>
                  <li>
                    <strong>Usage:</strong> Global body, tooltips, tags, exact
                    stats, compact UI labels.
                  </li>
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
                  <li>
                    <strong>Weights:</strong> 400, 500, 600, 700, 800
                  </li>
                  <li>
                    <strong>CSS Var:</strong>{" "}
                    <code className="text-[#00E5D2]">--font-oxanium</code>
                  </li>
                  <li>
                    <strong>Usage:</strong> Master headers, category titles
                    ("THE NEXT WAVE"), token symbols.
                  </li>
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
                  <li>
                    <strong>Weights:</strong> 400, 700
                  </li>
                  <li>
                    <strong>CSS Var:</strong>{" "}
                    <code className="text-[#00E5D2]">--font-mono</code>
                  </li>
                  <li>
                    <strong>Usage:</strong> Terminal expandable viewport data,
                    addresses, technical hashes. *JetBrains Mono is used as a
                    fallback.*
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-[#00E5D2] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              Component-Level Typography Mapping
            </h2>

            <div className="bg-[#070A10] p-6 rounded border border-[#1E293B] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-[#1E293B] text-slate-400">
                    <th className="py-3 pr-4 font-bold uppercase">
                      Location / Component
                    </th>
                    <th className="py-3 px-4 font-bold uppercase">
                      Font Family
                    </th>
                    <th className="py-3 px-4 font-bold uppercase">Size</th>
                    <th className="py-3 px-4 font-bold uppercase">
                      Classes / Color
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/60">
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">Global App Wrapper</td>
                    <td className="py-3 px-4">Outfit</td>
                    <td className="py-3 px-4">Inherited</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-outfit text-[#F8FAFC]
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">
                      Navigation Wordmark ("YoungWhale.io")
                    </td>
                    <td className="py-3 px-4">Oxanium</td>
                    <td className="py-3 px-4">20px (text-xl)</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-bold tracking-wide text-slate-50
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">
                      Hero Banner ("CRYPTO WHALES START HERE")
                    </td>
                    <td className="py-3 px-4">Oxanium</td>
                    <td className="py-3 px-4">11px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-bold tracking-[0.05em]
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">
                      Category Section Header (e.g., "TECH")
                    </td>
                    <td className="py-3 px-4">Oxanium</td>
                    <td className="py-3 px-4">13px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-extrabold uppercase tracking-[2px]
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">Token Name (List View)</td>
                    <td className="py-3 px-4">Outfit</td>
                    <td className="py-3 px-4">15px/16px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-medium text-white/90
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">Sonar Score Ring Score</td>
                    <td className="py-3 px-4">Oxanium</td>
                    <td className="py-3 px-4">14px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">font-extrabold</code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">Terminal: Token Header Name</td>
                    <td className="py-3 px-4">Outfit</td>
                    <td className="py-3 px-4">20px/22px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-bold tracking-wide text-white
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">
                      Terminal: Section Data (Socials, Chains, Contacts)
                    </td>
                    <td className="py-3 px-4">Space Mono</td>
                    <td className="py-3 px-4">14px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-mono text-white/90
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">
                      Terminal: Action Data Keys (e.g., "@socials:")
                    </td>
                    <td className="py-3 px-4">Space Mono</td>
                    <td className="py-3 px-4">13px/14px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-bold tracking-wide text-white/70
                      </code>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-3 pr-4">
                      Footer Links (e.g., "FOR CTO")
                    </td>
                    <td className="py-3 px-4">Space Mono</td>
                    <td className="py-3 px-4">10px</td>
                    <td className="py-3 px-4">
                      <code className="text-[#00E5D2]">
                        font-mono uppercase tracking-widest text-[#94A3B8]
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-[#00E5D2] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              Global Tooltips Dictionary
            </h2>
            
            <div className="bg-[#070A10] p-4 rounded border border-[#1E293B] mb-4 border-l-2 border-l-[#00E5D2]">
              <p className="text-sm font-mono text-slate-300">
                <strong className="text-[#00E5D2]">Global Interaction Rule:</strong> ALL tooltips must have a strict 300ms hover delay before appearing to prevent UI flickering during rapid scanning.
              </p>
            </div>

            <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-[#1E293B] text-slate-400">
                    <th className="py-3 px-4 font-bold uppercase tracking-wider">
                      Trigger Component
                    </th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider w-[40%]">
                      Tooltip Text
                    </th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider">
                      Placement / Theme
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/60">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-[#00E5D2]">
                      Header 'THE NEXT WAVE' (i)
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      We surface and filter the newest tokens daily. The Sonar
                      Score is a live snapshot. Scores auto-expire after 24
                      hours.
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      position="bottom"
                      <br />
                      borderColor="Default Theme"
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-[#00E5D2]">
                      Category Header (i)
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      • <strong>New Tech Projects:</strong> Crypto tech project
                      tokens hitting the market.
                      <br />• <strong>New Meme Coins:</strong> Recently traded
                      fun and culture coins.
                      <br />• <strong>Latest RWA Tokens:</strong> Real-world
                      assets (gold, real estate, etc.) tokenized on-chain.
                      <br />• <strong>Upcoming Presale:</strong> Early-access
                      tokens before public trading opens.
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      position="bottom"
                      <br />
                      borderColor="Theme Accent"
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-[#00E5D2]">
                      Network/Chain Icons
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      [Token Name] launched on [Chain Name] Network
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      position="right"
                      <br />
                      borderColor="Theme Accent"
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-[#00E5D2]">
                      Sonar Score Ring
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      • <strong>Featured:</strong> Sponsored Ping.
                      <br />• <strong>Expired:</strong> Expired score. Sonar
                      ping timed out.
                      <br />• <strong>Active:</strong> Live Sonar Score (1-9).
                      <br />
                      Valid for 24 hours only.
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      position="left"
                      <br />
                      borderColor="Theme Accent"
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-[#00E5D2]">
                      Action: Share Vector
                    </td>
                    <td className="py-3 px-4 leading-relaxed">Share to X</td>
                    <td className="py-3 px-4 text-slate-500">
                      position="bottom"
                      <br />
                      borderColor="Theme Accent"
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-[#00E5D2]">
                      Action: Promote Vector
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      Token creator or early backer? Promote this project in the
                      homepage featured zone for 30 days.
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      position="bottom"
                      <br />
                      borderColor="Theme Accent"
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-[#00E5D2]">
                      Pagination +/- Controls
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      "Scan deeper", "Surface list"
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      position="top"
                      <br />
                      borderColor="Theme Accent"
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-[#00E5D2] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              Architecture & Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <h3 className="font-oxanium text-sm text-[#00E5D2] uppercase tracking-widest mb-3">
                  Core Application
                </h3>
                <ul className="text-sm font-mono text-slate-300 space-y-2 list-none">
                  <li>
                    <span className="text-slate-500 mr-2">■</span> Pure React /
                    Vite architecture allowing high-performance client
                    rendering.
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span> Unified{" "}
                    <code>App.tsx</code> orchestrator manages top-level array
                    filters and global sound state.
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span>{" "}
                    Categorizations abstracted to self-contained{" "}
                    <code>CategoryBlock.tsx</code> instances.
                  </li>
                </ul>
              </div>
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
                <h3 className="font-oxanium text-sm text-[#00E5D2] uppercase tracking-widest mb-3">
                  Responsive Model
                </h3>
                <ul className="text-sm font-mono text-slate-300 space-y-2 list-none">
                  <li>
                    <span className="text-slate-500 mr-2">■</span>{" "}
                    <strong>Mobile:</strong> 1-column stack. Custom sticky
                    filter tags block on scroll.
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span>{" "}
                    <strong>Desktop:</strong> Hardware-accelerated 2-column flex
                    rails (<code>lg:flex-row</code>).
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span> Global constraint width (<code>max-w-[1400px]</code>) ensures readable modular grids. Stripped artificial vertical viewport padding (formerly <code>60vh</code>) in favor of tight lower bounding constraints (<code>pb-10</code>) to eliminate dead-scroll zones.
                  </li>
                </ul>
              </div>
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] md:col-span-2">
                <h3 className="font-oxanium text-sm text-[#00E5D2] uppercase tracking-widest mb-3">
                  Global 24h Expiration State (TTL)
                </h3>
                <ul className="text-sm font-mono text-slate-300 space-y-2 list-none">
                  <li>
                    <span className="text-slate-500 mr-2">■</span> Token scores are bound to a strict 24-hour TTL (Time-To-Live) evaluated against their initial discovery timestamp. This boolean state must update globally across both list and expanded components:
                  </li>
                  <ul className="pl-6 space-y-2 pt-2">
                    <li>
                      <span className="text-slate-500 mr-2">■</span> <strong>List View (CategoryBlock / Score Ring):</strong> Upon TTL expiry, the active score ring unmounts and conditionally renders the static 40%-opacity custom Hourglass SVG (displaying a half-drained timeline). The parent token row maintains 100% typography luminosity (no dimming).
                    </li>
                    <li>
                      <span className="text-slate-500 mr-2">■</span> <strong>Terminal Viewport:</strong> The terminal closure string must watch the token's TTL state. If expired, the output must conditionally swap from <code>[tokenname]@score: [score]/10</code> to <code>[tokenname]@score: [ SIGNAL EXPIRED ]</code> (rendered in Space Mono using text-slate-400 / #94A3B8).
                    </li>
                  </ul>
                </ul>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] md:col-span-2">
                <h3 className="font-oxanium text-sm text-[#00E5D2] uppercase tracking-widest mb-3">
                  Top Navigation & UI Hardening
                </h3>
                <ul className="text-sm font-mono text-slate-300 space-y-2 list-none">
                  <li>
                    <span className="text-slate-500 mr-2">■</span> <strong>Header Grid Alignment:</strong> Removed arbitrary padding blocks. The main wordmark now anchors flawlessly to the main <code>max-w-7xl</code> masonry grid, ensuring the left edge of 'Y' aligns symmetrically with the discovery rails.
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span> <strong>Wordmark Glow:</strong> The new `YoungWhale.io` interactive text logo utilizes a crisp white baseline bound with an explicit high-tech hover glow: <code>text-xl tracking-wide font-oxanium hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]</code>.
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span> <strong>Blinking Dot Positioning:</strong> The sonar pulse dot is now cleanly embedded directly inside the hero banner (<code>"CRYPTO WHALES START HERE [•] INCOMING TOKENS"</code>).
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span> <strong>Promote Action Vector:</strong> Standard megaphones were replaced with a sharp <code>Zap</code> component via Lucide React matching native terminal dimensions, stroke weights, and hover sweeps.
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span> <strong>Global Search:</strong> Deployed an atomic search toggle in the top-right navigation array. Transitions smoothly via state boolean mapped to an inline text-entry bound to the active local dataset pipeline.
                  </li>
                </ul>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] md:col-span-2">
                <h3 className="font-oxanium text-sm text-[#00E5D2] uppercase tracking-widest mb-3">
                  Broadcast System CLI (Email Form)
                </h3>
                <ul className="text-sm font-mono text-slate-300 space-y-2 list-none">
                  <li>
                    <span className="text-slate-500 mr-2">■</span> <strong>Hybrid Interface & Typography:</strong> Deployed a standard HTML input complete with native mobile traits. Replaced the stylized blinking cursor with a clean, low-noise custom placeholder (<code>Email</code>). The section label was updated to <code>YOUNG WHALE CLUB</code> utilizing <code>font-oxanium tracking-[2px]</code> to establish premium branding against the deep space dark mode (<code>#0B0F19</code>).
                  </li>
                  <li>
                    <span className="text-slate-500 mr-2">■</span> <strong>Action States:</strong> Utilizes inline regex validation to evaluate payloads and swap rendering seamlessly into a transient success state (<code>[ REQUEST LOGGED ✓ ] &gt; You're on the waiting list</code>) mapped to a light green accent. The CTA button (<code>[ REQUEST INVITE ]</code>) was dialed back to a muted <code>bg-[#0c1a24]</code> solid fill with subtle cyan strokes (<code>border-[#00E5D2]/30</code>) to remove abrasive gradients and establish a stealthier, low-noise aesthetic.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-[#00E5D2] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              Theming & Colors
            </h2>
            <div className="bg-[#070A10] p-5 rounded border border-[#1E293B]">
              <p className="text-sm font-mono text-slate-400 mb-4">
                "Nautical / Sonar Radar" aesthetic driven by slate backgrounds &
                high-contrast neon category vectors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded bg-[#0B0F19]">
                  <div className="text-[10px] font-mono text-white/50 tracking-wide uppercase">
                    App Canvas
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    #0B0F19
                  </div>
                </div>
                <div
                  className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded"
                  style={{ backgroundColor: "rgba(0,170,204,0.1)" }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#00AACC]"></div>
                  <div className="text-[10px] font-mono text-[#00AACC] tracking-wide uppercase">
                    Tech Accent
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    #00AACC
                  </div>
                </div>
                <div
                  className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded"
                  style={{ backgroundColor: "rgba(204,85,0,0.1)" }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#CC5500]"></div>
                  <div className="text-[10px] font-mono text-[#CC5500] tracking-wide uppercase">
                    Meme Accent
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    #CC5500
                  </div>
                </div>
                <div
                  className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded"
                  style={{ backgroundColor: "rgba(46,186,14,0.1)" }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#2EBA0E]"></div>
                  <div className="text-[10px] font-mono text-[#2EBA0E] tracking-wide uppercase">
                    RWA Accent
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    #2EBA0E
                  </div>
                </div>
                <div
                  className="border border-[#1E293B] p-2 pt-8 relative overflow-hidden rounded"
                  style={{ backgroundColor: "rgba(138,0,230,0.1)" }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#8A00E6]"></div>
                  <div className="text-[10px] font-mono text-[#8A00E6] tracking-wide uppercase">
                    Presale Accent
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    #8A00E6
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[#1E293B] pt-4">
                <h3 className="font-oxanium text-sm text-[#00E5D2] uppercase tracking-widest mb-3">Color Application Contexts</h3>
                <ul className="text-sm font-mono text-slate-300 space-y-2 list-none">
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Global Typography:</strong> Token names shifted to high-luminosity <code>#E2E8F0</code>, with description details mapped to <code>#CBD5E1</code> for peak WCAG AA 4.5:1 compliant contrast.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Expired vs Active Tokens:</strong> Expired tokens (past 24h) retain 100% full-color typography for the token name and description (no row dimming is applied). The expired state is strictly communicated via a faded 40% white hourglass icon in the Score container.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Category Containers:</strong> Injected as <code>headerColor</code> determining top border lines, tooltip borders, and hover backgrounds on "Scan Deeper" buttons.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Token Rows (List View):</strong> Applied to the pulsing "LIVE" cursor in the Sonar Score, time-status labels ("Today" vs "Past"), and promotional ticker tape backgrounds.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Terminal Expansion Shell:</strong> Renders inside the expanded panel on the <code>@socials:</code>, <code>@trade:</code>, and <code>@contract:</code> data headers in bold type strictly to visually anchor data sets against the unified <code>#0F1624</code> CLI background.</li>
                  <li><span className="text-slate-500 mr-2">■</span> <strong>Tooltip Interfaces:</strong> The global CustomTooltip wrapper accepts dynamic <code>borderColor</code> props mapping to the root category hue.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-[#00E5D2] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              Terminal Viewport Architecture
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#00E5D2]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Smooth Auto-Scroll Engine
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  When a user expands a token, trigger an automatic <code>useRef</code> intersection observer that smoothly scrolls the screen (ease-out) to place the target token exactly 32px below the viewport edge.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#00AACC]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Terminal Density & Unified Background
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  The expanded CLI container must feel dense and authentically technical. The terminal background is unified into a single solid stretch (<code>#0F1624</code>) with an ambient 3% noise texture overlay and a faint outer bezel box-shadow mimicking physical screen radiation. Horizontal graphic <code>&lt;hr&gt;</code> dividers are stripped.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#CC5500]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Terminal Data Reveal FX
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  Disabled standard description typewriter for pure-frictionless scanning and forced a justified alignment pattern (<code>text-justify</code>) for optimized visual structure. Executing a synthetic asynchronous fetch simulation (15ms precision) restricted strictly to internal data values (contracts, socials). Each datum appends an instantaneous <code>█</code> block cursor during execution payload bridging.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#CC5500]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Strict CLI Grid Alignment
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  Data rows are strictly aligned down a single vertical axis using a robust Flexbox architecture. The key column operates on a rigid fixed-width boundary (<code>min-w-[160px]</code>), forcing all right-hand value columns (<code>flex-1</code>) to start flawlessly flush against the exact same invisible vertical grid line, independent of string variance.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#CC5500]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Minimalist Link Affordance
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  Purged redundant pseudo-element link arrows (<code>→</code>) to decrease visual friction. Click affordances are handled exclusively through CSS pseudo hover states, radiating a hyper-legible neon cyan (<code>hover:text-cyan-400</code>) against an offset underline translation (<code>hover:underline-offset-2</code>).
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#2EBA0E]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Inline Data Arrays
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  To save vertical height, if a token has multiple trading pairs, render them inline <code>[GOLD/USDT]</code> <code>[GOLD/ETH]</code> rather than stacked vertically.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#8A00E6]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Hero Logo Anchor
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  The top-right token logo inside the expanded terminal must be doubled in size to 64px and wrapped in a strict <code>border-[3px] border-white</code> to match the unexpanded list view.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-[#00E5D2] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              Interactivity & FX Engines
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#00E5D2]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Optimized Ambient Environment
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  The cinematic low-opacity radial scanline that simulated a passive nautical sonar radar was completely removed to optimize performance, eliminate visual friction, and prioritize pure readability across the core data layers.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#F5A623]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Terminal Receipts
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  We implemented a <strong>Terminal Receipt Clipboard Action</strong> which exports token discovery strings formatted exactly like raw UNIX shell logs (including generated original Discovery watermarks) designed structurally to bypass algorithmic suppression and stand out on X/Twitter timelines.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#8A00E6]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Tooltip Re-Architecture & Visual Upgrades
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed mb-4">
                  Custom tooltips were re-architected via <code>@radix-ui/react-tooltip</code> for rock-solid boundary collision detection (preventing viewport cut-offs). Visually, they mimic sharp terminal popovers using a deep charcoal background (<code>#1C2536</code>) and a stark, geometric 1px border.
                </p>
                <div className="flex justify-center border border-dashed border-[#1E293B] p-6 bg-black rounded">
                  <div 
                    className={`relative w-max p-2.5 bg-[#1C2536] border rounded shadow-xl pointer-events-none`}
                    style={{ borderColor: '#00E5D2' }}
                  >
                    <div className="font-oxanium text-xs text-white whitespace-normal text-center leading-relaxed m-0">
                      Live Sonar Score.<br/>Valid for 24 hours only.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#00E5D2]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Neon Key Contrast (Eye Strain Reduction)
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  Fully saturated neon keys against near-black backgrounds cause optical halation. The structural label keys (<code>@contract</code>, <code>@supply</code>, etc.) had their opacity dropped to the 60% range. Font weights were reduced from bold to medium, and the solid neon was replaced with a subtle <code>text-shadow</code> glow (<code>0 0 12px ${'{themeColor}'}1a</code>), establishing the brighter data values as the primary visual anchor.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#8A00E6]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Terminal Data Initialization (Boot Sequence)
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  On load, section labels fade in instantly, followed by the raw data values typing out sequentially at high speed (~30ms per character) to mimic a CLI boot sequence.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#F5A623]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Sonar Sorting Sequence & Status Flags
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  Tokens within the discovery feeds are now strictly sorted by live Sonar Score descending (Highest to Lowest) to surface maximum alpha instantly. Additionally, we enforce contextual CLI hygiene: when a token's discovery window expires, the LIVE tracker pulse within its terminal wrapper permanently disables.
                </p>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#00E5D2]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Live Sonar Scores Glow & Growth FX
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  On the homepage, hovering over a token row triggers an interactive emphasis on active sonar elements. 
                  The Live Sonar Score rings dynamically increase their size (<code>scale-105</code> transformation) 
                  and emit a vibrant outer glow (<code>box-shadow</code>) based on the specific category's theme color.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-oxanium text-xl text-[#00AACC] font-bold tracking-wider border-b border-[#1E293B] pb-2">
              SEO Architecture Guidelines
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#00AACC]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Global Meta Parameters
                </h3>
                <ul className="text-sm text-slate-400 font-mono leading-relaxed space-y-2 list-disc pl-5">
                  <li><strong>Global Title:</strong> YoungWhale.io | Discover New Crypto Tokens Daily.</li>
                  <li><strong>Global Description:</strong> Discover new crypto tokens daily with live Sonar Scores, terminal data, and market intelligence.</li>
                </ul>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#00E5D2]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Dynamic Discovery Pages
                </h3>
                <ul className="text-sm text-slate-400 font-mono leading-relaxed space-y-2 list-disc pl-5">
                  <li><strong>Dynamic Title:</strong> [Token Name] ($[Ticker]) Sonar Score | YoungWhale.io</li>
                </ul>
              </div>

              <div className="bg-[#070A10] p-5 rounded border border-[#1E293B] border-l-2 border-l-[#8A00E6]">
                <h3 className="font-oxanium text-base text-white font-bold mb-2">
                  Social Indexing & Rendering Requirements
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed mb-4">
                  We are generating individual URLs for tokens (~20/day). To ensure Google indexes them and Twitter shares don't break, we need the following implemented:
                </p>
                <ul className="text-sm text-slate-400 font-mono leading-relaxed space-y-2 list-disc pl-5">
                  <li><strong>Bot Intercept / SSR:</strong> Because we are a React/Vite SPA, web crawlers and social scrapers will see a blank page. We need an Edge Function (or SSR/Prerender step) to inject the correct <code>&lt;title&gt;</code> and <code>&lt;meta&gt;</code> tags into the raw HTML when a bot hits the URL.</li>
                  <li><strong>Dynamic OG Images:</strong> We need an endpoint to generate unique Open Graph share images per token so Twitter links unfurl as beautiful terminal cards (showing the token name, score, and category color).</li>
                  <li><strong>Structured Data:</strong> Inject FinancialProduct, Cryptocurrency, or WebPage JSON-LD schema into the <code>&lt;head&gt;</code> of these pages. Do not use AggregateRating, as Google penalizes it for non-human reviews.</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="pb-8 pt-4 text-center text-[10px] font-mono text-[#00E5D2]/50 tracking-widest uppercase">
            Document Output Configured / EOF
          </div>
        </div>
      </div>
    </div>
  );
};
