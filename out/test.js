var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WalkCommand = (function () {
    function WalkCommand(chara, x, y, path) {
        this.x = x;
        this.y = y;
        this.chara = chara;
        this.path = path;
    }
    WalkCommand.prototype.execute = function (callback) {
        // GameScene.getCurrentScene().moveTo(this.x, this.y, function () {
        //     callback();
        // })
        this.chara.move(this.x, this.y, this.path, function () {
            callback();
        });
    };
    WalkCommand.prototype.cancel = function (callback) {
        // GameScene.getCurrentScene().stopMove(function () {
        //     callback();
        // })
        this.chara.stopMove(function () {
            callback();
        });
    };
    return WalkCommand;
}());
var FightCommand = (function () {
    function FightCommand(main) {
        /**
         * 所有的 Command 都需要有这个标记，应该如何封装处理这个问题呢？
         */
        this._hasBeenCancelled = false;
        this._main = main;
    }
    FightCommand.prototype.execute = function (callback) {
        console.log("开始战斗");
        if (TaskService.getInstance().taskList[1].status == TaskStatus.DURING) {
            TaskService.getInstance().taskList[1]._current++;
            this._main.killCount.text = "Killed " + TaskService.getInstance().taskList[1]._current;
            console.log(TaskService.getInstance().taskList[1]._current);
            if (TaskService.getInstance().taskList[1]._current == 10) {
                TaskService.getInstance().finish(TaskService.getInstance().taskList[1].id);
            }
            console.log("开始结束");
        }
    };
    FightCommand.prototype.cancel = function (callback) {
        console.log("脱离战斗");
        this._hasBeenCancelled = true;
        setInterval(function () {
            callback();
        }, this, 100);
    };
    return FightCommand;
}());
var TalkCommand = (function () {
    function TalkCommand(npc) {
        this._npc = npc;
    }
    TalkCommand.prototype.execute = function (callback) {
        //console.log("打开对话框")
        for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
            switch (TaskService.getInstance().taskList[i].status) {
                case TaskStatus.ACCEPTABLE:
                    if (this._npc.state == false && this._npc._id == TaskService.getInstance().taskList[i].fromNPCId) {
                        var dialogPanel = new DialoguePanel(this._npc._chara);
                        this._npc.addChild(dialogPanel);
                        this._npc.state = true;
                        break;
                    }
                    else if (this._npc.state == true) {
                        break;
                    }
                case TaskStatus.DURING:
                    this._npc._emoji.img.src = "asset/ywenhao.png";
                    TaskService.getInstance().taskList[i].status = TaskStatus.CAN_SUMBIT;
                    break;
            }
        }
        console.log(TaskService.getInstance().taskList[0].status);
        setInterval(function () {
            console.log("结束对话");
            callback();
        }, this, 500);
    };
    TalkCommand.prototype.cancel = function (callback) {
        console.log("关闭对话框");
    };
    return TalkCommand;
}());
var GameScene = (function () {
    function GameScene(type, main) {
        //super();
        switch (type) {
            case "MainScene":
                GameScene.map = new doMap();
                main.addChild(GameScene.map);
                GameScene.chara = new Character(main);
                main.addChild(GameScene.chara);
                GameScene.chara.idle();
                GameScene.map.addEventListener(engine.TouchType.TOUCH_TAP, function (e) {
                    if (main.bagState == true) {
                        main.removeChild(main.panel);
                        main.bagState = false;
                    }
                    var startx = Math.floor((GameScene.chara._body.x + 50) / 100);
                    var starty = Math.floor(GameScene.chara._body.y / 100);
                    var endx = Math.floor(e.offsetX / 100);
                    var endy = Math.floor(e.offsetY / 100);
                    var path = GameScene.map.astarPath(startx, starty, endx, endy);
                    //console.log(endx);
                    if (path.length > 1) {
                        //chara.move(e.localX, e.localY, path);
                        main.list.cancel();
                        //engine.Tween.removeAllTweens();
                        main.list.addCommand(new WalkCommand(GameScene.chara, e.offsetX, e.offsetY, path));
                        main.list.execute();
                    }
                });
                GameScene.map.touchEnabled = true;
                //main.stage.touchEnabled=true;
                /////////////////////////////////////////////////////////////////
                var taskList = new Array();
                taskList[0] = new Task("0", "对话任务", TaskStatus.ACCEPTABLE, "desc", "npc_0", "npc_1", new NPCTalkTaskCondition());
                taskList[1] = new Task("1", "杀十个白玉昆", TaskStatus.UNACCEPTABLE, "desc", "npc_0", "npc_1", new KillMonsterTaskCondition());
                var instance = TaskService.getInstance(); //danli
                var taskPanel = new TaskPanel();
                main.addChild(taskPanel);
                for (var i = 0; i < taskList.length; i++) {
                    TaskService.getInstance().taskList[i] = instance.getTaskByCustomRole(function addTask() {
                        if (taskList[i].status == TaskStatus.UNACCEPTABLE || taskList[i].status == TaskStatus.SUBMITTED) {
                            taskList[i] == null;
                        }
                        return taskList[i];
                    });
                }
                var NPC_0 = new NPC("npc_0", 20, 500, "asset/npc_0.png", main);
                var NPC_1 = new NPC("npc_1", 500, 100, "asset/npc_1.png", main);
                main.addChild(NPC_0);
                main.addChild(NPC_1);
                console.log(TaskService.getInstance().taskList[0]);
                // for(var task of taskList){
                //     console.log(task.name);
                // }
                var killButton = new engine.TextField;
                killButton.x = 300;
                killButton.y = 700;
                killButton.textColor = "0x000000";
                killButton.text = "MONSTER";
                main.addChild(killButton);
                killButton.addEventListener(engine.TouchType.TOUCH_TAP, function (e) {
                    if (main.bagState == true) {
                        main.removeChild(main.panel);
                        main.bagState = false;
                    }
                    var startx = Math.floor((GameScene.chara._body.x + 50) / 100);
                    var starty = Math.floor(GameScene.chara._body.y / 100);
                    var endx = Math.floor(e.offsetX / 100);
                    var endy = Math.floor(e.offsetY / 100);
                    var path = GameScene.map.astarPath(startx - 1, starty, endx, endy);
                    if (path.length > 1) {
                        main.list.cancel();
                        main.list.addCommand(new WalkCommand(GameScene.chara, e.offsetX, e.offsetY, path));
                        console.log(path);
                    }
                    main.list.addCommand(new FightCommand(main));
                    main.list.execute();
                    // if (TaskService.getInstance().taskList[1].status == TaskStatus.DURING) {
                    //     TaskService.getInstance().taskList[1]._current++;
                    //     main.killCount.text = "Killed " + TaskService.getInstance().taskList[1]._current;
                    //     console.log(TaskService.getInstance().taskList[1]._current)
                    //     if (TaskService.getInstance().taskList[1]._current == 10) {
                    //         TaskService.getInstance().finish(TaskService.getInstance().taskList[1].id);
                    //     }
                    // }
                });
                killButton.touchEnabled = true;
                break;
        }
    }
    GameScene.replaceScene = function (scene) {
        GameScene.scene = scene;
    };
    GameScene.getCurrentScene = function () {
        return GameScene.scene;
    };
    return GameScene;
}());
var canvas = document.getElementById("canvas");
var stage = engine.run(canvas);
console.log("loading");
setTimeout(function () {
    var main = new Main(stage);
    stage.addChild(main);
    console.log("loaded");
}, 5000);
var Main = (function (_super) {
    __extends(Main, _super);
    function Main(stage) {
        var _this = _super.call(this) || this;
        _this.list = new CommandList();
        _this.panel = new Panel();
        _this.bagState = false;
        _this.stage = stage;
        _this.createGameScene();
        return _this;
    }
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var _this = this;
        var mainScene = new GameScene("MainScene", this);
        GameScene.replaceScene(mainScene);
        this.list.execute();
        console.log(this);
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
        bag.addEventListener(engine.TouchType.TOUCH_TAP, function () {
            if (_this.bagState == false) {
                _this.addChild(_this.panel);
                _this.bagState = true;
            }
            else if (_this.bagState == true) {
                _this.removeChild(_this.panel);
                _this.bagState = false;
            }
        });
        bag.touchEnabled = true;
        this.killCount = new engine.TextField;
        this.killCount.text = "";
        this.killCount.x = 700;
        this.killCount.y = 50;
        this.addChild(this.killCount);
    };
    Main.prototype.createBitmapByName = function (name) {
        var result = new engine.Bitmap();
        var texture = name;
        result.img.src = texture;
        return result;
    };
    return Main;
}(engine.DisplayObjectContainer));
var CommandList = (function () {
    function CommandList() {
        this._list = [];
        this._frozen = false;
    }
    CommandList.prototype.addCommand = function (command) {
        this._list.push(command);
    };
    CommandList.prototype.cancel = function () {
        //this.currentCommand=this._list.pop();
        this._list = [];
        // this.currentCommand.cancel(()=>{
        //     console.log("///////////////////////////////")
        // });
    };
    CommandList.prototype.execute = function () {
        var _this = this;
        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command);
            command.execute(function () {
                _this.execute();
            });
        }
        else {
            console.log("全部命令执行完毕");
        }
    };
    return CommandList;
}());
var DialoguePanel = (function (_super) {
    __extends(DialoguePanel, _super);
    function DialoguePanel(chara) {
        var _this = _super.call(this) || this;
        _this._textField = new engine.TextField;
        _this._button = new engine.Bitmap();
        _this.panel = new engine.Shape;
        _this.panel.x = 400;
        _this.panel.y = 400;
        _this.panel.graphics.clear();
        _this.panel.graphics.beginFill(0x000000, 0.5);
        _this.panel.graphics.drawRect(0, 0, 250, 300);
        _this.panel.graphics.endFill();
        _this._button.scaleX = 3;
        _this._button.scaleY = 3;
        _this._button.x = 500;
        _this._button.y = 400;
        _this._button.img.src = "asset/gtanhao.png";
        _this._textField.x = 400;
        _this._textField.y = 400;
        _this._textField.text = "与npc1对话!";
        _this.addChild(_this.panel);
        _this.addChild(_this._textField);
        _this.addChild(_this._button);
        _this._button.addEventListener(engine.TouchType.TOUCH_TAP, _this.onButtonClick);
        _this._button.touchEnabled = true;
        console.log(TaskService.getInstance().taskList[0].status);
        return _this;
    }
    DialoguePanel.prototype.onButtonClick = function (e) {
        var _this = this;
        console.log(TaskService.getInstance().taskList[0].status);
        for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
            switch (TaskService.getInstance().taskList[i].status) {
                case TaskStatus.ACCEPTABLE:
                    if (TaskService.getInstance().taskList[i].id == "0") {
                        TaskService.getInstance().accept(TaskService.getInstance().taskList[i].id);
                        this._textField.text = "已接受！\n去找npc1说话吧！\n把问号点成金色";
                    }
                    else if (TaskService.getInstance().taskList[i].id == "1") {
                        TaskService.getInstance().accept(TaskService.getInstance().taskList[i].id);
                        this._textField.text = "已接受新任务！\n去杀十个白玉昆！";
                    }
                    break;
                case TaskStatus.CAN_SUMBIT:
                    this._textField.text = "已完成！";
                    TaskService.getInstance().taskList[1].status = TaskStatus.ACCEPTABLE;
                    TaskService.getInstance().finish(TaskService.getInstance().taskList[i].id);
                    setInterval(function () {
                        _this.removeChild(_this.panel);
                        _this.removeChild(_this._textField);
                        _this.removeChild(_this._button);
                    }, this, 3000);
                    break;
            }
        }
    };
    return DialoguePanel;
}(engine.DisplayObjectContainer));
var EventEmitter = (function (_super) {
    __extends(EventEmitter, _super);
    function EventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventEmitter.prototype.addObserver = function (observer) {
    };
    EventEmitter.prototype.notify = function (task) {
    };
    return EventEmitter;
}(engine.DisplayObjectContainer));
var TaskService = (function (_super) {
    __extends(TaskService, _super);
    function TaskService() {
        var _this = _super.call(this) || this;
        _this.observerList = new Array();
        _this.taskList = new Array();
        return _this;
    }
    //danli
    TaskService.getInstance = function () {
        if (this.instance == null) {
            this.instance = new TaskService();
        }
        return this.instance;
    };
    TaskService.prototype.onChange = function (task) {
    };
    TaskService.prototype.accept = function (id) {
        if (!id) {
            return ErrorCode.FAILED;
        }
        var task = TaskService.getInstance().taskList[id];
        if (task.id == id) {
            task.status = TaskStatus.DURING;
            TaskService.notify(task);
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.FAILED;
        }
    };
    TaskService.prototype.finish = function (id) {
        if (!id) {
            return ErrorCode.FAILED;
        }
        var task = TaskService.getInstance().taskList[id];
        if (task.id == id) {
            task.status = TaskStatus.SUBMITTED;
            TaskService.notify(task);
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.FAILED;
        }
    };
    TaskService.prototype.getTaskByCustomRole = function (rule) {
        return rule();
    };
    TaskService.notify = function (task) {
        for (var _i = 0, _a = TaskService.getInstance().observerList; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.onChange(task);
        }
        //console.log(TaskService.getInstance().taskList[0].status);
    };
    TaskService.addObserver = function (observer) {
        for (var i = 0; i < TaskService.getInstance().observerList.length; i++) {
            if (observer == TaskService.getInstance().observerList[i])
                return ErrorCode.FAILED;
        }
        TaskService.getInstance().observerList.push(observer);
    };
    return TaskService;
}(EventEmitter));
TaskService.instance = null;
var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(id, x, y, texture, main) {
        var _this = _super.call(this) || this;
        _this._emoji = new engine.Bitmap;
        _this._chara = new engine.Bitmap;
        _this.state = false;
        _this._main = main;
        _this._id = id;
        // this.x=x;
        // this.y=y;
        _this._chara.x = x;
        _this._chara.y = y;
        _this._chara.img.src = texture;
        _this._emoji.x = x;
        _this._emoji.y = y - 40;
        _this._emoji.scaleX = 2;
        _this._emoji.scaleY = 2;
        _this._emoji.addEventListener(engine.TouchType.TOUCH_TAP, _this.onNPCClick);
        _this._chara.addEventListener(engine.TouchType.TOUCH_TAP, _this.onNPCClick);
        // for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
        //     if (this._id == TaskService.getInstance().taskList[i].fromNPCId) {
        //         this._emoji.img.src = RES.getRes("ytanhao_png");
        //     }
        // }
        _this.onChange(TaskService.getInstance().taskList[0]);
        _this._emoji.touchEnabled = true;
        _this._chara.touchEnabled = true;
        _this.addChild(_this._chara);
        _this.addChild(_this._emoji);
        TaskService.addObserver(_this);
        return _this;
    }
    NPC.prototype.onNPCClick = function (e) {
        var startx = Math.floor((GameScene.chara._body.x + 50) / 100);
        var starty = Math.floor(GameScene.chara._body.y / 100);
        var endx = Math.floor(e.offsetX / 100);
        var endy = Math.floor(e.offsetY / 100);
        var path = GameScene.map.astarPath(startx - 1, starty, endx, endy);
        if (path.length != 1) {
            this._main.list.addCommand(new WalkCommand(GameScene.chara, e.offsetX, e.offsetY, path));
        }
        //console.log(endx);
        if (this._id == TaskService.getInstance().taskList[0].fromNPCId && NPC.isStart == false) {
            NPC.isStart = true;
            this._main.list.addCommand(new TalkCommand(this));
        }
        else if (this._id == TaskService.getInstance().taskList[0].toNPCId && NPC.isStart == true) {
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
    };
    NPC.prototype.onChange = function (task) {
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
                }
                else if (task.toNPCId == this._id) {
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
    };
    return NPC;
}(engine.DisplayObjectContainer));
NPC.isStart = false;
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        var _this = _super.call(this) || this;
        _this.textField = new engine.TextField;
        _this.panel = new engine.Shape;
        _this.panel.x = 700;
        _this.panel.y = 0;
        _this.textField.text = "----";
        _this.textField.x = 700;
        _this.panel.graphics.clear();
        _this.panel.graphics.beginFill(0x000000, 0.5);
        _this.panel.graphics.drawRect(0, 0, 250, 300);
        _this.panel.graphics.endFill();
        _this.addChild(_this.panel);
        _this.addChild(_this.textField);
        TaskService.addObserver(_this);
        return _this;
    }
    TaskPanel.prototype.onChange = function (task) {
        for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
            switch (TaskService.getInstance().taskList[i].status) {
                case TaskStatus.DURING:
                    this.textField.text = task.name + "during";
                    break;
                case TaskStatus.SUBMITTED:
                    this.textField.text = task.name + "finished";
                    break;
            }
        }
    };
    return TaskPanel;
}(engine.DisplayObjectContainer));
var SenceService = (function (_super) {
    __extends(SenceService, _super);
    function SenceService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SenceService.prototype.notify = function () {
    };
    return SenceService;
}(EventEmitter));
var Task = (function (_super) {
    __extends(Task, _super);
    function Task(id, name, status, desc, fromNpcId, toNpcId, condition) {
        var _this = _super.call(this) || this;
        _this._current = 0;
        _this._total = 0;
        _this._id = id;
        _this._name = name;
        _this._status = status;
        _this._desc = desc;
        _this.fromNPCId = fromNpcId;
        _this.toNPCId = toNpcId;
        _this._condition = condition;
        return _this;
    }
    Object.defineProperty(Task.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            this._status = status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "desc", {
        get: function () {
            return this._desc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "current", {
        get: function () {
            return this._current;
        },
        enumerable: true,
        configurable: true
    });
    Task.prototype.checkStatus = function () {
        if (this.current > this._total) {
        }
        if (this._status == TaskStatus.DURING && this.current >= this._total) {
            this._status = TaskStatus.CAN_SUMBIT;
        }
    };
    return Task;
}(EventEmitter));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUMBIT"] = 3] = "CAN_SUMBIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    ErrorCode[ErrorCode["FAILED"] = 1] = "FAILED";
})(ErrorCode || (ErrorCode = {}));
var NPCTalkTaskCondition = (function () {
    function NPCTalkTaskCondition() {
    }
    NPCTalkTaskCondition.prototype.onAccept = function (task) {
        task.current++;
        //task.checkStatus();
    };
    NPCTalkTaskCondition.prototype.onSubmit = function (task) {
    };
    NPCTalkTaskCondition.prototype.onChange = function (task) {
    };
    return NPCTalkTaskCondition;
}());
var KillMonsterTaskCondition = (function (_super) {
    __extends(KillMonsterTaskCondition, _super);
    function KillMonsterTaskCondition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KillMonsterTaskCondition.prototype.onAccept = function (task) {
    };
    KillMonsterTaskCondition.prototype.onSubmit = function (task) {
    };
    KillMonsterTaskCondition.prototype.onChange = function (task) {
        task.current++;
    };
    return KillMonsterTaskCondition;
}(SenceService));
var AStar = (function () {
    function AStar() {
        this._openList = []; //Array<TileNode>//
        this._closedList = []; //已考察表
        this._path = [];
        this._heuristic = this.diagonal;
        this._straightCost = 1.0;
        this._diagCost = Math.SQRT2;
    }
    AStar.prototype.findPath = function (grid) {
        this._grid = grid;
        this._openList = new Array();
        this._closedList = new Array();
        this._startNode = this._grid.getStartPoint();
        this._endNode = this._grid.getEndPoint();
        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;
        return this.search();
    };
    AStar.prototype.search = function () {
        var currentNode = this._startNode;
        while (currentNode != this._endNode) {
            var startX = Math.max(0, currentNode.x - 1);
            var endX = Math.min(this._grid._x - 1, currentNode.x + 1);
            var startY = Math.max(0, currentNode.y - 1);
            var endY = Math.min(this._grid._y - 1, currentNode.y + 1);
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test = this._grid._arr[i][j];
                    //console.log(test.walkable);
                    if (test == currentNode || !test.walkable || Math.abs(i - currentNode.x) + Math.abs(j - currentNode.y) == 2) {
                        continue;
                    }
                    var cost = this._straightCost;
                    if (!((currentNode.x == test.x) || (currentNode.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g = currentNode.g + cost;
                    var h = this._heuristic(test);
                    var f = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = currentNode;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = currentNode;
                        this._openList.push(test);
                    }
                }
            }
            this._closedList.push(currentNode); //已考察列表
            if (this._openList.length == 0) {
                return false;
            }
            //this._openList.sortOn("f", Array.NUMERIC); 把f从小到大排序
            // var allf:number[]=new Array();
            // for(var i=0;i<this._openList.length;i++){
            // allf[i]=this._openList[i].f;
            // }
            this._openList.sort(function (a, b) {
                // if (a.f > b.f) {
                // 	return 1;
                // } else if (a.f < b.f) {
                // 	return -1
                // } else {
                // 	return 0;
                // }
                return a.f - b.f;
            });
            currentNode = this._openList.shift();
        }
        this.buildPath();
        return true;
    };
    AStar.prototype.isOpen = function (node) {
        for (var i = 0; i < this._openList.length; i++) {
            if (this._openList[i] == node) {
                return true;
            }
        }
        return false;
        //return this._openList.indexOf(node) > 0 ? true : false;
    };
    AStar.prototype.isClosed = function (node) {
        for (var i = 0; i < this._closedList.length; i++) {
            if (this._closedList[i] == node) {
                return true;
            }
        }
        return false;
        //return this._closedList.indexOf(node) > 0 ? true : false;
    };
    AStar.prototype.buildPath = function () {
        this._path = new Array();
        var node = this._endNode;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node); //开头加入
        }
    };
    AStar.prototype.manhattan = function (node) {
        return Math.abs(this._endNode.x - node.x) * this._straightCost + Math.abs(this._endNode.y - node.y) * this._straightCost;
    };
    AStar.prototype.euclidian = function (node) {
        var dx = this._endNode.x - node.x;
        var dy = this._endNode.y - node.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    };
    AStar.prototype.diagonal = function (node) {
        var dx = Math.abs(this._endNode.x - node.x);
        var dy = Math.abs(this._endNode.y - node.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    };
    AStar.prototype.visited = function () {
        return this._closedList.concat(this._openList);
    };
    AStar.prototype.validNode = function (node, currentNode) {
        if (currentNode == node || !node.walkable)
            return false;
        if (!this._grid._arr[currentNode.x][node.y].walkable)
            return false;
        if (!this._grid._arr[node.x][currentNode.y].walkable)
            return false;
        return true;
    };
    AStar.prototype.getPath = function () {
        return this._path;
    };
    return AStar;
}());
var Character = (function (_super) {
    __extends(Character, _super);
    // timer: engine.Timer;
    function Character(main) {
        var _this = _super.call(this) || this;
        _this._idleState = new CharacterIdleState(_this);
        _this._moveState = new CharacterMoveState(_this);
        _this._main = main;
        _this._body = new engine.Bitmap;
        _this._body.img.src = "asset/chara1.png";
        _this._main.addChild(_this._body);
        _this._body.width = 100;
        _this._body.height = 100;
        _this._body.x = 0;
        _this._body.y = 100;
        _this._stateMachine = new StateMachine();
        _this._ifidle = true;
        _this._ifmove = false;
        return _this;
    }
    Character.prototype.stopMove = function (callback) {
        this.idle(); //not complete
        callback();
    };
    Character.prototype.move = function (targetX, targetY, path, callback) {
        var _this = this;
        console.log("cant move");
        // //中止缓动动画，达到实现运动中更换目标点的目的
        // engine.Tween.removeTweens(this._body);
        // if (this.timer != null) {
        //     this.timer.stop();
        // }
        //触发状态机
        this._stateMachine.setState(this._moveState);
        //如果状态机将_ifwalk变量调整为true,则进入运动状态
        if (this._ifmove) {
            console.log("move");
            this.startMove();
            // //用Timer来实现固定间隔顺序读取路径数组中的点并移动
            // var interval: number = 500;
            // this.timer = new engine.Timer(interval, path.length - 1);
            // this.timer.addEventListener(engine.TimerEvent.TIMER, function (e: engine.TimerEvent): void {
            //     path[-1] = path[0];
            //     if ((path[this.timer.currentCount].x - path[this.timer.currentCount - 1].x) < 0) {
            //         this._body.skewY = 180;
            //     } else {
            //         this._body.skewY = 0;
            //     }
            //     if (path.length != 0) {
            //         engine.Tween.get(this._body).to({ x: (path[this.timer.currentCount].x + 1) * 100 - 50, y: (path[this.timer.currentCount].y) * 100 }, 500);
            //         console.log("target:" + path[this.timer.currentCount - 1].x + " , " + path[this.timer.currentCount - 1].y);
            //     }
            // }, this);
            // this.timer.addEventListener(engine.TimerEvent.TIMER_COMPLETE, function (e: TimeEvent): void {
            //     this.idle();
            //     callback();////////////////////////////
            // }, this);
            // this.timer.start();
            // console.log(path.length);
            if (path.length != 0) {
                var counter = 0;
                var id = setInterval(function () {
                    _this._body.x = (path[counter].x) * 100;
                    _this._body.y = (path[counter].y) * 100;
                    counter++;
                    if (counter == path.length) {
                        clearInterval(id);
                    }
                }, 500);
            }
        }
    };
    Character.prototype.idle = function () {
        this._stateMachine.setState(this._idleState);
        //如果状态机将_ifidle变量调整为true,则进入停止状态
        if (this._ifidle) {
            console.log("idle");
            this.startidle();
        }
    };
    //播放运动动画
    Character.prototype.startMove = function () {
        var _this = this;
        var list = ["asset/chara/chara1.png"];
        var count = -1;
        //this._body.texture = RES.getRes("3_png");
        //循环执行
        engine.Ticker.getInstance().register(function () {
            if (_this._ifmove) {
                count = count + 0.5;
                if (count >= list.length) {
                    count = 0;
                }
                _this._body.img.src = list[Math.floor(count)];
            }
        });
    };
    Character.prototype.startidle = function () {
        this._body.img.src = "asset/chara/chara1.png";
    };
    return Character;
}(engine.DisplayObjectContainer));
var doMap = (function (_super) {
    __extends(doMap, _super);
    function doMap() {
        var _this = _super.call(this) || this;
        _this._cellSize = 20;
        _this.astar = new AStar();
        _this._grid = new Grid(10, 10);
        var container = new engine.DisplayObjectContainer();
        _this.addChild(container);
        for (var i = 0; i < config.length; i++) {
            for (var j = 0; j < config.length; j++) {
                var tile = config[i][j];
                //console.log(tile);
                var bitmap = new engine.Bitmap();
                bitmap.x = j * 100;
                bitmap.y = i * 100;
                _this.addChild(bitmap);
                if (tile == 1) {
                    bitmap.img.src = "asset/grass.jpg";
                }
                if (tile == 0) {
                    bitmap.img.src = "asset/road.jpg";
                }
                _this._grid.setWalkable(i, j, tile);
                container.addChild(bitmap);
            }
        }
        return _this;
    }
    doMap.prototype.astarPath = function (beginX, beginY, endX, endY) {
        var path = new Array();
        this._grid.setStartPoint(beginX, beginY);
        this._grid.setEndPoint(endX, endY);
        if (this.astar.findPath(this._grid)) {
            path = this.astar.getPath();
        }
        return path;
    };
    return doMap;
}(engine.DisplayObjectContainer));
var config = [
    [1, 0, 1, 1, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
];
// var config = [//map
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     ]
// var config = [
//     { x: 0, y: 0, image: "road.jpg" },
//     { x: 0, y: 1, image: "road.jpg" },
//     { x: 0, y: 2, image: "road.jpg" },
//     { x: 1, y: 0, image: "road.jpg" },
//     { x: 1, y: 1, image: "road.jpg" },
//     { x: 1, y: 2, image: "road.jpg" },
//     { x: 2, y: 0, image: "road.jpg" },
//     { x: 2, y: 1, image: "road.jpg" },
//     { x: 2, y: 2, image: "road.jpg" }
// ]
var Grid = (function () {
    function Grid(x, y) {
        this._arr = [];
        this.walkable = true;
        this._x = x;
        this._y = y;
        this._arr = new Array();
        for (var i = 0; i < this._x; i++) {
            this._arr[i] = new Array();
            for (var j = 0; j < this._y; j++) {
                this._arr[i][j] = new TileNode(i, j); //Node(i,j)
            }
        }
    }
    Grid.prototype.setWalkable = function (j, i, state) {
        //console.log(state);
        if (state == 1) {
            this._arr[i][j].walkable = false;
        }
        if (state == 0) {
            this._arr[i][j].walkable = true;
        }
        //console.log(this._arr[i][j].walkable);
    };
    // public setStart(arrStart: TileNode) {
    //     this._start = arrStart;
    // }
    // public setEnd(arrEnd: TileNode) {
    //     this._end = arrEnd;
    // }
    Grid.prototype.setEndPoint = function (x, y) {
        this._end = this._arr[x][y];
    };
    Grid.prototype.setStartPoint = function (x, y) {
        console.log(this._arr[x][y]);
        this._start = this._arr[x][y];
    };
    Grid.prototype.getStartPoint = function () {
        return this._start;
    };
    Grid.prototype.getEndPoint = function () {
        return this._end;
    };
    return Grid;
}());
var TileNode = (function () {
    // bitmap: egret.Bitmap = null;
    function TileNode(x, y) {
        this.walkable = true;
        this.x = x;
        this.y = y;
        if (config[x][y] == 1) {
            this.walkable = false;
        }
        if (config[x][y] == 0) {
            this.walkable = true;
        }
    }
    return TileNode;
}());
//状态机
var StateMachine = (function () {
    function StateMachine() {
    }
    //设置状态
    StateMachine.prototype.setState = function (e) {
        if (this.currentState != null) {
            this.currentState.onExit();
        }
        this.currentState = e;
        e.onEnter();
    };
    return StateMachine;
}());
var CharacterState = (function (_super) {
    __extends(CharacterState, _super);
    function CharacterState(character) {
        var _this = _super.call(this) || this;
        _this._character = character;
        return _this;
    }
    CharacterState.prototype.onEnter = function () { };
    CharacterState.prototype.onExit = function () { };
    return CharacterState;
}(StateMachine));
var CharacterIdleState = (function (_super) {
    __extends(CharacterIdleState, _super);
    function CharacterIdleState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //进入时设置Character类的变量
    CharacterIdleState.prototype.onEnter = function () {
        this._character._ifidle = true;
    };
    //离开时同理
    CharacterIdleState.prototype.onExit = function () {
        this._character._ifidle = false;
    };
    return CharacterIdleState;
}(CharacterState));
var CharacterMoveState = (function (_super) {
    __extends(CharacterMoveState, _super);
    function CharacterMoveState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CharacterMoveState.prototype.onEnter = function () {
        this._character._ifmove = true;
    };
    CharacterMoveState.prototype.onExit = function () {
        this._character._ifmove = false;
    };
    return CharacterMoveState;
}(CharacterState));
var Cache = function (target, propertyName, desc) {
    var getter = desc.get;
    console.log(getter);
    desc.get = function () {
        return getter.apply(this);
    };
    return desc;
};
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        var _this = _super.call(this) || this;
        _this.McCree = new Hero("McCree", true);
        _this.Soilder76 = new Hero("Soilder76", true);
        _this.Tracer = new Hero("Tracer", true);
        _this.sword = new Equipments("sword", 50);
        _this.armor = new Equipments("armor", 10);
        _this.gun = new Equipments("gun", 70);
        _this.dog = new Pet("baiyukun");
        _this.blueJewel = new Jewel("blueJewel");
        _this.level = new engine.TextField;
        _this.hp = new engine.TextField;
        _this.fightPower = new engine.TextField;
        _this.heroInTeam = new engine.TextField;
        _this.equipments = new engine.TextField;
        _this.jewel = new engine.TextField;
        _this.pet = new engine.TextField;
        _this.bag1 = new engine.TextField;
        _this.bag2 = new engine.TextField;
        _this.bag3 = new engine.TextField;
        _this.propertyPanel = new engine.Shape;
        _this.bagPanel = new engine.Shape;
        _this.propertyPanel.x = 0;
        _this.propertyPanel.y = 0;
        _this.propertyPanel.graphics.beginFill(0x000000, 0.5);
        _this.propertyPanel.graphics.drawRect(0, 0, 400, 600);
        _this.propertyPanel.graphics.endFill();
        _this.addChild(_this.propertyPanel);
        _this.bagPanel.x = 100;
        _this.bagPanel.y = 700;
        _this.bagPanel.graphics.beginFill(0x000000, 0.5);
        _this.bagPanel.graphics.drawRect(0, 0, 600, 100);
        _this.bagPanel.graphics.endFill();
        _this.addChild(_this.bagPanel);
        //初始化用户状态
        User.user.heroes.push(_this.McCree, _this.Tracer);
        _this.McCree.equipments.push(_this.sword);
        _this.Soilder76.equipments.push(_this.gun);
        _this.sword.jewel.push(_this.blueJewel);
        User.user.pet = _this.dog;
        _this.bag1.text = "Soilder76";
        _this.bag1.textColor = "0xffffff";
        _this.bag1.x = _this.bagPanel.x + 10;
        _this.bag1.y = _this.bagPanel.y + 35;
        //mouse.enable(this.stage);
        //this.bag1.addEventListener(onmouseover)
        _this.bag1.addEventListener(engine.TouchType.TOUCH_TAP, function (e) {
            console.log(e.srcElement.textContent);
            if (e.srcElement.textContent == "Soilder76") {
                User.user.heroes.push(_this.Soilder76);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "armor") {
                _this.McCree.equipments.push(_this.armor);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "McCree") {
                User.user.heroes.push(_this.McCree);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "Tracer") {
                User.user.heroes.push(_this.Tracer);
                e.srcElement.textContent = null;
            }
            _this.init();
        });
        _this.bag1.touchEnabled = true;
        _this.addChild(_this.bag1);
        _this.bag2.text = "armor";
        _this.bag2.textColor = "0xffffff";
        _this.bag2.x = _this.bagPanel.x + 210;
        _this.bag2.y = _this.bagPanel.y + 35;
        _this.bag3.addEventListener(engine.TouchType.TOUCH_TAP, function (e) {
            console.log(e.srcElement.textContent);
            if (e.srcElement.textContent == "Soilder76") {
                User.user.heroes.push(_this.Soilder76);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "armor") {
                _this.McCree.equipments.push(_this.armor);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "McCree") {
                User.user.heroes.push(_this.McCree);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "Tracer") {
                User.user.heroes.push(_this.Tracer);
                e.srcElement.textContent = null;
            }
            _this.init();
        });
        _this.bag2.touchEnabled = true;
        _this.addChild(_this.bag2);
        _this.bag3.text = "";
        _this.bag3.textColor = "0xffffff";
        _this.bag3.x = _this.bagPanel.x + 410;
        _this.bag3.y = _this.bagPanel.y + 35;
        _this.bag3.addEventListener(engine.TouchType.TOUCH_TAP, function (e) {
            console.log(e.srcElement.textContent);
            if (e.srcElement.textContent == "Soilder76") {
                User.user.heroes.push(_this.Soilder76);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "armor") {
                _this.McCree.equipments.push(_this.armor);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "McCree") {
                User.user.heroes.push(_this.McCree);
                e.srcElement.textContent = null;
            }
            else if (e.srcElement.textContent == "Tracer") {
                User.user.heroes.push(_this.Tracer);
                e.srcElement.textContent = null;
            }
            _this.init();
        });
        _this.bag3.touchEnabled = true;
        _this.addChild(_this.bag3);
        _this.init();
        _this.heroInTeam.addEventListener(engine.TouchType.TOUCH_TAP, _this.onHeroesClick);
        _this.heroInTeam.touchEnabled = true;
        return _this;
    }
    Panel.prototype.init = function () {
        var _this = this;
        this.level.text = "等级：" + User.user.level;
        this.addChild(this.level);
        this.fightPower.text = "目前战斗力：" + User.user.getFightPower();
        this.fightPower.y = 30;
        this.addChild(this.fightPower);
        this.heroInTeam.text = "在阵英雄：";
        User.user.heroesInTeam.forEach(function (e) {
            //console.log(e.heroName);
            _this.heroInTeam.text += e.heroName;
        });
        this.heroInTeam.y = 60;
        this.addChild(this.heroInTeam);
        this.equipments.text = "装备：";
        User.user.heroesInTeam.forEach(function (e) {
            e.equipments.forEach(function (elements) {
                _this.equipments.text += elements.equipName;
            });
        });
        this.equipments.y = 90;
        this.addChild(this.equipments);
        this.pet.y = 120;
        this.pet.text = "宠物：" + User.user.pet.petName;
        this.addChild(this.pet);
    };
    // onBagClick(e: MouseEvent, panel) {
    //     console.log(e.srcElement.textContent);
    //     if (e.srcElement.textContent == "Soilder76") {
    //         User.user.heroes.push(this.Soilder76);
    //         e.srcElement.textContent = null;
    //     } else if (e.srcElement.textContent == "armor") {
    //         this.McCree.equipments.push(this.armor);
    //         e.srcElement.textContent = null;
    //     } else if (e.srcElement.textContent == "McCree") {
    //         User.user.heroes.push(this.McCree);
    //         e.srcElement.textContent = null;
    //     } else if (e.srcElement.textContent == "Tracer") {
    //         User.user.heroes.push(this.Tracer);
    //         e.srcElement.textContent = null;
    //     }
    //     this.init();
    // }
    Panel.prototype.onHeroesClick = function (e) {
        if (this.bag1.text == "") {
            this.bag1.text = User.user.heroes.pop().heroName;
        }
        else if (this.bag2.text == "") {
            this.bag2.text = User.user.heroes.pop().heroName;
        }
        else if (this.bag3.text == "") {
            this.bag3.text = User.user.heroes.pop().heroName;
        }
        else {
            console.warn("full bag");
        }
        this.init();
    };
    Panel.prototype.change = function (changeSth) {
    };
    return Panel;
}(engine.DisplayObjectContainer));
var User = (function () {
    function User() {
        this.cash = 0;
        this.gold = 0;
        this.exp = 0;
        this.level = 0;
        this.totalExp = 0;
        this.heroes = [];
        this.level = 1;
    }
    Object.defineProperty(User.prototype, "heroesInTeam", {
        get: function () {
            return this.heroes.filter(function (hero) { return hero.isInTeam; });
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.getFightPower = function () {
        var result = 0;
        this.heroesInTeam.forEach(function (hero) { return result += hero.getFightPower(); });
        result += this.pet.getFightPower();
        return result + this.level * 3;
        //arr.every     arr.some     arr.map     arr.foreach    arr.filter
        //大数据 map reduce
    };
    return User;
}());
User.user = new User();
var Hero = (function () {
    function Hero(heroName, isInTeam) {
        this.isInTeam = false;
        this.equipments = [];
        //maxHp=100;//
        this.hp = 50;
        this.level = 1;
        this.quality = 2.8;
        this.heroName = heroName;
        this.isInTeam = isInTeam;
    }
    Object.defineProperty(Hero.prototype, "maxHp", {
        get: function () {
            return this.level * 100 * this.quality;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "attack", {
        //attack:number=100;//游戏树枝都是高级数值 大多数    高级数值 基础数值
        get: function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.attack; });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "fightPower", {
        get: function () {
            return this.getFightPower();
        },
        enumerable: true,
        configurable: true
    });
    Hero.prototype.getFightPower = function () {
        return this.maxHp * 1.5 + this.attack * 1.8; //取整 前后端统一
    };
    return Hero;
}());
__decorate([
    Cache
], Hero.prototype, "maxHp", null);
var Equipments = (function () {
    function Equipments(name, atk) {
        this.jewel = [];
        this.atk = 0;
        this.equipName = name;
        this.atk = atk;
    }
    Object.defineProperty(Equipments.prototype, "attack", {
        get: function () {
            var jewelResult = 0;
            for (var i = 0; i < this.jewel.length; i++) {
                jewelResult += this.jewel[i].attack;
            }
            return this.atk + jewelResult;
        },
        enumerable: true,
        configurable: true
    });
    return Equipments;
}());
var Jewel = (function () {
    function Jewel(name) {
        this.jewelName = name;
    }
    Object.defineProperty(Jewel.prototype, "attack", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });
    return Jewel;
}());
var Pet = (function () {
    function Pet(name) {
        this.petName = name;
    }
    Pet.prototype.getFightPower = function () {
        // if(name==this.petName[0]){
        //     return 10;
        // }
        // if(name==this.petName[1]){
        //     return 15;
        // }
        return 20;
    };
    return Pet;
}());
//# sourceMappingURL=test.js.map