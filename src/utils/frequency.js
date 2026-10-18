

export const toFreq = (percent) => {
  const min = Math.log10(20);
  const max = Math.log10(20000);
  const val = min + (percent / 100) * (max - min);
  return Math.round(Math.pow(10, val));
};

export const toPercent = (freq) => {
  const min = Math.log10(20);
  const max = Math.log10(20000);
  return ((Math.log10(freq) - min) / (max - min)) * 100;
};
