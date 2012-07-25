# Déploiement sur plateformes mobiles

Nous avons utilisé [PhoneGap](https://build.phonegap.com) en le connectant directement à notre dépôt
[GitHub](https://github.com/InriaMecsci/carpasinivores).

Plusieurs adaptations ont été nécessaires :

- un petit bout de javascript embarqué dans toutes les pages web pour
  changer dynamiquement la taille du logo sur mobile ;

- idem pour changer la taille de la Q-Table ;

- pour limiter les permissions demandées par l'application, on a
  utilisé un
  [fichier config.xml](https://build.phonegap.com/docs/config-xml) ;

- on a changé la taille par défaut de l'aire de jeu de 15x10 à 6x6.

----

# Procédure détaillée : 

- Se connecter à [PhoneGap](https://build.phonegap.com) avec son compte githup

- Pour créer un nouvelle application 

-- Décocher l'application non privée

-- Faire le upload par "pull from a git/svn" avec en lien git://github.com/guillaumematheron/carpasinivores.git

- Patienter jusqu'à l'apparition des icônes


