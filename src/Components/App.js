import { useEffect, useState } from "react";
import { GameElem, Circle, Square, Rectangle } from "./GameElem";

function App() {
	const [isGameOver, setIsGameOver] = useState(false);
	const [startGame, setStartGame] = useState(false);
	const [score, setScore] = useState(0);

	const gameIsOn = startGame && !isGameOver;

	/* CIRCLE - CHASE */
	let circle = new Circle();
	const circleHTMLElem = circle.getHTMLElement();

	/* rectangle - ESCAPE */
	let rectangle = new Rectangle();
	const rectangleHTMLElem = rectangle.getHTMLElement();

	/* square - STRAIGHT LINE */
	let square = new Square();
	const squareHTMLElem = square.getHTMLElement();

	useEffect(() => {
		if (isGameOver) {
			circleHTMLElem.style.display = "none";
			rectangleHTMLElem.style.display = "none";
			squareHTMLElem.style.display = "none";
		}
	}, [isGameOver]);

	useEffect(() => {
		if (startGame) {
			circleHTMLElem.style.display = "block";
			rectangleHTMLElem.style.display = "block";
			squareHTMLElem.style.display = "block";
		}
	}, [startGame]);

	if (gameIsOn) {
		setInterval(() => {
			square.move();
			setScore(score + 1);
		}, 1000);
	}

	if (gameIsOn) {
		document.addEventListener("mousemove", (event) => {
			circle.move(event);
			rectangle.move(event);
		});
		circleHTMLElem.addEventListener("mouseenter", (e) => {
			circle.hitTarget(setIsGameOver);
			circle.initLocation();
		});
		rectangleHTMLElem.addEventListener("mouseenter", (e) => {
			rectangle.hitTarget(setScore, score);
			rectangle.initLocation();
		});
		squareHTMLElem.addEventListener("mouseenter", (e) => {
			square.hitTarget(setIsGameOver);
			square.initLocation();
		});
	}
	return (
		<>
			<div>SCORE: {score}</div>
			{isGameOver && <div style={{ top: "50%", left: "50%" }}>GAME OVER</div>}
			{!startGame && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "500px",
					}}
				>
					<button onClick={() => setStartGame(true)}>START GAME</button>
				</div>
			)}
		</>
	);
}

export default App;
