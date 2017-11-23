'use strict';
	
/**
 *
 * @author Laurelien <https://www.github.com/Laurelien>
 * @name Captain Search
 *
 * @description Le composant de recherche
 * @param {string} elem L'input de recherche à donner par un selecteur CSS
 * @param {array} table Tableau de valeurs où l'on effectue la recherche
 * @param {boolean} multi Permet d'afficher une collection d'items dans l'input par la recherche ou qu'un seul
 */

let cptSearch = function(elem, originalTable, multi) {
	let table = originalTable.slice();
	this.table = table; // Tableau d'items
	this.el = document.querySelector(elem); // Input où chercher
		
	this.parent = this.el.parentElement; // l'englobant
	this.results = this.parent.lastElementChild; // la dernière div de l'englobant qui affiche les résultats
	
	let selectedResult = -1; // Quel resultat est "selectionné" dans liste, (-1 = aucun)
		
	let toShow = []; // Tableau intermédiaire des résultats à montrer
	let previousValue = this.el.value;
	
	let that = this;
	
	/**
	 * init
	 *
	 * @description Initialisation du widget de recherche
	 */
	
	(function init() {
		if(typeof multi !== 'boolean') {
			that.multi = true;
		} else {
			that.multi = multi;
		}
		if(that.multi === true) {
			// Création de l'englobant
			let globalInput = document.createElement('div');
				globalInput.className = 'globalInput';
				that.parent.insertBefore(globalInput, that.results);
				globalInput.appendChild(that.el);
			that.globalInput = globalInput;
			// Création de la liste des éléments
			let liste = document.createElement('ul');
			globalInput.insertBefore(liste, that.el);
			globalInput.addEventListener('click', function(e) {
				that.el.focus();
			});
		}
		// Création de la liste de choix
		attachEvents(that.el);
	})();
	
	/**
	 * attachEvents
	 *
	 * @description Attache plusieurs évennements à l'input 
	 * @param {HTMLElement} input L'input de recherche
	 */
	
	function attachEvents(input) {
		input.addEventListener('keyup', function(e) {
			position();
			let possibles = that.results.getElementsByTagName('span');
			// Si on modifie l'input
			if(that.el.value !== previousValue) {
				write(input);
				previousValue = that.el.value;
				selectedResult = -1;
			}
			// Si on descend
			if(e.keyCode === 40 && selectedResult < possibles.length - 1 && that.el.value !== '') {
				that.results.style.display = 'flex';
				if (selectedResult > -1) { // Cette condition évite une modification de childNodes[-1], qui n'existe pas, bien entendu
					possibles[selectedResult].className = 'possible';
				}	
				possibles[++selectedResult].className = 'possible focus';
			}
			// Si on monte
			else if(e.keyCode === 38 && selectedResult > -1 && that.el.value !== '') {
				possibles[selectedResult--].className = 'possible';	
				if (selectedResult > -1) { // Cette condition évite une modification de childNodes[-1], qui n'existe pas, bien entendu
					possibles[selectedResult].className = 'possible focus';
				}
			}
			// Si on clique sur entrer (à voir à ne pas envoyer le formulaire)
			else if(e.keyCode === 13 && selectedResult > -1) {
				choose(possibles[selectedResult]);
			}
			// Si on supprime (multi = true)
		});
	}
	
	/**
	 * write
	 *
	 * @description L'évennement d'écrire dans l'input de recherche
	 * @param {HTMLElement} input L'input de recherche
	 */	
	
	function write(input) {
		// Première lettre en majuscule
		if(input.value.length === 1) {
			input.value = input.value.toUpperCase();
		}
		// On empêche de commencer par un espace
		if(input.value === ' ') {
			input.value = '';
		}
		if(input.value.length > 0) {
			toShow.length = 0;
			that.results.style.display = 'flex';
			for(let i=0, tableLen = that.table.length; i<tableLen; i++) {
				if(cap(input.value) === table[i].slice(0, input.value.length)) {
					toShow.push(table[i]);
				}
			}
			affiche(toShow);
		} else {
			that.results.style.display = 'none';
		}
	}
	
	/**
	 * affiche
	 *
	 * @description Affiche la liste des résultats possibles de la recherche
	 * @param {Array} items Tableau des valeurs
	 */
	
	function affiche(items) {
		// console.log(items);
		that.results.innerHTML = '';
		for(let i = 0, itemsLen = items.length; i<itemsLen; i++) {
			let span = document.createElement('span');
				span.innerHTML = items[i];
				span.className = 'possible';
				span.addEventListener('click', function(e) {
					choose(e.target);
				});
			that.results.appendChild(span);
		}
	}
	
	/**
	 * choose
	 *
	 * @description Validation d'une valeur particulière dans la liste
	 * @param {String} value Valeur sélectionnée
	 */
	
	function choose(value) {
		if(that.multi === false) {
			that.el.value = previousValue = value.innerHTML;
		} else {
			// Création du tag
			let liste = that.globalInput.firstElementChild;
			let tag = document.createElement('span');
				tag.innerHTML = value.innerHTML;
				tag.className = 'tag';
			let suppr = document.createElement('span');
				suppr.innerHTML = '&times;';
				suppr.addEventListener('click', function(e) {
					supprTag(e.target.parentElement);
				});
			tag.appendChild(suppr);
			liste.appendChild(tag);
			that.el.value = '';
			// On retire du tableau la valeur sélectionnée pour ne pas la selectionner deux fois
			let pos = that.table.indexOf(value.innerHTML);
			that.table.splice(pos, 1);
			// console.log(that.table);
		}
		that.results.style.display = 'none';
		value.className = 'possible';
		selectedResult = -1;
		that.el.focus();
	}
	
	function supprTag(tag) {
		let parent = tag.parentElement;
		parent.removeChild(tag);
		// On ré-intègre dans le tableau la valeur supprimée
		that.table.push(tag.firstChild.data);
		// console.log(that.table);
	}
	
	/**
	 * position
	 *
	 * @description Positionner la liste en fonction de la position de l'input
	 * @param Aucun
	 */
	
	function position() {		
		if(that.multi === false) {
			/* Les dimensions et positions de l'input pour que le bloc de résultats soit de la même taille */
			let elWidth = that.el.offsetWidth;
			let elHeight = that.el.offsetHeight;
			let elLeft = that.el.offsetLeft;
			let elTop = that.el.offsetTop;
			
			/* On donne une dimension et un placement lié à l'input */
			that.results.style.width = elWidth + 'px';
			that.results.style.position = 'absolute';
			that.results.style.left = elLeft + 'px';
			that.results.style.top = elHeight + elTop + 5 + 'px';
			that.results.style.zIndex = 100;
		} else {
			/* Les dimensions et positions de l'englobant */
			let globalWidth = that.globalInput.offsetWidth;
			let globalHeight = that.globalInput.offsetHeight;
			let globalLeft = that.globalInput.offsetLeft;
			let globalTop = that.globalInput.offsetTop;
			
			/* On adapte la liste en fonction */
			that.results.style.position = 'absolute';
			that.results.style.width = globalWidth + 'px';
			that.results.style.top = globalHeight + globalTop + 5 + 'px';
		}
	}
	
	/**
	 * cap
	 *
	 * @description Rend la première lettre en capitale de manière "fantôme"
	 * @param {String} str Chaîne de caractère à donner une majuscule
	 * @return {String} La chaîne de caractère avec la majuscule
	 */
	
	function cap(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
    }
}
