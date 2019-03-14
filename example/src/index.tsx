declare var React;
declare var ReactDOM;
const { useEffect, useState } = React;
import { useStyle } from '../../src/hook-style';

interface ButtonProps {
  primary?: boolean;
  children?: any[];
  [propName: string]: any;
}

function Button({ primary, children, ...otherProps }: ButtonProps) {
  const className = useStyle`
    display: inline-block;
    border-radius: 0.125rem;
    padding: 0.5rem 0;
    margin: 1rem;
    width: 10rem;
    background-color: ${primary ? 'white' : 'transparent'};
    color: ${primary ? 'black' : 'white'};
    border: 0.125rem solid white;
    transition: background-color .25s, color .25s;
  `;

  return (
    <button className={className} {...otherProps}>
      {children}
    </button>
  );
}

interface EmojiProps {
  visible?: boolean;
  children?: any[];
  [propName: string]: any;
}

function Emoji({ visible, children, ...otherProps }: EmojiProps) {
  const className = useStyle`
    opacity: ${visible ? 1 : 0};
    margin: 1rem;
    font-size: 5rem;
    transition: opacity .125s;
  `;

  return (
    <div className={className} {...otherProps}>
      {children}
    </div>
  );
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

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setTimeout(
      () => {
        setActiveIndex((activeIndex + 1) % 4);
      },
      activeIndex === 3 ? 2000 : 500
    );
  }, [activeIndex]);

  return (
    <div className={className}>
      <Button primary={activeIndex === 0}>First</Button>
      <Button primary={activeIndex === 1}>Second</Button>
      <Button primary={activeIndex === 2}>Third</Button>
      <Emoji visible={activeIndex === 3}>🎉</Emoji>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
