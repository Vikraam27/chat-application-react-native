export default {
  mainColor: '#1D1C25',
  secondaryColor: '#262337',
  inputColor: '#312B46',
  white: '#fff',
  black: '#000',
  gray: '#999999',
  blue: '#5D5FEE',
  light: '#F3F4FB',
  darkBlue: '#7978B5',
  red: 'red',
  green: '#A2D5AB',
};

export const RandomColor = () => {
  const hex = Math.floor(Math.random() * 0xFFFFFF);
  const color = `#${hex.toString(16)}`;

  return color;
};
