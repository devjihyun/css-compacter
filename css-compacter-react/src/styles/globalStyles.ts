import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.sans};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 280ms ease, color 280ms ease;
    transition-property: background-color, color;
    transition-timing-function: ease-in-out;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 500;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.base};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.accentHover};
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  textarea {
    font-size: 0.85rem;
  }
`;
