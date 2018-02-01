import {Rocket} from './rocket.js';
import {Vector} from './vector.js';

export class Population{
	constructor(canvas,ctx,sizeOption,lifespanOption){
		this.canvas = canvas;
		this.ctx = ctx;

		this.rockets = [];

		this.sizeOption = sizeOption;
		this.size = sizeOption ? parseInt(sizeOption.selectedOptions[0].innerText) : 100;

		this.lifespanOption = lifespanOption;

		this.target = Vector.createVector(canvas.width/2,30);

		this.showedBest = false;
		this.noobRocket = null;
		this.bestRocket = null;

		for(let i=0;i<this.size;i++){
			this.rockets.push(new Rocket(canvas,ctx,this.target,lifespanOption));
		}

		this.pool = [];
	}

	evaluate(){
		let minfit = Infinity; 
		let maxfit = 0;
		this.rockets.forEach(rocket => {
			rocket.calculateFitness();
			if(rocket.fitness > maxfit){
				maxfit = rocket.fitness;
				this.bestRocket = rocket;
			}
			if(rocket.fitness < minfit){
				minfit = rocket.fitness;
				this.noobRocket = rocket;
			}
		});

		if(!this.showedBest){
			console.log("Min : " + minfit,"Max : " + maxfit);
			this.showedBest = true;
		}

		this.rockets.forEach(rocket => {
			rocket.fitness /= maxfit;
			if(!this.bestRocket || rocket.fitness > this.bestRocket.fitness){
				rocket.isWinner = true;
			}
		});

		this.pool.splice(0);

		this.rockets.forEach(rocket => {
			let n = rocket.fitness * this.size;
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

		if(this.sizeOption){
			this.size = parseInt(this.sizeOption.selectedOptions[0].innerText);
			if(this.size !== this.rockets.length){
				this.rockets.splice(0);
				for(let i=0;i<this.size;i++){
					this.rockets.push(new Rocket(this.canvas,this.ctx,this.target,this.lifespanOption));
				}
			}
		}

		this.rockets.forEach((rocket,i) => {
			rocket.update();
			rocket.show();

			if(rocket.count >= rocket.dna.lifespan){
				this.rockets.splice(i,1);
				this.showedBest = false;
			}
		});
	}

	selection(){
		if(this.rockets.length >= this.size) return;

		this.rockets.forEach(rocket => {
			let parentA = this.pool[Math.random() * this.pool.length | 0];
			let parentB = this.pool[Math.random() * this.pool.length | 0];
			let child = parentA.dna.crossover(parentB.dna);
			child.mutation();
			let r = new Rocket(this.canvas,this.ctx,this.target,child,this.lifespanOption);
			r.isWinner = (parentA.isWinner || parentB.isWinner) ? true : false;
			parentA.isWinner = false;
			parentB.isWinner = false;
			this.rockets.push(r);
		});

		this.rockets = this.rockets;
	}
}