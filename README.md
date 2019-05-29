<h1><div align="center"><img title="Styled Hooks" alt="Styled Hooks" src="https://raw.githubusercontent.com/colingourlay/styled-hooks/master/static/logo.svg?sanitize=true" /></div></h1>
<p align="center">Style your React components with Hooks</p>
<p align="center">
  <a href="https://www.npmjs.com/package/styled-hooks"><img alt="NPM latest published version" src="https://img.shields.io/npm/v/styled-hooks.svg?style=flat-square&color=f0f"></a> <img alt="Formats: CommonJS, ECMAScript Modules" src="https://img.shields.io/badge/formats-cjs%2C%20esm-f0f.svg?style=flat-square">
</p>

## Table of contents

- [Getting started](#getting-started)
- [API](#api)
  - Hooks
    - [`useStyle`](#usestyle)
    - [`useTheme`](#usetheme)
    - [`useThemedStyle`](#usethemedstyle)
  - Components
    - [`ThemeProvider`](#themeprovider)
  - Utilities
    - [`injectGlobal`](#injectglobal)
- [About the project](#about-the-project)

## Getting started

```sh
npm install styled-hooks
```

```jsx
import { useStyle } from 'styled-hooks';
import React from 'react';
import ReactDOM from 'react-dom';

function Paragraph({ color, ...props }) {
  const cn = useStyle`
    padding: 1rem;
    background-color: yellow;
    color: ${color};
  `;

  return <p className={cn} {...props} />;
}

ReactDOM.render(
  <div>
    <Paragraph color="magenta">I'm magenta</Paragraph>
    <Paragraph color="blue">I'm blue</Paragraph>
  </div>,
  document.getElementById('root')
);
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksgettingstarted-2bmjr"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-getting-started"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

The rendered page will look like this:

```html
<!-- In <head /> -->
<style>
  .gtXozB {
    padding: 1rem;
    background-color: yellow;
    color: var(--gtXozB-0);
  }
</style>
<style>
  .gqAIHm {
    --gtXozB-0: blue;
  }
</style>
<style>
  .eKigJM {
    --gtxozb-0: magenta;
  }
</style>

<!-- In <div id="root" /> -->
<div>
  <p class="gtXozB gqAIHm">I'm blue</p>
  <p class="gtXozB eKigJM">I'm magenta</p>
</div>
```

![Image of blue and magenta paragraphs with yellow backgrounds](https://raw.githubusercontent.com/colingourlay/styled-hooks/master/static/getting-started-output.svg?sanitize=true)

<details>
  <summary>“Wait. Those are <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/--*">CSS Custom Properties</a>. I thought they didn't work everywhere?”</summary><br>
  
Don't worry! Styled Hooks will render the following in browsers that aren't up to scratch:

```html
<!-- In <head /> -->
<style>
  .efNhRD {
    padding: 1rem;
    background-color: yellow;
    color: blue;
  }
</style>
<style>
  .kGJulO {
    padding: 1rem;
    background-color: yellow;
    color: magenta;
  }
</style>

<!-- In <div id="root" /> -->
<div>
  <p class="efNhRD">I'm blue</p>
  <p class="kGJulO">I'm magenta</p>
</div>
```

The amount of CSS generated is larger, but it acheives the same effect.

Note: You can still interpolate large portions of your CSS as strings—Custom Properties only come into effect when you attempt to interpolate CSS property _values_.

</details>

## API

### `useStyle`

The `useStyle` hook is a [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that expects CSS & dynamic values, and returns a `className` you can use in your component.

The hook will memoise the CSS each unique style variant, and inject it into your document's `<head>`, taking advantage of CSS Custom Properties (if your browser suports them) to reduce style replication.

Style injection happens during the browser's layout phase, so your components will always be painted fully-styled.

Thanks to [`stylis`](https://github.com/thysultan/stylis.js), you can use some basic nesting and media queries:

```jsx
import { useStyle } from 'styled-hooks';
import React from 'react';
import ReactDOM from 'react-dom';

function Button({ primary, ...props }) {
  const cn = useStyle`
    display: inline-block;
    padding: 0.5rem 0;
    width: 10rem;
    background-color: ${primary ? 'magenta' : 'yellow'};
    color: ${primary ? 'yellow' : 'magenta'};
    border: 0.125rem solid ${'magenta'};

    @media (min-width: 32rem) {
      padding: 0.75rem 0;
      width: 15rem;
      font-size: 1.5rem;
    }

    &:focus {
      color: #000;
      border-color: #000;
    }
  `;

  return <button className={cn} {...props} />;
}

ReactDOM.render(
  <div>
    <Button>Standard</Button>
    <Button primary>Primary</Button>
  </div>,
  document.getElementById('root')
);
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksapiusestyle-ujfzj"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usestyle"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

---

### `useTheme`

The `useTheme` hook allows you to read the theme context from the nearest `<ThemeProvider />` ancestor:

```jsx
import { useStyle, useTheme, ThemeProvider } from 'styled-hooks';
import React from 'react';
import ReactDOM from 'react-dom';

function Paragraph({ ...props }) {
  const { fg, bg } = useTheme();

  const cn = useStyle`
    padding: 1rem;
    background-color: ${bg};
    color: ${fg};
  `;

  return <p className={cn} {...props} />;
}

ReactDOM.render(
  <ThemeProvider theme={{ fg: 'magenta', bg: 'yellow' }}>
    <Paragraph>I'm magenta on yellow</Paragraph>
  </ThemeProvider>,
  document.getElementById('root')
);
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksapiusetheme1-uett8"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usetheme-1"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

Combine this with React's `useState` hook, and you'll be able to modify the theme on the fly:

```jsx
import { useStyle, useTheme, ThemeProvider } from 'styled-hooks';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Button({ primary, ...props }) {
  const { fg, bg } = useTheme();

  const cn = useStyle`
    padding: 0.5rem;
    background-color: ${primary ? fg : bg};
    color: ${primary ? bg : fg};
    border: 0.125rem solid ${fg};
  `;

  return <button className={cn} {...props} />;
}

function App() {
  const [theme, setTheme] = useState({
    fg: 'magenta',
    bg: 'yellow'
  });

  const invertTheme = () =>
    setTheme({
      bg: theme.fg,
      fg: theme.bg
    });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Button onClick={invertTheme}>Invert Theme</Button>
        <Button onClick={invertTheme} primary>
          Invert Theme
        </Button>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksapiusetheme2-pk1s9"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usetheme-2"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

---

### `useThemedStyle`

In the examples above, creating a themed component requires you to use two hooks: `useTheme` & `useStyle`.

The `useThemedStyle` hook—which uses a syntax familiar to anyone who's used SASS—mixes both of those ingredients into a tasty cocktail:

```js
import { useThemedStyle } from 'styled-hooks';

function Paragraph({ ...props }) {
  const cn = useThemedStyle`
    padding: 1rem;
    background-color: #{bg};
    color: #{fg};
  `;

  return <p className={cn} {...props} />;
}
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksapiusethemedstyle1-dcwmb"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usethemedstyle-1"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

To access a property of the theme you're providing, just place it between `#{` and `}` braces. The usual template string interpolation still works, so you're still able to create styles based on your component props.

The interpolation syntax allows you to access nested properties too. Imagine your theme looked like this:

```js
{
  colors: {
    fg: 'magenta',
    bg: 'yellow'
  },
  space: [
    '0', '0.25rem', '0.5rem', '1rem', '2rem', '4rem', '8rem', '16rem', '32rem'
  ]
}
```

You're able to access it like this:

```js
function Paragraph({ ...props }) {
  const cn = useThemedStyle`
    padding: #{space.3};
    background-color: #{colors.bg};
    color: #{colors.fg};

    @media (min-width: 480px) {
      padding: #{space.4};
    }
  `;

  return <p className={cn} {...props} />;
}
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksapiusethemedstyle2-30yyj"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usethemedstyle-2"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

If you need to output different theme values based on your props, interpolate a function and it'll receive your theme as an argument:

```js
function Paragraph({ isInverted, ...props }) {
  const cn = useThemedStyle`
    padding: 1rem;
    background-color: ${({ fg, bg }) => (isInverted ? fg : bg)};
    color: ${({ fg, bg }) => (isInverted ? bg : fg)};
  `;

  return <p className={cn} {...props} />;
}
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksapiusethemedstyle3-rwujq"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-usethemedstyle-3"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

---

### ThemeProvider

This component allows you to provide theme context that can be accessed by [`useTheme`](#usetheme) and [`useThemedStyle`](#usethemedstyle) hooks anywhere in your app. Have a look at their respective examples above for basic usage.

`ThemeProvider`s have a single property, `theme` which can be set to either object or a merge function (explained further below).

```jsx
import { ThemeProvider } from 'styled-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const theme = {
  fg: 'magenta',
  bg: 'yellow'
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
```

#### Nesting `ThemeProvider` components

When you nest `ThemeProvider` components, the child theme will be merged with its parent. You can either provide an object in order to add or replace theme properties, or a function to transform the parent theme entirely.

Here's the `App.js` component that is imported into the previous example:

```jsx
import { ThemeProvider, useThemedStyle } from 'styled-hooks';
import React from 'react';

function Paragraph({ ...props }) {
  const cn = useThemedStyle`
    padding: 1rem;
    background-color: #{bg};
    color: #{fg};
  `;

  return <p className={cn} {...props} />;
}

export default function App() {
  return (
    <div>
      <Paragraph>I'm magenta on yellow</Paragraph>
      <ThemeProvider theme={{ fg: 'blue' }}>
        <Paragraph>I'm blue on yellow</Paragraph>
      </ThemeProvider>
      <ThemeProvider theme={theme => ({ ...theme, bg: 'cyan' })}>
        <Paragraph>I'm magenta on cyan</Paragraph>
      </ThemeProvider>
    </div>
  );
}
```

<p style="text-align: right">
  <a href="https://codesandbox.io/s/styledhooksapithemeprovider-gblgy"><img alt="Edit the previous code example on CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg" height="33"></a> <a href="https://glitch.com/edit/#!/remix/styled-hooks-api-themeprovider"><img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="Remix the previous code example on Glitch" height="33"></a>
</p>

---

### `injectGlobal`

This works as you'd expect it to:

```js
injectGlobal`
  body {
    margin: 0;
  }
`;
```

...will add the CSS you write to the document. You can use any interpolated values you want, but unlike hooks they won't ever become CSS Custom Properties.

## About the project

- Styled Hooks is currently maintained by [Colin Gourlay](https://colin-gourlay.com)
- It is currently licensed under [The Unlicense](LICENSE)
- If you'd like to help out, please submit ideas & bugs to the project's [issue tracker](https://github.com/colingourlay/styled-hooks/issues)
- To contribute code and documentation, please see the [contribution guide](CONTRIBUTING.md)
- All contributions and project activity are subject to the project's [code of conduct](CODE_OF_CONDUCT.md)

### Credits

Dependencies:

- [stylis](https://stylis.js.org/) - The CSS parser providing auto-prefixing and SASS-like nesting

Inspiration:

- [CSS Modules](https://github.com/css-modules/css-modules)
- [styled-components](https://www.styled-components.com/)
- [styled-system](https://styled-system.com/)

Thanks:

- [Glen Maddern](https://glenmaddern.com/), for giving this project a name
