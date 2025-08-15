export const colors = {
  primary: '#5B57C7',
  text: '#242424',
  textMuted: '#424242',
  surface: '#fff',
  surfaceAlt: '#F1F4FC',
  border: '#E0E0E0',
  accent: '#5B63E6',
};

export const spacing = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
};

export const typography = {
  // Headings
  h6: { fontSize: 20 as const, fontWeight: '500' as const, color: colors.text },
  headingSm: { fontSize: 16 as const, fontWeight: '600' as const, color: colors.textMuted },

  // Titles / Subtitles
  title: { fontSize: 16 as const, fontWeight: '400' as const, color: colors.text },
  titleStrong: { fontSize: 16 as const, fontWeight: '500' as const, color: colors.text },
  subtitle: { fontSize: 14 as const, fontWeight: '400' as const, color: colors.textMuted },

  // Body
  body: { fontSize: 14 as const, fontWeight: '400' as const, color: colors.text },
  bodyMuted: { fontSize: 14 as const, fontWeight: '400' as const, color: '#616161' as const },

  // Button / Link (color may be overridden at use site)
  button: { fontSize: 14 as const, fontWeight: '500' as const, color: colors.text },
  link: { fontSize: 14 as const, fontWeight: '500' as const, color: colors.primary },
};
