;(function(){
	/* PAGE */
	var jpage = function(options){
		this.set(options);
	}
	
	jpage.prototype = {		
		set : function(options){
			this.cfg = $.extend({
				selection : '.page',
				duration : 1,
				animations : [],
				actions : []
			}, options);
			
			this.book = null;
			this.ready = false;
			
			this.$window = $(window);
			this.$page = $(this.cfg.selection);
			this.$img = this.$page.find('img');
			
			this.length = this.cfg.animations.length;			
			this.parseAnimations();			
			this.timeToPercent = 100/this.cfg.duration;			
			this.setTime(0);			
			
			
			
			
			
			this.loadImages();
			
			return this;
		},
		parseAnimations : function(){			
			var parseArray = function(arr,defValue){
				var frames01 = arr.split(','),frames02,frames03,frames04 = [], frames05 = [];					
				for(var ie = 0; ie < frames01.length;++ie){
					frames02 = frames01[ie].split(':');
					frames03 = [parseFloat(frames02[0]),parseFloat(frames02[1])];
					frames04.push(frames03);
				}				
				if(frames04[0][0]!=0){
					var firstFrame = [0,defValue];				
					frames04.splice(0,0,firstFrame);
				}
				if(frames04[frames04.length-1][0]!=100){
					var lastFrame = [100,frames04[frames04.length-1][1]];				
					frames04.push(lastFrame);
				}				
				// Convert to linear ecuation
				var l = frames04.length -1;
				for(var iee = 0; iee < l;++iee){
					var x1 = frames04[iee][0],
						x2 = frames04[iee + 1][0],
						y1 = frames04[iee][1],
						y2 = frames04[iee + 1][1],
						m = (y2 - y1)/(x2 - x1),				
						b = y1 - (x1 * m),
						ecuat = [x1,m,b];				
					frames05.push(ecuat);
				}
				return frames05;
			}			
			for(var i = 0;i < this.length;++i){								
				this.cfg.animations[i] = $.extend({
					selection : null,
					moveX : 'none',
					moveY : 'none',
					opacity : 'none',
					scale : 'none',
					rotate : 'none',
					blur : 'none',
					saturate : 'none'
				},this.cfg.animations[i]);				
				this.cfg.animations[i].selection = this.$page.find(this.cfg.animations[i].selection);
				if(this.cfg.animations[i].moveX != 'none'){										
					this.cfg.animations[i].moveX = parseArray(this.cfg.animations[i].moveX, 100*parseFloat(this.cfg.animations[i].selection.css('left'))/this.$window.width());
					
				}
				if(this.cfg.animations[i].moveY != 'none'){										
					this.cfg.animations[i].moveY = parseArray(this.cfg.animations[i].moveY, 100*parseFloat(this.cfg.animations[i].selection.css('top'))/this.$window.height());
				}
				if(this.cfg.animations[i].opacity != 'none'){										
					this.cfg.animations[i].opacity = parseArray(this.cfg.animations[i].opacity,parseFloat(this.cfg.animations[i].selection.css('opacity')));
				}
				if(this.cfg.animations[i].scale != 'none'){										
					this.cfg.animations[i].scale = parseArray(this.cfg.animations[i].scale,1);
				}
				if(this.cfg.animations[i].rotate != 'none'){										
					this.cfg.animations[i].rotate = parseArray(this.cfg.animations[i].rotate,0);
				}
				if(this.cfg.animations[i].blur != 'none'){										
					this.cfg.animations[i].blur = parseArray(this.cfg.animations[i].blur,0);
				}
				if(this.cfg.animations[i].saturate != 'none'){										
					this.cfg.animations[i].saturate = parseArray(this.cfg.animations[i].saturate,1);
				}
			}
			return this;
		},
		setTime : function(val){
			this.timeCursor = this.timeToPercent * val;
			if(this.timeCursor < 0) this.timeCursor = 0;
			if(this.timeCursor > 99.99) this.timeCursor = 99.9999;
			this.playActions().animate();
			return this;
		},
		playActions : function(){
			var l = this.cfg.actions.length;
			for(var i=0;i<l;i++){
				if(this.timeCursor >= this.cfg.actions[i].time){
					this.cfg.actions[i].action();
					this.cfg.actions.splice(i, 1);
					i = 9999999;
				}
			}
			return this;
		},
		animate : function(){			 
			for(var i = 0;i < this.length;++i){
				var objValues = {},transformations = '', filters = '';
				if(this.cfg.animations[i].moveX != 'none'){
					objValues.left = this.calcNewValue(this.cfg.animations[i].moveX)+'%';
				}
				if(this.cfg.animations[i].moveY != 'none'){					
					objValues.top = this.calcNewValue(this.cfg.animations[i].moveY)+'%';				
				}
				if(this.cfg.animations[i].opacity != 'none'){
					objValues.opacity = this.calcNewValue(this.cfg.animations[i].opacity);
				}
				if(this.cfg.animations[i].scale != 'none'){
					transformations += 'scale('+this.calcNewValue(this.cfg.animations[i].scale)+')';
				}
				if(this.cfg.animations[i].rotate != 'none'){
					transformations += ' rotate('+this.calcNewValue(this.cfg.animations[i].rotate)+'deg)';
				}
				if(this.cfg.animations[i].blur != 'none'){
					filters += 'blur('+this.calcNewValue(this.cfg.animations[i].blur)+'px)';
				}
				if(this.cfg.animations[i].saturate != 'none'){
					filters += ' saturate('+this.calcNewValue(this.cfg.animations[i].saturate)+')';
				}
				if(transformations != ''){
					objValues.transform = transformations;
				}
				if(filters != ''){
					objValues.filter = filters;
					objValues.webkitFilter = filters;
					objValues.mozFilter = filters;
					objValues.oFilter = filters;
					objValues.msFilter = filters;
				}
				this.cfg.animations[i].selection.css(objValues);
			}
			return this;
		},
		calcNewValue : function(arr){
			var l = arr.length, newValue;
			for(var ie=0;ie<l;++ie){
				try{
					var topValue = arr[ie+1][0];
				}catch(e){
					var topValue = 100;
				}						
				if(this.timeCursor >= arr[ie][0] && this.timeCursor < topValue){							
					// y = mx +b
					newValue = arr[ie][1] * this.timeCursor + arr[ie][2];	
					ie = 999999;
				}
			}
			return newValue;
		},
		loadImages : function(){
			var l = this.$img.length,
				c = 0,
				self = this;
			if(l>0){
				this.$img.each(function(){
					var srcWait = $(this).attr('srcwait');
					if(srcWait != undefined){
						$(this).attr('src',srcWait+ '?'+Math.round(Math.random(1)*9999999999));
					}			
				}).load(function(){
					++c;				
					if(c>=l) self.ready = true;			      
				});
			}else{
				this.ready = true;	
			}			
			return this;
		}
	}
	
	
	if(!window.jpage) window.jpage = function(options){
		return new jpage(options);
	};

	/* BOOK */
	var jbook = function(options){
		this.set(options);
	}
	
	jbook.prototype = {		
		set : function(options){			
			this.idSel = options || 'jb';			
			
			// Store Elements			
			this.$window = $(window);			
			this.$b = $('#'+this.idSel);						
			this.$pages = this.$b.find('.page');						
			this.$book = this.$b.find('.pageContainer').css('width',(this.$pages.length*100)+'%');			
			
			// Flags
			this.started = false;
			this.dragging = false;
			this.animating = false;
			
			// Variables
			this.pages = [];
			this.current = 0;
			this.length = 0;
			this.timeCursor = 0;
			this.difTime = 0;
			this.timeline = [0];
			this.mousepress = false;
			this.x = 0;
			this.dx = 0;
			this.xToGo = 0;
			this.limitChangePagePercent = .3;
			this.animateTimer = null;
			this.acceleration = .2;
			
			this.pagesReady = 0;
			
			// Start
			this.setTimeline().setSizes().setEvents();
			
			return this;
		},
		start : function(){			
			this.loadPages();			
			return this;
		},
		loadPages : function(){
			this.pages[0].loadImages();	
			var self = this,
				loadPageTimer = setInterval(function(){				
					if(self.pages[self.pagesReady].ready){						
						if(self.pagesReady == 1){
							//Start the book
							self.startBook();
						}
						++self.pagesReady;
						self.setSizes();
						if(self.pagesReady < self.length){
							self.pages[self.pagesReady].loadImages();
						}else{
							clearInterval(loadPageTimer);
							self.pagesReady = self.length;
						}
					}
				},100);
			return this;
		},
		startBook : function(){			
			this.$b.addClass('grabbable');
			this.started = true;
			return this;
		},
		addPage : function(newPage){
			newPage.book = this;
			this.pages.push(newPage);
			this.length++;
			this.setTimeline().setSizes();
			return this;
		},
		setTimeline : function(){
			this.timeline = [0];			
			var countTime = 0;
			for(var i = 0; i<this.length;i++){
				countTime += this.pages[i].cfg.duration;
				this.timeline.push(countTime);
			}
			return this;
		},
		setSizes : function(){
			this.width = this.$window.width();
			this.$pages.width(this.width);
			this.limitChangePage = this.limitChangePagePercent * this.width;
			this.x = -1 * this.current * this.width;
			this.xToGo = this.x;
			this.$book.css('left', this.x +'px');
			this.maxX = 0;
			this.minX = -1 * (this.pagesReady - 1) * this.width;
			return this;
		},
		setEvents : function(){
			var self = this;
			this.$book.mousedown(function(e){self.onMouseDown(e);return false;});
			$('body').mousemove(function(e){self.onMouseMove(e);}).mouseup(function(){self.onMouseUp();});
			
			this.$window.resize(function(){self.setSizes();});
			return this;
		},
		mouseCursor : function(flag){			
			if(flag){
				this.$b.addClass('grabbing');
			}else{
				this.$b.removeClass('grabbing');
			}
			return this;
		},
		onMouseDown : function(e){
			if(this.started){
				if(!this.animating){
					this.mousepress = true;
					this.difTime = e.pageX + this.timeCursor;
				}
				this.mouseCursor(true);
			}
			return this;
		},
		onMouseMove : function(e){
			if(this.started){
				if(this.mousepress) this.mouseMoving(e);
			}
			return this;
		},
		onMouseUp : function(){
			if(this.started){
				this.mouseCursor(false).mousepress = false;
				if(this.dragging){
					this.dx = null;
					this.dragging = false;
					this.setPage().animate();
				}
			}
			return this;
		},
		mouseMoving : function(e){			
			this.timeCursor = this.difTime - e.pageX;			
			
			if(this.timeCursor < this.timeline[this.current]){
				this.timeCursor = this.timeline[this.current];
				if(!this.dragging) this.pages[this.current].setTime(this.timeCursor-this.timeline[this.current]);
				this.drag(e);
			}else if(this.timeCursor > this.timeline[this.current+1]){
				this.timeCursor = this.timeline[this.current+1];
				if(!this.dragging) this.pages[this.current].setTime(this.timeCursor-this.timeline[this.current]);
				this.drag(e);
			}else{
				this.dx = null;
				this.dragging = false;
				this.pages[this.current].setTime(this.timeCursor-this.timeline[this.current]);
			}
			
			return this;
		},
		drag : function(e){
			if(this.dx == null){
				this.dx = e.pageX - this.$book.offset().left;
				this.dragging = true;
			}
			this.x = e.pageX - this.dx;			
			if(this.x > this.maxX) this.x = this.maxX;
			if(this.x < this.minX) this.x = this.minX;
			this.$book.css('left', this.x +'px');
			return this;
		},
		setPage : function(){
			var prevPage = this.current;
			if(this.x < (this.xToGo - this.limitChangePage)) this.current++;
			if(this.x > (this.xToGo + this.limitChangePage)) this.current--;			
			if(prevPage != this.current){
				this.xToGo = -1 * this.current * this.width;
				this.changingPage = true;
			}		
			return this;
		},
		animate : function(){
			var self = this,
				difX = 0;
			if(this.animateTimer == null){
				// Start Animate				
				this.animateTimer = setInterval(function(){
					self.animating = true;
					// Animate
					difX =  (self.x - self.xToGo)*self.acceleration;
					self.x = self.x - difX;						
					if(Math.abs(difX) < .2){
						self.x = self.xToGo;
						difX = 0;
					}						
					self.$book.css('left', self.x +'px');
					if(Math.abs(difX) < 10)	self.animating = false;										
					if(difX == 0){
						// Stop Animate
						clearInterval(self.animateTimer);
						self.animateTimer = null;						
						
						if(self.changingPage){
							self.changingPage = false;
							// Accion de cambio de Pagina
						}					
					}
				},20);
			}
			return this;
		}
	}
	if(!window.jbook) window.jbook = function(options){
		return new jbook(options);
	};	
})();
