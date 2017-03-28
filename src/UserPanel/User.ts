class User {
    public static user=new User();
    cash = 0;
    gold = 0;
    exp = 0;
    level = 0;
    totalExp = 0;

    heroes: Hero[] = [];
    //__heroesInTeam: Hero[] = [];//jichu 

    pet: Pet;

    constructor() {
        this.level=1;
    }

    get heroesInTeam() {//高阶 数据单向流动
        return this.heroes.filter(hero => hero.isInTeam);
    }

    getFightPower() {

        var result = 0;
        this.heroesInTeam.forEach(hero => result += hero.getFightPower());
        result += this.pet.getFightPower();

        return result+this.level*3;

        //arr.every     arr.some     arr.map     arr.foreach    arr.filter
        //大数据 map reduce
    }
    
}

class Hero {
    heroName: string;
    isInTeam: boolean = false;
    equipments: Equipments[] = [];
    //maxHp=100;//
    hp = 50;
    level = 1;

    quality: number = 2.8;

    constructor(heroName: string, isInTeam: boolean) {
        this.heroName = heroName;
        this.isInTeam = isInTeam;
    }

    @Cache
    public get maxHp() {
        return this.level * 100 * this.quality;
    }

    //attack:number=100;//游戏树枝都是高级数值 大多数    高级数值 基础数值
    get attack() {
        var result = 0;
        this.equipments.forEach(e => result += e.attack);
        return result;
    }

    get fightPower() {
        return this.getFightPower();
    }

    getFightPower() {
        return this.maxHp * 1.5 + this.attack * 1.8;//取整 前后端统一
    }
    
}

class Equipments {
    equipName:string;
    jewel: Jewel[] = [];
    atk=0;

    constructor(name:string,atk){
        this.equipName=name;
        this.atk=atk;
    }

    get attack() {
        var jewelResult: number = 0;
        for (var i = 0; i < this.jewel.length; i++) {
            jewelResult += this.jewel[i].attack;
        }

        return this.atk + jewelResult;
    }

}

class Jewel {
    jewelName: string;
    constructor(name){
        this.jewelName=name;
    }
    get attack() {
        return 10;
    }

}

class Pet {
    petName: string;
    constructor(name){
        this.petName=name;
    }
    getFightPower() {
        // if(name==this.petName[0]){
        //     return 10;
        // }
        // if(name==this.petName[1]){
        //     return 15;
        // }
        return 20;
    }
}