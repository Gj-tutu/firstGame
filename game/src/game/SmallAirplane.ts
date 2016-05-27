 class SmallAirplane extends Airplane
    {
        public isright: boolean = false;
        private animationTime: egret.Timer;
        private animationIndex: number;
        /*飞机开火间隔*/
        protected fireDelay: number = 500;
        protected bulletTexture: egret.Texture = ImageHandle.getTexture("img_bullet_png",500,604,63,137);
        private textureList: egret.Texture[] = [
            ImageHandle.getTexture("img_pet_png",443,508,62,57),
            ImageHandle.getTexture("img_pet_png",169,209,62,57),
            ImageHandle.getTexture("img_pet_png",0,83,62,57),
            ImageHandle.getTexture("img_pet_png",224,262,62,57),
            ImageHandle.getTexture("img_pet_png",0,83,62,57),
            ImageHandle.getTexture("img_pet_png",169,209,62,57)
        ]
        public constructor(right:boolean = false) {
            super();
            this.isright = right;
            this.setImg(new egret.Bitmap(this.textureList[0]));
            this.setFireDelay(this.fireDelay);
            this.animationIndex = 0;
            this.animationTime = new egret.Timer(120);
            this.animationTime.addEventListener(egret.TimerEvent.TIMER,this.animation,this);
            this.animationTime.start();
        }
        
        private animation() {
            var index = this.animationIndex + 1;
            this.animationIndex = index == this.textureList.length ? 0 : index;
            this.bmp.texture = this.textureList[this.animationIndex];
        }
        
        public setXY(plane:MyAirplane) { 
            if(this.isright) {
                this.x = plane.x + plane.width;
            } else { 
                this.x = plane.x - this.width;
            }
            this.y = plane.y + 30;
        }

        public getBulletTexture() {
            return this.bulletTexture;
        }

        public getBulletName() {
            return "small";
        }
        
        public getBullet() {
            let bullet = new Bullet(this.getBulletTexture());
            bullet.width = bullet.width / 2;
            bullet.height = bullet.height / 2;
            bullet.speed = 10;
            bullet.power = 1;
            bullet.direction = "up";
            return bullet;
        }
        
        public getBulletStartX(bullet: Bullet) { 
            return this.x + this.width / 2 - bullet.width / 2;
        }
        
        public getBulletStartY(bullet:Bullet) {
            return this.y - bullet.height;
        }
    }
