# Traçage de rayons

Le traçage de rayon ou *raycast* permet de déterminer la couleur de
l'objet en face de l'oeil des êtres-verts.

Tous les éléments colorés du monde des carpasinivores sont
circulaires.

On utilise le même principe que pour la
[résolution des collisions](collisions.md) pour récupérer la liste des
éléments à proximité de l'objet courant. Plus précisément, on
détermine le quart de cercle dans lequel est le rayon (nord-ouest,
nord-est, sud-ouest ou sud-est). Ensuite, on cherche les éléments dans
les cellules du quart de cercle et on calcule pour chacune la distance
entre le centre de l'élément et le rayon.
