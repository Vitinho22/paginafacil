type BannerState = {
  layoutId: number;
  accentColor: string;
  variant: number;
  [key: string]: unknown;
};

export function generateLayoutVariations(
  baseBanner: BannerState
): BannerState[] {
  const colors = [
    "#667eea",
    "#764ba2",
    "#f93b1d",
    "#00b8a9",
    "#fb5607",
    "#ff006e",
  ];

  const variations: BannerState[] = [];

  // Gerar 5 variações com layouts e cores diferentes
  for (let i = 0; i < 5; i++) {
    variations.push({
      ...baseBanner,
      layoutId: i % 6,
      accentColor: colors[i],
      variant: i,
    });
  }

  return variations;
}

export function optimizeTextForLayout(
  text: string,
  layoutId: number
): string {
  const maxLengths: Record<number, number> = {
    0: 50,
    1: 40,
    2: 35,
    3: 45,
    4: 45,
    5: 50,
  };

  const maxLength = maxLengths[layoutId] || 50;
  return text.slice(0, maxLength);
}

export function getLayoutDimensions(layoutId: number) {
  const dimensions: Record<number, { titleSize: number; subtitleSize: number }> = {
    0: { titleSize: 72, subtitleSize: 28 },
    1: { titleSize: 60, subtitleSize: 20 },
    2: { titleSize: 48, subtitleSize: 20 },
    3: { titleSize: 56, subtitleSize: 20 },
    4: { titleSize: 56, subtitleSize: 20 },
    5: { titleSize: 72, subtitleSize: 28 },
  };

  return dimensions[layoutId] || { titleSize: 56, subtitleSize: 20 };
}
