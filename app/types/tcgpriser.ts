import type { components, Expansion, ExpansionCard, PackSlot } from "tcgpriser";

export type CardGroup = {
  expansion: Expansion;
  cards: ExpansionCard[];
  packRates?: components["schemas"]["PackRateBucket"][]; // Optional property for pack rates
  // The real top-to-bottom slot order of a physical pack ("card trick" order). Absent when no
  // known order has been recorded for this expansion yet.
  packSlotOrder?: PackSlot[];
  packImageUrl?: string;
};