export interface Equipment {
  id: string;
  title: string;
  detail: string;
  recipeId?: string;
}

export const PACK_NOTE =
  "Check that the center of both reheated sides reaches 74°C before opening the buffet.";

export const PACK_NOTE_SOURCE = {
  label: "USDA reheating guidance",
  url: "https://ask.fsis.usda.gov/article/What-methods-of-reheating-food-are-safe",
};

export const EQUIPMENT: Equipment[] = [
  {
    id: "trays",
    title: "2 sturdy disposable aluminum trays",
    detail:
      "For the hot sides, one per dish. Look for about **32 × 26 cm** each, roughly A4 footprint, and **4–5 cm deep**. Aim for a food layer around **3–4 cm**. Compare the trays’ outer rims with the venue’s usable rack width and depth so both fit together.",
  },
  {
    id: "support",
    title: "Heavy foil and rigid baking sheets",
    detail: "To support the disposable trays when lifting them.",
  },
  {
    id: "cups-ladle",
    title: "16–18 heat-safe cups, plus a ladle",
    detail: "Around **150–180 mL** each.",
  },
  {
    id: "serving",
    title:
      "Serving spoons, tongs, a probe thermometer, and coolers with ice packs",
    detail: "",
  },
];
