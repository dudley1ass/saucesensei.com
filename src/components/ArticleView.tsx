import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import type { LibraryArticle } from '../data/scienceArticles';
import { senseiFoodArticleUrl } from '../config/senseiFood';
import { ArrowLeft, ChefHat, ExternalLink } from 'lucide-react';

const BTN_GRADIENT = 'linear-gradient(135deg, #5c1f33, #c45c26)';

export function ArticleView({
  article,
  onBack,
}: {
  article: LibraryArticle;
  onBack: () => void;
}) {
  const sfUrl = senseiFoodArticleUrl(article.senseiFoodSlug);
  const kind = article.kind ?? 'science';
  const metaDesc = article.metaDescription ?? article.subtitle;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonical = `${origin}/article/${article.slug}`;
  const isRecipe = kind === 'recipe' && article.relatedSauceId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-slate-50">
      <Helmet>
        <title>{article.title} | Sauce Sensei</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${article.title} | Sauce Sensei`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="border-b border-amber-200/80 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-rose-900 hover:text-rose-950"
          >
            <ArrowLeft className="w-4 h-4" />
            Article library
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isRecipe ? (
              <Link
                to={`/sauce/${article.relatedSauceId}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-lg shadow"
                style={{ background: BTN_GRADIENT }}
              >
                <ChefHat className="w-3.5 h-3.5" />
                Build in Sauce Sensei
              </Link>
            ) : null}
            <a
              href={sfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-lg shadow border border-white/20"
              style={{ background: BTN_GRADIENT }}
            >
              Open on SenseiFood
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <img
          src={article.heroImage}
          alt=""
          className="w-full max-h-64 object-contain rounded-xl border border-amber-200/80 bg-white shadow mb-6"
        />
        <p className="text-xs font-bold uppercase tracking-wider text-amber-800/90 mb-2">
          Sauce Sensei · {isRecipe ? 'Recipe guide' : 'Science'}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          {article.title}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8 border-l-4 border-rose-400 pl-4">{article.subtitle}</p>

        <div className="prose prose-slate max-w-none space-y-10">
          {article.sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-rose-900 mb-3">{sec.heading}</h2>
              <div className="space-y-4 text-gray-800 leading-relaxed text-[1.05rem]">
                {sec.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          {isRecipe ? (
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/80">
              <p className="text-sm font-semibold text-rose-950 mb-2">Try the interactive recipe</p>
              <p className="text-sm text-rose-900/90 mb-3">
                Adjust grams, see the live flavor wheel, and read structure guardrails for this exact build.
              </p>
              <Link
                to={`/sauce/${article.relatedSauceId}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-rose-950 underline decoration-rose-400 hover:decoration-rose-600"
              >
                Open {article.title.split(':')[0]?.trim() ?? 'recipe'} in Sauce Sensei →
              </Link>
            </div>
          ) : null}

          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/80">
            <p className="text-sm font-semibold text-amber-950 mb-2">Continue on SenseiFood</p>
            <p className="text-sm text-amber-900/90 mb-3">
              This in-app article is paired with a SenseiFood URL for printing, sharing, and indexing. Each article has its
              own path here for analytics and search (`/article/…`).
            </p>
            <a
              href={sfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-rose-950 underline decoration-rose-400 hover:decoration-rose-600 break-all"
            >
              {sfUrl}
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
