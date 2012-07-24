# EnchantJS patching

I had to make a few patchs to the enchantJS library to meet my needs,
here is a commented diff of the previous version and the patched
version

- Changed header
```diff
      0a1,2
      > //Code modified on 20120703 by Guillaume Matheron (INRIA)
      > 
```

- Game constructor now takes an additionnal parameter : the DOM object in which to display the game canvas
```diff
      601c603
      <     initialize: function(width, height) {
      ---
      >     initialize: function(width, height, container) {
      634,635c636,637
```

- The game should not take the dimensions of the window, but stick to
  the dimensions that were given as a param to the construction

    This avoids stretching of the game area
```diff
      <             stage.style.width = window.innerWidth + 'px';
      <             stage.style.height = window.innerHeight + 'px';
      ---
      >             stage.style.width = width + 'px';
      >             stage.style.height = height + 'px';
```

- Append the stage to `container` rather than `document.body`
```diff
      637,638c639,640
      <             if (document.body.firstChild) {
      <                 document.body.insertBefore(stage, document.body.firstChild);
      ---
      >             if (container.firstChild) {
      >                 container.insertBefore(stage, container.firstChild);
      640c642
      <                 document.body.appendChild(stage);
      ---
      >                 container.appendChild(stage);
```

- Impose the size of the container
```diff
      641a644,645
      >             container.style.width=stage.style.width;
      >             container.style.height=stage.style.height;
```

- Prevent rescaling of the game area
```diff
      645a650
      >             this.scale=1;
      656a662
      >                 this.scale=1
```
