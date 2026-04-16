import type { LibraryArticle } from './types';

export const SCIENCE_ARTICLES_A: LibraryArticle[] = [
  {
    slug: 'temperature-silent-killer-sauces',
    title: 'Temperature: the silent killer of sauces',
    subtitle: 'Why heat breaks emulsions before “bad ingredients” do — and the lab logic behind fixing splits.',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/temperature-silent-killer-sauces',
    sections: [
      {
        heading: 'Heat is a variable, not a vibe',
        paragraphs: [
          'Most home cooks blame the shopping list when a sauce fails. In professional kitchens and food-science labs, the first suspect is almost always thermal history: how fast you climbed in temperature, how long you held there, and how evenly heat moved through the pan. The same grams of butter, cream, or cheese can finish silky or broken depending almost entirely on whether proteins and fat crystals crossed thresholds they cannot uncross.',
          'Low heat is not automatically “safe.” It can leave emulsions under-formed because the water phase never reaches the mobility needed for droplets to shear and stabilize, while aromatics fail to extract. The sauce reads flat not because you lack talent, but because reaction rates for browning and reduction stayed below useful activation energy windows.',
          'High heat is the classic destroyer of dairy-forward emulsions. Butter is a water-in-fat emulsion; cream is a fragile oil-in-water stabilized by membranes; cheese sauces combine hydrated proteins with fat and water in a metastable arrangement. Push past gentle simmer and you increase the kinetic drive for protein aggregation and fat coalescence. Once fat pools as free oil, whisking cannot truly “re-emulsify” without new surface-active material or a cooler pathway.',
        ],
      },
      {
        heading: 'What your flavor wheel cannot show',
        paragraphs: [
          'A two-dimensional balance chart captures perceived salt, acid, fat, and sweet tendencies. Temperature is orthogonal: it changes the physics underneath those perceptions. A perfectly “balanced” ratio on paper can still split if you finish at a rolling boil, because the wheel describes composition while heat describes state.',
          'Think in terms of phase behavior. Emulsified sauces—pan sauces finished with butter, mayonnaise, many cheese systems—live in a narrow thermal band where lipids remain dispersed. Non-emulsified builds like thin soy glazes tolerate more heat because you are not asking immiscible phases to stay married; you are simply concentrating solutes.',
        ],
      },
      {
        heading: 'Practical rule from the bench',
        paragraphs: [
          'If a sauce breaks, lower the heat before you “fix” it with more ingredients. Cooling reduces molecular motion, shrinks the drive toward coalescence, and buys time for gentle reintegration with liquid and mechanical work. Adding more fat to a screaming-hot pan often worsens the problem by adding more free oil to a system that already lost its stabilizing structure.',
          'Finish fat and volatile acids at the end not only because of flavor freshness, but because late addition minimizes time spent at destabilizing temperatures. Carryover heat from the pan continues cooking after you turn the burner off—account for that when you decide when to mount butter or cheese.',
          'For reproducible outcomes, pair visual cues with thermometer habits where it matters: dairy finishes often behave best when you keep the bulk liquid below vigorous simmer while still hot enough to taste “cooked.” Document your stove settings once you find the band; stoves drift, but your notebook should not.',
        ],
      },
      {
        heading: 'Why this matters for SenseiFood readers',
        paragraphs: [
          'Sauce Sensei models ingredient pulls and rough guardrails; SenseiFood articles connect those models to calorimetry, protein chemistry, and emulsion science in plain language. Together they answer both “where am I on the map?” and “what knob failed first?” Temperature is that first knob more often than people admit.',
          'Read this alongside your next pan sauce: if the texture fails, write down the sound of the simmer, the bubble size, and the time from boil to split. Patterns beat superstition. That is the scientific habit we want to export from the lab bench to your weeknight stove.',
        ],
      },
      {
        heading: 'Extended reading: conduction, convection, and the pan you actually own',
        paragraphs: [
          'Electric coils, induction fields, and gas flames do not deposit heat identically into a pan. Conduction through metal sets the boundary condition at the food interface, while convection in the oven of air above the pan sets evaporative rate. A sauce simmering at the same dial position can therefore differ in effective heat flux by tens of percent between kitchens even when the recipe text is identical.',
          'Thin stainless skillets spike faster and recover slower; heavy clad pans damp oscillations and give you more forgiveness when you mount butter. That is engineering, not brand loyalty. If your sauces break more often than your friend’s, compare pan mass and burner diameter before comparing skill.',
          'Stirring changes effective temperature too: it homogenizes hot spots, increases shear on emulsions, and accelerates evaporative cooling at the surface. Aggressive stirring during a fragile finish can be as damaging as high heat because mechanical energy helps droplets coalesce once membranes weaken.',
          'Steam leaving a pot carries latent heat of vaporization; the remaining liquid must supply that energy, which is why vigorous boiling is not “free” even if the dial is unchanged. When you see foam climbing, you are watching a coupled heat-and-mass-transfer event that can overshoot protein stability windows in seconds.',
          'Restaurant ranges often have higher continuous BTU delivery than home equipment, which means “medium” in a written recipe is not a universal number. Translate recipes into observable states: bubble size, acoustic pitch, and surface shear stress on a spoon, then map those states to your own stove’s dial positions.',
          'Finally, carryover is not optional physics. Off-heat finishing is a controlled quench into a gentler gradient. Sauce Sensei encourages tasting loops; temperature literacy makes those loops meaningful instead of random. That is the core bridge we are building toward SenseiFood’s deeper equipment guides.',
        ],
      },
    ],
  },
  {
    slug: 'order-of-operations-sauce-timing',
    title: 'Order of operations: when matters as much as what',
    subtitle: 'Sequential chemistry — why acid early is not acid late, and why butter timing changes texture.',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/order-of-operations-sauce-timing',
    sections: [
      {
        heading: 'Same ingredients, different timeline',
        paragraphs: [
          'Recipes are not commutative. Adding acid at the beginning of a long simmer hydrolyzes connective notes, shifts pH early, and changes how Maillard and caramel pathways compete. Adding the same acid at the end preserves volatile top notes and sharpness that would otherwise boil away or integrate into background savoriness.',
          'Butter added at a rolling boil often shears into oil because you shock an already stressed emulsion with more fat while water phases are aggressively vaporizing. Butter mounted off heat uses residual pan energy to melt without crossing the same probability of break. The ingredient list is identical; the thermodynamic path is not.',
        ],
      },
      {
        heading: 'Finish with fat and acid late (the rule with reasons)',
        paragraphs: [
          'Late fat rounds harsh edges because dissolved aromatics partition into lipid phases right before serving, but only if those lipids stay emulsified. Late acid lifts perception because receptors encounter a spike of proton activity before it equilibrates into the bulk matrix. Early acid, by contrast, becomes part of the “base chord” rather than the “sparkle layer.”',
          'Starch-thickened systems illustrate the point. Acid can thin viscosity if added too soon relative to gelation; added after the starch network forms, it modulates flavor with less textural sabotage. That is not superstition; it is kinetics interacting with polymer hydration.',
        ],
      },
      {
        heading: 'Operational checklist',
        paragraphs: [
          'Build fond and extract soluble browning first. Deglaze to lift fond without drowning the pan. Reduce until the water activity supports the body you want. Emulsify fat off heat or at controlled sub-boil. Taste for salt before acid, then acid, then sweet corrections—each class moves the next perception gate.',
          'When teaching line cooks, we frame this as a directed graph, not a list. Sauce Sensei encodes some of those edges as guardrails; this article names the graph explicitly so you can debug mistakes that look like “wrong ingredient” but are actually “wrong step order.”',
        ],
      },
      {
        heading: 'Connect to SenseiFood',
        paragraphs: [
          'SenseiFood expands these timelines with photography of intermediate states—what “reduced by half” actually looks like on your stove, not a textbook diagram. Use Sauce Sensei to stress-test ratios, then read the companion piece on SenseiFood to align your eyes with your timers.',
        ],
      },
      {
        heading: 'Extended reading: pH, pKa, and why “late lemon” hits harder',
        paragraphs: [
          'Weak acids such as citric acid exist in equilibrium between protonated and deprotonated forms depending on pH. Early addition means the acid participates in the entire thermal history of the sauce, including interactions with proteins and starches that shift effective pKa environments. Late addition delivers a sharper sensory spike because volatile citrus top notes remain closer to the headspace you inhale while eating.',
          'Lipid phases also re-order aromatics. Late fat captures terpenes and aldehydes that would otherwise escape with steam during aggressive reduction. That is why finishing moves are not snobbery; they are partition-coefficient management with a clock attached.',
          'Mustard emulsifiers illustrate order effects in vinaigrette versus pan sauce: early mustard stabilizes an emulsion you then shear with oil; late mustard in a hot cheese system can curdle proteins because isothiocyanates and acid load rise together. Same jar, different permitted sequences.',
          'Sugar timing changes color chemistry: early sucrose participates in Maillard and caramel routes; late sucrose mostly sweetens because there is less time for rearrangement reactions before service. If your sauce looks too dark but tastes too sweet, you may have used the right grams in the wrong century of the timeline.',
          'Stock reduction before fat finishing is classic because it reduces water activity while keeping emulsifier-friendly proteins in solution. Skipping reduction and dumping cream early yields a different colloidal path even when final volumes match. Sauce Sensei approximates pulls; these paragraphs name the mechanisms so you can improvise safely.',
          'For teams, write order as a checklist taped near the station. SenseiFood hosts printable versions aligned to Sauce Sensei categories so training stays consistent between apps.',
        ],
      },
    ],
  },
  {
    slug: 'salt-as-amplifier-not-only-salty',
    title: 'Salt is not only “salty” — it is an amplifier',
    subtitle: 'Ion effects, salting-in proteins, and why under-salted sauces read “needs acid” when they do not.',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/salt-as-amplifier-not-only-salty',
    sections: [
      {
        heading: 'Beyond tongue maps',
        paragraphs: [
          'Sodium chloride does register as salty, but it also suppresses bitterness, enhances sweetness perception at low levels, and increases volatility of certain aroma compounds. That is why a sauce can feel mysteriously flat until a pinch of salt snaps the entire profile forward without changing grams of acid or fat.',
          'In protein-rich liquids, salt shifts equilibria of hydration layers around peptides, effectively changing how “loud” savory notes broadcast. Your wheel may show acid space that looks fine while the mouth still reports dullness. Before you chase brightness with more lemon, chase presence with controlled salt.',
        ],
      },
      {
        heading: 'Before fixing anything — check salt',
        paragraphs: [
          'Treat salt as a diagnostic dial, not a moral judgment. Taste, add a small dissolved amount, taste again. If the sauce suddenly “has melody,” you were under-threshold, not under-acid. This single habit prevents the common spiral of over-correcting with vinegar and then over-correcting with sugar.',
          'Soy-based glazes complicate the picture because soy contributes both salt load and umami nucleotides. The wheel helps separate those pulls; this article reminds you that chloride and glutamate are cooperating channels, not duplicates.',
        ],
      },
      {
        heading: 'Science snapshot',
        paragraphs: [
          'Electrolytes alter water activity, which changes how volatile molecules partition between liquid and headspace. That is chemistry, not folklore. Document salt additions in brine-percent style for stocks you reduce often; predictable salinity makes reduction curves predictable too.',
        ],
      },
      {
        heading: 'SenseiFood pairing',
        paragraphs: [
          'SenseiFood publishes measured salinity charts for common pantry items—soy, fish sauce, miso, hard cheese—so you can translate “a splash” into grams with fewer surprises. Sauce Sensei stays interactive; SenseiFood stays reference-grade.',
        ],
      },
      {
        heading: 'Extended reading: ions, receptors, and the “missing melody” illusion',
        paragraphs: [
          'Ion-specific channels on taste cells create interactions that naive “four tastes” models miss. Sodium amplifies certain sweet receptor pathways at low concentrations while suppressing bitter transduction through mechanisms still debated in sensory literature. Practically, that means a sauce can measure “fine” on paper yet fail in the mouth until salt crosses a threshold.',
          'Chefs talk about “seasoning in layers” because each stage has a different solvent environment: raw vegetable water, released protein broth, reduced wine, mounted fat. Salt partitions differently across those stages, so a single early salting does not equal the same sensory outcome as finishing salt even at identical final grams.',
          'Label-reading cooks sometimes under-salt reduced sauces because they fear overshooting, then over-acid to wake the palate. The wheel moves; the root cause was salinity all along. Logging grams of NaCl per liter after reduction stabilizes intuition faster than tasting alone.',
          'Brines and dry-salting meat change starting water activity before the sauce ever begins. SenseiFood documents those pretreatments; Sauce Sensei helps you see downstream wheel effects once those grams enter your simulation honestly.',
          'Finally, remember health and preference vary: the science here is about perception mechanics, not prescribing sodium intake for individuals. Use thresholds appropriate to your household while still exploiting the physics honestly.',
          'If you export one habit from this article, make it: salt, taste, label the change, then decide whether acid is still warranted. That discipline alone prevents half the “mysterious” bad reviews on otherwise good recipes online.',
        ],
      },
    ],
  },
  {
    slug: 'water-content-hidden-dilution',
    title: 'Water content: the hidden dilution variable',
    subtitle: 'Vegetable osmosis, frozen food purge, and chicken weep — why sauces go thin without “adding water.”',
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: 'sauce-science/water-content-hidden-dilution',
    sections: [
      {
        heading: 'You did not pour it; it still arrived',
        paragraphs: [
          'Many “failed” sauces are simply more dilute than the cook intended because water entered from ingredients, not from the tap. Muscle tissue expels liquid as proteins contract; vegetables osmose into hot oil or broth; frozen seafood sheds bound water as ice crystals melt. Each gram dilutes dissolved flavor and thickening power.',
          'That dilution shifts the wheel indirectly: lower effective concentration reads as weaker salt, weaker umami, and thinner body. You respond by adding acid or fat when the real lever is evaporation—driving water activity down until viscosity returns.',
        ],
      },
      {
        heading: 'Unexpected thin? Reduce first',
        paragraphs: [
          'Before adjusting roux ratios or adding starch slurry, simmer to tighten. Reduction concentrates salts and amino acids along with sugars; you may find salt comes “back” without additions once water leaves. If you thicken before reducing, you can overshoot into pasty territory that is harder to unwind.',
          'For pan sauces built on fond, vegetable side water is a classic culprit when cooks crowd the pan early. Blanch or roast separately when precision matters; the wheel cannot see pan crowding, but your eyes can.',
        ],
      },
      {
        heading: 'Measurement mindset',
        paragraphs: [
          'Weigh post-sear protein when developing recipes; the delta from raw weight is often your hidden broth. SenseiFood publishes tables for common cuts; Sauce Sensei lets you simulate the downstream effect on perceived balance once you encode those grams honestly.',
        ],
      },
      {
        heading: 'Closing loop',
        paragraphs: [
          'Think of water as a silent ingredient with a negative flavor sign until removed. That mental model aligns lab notebooks with restaurant lines — and keeps your chart from lying to you about “missing acid” when you are really missing concentration.',
        ],
      },
      {
        heading: 'Extended reading: osmosis, drip loss, and frozen purge by the numbers',
        paragraphs: [
          'Muscle tissue holds water in compartments governed by protein lattice integrity. Heat contracts myofibrils and expresses fluid; resting meat continues to drip as gradients relax. A hundred grams of “hidden” purge can be normal for certain cuts after searing, which is enormous relative to a tight pan sauce volume.',
          'Vegetables behave like leaky bags of osmolytes. Salt draws water through membranes; heat damages cell walls and releases vacuolar liquid. A crowded pan of mushrooms looks dry until it suddenly weeps a lake; that is not sabotage, it is physics arriving late to the party.',
          'Frozen seafood and vegetables release additional water from ice crystal damage to cell structure. Thawing on a rack captures some purge; thawing in a pool keeps it in contact with food and later sauces if you are not careful. Track thaw loss when scaling SenseiFood batch recipes to Sauce Sensei single-pan builds.',
          'Starch gelatinization competes with dilution: if water arrives late, viscosity may never reach the target even though you “cooked long enough” by clock. That is why reduce-first is a diagnostic, not a dogma: it separates concentration problems from thickener problems.',
          'Steam tables and holding warm for service add evaporation or condensation depending on lid strategy. Sauces held open tighten; sauces held closed can re-absorb water from condensate drips. Document your service vessel behavior when moving from home testing to party scale.',
          'SenseiFood publishes spreadsheet templates for expected yield loss by ingredient category. Import those yields into Sauce Sensei as honesty layers so your wheel reflects the kitchen you actually ran, not the kitchen you imagined on paper.',
        ],
      },
    ],
  },
];
