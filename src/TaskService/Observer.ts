interface Observer{

    onChange(task:Task);
    
}

class TaskPanel extends engine.DisplayObjectContainer implements Observer {
    public textField = new engine.TextField;
    private panel: engine.Shape = new engine.Shape;

    constructor() {
        super();
        this.panel.x = 700;
        this.panel.y = 0;
        this.textField.text = "----";
        this.textField.x=700;
        this.panel.graphics.clear();
        
        this.panel.graphics.beginFill(0x000000, 0.5);
        this.panel.graphics.drawRect(0, 0, 250, 300);
        this.panel.graphics.endFill();
        this.addChild(this.panel);
        this.addChild(this.textField);
        TaskService.addObserver(this);
    }

    public onChange(task: Task) {
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
    }
}