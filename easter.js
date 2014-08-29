/*
 * Konami-JS ~ 
 * :: Now with support for touch events and multiple instances for 
 * :: those situations that call for multiple easter eggs!
 * Code: http://konami-js.googlecode.com/
 * Examples: http://www.snaptortoise.com/konami-js
 * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
 * Version: 1.4.2 (9/2/2013)
 * Licensed under the MIT License (http://opensource.org/licenses/MIT)
 * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+
 */

var Konami = function (callback) {
	var konami = {
		addEvent: function (obj, type, fn, ref_obj) {
			if (obj.addEventListener)
				obj.addEventListener(type, fn, false);
			else if (obj.attachEvent) {
				// IE
				obj["e" + type + fn] = fn;
				obj[type + fn] = function () {
					obj["e" + type + fn](window.event, ref_obj);
				}
				obj.attachEvent("on" + type, obj[type + fn]);
			}
		},
		input: "",
		pattern: "38384040373937396665",
		load: function (link) {
			this.addEvent(document, "keydown", function (e, ref_obj) {
				if (ref_obj) konami = ref_obj; // IE
				konami.input += e ? e.keyCode : event.keyCode;
				if (konami.input.length > konami.pattern.length)
					konami.input = konami.input.substr((konami.input.length - konami.pattern.length));
				if (konami.input == konami.pattern) {
					konami.code(link);
					konami.input = "";
					e.preventDefault();
					return false;
				}
			}, this);
		},
		code: function (link) {
			window.location = link
		}
	}

	typeof callback === "string" && konami.load(callback);
	if (typeof callback === "function") {
		konami.code = callback;
		konami.load();
	}

	return konami;
};
 

Math.easeInSine = function (t, b, c, d) {
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
};

/**
 * Easter fuzz
 * */

var Easter = function(){
    var easter = {
        canvas : null,
        img: null,
        ctx : null,
        msStart : null,
        aframe : null,
        pic: '/assets/images/easter.gif',
        init : function(){
            this.setCanvas();

            // added toggle to get 30 FPS instead of 60 FPS
            var toggle = true,
                _self = this;
            (function loop() {
                toggle = !toggle;
                if (toggle) {
                    _self.aframe = requestAnimationFrame(loop);
                    return;
                }
                var cont = _self.noise(_self.ctx);
                if (cont) {
                    _self.aframe = requestAnimationFrame(loop);
                }
                else {
                    _self.bam();
                }
            })();
        },
        bam: function() {
            this.img = document.createElement('div');
            this.img.style.backgroundImage = 'url(' + this.pic + ')';
            this.img.style.backgroundPosition = 'center center';
            this.img.style.backgroundRepeat = 'no-repeat';
            this.img.style.position = 'fixed';
            this.img.style.top = 0;
            this.img.style.zIndex = 1002;
            this.img.style.height = '100vh';
            this.img.style.width = '100vw';
            document.body.insertBefore(this.img, document.body.firstChild);
            var _self = this;
            document.onkeypress = function (e) {
                _self.cleanup();
                e.target.removeEventListener(e.type, listener)
            };
            document.onmouseover = function(e) {
                _self.cleanup();
                e.target.removeEventListener(e.type, listener)
            }
        },
        cleanup : function() {
            cancelAnimationFrame(this.afram);
            this.img.parentNode.removeChild(this.img);
            this.canvas.parentNode.removeChild(this.canvas);
        },
        setCanvas : function() {
            this.canvas = document.createElement('canvas');
            document.body.insertBefore(this.canvas, document.body.firstChild);
            this.canvas.style.position = 'fixed';
            this.canvas.style.zIndex = 1001;
            this.canvas.style.top = 0;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';

            this.ctx = this.canvas.getContext('2d')
        },
        noise : function(ctx) {
            var w = ctx.canvas.width,
                h = ctx.canvas.height,
                idata = ctx.createImageData(w, h),
                buffer32 = new Uint32Array(idata.data.buffer),
                len = buffer32.length,
                i = 0,
                t = 0;

            for(; i < len;i++) {
                t = this.getNoiseThreshold();
                if (Math.random() < t){
                    buffer32[i] = 0xff000000;
                }
            }
                 
            ctx.putImageData(idata, 0, 0);
            if (t > 0.99) {
                ctx.fillStyle="#000000";
                ctx.rect(0,0,2000,2000);
                ctx.fill();
                return false;
            }
            return true;
        },
        getNoiseThreshold : function() {
            this.msStart = (!this.msStart ? Date.now() : this.msStart);
            var elapsed = Date.now() - this.msStart,
                rate = 4000,
                threshold = (elapsed % rate) / rate;
            return threshold;
            
        }
    };

    easter.init();
};

Konami(Easter);

