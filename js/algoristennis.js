/**
 * JS for Algoristennis
 * @authors Alexandre Andrieux <alex@icosacid.com>, Nik Rowell <nik@nikrowell.com>
 * @since 2017-04
 */

var App = {};

Math.TWO_PI = Math.PI * 2;

// not worried about namespacing or global variables here :)

var settings = {};
settings.stepLimit = 300;
settings.baseHue = Math.round(Math.random() * 360);

function lerp(norm, min, max) {
	return min + norm * (max - min);
}

jQuery(document).ready(function() {
	// Setup canvas and app
	App.setup();
	console.log(settings);
	
	// Launch animation loop
	App.frame = function() {
		App.update();
		// stop (for now) at an aesthetically cool spot. 
		// Probably makes more sense in update() as we continue to layer things on 
		if(App.stepCount < settings.stepLimit) {
			App.frame.handle = window.requestAnimationFrame(App.frame);
		}
	};
	App.frame();
});

App.setup = function() {
	// Setup canvas and get canvas context
	var canvas = document.createElement('canvas');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.id = 'ourcanvas';
	
	// Append to DOM
	document.body.appendChild(canvas);
	document.body.addEventListener('click', App.click.bind(this));
	
	// Attach canvas context and dimensions to App
	this.ctx = canvas.getContext('2d');
	this.width = canvas.width;
	this.height = canvas.height;
	
	// Define a few useful elements
	this.stepCount = 0;
	this.xC = canvas.width / 2;
	this.yC = canvas.height / 2;
	
	// Particles!
	this.particles = [];
	this.birthPeriod = 5;
	this.maxPop = 50;

	// Initial birth
	this.birth();
};
App.update = function() {
	// Evolve system
	this.evolve();
	// Move particles
	this.move();
	// Draw particles
	this.draw();
};
App.evolve = function() {
	this.stepCount++;
	// Simple periodic birth
	if (this.stepCount % this.birthPeriod == 0 && this.particles.length < this.maxPop) this.birth();
};
App.move = function() {
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		particle.update();

		if (particle.dead) {
			this.kill(particle.name);
		}
	}
};
App.draw = function() {

	// move origin to center stage and 
	// use additive blending, very nice!
	this.ctx.save();
	this.ctx.translate(this.xC, this.yC);
	this.ctx.globalCompositeOperation = 'lighter';
	
	// Draw all particles
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		particle.draw(this.ctx);
	}

	this.ctx.restore();
};
App.birth = function() {

	var particle = new Particle({
		angle: Math.random() * Math.TWO_PI,
		name: 'particle' + this.stepCount
	});

	this.particles.push(particle);
};
App.kill = function(particleName) {
	// Remove a particle from array based on its name attribute, which is expected
	this.particles = _(this.particles).reject(function(particle) {
		return (particle.name == particleName);
	});
};
App.click = function(event) {
	console.log(this.stepCount);
	if(App.frame.handle) {
		window.cancelAnimationFrame(App.frame.handle);
		App.frame.handle = null;
	} else {
		App.frame();
	}
};