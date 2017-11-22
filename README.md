# Captain-Search

**Captain Search** est un petit widget écrit en JavaScript permettant de rechercher dans un tableau avec un système d'auto-completion dans un input de type `text` (ou `search`).

L'initialisation est simple :

```javascript
const frenchCities = ['Monaco', 'Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Saint-Etienne', 'Rennes', 'Troyes', 'Metz', 'Strasbourg', 'Lille', 'Nantes', 'Amiens', 'Caen', 'Montpelier', 'Guingamps', 'Dijon', 'Toulouse', 'Angers'];

let search = new cptSearch('#mySearchInput', false, frenchCities);
```
L'objet prend trois arguments :

1. `elem` :
	L'input de recherche à donner par un selecteur CSS.
2. `table` :
	Tableau de valeurs où l'on effectue la recherche.
3. `multi` :
	Permet d'afficher une collection d'items dans l'input par la recherche ou qu'un seul. Pour l'instant pas encore mis en place !


## Quelques pré-requis

1. Ajouter la feuille de style CSS (et la modifier pour l'adapter au design général)
```html
<link rel="stylesheet" href="search.css" />
```

2. Préparer l'environnement adéquate dans le fichier HTML
Mettre en place le minimum, un input, et un encart pour afficher les résultats :

```html
<!-- Pour l'instant, on force le formulaire à ne rien envoyer en appuyant sur "Enter" -->
<form onsubmit="return false;">
  <label for="mySearchInput">Search for a city</label><input type="text" placeholder="ex: Nice" id="mySearchInput" autocomplete="off" />
  <div class="results"></div>
</form>
```
