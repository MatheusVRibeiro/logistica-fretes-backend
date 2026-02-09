export const generateId = (prefix?: string): string => {
  const rand = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  const base = `${Date.now()}${rand}`;
  return prefix ? `${prefix}-${base}` : base;
};
