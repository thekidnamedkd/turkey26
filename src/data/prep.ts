import type { RecipeId } from "./recipes.ts";

export type PrepStageId = "home" | "venue" | "turkey-out";

export const PREP_STAGES: {
  id: PrepStageId;
  label: string;
  note: string;
}[] = [
  {
    id: "home",
    label: "At home, the day before",
    note: "Cook, chill and pack what the venue oven cannot do.",
  },
  {
    id: "venue",
    label: "At the venue",
    note: "One oven. The turkey goes in first.",
  },
  {
    id: "turkey-out",
    label: "When the turkey comes out",
    note: "The oven goes to the sides while the bird rests.",
  },
];

export interface PrepTask {
  id: string;
  stage: PrepStageId;
  title: string;
  detail?: string;
  recipeId?: RecipeId;
  /** Temperature target shown as a chip. */
  temp?: string;
  /** Tasks that must be done before this one. */
  after?: string[];
  /** Marked optional in the source. */
  optional?: boolean;
}

export const PREP_TASKS: PrepTask[] = [
  {
    id: "home-brine",
    stage: "home",
    title: "Dry-brine the turkey if it hasn’t already been salted.",
    detail:
      "5 g fine salt per kg of bird weight, about 30–35 g. Refrigerate uncovered overnight on a rimmed tray on the bottom shelf. Skip it if the label says the turkey is already brined or injected with a salt solution.",
    recipeId: "turkey",
  },
  {
    id: "home-caldillo",
    stage: "home",
    title: "Cook the caldillo and chill it in shallow containers.",
    detail: "Reheat it at the venue and finish with hierbabuena.",
    recipeId: "caldillo",
  },
  {
    id: "home-stuffing",
    stage: "home",
    title: "Bake the stuffing, then chill it.",
    detail: "Reheat it when the turkey comes out.",
    recipeId: "stuffing",
    temp: "175°C",
  },
  {
    id: "home-mash",
    stage: "home",
    title: "Make the mash and chill it in the shallow tray.",
    recipeId: "mash",
  },
  {
    id: "home-bacalao",
    stage: "home",
    title: "Cook and flake the bacalao, then chill it separately.",
    recipeId: "ensalada",
  },
  {
    id: "home-potatoes",
    stage: "home",
    title: "Boil and dress the salad potatoes while still warm.",
    recipeId: "ensalada",
  },
  {
    id: "home-lettuce",
    stage: "home",
    title: "Wash and dry the lettuce.",
    recipeId: "green-salad",
  },
  {
    id: "home-dressing",
    stage: "home",
    title: "Make the membrillo dressing.",
    recipeId: "green-salad",
  },
  {
    id: "home-pistachios",
    stage: "home",
    title: "Toast and candy the pistachios.",
    recipeId: "green-salad",
  },
  {
    id: "home-gravy",
    stage: "home",
    title: "Make the gravy base ahead.",
    detail:
      "One less pan to deal with at the venue. Reheat it and whisk in a little skimmed pan juice.",
    recipeId: "gravy",
    optional: true,
  },
  {
    id: "venue-rub",
    stage: "venue",
    title: "Rub the turkey with manteca, orange zest and black pepper.",
    detail: "Skip extra salt if the bird was dry-brined or came pre-brined.",
    recipeId: "turkey",
  },
  {
    id: "venue-turkey-in",
    stage: "venue",
    title: "Put the turkey in first.",
    detail:
      "Breast-up and unstuffed, over the carrots, celery and quartered oranges. Budget 3–3½ hours, plus resting time.",
    recipeId: "turkey",
    temp: "165°C",
  },
  {
    id: "venue-chill",
    stage: "venue",
    title: "Keep the cooked sides and salad ingredients chilled until needed.",
  },
  {
    id: "venue-board",
    stage: "venue",
    title: "Set out the jamón, Manchego and picos as people arrive.",
  },
  {
    id: "venue-caldillo",
    stage: "venue",
    title: "Reheat the caldillo and finish it with hierbabuena.",
    detail:
      "Bring it back to a boil, then steep 2 sprigs briefly off the heat. Remove the sprigs and set out lemon wedges.",
    recipeId: "caldillo",
  },
  {
    id: "venue-ensalada",
    stage: "venue",
    title: "Assemble the ensalada malagueña and serve it with the soup.",
    detail:
      "Scatter oranges, bacalao, thin-sliced cebolleta and olives over the potatoes. Finish with the reserved juice, olive oil and parsley.",
    recipeId: "ensalada",
  },
  {
    id: "out-oven",
    stage: "turkey-out",
    title: "Give the oven to the two foil trays.",
    detail:
      "The center of both reheated sides must reach 74°C before the buffet opens.",
    after: ["home-stuffing", "home-mash"],
    temp: "74°C",
  },
  {
    id: "out-cover",
    stage: "turkey-out",
    title: "Keep the mash covered and uncover the stuffing near the end.",
  },
  {
    id: "out-greens",
    stage: "turkey-out",
    title: "Set out the greens and warm the gravy while the sides heat.",
    recipeId: "gravy",
  },
  {
    id: "out-carve",
    stage: "turkey-out",
    title:
      "Carve when both trays are close to ready, then open the buffet together.",
    detail:
      "Check 74°C in the thickest part of the breast and the innermost thigh and wing.",
    recipeId: "turkey",
    temp: "74°C",
  },
];

export const prepTaskById = (id: string) =>
  PREP_TASKS.find((task) => task.id === id);
