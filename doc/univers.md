# Univers du jeu

## L'espace de jeu

C'est un tore 2D donc un espace de taille finie replié sur lui même
dans les deux directions ; on visualise en 2D une projection plane
locale de l'espace et on peut centrer sur un des êtres ou se déplacer
avec les flèches.

## Les obstacles

Ce sont des points blancs inertes et sans interaction qui empêchent
le passage, ils sont mis en place statiquement en début de jeu
de manière prédéfinie.

## Déplacements

Tous les éléments se déplacent librement et sont bloqués au contact
d'un autre élément, ils peuvent alors les contourner.

## L'eau

Quand il « pleut », des formes bleus (des disques de couleur bleue,
donc) apparaissent aléatoirement dans une zone du jeu vide, elles
contiennent une quantité d'eau nourrissante finie et se vident quand
un être vient s'y abreuver.

## Les êtres-verts

Ce sont les héros du jeu, donc des disques verts qui ont :

- des **neurones moteurs, sensoriels et somesthésiques**, avec toujours des valeurs positives entre 0 et 1.

    * capacités motrices : trois neurones qui contrôlent la vitesse
      avant (jusqu'à 100 pixels/seconde), et deux antagonistes qui
      contrôlent le déplacement angulaire à gauche et à droite avec un
      modèle du 1er ordre

    * capacités sensitives :

        + un seul oeil à un seul pixel qui regarde droit devant et
        voient noirs si il y a rien, sinon le 1er disque avec une
        intensité qui décroit avec la distance et trois neurones bleu,
        vert, rouge

        + un odorat qui détecte les odeurs bleue, vertes et rouges
        (mais pas les obstacles) dans toutes les directions, avec une
        décroissance au carré de la distance

    * capacités somesthésiques :

        + la **faimsoif** qui augmente avec le temps et plus en
        déplacement qu'à l'arrêt, diminue avec la prise de nourriture
        (au contact de la proie), et influence les performances
        sensitives (diminution des gains)

        + la **fatigue** qui augmente lors de déplacements, diminue à
        l'arrêt, d'autant plus vite que la faimsoif et la douleur sont
        importantes, et qui influence les performances motrices

        + la **douleur** qui augmente rapidement au contact d'un
        prédateur, la mort étant une douleur de 1, et le cadavre
        devenant un point noir

        + la **bébémania** qui augmente avec la couleur visuelle verte
        excitatrice et s'apaise au contact d'un autre être vert, non
        sans générer un autres être vert avec le même programme mais
        les valeurs des variables ré-initialisées

        + une **horloge** binaire qui émet des 1 à un rythme régulier de
        1/3 de seconde (c'est l'horloge générale de tout l'univers)

- un **système nerveux** qui reçoit en entrée les informations sensitives et somesthésiques et produit les infos motrices en sortie, avec deux modèles selon le mode du jeu.

## Les « carpasinivores »

Ce sont des êtres rouges qui fonctionnement exactement comme les
êtres-verts sauf que :

- ils sont pré-programmés essentiellement avec des mécanismes basiques
  et aléatoires (c'est des « bêtes ») ;

- ils se nourrissent pas de liquide mais d'êtres verts ;

- ils ont pas de vision (que de l'odorat), pas de douleur, pas de
  fatigue (ben ouais : c'est des « bêtes », quoi).
