// Fixed sky behind every page. The photo runs navy at the top to pale blue at
// the bottom. Dark keeps it upright so the navy sits behind the light mark and
// fades into the page. Light flips it so the pale end sits behind the navy mark
// and the blue deepens toward the tab bar. The wash and glow colours are
// --sky-wash and --sky-glow in globals.css. The glows sit above the wash so
// they still read where dark has faded the photo out. The blur smooths banding
// in the photo, and the bleed keeps its soft edges off screen while it drifts.
const glow =
  "absolute size-[100vmax] rounded-full bg-[radial-gradient(closest-side,var(--sky-glow),transparent)] will-change-transform motion-reduce:animate-none"

export function SkyBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -inset-x-16 -inset-y-[10%] -scale-y-100 animate-sky-drift bg-[url('/sky.jpg')] bg-cover bg-center blur-2xl saturate-[0.85] will-change-transform motion-reduce:animate-none dark:scale-y-100" />
      <div className="absolute inset-0 bg-(image:--sky-wash)" />
      <div className={`${glow} top-[5%] left-[10%] -translate-x-1/2 animate-sky-glow`} />
      <div className={`${glow} top-[45%] right-[5%] translate-x-1/2 animate-sky-glow-2`} />
    </div>
  )
}
