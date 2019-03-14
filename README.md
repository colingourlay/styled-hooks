# hook-style

Style and theme your React components with Hooks

```sh
$ npm i hook-style
```

**Note**: This is nowhere near production-ready, or as flexible/powerful as existing CSS-in-JS libraries. I'm just scratching an itch for now. If I make this more useful, I'll shout about it.

## Usage

```jsx
import React from 'react';
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
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');

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

  return (
    <ThemeProvider theme={{ bg, fg }}>
      <div className={className}>
        <Button primary>Primary</Button>
        <Button>Standard</Button>
        <ul>
          <li>
            Foreground color:
            <input type="color" value={fg} onChange={e => setFg(e.target.value)} />
          </li>
          <li>
            Background color:
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} />
          </li>
        </ul>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## Authors

- Colin Gourlay ([colin@colin-gourlay.com](mailto:colin@colin-gourlay.com))
