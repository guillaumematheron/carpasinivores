# Paramètres de la simulation

- **Game mode** (mode de jeu)

    - **Survival of the species** (survie de l'espèce)

        Dans ce mode vous écrivez un programme qui sera utilisé par
        tous les êtres-verts. Votre objectif est de permettre la
        survie de votre espèce.

    - **Survival of an individual** (survie d'un individu)
    
        Dans ce mode vous écrivez un programme qui sera utilisé par un
        seul être-vert (celui avec une bordure noire). Les autres
        êtres-verts, s'il y en a, sont des « bêtes » avec un
        comportement pré-programmé. Votre objectif est que votre
        être-vert survive aussi longtemps que possible.

    - **[Q-Learning](qlearning.md)** (apprentissage 'Q')
    
        Dans ce mode vous n'entrez pas de code dans le fenêtre de code
        (celui-ci sera ignoré). Un individu (celui avec une bordure
        noire) est doté d'un système d'apprentissage basé sur
        l'expérience. Au fur et à mesure de sa progression, cet
        individu devient capable de progresser de manière de plus en
        plus 'intelligente'. Ce processus peut prendre plusieurs
        dizaines de minutes et démontre le principe d'apprentissage
        par renforcement.

- **Width** (largeur)

    Largeur de l'aire de simulation. Il est déconseillé de paramétrer
    des aires de simulations trop petites, car les algorithmes du
    simulateur sont moins précis quand la densité d'éléments sur la
    scène est trop grande. Dans tous les cas, ne pas aller en-deçà de
    5x5. La taille par défaut est 15x10

- **Height** (hauteur)
  
    Voir Width

- **Rain factor**
  
    Quantité de pluie. Entrez 0 pour ne pas avoir de pluie. La valeur
    par défaut est 0.05
  
    Cette valeur peut aussi être négative, auquel cas des flaques
    d'eau disparaissent aléatoirement. Les deux dernières flaques ne
    seront jamais supprimées.

- **Kill factor**

    Vitesse à laquelle les êtres-verts meurent au contact des
    êtres-rouges. Entrez 0 pour que les êtres-verts soient immunisés
    contre les êtres-rouges.

    Ce paramètre n'influence pas la vitesse à laquelle les
    êtres-rouges se nourissent au contact des êtres-verts. La valeur
    par défaut est 0.4

- **Eat factor**

    Vitesse à laquelle les êtres-rouges se nourissent au contact des
    êtres-verts.
    
    Ce paramètre n'influence pas la vitesse à laquelles les
    êtres-verts meurent au contact des êtres-rouges. La valeur pas
    défaut est 0.4

- **Drink factor**

    Vitesse à laquelle les êtres-verts boivent au contact de l'eau.
    
    Ce paramètre n'influence pas la vitesse à laquelle la taille des
    flaques d'eau diminuent au contact des êtres-verts.

- **Green population**

    Quantité initiale d'êtres-verts

- **Red population**

    Quantité initiale d'êtres-rouges

- **Initial water**

    Nombre initial de points d'eau

- **Hunger evolution**

    Vitesse à laquelle la faim des être-verts augmente lorsqu'ils ne
    sont pas au contact des flaques d'eau. Mettre à 0 pour que les
    êtres-verts soient immunisés contre la faim.

- **Lust evolution**

    Vitesse à laquelle la bébémania des être-verts augmente. Mettre à
    0 pour désactiver la procréation
