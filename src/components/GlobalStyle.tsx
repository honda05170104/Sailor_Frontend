import { createGlobalStyle } from 'styled-components'

import { colors, designSystem } from '../styles/designSystem'

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;

    /* Neutrals */
    --color-black: ${colors.black};
    --color-black-deep: ${colors.blackDeep};
    --color-white: ${colors.white};
    --color-muted: ${colors.muted};
    --color-glass: ${colors.glass};
    --color-glass-strong: ${colors.glassStrong};
    --color-glass-border: ${colors.glassBorder};

    /* Brand */
    --color-primary: ${colors.primary};
    --color-primary-soft: ${colors.primarySoft};
    --color-primary-strong: ${colors.primaryStrong};
    --color-accent: ${colors.accent};
    --color-accent-soft: ${colors.accentSoft};
    --color-secondary: ${colors.secondary};
    --color-secondary-soft: ${colors.secondarySoft};

    /* Status */
    --color-success: ${colors.success};
    --color-danger: ${colors.danger};
    --color-warning: ${colors.warning};

    /* Legacy aliases */
    --ink: var(--color-white);
    --muted: var(--color-muted);
    --font-display: ${designSystem.fonts.display};
    --font-body: ${designSystem.fonts.body};

    color: var(--ink);
    background: var(--color-black-deep);
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
    background: var(--color-black);
  }

  #root {
    min-height: 100svh;
    background: var(--color-black);
  }

  button,
  a {
    font: inherit;
  }
`
