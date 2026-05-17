import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchTaskPosts } from '@/lib/task-data'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'

export const FOOTER_OVERRIDE_ENABLED = true


const getCategoryLabel = (value: string) => {
  const normalized = normalizeCategory(value)
  return CATEGORY_OPTIONS.find((item) => item.slug === normalized)?.name || value
}


export async function FooterOverride() {
  const posts = await fetchTaskPosts('mediaDistribution', 200, { allowMockFallback: false })
  const categories = Array.from(
    new Map(
      posts
        .map((post) => {
          const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
          const raw = typeof content.category === 'string' ? content.category.trim() : ''
          if (!raw) return null
          const slug = normalizeCategory(raw)
          return { slug, name: getCategoryLabel(raw) }
        })
        .filter((item): item is { slug: string; name: string } => Boolean(item))
        .map((item) => [item.slug, item])
    ).values()
  ).slice(0, 8)

  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#f1a661]/20 bg-[#1f1209] text-[#ffe7ca]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[#2d190b] p-1">
                <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="44" height="44" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xl font-semibold text-white">{SITE_CONFIG.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#f1a661]">Media Press Distribution</p>
              </div>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#ffd8a9]">
              Publish your press media, improve media visibility, and keep your newsroom content discoverable across channels.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1a661]">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/updates" className="transition-colors hover:text-white">Latest News</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-white">Newsroom</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1a661]">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link href="/help" className="transition-colors hover:text-white">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1a661]">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookies" className="transition-colors hover:text-white">Cookies</Link></li>
            </ul>
          </div>
        </div>


        {categories.length ? (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Categories</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/updates?category=${category.slug}`}
                  className="opacity-80 underline-offset-4 transition hover:opacity-100 hover:underline"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-[#ffd8a9]">
          &copy; {year} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
