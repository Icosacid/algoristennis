
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
	
	// Send the particles straight away from birthpoint
	var speed = 5;
	this.vx = speed * Math.cos(angle);
	this.vy = speed * Math.sin(angle);

	this.hue = settings.hueBase + Math.sin(angle + settings.hueShift) * 15;
}

Particle.prototype = {
	
	update: function(t) {

		// Move particle
		this.vx -= this.vx * settings.viscosity;
		this.vy -= this.vy * settings.viscosity;
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
			// Give birth to 1 or 2 particles right where you die
			App.birth(this.x, this.y);
			if (Math.random() > 0.9) App.birth(this.x, this.y);
		}
	},

	draw: function(ctx) {

		var rParticle = this.age;
		var alpha = Math.random() * 0.8;

		// Draw particle
		ctx.beginPath();
		ctx.arc(this.x, this.y, rParticle, 0, Math.TWO_PI, false);
		var hue = this.hue + this.age;
		var sat = 70 - this.age / 2;
		ctx.strokeStyle = 'hsla(' + hue + ', ' + sat + '%, 50%, ' + alpha + ')';
		ctx.stroke();
	}
};
