interface Command {

    execute(callback: Function): void;

    cancel(callback: Function): void;

}

class WalkCommand implements Command {
    private chara: Character;
    private x;
    private y;
    private path: TileNode[];

    constructor(chara: Character, x: number, y: number, path: TileNode[]) {
        this.x = x;
        this.y = y;
        this.chara = chara;
        this.path = path;

    }

    execute(callback: Function): void {
        // GameScene.getCurrentScene().moveTo(this.x, this.y, function () {
        //     callback();
        // })
        this.chara.move(this.x, this.y, this.path, function () {
            callback();
        });
    }

    cancel(callback: Function) {
        // GameScene.getCurrentScene().stopMove(function () {
        //     callback();
        // })
        this.chara.stopMove(function () {
            callback();
        })
    }
}

class FightCommand implements Command {
    /**
     * 所有的 Command 都需要有这个标记，应该如何封装处理这个问题呢？
     */
    private _hasBeenCancelled = false;
    _main:Main;

    constructor(main:Main){
        this._main=main;
    }

    execute(callback: Function): void {
        console.log("开始战斗")
        if (TaskService.getInstance().taskList[1].status == TaskStatus.DURING) {
            TaskService.getInstance().taskList[1]._current++;
            this._main.killCount.text = "Killed " + TaskService.getInstance().taskList[1]._current;
            console.log(TaskService.getInstance().taskList[1]._current)
            if (TaskService.getInstance().taskList[1]._current == 10) {
                TaskService.getInstance().finish(TaskService.getInstance().taskList[1].id);
            }
            console.log("开始结束")
        }
    }

    cancel(callback: Function) {
        console.log("脱离战斗")
        this._hasBeenCancelled = true;
        setInterval(function () {
            callback();
        }, this, 100)

    }
}

class TalkCommand implements Command {

    _npc: NPC

    constructor(npc: NPC) {
        this._npc = npc;
    }

    execute(callback: Function): void {
        //console.log("打开对话框")
        for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
            switch (TaskService.getInstance().taskList[i].status) {
                case TaskStatus.ACCEPTABLE:
                    if (this._npc.state == false&&this._npc._id==TaskService.getInstance().taskList[i].fromNPCId) {
                        var dialogPanel = new DialoguePanel(this._npc._chara);
                        this._npc.addChild(dialogPanel);
                        this._npc.state = true;
                        break;
                    } else if (this._npc.state == true) {
                        break;
                    }
                case TaskStatus.DURING:
                    this._npc._emoji.img.src="asset/ywenhao.png";
                    TaskService.getInstance().taskList[i].status = TaskStatus.CAN_SUMBIT;
                    break;
            }
        }
        console.log(TaskService.getInstance().taskList[0].status);

        setInterval(function () {
            console.log("结束对话")
            callback();
        }, this, 500)
    }

    cancel(callback: Function) {
        console.log("关闭对话框");
    }
}
