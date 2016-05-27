/**
 *
 * @author 
 *
 */
class Button extends egret.DisplayObjectContainer{
    private bmp:egret.Bitmap;
    public label:egret.TextField ;
    public constructor(texture:egret.Texture,labelvalue?:string) {
        super();
       // this.fireDelay = fireDelay;
        this.bmp = new egret.Bitmap(texture);
        this.bmp.width *=0.5;
        this.bmp.height *=0.5;
        this.addChild(this.bmp);
        this.label = new egret.TextField ();
        this.label.text = labelvalue;
        
        this.addChild(this.label);
        this.label.size=24;
        this.label.width =this.bmp.width;
        this.label.height =this.bmp.height;
        this.label.textAlign = egret.HorizontalAlign.CENTER;
        this.label.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.label.y = -5;
        this.touchEnabled = true;
    }
    
    public click(callback, target) {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,callback,target);//点击按钮开始游戏
    }
  
}
