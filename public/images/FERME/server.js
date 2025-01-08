import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

await imagemin(['./*.{webp,jpg,png}'], {
	destination: './',
	plugins: [
		imageminWebp({quality: 10})
	]
});

console.log('Images optimized');
