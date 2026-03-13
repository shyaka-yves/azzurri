import Image from "next/image";
import { FadeIn } from "./FadeIn";

type BlogItem = {
  category: string;
  title: string;
  excerpt: string;
  imageSrc: string;
};

export function BlogSection({
  title,
  eyebrow,
  items,
}: {
  title?: string;
  eyebrow?: string;
  items?: BlogItem[];
}) {
  const heading = title || "Stories from the kitchen & bar";
  const smallCasing = eyebrow || "From Our Blog";
  const posts = items || [];

  return (
    <div>
      <FadeIn className="mb-12 text-center">
        <p className="text-[13px] uppercase tracking-[0.4em] text-[#D4AF37]">
          {smallCasing}
        </p>
        <h2 className="heading-font mt-6 text-4xl font-medium tracking-tight text-[#EFD077] md:text-5xl lg:text-6xl">
          {heading}
        </h2>
        <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-6" />
      </FadeIn>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <FadeIn key={`${post.title}-${index}`} delay={80 * index}>
            <article className="card-glass flex h-full flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  unoptimized={post.imageSrc.startsWith("http")}
                  className="object-contain transition-transform duration-700 hover:scale-105 bg-black/40"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                  {post.category}
                </p>
                <h3 className="mt-4 text-xl font-medium tracking-tight text-white line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-zinc-400 line-clamp-3 font-light lg:text-base">
                  {post.excerpt}
                </p>
                <a
                  href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`}
                  className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-[#FDE68A] hover:underline"
                  aria-label={`Read more about ${post.title}`}
                >
                  READ MORE
                </a>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

