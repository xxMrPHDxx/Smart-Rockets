import {Rocket} from './rocket.js';
import {Vector} from './vector.js';

export class Population{
	constructor(canvas,ctx){
		this.canvas = canvas;
		this.ctx = ctx;

		this.rockets = [];
		this.size = 150;

		this.target = Vector.createVector(canvas.width/2,30);

		this.showedBest = false;
		this.bestRocket = null;

		for(let i=0;i<this.size;i++){
			this.rockets.push(new Rocket(canvas,ctx,this.target));
		}

		this.pool = [];
	}

	evaluate(){
		let maxfit = 0;
		this.rockets.forEach(rocket => {
			rocket.calculateFitness();
			if(rocket.fitness > maxfit){
				maxfit = rocket.fitness;
				this.bestRocket = rocket;
			}
		});

		this.rockets.forEach(rocket => {
			rocket.fitness /= maxfit;
			if(!this.bestRocket || rocket.fitness > this.bestRocket.fitness){
				rocket.isWinner = true;
			}
		});

		this.pool.splice(0);

		this.rockets.forEach(rocket => {
			let n = rocket.fitness * 100;
			for(let j=0;j<n;j++){
				this.pool.push(rocket);
			}
		});
	}

	run(){
		this.ctx.save();
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.target.x - 5,this.target.y - 5,10,10);
		this.ctx.restore();

		this.evaluate();
		this.selection();

		this.rockets.forEach((rocket,i) => {
			if(rocket.count >= rocket.dna.lifespan){
				this.rockets.splice(i,1);
			}

			rocket.update();
			rocket.show();
		});
	}

	selection(){
		if(this.rockets.length >= this.size) return;

		this.rockets.forEach(rocket => {
			let parentA = this.pool[Math.random() * this.pool.length | 0];
			let parentB = this.pool[Math.random() * this.pool.length | 0];
			let child = parentA.dna.crossover(parentB.dna);
			child.mutation();
			let r = new Rocket(this.canvas,this.ctx,this.target,child);
			r.isWinner = (parentA.isWinner || parentB.isWinner) ? true : false;
			parentA.isWinner = false;
			parentB.isWinner = false;
			this.rockets.push(r);
		});

		this.rockets = this.rockets;

		this.showedBest = false;
	}
}