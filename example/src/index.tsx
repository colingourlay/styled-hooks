declare var React;
declare var ReactDOM;
const { useEffect, useState } = React;
import { ThemeProvider, injectGlobal, useStyle, useTheme, useThemedStyle } from '../../src/styled-hooks';
import { hsl2hex } from './color';

interface TitleProps {
  children?: any[];
}

function Title({ children }: TitleProps) {
  const className = useThemedStyle`
    margin: $space.3;
    padding: ${({ space }) => `${space[3]} ${space[0]}`};
    width: 10rem;
    background-color: $fg;
    color: $bg;

    @media (min-width: 32rem) {
      width: 15rem;
    }
  `;

  return <h1 className={className}>{children}</h1>;
}

interface ButtonProps {
  primary?: boolean;
  children?: any[];
}

function Button({ primary, children }: ButtonProps) {
  const { bg, fg, marginRem } = useTheme();
  const className = useStyle`
    display: inline-block;
    border-radius: 0.125rem;
    padding: 0.5rem 0;
    margin: ${marginRem}rem;
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

interface EmojiProps {
  visible?: boolean;
  children?: any[];
}

function Emoji({ visible, children }: EmojiProps) {
  const className = useStyle`
    opacity: ${visible ? 1 : 0};
    margin: 1rem;
    font-size: 5rem;
    transition: opacity .125s;
  `;

  return <div className={className}>{children}</div>;
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [theme, setTheme] = useState({
    bg: '#fff',
    fg: '#000',
    marginRem: 1, // for testing unit resolution
    space: ['0', '0.25rem', '0.5rem', '1rem', '2rem', '4rem', '8rem', '16rem', '32rem']
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

    setTheme(theme => ({
      ...theme,
      bg: hsl2hex(pageX / window.innerWidth, 0.25, 0.9),
      fg: hsl2hex(pageY / window.innerHeight, 0.5, 0.5)
    }));
  }

  useEffect(() => {
    setTimeout(() => {
      setActiveIndex((activeIndex + 1) % 4);
    }, 500);
  }, [activeIndex]);

  return (
    <ThemeProvider theme={theme}>
      <div className={className} onMouseMove={updateColors} onTouchMove={updateColors}>
        <Title>Styled Hooks</Title>
        <Button primary={activeIndex === 0}>First</Button>
        <Button primary={activeIndex === 1}>Second</Button>
        <Button primary={activeIndex === 2}>Third</Button>
        <Emoji visible={activeIndex === 3}>🎉</Emoji>
      </div>
    </ThemeProvider>
  );
}

injectGlobal`
  body {
    margin: 0;
  }
  button {
    font-size: 1rem;
  }
`;

ReactDOM.render(<App />, document.getElementById('app'));
