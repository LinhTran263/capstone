import { useEffect, useState } from 'react';

const KeyPressCounter: React.FC = () => {
  const [keyPressCount, setKeyPressCount] = useState(0);

  useEffect(() => {
    const handleKeyPress = () => {
      // Increment the key press count by 1 on each key press
      setKeyPressCount(prevCount => prevCount + 1);
    };

    // Add the keydown event listener to the window
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div>
      <h1>Keyboard Press Counter</h1>
      <p>Number of times a key was pressed: {keyPressCount}</p>
    </div>
  );
};

export default KeyPressCounter;
