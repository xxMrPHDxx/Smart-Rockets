import {Vector} from './vector.js';

export class DNA{
	constructor(lifespan=300,genes){
		this.lifespan = lifespan;
		this.maxForce = 0.3;

		if(genes) {
			this.genes = genes;
		}else{
			this.genes = [];
			for(let i=0;i<this.lifespan;i++){
				let v = Vector.random2D();
				v.setMag(this.maxForce);
				this.genes.push(v);
			}
		}
	}

	crossover(o){
		let newGenes = [];

		let mid = Math.random() * this.genes.length | 0;
		this.genes.forEach((gene,i) => {
			if(i > mid){
				newGenes.push(gene);
			}else{
				newGenes.push(o.genes[i]);
			}
		});

		return new DNA(this.lifespan,newGenes);
	}

	mutation(){
		this.genes.forEach(gene => {
			if(Math.random() < 0.02){
				gene = Vector.random2D();
				gene.setMag(this.maxForce);
			}
		});
	}
}