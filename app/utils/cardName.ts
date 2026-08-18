// The API prefixes every card's `name` with its expansion's full name (e.g. "Scarlet & Violet
// Prismatic Evolutions Sylveon ex"). The expansion name is already shown in the surrounding page,
// so repeating it on every single tile just pushes the part a reader actually wants off-screen.
export function displayCardName(cardName: string, expansionName: string | undefined): string {
  if (!expansionName) return cardName;
  const prefix = `${expansionName} `;
  return cardName.startsWith(prefix) ? cardName.slice(prefix.length) : cardName;
}
