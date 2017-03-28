class NPC extends engine.DisplayObjectContainer implements Observer {
    public _emoji: engine.Bitmap = new engine.Bitmap;
    public _id: string;
    public _chara: engine.Bitmap = new engine.Bitmap;

    state: boolean = false;
    _main: Main;
    constructor(id: string, x: number, y: number, texture: string, main: Main) {
        super();
        this._main = main;
        this._id = id;
        // this.x=x;
        // this.y=y;
        this._chara.x = x;
        this._chara.y = y
        this._chara.img.src =texture;

        this._emoji.x = x;
        this._emoji.y = y - 40;
        this._emoji.scaleX = 2;
        this._emoji.scaleY = 2;
        this._emoji.addEventListener(engine.TouchType.TOUCH_TAP, this.onNPCClick);
        this._chara.addEventListener(engine.TouchType.TOUCH_TAP, this.onNPCClick);
        // for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
        //     if (this._id == TaskService.getInstance().taskList[i].fromNPCId) {
        //         this._emoji.img.src = RES.getRes("ytanhao_png");
        //     }
        // }
        this.onChange(TaskService.getInstance().taskList[0]);
        this._emoji.touchEnabled = true;
        this._chara.touchEnabled = true;
        this.addChild(this._chara);
        this.addChild(this._emoji);

        TaskService.addObserver(this);


    }
    static isStart: boolean = false;
    private onNPCClick(e:MouseEvent) {
        var startx: number = Math.floor((GameScene.chara._body.x + 50) / 100);
        var starty: number = Math.floor(GameScene.chara._body.y / 100);
        var endx: number = Math.floor(e.offsetX / 100);
        var endy: number = Math.floor(e.offsetY / 100);
        var path: TileNode[] = GameScene.map.astarPath(startx - 1, starty, endx, endy);
        if (path.length != 1) {
            this._main.list.addCommand(new WalkCommand(GameScene.chara, e.offsetX, e.offsetY, path));
        }
        //console.log(endx);

        if (this._id == TaskService.getInstance().taskList[0].fromNPCId && NPC.isStart == false) {
            NPC.isStart = true;
            this._main.list.addCommand(new TalkCommand(this));
        } else if (this._id == TaskService.getInstance().taskList[0].toNPCId && NPC.isStart == true) {
            this._main.list.addCommand(new TalkCommand(this));
        }

        this._main.list.execute();

        // for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
        //     switch (TaskService.getInstance().taskList[i].status) {
        //         case TaskStatus.ACCEPTABLE:
        //             if (this.state == false) {
        //                 var dialogPanel = new DialoguePanel(this._chara);
        //                 this.addChild(dialogPanel);
        //                 this.state = true;
        //                 break;
        //             } else if (this.state == true) {
        //                 break;
        //             }
        //         case TaskStatus.DURING:
        //             this._emoji.img.src = RES.getRes("ywenhao_png");
        //             TaskService.getInstance().taskList[i].status = TaskStatus.CAN_SUMBIT;
        //             break;
        //     }
        // }
        // console.log(TaskService.getInstance().taskList[0].status);
        ////////////////////////////////////////////////////////////////放到command里了
    }
    public onChange(task: Task) {
        switch (task.status) {
            case TaskStatus.ACCEPTABLE:
                for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
                    if (this._id == TaskService.getInstance().taskList[i].fromNPCId) {
                        this._emoji.img.src = "asset/ytanhao.png";

                    }
                }
                break;
            case TaskStatus.DURING:
                if (task.fromNPCId == this._id) {
                    this._emoji.img.src = null;
                } else if (task.toNPCId == this._id) {
                    this._emoji.img.src = "asset/gwenhao.png";
                }
                break;
            case TaskStatus.CAN_SUMBIT:
                //useless
                break;
            case TaskStatus.SUBMITTED || TaskStatus.UNACCEPTABLE:
                this._emoji.img.src = null;
                break;
        }
        // if (task.status == TaskStatus.ACCEPTABLE) {
        //     this._emoji.img.src = RES.getRes("ytanhao_png");
        // }
        // if (task.status == TaskStatus.DURING) {
        //     this._emoji.img.src = RES.getRes("gwenhao_png");
        // }
        // if (task.status == TaskStatus.CAN_SUMBIT) {
        //     this._emoji.img.src = RES.getRes("ywenhao_png");
        // }
        // if (task.status == TaskStatus.SUBMITTED||task.status == TaskStatus.UNACCEPTABLE) {
        //     this._emoji.img.src = RES.getRes(null);
        // }

    }
}