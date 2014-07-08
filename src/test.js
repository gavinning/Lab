var Image = require('./images');
var img, opt;


opt = {
	mark: '2.png',
	min : 0.9,
	log : true,
	maxWidth: 950
}

img = new Image(opt);

// console.log(img)
img('/Users/gavinning/Pictures/2.png', '/Users/gavinning/Pictures/out.png').width(400).run();