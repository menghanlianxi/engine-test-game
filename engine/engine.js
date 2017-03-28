var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engine;
(function (engine) {
    var Rectangle = (function () {
        function Rectangle() {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
        }
        Rectangle.prototype.isPointInRectangle = function (point) {
            var rect = this;
            if (point.x < rect.width + rect.x &&
                point.y < rect.height + rect.y &&
                point.x > rect.x &&
                point.y > rect.y) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    engine.Rectangle = Rectangle;
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    engine.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    engine.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    engine.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    engine.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    engine.Matrix = Matrix;
})(engine || (engine = {}));
// //配置不用数组
// let movieClipData={
//     name:"hero",
//     frame:{
//         "1":{"image":"1.jpg"}
//     }
// }
var engine;
(function (engine) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
        }
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        Ticker.prototype.register = function (listener) {
            this.listeners.push(listener);
        };
        Ticker.prototype.unregister = function (listener) {
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    engine.Ticker = Ticker;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var TouchType;
    (function (TouchType) {
        TouchType[TouchType["TOUCH_TAP"] = 0] = "TOUCH_TAP";
        TouchType[TouchType["TOUCH_MOVE"] = 1] = "TOUCH_MOVE";
        TouchType[TouchType["TOUCH_DRAG"] = 2] = "TOUCH_DRAG";
    })(TouchType = engine.TouchType || (engine.TouchType = {}));
    var DisplayObject = (function () {
        function DisplayObject(type) {
            this.type = "DisplayObject";
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.width = 100; //怎么设置成图片默认尺寸???
            this.height = 100;
            this.localAlpha = 1;
            this.globalAlpha = 1;
            this.touchEnabled = false;
            this.touchType = [];
            this.function = [];
            this.useCapture = [];
            this.isMouseDown = false;
            this.type = type;
            this.localMat = new engine.Matrix();
            this.globalMat = new engine.Matrix();
        }
        DisplayObject.prototype.update = function () {
            this.localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMat = engine.matrixAppendMatrix(this.localMat, this.parent.globalMat);
            }
            else {
                this.globalMat = this.localMat;
            }
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
            }
            else {
                this.globalAlpha = this.localAlpha;
            }
        };
        DisplayObject.prototype.addEventListener = function (_type, listener, _useCapture) {
            this.touchType.push(_type);
            this.function.push(listener);
            this.useCapture.push(_useCapture);
        };
        DisplayObject.prototype.dispatchEvent = function (e) {
            //console.log(e.type);
            if (e.type == "mousedown") {
                this.isMouseDown = true;
            }
            else if (e.type == "mouseup" && this.isMouseDown == true) {
                for (var i = 0; i < this.type.length; i++) {
                    if (this.touchType[i] == TouchType.TOUCH_TAP) {
                        this.function[i](e);
                    }
                }
                this.isMouseDown = false;
            }
            else if (e.type == "mousemove") {
                for (var i = 0; i < this.type.length; i++) {
                    if (this.touchType[i] == TouchType.TOUCH_MOVE) {
                        this.function[i](e);
                    }
                }
            }
        };
        return DisplayObject;
    }());
    engine.DisplayObject = DisplayObject;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this, "DisplayObjectContainer") || this;
            _this.children = [];
            return _this;
        }
        //render
        // render(context: CanvasRenderingContext2D) {
        //     for (let drawable of this.array) {
        //         drawable.draw(context);
        //     }
        // }
        DisplayObjectContainer.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var drawable = _a[_i];
                drawable.update();
            }
        };
        DisplayObjectContainer.prototype.addChild = function (obj) {
            obj.parent = this;
            this.children.push(obj);
        };
        DisplayObjectContainer.prototype.removeChild = function (obj) {
            obj.parent = null;
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i] == obj) {
                    this.children[i] = null;
                }
            }
        };
        DisplayObjectContainer.prototype.hitTest = function (x, y) {
            if (this.useCapture[0] == true) {
                return this;
            }
            for (var i = this.children.length - 1; i >= 0; i--) {
                var child = this.children[i];
                var point = new engine.Point(x, y);
                var invertChildGlobalMatrix = engine.invertMatrix(child.globalMat);
                var pointBaseOnChild = engine.pointAppendMatrix(point, invertChildGlobalMatrix); //stage不能动 其他container可以
                if (child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y)) {
                    return child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                }
            }
            if (this.touchEnabled) {
                return this; //所有child都没有点到就返回container
            }
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    engine.DisplayObjectContainer = DisplayObjectContainer;
    var fonts = {
        "name": "Arial",
        "font": {
            "A": [0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
            "B": []
        }
    };
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this, "TextField") || this;
            _this.text = "";
            _this._measureTextWidth = 0;
            return _this;
        }
        // render(context: CanvasRenderingContext2D) {
        //     context.fillStyle = this.textColor;
        //     context.fillText(this.text, 0, 0);
        //     context.fillStyle = null;//unsure
        //     this._measureTextWidth = context.measureText(this.text).width;
        // }
        TextField.prototype.hitTest = function (x, y) {
            var rect = new engine.Rectangle();
            rect.y = -10;
            rect.width = 7 * this.text.length;
            rect.height = 10;
            if (rect.isPointInRectangle(new engine.Point(x, y)) && this.touchEnabled) {
                return this;
            }
            else {
                return null;
            }
        };
        return TextField;
    }(DisplayObject));
    engine.TextField = TextField;
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            var _this = _super.call(this) || this;
            _this.graphics = new Graphics("Graphics");
            return _this;
        }
        return Shape;
    }(DisplayObjectContainer));
    engine.Shape = Shape;
    var Graphics = (function (_super) {
        __extends(Graphics, _super);
        function Graphics() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fillColor = "#000000";
            _this.alpha = 1;
            _this.globalAlpha = 1;
            _this.strokeColor = "#000000";
            _this.lineWidth = 1;
            _this.lineColor = "#000000";
            _this.x = 0;
            _this.y = 0;
            _this.width = 100;
            _this.height = 100;
            return _this;
        }
        // render(context2D: CanvasRenderingContext2D) {
        //     this.context = context2D;
        //     context2D.globalAlpha = this.alpha;
        //     context2D.fillStyle = this.fillColor;
        //     context2D.fillRect(this.x, this.y, this.width, this.height);
        //     context2D.fill();
        // }
        Graphics.prototype.hitTest = function (x, y) {
            var rect = new engine.Rectangle();
            rect.width = this.width;
            rect.height = this.height;
            var result = rect.isPointInRectangle(new engine.Point(x, y));
            //console.log("bitmap", rect.height, rect.width, x, y);
            if (result) {
                return this;
            }
            else {
                return null;
            }
        };
        Graphics.prototype.beginFill = function (color, alpha) {
            this.fillColor = color;
            this.alpha = alpha;
        };
        Graphics.prototype.endFill = function () {
            this.fillColor = "#000000";
            this.alpha = 1;
        };
        Graphics.prototype.drawRect = function (x1, y1, x2, y2) {
            this.x = x1;
            this.y = y1;
            this.width = x2;
            this.height = y2;
        };
        Graphics.prototype.clear = function () {
            // this.context.clearRect(this.x, this.y, this.width, this.height);
            console.log("clear");
        };
        return Graphics;
    }(DisplayObject));
    engine.Graphics = Graphics;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            var _this = _super.call(this, "Bitmap") || this;
            _this.img = new Image();
            return _this;
        }
        // render(context: CanvasRenderingContext2D) {
        //     context.drawImage(this.img, 0, 0, this.width, this.height);
        // }
        Bitmap.prototype.hitTest = function (x, y) {
            var rect = new engine.Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.width; //老师用的this.img.width为什么要用图片原尺寸？？？
            rect.height = this.height;
            if (rect.isPointInRectangle(new engine.Point(x, y)) && this.touchEnabled) {
                return this;
            }
            else {
                return null;
            }
        };
        return Bitmap;
    }(DisplayObject));
    engine.Bitmap = Bitmap;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data) {
            var _this = _super.call(this) || this;
            _this.advancedTime = 0;
            _this.ticker = function (deltaTime) {
                // this.removeChild();
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                    _this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
                }
                _this.currentFrameIndex = Math.floor(_this.advancedTime / MovieClip.FRAME_TIME);
                var data = _this.data;
                var frameData = data.frames[_this.currentFrameIndex];
                var url = frameData.image;
            };
            _this.setMovieClipData(data);
            _this.play();
            return _this;
        }
        MovieClip.prototype.play = function () {
            engine.Ticker.getInstance().register(this.ticker);
        };
        MovieClip.prototype.stop = function () {
            engine.Ticker.getInstance().unregister(this.ticker);
        };
        MovieClip.prototype.setMovieClipData = function (data) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 
        };
        return MovieClip;
    }(Bitmap));
    MovieClip.FRAME_TIME = 20;
    MovieClip.TOTAL_FRAME = 10;
    engine.MovieClip = MovieClip;
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.run = function (canvas) {
        var stage = new engine.DisplayObjectContainer();
        var context2D = canvas.getContext("2d");
        var lastNow = Date.now();
        var renderer = new CanvasRenderer(stage, context2D);
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update();
            renderer.render();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        //鼠标点击
        window.onmousedown = function (e) {
            var x = e.offsetX;
            var y = e.offsetY;
            var type = "mousedown"; //mousemove
            var target = stage.hitTest(x, y);
            var result = target;
            console.log(result);
            if (result) {
                result.dispatchEvent(e);
                while (result.parent) {
                    var currentTarget = result.parent;
                    var e_1 = { type: type, target: target, currentTarget: currentTarget };
                    result = result.parent;
                    result.dispatchEvent(e_1);
                }
            }
        };
        window.onmousemove = function (e) {
            var x = e.offsetX;
            var y = e.offsetY;
            var type = "mousemove";
            var target = stage.hitTest(x, y);
            var result = target;
            //console.log(result)
            if (result) {
                result.dispatchEvent(e);
                while (result.parent) {
                    var currentTarget = result.parent;
                    var e_2 = { type: type, target: target, currentTarget: currentTarget };
                    result = result.parent;
                    result.dispatchEvent(e_2);
                }
            }
        };
        window.onmouseup = function (e) {
            var x = e.offsetX;
            var y = e.offsetY;
            var type = "mouseup";
            var target = stage.hitTest(x, y);
            var result = target;
            //console.log(result)
            if (result) {
                result.dispatchEvent(e);
                while (result.parent) {
                    var currentTarget = result.parent;
                    var e_3 = { type: type, target: target, currentTarget: currentTarget };
                    result = result.parent;
                    result.dispatchEvent(e_3);
                }
            }
        };
        return stage;
    };
    var CanvasRenderer = (function () {
        function CanvasRenderer(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        CanvasRenderer.prototype.render = function () {
            var stage = this.stage;
            var context2D = this.context2D;
            this.renderContainer(stage);
        };
        CanvasRenderer.prototype.renderContainer = function (container) {
            for (var _i = 0, _a = container.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                var m = child.globalMat;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (child.type == "Bitmap") {
                    this.renderBitmap(child);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child);
                }
            }
        };
        CanvasRenderer.prototype.renderBitmap = function (bitmap) {
            this.context2D.drawImage(bitmap.img, 0, 0, bitmap.width, bitmap.height);
        };
        CanvasRenderer.prototype.renderTextField = function (textField) {
            this.context2D.fillStyle = textField.textColor;
            this.context2D.fillText(textField.text, 0, 0);
            this.context2D.fillStyle = null; //unsure
            textField._measureTextWidth = this.context2D.measureText(textField.text).width;
        };
        return CanvasRenderer;
    }());
})(engine || (engine = {}));
//# sourceMappingURL=engine.js.map