$('document').ready(function(){
	
	var princessBook = jbook(),
		page1 = jpage({sel:'.page0'}),
		page2 = jpage({sel:'.page1'}),
		page3 = jpage({sel:'.page2'})
		
		
		
		;
	
	princessBook
	.add(page1)
	.add(page2)
	.add(page3)
	.start();
});
