declare var React;
declare var ReactDOM;
const { useEffect, useState } = React;
import { ThemeProvider, useStyle, useTheme } from '../../src/hook-style';

interface ButtonProps {
  primary?: boolean;
  children?: any[];
}

function Button({ primary, children }: ButtonProps) {
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
    transition: background-color .25s, color .25s;
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

  useEffect(() => {
    setTimeout(() => {
      setActiveIndex((activeIndex + 1) % 4);
    }, 500);
  }, [activeIndex]);

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
    transition: background-color .25s;
  `;

  return (
    <ThemeProvider theme={{ bg, fg }}>
      <div className={className}>
        <Button primary={activeIndex === 0}>First</Button>
        <Button primary={activeIndex === 1}>Second</Button>
        <Button primary={activeIndex === 2}>Third</Button>
        <Emoji visible={activeIndex === 3}>🎉</Emoji>
        <ul>
          <li>
            Foreground color: <input type="color" value={fg} onChange={e => setFg(e.target.value)} />
          </li>
          <li>
            Background color: <input type="color" value={bg} onChange={e => setBg(e.target.value)} />
          </li>
        </ul>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
