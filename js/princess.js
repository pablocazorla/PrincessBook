$('document').ready(function(){	
	var princessBook = jbook(),
		page0 = jpage({
			selection:'.page0',
			duration : 10}),
		page1 = jpage({
			selection:'.page1',
			duration : 1600,
			animations : [
				{
					selection : '#sprite1',
					moveX : '100:10',
					moveY : '0:5,100:60',
					opacity : '0:0,40:1',
					scale : '0:1,60:0.5,100:0.5',
					rotate : '45:45'
				},{
					selection : '#sprite3',
					opacity : '80:1,100:0'
				},{
					selection : '#sprite2',
					moveX : '100:20',
					moveY : '100:90',
					opacity : '80:0.1',
					scale : '0:1,60:0.5,100:0.5',
					rotate : '75:-45',
					blur : '20:5',
					saturate : '40:0'
				}
			],
			actions : [
				{
					time : 60,
					action : function(){
						$('#sprite3').animate({'left':'2%'},4000);
					}
				}
			]
		}),
		page2 = jpage({
			selection:'.page2',
			duration : 2000,
			animations : [
				{
					selection : '#sprite4',
					moveX : '100:10',
					opacity : '0:0,40:1',
					scale : '0:1,60:0.5,100:0.5',
					rotate : '45:45'
				},{
					selection : '#sprite5',
					moveX : '100:30',
					opacity : '80:0.1',
					scale : '0:1,60:0.5,100:0.5',
					rotate : '75:-45'
				}
			]			
		});
	
	princessBook.addPage(page0).addPage(page1).addPage(page2).start();
});
