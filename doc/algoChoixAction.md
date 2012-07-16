Algorithme de choix de l'action dans un processur d'apprentissage Q-Learning
============================================================================

Le but de l'algorithme est de choisir l'action optimale dans une Q-Table sachant l'état actuel S.

Supposons que les trois actions possibles soient notées A1, A2, A3.

On pourrait prendre la valeur maximale parmi q[S][A1], q[S][A2], q[S][A3] mais l'être-vert risquerait de se bloquer en ne faisant qu'une
seule action, empêchant le renforcement des autres comportements.

Description formelle
--------------------

L'idée de cet algorithme est que Pr{A}/Pr{A'}=q[S][A]/q[S][A'] pour toues les actions A et A'.

Ainsi, la probabilité de sélectionner une action A est proportionnelle à sa valeur.

Cela revient à normaliser les q[S][A] sur A, c'est-à-dire si on divise Q[S][A] pour tout A par un même nombre d tel que la somme sur A des Q[S][A] vaille sum_A(Q[S][A])=1.

Processus de normalisation
--------------------------

L'algorithme est en réalité implémenté de façon à ce que la normalisation des Q[S][A] sur A ne soit pas nécessaire, mais il est indispensable de comprendre
ce processus.

Supposons que :

- Q[S][A1]=3

- Q[S][A2]=5

- Q[S][A3]=1

On cherche le réel d tel que Q[S][A1]/d+Q[S][A2]/d+Q[s][A3]/d=1.

On a donc d=Q[S][A1]+Q[S][A2]+Q[S][A3]=sum_A(Q[S][A]).

Ainsi dans notre exemple on a d=9 donc après normalisation,

- Q[S][A1]=3/9=1/3

- Q[S][A2]=5/9

- Q[S][A3]=1/9

Choix de l'action
-----------------

Toujours avec notre exemple, on cherche à choisir une action A telle que Pr{A1}=1/3, Pr{A2}=5/9 et Pr{A3}=1/9.

On peut choisir un nombre aléatoire à distribution uniforme sur ]0;1[ et s'il est entre 0 et 1/3 on choisir l'action A1, s'il est entre 1/3 et 1/3+5/9 on choisit A2,
sinon il est entre 1/3+5/9 et 1/3+5/9+1/9 et on choisit A3.

L'algorithme pour faire cela est le suivant :

    Soit 'runningSum'=0
    Soit 'nombre' un entier aléatoire à distribution uniforme sur ]0;1[
    Répéter pour toutes les actions possibles A
      Ajouter Pr{A} à runningSum
      Si runningSum>nombre Alors
        Sélectionner l'action A
        Sortir de la boucle
      FinSi
    FinRépéter

En pratique
-----------

Plutôt que de normaliser le tableau Q, nous avons préféré utiliser le même algorithme, mais en sélectionnant un nombre aléatoire à distribution uniforme entre 0 et sum_A(q[S][A]).

Ainsi, dans notre exemple, on garde le tableau suivant :
      
- Q[S][A1]=3

- Q[S][A2]=5

- Q[S][A3]=1

mais on choisit un nombre aléatoire entre 0 et 9. S'il est entre 0 et 3 on choisit A1, entre 3 et 8 on choisit A2, et entre 8 et 9 on choisir A3.

L'algorithme devient (en javascript) : 

    function pickAction(currentState) {
      var sum=0;
      for (var i=0; i<3; i++)
        sum+=q[currentState.vision][currentState.lastAction][i];
      var r=Math.random()*sum;
      var runningSum=0, a=0;
      for (var n=0; n<3; n++) {
        runningSum+=q[currentState.vision][currentState.lastAction][n];
        if (r<runningSum) {
          a=n;
          break;
        }
      }
      return (a);
    }

Dernier ajustement
------------------

Malgré son efficacité, cet algorithme soulève deux problèmes importants : 

- Premièrement, lorsque la Q-Table est vide, sum vaut 0 donc r vaut 0 mais runningSum vaut aussi toujours 0. Ainsi le programme ne validera jamais le 'if' et retournera
  toujours a=0.

- Deuxièmement, si (S;A1) a rapporté une récompense donc (S;A1)=1 mais que (S;A2)=0 et (S;A3)=0, alors la prochaine fois l'agent sélectionnera toujours (S;A1) et jamais les autres actions
  alors que (S;A1) n'a rapporté qu'une seule récompense.

Initialiser les Q[A][S] à une valeur supérieure à zéro est délicat car les algorithmes de calcul des récompenses dépendent de la valeur de Q[A][S]. En gros, il ne faut pas que les
algorithmes d'apprentissage croient qu'une action A peut mener à un état S' avec une récompense alors que cet état n'a jamais été atteint.

Pour résoudre ces problèmes, nous avons très légèremet modifié l'algorithme pour ajouter un composante aléatoire au choix. Ainsi, on conserve le même algo mais au lieu de traiter
q[A][S], on traite q[A][S]+0.01

L'algorithme devient (en javascript) : 

    function pickAction(currentState) {
      var sum=0;
      for (var i=0; i<3; i++)
        sum+=q[currentState.vision][currentState.lastAction][i]+0.01;
      var r=Math.random()*sum;
      var runningSum=0, a=0;
      for (var n=0; n<3; n++) {
        runningSum+=q[currentState.vision][currentState.lastAction][n]+0.01;
        if (r<runningSum) {
          a=n;
          break;
        }
      }
      return (a);
    }

