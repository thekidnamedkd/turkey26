export const CATEGORIES = [
  { id: "butcher", label: "Butcher & fish", local: "Carnicería y pescadería" },
  {
    id: "produce",
    label: "Fruit, vegetables & herbs",
    local: "Frutería y verdulería",
  },
  {
    id: "bakery",
    label: "Bakery, deli & dry goods",
    local: "Panadería y ultramarinos",
  },
  { id: "dairy", label: "Dairy & chilled", local: "Lácteos y refrigerados" },
  {
    id: "pantry",
    label: "Stock, drinks & pantry",
    local: "Bodega y despensa",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type DishId =
  | "turkey"
  | "gravy"
  | "stuffing"
  | "mash"
  | "caldillo"
  | "ensalada"
  | "green-salad"
  | "picoteo";

export interface Ingredient {
  /** Stable key used in saved state. */
  id: string;
  /** English name, or the market name where the Spanish one leads. */
  name: string;
  /** Spanish or English counterpart printed beside the name. */
  alt?: string;
  /** Latin name, where the source gives one. */
  latin?: string;
  category: CategoryId;
  /** Prominent purchase quantity, bold in the source. */
  amount: string;
  /** Visual shopping cue and buying notes. `**bold**` allowed. */
  detail: string;
  /** Dish the ingredient is bought for, as written in the source. */
  usedFor: string;
  dishes: DishId[];
}

export const INGREDIENT_INTRO =
  "Approximate purchase weights unless marked drained or prepared. The visual cues are for shopping. Use the scale for the final amount.";

export const INGREDIENTS: Ingredient[] = [
  {
    id: "turkey",
    name: "Fresh whole turkey",
    alt: "pavo fresco entero",
    category: "butcher",
    amount: "6–7 kg",
    detail:
      "one large oven-ready bird. Look for added brine on the label and check that the bird fits your roasting pan and venue oven.",
    usedFor: "Roast",
    dishes: ["turkey"],
  },
  {
    id: "pintarroja",
    name: "Pintarroja",
    alt: "small-spotted catshark",
    latin: "Scyliorhinus canicula",
    category: "butcher",
    amount: "500–600 g cleaned weight",
    detail:
      "Ask for *pintarroja limpia, sin piel y troceada*. For sipping cups, remove any central cartilage and cut the cooked flesh small.",
    usedFor: "Caldillo",
    dishes: ["caldillo"],
  },
  {
    id: "bacalao",
    name: "Bacalao",
    category: "butcher",
    amount: "300–350 g prepared, desalted cod",
    detail:
      "roughly two palm-sized pieces. If buying salt-packed, use the pack’s prepared yield and desalting instructions.",
    usedFor: "Ensalada malagueña",
    dishes: ["ensalada"],
  },
  {
    id: "chorizo",
    name: "Fresh Spanish chorizo",
    alt: "chorizo fresco",
    category: "butcher",
    amount: "400 g",
    detail: "roughly 4 medium links",
    usedFor: "Stuffing",
    dishes: ["stuffing"],
  },
  {
    id: "floury-potatoes",
    name: "Floury potatoes",
    alt: "patatas para puré",
    category: "produce",
    amount: "2.5 kg",
    detail: "roughly 12–15 baseball-sized potatoes",
    usedFor: "Mash",
    dishes: ["mash"],
  },
  {
    id: "firm-potatoes",
    name: "Firm potatoes",
    alt: "patatas para cocer",
    category: "produce",
    amount: "500 g",
    detail: "roughly 3 baseball-sized potatoes",
    usedFor: "Ensalada malagueña",
    dishes: ["ensalada"],
  },
  {
    id: "oranges",
    name: "Oranges",
    category: "produce",
    amount: "7 medium",
    detail:
      "roughly tennis-ball size. Use 2 for the turkey and 5 for the salad.",
    usedFor: "Turkey and ensalada",
    dishes: ["turkey", "ensalada"],
  },
  {
    id: "onions-cebolleta",
    name: "Onions and cebolleta",
    category: "produce",
    amount: "2 medium onions",
    detail: "roughly tennis-ball size, plus **1 small cebolleta**",
    usedFor: "Onions for stuffing, cebolleta for ensalada",
    dishes: ["stuffing", "ensalada"],
  },
  {
    id: "carrots",
    name: "Carrots",
    category: "produce",
    amount: "3 medium",
    detail: "roughly hand-length",
    usedFor: "Turkey roasting tray",
    dishes: ["turkey"],
  },
  {
    id: "celery",
    name: "Celery",
    category: "produce",
    amount: "1 small bunch",
    detail: "at least 6 stalks",
    usedFor: "3 turkey, 3 stuffing",
    dishes: ["turkey", "stuffing"],
  },
  {
    id: "garlic",
    name: "Garlic",
    category: "produce",
    amount: "1 head",
    detail: "",
    usedFor: "4–5 cloves for soup",
    dishes: ["caldillo"],
  },
  {
    id: "tomatoes-pepper",
    name: "Tomatoes and green pepper",
    category: "produce",
    amount: "2 ripe tomatoes (about 300 g)",
    detail: "and **1 long green pepper (about 100 g)**",
    usedFor: "Caldillo",
    dishes: ["caldillo"],
  },
  {
    id: "parsley-mint",
    name: "Flat-leaf parsley and hierbabuena",
    category: "produce",
    amount: "1 small bunch each",
    detail:
      "Use a small handful of parsley leaves for ensalada and 2 mint sprigs for the caldillo.",
    usedFor: "Picoteo",
    dishes: ["ensalada", "caldillo"],
  },
  {
    id: "lettuce",
    name: "Lettuce",
    category: "produce",
    amount: "3 medium heads",
    detail:
      "roughly two cupped hands each. Aim for **450–550 g usable leaves**.",
    usedFor: "Green salad",
    dishes: ["green-salad"],
  },
  {
    id: "lemons",
    name: "Lemons",
    category: "produce",
    amount: "2 medium",
    detail: "roughly egg to tennis-ball size",
    usedFor: "Soup and serving",
    dishes: ["caldillo"],
  },
  {
    id: "sage",
    name: "Sage",
    category: "produce",
    amount: "1 small bunch",
    detail: "use about 12–16 leaves",
    usedFor: "Stuffing",
    dishes: ["stuffing"],
  },
  {
    id: "bread",
    name: "Crusty bread",
    category: "bakery",
    amount: "About 800 g",
    detail:
      "one large country loaf or two small loaves. Reserve 50 g for the caldillo.",
    usedFor: "Stuffing",
    dishes: ["stuffing", "caldillo"],
  },
  {
    id: "dried-fruit",
    name: "Dried apricots and pitted prunes",
    category: "bakery",
    amount: "100 g apricots + 75 g prunes",
    detail: "about a small handful of each",
    usedFor: "Stuffing",
    dishes: ["stuffing"],
  },
  {
    id: "almonds",
    name: "Almonds",
    category: "bakery",
    amount: "150 g total",
    detail:
      "75 g whole blanched for the caldillo and 75 g chopped or slivered for stuffing",
    usedFor: "Soup and stuffing",
    dishes: ["caldillo", "stuffing"],
  },
  {
    id: "pistachios",
    name: "Pistachios",
    category: "bakery",
    amount: "100 g shelled",
    detail: "about two small handfuls",
    usedFor: "Green salad",
    dishes: ["green-salad"],
  },
  {
    id: "olives",
    name: "Green olives, ideally Aloreña de Málaga",
    category: "bakery",
    amount: "120–150 g drained",
    detail: "roughly one small jar after draining",
    usedFor: "Ensalada malagueña",
    dishes: ["ensalada"],
  },
  {
    id: "membrillo",
    name: "Membrillo",
    category: "bakery",
    amount: "60–75 g",
    detail: "roughly a matchbox-sized piece. Buy one small pack.",
    usedFor: "Green salad vinaigrette",
    dishes: ["green-salad"],
  },
  {
    id: "jamon-manchego-picos",
    name: "Jamón, queso and picos",
    category: "bakery",
    amount: "200–250 g each",
    detail:
      "of sliced jamón serrano and Manchego semicurado, plus **150–200 g picos**",
    usedFor: "Arrival board",
    dishes: ["picoteo"],
  },
  {
    id: "blue-cheese",
    name: "Blue cheese",
    category: "dairy",
    amount: "150 g",
    detail: "one small wedge",
    usedFor: "Green salad",
    dishes: ["green-salad"],
  },
  {
    id: "butter",
    name: "Unsalted butter",
    category: "dairy",
    amount: "250 g",
    detail: "one block",
    usedFor: "150 g mash, 50 g stuffing, with some left for make-ahead gravy",
    dishes: ["mash", "stuffing", "gravy"],
  },
  {
    id: "milk",
    name: "Whole milk",
    category: "dairy",
    amount: "500 mL",
    detail: "one small carton",
    usedFor: "Start with 300 mL for mash and reserve the rest to loosen it",
    dishes: ["mash"],
  },
  {
    id: "manteca",
    name: "Manteca de cerdo",
    category: "dairy",
    amount: "100–125 g",
    detail: "about half a 250 g tub",
    usedFor: "Turkey",
    dishes: ["turkey"],
  },
  {
    id: "eggs",
    name: "Eggs",
    category: "dairy",
    amount: "2 large",
    detail: "",
    usedFor: "Stuffing",
    dishes: ["stuffing"],
  },
  {
    id: "stock",
    name: "Stock",
    category: "pantry",
    amount: "1.5 L low-salt chicken or turkey stock",
    detail: "Use water for the caldillo.",
    usedFor: "Stuffing and gravy",
    dishes: ["stuffing", "gravy"],
  },
  {
    id: "oloroso-flour",
    name: "Dry oloroso and flour",
    category: "pantry",
    amount: "120 mL dry oloroso",
    detail: "and **30 g plain flour**",
    usedFor: "Gravy",
    dishes: ["gravy"],
  },
  {
    id: "pantry",
    name: "Pantry",
    category: "pantry",
    amount: "",
    detail:
      "**300 mL extra-virgin olive oil on hand**, **60 mL sherry vinegar**, **25 g sugar**, celery salt, fine salt (**30–35 g for the turkey dry brine if needed**, plus more for cooking), black pepper, pimentón de la Vera, ground cumin, 1–2 dried guindillas, 1 bay leaf, and a generous pinch of saffron",
    usedFor: "Dressings, nuts, and seasoning",
    dishes: [],
  },
];

export const ingredientById = (id: string) =>
  INGREDIENTS.find((item) => item.id === id);
