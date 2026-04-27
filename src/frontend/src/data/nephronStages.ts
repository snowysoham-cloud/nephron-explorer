import type { NephronStage } from "@/types/nephron";

export const NEPHRON_STAGES: NephronStage[] = [
  {
    id: 1,
    name: "Renal Corpuscle",
    emoji: "🔵",
    colorVar: "stage-1",
    shortDesc:
      "Blood roars into the glomerulus under high pressure — the kidney's first checkpoint where filtration begins.",
    fullDesc:
      "The renal corpuscle is made up of a tangle of capillaries called the glomerulus, wrapped inside a cup-shaped structure called Bowman's capsule. Blood arrives through the afferent arteriole at high hydrostatic pressure, forcing water, glucose, ions, and urea through tiny pores in the capillary walls — a process called ultrafiltration. Large proteins and blood cells are too big to pass, so they stay in the bloodstream. Every minute, about 125 mL of filtrate is created from the blood — nearly your entire blood volume is filtered 60 times a day!",
    funFact:
      "Your kidneys filter roughly 180 litres of blood every single day — that's about 45 gallons!",
    substances: [
      "Water ✓ filtered",
      "Glucose ✓ filtered",
      "Na⁺ ✓ filtered",
      "Urea ✓ filtered",
      "Proteins ✗ retained",
      "Blood cells ✗ retained",
    ],
    reabsorptionData: [
      { substance: "Plasma filtered", percentage: 20 },
      { substance: "Proteins retained", percentage: 99 },
      { substance: "Blood cells retained", percentage: 100 },
    ],
    animationType: "filtration",
    mapPosition: { x: 30, y: 18 },
  },
  {
    id: 2,
    name: "Proximal Tubule",
    emoji: "🟢",
    colorVar: "stage-2",
    shortDesc:
      "The busiest stretch of the nephron — nearly everything useful in the filtrate is scooped back into the bloodstream here.",
    fullDesc:
      "The proximal tubule is lined with millions of microvilli called the brush border, which massively increase the surface area for reabsorption. Glucose, amino acids, and about 65–70% of the filtered water and sodium are all reclaimed here through a mix of active transport (using ATP) and passive diffusion. Bicarbonate is also reabsorbed to help maintain blood pH. This is where the kidney does its heaviest lifting — if you think of filtration as taking everything out of your pockets, the proximal tubule is where you grab back the things you actually need.",
    funFact:
      "100% of the glucose in the filtrate is normally reabsorbed here — if it spills into urine, it's a sign of diabetes.",
    substances: [
      "Glucose ↑ reabsorbed (100%)",
      "Amino acids ↑ reabsorbed",
      "Na⁺ ↑ reabsorbed (~67%)",
      "Water ↑ reabsorbed (~67%)",
      "HCO₃⁻ ↑ reabsorbed",
      "Cl⁻ ↑ reabsorbed",
    ],
    reabsorptionData: [
      { substance: "Water", percentage: 67 },
      { substance: "Glucose", percentage: 100 },
      { substance: "Na⁺", percentage: 67 },
    ],
    animationType: "reabsorption",
    mapPosition: { x: 58, y: 22 },
  },
  {
    id: 3,
    name: "Loop of Henle",
    emoji: "🟠",
    colorVar: "stage-3",
    shortDesc:
      "A dramatic U-shaped dive into the kidney's core — this loop builds the osmotic gradient that makes urine concentration possible.",
    fullDesc:
      "The loop of Henle dips deep into the renal medulla in a hairpin turn. The descending limb is freely permeable to water but not to salts, so water rushes out as the filtrate descends into the increasingly salty medulla. The ascending limb is the opposite — it actively pumps out Na⁺ and Cl⁻ but is impermeable to water, diluting the filtrate as it rises. This countercurrent multiplier system creates a steep osmotic gradient in the medulla that is essential for producing concentrated urine later. Without it, you would lose enormous amounts of water every day.",
    funFact:
      "Desert animals like kangaroo rats have very long loops of Henle — letting them concentrate urine so efficiently they almost never need to drink!",
    substances: [
      "Water ↑ reabsorbed (descending)",
      "Na⁺ ↑ pumped out (ascending)",
      "Cl⁻ ↑ pumped out (ascending)",
      "K⁺ ↑ pumped out (ascending)",
    ],
    reabsorptionData: [
      { substance: "H₂O (descending)", percentage: 25 },
      { substance: "Na⁺ (ascending)", percentage: 25 },
      { substance: "Cl⁻ (ascending)", percentage: 25 },
    ],
    animationType: "loop",
    mapPosition: { x: 55, y: 62 },
  },
  {
    id: 4,
    name: "Distal Tubule",
    emoji: "🟣",
    colorVar: "stage-4",
    shortDesc:
      "The hormone-controlled fine-tuner — this segment adjusts the final ion balance based on what your body needs right now.",
    fullDesc:
      "The distal tubule is shorter than the proximal tubule but just as important for precise regulation. Here, the hormone aldosterone (secreted by the adrenal glands) stimulates Na⁺ reabsorption and K⁺ secretion — raising blood pressure when needed. Hydrogen ions can also be secreted into the filtrate to regulate blood pH (acid-base balance). Parathyroid hormone (PTH) controls calcium reabsorption in this segment too. Think of the distal tubule as the kidney's fine-tuning knob after the proximal tubule did the bulk of the work.",
    funFact:
      "Aldosterone is the hormone that makes you retain sodium (and water) when you're dehydrated — your body literally signals the kidney to hold on tight!",
    substances: [
      "Na⁺ ↑ reabsorbed (aldosterone)",
      "K⁺ ↓ secreted",
      "H⁺ ↓ secreted",
      "Ca²⁺ ↑ reabsorbed (PTH)",
      "Water ↑ reabsorbed (~5–10%)",
    ],
    reabsorptionData: [
      { substance: "Water", percentage: 8 },
      { substance: "Na⁺", percentage: 10 },
      { substance: "K⁺ secreted", percentage: 15 },
    ],
    animationType: "secretion",
    mapPosition: { x: 30, y: 38 },
  },
  {
    id: 5,
    name: "Collecting Duct",
    emoji: "🔴",
    colorVar: "stage-5",
    shortDesc:
      "The final stretch — ADH decides how much water to reclaim before the filtrate becomes urine and drains into the renal pelvis.",
    fullDesc:
      "The collecting duct runs back through the medulla, passing through the osmotic gradient built by the loop of Henle. When you are dehydrated, the hypothalamus signals the posterior pituitary to release ADH (antidiuretic hormone), which inserts aquaporin-2 water channels into the collecting duct walls. Water floods out into the concentrated medulla, and urine becomes small in volume but very concentrated. Without ADH, the duct stays impermeable and you produce a large volume of dilute urine. Urea from the filtrate also leaks out here, reinforcing the medullary gradient. The final product drains into the renal pelvis and heads to the bladder.",
    funFact:
      "Alcohol suppresses ADH release — that's why drinking alcohol makes you urinate so much more than you actually drink!",
    substances: [
      "Water ↑ reabsorbed (ADH-dependent)",
      "Urea ↑ recycled (~40%)",
      "Na⁺ ↑ reabsorbed",
      "H⁺ ↓ secreted",
    ],
    reabsorptionData: [
      { substance: "Water (no ADH)", percentage: 5 },
      { substance: "Water (high ADH)", percentage: 19 },
      { substance: "Urea recycled", percentage: 40 },
    ],
    animationType: "collection",
    mapPosition: { x: 70, y: 50 },
  },
];
