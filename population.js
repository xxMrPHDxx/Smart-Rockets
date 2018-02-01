import {Rocket} from './rocket.js';
import {Vector} from './vector.js';

export class Population{
	constructor(canvas,ctx){
		this.canvas = canvas;
		this.ctx = ctx;

		this.rockets = [];
		this.size = 100;

		this.target = Vector.createVector(canvas.width/2,30);

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
			}
		});

		this.rockets.forEach(rocket => {
			rocket.fitness /= maxfit;
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
		if(this.rockets.length >= 100) return;

		this.rockets.forEach(rocket => {
			let parentA = this.pool[Math.random() * this.pool.length | 0].dna;
			let parentB = this.pool[Math.random() * this.pool.length | 0].dna;
			let child = parentA.crossover(parentB);
			child.mutation();
			this.rockets.push(new Rocket(this.canvas,this.ctx,this.target,child));
		});

		this.rockets = this.rockets;
	}
}