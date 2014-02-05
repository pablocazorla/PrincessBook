;(function(){
	/* PAGE */
	var jpage = function(options){
		this.set(options);
	}
	
	jpage.prototype = {		
		book : null,
		set : function(options){
			this.cfg = $.extend({
				sel : ''
			}, options);
			
			this.$page = $(this.cfg.sel);
			
			
			this.timecursor = 0;
			
			this.timeInit = 0;
			this.timeEnd = 2014;
			
			
			
			this.dragging = false;
			
			
			return this;
		},
		start : function(){
			this.drag();
			return this;
		},
		drag : function(){
			var self = this,
				dx = 0,
				onLimitLeft = false;
				onLimitRight = false;		
			this.$page.mousedown(function(e){
				self.book.off();			
				dx = e.pageX + self.timecursor;
				
				onLimitLeft = false;
				onLimitRight = false;
				
				if(self.timecursor == self.timeInit || self.timecursor == self.timeEnd){
					onLimitLeft = true;
				}				
				if(self.timecursor == self.timeEnd){
					onLimitRight = true;
				}
				
				
				self.dragging = true;				
			});			
			$('body')
			.mousemove(function(e){
				if(self.dragging){
					var onLimitLeftMove = false,
						onLimitRightMove = false;
					
					
					
					self.timecursor = dx - e.pageX;
					
					if(self.timecursor < self.timeInit){
						self.timecursor = self.timeInit;
						onLimitLeftMove = true;						
					}
					if(self.timecursor > self.timeEnd){
						self.timecursor = self.timeEnd;
						onLimitRightMove = true;						
					}
					
					if((onLimitLeftMove && onLimitLeft) || (onLimitRightMove && onLimitRight)){
						self.book.on();
					}
					
					
					
					
					console.log(self.timecursor);				
				}
			})
			.mouseup(function(){			
				self.dragging = false;
			});
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
			
			this.cfg = $.extend({
				id : 'jb'
			}, options);
			
			this.$window = $(window);			
			this.$b = $('#'+this.cfg.id);			
			this.$pages = this.$b.find('.page');
						
			this.$book = this.$b.find('.pageContainer').css('width',(this.$pages.length*100)+'%');			
			
			// Drag *************************
			this.dragging = false;			
			this.limit = 0;			
		
			// Animate ****************/	
			this.x = 0;
			this.xToGo = 0;
			this.animateTimer = null;
			this.velocity = .2;	
			
			// Change page ****************/
			this.changingPage = false;
			this.currentPage = 0;
			this.limitChangePagePercent = .3;
			
			// Pages ****************/
			this.pages = [];
			this.length = 0;
			//
			this.sizing().on();
			
			return this;
		},
		start : function(){
			this.drag();
			return this;
		},		
		add : function(page){			
			page.book = this;
			this.pages.push(page);
			this.length++;
			this.setSize();
			return this;
		},		
		
		on : function(){
			this.active = true;
			return this;
		},
		off : function(){
			this.active = false;
			return this;
		},
		drag : function(){			
			var self = this,
				dx = 0;			
			this.$book.mousedown(function(e){
				if(!self.changingPage){
					dx = e.pageX - self.$book.offset().left;
					self.dragging = true;
				}
			});			
			$('body')
			.mousemove(function(e){
				if(self.dragging  && self.active){
					self.x = e.pageX - dx;
					if(self.x > self.limitL){
						self.x = self.limitL;
					}
					if(self.x < self.limitR){
						self.x = self.limitR;
					}
					self.$book.css('left', self.x +'px');					
				}
			})
			.mouseup(function(){
				if(self.dragging){
					self.velocity = .2;
					self.setPage().animate();
				}
				self.dragging = false;
			});
			return this;
		},
		setPage : function(){
			var prevPage = this.currentPage;
			if(this.x < (this.xToGo - this.limitChangePage)) this.currentPage++;
			if(this.x > (this.xToGo + this.limitChangePage)) this.currentPage--;			
			if(prevPage != this.currentPage){
				this.xToGo = -1 * this.currentPage * this.width;
				this.velocity = .08;
				this.changingPage = true;
			}					
			return this;
		},
		setSize : function(){
			this.width = this.$window.width();
			this.$pages.width(this.width);
			this.limitL = this.limit* this.width;
			this.limitR = -1*this.width*this.length+(1-this.limit)*this.width;					
			this.limitChangePage = this.limitChangePagePercent * this.width;
			this.x = -1 * this.currentPage * this.width;
			this.xToGo = this.x;
			this.$book.css('left', this.x +'px');
			return this;
		},
		sizing : function(){	
			var self = this;
			this.setSize().$window.resize(function(){self.setSize()});
			return this;
		},
		animate : function(){
			var self = this,
				dx = 0;			
			if(this.animateTimer == null){
				// Start Animate				
				this.animateTimer = setInterval(function(){
					if(!self.dragging){	
						// Animate
						dx = self.velocity * (self.x - self.xToGo);
						self.x = self.x - dx;						
						if(Math.abs(dx) < .2){
							self.x = self.xToGo;
							dx = 0;
						}						
						self.$book.css('left', self.x +'px');						
						if(dx == 0){
							// Stop Animate
							clearInterval(self.animateTimer);
							self.animateTimer = null;
							
							if(self.changingPage){
								self.changingPage = false;
								self.off().pages[self.currentPage].start();
							}					
						}						
					}
				},20);
			}
		}
	}
	if(!window.jbook) window.jbook = function(options){
		return new jbook(options);
	};	
})();
