# Apprentissage par récompense (ou ré-enforcement) : le «Q-learning»

Dans ce mode, tous les êtres-verts sont des « bêtes » gérées par
l'ordinateur, mais celui qui a une bordure noire a un algorithme
d'apprentissage qui lui permet d'évoluer en fonction de ses
expériences.

L'idée derrière l'apprentissage "Q-Learning" est que l'agent a un
*état* qui, dans notre cas est le composé du niveau de bleu (entre 0
et 7) vu par l'être-vert, et la dernière action qu'il a
choisi. L'être-vert a trois actions possibles pour chaque itération :
il peut avancer, tourner vers la gauche ou tourner vers la droite. Il
y a donc 8x3=24 états possibles.

Si nous devions programmer à la mail un comportement optimal pour
cette situation, nous devrions sélectionner la meilleure action pour
chaque état. Par exemple, si on ne voir pas de bleu du tout (bleu=0),
et que la dernière action était de tourner vers la gauche, alors
l'action optimale derait de tourner à droite.

Pour savoir quelle est l'action optimale dans chaque état, l'être-vert
lit ce qu'on appelle une Q-Table. Il y stocke la récompense attendue
pour chaque action et chaque état. par exemple, si on est dans l'état
S, l'élement lira dans la Q-Table quelle est la meilleure récompense
attendue parmi (S;avancer), (S;gauche) et (S;droite). Il sélectionnera
ensuite l'action ayant la meilleure récompense attendue.

[Infos à propos de l'algorithme de sélection de la meilleure action](algoChoixAction.md)

Bien sûr le contenu de la Q-Table est essentiel au processur
d'apprentissage. L'idée du Q-Learning est de remplir la table pendant
que l'être-vert expérimente des actions : au débug la table est vide,
donc l'être-vert fait des actions au hasard, mais quand l'élément
reçoit une récompense (quand il touche de l'eau en l'occurence), après
avoir effectué l'action A en l'état S, la case (S;A) de la Q-Table est
incrémentée. Ainsi, la prochaine fois que l'être vert est dans l'état
S, il aura plus de chances d'effectuer l'action A.

Cependant, comment l'être-vert est-il capable de prendre des
stratégies itéréssantes sur plusieurs itérations ? En effet, certaines
stratégies peuvent être intéréssantes, par exemple avancer quand on
voit du bleu) mais ne pas générer de récompense immédiate. Pour
l'instant, seule l'action qui précède immédiatement la récompense est
valorisée. C'est pourquoi même quand aucune récompense immédiate n'est
reçue après avoir effectuée l'action A en l'état S, la cellule (S;A)
de la Q-Table est augmentée d'une valeur.  Cette valeur dépend de la
récompense attendue maximale que l'être-vert peut obtenir à partir du
nouvel état S' dans lequel il arrive.

Voici l'algorithme actuel de Q-Learning : 

```javascript
var gamma=0.97;
//a corresponds to the current action

//Compute maximum Q for the next action
var maxQ=0;
for (var i=0; i<3; i++) {
   var cq=q[newState.vision][newState.lastAction][i];
   if (cq>maxQ) maxQ=cq;
}
    
q[currentState.vision][currentState.lastAction][a]=payoff+gamma*maxQ;
```
