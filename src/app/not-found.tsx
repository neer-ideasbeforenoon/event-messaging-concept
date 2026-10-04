import Link from "next/link"

export default function NotFound() {
  return (
    <main className="px-8 py-16">
      <h1 className="text-h1">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        That page does not exist.
      </p>
      <Link
        href="/"
        transitionTypes={["nav-back"]}
        className="mt-6 inline-block text-nav text-mark underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Back to Messages
      </Link>
    </main>
  )
}
