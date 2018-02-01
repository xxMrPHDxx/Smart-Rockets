import {obstacle} from "./main.js";

import {Vector} from './vector.js';
import {DNA} from './dna.js';

export class Rocket{
	constructor(canvas,ctx,target,dna=new DNA()){
		this.canvas = canvas;
		this.ctx = ctx;
		this.target = target;

		this.pos = Vector.createVector(canvas.width / 2,canvas.height);
		this.vel = Vector.createVector();
		this.acc = Vector.createVector();

		this.dna = dna;
		this.fitness = 0;
		this.count = 0;

		this.completed = false;
		this.crashed = false;

		this.isWinner = false;
	}

	applyForce(force){
		this.acc.add(force);
	}

	calculateFitness(){
		var dT = Vector.dist(this.pos,this.target);

		this.fitness = 1 / dT;

		if(this.completed){
			this.fitness *= 10;
		}

		if(this.crashed){
			this.fitness /= 10;
		}
	}

	update(){
		let d = Vector.dist(this.pos,this.target);
		if(d < 1){
			this.completed = true;
		}

		if(this.pos.x > obstacle.pos.x - obstacle.width / 2 &&
			this.pos.x < obstacle.pos.x + obstacle.width / 2 &&
			this.pos.y > obstacle.pos.y - obstacle.height / 2 &&
			this.pos.y < obstacle.pos.y + obstacle.height / 2){
			this.crashed = true;
			this.isWinner = false;
		}

		if(this.pos.x < 0 || this.pos.x > this.canvas.width ||
			this.pos.y < 0){
			this.crashed = true;
			this.isWinner = false;
		}

		this.applyForce(this.dna.genes[this.count]);
		this.count++;

		if(this.completed || this.crashed) return;

		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	show(){
		this.ctx.save(); 
		this.ctx.fillStyle = "white";
		if(this.completed){
			this.ctx.fillStyle = "green";
		}
		if(this.isWinner){
			this.ctx.fillStyle = "red";
		}
		this.ctx.translate(this.pos.x,this.pos.y);
		this.ctx.rotate(this.vel.heading());
		this.ctx.fillRect(-3,-13,6,26);
		this.ctx.restore();
	}
}