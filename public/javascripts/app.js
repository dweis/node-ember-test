var App = Em.Application.create();

App.Box = Em.Object.extend({
  color: null
});

App.boxController = Em.ArrayProxy.create({
  content: [],

  createBox: function() {
    var random = Math.floor(Math.random() * 3)

    var color = null;

    switch (random) {
      case 1: color = 'green'; break;
      case 2: color = 'blue'; break
      default: color = 'red'; break;
    }

    var box = App.Box.create({ color: color });

    this.pushObject(box);
  }
});
