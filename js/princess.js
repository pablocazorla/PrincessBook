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
					opacity : '0:0,10:1',
				}
			]
		}),
		page2 = jpage({
			selection:'.page2',
			duration : 1000});
		/*page1 = jpage({selection:'.page1',duration : 1600}),
		page2 = jpage({selection:'.page2',duration : 800}),
		page3 = jpage({selection:'.page3',duration : 2600}),
		page4 = jpage({selection:'.page4',duration : 400}),
		page5 = jpage({selection:'.page5',duration : 2100});*/
	
	princessBook
	.addPage(page0).addPage(page1).addPage(page2);
	/*
	.addPage(page2)
	.addPage(page3)
	.addPage(page4)
	.addPage(page5);*/

});
