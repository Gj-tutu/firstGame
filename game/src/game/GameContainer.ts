class GameContainer extends egret.DisplayObjectContainer{
    private stageW: number;
    private stageH: number;
    private bg: BgMap;
    private btnStart: Button;
    private myFighter: MyAirplane;
    private bhFighter1: SmallAirplane;
    private bhFighter2: SmallAirplane;
    private bossFighter: BossAirplane;
    private music: Music;
    /**触发创建敌机的间隔*/
    private enemyFightersTimer: egret.Timer;
    private bossReadyTimer: egret.Timer;
    private bossStartTimer: egret.Timer;
    /**敌人的飞机*/
    private enemyFighters: EnemyAirplane[] = [];
    /**我的子弹*/
    private myBullets: Bullet[] = [];
    /**敌人的子弹*/
    private enemyBullets: Bullet[] = [];
    /**我的成绩*/
    private myScore: number = 0;
    private myScoreShow: egret.TextField;
    private blood: Blood;
    private _lastTime: number;
    private _init: Boolean = false;
    private level:number = 0;
    private nextLable: Next;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    private onAddToStage(event: egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        this.createGameScene();
    }
    
    private createGameScene(): void {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.bg = new BgMap();//创建可滚动的背景
        this.addChild(this.bg);
        this.btnStart = new Button(ImageHandle.getTexture("ui_new_common_png",3,120,300,100), "开始游戏");

        this.btnStart.x = (this.stageW - this.btnStart.width) / 2;//居中定位
        this.btnStart.y = (this.stageH - this.btnStart.height) / 2;//居中定位
        this.btnStart.click(this.gameInit, this);
        this.addChild(this.btnStart);  
        this.music = new Music();
        this.blood = new Blood();
    }
    
    private gameInit(): void { 
        this.removeChild(this.btnStart);
        if(!this._init){
            this.myFighter = new MyAirplane();
            this.bhFighter1 = new SmallAirplane();
            this.bhFighter2 = new SmallAirplane(true);
            this.bossFighter = new BossAirplane();
            this.enemyFightersTimer = new egret.Timer(1000);
            this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER,this.createEnemy,this);
            this.bossReadyTimer = new egret.Timer(1000*30);
            this.bossReadyTimer.addEventListener(egret.TimerEvent.TIMER,this.boosReady,this);
            this.bossStartTimer = new egret.Timer(1000);
            this.bossStartTimer.addEventListener(egret.TimerEvent.TIMER,this.boosStart,this);
            this.nextLable = new Next();
            this.myScoreShow = new egret.TextField();
            this.myScoreShow.text = String(this.myScore);
            this.addChild(this.myScoreShow);
            this.addChild(this.nextLable);
            this.addChild(this.blood);
            this._init = true;
        }
        this.myScore = 0;
        this.myScoreShow.text = String(this.myScore);
        this.level = 0;
        this.addBlood();
        this.gameStart();
    }
    
    private addBlood() {
        this.myFighter.addBlood();
        this.blood.setBlood(this.myFighter.blood);
    }
    
    private reduceBlood(num:number) { 
        this.music.bloodReduce();
        this.myFighter.blood -= num;
        this.blood.setBlood(this.myFighter.blood);
    }
    
    private enemyEnd(airplane:Airplane) { 
        this.music.enemyOver();
        this.myScore += airplane.getScore();
        this.myScoreShow.text = String(this.myScore);
        this.airplaneOver(airplane);
    }
    
    private airplaneOver(airplane: Airplane) { 
        let airplaneOver = AirplaneOver.produce();
        this.addChild(airplaneOver);
        airplaneOver.open(airplane,() => {
            this.removeChild(airplaneOver);
            AirplaneOver.reclaim(airplaneOver);
        });
    }
    
    private EndGame() {
        this.music.gameOver();
        this.btnStart.label.text = "重新开始";
        this.addChild(this.btnStart);  
        this.gameStop();
    }
    
    private gameStop() {
        this.bg.pause();
        this.music.bgStop();
        this.myFighter.stopFire();
        this.bhFighter1.stopFire();
        this.bhFighter2.stopFire();
        this.bossFighter.stopFire();
        this.removeEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
        this.myFighter.removeEventListener("createBullet",this.createMyBulletHandler,this);
        this.bhFighter1.removeEventListener("createBullet",this.createSmallBulletHandler,this);
        this.bhFighter2.removeEventListener("createBullet",this.createSmallBulletHandler,this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
        this.enemyFightersTimer.stop();
        this.bossReadyTimer.stop();
        this.gameClear();
    }
    
    private gameClear() {
        this.removeChild(this.myFighter);
        this.airplaneOver(this.myFighter);
        this.removeChild(this.bhFighter1);
        this.removeChild(this.bhFighter2);
        if(this.isBoss) {
            this.isBoss = false;
            this.removeChild(this.bossFighter);
        }
        for(let i = 0;i < this.myBullets.length;i++) {
            this.removeChild(this.myBullets[i]);
            Bullet.reclaim(this.myBullets[i]);
        }
        this.myBullets = [];
        for(let i = 0;i < this.enemyFighters.length;i++) {
            this.enemyFighters[i].stopFire();
            this.removeChild(this.enemyFighters[i]);
            EnemyAirplane.reclaim(this.enemyFighters[i]);
        }
        this.enemyFighters = [];
        for(let i = 0;i < this.enemyBullets.length;i++) {
            this.removeChild(this.enemyBullets[i]);
            Bullet.reclaim(this.enemyBullets[i]);
        }
        this.enemyBullets = [];
    }
    
    private gameStart() {
        this.bg.start();
        this.music.bgStart();
        this.myFighter.y = this.stageH - this.myFighter.height - 50;
        this.myFighter.x = (this.stageW - this.myFighter.width) / 2;
        this.bhFighter1.setXY(this.myFighter);
        this.bhFighter2.setXY(this.myFighter);
        this.addChild(this.myFighter);
        this.addChild(this.bhFighter1);
        this.addChild(this.bhFighter2);
        this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
        this.myFighter.addEventListener("createBullet",this.createMyBulletHandler,this);
        this.bhFighter1.addEventListener("createBullet",this.createSmallBulletHandler,this);
        this.bhFighter2.addEventListener("createBullet",this.createSmallBulletHandler,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
        this.gameNextReady();
    }
    
    private boosReady() { 
        this.enemyFightersTimer.stop();
        this.bossReadyTimer.stop();
        this.bossStartTimer.start();
    }
    private isBoss: boolean = false;
    private boosStart() {
        if(this.enemyFighters.length <= 0) {
            this.bg.pause();
            this.isBoss = true;
            this.addChild(this.bossFighter);
            this.bossFighter.x = this.stageW / 2 - this.bossFighter.width / 2;
            this.bossFighter.y = - this.bossFighter.height;
            this.bossFighter.addBlood();
            this.bossStartTimer.stop();
            this.addChild(this.bossFighter);
            this.bossFighter.addEventListener("createBullet",this.createBoosBulletHandler,this);
            this.bossFighter.fire();
        }
    }
    
    private gameNextReady() { 
        this.bg.start();
        this.myFighter.stopFire();
        this.bhFighter1.stopFire();
        this.bhFighter2.stopFire();
        this.level++;
        this.nextLable.setNumber(this.level);
        this.nextLable.x = (this.stageW - this.nextLable.width) / 2;//居中定位
        this.nextLable.y = (this.stageH - this.nextLable.height) / 2;//居中定位
        this.nextLable.ready();
        this.nextLable.addEventListener("nextStart",this.gameNextStart,this);
    }
    
    private gameNextStart() {
        this.nextLable.removeEventListener("nextStart",this.gameNextStart,this);
        this.myFighter.fire();
        this.bhFighter1.fire();
        this.bhFighter2.fire();
        this.enemyFightersTimer.start();
        this.bossReadyTimer.start();
    }
    
    
    private createEnemy():void { 
        var num: number = (Math.floor(Math.random() * 4 + 1));
        var enemyFighter: EnemyAirplane = EnemyAirplane.produce(String(num));
        var x = Math.random() * this.stageW;
        if(x > this.stageW - enemyFighter.width){ 
            x = x - enemyFighter.width;
        }
        enemyFighter.x = x;
        enemyFighter.y = -enemyFighter.height - Math.random() * 10;
        enemyFighter.addEventListener("createBullet",this.createEnemyBulletHandler,this);
        enemyFighter.addBlood();
        enemyFighter.fire();
        this.addChild(enemyFighter);
        this.enemyFighters.push(enemyFighter);
    }
    private bossF: boolean = false;
    private gameViewUpdate() { 

        //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        var nowTime: number = egret.getTimer();
        var fps: number = 1000 / (nowTime - this._lastTime);
        this._lastTime = nowTime;
        var speedOffset: number = 60 / fps;
        //我的子弹运动
        var i: number = 0;
        var bullet: Bullet;

        var myBulletsCount: number = this.myBullets.length;
        var delArr: any[] = [];
        for(i = 0;i < myBulletsCount;i++) {
            bullet = this.myBullets[i];
            bullet.y -= bullet.speed * speedOffset;
            bullet.x += bullet.position * speedOffset * Math.log(bullet.positionNum);
            bullet.positionNum++;
            if(bullet.y < -bullet.height) { 
                delArr.push(bullet);
            }
        }
        for(i = 0;i < delArr.length;i++) {
            bullet = delArr[i];
            this.removeChild(bullet);
            Bullet.reclaim(bullet);
            this.myBullets.splice(this.myBullets.indexOf(bullet),1);
        }
        delArr = [];
        //敌人飞机运动
        var theFighter: EnemyAirplane;
        var enemyFighterCount: number = this.enemyFighters.length;
        var enemybullet: string;
        for(i = 0;i < enemyFighterCount;i++) {
            theFighter = this.enemyFighters[i];

            theFighter.y += theFighter.speed * speedOffset;
            if(theFighter.y > this.stageH)
                delArr.push(theFighter);
        }
        for(i = 0;i < delArr.length;i++) {
            theFighter = delArr[i];
            this.removeChild(theFighter);
            EnemyAirplane.reclaim(theFighter);
            theFighter.removeEventListener("createBullet",this.createEnemyBulletHandler,this);
            theFighter.stopFire();
            this.enemyFighters.splice(this.enemyFighters.indexOf(theFighter),1);
        }
        delArr = [];
        //敌人子弹运动
        var enemyBulletsCount: number = this.enemyBullets.length;
        for(i = 0;i < enemyBulletsCount;i++) {
            bullet = this.enemyBullets[i];
            bullet.y += bullet.speed * speedOffset;
            bullet.x += bullet.position * bullet.positionNum * speedOffset;
            bullet.positionNum++;
            if(bullet.y > this.stageH)
                delArr.push(bullet);
        }
        for(i = 0;i < delArr.length;i++) {
            bullet = delArr[i];
            this.removeChild(bullet);
            Bullet.reclaim(bullet);
            this.enemyBullets.splice(this.enemyBullets.indexOf(bullet),1);
        }
        delArr = [];
        if(this.isBoss){ 
            if(this.bossFighter.y < this.stageH / 2 - this.bossFighter.height * 2) {
                this.bossFighter.y += this.bossFighter.speed * speedOffset;
            }
            if(this.bossF && this.bossFighter.x > 0) {
                this.bossFighter.x -= this.bossFighter.speed * speedOffset;
            } else {
                this.bossF = false;
                this.bossFighter.x += this.bossFighter.speed * speedOffset;
                if(this.bossFighter.x > this.stageW - this.bossFighter.width) { 
                    this.bossF = true;
                }
            }
        }
        
        this.gameHit();
    }

    private createEnemyBulletHandler(evt) {
        var bullet: Bullet;
        bullet = Bullet.produce(evt.target);
        bullet.x = evt.target.getBulletStartX(bullet);
        bullet.y = evt.target.getBulletStartY(bullet);
        this.addChildAt(bullet,this.numChildren - 1 - this.enemyFighters.length);
        this.enemyBullets.push(bullet);
    }

    private createSmallBulletHandler(evt) {
        var bullet: Bullet;
        bullet = Bullet.produce(evt.target);
        bullet.x = evt.target.getBulletStartX(bullet);
        bullet.y = evt.target.getBulletStartY(bullet);
        this.addChildAt(bullet,this.numChildren - 1 - this.enemyFighters.length);
        this.myBullets.push(bullet);
    }

    private myBulletCoe: number = 0;
    private myBulletBlo: boolean = true;
    
    private createMyBulletHandler(evt) {
        this.music.bullet();
        if(this.myBulletBlo) {
            this.myBulletCoe++;
        } else { 
            this.myBulletCoe--;
        }
        if(this.myBulletCoe == 0) {
            this.myBulletBlo = true;
        } else if(this.myBulletCoe == 5){ 
            this.myBulletBlo = false;
        }
        var bullet: Bullet[] = [];
        bullet.push(Bullet.produce(evt.target));
        bullet.push(Bullet.produce(evt.target));
        bullet.push(Bullet.produce(evt.target));
        bullet[0].position = 0.4 * this.myBulletCoe;
        bullet[1].position = 0;
        bullet[2].position = -0.4 * this.myBulletCoe;
        for(var i = 0;i < bullet.length;i++){ 
            bullet[i].positionNum = 1;
            bullet[i].x = evt.target.getBulletStartX(bullet[i]);
            bullet[i].y = evt.target.getBulletStartY(bullet[i]);
            this.addChildAt(bullet[i],this.numChildren - 1 - this.enemyFighters.length);
            this.myBullets.push(bullet[i]);
        }
    }
    
    private createBoosBulletHandler(evt) {
        var bullet: Bullet[] = [];
        bullet.push(Bullet.produce(evt.target));
        bullet.push(Bullet.produce(evt.target));
        bullet.push(Bullet.produce(evt.target));
        bullet.push(Bullet.produce(evt.target));
        bullet.push(Bullet.produce(evt.target));
        bullet[0].position = 0.03;
        bullet[1].position = 0.015;
        bullet[2].position = 0;
        bullet[3].position = -0.015;
        bullet[4].position = -0.03;
        for(var i = 0;i < bullet.length;i++) {
            bullet[i].positionNum = 1;
            bullet[i].x = evt.target.getBulletStartX(bullet[i]);
            bullet[i].y = evt.target.getBulletStartY(bullet[i]);
            this.addChildAt(bullet[i],this.numChildren - 1 - this.enemyFighters.length);
            this.enemyBullets.push(bullet[i]);
        }
    }
    
    private touchHandler(evt: egret.TouchEvent) { 
        if(evt.type == egret.TouchEvent.TOUCH_MOVE) {
            var tx: number = evt.stageX;
            var ty: number = evt.stageY;
            this.myFighter.setXY(tx,ty);
            this.bhFighter1.setXY(this.myFighter);
            this.bhFighter2.setXY(this.myFighter);
        }
    }
    private gameHit(): void {
        var i: number,j: number;
        var bullet: Bullet;
        var theFighter: EnemyAirplane;
        var myBulletsCount: number = this.myBullets.length;
        var enemyFighterCount: number = this.enemyFighters.length;
        var enemyBulletsCount: number = this.enemyBullets.length;

        var delBullets: Bullet[] = [];
        var delFighters: EnemyAirplane[] = [];

        //我的子弹碰撞
        for(i = 0;i < myBulletsCount;i++) {
            bullet = this.myBullets[i];
            //子弹与敌机的碰撞
            for(j = 0;j < enemyFighterCount;j++) {
                theFighter = this.enemyFighters[j];
                if(GameUtil.isHit(theFighter,bullet)) {
                    theFighter.blood -= bullet.power / this.level;
                    if(delBullets.indexOf(bullet) == -1)
                        delBullets.push(bullet);

                    if(theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1) {
                        delFighters.push(theFighter);
                    }
                }
            }
            if(this.isBoss) {
                if(GameUtil.isHit(this.bossFighter,bullet)) {
                    this.bossFighter.blood -= bullet.power / this.level;
                    if(delBullets.indexOf(bullet) == -1)
                        delBullets.push(bullet);

                    if(this.bossFighter.blood <= 0) {
                        this.enemyEnd(this.bossFighter);
                        this.bossFighter.stopFire();
                        this.bossFighter.removeEventListener("createBullet",this.createBoosBulletHandler,this);
                        this.removeChild(this.bossFighter);
                        this.isBoss = false;
                        this.gameNextReady();
                    }
                }
            }
        }
      
        //敌人的子弹可以减我血
        for(i = 0;i < enemyBulletsCount;i++) {
            bullet = this.enemyBullets[i];
            if(GameUtil.isHit(this.myFighter,bullet)) {
                this.reduceBlood(bullet.power);
                if(delBullets.indexOf(bullet) == -1)
                    delBullets.push(bullet);
            }
        }
        //敌机的撞击可以消灭我
        for(i = 0;i < enemyFighterCount;i++) {
            theFighter = this.enemyFighters[i];
            if(GameUtil.isHit(this.myFighter,theFighter)) {
                this.reduceBlood(10);
                if(delFighters.indexOf(theFighter) == -1)
                    delFighters.push(theFighter);
            }
        }
        if(this.myFighter.blood <= 0) {
            this.EndGame();
        }
        else {
            while(delBullets.length > 0) {
                bullet = delBullets.pop();
                this.removeChild(bullet);
                if(bullet.direction == "up")
                    this.myBullets.splice(this.myBullets.indexOf(bullet),1);
                else
                    this.enemyBullets.splice(this.enemyBullets.indexOf(bullet),1);
                Bullet.reclaim(bullet);
            }
            while(delFighters.length > 0) {
                theFighter = delFighters.pop();
                theFighter.stopFire();
                theFighter.removeEventListener("createBullet",this.createEnemyBulletHandler,this);
                this.removeChild(theFighter);
                this.enemyFighters.splice(this.enemyFighters.indexOf(theFighter),1);
                EnemyAirplane.reclaim(theFighter);
                this.enemyEnd(theFighter);
            }
        }
    }
    
}
