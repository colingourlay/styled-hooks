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
  `;

  return <button className={className}>{children}</button>;
}

function App() {
  const [fg, setFG] = useState('#000000');
  const [bg, setBG] = useState('#ffffff');

  const className = useStyle`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: ${bg};
    box-sizing: border-box;
    min-height: 100vh;
  `;

  function updateTheme(e) {
    const { pageX, pageY } = e.touches ? e.touches[0] : e;

    setFG(hsl2hex(pageX / window.innerWidth, 0.5, 0.5));
    setBG(hsl2hex(pageY / window.innerHeight, 0.25, 0.9));
  }

  return (
    <ThemeProvider theme={{ bg, fg }}>
      <div className={className} onMouseMove={updateTheme} onTouchMove={updateTheme}>
        <Button primary>Primary</Button>
        <Button>Standard</Button>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## Authors

- Colin Gourlay ([colin@colin-gourlay.com](mailto:colin@colin-gourlay.com))
