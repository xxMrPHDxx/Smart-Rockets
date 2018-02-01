export class Obstacle{
	constructor(canvas,ctx){
		this.canvas = canvas;
		this.ctx = ctx;

		this.pos = {x:200,y:140};
		this.width = 200;
		this.height = 10;
	}

	draw(){
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.pos.x-this.width / 2,this.pos.y-this.height / 2,this.width,this.height);
	}
}