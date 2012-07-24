# API

Le code entré dans la fenêtre de code est exécuté à chaque itération
du programme sur tous les êtres-verts programmables (dépend du mode).

La variable `me` désigne l'être-vert courant. Vous pouvez utiliser
cinq variables comme vous le voulez. Ces variables représentent en
quelque sorte la « mémoire » de l'être-vert. Par défaut ces cinq
variables sont initialisées à 0. Ces variables sont `me.var1`,
`me.var2`, `me.var3`, `me.var4` et `me.var5`.

Vous pouvez utiliser les fonction suivantes sur la variable `me` pour
avoir des informations sur les perceptions sensorielles de l'être-vert :

- `me.getColor()`

    Renvoie la couleur vue par l'oeil de l'être-vert. Utilisez
    `me.getColor().r`, `me.getColor().g` et `me.getColor().b` pour
    obtenir les différentes composantes (rouge, vert et bleu
    respectivement) de la couleur vue (chaque canal renvoie une valeur
    entre 0 et 1).

- `me.getSmell()`

    Si un élément coloré est au contact de l'être-vert, renvoie sa
    couleur. Vous pouvez récupérer les composantes de la couleur de la
    même façon que pour `me.getColor()`.

Vous pouvez utiliser les fonctions suivantes sur la variable `me` pour
avoir des informations sur les perceptions somesthésiques de
l'être-vert :

- `me.getHunger()`

    Renvoie la faim de l'être-vert (entre 0 et 1).

- `me.getFatigue()`

    Renvoie la fatique de l'être-vert (entre 0 et 1).

- `me.getLust()`

    Renvoie la bébémania de l'être-vert (entre 0 et 1).

- `me.getPain()`

    Renvoie la douleur ressentie par l'être-vert (entre 0 et 1).

Vous pouvez utiliser les fonction suivantes sur la variable `me` pour agir sur l'élément courant :

- `me.forward(distance)`

    Avance de la distance spécifiée (en pixels par seconde).

- `me.rotate(angle)`
 
    Tourne de l'angle spécifié (en degrés d'angle par seconde).

    Astuce : pour faire un demi-tour instantanément, utilisez
    `me.rotate(180*deltaTime)`. Vous pouvez utiliser cette notation
    pour tourner de nimporte quel angle instantanément.

## Remarque

Les capteurs ne sont pas mis à jour durant l'exécution de votre code,
donc pas exemple si votre élément voit du bleu, et que vous lui faites
faire un demi-tour, un nouvel appel à `me.getColor()` reverra toujours
la couleur bleue, car les modifications ne sont appliquées qu'à la fin
de votre code.
