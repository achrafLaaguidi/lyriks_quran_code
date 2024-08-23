export const styleSelect = {
  backgroundColor: "white",
  border: "thin solid black",
  borderRadius: "4px",
  display: "inline-block",
  font: "inherit",
  lineHeight: "1.5em",
  padding: "0.5em 1.5em 0.5em 1em",

  /* reset */
  margin: "0",
  boxSizing: "border-box",
  WebkitAppearance: "none",
  MozAppearance: "none",

  backgroundImage: `
    linear-gradient(45deg, transparent 50%, gray 50%),
    linear-gradient(135deg, gray 50%, transparent 50%),
    radial-gradient(#ddd 70%, transparent 72%)
  `,
  backgroundPosition: `
    calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px),
    calc(100% - .5em) .5em
  `,
  backgroundSize: `
    5px 5px,
    5px 5px,
    1.5em 1.5em
  `,
  backgroundRepeat: "no-repeat",

  "&:focus": {
    borderColor: "green",
    outline: "0",
    backgroundImage: `
      linear-gradient(45deg, white 50%, transparent 50%),
      linear-gradient(135deg, transparent 50%, white 50%),
      radial-gradient(gray 70%, transparent 72%)
    `,
    backgroundPosition: `
      calc(100% - 15px) 1em,
      calc(100% - 20px) 1em,
      calc(100% - .5em) .5em
    `,
    backgroundSize: `
      5px 5px,
      5px 5px,
      1.5em 1.5em
    `,
    backgroundRepeat: "no-repeat",
  },

  /* Apply special focus style for Firefox */
  "@media all and (MozFocusring)": {
    color: "transparent",
    textShadow: "0 0 0 #000",
  },
};
