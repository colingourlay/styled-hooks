declare var React;
declare var ReactDOM;
const { useEffect, useState } = React;
import { ThemeProvider, useStyle, useTheme, useVariableStyle } from '../../src/hook-style';
import { hsl2hex } from './color';

interface ButtonProps {
  primary?: boolean;
  children?: any[];
}

function Button({ primary, children }: ButtonProps) {
  const { bg, fg, marginRem } = useTheme();
  const [className, customProps] = useVariableStyle`
    display: inline-block;
    border-radius: 0.125rem;
    padding: 0.5rem 0;
    margin: ${marginRem}rem;
    width: 10rem;
    background-color: ${primary ? fg : 'transparent'};
    color: ${primary ? bg : fg};
    border: 0.125rem solid ${fg};
  `;

  return (
    <button className={className} style={customProps}>
      {children}
    </button>
  );
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
    bg: '#ffffff',
    fg: '#000000',
    marginRem: 1
  });

  const [className, customProps] = useVariableStyle`
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
      <div className={className} style={customProps} onMouseMove={updateColors} onTouchMove={updateColors}>
        <Button primary={activeIndex === 0}>First</Button>
        <Button primary={activeIndex === 1}>Second</Button>
        <Button primary={activeIndex === 2}>Third</Button>
        <Emoji visible={activeIndex === 3}>🎉</Emoji>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
