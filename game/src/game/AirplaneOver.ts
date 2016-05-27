 class AirplaneOver extends egret.Bitmap
    {
     private static cacheDict = [];
        /**生产*/
     public static produce(): AirplaneOver
        {
            var dict: AirplaneOver[] = AirplaneOver.cacheDict;
            var airplaneOver: AirplaneOver;
            if(dict.length>0) {
                airplaneOver = dict.pop();
            } else {
                airplaneOver = new AirplaneOver();
            }
            return airplaneOver;
        }
        /**回收*/
        public static reclaim(airplaneOver: AirplaneOver):void
        {
            var dict: AirplaneOver[] = AirplaneOver.cacheDict;
            if(dict.indexOf(airplaneOver)==-1)
                dict.push(airplaneOver);
        }
        
        private endImg: egret.Texture[] = [
            RES.getRes("wsparticle_01_png"),
            RES.getRes("wsparticle_06_png"),
            RES.getRes("wsparticle_07_png")
        ];
        private endTime: egret.Timer;
        private animatIndex: number;
        private fun: any;
        public constructor() {
            super();
            this.endTime = new egret.Timer(100);
            this.endTime.addEventListener(egret.TimerEvent.TIMER,this.animat,this);
        }
        
        public open(airplane: Airplane,callBack: any) {
            this.fun = callBack;
            this.animatIndex = 0;
            this.texture = this.endImg[this.animatIndex];
            this.visible = true;
            this.x = airplane.x + airplane.width / 2 - this.width / 2;
            this.y = airplane.y + airplane.height / 2 - this.height / 2;
            this.endTime.start();
        }
        
        private animat() { 
            var index = this.animatIndex + 1;
            this.animatIndex = index == this.endImg.length ? 0 : index;
            if(this.animatIndex == 0) {
                this.endTime.stop();
                this.visible = false;
                if(this.fun) {
                    this.fun();
                    this.fun = null;
                }
            } else {
                this.texture = this.endImg[this.animatIndex];
            }
        }
    }
