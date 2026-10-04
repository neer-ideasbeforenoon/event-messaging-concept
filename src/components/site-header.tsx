import Link from "next/link"
import { SiteTabBar } from "@/components/site-tab-bar"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 pt-[env(safe-area-inset-top)]">
      <div className="relative grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-2 sm:px-8">
        <Link
          href="/"
          aria-label="Gather"
          className="relative z-10 w-fit shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span
            aria-hidden="true"
            className="block h-6 w-[91px] bg-mark sm:h-8 sm:w-[122px] [mask-image:url('/gather-logo.png')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url('/gather-logo.png')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
          />
        </Link>
        <div className="flex w-full min-w-0 items-center justify-center sm:pointer-events-none sm:absolute sm:inset-0 sm:w-auto sm:px-44">
          <SiteTabBar />
        </div>
        <div className="relative z-10 shrink-0 justify-self-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
