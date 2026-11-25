export const SECTIONS = [
  { id: "shop", label: "Shop", title: "Shop the market" },
  { id: "prep", label: "Prep", title: "Prep" },
  { id: "recipes", label: "Recipes", title: "Recipes" },
  { id: "pack", label: "Pack", title: "Pack for the venue" },
  { id: "menu", label: "Menu", title: "The menu" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const SECTION_IDS = SECTIONS.map((section) => section.id);

export const isSectionId = (value: unknown): value is SectionId =>
  typeof value === "string" && SECTION_IDS.includes(value as SectionId);

export const GAME_PLAN = [
  {
    title: "At home, the day before",
    text: "Dry-brine the turkey if it hasn’t already been salted. Cook the caldillo, bake the stuffing, make the mash, and prep the bacalao and salad potatoes. Wash and dry the lettuce, make its dressing, and toast and candy the pistachios. Make the gravy base ahead if you want one less pan to deal with at the venue.",
  },
  {
    title: "When you get to the venue",
    text: "Put the turkey in first. Keep the cooked sides and salad ingredients chilled until needed. Set out the jamón, Manchego and picos as people arrive. Reheat the caldillo and finish it with hierbabuena. Assemble the ensalada malagueña and serve it with the soup.",
  },
  {
    title: "When the turkey comes out",
    text: "Give the oven to the two foil trays. Keep the mash covered and uncover the stuffing near the end. Set out the greens and warm the gravy while the sides heat. Carve when both trays are close to ready, then open the buffet together.",
  },
];
