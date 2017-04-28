/**
 * JS for Algoristennis
 * @authors Alexandre Andrieux <alex@icosacid.com>, Nik Rowell <nik@nikrowell.com>
 * @since 2017-04
 */

var App = {};

Math.TWO_PI = Math.PI * 2;

jQuery(document).ready(function() {
	// Setup canvas and app
	App.setup();
	
	// Launch animation loop
	App.frame = function() {
		App.update();
		App.frame.handle = window.requestAnimationFrame(App.frame);
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
	document.body.addEventListener('click', App.click.bind(App));
	
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
App.click = function(event) {
	console.log(this.stepCount);
	if(App.frame.handle) {
		window.cancelAnimationFrame(App.frame.handle);
		App.frame.handle = null;
	} else {
		App.frame();
	}
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

	var angle = Math.random() * Math.TWO_PI;
	// a little variance to start points along the circle
	var radius = 75 + Math.random() * 50;
	
	var particle = new Particle({
		x: Math.cos(angle) * radius,
		y: Math.sin(angle) * radius,
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
