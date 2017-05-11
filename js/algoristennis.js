/**
 * JS for Algoristennis
 * @authors Alexandre Andrieux <alex@icosacid.com>, Nik Rowell <nik@nikrowell.com>
 * @since 2017-04
 */

var App = {};

Math.TWO_PI = Math.PI * 2;

// not worried about namespacing or global variables here :)
// Alex: Indeed
var settings = {};
// randomize the hue we base the particle color range on
// and randomize the start position of that range
settings.hueBase = Math.random() * 360;
settings.hueShift = Math.random() * Math.TWO_PI;
settings.maturityAge = 50;
settings.viscosity = 0.05;

jQuery(document).ready(function() {
	// Setup canvas and app
	App.setup();
	
	// Launch animation loop
	App.frame = function() {
		App.update();
		// stop (for now) at an aesthetically cool spot. 
		// Probably makes more sense in update() as we continue to layer things on 
		if(App.stepCount < 3000) {
			App.frame.handle = window.requestAnimationFrame(App.frame);
		}
	};

	App.frame();
});

App.setup = function() {
	// Setup canvas and get canvas context
	var canvas = document.createElement('canvas'),
        scale = window.devicePixelRatio || 1,
        w = window.innerWidth,
        h = window.innerHeight;

	canvas.id = 'ourcanvas';
    canvas.width = w * scale;
    canvas.height = h * scale;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
	
	// Append to DOM
	document.body.appendChild(canvas);
	document.body.addEventListener('click', App.click.bind(this));
	
	// Attach canvas context and dimensions to App
	this.ctx = canvas.getContext('2d');
    this.ctx.scale(scale, scale);
	this.width = w;
	this.height = h;
	
	// Define a few useful elements
	this.stepCount = 0;
	this.xC = this.width / 2;
	this.yC = this.height / 2;
	
	// Particles!
	this.particles = [];
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
	// Rarely give birth to a particle spontaneously
	if (Math.random() > 0.999 && this.particles.length < this.maxPop) this.birth();
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
	// Trace effect
	/*this.ctx.beginPath();
	this.ctx.rect(0, 0, this.width, this.height);
	this.ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
	this.ctx.fill();*/
	
	// Move origin to center stage
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
App.birth = function(xStart, yStart) {

	if (this.particles.length > this.maxPop) return;
	
	var particle = particle || new Particle({
		name: 'particle-' + this.stepCount + '-' + Math.round(10000 * Math.random()),
		angle: Math.random() * Math.TWO_PI,
		xStart: xStart || 0,
		yStart: yStart || 0
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
		// Alex: Cool! I was surprised when I clicked and saw new circles appear
		App.frame();
	}
};
