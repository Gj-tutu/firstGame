 class Bullet extends egret.Bitmap
    {
        private static cacheDict:Object = {};
        /**生产*/
        public static produce(airplane:Airplane):Bullet
        {
            let name: string = airplane.getBulletName();
            if(Bullet.cacheDict[name]==null)
                Bullet.cacheDict[name] = [];
            var dict: Bullet[] = Bullet.cacheDict[name];
            var bullet:Bullet;
            if(dict.length>0) {
                bullet = dict.pop();
            } else {
                bullet = airplane.getBullet();
            }
            bullet.name = name;
            return bullet;
        }
        /**回收*/
        public static reclaim(bullet: Bullet):void
        {
            if(Bullet.cacheDict[bullet.name]==null)
                Bullet.cacheDict[bullet.name] = [];
            var dict: Bullet[] = Bullet.cacheDict[bullet.name];
            if(dict.indexOf(bullet)==-1)
                dict.push(bullet);
        }
        
        public speed: number = 10;
        public power: number = 1;
        public direction: string = "up";
        public position: number = 0;
        public positionNum: number = 1;
        public constructor(texture:egret.Texture) {
            super(texture);
        }
    }
