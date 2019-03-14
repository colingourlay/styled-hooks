# hook-style

Style your React components with tagged template literal Hooks

```sh
$ npm i hook-style
```

**Note**: This is nowhere near production-ready, or as flexible/powerful as existing CSS-in-JS libraries. I'm just scratching an itch for now. If I make this more useful, I'll shout about it.

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { useStyle } from 'hook-style';

function Button({ primary, children ...otherProps }) {
  const className = useStyle`
    display: inline-block;
    border-radius: 0.125rem;
    padding: 0.5rem 0;
    margin: 1rem;
    width: 10rem;
    background-color: ${primary ? 'white' : 'transparent'};
    color: ${primary ? 'black' : 'white'};
    border: 0.125rem solid white;
  `;

  return <button className={className} {...otherProps}>{children}</button>;
}

function App() {
   const className = useStyle`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: black;
    box-sizing: border-box;
    min-height: 100vh;
  `;

  return <div className={className}>
    <Button primary>Primary</Button>
    <Button>Standard</Button>
  </div>
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## Authors

- Colin Gourlay ([colin@colin-gourlay.com](mailto:colin@colin-gourlay.com))
