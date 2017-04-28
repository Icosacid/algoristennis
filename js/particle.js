
function Particle(options) {
	
	options || (options = {});

	// a little variance to start points along the circle
	var radius = 75 + Math.random() * 50;
	var angle = options.angle;

	this.name = options.name;
	this.x = Math.cos(angle) * radius;
	this.y = Math.sin(angle) * radius;
	this.vx = this.x * 0.01;
	this.vy = this.y * 0.01;

	// limit to a range of hues, mapped to half a sine wave 
	// to get a smooth gradient instead of an abrupt change
	// is this right?... is there a better way to do this?
	this.hue = lerp(Math.sin(angle / 2), settings.baseHue, settings.baseHue + 40);
}

Particle.prototype = {
	
	update: function(t) {

		this.x += this.vx;
		this.y += this.vy;

		// need to use center values since we're using a translated context
		if(this.y < -App.yC || this.y > App.yC || this.x < -App.xC || this.x > App.xC) {
			this.dead = true;
		}
	},

	draw: function(ctx) {

		var rParticle = Math.floor(20 * Math.random());
		var alpha = Math.random() * 0.2;

		// Draw particle
		ctx.beginPath();
		ctx.arc(this.x, this.y, rParticle, 0, Math.TWO_PI, false);
		ctx.strokeStyle = 'hsla(' + this.hue + ', 70%, 50%, ' + alpha + ')';
		ctx.stroke();
	}
};