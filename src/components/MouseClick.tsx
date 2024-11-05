import { useEffect, useState } from 'react';

const MouseClickCounter = ({canvasState}: {canvasState: boolean}) => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleClick = () => {
      // Increment the click count by 1 on each mouse click
      setClickCount(prevCount => prevCount + 1);
    };

    // Add the click event listener to the window
    if (!canvasState){
        console.log("true")
        window.addEventListener('mousedown', handleClick);

        // Cleanup event listener on component unmount
        return () => {
        window.removeEventListener('mousedown', handleClick);
        };
    }
  }, []);

  return (
    <div>
      <h1>Mouse Click Counter</h1>
      <p>Number of times the mouse was clicked: {clickCount}</p>
    </div>
  );
};

export default MouseClickCounter;
