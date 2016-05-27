/**
 *
 * @author 
 *
 */
class Music{
    private bgMusicChannel: egret.SoundChannel;
    private bgMusic: egret.Sound;
    private gameOverMusic: egret.Sound;
    private enemyOverMusic: egret.Sound;
    private bulletMusic: egret.Sound;
    private bloodReduceMusic: egret.Sound;
    public constructor() {
        this.bgMusic = RES.getRes("game_music_mp3");
        this.gameOverMusic = RES.getRes("game_over_mp3");
        this.enemyOverMusic = RES.getRes("enemy1_down_mp3");
        this.bulletMusic = RES.getRes("bullet_mp3");
        this.bloodReduceMusic = RES.getRes("enemy4_out_mp3");
    }
    
    public bgStart() { 
        if(!this.bgMusicChannel) {
            this.bgMusicChannel = this.bgMusic.play(0,0);
        }
    }
    
    public bgStop() { 
        if(this.bgMusicChannel){ 
            this.bgMusicChannel.stop();
            this.bgMusicChannel = null;
        }
    }
    
    public gameOver() { 
        this.gameOverMusic.play(0,1);
    }
    
    public bullet() { 
        this.bulletMusic.play(0,1);
    }
    
    public enemyOver() { 
        this.enemyOverMusic.play(0,1);
    }
    
    public bloodReduce() { 
        this.bloodReduceMusic.play(0,1);
    }
}
