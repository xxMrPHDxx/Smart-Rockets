import {Obstacle} from './obstacle.js';
import {Population} from './population.js';

export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

const population = new Population(canvas,ctx);
export const obstacle = new Obstacle(canvas,ctx);

function update(){
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	obstacle.draw();

	population.run();

	requestAnimationFrame(update);
}
update();