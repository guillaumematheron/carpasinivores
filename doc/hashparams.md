# Hash parameters

Les carpasinivores utilisent une fonctionnalité assez peu répandue
pour passer des paramètres à l'application javascript.

Les paramètres sont spécifiées après un hashmark (#) à la fin de
l'URL, dans un emplacement habituellement réservé aux ancres HTML.

Un exemple de lien est par exemple :

    http://www.carpasinivores.org/index.html#param1=val1&param2=val2

Les hashParams actuellement supportés par l'applications sont

- L'id de n'importe quel champ du formulaire de paramètres;

- `autoStart`. Si ce paramètre est défini à 1, valide automatiquement les paramètres entrés.
