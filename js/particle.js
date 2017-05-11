
function Particle(options) {
	
	this.name = options.name;
	this.xStart = options.xStart;
	this.yStart = options.yStart;
	this.age = 0;
	
	// Circular birth at a random distance
	var radius = 25 + 25 * Math.random();
	var angle = options.angle;

	this.x = this.xStart + radius * Math.cos(angle);
	this.y = this.yStart + radius * Math.sin(angle);
	
	var speed = 5;
	this.vx = speed * Math.cos(angle);
	this.vy = speed * Math.sin(angle);

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
			// Give birth to a new particle at the center of the canvas
			App.birth();
		}
		
		// Particle gets older
		this.age++;
		
		// Reproduce and die when old enough
		if (this.age >= settings.maturityAge) {
			this.dead = true;
			// Give birth to 2 particles right where you die
			App.birth(this.x, this.y);
			App.birth(this.x, this.y);
		}
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
