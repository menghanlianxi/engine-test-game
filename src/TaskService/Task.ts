class Task extends EventEmitter implements TaskConditionContext{
    private _id:string;
    private _name:string;
    private _status:TaskStatus;
    public _desc:string;
    public fromNPCId:string;
    public toNPCId:string;

    public _current:number=0;
    public _total:number=0;

    public _condition:TaskCondition;

    constructor(id: string, name: string, status: TaskStatus, desc: string, fromNpcId: string, toNpcId: string,condition:TaskCondition) {
        super();
        this._id = id;
        this._name = name;
        this._status = status;
        this._desc = desc;
        this.fromNPCId = fromNpcId;
        this.toNPCId = toNpcId;
        this._condition=condition;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get status(): TaskStatus {
        return this._status;
    }

    public set status(status: TaskStatus) {
        this._status = status;
    }

    public get desc(): string {
        return this._desc;
    }


    public get current():number{
        return this._current;
    }

    private checkStatus(){
        if(this.current>this._total){
            //Error
        }
        if(this._status==TaskStatus.DURING&&this.current>=this._total){
            this._status=TaskStatus.CAN_SUMBIT;
        }
    }
}


enum TaskStatus {
    UNACCEPTABLE,
    ACCEPTABLE,
    DURING,
    CAN_SUMBIT,
    SUBMITTED
}
enum ErrorCode{
    SUCCESS,
    FAILED
}