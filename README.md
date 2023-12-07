# GPS tracker

Web app to POC GPS tracking from browser on a smartphone.

<a href="https://brsjrn-gps-tracking.netlify.app/" target="_blank">Demo</a>

# Libraries
- Leaflet.js : https://leafletjs.com/

# Ressources
- How to calculate distance between GPS positions : http://www.movable-type.co.uk/scripts/latlong.html

## Versions

### Backlog
- [ ] Attendre X secondes après le start le temps de calibrage du GPS
- [ ] Utilisation des Signaux javascript pour update de l'interface
- [ ] Calculer vitesse moyenne
- [ ] Calculer frais kilométriques
- [ ] Distance en mètres tant qu'il y a moins d'1kg de parcouru
- [ ] Modals Bootstrap pour annuler, reset, terminer
- [ ] PWA (local storage, icone bureau, ...)
- [ ] Récupérer le Timestamp depuis l'objet Geolocation.position
- [ ] Alert quand le GPS n'est pas actif
- [ ] Option afficher / cacher map
  - [ ] Tester ressources utilisés avec et sans map

### v0.1.5
- [x] Carte (https://leafletjs.com/)
- [x] !!! Filtrer les positions statiques : si 2 positions simultannées sont trop proches, on n'enregistre pas la 2nd (et on retest la suite par rapport à la 1ere)

### v0.1.4 (current)
- [x] Systeme de "voyages"
- [x] Refacto POO JS- 
- [x] Track : btn "annuler" en plus de "terminer
- [x] Redesign avec Bootstrap

### v0.1.3
- [x] Responsive smartphone
- [x] Lien vers Github
- [x] Apparition des positions par le haut dans le tableau d'historique
- [x] Ajout colonne Timestamp dans le tableau d'historique 

### v0.1.2
- [x] Distance parcourue
- [x] Deploy en page static hébergement test
- [x] Test depuis le smartphone

### v0.1.1
- [x] Bouton pour débuter et arrêter le tracking
- [x] Gestion Geolocalisation Javascript
- [x] Affichage des données en direct




