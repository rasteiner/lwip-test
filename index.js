
var lwip = require('lwip');
lwip.open('./cat.jpg', function(err, img) {
	var w = img.width(), h = img.height();
	var pixels = w*h;

	var rgb, result;
	var start, end;

	function getPixel(buf, x, y) {
		return [buf[x+y*w], buf[(w*h)+(x+y*w)], buf[(2*w*h)+(x+y*w)]];
	}


	function local() {
		var avg = [0,0,0];	
		var pixbuf = img.__lwip.buffer();

		for(var x = 0; x < w; x++) {
			for(var y = 0; y < h; y++) {
				rgb = getPixel(pixbuf,x,y);
				avg[0] += rgb[0];
				avg[1] += rgb[1];
				avg[2] += rgb[2];
			}
		}

		avg[0] /= pixels;
		avg[1] /= pixels;
		avg[2] /= pixels;

		return (avg);
	}


	function binding() {
		var avg = [0,0,0];	

		for(var x = 0; x < w; x++) {
			for(var y = 0; y < h; y++) {
				rgb = img.getPixel(x,y);
				avg[0] += rgb.r;
				avg[1] += rgb.g;
				avg[2] += rgb.b;
			}
		}

		avg[0] /= pixels;
		avg[1] /= pixels;
		avg[2] /= pixels;

		return (avg);
	}

	var i;

	console.log('getPixel with only Javascript');
	start = process.hrtime();
	for(i = 0; i < 50; i++) {
		result = local();
	}
	end = process.hrtime(start);
	console.log('result: ', result);
	console.log('time: ', end);
	console.log('------------------------');

	console.log('getPixel through binding');
	start = process.hrtime();
	for(i = 0; i < 50; i++) {
		result = binding();
	}
	end = process.hrtime(start);
	console.log('result: ', result);
	console.log('time: ', end);
	
});