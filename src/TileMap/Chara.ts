class Character extends engine.DisplayObjectContainer {

    _main: Main;
    _stateMachine: StateMachine;
    _body: engine.Bitmap;
    _ifidle: boolean;
    _ifmove: boolean;
    _idleState: CharacterIdleState = new CharacterIdleState(this);
    _moveState: CharacterMoveState = new CharacterMoveState(this);

    // timer: engine.Timer;

    constructor(main: Main) {
        super();
        this._main = main;
        this._body = new engine.Bitmap;
        this._body.img.src = "asset/chara1.png";
        this._main.addChild(this._body);
        this._body.width = 100;
        this._body.height = 100;
        this._body.x = 0;
        this._body.y = 100;
        this._stateMachine = new StateMachine();
        this._ifidle = true;
        this._ifmove = false;
    }
    public stopMove(callback: Function) {
        this.idle();//not complete
        callback();
    }

    public move(targetX: number, targetY: number, path: TileNode[], callback: Function) {
        console.log("cant move")

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
                var id = setInterval(() => {
                    this._body.x = (path[counter].x) * 100;
                    this._body.y = (path[counter].y) * 100;
                    counter++;
                    if (counter == path.length) {
                    clearInterval(id);
                }
                }, 500);
            }
        }
    }


    public idle() {

        this._stateMachine.setState(this._idleState);

        //如果状态机将_ifidle变量调整为true,则进入停止状态
        if (this._ifidle) {
            console.log("idle");
            this.startidle();
        }
    }

    //播放运动动画
    public startMove() {
        var list = ["asset/chara/chara1.png"];
        var count = -1;
        //this._body.texture = RES.getRes("3_png");
        //循环执行
        engine.Ticker.getInstance().register(() => {

            if (this._ifmove) {
                count = count + 0.5;
                if (count >= list.length) {
                    count = 0;
                }
                this._body.img.src = list[Math.floor(count)];
            }
        });
    }

    public startidle() {
        this._body.img.src = "asset/chara/chara1.png";
    }
}