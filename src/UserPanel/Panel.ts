class Panel extends engine.DisplayObjectContainer {
    McCree = new Hero("McCree", true);
    Soilder76 = new Hero("Soilder76", true);
    Tracer = new Hero("Tracer", true);
    sword = new Equipments("sword", 50);
    armor = new Equipments("armor", 10);
    gun = new Equipments("gun", 70);
    dog = new Pet("baiyukun");
    blueJewel = new Jewel("blueJewel");

    level = new engine.TextField;
    hp = new engine.TextField;
    fightPower = new engine.TextField;
    heroInTeam = new engine.TextField;
    equipments = new engine.TextField;
    jewel = new engine.TextField;
    pet = new engine.TextField;

    bag1 = new engine.TextField;
    bag2 = new engine.TextField;
    bag3 = new engine.TextField;


    private propertyPanel: engine.Shape = new engine.Shape;
    private bagPanel: engine.Shape = new engine.Shape;
    constructor() {
        super();
        this.propertyPanel.x = 0;
        this.propertyPanel.y = 0;
        this.propertyPanel.graphics.beginFill(0x000000, 0.5);
        this.propertyPanel.graphics.drawRect(0, 0, 400, 600);
        this.propertyPanel.graphics.endFill();
        this.addChild(this.propertyPanel);

        this.bagPanel.x = 100;
        this.bagPanel.y = 700;
        this.bagPanel.graphics.beginFill(0x000000, 0.5);
        this.bagPanel.graphics.drawRect(0, 0, 600, 100);
        this.bagPanel.graphics.endFill();
        this.addChild(this.bagPanel);
        //初始化用户状态
        User.user.heroes.push(this.McCree, this.Tracer);
        this.McCree.equipments.push(this.sword);
        this.Soilder76.equipments.push(this.gun);
        this.sword.jewel.push(this.blueJewel);
        User.user.pet = this.dog;

        this.bag1.text = "Soilder76";
        this.bag1.textColor = "0xffffff";
        this.bag1.x = this.bagPanel.x + 10;
        this.bag1.y = this.bagPanel.y + 35;
        //mouse.enable(this.stage);
        //this.bag1.addEventListener(onmouseover)
        this.bag1.addEventListener(engine.TouchType.TOUCH_TAP, (e) => {//好蠢 怎么改。。。。。。。。。。。。。。。。。。。。
            console.log(e.srcElement.textContent);
            if (e.srcElement.textContent == "Soilder76") {
                User.user.heroes.push(this.Soilder76);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "armor") {
                this.McCree.equipments.push(this.armor);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "McCree") {
                User.user.heroes.push(this.McCree);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "Tracer") {
                User.user.heroes.push(this.Tracer);
                e.srcElement.textContent = null;
            }

            this.init();
        });
        this.bag1.touchEnabled = true;
        this.addChild(this.bag1);

        this.bag2.text = "armor";
        this.bag2.textColor = "0xffffff";
        this.bag2.x = this.bagPanel.x + 210;
        this.bag2.y = this.bagPanel.y + 35;
        this.bag3.addEventListener(engine.TouchType.TOUCH_TAP, (e) => {
            console.log(e.srcElement.textContent);
            if (e.srcElement.textContent == "Soilder76") {
                User.user.heroes.push(this.Soilder76);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "armor") {
                this.McCree.equipments.push(this.armor);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "McCree") {
                User.user.heroes.push(this.McCree);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "Tracer") {
                User.user.heroes.push(this.Tracer);
                e.srcElement.textContent = null;
            }

            this.init();
        });
        this.bag2.touchEnabled = true;
        this.addChild(this.bag2);

        this.bag3.text = "";
        this.bag3.textColor = "0xffffff";
        this.bag3.x = this.bagPanel.x + 410;
        this.bag3.y = this.bagPanel.y + 35;
        this.bag3.addEventListener(engine.TouchType.TOUCH_TAP, (e) => {
            console.log(e.srcElement.textContent);
            if (e.srcElement.textContent == "Soilder76") {
                User.user.heroes.push(this.Soilder76);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "armor") {
                this.McCree.equipments.push(this.armor);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "McCree") {
                User.user.heroes.push(this.McCree);
                e.srcElement.textContent = null;
            } else if (e.srcElement.textContent == "Tracer") {
                User.user.heroes.push(this.Tracer);
                e.srcElement.textContent = null;
            }

            this.init();
        });
        this.bag3.touchEnabled = true;
        this.addChild(this.bag3);

        this.init();

        this.heroInTeam.addEventListener(engine.TouchType.TOUCH_TAP, this.onHeroesClick);
        this.heroInTeam.touchEnabled = true;

    }

    init() {

        this.level.text = "等级：" + User.user.level;
        this.addChild(this.level);
        this.fightPower.text = "目前战斗力：" + User.user.getFightPower();
        this.fightPower.y = 30;
        this.addChild(this.fightPower);

        this.heroInTeam.text = "在阵英雄：";
        User.user.heroesInTeam.forEach((e) => {
            //console.log(e.heroName);
            this.heroInTeam.text += e.heroName;
        });
        this.heroInTeam.y = 60;
        this.addChild(this.heroInTeam);

        this.equipments.text = "装备：";
        User.user.heroesInTeam.forEach((e) => {
            e.equipments.forEach((elements) => {
                this.equipments.text += elements.equipName;
            });
        });
        this.equipments.y = 90;
        this.addChild(this.equipments);

        this.pet.y = 120;
        this.pet.text = "宠物：" + User.user.pet.petName;
        this.addChild(this.pet);
    }

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

    onHeroesClick(e: MouseEvent) {
        if (this.bag1.text == "") {
            this.bag1.text = User.user.heroes.pop().heroName;
        } else if (this.bag2.text == "") {
            this.bag2.text = User.user.heroes.pop().heroName;
        } else if (this.bag3.text == "") {
            this.bag3.text = User.user.heroes.pop().heroName;
        } else {
            console.warn("full bag");
        }
        this.init();
    }


    change(changeSth: any) {

    }
}