var imgs = document.querySelectorAll('img');
var caption = document.querySelectorAll('figcaption');
var imgs_l = imgs.length;
window.addEventListener('mouseover', function(event) {
	for(var i=0; i<imgs_l; i++) {
		if(event.target == imgs[i]) {
			var old_coords = {
				en_x : imgs[i].x,
				en_y : imgs[i].y
			};
			expand(imgs[i], old_coords, caption[i]);
		}
	}
});

function expand(img, old_pos, cap) {
	img.style.visibility = 'hidden';
	var milieu_x = old_pos.en_x + img.width/2;
	var milieu_y = old_pos.en_y + img.height/2;
	var big = document.createElement('img');
		big.src = img.src;
		big.className = 'big_img';
		var big_w = big.width;
		var big_h = big.height;
		big.width = img.width;
		big.style.position = 'absolute';
		big.style.left = milieu_x - img.width/2 + 'px';
		big.style.top = milieu_y - img.height/2 + 'px';				
	img.parentElement.appendChild(big);
	if(cap) {
		var legende = document.createElement('span');
			legende.className = 'legende';
			legende.style.width = img.width + 'px';
			legende.innerHTML = cap.innerHTML;
			legende.style.left = milieu_x - img.width/2 + 'px';
			legende.style.top = milieu_y + img.height/2 + 'px';
		cap.parentElement.appendChild(legende);
	}
	big.addEventListener('mouseover', () => {
		grow(big, big_w, big_h, img.width, img.height, legende);
	});
	big.addEventListener('mouseout', () => {
			shrink(big, img, legende);
		});
}

function grow(img, taille_w, taille_h, o, j, legende) {
	img.width = taille_w;
	var mil_x = taille_w/2 - o/2;
	var mil_y = taille_h/2 - j/2;
	img.style.transform = 'translate(-' + mil_x + 'px, -' + mil_y + 'px)';
	if(legende) {
		legende.style.width = taille_w + 'px';
		legende.style.transform = 'translate(-' + mil_x + 'px, ' + mil_y + 'px)';
	}
}
			
function shrink(big, img, legende) {
	big.width = img.width;
	big.style.transform = 'translate(0px, 0px)';
	setTimeout(function() {
		big.parentElement.removeChild(big);
	}, 450);
	img.style.visibility = 'visible';
	if(legende) {
		legende.style.width = img.width + 'px';
		legende.style.transform = 'translate(0px, 0px)';
		setTimeout(function() {
			legende.parentElement.removeChild(legende);
		}, 450);
	}
}