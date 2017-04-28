
function Particle(options) {
	
	options || (options = {});

	this.name = options.name;
	this.x = options.x;
	this.y = options.y;
	this.vx = this.x * 0.01;
	this.vy = this.y * 0.01;
}

Particle.prototype = {
	
	update: function(t) {

		this.x += this.vx;
		this.y += this.vy;

		// need to use canvas center values since we're using a translated context
		if(this.y < -App.yC || this.y > App.yC || this.x < -App.xC || this.x > App.xC) {
			this.dead = true;
		}
	},

	draw: function(ctx) {

		// Particle size
		var rParticle = Math.floor(20 * Math.random());
		
		// Particle color
		var hue = 180 + 30 * Math.random();
		var alpha = Math.random() * 0.15;
		
		// Draw particle
		ctx.beginPath();
		ctx.arc(this.x, this.y, rParticle, 0, Math.TWO_PI, false);
		ctx.strokeStyle = 'hsla(' + hue + ', 70%, 50%, ' + alpha + ')';
		ctx.stroke();
	}
};