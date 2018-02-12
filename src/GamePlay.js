var STATE_GAME_NONE = 0;
var STATE_GAME_LOADING = 1;
var STATE_GAME_PLAYING = 2;
var STATE_GAME_GAMEOVER = 3;
var STATE_GAME_WIN = 4;

var stateGame = STATE_GAME_NONE;

var distanceTrunks = 70;

GamePlayManager = {
    init: function(){
        game.scale.pageAlignHoritzontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.cursors = game.input.keyboard.createCursorKeys();
        this.pressEnable = true;
    },
    preload: function(){
        stateGame = STATE_GAME_LOADING;

        game.load.image("background", "assets/images/background.png");
        game.load.image("man_stand", "assets/images/man_stand.png");
        game.load.image("man_hit", "assets/images/man_hit.png");
        game.load.image("trunk", "assets/images/trunk.png");
        game.load.image("tomb", "assets/images/tomb.png");

        game.load.spritesheet("buttonPlay", "assets/images/buttonPlay.png", 65, 65, 2);

        game.load.audio("loopMusic", "assets/sounds/musicLoop.mp3");
        game.load.audio("sfxHit", "assets/sounds/sfxHit.mp3");
        game.load.audio("sfxGameOver", "assets/sounds/sfxGameOver.mp3");

    },
    create: function(){     
        this.sequence = [];
        
        game.add.sprite(0, 0, "background");
        //this.man = game.add.sprite(game.world.centerX, game.world.centerY, "man_stand");
        //this.man.anchor.setTo(0.5, 0.5); //REFERENCE CENTER POINT
        //this.man.scale.setTo(0.5, -1); //SCALE
        //this.man.angle = 45; //ROTATION
        //this.man.alpha = 0.5; //OPACITY
        this.man = game.add.sprite(80, 460, "man_stand");
        this.man.anchor.setTo(0.5,1);
        this.buttonPlay = game.add.button(game.width/2, game.height/2, "buttonPlay", this.startGame, this, 1, 0, 1, 0);
        this.buttonPlay.anchor.setTo(0.5);
        
        //Trunks creator
        this.trunks = game.add.group();
        for(var i = 0; i<30; i++){
            var trunk = this.trunks.create(0,0, "trunk");
            trunk.anchor.setTo(0, 0.5);
            trunk.kill();
        }

        //Tomb
        this.tomb = game.add.sprite(80,460, "tomb");
        this.tomb.anchor.setTo(0.5,1);
        this.tomb.visible = false;

        //SCORE
        this.currentScore = 0;
        var style = {
            font: "bold 30pt Arial",
            fill: "#fff",
            align: "center"
        }
        this.textfield = game.add.text(game.width/2,40, this.currentScore.toString(), style);
        this.textfield.anchor.setTo(0.5);

        //TIME BAR
        var pixel = game.add.bitmapData(1,1);
        pixel.ctx.fillStyle = "#fabada";
        pixel.ctx.fillRect(0,0,1,1);
        this.bar = game.add.sprite(0,0,pixel);
        this.bar.anchor.setTo(0);
        this.bar.width = game.width;
        this.bar.height = 10;

        //SOUNDS
        this.loopMusic = game.add.audio("loopMusic");
        this.sfxHit = game.add.audio("sfxHit");
        this.sfxGameOver = game.add.audio("sfxGameOver");

    },
    startGame: function(){
        stateGame = STATE_GAME_PLAYING;
        this.buttonPlay.visible = false;

        this.bar.width = game.width;

        this.loopMusic.loop = true;
        this.loopMusic.play();

        this.currentScore = 0;
        this.textfield.text = this.currentScore.toString();
        
        for(var i=0; i<this.sequence.length;i++){
            if(this.sequence[i]!=null){
                this.sequence[i].kill();
            }
        }

        this.sequence = [];
        this.sequence.push(null);
        this.sequence.push(null);
        this.sequence.push(null);

        this.man.visible = true;
        this.tomb.visible = false;

        for(var i=0; i<10; i++){
            this.addTrunk();
        }
        this.printSequence();
    },
    addTrunk: function(){
        this.refreshBar(6);
        var number = game.rnd.integerInRange(-1, 1);
        switch(number){
            case 1:
                var trunk = this.trunks.getFirstDead();
                trunk.direction = 1;
                trunk.scale.setTo(1,1);
                trunk.reset(game.world.centerX, 380 - (this.sequence.length) * distanceTrunks);
                this.sequence.push(trunk);
                break;
            case -1:
                var trunk = this.trunks.getFirstDead();
                trunk.direction = -1;
                trunk.scale.setTo(-1,1);
                trunk.reset(game.world.centerX, 380 - (this.sequence.length) * distanceTrunks);
                this.sequence.push(trunk);
                break;
            case 0:
                this.sequence.push(null);
                break;
        }
    },
    printSequence: function(){
        var stringSequence = "";
        for(var i=0; i<this.sequence.length; i++){
            if(this.sequence[i]==null){
                stringSequence += "0,";
            }else{
                stringSequence += this.sequence[i].direction + ",";
            }
        }
        console.log(stringSequence);
    },
    hitMan: function(direction){
        this.sfxHit.play();

        for(var i=0; i<this.sequence.length; i++){
            if(this.sequence[i] != null){
                this.sequence[i].y+=distanceTrunks;
            }
        }
        var firstTrunk = this.sequence.shift();
        if(firstTrunk != null){
            firstTrunk.kill();
        }
        this.addTrunk();

        var checkTrunk = this.sequence[0];
        if(checkTrunk != null && checkTrunk.direction == direction){
            this.gameOver();
        }else{
            this.increaseScore();
        }

        this.printSequence();
    },
    increaseScore: function(){
        this.currentScore += 100;
        this.textfield.text = this.currentScore.toString();
    },
    refreshBar: function(value){
        var newWidth = this.bar.width + value;
        if(newWidth > game.width){
            newWidth = game.width;
        }
        if(newWidth <= 0){
            newWidth = 0;
            this.gameOver();
        }
        this.bar.width = newWidth;
    },
    gameOver: function(){
        stateGame = STATE_GAME_GAMEOVER;

        this.loopMusic.stop();
        this.sfxGameOver.play();

        this.man.visible = false;
        this.tomb.visible = true;
        this.tomb.x = this.man.x;

        this.buttonPlay.visible = true;
    },
    update: function(){
        //this.man.angle ++; //ROTATION

        switch(stateGame){
            case STATE_GAME_NONE:
                break;
            case STATE_GAME_LOADING:
                break;
            case STATE_GAME_PLAYING:

                this.refreshBar(-1);

                if(this.cursors.left.isDown && this.pressEnable){
                    this.pressEnable = false;
                    this.man.x = 80;
                    this.man.scale.setTo(1,1);
                    this.man.loadTexture("man_hit");
                    this.hitMan(-1);
                }
                if(this.cursors.right.isDown && this.pressEnable){
                    this.pressEnable = false;
                    this.man.x = 240;
                    this.man.scale.setTo(-1,1);
                    this.man.loadTexture("man_hit");
                    this.hitMan(1);
                }

                if(this.cursors.left.isUp && this.cursors.right.isUp){
                    this.pressEnable = true;
                    this.man.loadTexture("man_stand");
                }
                
                break;
            case STATE_GAME_GAMEOVER:
                console.log("GAME OVER");
                break;
            case STATE_GAME_WIN:
                break; 
        }
    }

}

var game = new Phaser.Game(320, 480, Phaser.AUTO);

game.state.add('gameplay', GamePlayManager);

game.state.start('gameplay');