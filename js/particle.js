
function Particle(options) {
	
	this.name = options.name;
	this.xStart = options.xStart;
	this.yStart = options.yStart;
	this.age = 0;
	
	// Circular birth with random radius
	var radius = 75 + Math.random() * 50;
	var angle = options.angle;

	this.x = Math.cos(angle) * radius;
	this.y = Math.sin(angle) * radius;
	var speedBoost = 1 + 5 * Math.random();
	this.vx = speedBoost * this.x * 0.1;
	this.vy = speedBoost * this.y * 0.1;

	// limit to a range of hues, mapped to a sine wave to
	// get a smooth gradient instead of an abrupt change
	// is this right?... is there a better way to do this?
	// Alex: Totally fine
	this.hue = settings.hueBase + Math.sin(angle + settings.hueShift) * 15;
}

Particle.prototype = {
	
	update: function(t) {

		this.x += this.vx;
		this.y += this.vy;

		// Kill particles that reach canvas edges
		// need to use center values since we're using a translated context
		if(this.y < -App.yC || this.y > App.yC || this.x < -App.xC || this.x > App.xC) {
			this.dead = true;
		}
		
		// Particle gets older
		this.age++;
	},

	draw: function(ctx) {

		var rParticle = Math.floor(20 * Math.random());
		var alpha = Math.random() * 1;

		// Draw particle
		ctx.beginPath();
		ctx.arc(this.x, this.y, rParticle, 0, Math.TWO_PI, false);
		ctx.strokeStyle = 'hsla(' + this.hue + ', 70%, 50%, ' + alpha + ')';
		ctx.stroke();
	}
};
