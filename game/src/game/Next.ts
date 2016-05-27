/**
 *
 * @author 
 *
 */
class Next extends egret.DisplayObjectContainer{
    private time: egret.Timer;
    private numImg: egret.Texture[] = [
        ImageHandle.getTexture("ui_new_common_png",197,487,70,90),
        ImageHandle.getTexture("ui_new_common_png",131,412,70,90),
        ImageHandle.getTexture("ui_new_common_png",66,412,70,90),
        ImageHandle.getTexture("ui_new_common_png",-2,411,70,90),
        ImageHandle.getTexture("ui_new_common_png",391,426,70,90),
        ImageHandle.getTexture("ui_new_common_png",263,402,70,90),
        ImageHandle.getTexture("ui_new_common_png",196,398,70,90),
        ImageHandle.getTexture("ui_new_common_png",131,324,70,90),
        ImageHandle.getTexture("ui_new_common_png",65,324,70,90),
        ImageHandle.getTexture("ui_new_common_png",-1,324,70,90)
    ]
    public constructor() {
        super();
        this.time = new egret.Timer(1000*3);
        this.time.addEventListener(egret.TimerEvent.TIMER,this.start,this);
    }
    
    public setNumber(num: number) {
        var img = new egret.Bitmap(this.numImg[num]);
        this.addChild(img);
    }
    
    public ready() { 
        this.time.start();
    }
    
    public start() { 
        this.removeChildren();
        this.time.stop();
        this.dispatchEventWith("nextStart");
    }
  
}
