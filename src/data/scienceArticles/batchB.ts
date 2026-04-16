import type { LibraryArticle } from './types';

export const SCIENCE_ARTICLES_B: LibraryArticle[] = [
  {
    slug: 'emulsion-vs-non-emulsion-sauces',
    title: 'Emulsion vs non-emulsion: two worlds on one stove',
    subtitle: 'Why some sauces “break” while others only reduce — and the fix path when you see oil.',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/emulsion-vs-non-emulsion-sauces',
    sections: [
      {
        heading: 'Two stability regimes',
        paragraphs: [
          'Emulsified sauces ask immiscible phases to coexist: fat droplets suspended in water, or water droplets suspended in fat, stabilized by emulsifiers like lecithin, proteins, partial glycerides, or fine-particle solids. Pan sauces mounted with cold butter, mayonnaise, and many cheese sauces are in this category. When they fail, you see free oil because droplets coalesced beyond recovery without new surface-active material or shear under favorable viscosity.',
          'Non-emulsified sauces—thin soy glazes, some reductions, simple broth-forward builds—do not rely on a metastable droplet field. They concentrate solutes as water leaves. They can taste too strong, too thin, or too salty, but they do not “break” in the same mechanical sense because there was no emulsion to destroy.',
        ],
      },
      {
        heading: 'Visual cue when oily',
        paragraphs: [
          'If you see a slick of oil that will not re-incorporate with whisking, assume emulsion failure first. Lower heat, add a small amount of warm water or stock, and whisk to rebuild a temporary interface. This is not the same fix as “add acid” unless acid also changes colloidal structure in your specific formula.',
          'Mayonnaise failures are textbook: oil added too fast overwhelms available surfactant sites. Pan sauce failures are often heat + timing: butter mounted while the liquid phase is aggressively boiling. Cheese sauces add protein aggregation as a second failure mode once temperature overshoots.',
        ],
      },
      {
        heading: 'Map to your wheel',
        paragraphs: [
          'The wheel encodes flavor pulls, not phase diagrams. Use it to ask whether you are fat-heavy relative to acid, then use this article to ask whether the fat is dispersed or pooled. Both answers matter; neither replaces the other.',
        ],
      },
      {
        heading: 'SenseiFood microscopy story',
        paragraphs: [
          'SenseiFood hosts side-by-side micrographs of broken vs stable emulsions from common home equipment. Sauce Sensei keeps the experience interactive; SenseiFood shows what your eye is guessing at when you see shimmer at the rim of a pan.',
        ],
      },
      {
        heading: 'Extended reading: droplet size, interfacial tension, and shear',
        paragraphs: [
          'Emulsion quality is often summarized by mean droplet diameter: smaller droplets scatter light differently and feel creamier because more oil surface area is hidden from immediate coalescence pathways. High shear from blenders creates fine emulsions; pan sauces rely on whisking and natural phospholipids at gentler shear rates.',
          'Interfacial tension sets the energy penalty to create new surface area. Emulsifiers lower that penalty, which is why mustard can rescue borderline vinaigrettes and egg yolk can stabilize mayonnaise where oil alone cannot. When you see oil slicks, you are seeing interfacial tension winning again after proteins denatured or surfactants desorbed.',
          'Temperature raises kinetic energy for droplet collisions and lowers continuous-phase viscosity in ways that can either help mixing or accelerate coalescence depending on regime. That dual role is why “whisk harder” is sometimes correct and sometimes the worst advice.',
          'Cheese sauces add a gel network forming alongside emulsion stability; rennet-style chemistry is not in play, but pH and temperature still drive casein aggregation. Broken cheese sauce is often a phase inversion story, not merely “too much cheese.”',
          'Non-emulsified soy glazes still show oil films if you add raw oil late without agitation, but that is not emulsion break; it is separation of a deliberately un-emulsified lipid garnish. Naming the category correctly saves you from the wrong repair toolkit.',
          'SenseiFood cross-links these mechanisms to equipment tests so you can match whisk types, bowl shapes, and pan materials to the sauce family you are building inside Sauce Sensei.',
        ],
      },
    ],
  },
  {
    slug: 'reduction-curve-nonlinear-flavor',
    title: 'The reduction curve is nonlinear (and that is huge)',
    subtitle: 'Why 100→70% is not the same as 30→20% — concentration, Maillard, and bitterness risk.',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/reduction-curve-nonlinear-flavor',
    sections: [
      {
        heading: 'Not all evaporation is equal',
        paragraphs: [
          'Early reduction mostly removes water while modestly concentrating salts and amino acids. Flavor often improves because volatile harsh notes blow off while pleasant roasted notes concentrate. As water activity falls further, the same absolute evaporation produces larger jumps in osmolarity because the denominator shrinks.',
          'That is why the last third of a reduction is psychologically “fast.” You cross thresholds where bitterness perception spikes, salt reads harsh, and sugars approach caramel chemistry that can read burnt in thin films against hot metal.',
        ],
      },
      {
        heading: 'Rule of thumb',
        paragraphs: [
          'If flavor is too strong, you may have reduced too far for the salt and acid already present. Add liquid, taste, and rebuild gently rather than chasing sweetness alone. Sugar can mask bitterness, but it also changes color chemistry and viscosity in ways that are hard to undo.',
          'Sauce Sensei’s reduction slider is a planning tool; this article is the warning label on the curve itself. Use both: plan concentration, then respect the nonlinear tail.',
        ],
      },
      {
        heading: 'Bench science note',
        paragraphs: [
          'Osmolality rises faster than linear time predicts because moles per liter rise as volume falls. Receptor saturation and salting-out effects can change aroma release even when you think you “only boiled a minute.” Timers plus volume marks beat intuition.',
        ],
      },
      {
        heading: 'SenseiFood companion',
        paragraphs: [
          'SenseiFood publishes timed reduction videos with volume annotations so you can calibrate your burner to a reference curve. Pair those visuals with Sauce Sensei’s guardrails for a complete loop.',
        ],
      },
      {
        heading: 'Extended reading: osmolality, bitterness, and Maillard tails',
        paragraphs: [
          'As water leaves, osmolality rises nonlinearly because moles stay while volume shrinks. Bitter compounds that were below threshold can cross perceptual gates without any new ingredient entering the pan. That is the core of “it went bitter at the end” complaints on otherwise careful builds.',
          'Maillard pathways accelerate as water activity drops and local temperatures climb near pan surfaces. Thin films against metal can generate bitter pyrazines faster than bulk liquid averages suggest, which is why stirring and scraping matter beyond mixing.',
          'Salt concentration rises with reduction too, often faster than intuition because tasters anchor to early baseline. Dilution fixes are not “cheating”; they reset the system to a safer operating point on the curve where sugar and acid adjustments behave predictably again.',
          'Sugar addition near the end changes water activity and boiling point elevation slightly, shifting bubble behavior and color development. Track grams if you iterate; Sauce Sensei can show perceived sweet shifts once you encode them.',
          'Wine reductions carry ethanol early; later stages are more acid and sugar dominated as volatiles leave. Mapping stages by aroma category is a practical sensory timer SenseiFood teaches with video anchors.',
          'If you teach one graph in culinary school, make it volume vs. time with annotated danger zones. Sauce Sensei’s slider is a toy model of that graph; this article is the legend printed on the axis.',
        ],
      },
    ],
  },
  {
    slug: 'one-change-rule-sauce-debugging',
    title: 'The one-change rule (seriously)',
    subtitle: 'Why multivariate panic breaks debugging — and how tasting loops beat hero moves.',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/one-change-rule-sauce-debugging',
    sections: [
      {
        heading: 'Multivariate failure mode',
        paragraphs: [
          'When a sauce is wrong, beginners often add salt, acid, sugar, and fat in the same minute. That is a multivariate experiment with no interpretable outcome. You cannot know which lever fixed or harmed the result, so you cannot reproduce success or avoid failure next week.',
          'Professional kitchens debug one variable at a time: make one adjustment, fully dissolve or emulsify it, taste, record, repeat. The loop is slower for any single pass, but faster across a month because you accumulate causal knowledge instead of superstition.',
        ],
      },
      {
        heading: 'Operational protocol',
        paragraphs: [
          'Write the current hypothesis on a spoon: “too thin,” “too sharp,” “too dull.” Pick one counter-move aligned to that hypothesis. If you think thinness is water load, reduce before adding starch. If you think dullness is salt threshold, add salt before acid. If you think harshness is reduction, dilute before adding sugar.',
          'Sauce Sensei encodes some guardrails to suggest likely failure modes; this article encodes the discipline to test them cleanly. The wheel is not a slot machine; it is a dashboard.',
        ],
      },
      {
        heading: 'Why this matters online',
        paragraphs: [
          'Recipe comments often become noise because everyone changed everything at once. SenseiFood articles standardize a tasting notebook format so community troubleshooting stays legible. Sauce Sensei gives you the knobs; SenseiFood teaches you how to log them.',
        ],
      },
      {
        heading: 'Closing',
        paragraphs: [
          'One change, one taste, one note. Boring on paper, unstoppable in practice.',
        ],
      },
      {
        heading: 'Extended reading: factorial experiments in the home kitchen',
        paragraphs: [
          'Industrial food science uses designed experiments because interactions are common: acid and heat together do not equal the sum of their separate effects. Home cooks rarely run factorial designs formally, but the one-change rule is a single-subject experimental protocol that preserves interpretability.',
          'If you violate the rule, you lose the ability to attribute success. That matters when scaling from two servings to twenty, when equipment changes, or when ingredient brands change slightly. Reproducibility is not snobbery; it is kindness to your future self.',
          'Digital tools like Sauce Sensei add guardrails, but they cannot stop you from clicking three sliders mentally at once. Pair software with a paper column: hypothesis, intervention, observation. SenseiFood publishes printable tasting sheets aligned to these columns.',
          'Teams should debrief failures with timelines, not adjectives. “Weird” is not a variable; “sharp after second acid add” is. The wheel helps translate adjectives into axes once your log is honest.',
          'Children learning to cook benefit enormously from the one-change rule because it builds causal models instead of brittle recipes. The same pedagogy applies to adults who are brilliant engineers everywhere except the stove.',
          'Export this habit to baking, coffee, and spice blends later; it is the same epistemology. Sauce Sensei is the first module in a broader SenseiFood learning system.',
        ],
      },
    ],
  },
  {
    slug: 'umami-axis-beyond-salt-acid-fat-sweet',
    title: 'Umami: the fifth axis your four-quadrant wheel cannot draw',
    subtitle: 'Glutamate, nucleotides, and savory depth — why “balanced” can still feel empty.',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/umami-axis-beyond-salt-acid-fat-sweet',
    sections: [
      {
        heading: 'What umami is, in one paragraph that refuses to be cute',
        paragraphs: [
          'Umami is not a synonym for salt. It is the sensory consequence of certain amino acids and nucleotides—glutamate prominent among them—binding receptors that evolved to identify protein-rich foods. It reads as depth, persistence, and “mouthfulness,” overlapping with salt perception but not identical to chloride sharpness.',
          'Sources are familiar because they work: soy and fermented fish bring glutamate and salts; mushrooms and tomatoes bring glutamate and ribonucleotides; aged parmesan concentrates proteolysis products; tomato paste stacks glutamate with reduced water; Worcestershire blends fermentation complexity. Each source also carries side channels (acid, sugar, color) that move the four-quadrant map even while umami climbs.',
        ],
      },
      {
        heading: 'Still missing something? Add umami',
        paragraphs: [
          'If the wheel says you are near center yet the sauce feels hollow, suspect umami starvation before you add more butter. Fat rounds and carries, but it cannot invent nucleotide depth that is not there. A small amount of paste, a parmesan rind simmer, or a measured soy addition often resolves “flat” faster than another lemon squeeze.',
          'Sauce Sensei already uses an umami score for glow and narration in places; this article names the axis explicitly so you do not misread “balanced” as “complete.”',
        ],
      },
      {
        heading: 'Interaction effects',
        paragraphs: [
          'Umami compounds synergize with nucleotides in non-linear ways; that is classic food chemistry, not mysticism. Salt amplifies umami perception even when umami moieties are unchanged, which is another reason to salt thoughtfully before declaring a sauce “needs MSG” when it needed threshold tuning.',
        ],
      },
      {
        heading: 'SenseiFood reference tables',
        paragraphs: [
          'SenseiFood publishes concentration-aware tables for pantry umami sources with suggested gram ranges per liter of liquid. Use Sauce Sensei to play; use SenseiFood to shop and batch with confidence.',
        ],
      },
      {
        heading: 'Extended reading: synergistic nucleotides and kokumi',
        paragraphs: [
          'Inosinate and guanylate synergize with glutamate to produce supra-linear savory enhancement at certain ratios. That is why tomato plus parmesan reads bigger than either alone at matched sodium levels. Your four-axis wheel can stay “balanced” while kokumi-like persistence climbs through this parallel channel.',
          'Yeast extracts, fermented beans, and long-simmered stocks increase peptides that contribute mouthfulness beyond classical umami markers. The vocabulary is evolving in sensory science; the kitchen takeaway is stable: depth is not always visible as a quadrant tug.',
          'Fat carries volatile savory aromatics, which can confuse the tongue into attributing umami to “creaminess.” Separating modalities in your notes prevents mis-tuning: sometimes you need nucleotides, sometimes you need emulsion stability, sometimes both.',
          'MSG is a tool, not a moral failure, but it is not the only tool. Tomato paste, fish sauce, and dried mushroom powder each bring different side acids and colors. Sauce Sensei helps compare builds; SenseiFood catalogs substitution matrices with science notes.',
          'Low-sodium diets can still exploit nucleotide synergy with smaller chloride footprints when planned carefully; consult dietary guidance for your household. The physics remains informative even when targets move.',
          'If you finish one upgrade from this article, add an “umami audit” step after salt: ask whether persistence is missing, not just brightness. That question catches the fifth axis problem early.',
        ],
      },
    ],
  },
];
