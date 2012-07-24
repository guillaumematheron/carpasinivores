# Utilisation de l'interface

Le simulateur comporte plusieurs panneaux qui sont utilisés dans les
différents modes de jeu.

- Le panneau de code vous permet d'entrer votre propre programme dans
  les modes 'survival of the species' et 'survival of an
  individual'. Voir l'[API](api.md) pour plus d'informations sur
  comment programmet les êtres-verts.  Si vous voulez sauvegarder
  votre programme, vous devez le copier-coller dans un document sur
  votre ordinateur.

- Le panneau de paramètres vous permet d'entrer des paramètres
  personnalisés pour votre simulation. Soyez prudents quand vous
  changez ces paramètres, vous pourriez planter le simulateur ou même
  surcharger votre ordinateur si vous obtenez des croissances
  exponentielles de population. Si vous entrez des paramètres qui
  produisent des résultats intéressants, vous pouvez partager votre
  simulation avec vos amis et/ou professeurs en cliquant sur *Link to
  these settings* (créer un lien vers ces paramètres). Si vous avez
  entré votre propre code dans l'éditeur, vous devrez joindre ce code
  aussi.

- Le panneau de contrôle vous permet d'observer les entrées envoyées à
  un des êtres-verts (celui avec une bordure noire)

- Le log CSV contient un enregistrement des états du jeu, toutes les
  dix itérations. Après que vous arrêtiez la simulation (bouton
  *stop*), vous pouvez copier-coller ces données dans un fichier CSV
  et l'ouvrir avec votre tableur préféré pour tracer les courbes de
  l'évolution du nombre d'êtres-verts et d'êtres-rouges.

- La Q-Table montre le contenu actuel de la Q-Table. Chaque ligne
  représente un état (il y a 24 états), et chaque colonne représente
  une action possible (il y a 3 actions).
    
    Lisez la documentation du [Q-Learning](qlearning.md) pour plus
    d'informations sur le fonctionnement interne de l'apprentissage
    Q-Learning.
