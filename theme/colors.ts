export const palette = {
  black: "#000000",
  white: "#ffffff",
  borderColor: "#F4F4F6",
  textColor: "#959DAD",
  activeTextColor: "#454F63",
  white25: "rgba(250,250,250,0.25)",
  white1: "#f7f7fa",
  offWhite: "#F1F3F5",
  greenDark: "#78A431",
  green: "#95C93E",
  greenLight: "#D2EEA5",
  tealDark: "#00796B",
  teal: "#26A69A",
  orangeDark: "#C46300",
  orange: "#F57C00",
  orangeLight: "#FABD7F",
  orangeLightSecondary: "#FCD7B2",
  red: "#E64A19",
  navyDark: "#112838",
  navyLight: "#DFDFE6",
  gray69: "#697177",
  grayDark: "#88939B",
  gray: "#B4B8BB",
  grayLight: "#F1F3F5",
  text: "#193A51",
  primary: "#FFF",
  primaryPink: "#F21466",
  ratingBackground: "#1b4b68",
}

export const colors = {
  palette,
  ceruleanBlue: "#254FD0",
  kleinBlue: "#0034bb",
  navyBlue: "#000090",
  catalinaBlue: "#082175",
  flushOrange: "#ff8000",
  trinidad: "#e75300",
  orange: "#F8A765",
  white: "#ffffff",
  blue1: "#78849E",
  moovBackground: "#404156",
  iron: "#e1e4e7",
  dustyGray: "#959595",
  rollingStone: "#7E8085",
  emperor: "#534e53",
  shark: "#2c2e30",
  black: "#000000",
  submarine: "#b8bfc6",
  rockBlue: "#99a7cc",
  regentGray: "#7c86a2",
  lynch: "#6b7897",
  catskillWhite: "#EFF6F8",
  geyser: "#D5E0E3",
  swansDown: "#dcedf1",
  ziggurat: "#AFD4DA",
  gothic: "#648e99",
  casal: "#2f6574",
  primary: "#FFF",
  monochromatic: "#454F63",
  purple: "#3a203b",
  gray: "#606060",
  fade: "#9BA0AA",

  /**
   * The screen background.
   */
  background: palette.primary,
  /**
   * The default color of text in many components.
   */
  text: palette.text,
  /**
   * The color for links.
   */
  link: palette.greenDark,
  /**
   * Secondary information.
   */
  dim: palette.grayLight,
  /**
   * Error messages and icons.
   */
  error: palette.red,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: "rgba(0, 0, 0, 0)"
}

export type ColorKeys = keyof typeof colors
