
import  { useState } from "react";

const useVisualMode = (initial) => {
 // const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 

   const transition = (newMode,replace = false) => {
    // setHistory(prev=>[...prev, newMode])
    setHistory(prev => (replace ? [...prev.slice(0, prev.length - 1), newMode] : [...prev, newMode]));
  };
   
   const back = () => {
    setHistory(prev => {
      if (prev.length === 1) {
        return prev;
      } else {
        return prev.slice(0, prev.length - 1);
      }
    });
  };

  return { mode:history[history.length -1], transition, back};
};

export default useVisualMode;
