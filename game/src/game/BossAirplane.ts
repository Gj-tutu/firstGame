 class BossAirplane extends Airplane
    {
        /**飞机生命值*/
         public bloodNum: number = 200;
        /*飞机开火间隔*/
        protected fireDelay: number = 1300;
        protected bulletTexture: egret.Texture = ImageHandle.getTexture("img_bullet_png",780,693,55,55);
        private texture: egret.Texture = ImageHandle.getTexture("img_plane_boss_png",0,370,548,280);
        public speed: number = 1;
        public constructor() {
            super();
            var bmp = new egret.Bitmap(this.texture);
            bmp.width = bmp.width / 2;
            bmp.height = bmp.height / 2;
            this.blood = this.bloodNum;
            this.setImg(bmp);
            this.setFireDelay(this.fireDelay);
        }
        
        public getBulletTexture() { 
            return this.bulletTexture;
        }
        
        public getBulletName() { 
            return "boss";
        }
        
        public setXY(x:number, y:number) { 
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
        }

        public getBullet() {
            let bullet = new Bullet(this.getBulletTexture());
            bullet.width = bullet.width / 1.5;
            bullet.height = bullet.height / 1.5;
            bullet.speed = 2.5;
            bullet.power = 1;
            bullet.direction = "down";
            return bullet;
        }

        public addBlood() {
            this.blood = this.bloodNum;
        }

        public getScore() {
            return this.bloodNum * 1.5;
        }

        public getBulletStartX(bullet: Bullet) {
            return this.x + this.width / 2 - bullet.width / 2;
        }

        public getBulletStartY(bullet: Bullet) {
            return this.y + bullet.height;
        }
    }
