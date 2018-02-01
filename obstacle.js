export class Obstacle{
	constructor(canvas,ctx){
		this.canvas = canvas;
		this.ctx = ctx;

		this.pos = {x:canvas.width / 2,y:canvas.height / 2};
		this.width = 300;
		this.height = 10;
	}

	draw(){
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.pos.x-this.width / 2,this.pos.y-this.height / 2,this.width,this.height);
	}
}