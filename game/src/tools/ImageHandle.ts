/**
 *
 * @author 
 *
 */
class ImageHandle {
	public constructor() {
	}
	
    public static getBitMap(res: string, x:number, y:number, w:number, h:number): egret.Bitmap {
        return new egret.Bitmap(this.getTexture(res, x, y, w, h));
    }
    
    public static getTexture(res: string, x:number, y:number, w:number, h:number): egret.Texture { 
        var rechange: egret.Rectangle = new egret.Rectangle(x,y,w,h);
        var texture: egret.Texture = RES.getRes(res);
        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(new egret.Bitmap(texture),rechange);
        return renderTexture;
    }
}
