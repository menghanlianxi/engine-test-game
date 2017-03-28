var canvas = document.getElementById("canvas") as HTMLCanvasElement;
var stage = engine.run(canvas);
console.log("loading")
setTimeout(function() {
    var main=new Main(stage);
    stage.addChild(main);
    console.log("loaded")
}, 5000);

class Main extends engine.DisplayObjectContainer {

    stage:engine.DisplayObjectContainer;

    public list = new CommandList();
    public panel = new Panel();
    public bagState: boolean = false;

    public killCount: engine.TextField;

    constructor(stage:engine.DisplayObjectContainer){
        super();
        this.stage=stage;
        this.createGameScene();
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        var mainScene = new GameScene("MainScene", this);
        GameScene.replaceScene(mainScene);
        this.list.execute();
console.log(this)
        // engine.setTimeout(function () {
        //     this.list.cancel();
        //     this.list.addCommand(new WalkCommand(5, 5))
        //     this.list.execute();

        // }, this, 6000)

        /////////////////////背包按钮
        var bag = new engine.TextField;

        bag.text = "bag";
        bag.x = 900;
        bag.y = 900;
        bag.textColor = "0x000000";
        this.addChild(bag);
        this.panel.touchEnabled = true;
        bag.addEventListener(engine.TouchType.TOUCH_TAP, () => {
            if (this.bagState == false) {
                this.addChild(this.panel);
                this.bagState = true;
            } else if (this.bagState == true) {
                this.removeChild(this.panel);
                this.bagState = false;
            }

        })
        bag.touchEnabled = true;

        this.killCount = new engine.TextField;
        this.killCount.text = "";
        this.killCount.x=700;
        this.killCount.y = 50;
        this.addChild(this.killCount);
    }

    private createBitmapByName(name: string): engine.Bitmap {
        var result = new engine.Bitmap();
        var texture = name;
        result.img.src = texture;
        return result;
    }

}

class CommandList {

    private _list: Command[] = [];
    private currentCommand: Command;
    private _frozen = false;

    constructor(){
        
    }

    addCommand(command: Command) {
        this._list.push(command);
    }

    cancel() {
        //this.currentCommand=this._list.pop();
        this._list = [];

        // this.currentCommand.cancel(()=>{
        //     console.log("///////////////////////////////")
        // });

    }

    execute() {

        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command)
            command.execute(() => {
                this.execute()
            })

        }
        else {
            console.log("全部命令执行完毕")
        }
    }

}
