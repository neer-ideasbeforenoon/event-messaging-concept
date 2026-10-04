import { SiteHeader } from "@/components/site-header"

// The app header and tab bar belong to the inbox. An open thread is its own
// module with its own back control, so it sits outside this group.
export default function InboxLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="pt-[calc(4rem+env(safe-area-inset-top))]">
      <SiteHeader />
      {children}
    </div>
  )
}
