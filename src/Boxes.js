import React, { useState, useEffect } from "react";
import Header from "./Header.js";

const Board = () => {
  const [circle, setCircle] = useState(0);
  const [snake, setSnake] = useState([{ x: 160, y: 40 }]);
  const [xSnake, setXSnake] = useState(160);
  const [ySnake, setYSnake] = useState(40);
  const [isGoingRight, setIsGoingRight] = useState(false);
  const [isGoingLeft, setIsGoingLeft] = useState(false);
  const [isGoingUp, setIsGoingUp] = useState(false);
  const [isGoingDown, setIsGoingDown] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  let rightInterval;
  let leftInterval;
  let upInterval;
  let downInterval;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        console.log("down was pressed");
        setIsGoingDown(true);
        setIsGoingRight(false);
        setIsGoingLeft(false);
      } else if (event.key === "ArrowUp") {
        console.log("up was pressed");
        setIsGoingUp(true);
        setIsGoingRight(false);
        setIsGoingLeft(false);
      } else if (event.key === "ArrowRight") {
        console.log("right was pressed");
        setIsGoingRight(() => true);
        setIsGoingUp(false);
        setIsGoingDown(false);
      } else if (event.key === "ArrowLeft") {
        console.log("left was pressed");
        setIsGoingLeft(true);
        setIsGoingUp(false);
        setIsGoingDown(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(rightInterval);
      clearInterval(leftInterval);
      clearInterval(upInterval);
      clearInterval(downInterval);
    };
  }, []);

  const checkCollision = (head, body) => {
    return body.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  useEffect(() => {
    if (isGoingRight) {
      rightInterval = setInterval(() => {
        const newHead = {
          x: snake[0].x,
          y: snake[0].y + 20,
        };

        if (
          checkCollision(newHead, snake.slice(1)) ||
          newHead.y >= window.innerWidth - 20 ||
          newHead.y < 0
        ) {
          setGameOver(true);
          clearInterval(rightInterval);
        } else {
          setSnake((prevSnake) => [newHead, ...prevSnake.slice(0, -1)]);
        }
      }, 300);
    } else if (!isGoingRight && isGoingLeft) {
      leftInterval = setInterval(() => {
        const newHead = {
          x: snake[0].x,
          y: snake[0].y - 20,
        };

        if (
          checkCollision(newHead, snake.slice(1)) ||
          newHead.y >= window.innerWidth - 20 ||
          newHead.y < 0
        ) {
          setGameOver(true);
          clearInterval(leftInterval);
        } else {
          setSnake((prevSnake) => [newHead, ...prevSnake.slice(0, -1)]);
        }
      }, 300);
    } else if (isGoingUp) {
      upInterval = setInterval(() => {
        const newHead = {
          x: snake[0].x - 20,
          y: snake[0].y,
        };

        if (
          checkCollision(newHead, snake.slice(1)) ||
          newHead.x >= window.innerHeight - 20 ||
          newHead.x < 0
        ) {
          setGameOver(true);
          clearInterval(upInterval);
        } else {
          setSnake((prevSnake) => [newHead, ...prevSnake.slice(0, -1)]);
        }
      }, 300);
    } else if (isGoingDown) {
      downInterval = setInterval(() => {
        const newHead = {
          x: snake[0].x + 20,
          y: snake[0].y,
        };

        if (
          checkCollision(newHead, snake.slice(1)) ||
          newHead.x >= window.innerHeight - 20 ||
          newHead.x < 0
        ) {
          setGameOver(true);
          clearInterval(downInterval);
        } else {
          setSnake((prevSnake) => [newHead, ...prevSnake.slice(0, -1)]);
        }
      }, 300);
    }

    return () => {
      clearInterval(rightInterval);
      clearInterval(leftInterval);
      clearInterval(upInterval);
      clearInterval(downInterval);
    };
  }, [isGoingRight, isGoingLeft, isGoingUp, isGoingDown, snake]);

  function generateFood() {
    const bigRectangle = document.querySelector(".bigRectangle");
    const rect = bigRectangle.getBoundingClientRect();
    const snakeX = xSnake;
    const snakeY = ySnake;
    const gridSize = 20; // Set this to the size of your grid squares

    let randomX, randomY;

    // Generate random coordinates within the grid
    do {
      randomX = Math.floor(Math.random() * (rect.width / gridSize)) * gridSize;
    } while (Math.abs(randomX - snakeX) < gridSize);

    do {
      randomY = Math.floor(Math.random() * (rect.height / gridSize)) * gridSize;
    } while (Math.abs(randomY - snakeY) < gridSize);

    setCircle({ x: randomX, y: randomY });
  }

  if (circle.x === snake[0].y && circle.y === snake[0].x) {
    generateFood();
    setSnake((prevSnake) => [
      { x: prevSnake[0].x, y: prevSnake[0].y },
      ...prevSnake,
    ]);
    setScore(score + 10);
  }

  function start() {
    clearInterval(rightInterval);
    clearInterval(leftInterval);
    clearInterval(upInterval);
    clearInterval(downInterval);

    setSnake([{ x: 160, y: 40 }]);
    setIsGoingRight(false);
    setIsGoingLeft(false);
    setIsGoingUp(false);
    setIsGoingDown(false);
    setScore(0);
    setGameOver(false);

    generateFood();
  }

  return (
    <>
      <Header score={score} />
      <div className="boxBoard">
        {gameOver ? (
          <div className="bigRectangle" id="gameOver">
            Game Over!{" "}
          </div>
        ) : (
          <div className="bigRectangle">
            {circle && (
              <div
                style={{
                  position: "absolute",
                  top: circle.y,
                  left: circle.x,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "white",
                }}
              />
            )}

            {snake.map((segment, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: segment.x,
                  left: segment.y,
                  width: 20,
                  height: 20,
                  backgroundColor: "lightblue",
                }}
              />
            ))}
          </div>
        )}
        <button onClick={start}>Start Game</button>
      </div>
    </>
  );
};

export default Board;
