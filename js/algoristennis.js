/**
 * JS for Algoristennis
 * @authors Alexandre Andrieux <alex@icosacid.com>, Nik Rowell <are.you.cool.with.adding@your.email?>
 * @since 2017-04
 */

var App = {};

jQuery(document).ready(function() {
	// Setup canvas and app
	App.setup();
	
	// Launch animation loop
	App.frame = function() {
		App.update();
		window.requestAnimationFrame(App.frame);
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
	
	// Attach canvas context and dimensions to App
	this.ctx = canvas.getContext('2d');
	this.width = canvas.width;
	this.height = canvas.height;

	// Define a few useful elements
	this.stepCount = 0;
	this.hasUserClicked = false;
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
		particle.y -= 4;
		if (particle.y < 0) this.kill(particle.name);
	}
};
App.draw = function() {
	// Draw all particles
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		
		// Particle size
		var rParticle = Math.floor(20 * Math.random());
		
		// Particle color
		var hue = 180 + 30 * Math.random();
		
		// Draw particle
		this.ctx.beginPath();
		this.ctx.arc(particle.x, particle.y, rParticle, 0, 2 * Math.PI, false);
		this.ctx.strokeStyle = 'hsla(' + hue + ', 70%, 50%, 1)';
		this.ctx.stroke();
	}
};
App.birth = function() {
	var x = this.width * Math.random();
	var y = this.height * Math.random();
	
	var particle = {
		x: x,
		y: y,
		xLast: x,
		yLast: y,
		xSpeed: 0,
		ySpeed: 0,
		name: 'particle' + this.stepCount
	};
	
	this.particles.push(particle);
};
App.kill = function(particleName) {
	// Remove a particle from array based on its name attribute, which is expected
	this.particles = _(this.particles).reject(function(particle) {
		return (particle.name == particleName);
	});
};
