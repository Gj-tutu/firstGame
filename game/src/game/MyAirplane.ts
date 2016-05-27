 class MyAirplane extends Airplane
    {
        /**飞机生命值*/
        public blood:number;
        public bloodNum: number = 10;
        /*飞机开火间隔*/
        protected fireDelay: number = 100;
        protected bulletTexture: egret.Texture = ImageHandle.getTexture("img_bullet_png",768,120,172,122);
        private texture: egret.Texture = ImageHandle.getTexture("img_plane_main_png",268,0,120,106);
        public constructor() {
            super();
            //添加移动飞机
            this.touchEnabled = true;
            this.setImg(new egret.Bitmap(this.texture));
            this.setFireDelay(this.fireDelay);
        }
        
        public getBulletTexture() { 
            return this.bulletTexture;
        }
        
        public getBulletName() { 
            return "my";
        }
        
        public setXY(x:number, y:number) { 
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
        }

        public getBullet() {
            let bullet = new Bullet(this.getBulletTexture());
            bullet.width = bullet.width / 1.5;
            bullet.height = bullet.height / 1.5;
            bullet.speed = 15;
            bullet.power = 1;
            bullet.direction = "up";
            return bullet;
        }

        public addBlood() {
            this.blood = this.bloodNum;
        }

        public getBulletStartX(bullet: Bullet) {
            return this.x + this.width / 2 - bullet.width / 2;
        }

        public getBulletStartY(bullet: Bullet) {
            return this.y - bullet.height;
        }
    }
