
function Particle(options) {

	this.xStart = options.xStart;
	this.yStart = options.yStart;
	this.age = 0;

	// Circular birth at a random distance
	var radius = 25 + 25 * Math.random();
	var angle = options.angle;

	this.x = this.xStart + radius * Math.cos(angle);
	this.y = this.yStart + radius * Math.sin(angle);

	// Send the particles straight away from birthpoint
	var speed = settings.particleBirthSpeed;
	this.vx = speed * Math.cos(angle);
	this.vy = speed * Math.sin(angle);

	this.hue = settings.hueBase + Math.sin(angle + settings.hueShift) * 15;
}

Particle.prototype = {

	update: function(t) {

		// Move particle
		// Attract towards center
		var k = settings.springStiffness;
		var r = Math.sqrt(this.x * this.x + this.y * this.y);
		var angle = Tools.segmentAngleRad(0, 0, this.x, this.y, true);
		var attraction = -k * r;
		var attractionX = attraction * Math.cos(angle);
		var attractionY = attraction * Math.sin(angle);
		this.vx += attractionX - settings.viscosity * this.vx;
		this.vy += attractionY - settings.viscosity * this.vy;
		this.x += this.vx;
		this.y += this.vy;

		// Kill particles that reach canvas edges
		// need to use center values since we're using a translated context
		
		/*if (this.y < -App.yC || this.y > App.yC || this.x < -App.xC || this.x > App.xC) {
			this.dead = true;
			// Give birth to new particles at the center of the canvas
			App.birth();
		}*/
		
		// Particle gets older
		this.age++;

		// Reproduce and die when old enough
		if (this.age >= settings.maturityAge) {
			this.dead = true;
			// Give birth to 1 or 2 particles right where you die
			// With a different motion direction
			var speedAngle = Tools.segmentAngleRad(0, 0, this.vx, this.vy, true);
			App.birth(this.x, this.y, speedAngle + Math.random() * Math.TWO_PI / 2);
			//if (Math.random() > 0.5) App.birth(this.x, this.y);
		}
	},

	draw: function(ctx) {

		var rParticle = 25 * Math.sin(this.age / settings.maturityAge * Math.PI);
		var alpha = 0.8;

		// Draw particle
		ctx.beginPath();
		ctx.arc(this.x, this.y, rParticle, 0, Math.TWO_PI, false);
		var hue = this.hue + this.age;
		var sat = 0;//70 - this.age / 2;
		var lum = 100;
		ctx.strokeStyle = 'hsla(' + hue + ', ' + sat + '%, ' + lum + '%, ' + alpha + ')';
		ctx.stroke();
	}
};
