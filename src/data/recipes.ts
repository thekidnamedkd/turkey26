export type RecipeId =
  | "caldillo"
  | "ensalada"
  | "turkey"
  | "gravy"
  | "stuffing"
  | "mash"
  | "green-salad";

export interface Source {
  label: string;
  url: string;
}

export interface RecipeStep {
  heading?: string;
  /** Ordered method steps. `**bold**` marks a measurement. */
  steps?: string[];
  /** Method that the source gives as a single paragraph. */
  text?: string;
}

export interface Recipe {
  id: RecipeId;
  name: string;
  group: "arrival" | "dinner";
  intro?: string;
  method: RecipeStep[];
  sources: Source[];
}

export const RECIPE_GROUPS: Record<Recipe["group"], string> = {
  arrival: "Arrival picoteo",
  dinner: "Thanksgiving buffet with Spanish touches",
};

export const RECIPES: Recipe[] = [
  {
    id: "caldillo",
    name: "Caldillo de pintarroja with hierbabuena and lemon",
    group: "arrival",
    intro:
      "Keep it thin enough to sip. The fried bread and almonds give the broth body, and the mint and lemon lift the heat from the guindilla.",
    method: [
      {
        steps: [
          "Fry **75 g blanched almonds**, **50 g torn bread**, and **4 garlic cloves** in olive oil until golden. Set aside. In the same pan, soften the chopped green pepper and tomatoes. Blend the pepper and tomatoes with the fried bread, garlic, almonds, and a ladle of water.",
          "Bring **1.3–1.4 L water** to a simmer with **1 bay leaf**, **1 dried guindilla** and **½ tsp ground cumin**. Add the cleaned pintarroja, the almond mixture and a generous pinch of saffron. Simmer gently until the fish is opaque and flakes easily. Lift it out, remove any central cartilage, then return the flesh in small pieces. Thin as needed for sipping. Taste before adding more chile.",
          "Make it at home and chill in shallow containers. At the venue, bring it back to a boil, then steep **2 sprigs of fresh hierbabuena** briefly off the heat. Remove the sprigs and set out lemon wedges for guests to squeeze into their cups.",
        ],
      },
      {
        text: "Based on two Málaga versions, which use fried almond, garlic and bread and give options for herbs and seafood. This batch keeps the pintarroja as the featured fish.",
      },
    ],
    sources: [
      {
        label: "Academia Gastronómica de Málaga",
        url: "https://academiagastronomica.com/platos/caldillo-de-pintarroja/",
      },
      {
        label: "Guía Gastronómica de Málaga",
        url: "https://malagagastronomyguide.com/es/caldillo-de-pintarroja/",
      },
    ],
  },
  {
    id: "ensalada",
    name: "Ensalada malagueña with flat-leaf parsley",
    group: "arrival",
    intro:
      "Let the oranges do most of the talking. Dress the potatoes separately so they soak up the vinegar, then pile the bright, briny ingredients on top.",
    method: [
      {
        text: "Boil **500 g firm potatoes** until just tender. Cut into bite-size chunks and dress while still slightly warm with **30 mL extra-virgin olive oil** and **10 mL sherry vinegar**. Cook and flake **300–350 g desalted bacalao** according to the package, then chill it separately. Cut **5 oranges** into bite-size segments and save the juice from the cutting board. At the venue, scatter the oranges, flakes of bacalao, thin-sliced **cebolleta**, and **120–150 g pitted olives** over the potatoes. Finish with the reserved juice, another **15 mL olive oil**, and **2–3 tbsp chopped flat-leaf parsley**. Taste before salting. Serve on two small platters alongside the jamón, Manchego and picos.",
      },
      {
        text: "Parsley is the addition here. The local versions anchor the salad in potato, orange, bacalao, onion, olives and olive oil, with sherry vinegar in the guide's version.",
      },
    ],
    sources: [
      {
        label: "Academia Gastronómica de Málaga",
        url: "https://academiagastronomica.com/platos/ensalada-malaguena/",
      },
      {
        label: "Guía Gastronómica de Málaga",
        url: "https://malagagastronomyguide.com/es/ensalada-malaguena/",
      },
    ],
  },
  {
    id: "turkey",
    name: "Orange-and-manteca roast turkey",
    group: "dinner",
    intro:
      "Orange zest perfumes the manteca. Dry oloroso brings a nutty edge to the gravy that works just as well on the mash and chorizo stuffing.",
    method: [
      {
        heading: "The night before",
        text: "If the fresh turkey has no added brine or salt solution, pat it dry and season evenly with **5 g fine salt per kg of bird weight** (about **30–35 g for a 6–7 kg turkey**). Slip some salt under the breast skin if it lifts easily. Refrigerate uncovered overnight on a rimmed tray on the bottom shelf. Skip the dry brine if the label says the turkey is already brined or injected with a salt solution.",
      },
      {
        heading: "At the venue",
        text: "Just before roasting, rub the turkey with **100–125 g softened manteca de cerdo** mixed with the zest of **2 oranges** and black pepper. Skip extra salt if the bird was dry-brined or came pre-brined. Roast breast-up and unstuffed over the carrots, celery and quartered oranges at **165°C**. Budget about **3–3½ hours**, plus resting time. Check for **74°C** in the thickest part of the breast and the innermost thigh and wing.",
      },
    ],
    sources: [
      {
        label: "Bon Appétit’s overnight-brined roast turkey",
        url: "https://www.bonappetit.com/bon-appetit/recipe/expertly-spiced-and-glazed-roast-turkey",
      },
      {
        label: "Bon Appétit’s citrus-brine inspiration",
        url: "https://www.bonappetit.com/recipe/dry-brined-turkey",
      },
      {
        label: "USDA turkey temperatures",
        url: "https://ask.fsis.usda.gov/article/What-is-the-internal-temperature-and-cooking-time-for-turkey",
      },
    ],
  },
  {
    id: "gravy",
    name: "Dry oloroso gravy",
    group: "dinner",
    method: [
      {
        text: "Skim the drippings and deglaze the roasting pan with **120 mL dry oloroso**. Whisk **30 g flour** into **30 g skimmed turkey fat** in a saucepan, then gradually add the deglazed juices and enough low-salt stock to make **about 600 mL gravy**. Simmer until it coats a spoon. Taste and finish with a teaspoon of sherry vinegar if it needs brightness. For less work at the venue, make the gravy at home with 30 g of the remaining butter and poultry stock, then reheat and whisk in a little skimmed pan juice.",
      },
    ],
    sources: [
      {
        label: "Bon Appétit’s citrus-brine inspiration",
        url: "https://www.bonappetit.com/recipe/dry-brined-turkey",
      },
    ],
  },
  {
    id: "stuffing",
    name: "Crisp-edged chorizo and sage stuffing",
    group: "dinner",
    intro:
      "Brown the chorizo first and cook the onion and celery in its paprika-red fat. The apricots and prunes give you little pockets of sweetness, and the toasted almonds keep their crunch.",
    method: [
      {
        text: "Dry **700–750 g cubed bread** in the oven. Remove the casings from **400 g fresh Spanish chorizo**, crumble it, and brown it in a skillet. Transfer the chorizo to a bowl and leave about **2 tbsp** of the rendered fat in the pan. Add **50 g butter** and soften **2 chopped onions** and **3 celery stalks** in it. Toss the chorizo and vegetables with the bread, **12–16 chopped sage leaves**, **100 g chopped apricots**, **75 g chopped prunes**, **75 g toasted almonds** and a small pinch of celery salt if needed. Whisk **2 eggs** with **600 mL low-salt stock** and mix in, adding up to **150 mL** more stock if needed to evenly moisten the bread. Bake in a shallow tray at **175°C**, covered until the center reaches **74°C**, then uncover to brown. Chill, then reheat during the turkey rest.",
      },
    ],
    sources: [
      {
        label: "Bon Appétit’s Simple-Is-Best Stuffing",
        url: "https://www.bonappetit.com/bon-appetit/recipe/simple-is-best-stuffing-dressing",
      },
      {
        label: "USDA stuffing temperature",
        url: "https://ask.fsis.usda.gov/article/What-is-the-internal-temperature-and-cooking-time-for-turkey",
      },
    ],
  },
  {
    id: "mash",
    name: "Buttery mash with an optional smoked-paprika finish",
    group: "dinner",
    method: [
      {
        text: "Boil **2.5 kg floury potatoes** in salted water until tender, drain well, and mash with **150 g butter** and about **300 mL warm whole milk**. Season to taste and chill in the shallow tray. Reheat covered and loosen with a little warm milk if needed. For a Spanish accent that leaves the classic mash available to everyone, put out a small bowl of extra-virgin olive oil stirred with a pinch of **pimentón de la Vera** for people to drizzle. The oloroso gravy is also right at home here.",
      },
    ],
    sources: [
      {
        label: "BA’s Best Mashed Potatoes",
        url: "https://www.bonappetit.com/recipe/best-mashed-potatoes",
      },
    ],
  },
  {
    id: "green-salad",
    name: "Green salad with membrillo, blue cheese and two kinds of pistachios",
    group: "dinner",
    method: [
      {
        text: "Whisk **60–75 g membrillo** with **40 mL sherry vinegar** and **90–100 mL extra-virgin olive oil**. Taste for a sharp finish. Toast half of the **100 g pistachios** plain and candy the other half with about **12 g sugar**. Set them out with the dressing and **150 g crumbled blue cheese** beside the lettuce. If you want a Spanish blue, try **Valdeón**. The plain toasted nuts give you a savory crunch alongside the candied ones.",
      },
    ],
    sources: [],
  },
];

export const recipeById = (id: RecipeId) =>
  RECIPES.find((recipe) => recipe.id === id);
