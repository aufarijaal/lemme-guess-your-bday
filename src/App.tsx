import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  PanInfo,
  Variants,
  animate,
  motion,
} from "framer-motion";
import * as birthday from "./cards";
import tailwindColors from "tailwindcss/colors";

function Counter({ from, to }: { from: number; to: number }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const controls = animate(from, to, {
      duration: 0.5,
      onUpdate(value) {
        ref.current!.textContent = value.toFixed(0);
      },
    });
    return () => controls.stop();
  }, [from, to]);

  return <p ref={ref} />;
}

function App() {
  const cardContainer: Variants = {
    hidden: { scale: 0, rotate: 45, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        type: "spring",
      },
    },
  };

  const cardItem: Variants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const [activeCard, setActiveCard] = useState(1);
  const [answers, setAnswers] = useState([true, true, true, true, true]);
  const [mainBg, setMainBg] = useState<string>(tailwindColors.indigo["500"]);
  const [activeSection, setActiveSection] = useState<
    "landing" | "guessing" | "result"
  >("landing");
  const [guessedNumber, setGuessedNumber] = useState(0);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 0 && activeCard !== 1) {
      setActiveCard((prev) => prev - 1);
    } else if (info.offset.x < 0 && activeCard !== 5) {
      setActiveCard((prev) => prev + 1);
    }
  };

  function handleKey(e: KeyboardEvent) {
    if (e.key === "y" || e.key === "n") {
      setAnswers((prev) =>
        prev.map((answer, i) =>
          i + 1 === activeCard ? (e.key === "y" ? true : false) : answer
        )
      );
    } else if (e.key === "ArrowLeft" && activeCard !== 1) {
      setActiveCard((prev) => prev - 1);
    } else if (e.key === "ArrowRight" && activeCard !== 5) {
      setActiveCard((prev) => prev + 1);
    }
  }

  function guessTheNumber() {
    setGuessedNumber(0);

    answers.forEach((answer, i) => {
      if (answer) {
        setGuessedNumber((prev) => prev + [1, 2, 4, 8, 16][i]);
      }
    });

    setActiveSection("result");
  }

  useEffect(() => {
    switch (activeCard) {
      case 1:
        setMainBg(tailwindColors.indigo["500"]);
        break;
      case 2:
        setMainBg(tailwindColors.blue["500"]);
        break;
      case 3:
        setMainBg(tailwindColors.green["500"]);
        break;
      case 4:
        setMainBg(tailwindColors.yellow["500"]);
        break;
      case 5:
        setMainBg(tailwindColors.rose["500"]);
        break;
      default:
        break;
    }
  }, [activeCard]);

  useEffect(() => {
    document.addEventListener("keyup", handleKey);

    return () => {
      document.removeEventListener("keyup", handleKey);
    };
  });

  return (
    <motion.main
      className="min-h-screen w-full grid place-items-center transition-colors"
      initial={{
        backgroundColor: tailwindColors.indigo["500"],
      }}
      animate={{
        backgroundColor: mainBg,
      }}
      transition={{
        duration: 0.5,
      }}
    >
      <div className="content max-w-md mx-auto flex flex-col h-full justify-center">
        <div className="text-white font-extrabold text-xl mb-10 tracking-tighter text-center">
          🎂 Lemme Guess Your Bday 🎂
        </div>

        <AnimatePresence>
          {activeSection === "guessing" && (
            <motion.section className="guessing-section" key="guessing-section">
              <motion.div
                key={activeCard}
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                className="text-white font-bold text-3xl mb-5 text-center"
              >
                {activeCard}
              </motion.div>

              <div className="cards-container flex flex-wrap">
                {[
                  birthday.card1,
                  birthday.card2,
                  birthday.card3,
                  birthday.card4,
                  birthday.card5,
                ].map((card, i) => {
                  return i + 1 === activeCard ? (
                    <AnimatePresence key={i + 1}>
                      <motion.div
                        drag="x"
                        dragConstraints={{ left: -10, right: 10 }}
                        dragSnapToOrigin
                        onDragEnd={handleDragEnd}
                        className="card bg-white p-6 md:p-4 rounded-lg gap-[10px] md:gap-[15px] cursor-grab active:cursor-grabbing"
                        initial="hidden"
                        animate="visible"
                        variants={cardContainer}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          margin: "0 auto",
                        }}
                      >
                        {card.map((number, index) => (
                          <motion.div
                            key={index}
                            className="card-number font-extrabold bg-slate-100 text-slate-600 flex justify-center items-center w-[50px] h-[50px] md:w-[80px] md:h-[80px] rounded-full transition-colors select-none md:text-3xl"
                            variants={cardItem}
                          >
                            {number}
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  ) : null;
                })}
              </div>

              <div className="yes-no my-6 flex flex-col items-center gap-2">
                <div className="text-sm text-white font-bold">
                  Does your number exist in this card?
                </div>

                <label
                  htmlFor="yesno"
                  className="w-[130px] h-[30px] bg-white rounded-md text-sm flex p-1 relative cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="yesno"
                    hidden
                    className="peer"
                    onChange={() =>
                      setAnswers((prev) =>
                        prev.map((answer, i) =>
                          i + 1 === activeCard ? !answer : answer
                        )
                      )
                    }
                    checked={answers[activeCard - 1]}
                  />
                  <div className="bg-rose-400 w-1/2 rounded-md transition-all duration-500 peer-checked:translate-x-full peer-checked:bg-green-400"></div>

                  <div className="absolute w-full h-full top-0 left-0 flex p-1 font-semibold">
                    <div className="w-1/2 h-full rounded-md flex justify-center items-center">
                      No
                    </div>
                    <div className="w-1/2 h-full rounded-md flex justify-center items-center">
                      Yes
                    </div>
                  </div>
                </label>
              </div>

              <div className="next-prev flex justify-around">
                <AnimatePresence>
                  {activeCard === 1 ? (
                    <motion.button
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: "100%",
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      exit={{
                        width: 40,
                      }}
                      key="back-to-home-btn"
                      className="bg-white rounded-full py-2 px-4 mr-2 text-sm font-bold whitespace-nowrap overflow-hidden"
                      onClick={() => {
                        setActiveSection("landing");
                      }}
                    >
                      Back to home 🏠
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{
                        scale: 0.95,
                      }}
                      key="prev-btn"
                      className="bg-white rounded-full p-2"
                      onClick={() => setActiveCard((prev) => prev - 1)}
                      disabled={activeCard === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          d="M18 12.4H6M11.4 7L6 12.4l5.4 5.4"
                        />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {activeCard === 5 ? (
                    <motion.button
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: "100%",
                      }}
                      exit={{
                        width: 0,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      key="guess-btn"
                      className="bg-white rounded-full py-2 px-4 ml-2 text-sm font-bold overflow-hidden whitespace-nowrap"
                      onClick={() => guessTheNumber()}
                    >
                      Guess my number ✨
                    </motion.button>
                  ) : (
                    <motion.button
                      initial={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      className="bg-white rounded-full p-2"
                      key="next-btn"
                      onClick={() => setActiveCard((prev) => prev + 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          d="M6 12.4h12M12.6 7l5.4 5.4l-5.4 5.4"
                        />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {activeSection === "result" && (
            <motion.section
              className="flex flex-col gap-6 items-center"
              initial={{
                scale: 0,
              }}
              animate={{ scale: 1 }}
              key="result-section"
            >
              <div className="text-white font-bold">Your number is</div>
              <h2 className="text-7xl font-bold text-white my-6">
                <Counter from={99} to={guessedNumber} />
              </h2>
              <button
                className="bg-white rounded-full py-2 px-4 ml-2 text-sm font-bold overflow-hidden whitespace-nowrap"
                onClick={() => {
                  setGuessedNumber(0);
                  setActiveCard(1);
                  setActiveSection("guessing");
                }}
              >
                Play again
              </button>
            </motion.section>
          )}

          {activeSection === "landing" && (
            <motion.section
              className="flex flex-col gap-6 items-center max-w-md"
              initial={{
                scale: 0,
              }}
              animate={{ scale: 1 }}
              key="landing-section"
            >
              <p className="text-center leading-relaxed tracking-tight text-white">
                <strong>To play this game is so simple, </strong>
                pick / determine a number in your mind from{" "}
                <strong>1 to 31</strong> and answer the question for each card
                whether your picked number is there or not, and then click the
                Guess my number button to let it guess your number and the
                result will appear.
              </p>

              <div className="text-white flex flex-col gap-4 items-center text-sm">
                <strong>TIP</strong>

                <ul className="list-disc">
                  <li>
                    You can interact using the available buttons but you can
                    also,
                  </li>
                  <li>Press left or right key to switch between cards</li>
                  <li>
                    Swipe the card to left or right to switch between cards
                  </li>
                  <li>Press "n" or "y" to answer question</li>
                </ul>
              </div>

              <button
                className="bg-white rounded-full py-2 px-4 ml-2 text-sm font-bold overflow-hidden whitespace-nowrap"
                onClick={() => {
                  setGuessedNumber(0);
                  setActiveCard(1);
                  setActiveSection("guessing");
                }}
              >
                Play
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

export default App;
