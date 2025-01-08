import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

await imagemin(['./*.{jpg,png}'], {
	destination: 'build/',
	plugins: [
		imageminWebp({quality: 50})
	]
});

console.log('Images optimized');
