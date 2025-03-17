import { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

function App() {
  const [discs, setDiscs] = useState(3);
  const [tower, setTower] = useState([[], [], []]);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [showHelp, setShowHelp] = useState(true); // Show help on start
  const containerRef = useRef(null);

  const pegs = ['initial','auxilary','destination'];

  const initializeTowers = useCallback(() => {
    setTower([
      Array.from({ length: discs }, (_, i) => discs - i),
      [],
      [],
    ]);
    setScore(0);
    setWon(false);
  }, [discs]);

  const handleWon = () => {
    if (discs < 8) {
      setDiscs((prev) => prev + 1);
      toast.success("Keep it up, difficulty increased!!");
    } else {
      initializeTowers();
    }
    setWon(false);
  };

  useEffect(() => {
    initializeTowers();
  }, [discs]);

  const handleDrop = (event, info, movingDisc, fromTower, resetPosition) => {
    if (!containerRef.current) return;

    const dropX = info.point.x;
    const containerRect = containerRef.current.getBoundingClientRect();
    const sectionWidth = containerRect.width / 3;
    let toTower = Math.floor((dropX - containerRect.left) / sectionWidth);

    if (toTower < 0 || toTower > 2 || toTower === fromTower) {
      resetPosition();
      return;
    }

    const newTowers = tower.map((t) => [...t]);

    if (
      newTowers[toTower].length === 0 ||
      newTowers[toTower][newTowers[toTower].length - 1] > movingDisc
    ) {
      newTowers[fromTower].pop();
      newTowers[toTower].push(movingDisc);
      setTower(newTowers);
      setScore((s) => s + 1);

      if (
        newTowers[2].length === discs &&
        JSON.stringify(newTowers[2]) ===
          JSON.stringify([...Array(discs)].map((_, i) => i + 1).reverse())
      ) {
        setWon(true);
      }
    } else {
      toast.error("Invalid move! Larger discs cannot be placed on smaller ones.");
      resetPosition();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-neutral-900 w-full h-screen text-white relative">
      {won && <Confetti numberOfPieces={300} />}
      <h1 className="absolute top-5 text-4xl font-mono font-bold">Tower of Hanoi</h1>
      <Toaster />

      <div className= "relative bg-white/10 rounded-xl w-4/5 h-4/5 flex flex-col justify-center items-center shadow-lg">
      <button
        className="absolute top-4 right-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
        onClick={() => setShowHelp(true)}
      >
        Help
      </button>
        <div ref={containerRef} className="flex justify-around mt-6">
          {tower.map((stack, i) => (
            <div key={i} className="flex flex-col ml-1 items-center">
              <div className="w-4 h-44 absolute bg-black"></div>
              <div className="flex relative gap-y-0.5 w-full h-44 flex-col-reverse items-center">
                {stack.map((size, index) => {
                  const isTopDisc = index === stack.length - 1;
                  return (
                    <motion.div
                      key={index}
                      drag={isTopDisc}
                      dragConstraints={containerRef}
                      onDragEnd={(event, info) => {
                        if (!isTopDisc) return;
                        handleDrop(event, info, size, i, () => {
                          setTower((t) => [...t]);
                        });
                      }}
                      className={`h-3 z-10 border border-gray-900/30 rounded-full ${
                        isTopDisc ? "bg-blue-500 cursor-grab" : "bg-gray-500"
                      }`}
                      style={{ width: `${size * 24}px` }}
                    ></motion.div>
                  );
                })}
              </div>

              <div
                className=" bg-gray-300 text-center text-gray-800 rounded-lg "
                style={{
                  width: `${(discs * 25) > 102 ? discs * 25 : 122}px`,
                }}
              >{pegs[i]} peg </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-lg">Moves: {score}</p>

        <div className="flex gap-4 p-4">
          <input
            type="number"
            className="w-12 bg-transparent border border-gray-400 rounded text-center text-white"
            value={discs}
            min={3}
            max={8}
            onChange={(e) => {
              const newDiscs = Math.max(3, Math.min(8, +e.target.value));
              setDiscs(newDiscs);
            }}
          />
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded"
            onClick={initializeTowers}
          >
            Restart
          </button>
        </div>
      </div>

      {/* Help Popup */}
      {showHelp && <HelpPopup onClose={() => setShowHelp(false)} />}

      {won && (
        <div className="absolute w-full top-0 left-0 flex justify-center items-center h-screen  bg-black/50">
          <div className="flex flex-col text-pretty text-center justify-center items-center w-3/5 z-20 h-2/5 rounded-2xl bg-gray-700/80 text-2xl font-bold p-6 text-white shadow-xl">
            <p>Congratulations! You solved it in {score} moves.</p>
            <p className="text-base py-5">
              Minimum moves required for {discs} discs are {(Math.pow(2,discs))-1}
            </p>
            <button
              onClick={handleWon}
              className=" px-4 py-2 bg-green-500 hover:bg-green-600 transition mt-8 text-white rounded"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      <div className="bottom-0 absolute text-sm text-gray-400">hashnj</div>
    </div>
  );
}

const HelpPopup = ({ onClose }) => {
  return (
    <div className="absolute top-0 left-0 flex justify-center items-center h-screen w-screen bg-black/50" onClick={onClose}>
      <div className="p-12 rounded-2xl z-20 md:w-3/5 w-4/5 no-scroll font-mono bg-gray-800 h-4/5 overflow-y-scroll text-white shadow-lg text-lg relative cursor-default" onClick={(e)=>e.stopPropagation()}>
        <h1 className="text-5xl pb-6 underline text-center">Info</h1>
        <p>Before getting started, let’s talk about what the Tower of Hanoi problem is:</p>
        <p>
        The Tower of Hanoi is a classic mathematical puzzle that involves moving a stack of discs from one rod to another while following specific rules. It was invented by the French mathematician Édouard Lucas in 1883.
        </p>
        <h3 className="text-xl py-2 font-bold underline underline-offset-4">The Setup:</h3>
        <ul className="list-disc">
          <li>The puzzle consists of three rods (pegs) and N discs of different sizes. </li>
          <li>All discs start stacked in descending order (largest at the bottom, smallest at the top) on the first rod (source).</li>
          <li>The goal is to move the entire stack to the third rod (destination), using the second rod (auxiliary) as needed.</li>
        </ul>
        <ul className="list-disc ">
          <h2 className="text-xl py-1 font-bold underline">Rules:</h2>
          <li>Only one disk can be moved at a time.</li>
          <li>A disk can only be moved if it is the uppermost disk on a stack.</li>
          <li>No larger disk may be placed on top of a smaller disk.</li>
        </ul>

        <div className=" flex flex-col justify-center items-center border rounded-lg text-pretty p-4">
        Mathematically, the recursive function to solve this puzzle is: <br />
        <code className="bg-gray-500 mx-auto my-2 p-4 py-2 rounded-lg text-center text-xl">T(n)=2T(n−1)+1</code>
        <span className="text-sm block">where T(n) is the number of moves required for N discs.
        </span>
        </div>

        <p className="mt-4">Levels range from 3-8 disks. <br />**The 8th level takes 255 steps at minimum!**</p>
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>
          ✖
        </button>

      </div>
      
    </div>
  );
};

HelpPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default App;
