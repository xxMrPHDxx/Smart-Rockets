export class Vector{
	constructor(x=0,y=0){
		this.x=x;
		this.y=y;
	}
	static createVector(x,y){
		return new Vector(x,y);
	}
	static random2D(){
		let x = 1 - Math.random() * 2;
		let y = 1 - Math.random() * 2;
		return Vector.createVector(x,y);
	}
	static dist(v1,v2){
		if(!(v1 instanceof Vector && v1 instanceof Vector)) return 0;
		return Math.sqrt(Math.pow(v1.x - v2.x,2) + Math.pow(v1.y - v2.y,2));
	}
	add(vector){
		if(!(vector instanceof Vector)) return this;
		this.x += vector.x;
		this.y += vector.y;
	}
	heading(){
		return (this.x == 0 ? 0 : Math.atan(this.y / this.x)) - Math.PI / 2;
	}
	mult(c){
		if(!(typeof c === "number")) return this;
		this.x *= c;
		this.y *= c;
	}
	setMag(mag=1){
		let old = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
		if(old === mag) return;
		this.x *= mag / old;
		this.y *= mag / old;
	}
}