Déploiement sur plateformes mobiles
===================================

Nous avons utilisé PhoneGap en le connectant directement à notre dépôt gitHub

Plusieurs adaptations ont été nécessaires

- Un petit bout de js embarqué dans toutes les pages web pour changer dynamiquement la taille du logo sur mobile

- Idem pour changer la taille de la Q-Table

- Pour éviter que notre application ne demande trop de permissions, on a utilisé un fichier [config.xml](https://build.phonegap.com/docs/config-xml)

- On a cahngé la taille par défaut de l'aire de jeu de 15x10 à 6x6
