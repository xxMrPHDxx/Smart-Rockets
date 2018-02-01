import {obstacle} from "./main.js";

import {Vector} from './vector.js';
import {DNA} from './dna.js';

export class Rocket{
	constructor(canvas,ctx,target,dna,lifespanOption){
		this.canvas = canvas;
		this.ctx = ctx;
		this.target = target;

		if(dna instanceof DNA){
			this.lifespanOption = lifespanOption;
			this.dna = new DNA(parseInt(lifespanOption.selectedOptions[0].innerText));
		}else{
			this.lifespanOption = null;
			this.dna = new DNA(parseInt(dna.selectedOptions[0].innerText));
		}

		this.pos = Vector.createVector(canvas.width / 2,canvas.height - 10);
		this.initPos = Vector.createVector(canvas.width / 2,canvas.height - 10);
		this.vel = Vector.createVector();
		this.acc = Vector.createVector();

		this.fitness = 0;
		this.count = 0;
		this.lifetime = 0;
		this.distance = 0;

		this.completed = false;
		this.crashed = false;

		this.isWinner = false;
	}

	applyForce(force){
		this.acc.add(force);
	}

	calculateFitness(){
		let dT = Vector.dist(this.pos,this.target);

		this.fitness = 10 / dT;

		if(this.completed){
			this.fitness *= 100;
		}

		if(this.crashed){
			this.fitness *= 0.01;
		}		
	}

	update(){
		let d = Vector.dist(this.pos,this.target);
		if(d < 1){
			this.completed = true;
		}

		if((this.pos.x > obstacle.pos.x - obstacle.width / 2 &&
				this.pos.x < obstacle.pos.x + obstacle.width / 2 &&
				this.pos.y > obstacle.pos.y - obstacle.height / 2 &&
				this.pos.y < obstacle.pos.y + obstacle.height / 2) ||
				(this.pos.x < 0 || this.pos.x > this.canvas.width ||
				this.pos.y < 0 || this.pos.y > this.canvas.height)){
			this.crashed = true;
			this.isWinner = false;
		}

		this.applyForce(this.dna.genes[this.count]);
		this.count++;

		if(!this.crashed){
			this.lifetime++;
		}

		if(this.completed || this.crashed) return;

		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	show(){
		this.ctx.save(); 
		if(this.completed){
			this.ctx.fillStyle = "green";
		}else if(this.crashed){
			this.ctx.fillStyle = "red";
		}else if(!this.completed && !this.isWinner){
			this.ctx.fillStyle = "white";
		}
		this.ctx.translate(this.pos.x,this.pos.y);
		this.ctx.rotate(this.vel.heading());
		this.ctx.fillRect(-2.5,-13,5,26);
		this.ctx.restore();
	}
}