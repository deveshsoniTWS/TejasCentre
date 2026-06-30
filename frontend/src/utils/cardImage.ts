export const getCardImage = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/200`;

export const resolveCardImage = (image: string | null | undefined, seed: string) =>
  image?.trim() || getCardImage(seed);
