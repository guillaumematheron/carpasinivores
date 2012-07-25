# Hash parameters

Les carpasinivores utilisent une fonctionnalité assez peu répandue
pour passer des paramètres à l'application javascript.

Les paramètres sont spécifiées après un hashmark (#) à la fin de
l'URL, dans un emplacement habituellement réservé aux ancres HTML.

Voilà un exemple de lien :

    http://www.carpasinivores.org/index.html#param1=val1&param2=val2

Les paramètres actuellement supportés par l'application sont :

- l'id de n'importe quel champ du formulaire de paramètres ;

- `autoStart` : si ce paramètre est défini à 1, valide automatiquement
  les paramètres entrés.
