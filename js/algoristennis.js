/**
 * JS for Algoristennis
 * @authors Alexandre Andrieux <alex@icosacid.com>, Nik Rowell <nik@nikrowell.com>
 * @since 2017-04
 */

var App = {};

Math.TWO_PI = Math.PI * 2;

var settings = {};
// randomize the hue we base the particle color range on
// and randomize the start position of that range
settings.hueBase = Math.random() * 360;
settings.hueShift = Math.random() * Math.TWO_PI;
settings.maturityAge = 50;
settings.blurLayerPeriod = 100;
settings.viscosity = 0.05;
settings.maxFrames = 1500;

var birthPoints = [];

window.addEventListener('DOMContentLoaded', function() {
	// Setup canvas and app
	App.setup();
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

	// Attach canvas context and dimensions to App
	this.ctx = canvas.getContext('2d');
    this.ctx.scale(scale, scale);
	this.width = w;
	this.height = h;

    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

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

App.frame = function() {

    this.update();
    this.draw();
    this.frame.handle = window.requestAnimationFrame(this.frame);

    if(this.stepCount % settings.blurLayerPeriod == 0) {

        // this feels hacky, but it's kinda cool...
        // We're adding a blur layer to create some depth from what's been drawn
        // This could potentially be done with getImageData / putImageData
        // but don't think that would allow changing alpha of the blur layer
        // when drawing it back onto the onscreen canvas.
		// Alex -> I believe it is possible as each pixel has RGBA values,
		// so you would have to for-loop (i += 4) on the image data
		// (and set alphas to ~150, as I think I remember it's 255-based)
		// But yeah it's painful. This solution you wrote below is cool.

        // Managing these layering effects might be easier with something like
        // http://www.createjs.com/easeljs or http://www.pixijs.com/ where there
        // could be an "active" drawing layer on top of some other effects

        var srcCanvas = this.ctx.canvas;
        var blurCanvas = document.createElement('canvas');
        var blurContext = blurCanvas.getContext('2d');

        blurCanvas.width = srcCanvas.width;
        blurCanvas.height = srcCanvas.height;

        // draw the source canvas onto our temp canvas and blur it
        blurContext.drawImage(srcCanvas, 0, 0, window.innerWidth, window.innerHeight);
        StackBlur.canvasRGBA(blurCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 5);

        this.ctx.clearRect(0, 0, srcCanvas.width, srcCanvas.height);
        this.ctx.globalAlpha = 0.75;
        this.ctx.drawImage(blurCanvas, 0, 0);
        this.ctx.globalAlpha = 1;

        // calculate mean birth point
        // maybe the translated canvas makes everything a little more confusing (see particle ~line 35 :)
        // but I read somewhere that multiple translate calls in a single render loop can cause performance issues.
        // Probably only a concern with LOTS of particles. Your thoughts / experience with this?

        var mean = birthPoints.reduce(function(total, item) {

            return {
                x: App.xC + total.x + item.x,
                y: App.yC + total.y + item.y
            };

        }, {x: 0, y: 0});

        mean.x = mean.x / birthPoints.length;
        mean.y = mean.y / birthPoints.length;

        // start somethng else at the center mass, regenerate a particle layer?
        this.ctx.beginPath();
        this.ctx.arc(mean.x, mean.y, 10, 0, Math.TWO_PI);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fill();
		// Yeah. Kill everyone and rebirth at the average point
		// I don't bother seeting particle.dead to true for all, I just clear the array
		this.particles = [];
		this.birth(mean.x - this.xC, mean.y - this.yC);
    }

    if(this.stepCount == settings.maxFrames) {
        window.cancelAnimationFrame(this.frame.handle);
    }

}.bind(App);

App.update = function() {

    this.stepCount++;

    // remove all dead particles from previous frame
    // before looping through again doing calculations
    // this also removes the underscore dependency
    this.particles = this.particles.filter(function(p) {
        return !p.dead;
    });

    for(var i = 0; i < this.particles.length; i++) {
        var particle = this.particles[i];
        particle.update();
    }
};

App.draw = function() {

	// Move origin to center stage
	this.ctx.save();
	this.ctx.translate(this.xC, this.yC);
	//this.ctx.globalCompositeOperation = 'lighter';

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
		angle: Math.random() * Math.TWO_PI,
		xStart: xStart || 0,
		yStart: yStart || 0
	});

	this.particles.push(particle);
    birthPoints.push({x: particle.xStart, y: particle.yStart});
};
