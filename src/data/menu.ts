import type { RecipeId } from "./recipes.ts";

export interface MenuItem {
  name: string;
  recipeId?: RecipeId;
}

/** The menu itself. Quantities live once, under `SERVING_TARGETS`. */
export const MENU_INTRO =
  "Open with hot cups of almond-thickened pintarroja, an orange-and-bacalao salad, and a board of jamón, Manchego and picos. Then bring out the orange-and-manteca turkey, dry oloroso gravy, chorizo stuffing, buttery mashed potatoes and crisp greens with membrillo vinaigrette.";

export const ARRIVAL_MENU: MenuItem[] = [
  { name: "Caldillo de pintarroja", recipeId: "caldillo" },
  { name: "Ensalada malagueña", recipeId: "ensalada" },
  { name: "Jamón, Manchego and picos" },
];

export const DINNER_MENU: MenuItem[] = [
  { name: "Orange-and-manteca roast turkey", recipeId: "turkey" },
  { name: "Dry oloroso gravy", recipeId: "gravy" },
  { name: "Chorizo and sage stuffing", recipeId: "stuffing" },
  { name: "Buttery mash", recipeId: "mash" },
  {
    name: "Green salad with membrillo and blue cheese",
    recipeId: "green-salad",
  },
];

export interface ServingTarget {
  dish: string;
  target: string;
}

export const SERVING_TARGETS: ServingTarget[] = [
  {
    dish: "Turkey",
    target:
      "One **6–7 kg** whole bird gives room for seconds at a buffet with this many sides.",
  },
  {
    dish: "Classic buttery mash",
    target:
      "**2.5 kg raw potatoes** makes about **2.4–2.6 kg finished mash**, around **170–185 g per guest**. If you want the original sweet potato swirl, swap **500 g** of the floury potatoes for **500 g sweet potatoes** (about 2 medium).",
  },
  {
    dish: "Bread stuffing",
    target:
      "**One shallow tray**. Use about **600–750 mL stock**, adding it gradually because bread varies. Reserve the rest of the poultry stock for the roasting tray or pan juices.",
  },
  {
    dish: "Caldillo de pintarroja",
    target:
      "Aim for **1.6–1.8 L finished soup**, enough for 14 small cups of **100–120 mL**.",
  },
  {
    dish: "Ensalada malagueña",
    target:
      "**Two small platters**, about seven tasting portions each. Five oranges and 500 g potatoes keep it orange-forward alongside the mash.",
  },
  {
    dish: "Green salad",
    target:
      "**Two medium bowls** or one large bowl with a chilled refill. For the dressing, loosen the membrillo with about **40 mL sherry vinegar**, then whisk in **90–100 mL olive oil**. Use **25 g sugar** if candying all the pistachios, or roughly half that for half the nuts.",
  },
];
