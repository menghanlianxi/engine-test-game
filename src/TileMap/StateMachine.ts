//状态机
class StateMachine {
    currentState: state;

    //设置状态
    setState(e: state) {
        if (this.currentState != null) {
            this.currentState.onExit();
        }
        this.currentState = e;
        e.onEnter();
    }
}

interface state {
    onEnter(): void;
    onExit(): void;
}

class CharacterState extends StateMachine {

    //为了下面设置Character类的变量
    _character: Character;

    constructor(character: Character) {
        super();
        this._character = character;
    }

    onEnter() { }
    onExit() { }

}

class CharacterIdleState extends CharacterState {

    //进入时设置Character类的变量
    onEnter() {
        this._character._ifidle = true;
    }

    //离开时同理
    onExit() {
        this._character._ifidle = false;
    }

}

class CharacterMoveState extends CharacterState {

    onEnter() {
        this._character._ifmove = true;
    }

    onExit() {
        this._character._ifmove = false;
    }

}