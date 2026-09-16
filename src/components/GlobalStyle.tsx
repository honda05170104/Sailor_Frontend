import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
    --ink: #ffffff;
    --muted: #8e8e93;
    --font-display: 'Syne', sans-serif;
    --font-body: 'Figtree', sans-serif;
    color: var(--ink);
    background: #000000;
    font: 16px/1.5 var(--font-body);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    background: #000000;
  }

  #root {
    min-height: 100svh;
    background: #000000;
  }

  button,
  a {
    font: inherit;
  }
`
