 class EnemyAirplane extends Airplane
 {
         private static cacheDict: Object = {};
         /**生产*/
         public static produce(name: string): EnemyAirplane {
             if(EnemyAirplane.cacheDict[name] == null)
                 EnemyAirplane.cacheDict[name] = [];
             var dict: EnemyAirplane[] = EnemyAirplane.cacheDict[name];
             var enemy: EnemyAirplane;
             if(dict.length > 0) {
                 enemy = dict.pop();
             } else {
                 enemy = new EnemyAirplane(name);
             }
             enemy.name = name;
             return enemy;
         }
         /**回收*/
         public static reclaim(enemy: EnemyAirplane): void {
             if(EnemyAirplane.cacheDict[enemy.name] == null)
                 EnemyAirplane.cacheDict[enemy.name] = [];
             var dict: EnemyAirplane[] = EnemyAirplane.cacheDict[enemy.name];
             if(dict.indexOf(enemy) == -1)
                 dict.push(enemy);
         }
         
        public enemyMap: any = {
            "1": {
                "texture":ImageHandle.getTexture("img_plane_enemy_png", 265,474,100,78),
                "fireDelay": 0,
                "bulletTexture": "",
                "bulletSpeed": 0,
                "bulletPower": 0,
                "speed": 5,
                "blood": 2
            },
            "2": {
                "texture": ImageHandle.getTexture("img_plane_enemy_png",161,476,106,74),
                "fireDelay": 0,
                "bulletTexture": "",
                "bulletSpeed": 0,
                "bulletPower": 0,
                "speed": 4,
                "blood": 4
            },
            "3": {
                "texture": ImageHandle.getTexture("img_plane_enemy_png",0,230,190,134),
                "fireDelay": 1000,
                "bulletTexture": ImageHandle.getTexture("img_bullet_png",283,172,50,50),
                "bulletSpeed": 6,
                "bulletPower": 1,
                "speed": 2,
                "blood": 10
            },
            "4": {
                "texture": ImageHandle.getTexture("img_plane_enemy_png",186,338,182,138),
                "fireDelay": 700,
                "bulletTexture": ImageHandle.getTexture("img_bullet_png",283,172,50,50),
                "bulletSpeed": 8,
                "bulletPower": 1,
                "speed": 1.5,
                "blood": 15
            }
        };
        private planeName: string;
        public name: string;
        public constructor(name:string) {
            super();
            this.planeName = name;
            this.speed = this.enemyMap[name]["speed"];
            this.blood = this.enemyMap[name]["blood"];
            this.setImg(new egret.Bitmap(this.enemyMap[name]['texture']));
            if(this.enemyMap[name]['fireDelay']) {
                this.setFireDelay(this.enemyMap[name]['fireDelay']);
            }
        }
        


        public getBulletTexture() {
            return this.enemyMap[this.planeName]['bulletTexture'];
        }

        public getBulletName() {
            return "enemy" + this.planeName;
        }

        public setXY(x: number,y: number) {
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
        }

        public getBullet() {
            let bullet = new Bullet(this.getBulletTexture());
            bullet.speed = this.enemyMap[this.planeName]["bulletSpeed"];
            bullet.power = this.enemyMap[this.planeName]["bulletPower"];
            bullet.direction = "down";
            bullet.width = bullet.width / 1.5;
            bullet.height = bullet.height / 1.5;
            return bullet;
        }
        
        public addBlood() { 
            this.blood = this.enemyMap[this.planeName]["blood"];
        }
        
        public getScore() { 
            return this.enemyMap[this.planeName]["blood"];
        }

        public getBulletStartX(bullet: Bullet) {
            return this.x + this.width/2 - bullet.width/2;
        }

        public getBulletStartY(bullet: Bullet) {
            return this.y + this.height - bullet.height;
        }
    }
