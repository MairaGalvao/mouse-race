export class GameElem {
	constructor(type, shape) {
		this.type = type;
		this.shape = shape;
		this.size = "randon";
		this.speed = "randon";
	}
	hitTarget() {}
	move() {}

	getHTMLElement() {
		return document.querySelector(`.${this.shape}`);
	}
	initLocation() {
		const coordinates = getRandomLocationWithinScreen();
		const thisHTMLElem = this.getHTMLElement();
		thisHTMLElem.style.left = coordinates.left + "px";
		thisHTMLElem.style.top = coordinates.top + "px";
	}
}

export class Circle extends GameElem {
	constructor() {
		super("chase", "circle");
	}

	hitTarget(gameOverCallback) {
		gameOverCallback();
	}
	move(event) {
		moveElementInRelationToMouse(this.shape, event, false, 0.03);
	}
}

export class Rectangle extends GameElem {
	constructor() {
		super("escape", "rectangle");
	}
	move(event) {
		moveElementInRelationToMouse(this.shape, event, true, 0.01);
	}
	hitTarget(setScore, score) {
		setScore(score + 5);
	}
}

export class Square extends GameElem {
	constructor() {
		super("random", "square");
		this.addX = getRandomNumber(-10, 10);
		this.addY = getRandomNumber(-10, 10);
	}
	move() {
		const elem = document.querySelector("." + this.shape);
		const coordinates = getNumericalCoordinates(elem);
		elem.style.left = coordinates.x + this.addX + "px";
		elem.style.top = coordinates.y + this.addY + "px";
		if (didHitVerticalWall(elem)) {
			this.addY = -this.addY;
		}
		if (didHitHorizontalWall(elem)) {
			this.addX = -this.addX;
		}
	}
	hitTarget(gameOverCallback) {
		gameOverCallback();
	}
}

function getRandomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function moveElementInRelationToMouse(
	elementClass,
	event,
	shouldEscape,
	speed = 0.1
) {
	const elem = document.querySelector("." + elementClass);

	let mouseX = event.pageX;
	let mouseY = event.pageY;

	const coordinates = getNumericalCoordinates(elem);
	let elemX = coordinates.x;
	let elemY = coordinates.y;

	function animate() {
		let distX = mouseX - elemX;
		let distY = mouseY - elemY;

		if (shouldEscape) {
			elemX = elemX - distX * speed;
			elemY = elemY - distY * speed;
		} else {
			elemX = elemX + distX * speed;
			elemY = elemY + distY * speed;
		}

		elem.style.left = elemX + "px";
		elem.style.top = elemY + "px";

		if (!isInViewport(elem)) {
			const coordinates = getRandomLocationWithinScreen();
			elem.style.left = coordinates.left + "px";
			elem.style.top = coordinates.top + "px";
		}
		requestAnimationFrame(animate);
	}

	animate();
}

function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

function didHitVerticalWall(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top < 0 ||
		rect.bottom > (window.innerHeight || document.documentElement.clientHeight)
	);
}

function didHitHorizontalWall(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.left < 0 ||
		rect.right > (window.innerWidth || document.documentElement.clientWidth)
	);
}

function getRandomLocationWithinScreen() {
	const winWidth = window.innerWidth;
	const winHeight = window.innerHeight;

	const randomTop = getRandomNumber(0, winHeight);
	const randomLeft = getRandomNumber(0, winWidth);
	return { top: randomTop, left: randomLeft };
}

function getNumericalCoordinates(element) {
	let elemX = element.style.left ? element.style.left : "0px";
	let elemY = element.style.top ? element.style.top : "0px";
	elemX = parseFloat(elemX.slice(0, -2));
	elemY = parseFloat(elemY.slice(0, -2));
	return { x: elemX, y: elemY };
}
