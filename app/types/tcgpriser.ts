import type { components, Expansion, ExpansionCard } from "tcgpriser";

export type CardGroup = {
  expansion: Expansion;
  cards: ExpansionCard[];
  packRates?: components["schemas"]["PackRateBucket"][]; // Optional property for pack rates
};