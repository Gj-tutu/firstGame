 class GameUtil
    {
        //点和物品的碰撞判断方式，较为精确及可控
        public static isHit(obj1:egret.DisplayObject,obj2:egret.DisplayObject):boolean
        {
            var rect2x: number;
            var rect2y: number;
            rect2x = obj2.x + obj2.width/2;
            rect2y = obj2.y + obj2.height/2;
            return obj1.hitTestPoint(rect2x,rect2y)
            
        }
    }



