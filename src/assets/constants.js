export const styleSelect = {
  backgroundColor: "white",
  border: "thin solid black",
  borderRadius: "4px",
  display: "inline-block",
  font: "inherit",
  lineHeight: "1.5em",
  fontSize: '14px',
  padding: "0.5em 2em 0.5em 1em",


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
    calc(100% - 18px) calc(1em + 2px),
    calc(100% - 13px) calc(1em + 2px),
    calc(100% - .5em) .5em
  `,
  backgroundSize: `
    5px 5px,
    5px 5px,
    1.5em 1.5em
  `,
  backgroundRepeat: "no-repeat",

};
