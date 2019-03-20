# hook-style

Style your React components with Hooks

```sh
npm install hook-style
```

```jsx
import { useStyle } from 'hook-style';
import React from 'react';
import ReactDOM from 'react-dom';

function Paragraph({ color, ...props }) {
  const cn = useStyle`
    padding: 1rem;
    background-color: yellow;
    color: ${color};
    font-size: 1.5rem;
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

[Play with this 👆️ on **Glitch** ✨](https://glitch.com/~hook-style-getting-started) or have a look at what gets rendered 👇

```html
<head>
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
</head>
<body>
  <div id="root">
    <div>
      <h1 class="gtXozB gqAIHm">I'm blue</h1>
      <h1 class="gtXozB eKigJM">I'm magenta</h1>
    </div>
  </div>
</body>
```

![Image of blue and magenta paragraphs with yellow backgrounds](https://raw.githubusercontent.com/colingourlay/hook-style/master/static/getting-started-output.svg)
