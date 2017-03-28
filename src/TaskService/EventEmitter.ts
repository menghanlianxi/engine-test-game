class EventEmitter extends engine.DisplayObjectContainer{

    addObserver(observer: Observer){

    }
    notify(task: Task){

    }
}

class TaskService extends EventEmitter implements Observer{
    private observerList=new Array<Observer>();
    public  taskList=new Array<Task>();
    private static instance: TaskService = null;
    
    constructor() {
        super();
    }
    //danli
    public static getInstance(){
        if( this.instance == null ) {
            this.instance = new TaskService();
        }
        
        return this.instance;
    }
    onChange(task:Task){
        
    }
    
     accept(id: string) {
        if (!id) {
            return ErrorCode.FAILED;
        }
        let task= TaskService.getInstance().taskList[id];
        
        if (task.id == id) {
            task.status = TaskStatus.DURING;
            TaskService.notify(task);
            
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.FAILED;
        }

    }

     finish(id: string) {
        if (!id) {
            return ErrorCode.FAILED;
        }
        let task = TaskService.getInstance().taskList[id];
        if (task.id == id) {
            task.status = TaskStatus.SUBMITTED;
            TaskService.notify(task);
          
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.FAILED;
        }
        
    }
    public getTaskByCustomRole(rule: Function): Task {
        return rule();
    }
    private static notify(task:Task): void {
        for (var observer of TaskService.getInstance().observerList) {
            observer.onChange(task);
        }
        //console.log(TaskService.getInstance().taskList[0].status);
    }

    public static addObserver(observer: Observer) {
        for (var i = 0; i < TaskService.getInstance().observerList.length; i++) {
            if (observer == TaskService.getInstance().observerList[i])
                return ErrorCode.FAILED;
        }
        TaskService.getInstance().observerList.push(observer);
    }
}