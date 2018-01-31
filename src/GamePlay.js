
GamePlayManager = {

    init: function(){
        
    },
    preload: function(){
        
        game.load.image("background", "../assets/images/background.png");
        game.load.image("man_stand", "assets/images/man_stand.png");

    },
    create: function(){
        
        game.add.sprite(0, 0, "background");
        game.add.sprite(50, 50, "man_stand");

    },
    update: function(){
        
    }

}

var game = new Phaser.Game(1136, 640, Phaser.AUTO);

game.state.add('gameplay', GamePlayManager);

game.state.start('gameplay');