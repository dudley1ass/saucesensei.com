import type { ScienceArticle } from '../data/scienceArticles';
import { senseiFoodArticleUrl } from '../config/senseiFood';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const BTN_GRADIENT = 'linear-gradient(135deg, #5c1f33, #c45c26)';

export function ArticleView({
  article,
  onBack,
}: {
  article: ScienceArticle;
  onBack: () => void;
}) {
  const sfUrl = senseiFoodArticleUrl(article.senseiFoodSlug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-slate-50">
      <header className="border-b border-amber-200/80 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-rose-900 hover:text-rose-950"
          >
            <ArrowLeft className="w-4 h-4" />
            Science library
          </button>
          <a
            href={sfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-lg shadow"
            style={{ background: BTN_GRADIENT }}
          >
            Open on SenseiFood
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <article className="container mx-auto px-4 py-8 max-w-3xl">
        <img
          src={article.heroImage}
          alt=""
          className="w-full max-h-64 object-contain rounded-xl border border-amber-200/80 bg-white shadow mb-6"
        />
        <p className="text-xs font-bold uppercase tracking-wider text-amber-800/90 mb-2">Sauce Sensei · Science</p>
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

        <div className="mt-12 p-5 rounded-2xl border border-amber-200 bg-amber-50/80">
          <p className="text-sm font-semibold text-amber-950 mb-2">Continue on SenseiFood</p>
          <p className="text-sm text-amber-900/90 mb-3">
            This in-app article is paired with a SenseiFood URL for printing, sharing, and future CMS updates.
          </p>
          <a
            href={sfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-rose-950 underline decoration-rose-400 hover:decoration-rose-600"
          >
            {sfUrl}
          </a>
        </div>
      </article>
    </div>
  );
}
