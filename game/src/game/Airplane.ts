 class Airplane extends egret.DisplayObjectContainer
    {
        /**飞机位图*/
        protected bmp:egret.Bitmap;
        /*飞机开火间隔*/
        protected fireDelay: number;
        /**定时射*/
        private fireTimer:egret.Timer;
        /**飞机生命值*/
        public blood: number;
        public bloodNum: number = 1;
        public speed: number = 5;
        protected airName: string = "air";
        protected airBulletName: string = "1";
        protected bulletTexture: egret.Texture = ImageHandle.getTexture("img_bullet_png",953,640,50,50);
        public constructor() {
            super();
        }
        
        /*设置飞机样式*/
        public setImg(bmp: egret.Bitmap) {
            if(this.bmp) { 
                this.removeChild(this.bmp);
            }
            this.bmp = bmp;
            this.addChild(this.bmp);
        }
        
        /*设置飞机开火间隔*/
        public setFireDelay(fireDelay: number) { 
            this.fireTimer = new egret.Timer(fireDelay);
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
        }
        
        /**开火*/
        public fire():void {
            if(!this.fireTimer) return;
            this.fireTimer.start();
        }
        /**停火*/
        public stopFire():void {
            if(!this.fireTimer) return;
            this.fireTimer.stop();
        }
        /**创建子弹*/
        private createBullet(evt:egret.TimerEvent):void {
            this.dispatchEventWith("createBullet",false);
        }

        public getScore() {
            return this.bloodNum * 1.5;
        }
        
        public getBulletTexture() {
            return this.bulletTexture;
        }

        public getBulletName() {
            return this.airBulletName;
        }
        
        public getBullet() { 
            return new Bullet(this.getBulletTexture());
        }
    }
