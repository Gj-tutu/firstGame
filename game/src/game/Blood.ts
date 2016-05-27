/**
 *
 * @author 
 *
 */
class Blood extends egret.DisplayObjectContainer{
    private shp: egret.Shape;
    public constructor() {
        super();
        this.shp = new egret.Shape();
        this.addChild(this.shp);
        this.x = 5;
        this.y = 30;
    }
    
    public setBlood(num: number) {
        this.shp.graphics.clear();
        this.shp.graphics.beginFill(0xff0000);
        this.shp.graphics.drawRect(0,0,num * 10,10);
        this.shp.graphics.endFill();
    }
}
