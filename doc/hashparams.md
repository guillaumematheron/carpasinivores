Hash parameters
===============

Les carpasinivores utilisent une fonctionnalité assez peu répandue pour passer des paramètres à l'application javascript.

Les paramètres sont spécifiées après un hashmark (#) à la fin de l'URL, dans un emplacement habituellement réservé aux ancres HTML.

Un exemple de lien est par exemple :

    file:///D:/carpasinivores/#params=width,8;height,8;rain,0;kill,0.4;eat,0.4;drink,0.2;green,1;red,0;water,3;hunger,0;lust,0;gameMode,qlearning

En réalité la syntaxe de base est `#name1=value1&name2=value2`

But in our case we only specify one parameter named 'param' with, as a value, the cookie corresponding to the desired configuration, stored in the following format : 

    name1,value1;name2,value2;name3,value3

Nous n'utilisont pas directement `#width=8&height=8&rain=0` car nos paramètres sont lus par un système qui modifie automatiquement les champs du panneau 'params'.
Il est donc important de séparer les 'paramètres de la simulation' comme width, height et gameMode des 'paramètres de l'application' qui ne sont pas implémentés mais
ne correspondent pas à des valeurs pas défaut de champs du panneau 'params'.

