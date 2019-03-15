# hook-style

Style and theme your React components with Hooks

```sh
$ npm i hook-style
```

**Note**: This is nowhere near production-ready, or as flexible/powerful as existing CSS-in-JS libraries. I'm just scratching an itch for now. If I make this more useful, I'll shout about it.

## Usage

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, useStyle, useTheme } from 'hook-style';

function App() {
  const [theme, setTheme] = useState({
    bg: '#ffffff',
    fg: '#000000',
    marginRem: 1
  });

  const className = useStyle`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: ${theme.bg};
    box-sizing: border-box;
    min-height: 100vh;
  `;

  function updateColors(e) {
    const { pageX, pageY } = e.touches ? e.touches[0] : e;

    setTheme({
      bg: hsl2hex(pageX / window.innerWidth, 0.25, 0.9),
      fg: hsl2hex(pageY / window.innerHeight, 0.5, 0.5)
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={className} onMouseMove={updateColors} onTouchMove={updateColors}>
        <Button primary>Primary</Button>
        <Button>Standard</Button>
      </div>
    </ThemeProvider>
  );
}

function Button({ primary, children }) {
  const { bg, fg } = useTheme();

  const className = useStyle`
    display: inline-block;
    border-radius: 0.125rem;
    padding: 0.5rem 0;
    margin: 1rem;
    width: 10rem;
    background-color: ${primary ? fg : 'transparent'};
    color: ${primary ? bg : fg};
    border: 0.125rem solid ${fg};

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

  return <button className={className}>{children}</button>;
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## Authors

- Colin Gourlay ([colin@colin-gourlay.com](mailto:colin@colin-gourlay.com))
