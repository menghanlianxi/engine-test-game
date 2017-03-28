class doMap extends engine.DisplayObjectContainer {
    private _grid: Grid;
    private _cellSize: number = 20;

    constructor() {
        super();
        this._grid = new Grid(10, 10);
        var container = new engine.DisplayObjectContainer();
        this.addChild(container);
        for (var i = 0; i < config.length; i++) {
            for (var j = 0; j < config.length; j++) {
                var tile = config[i][j];
                //console.log(tile);
                var bitmap = new engine.Bitmap();
                bitmap.x = j * 100;
                bitmap.y = i * 100;
                this.addChild(bitmap);
                if (tile == 1) {
                    bitmap.img.src="asset/grass.jpg";
                }
                if (tile == 0) {
                    bitmap.img.src="asset/road.jpg";
                }
                this._grid.setWalkable(i,j,tile);
                container.addChild(bitmap);
            }
        }
    }
    private astar: AStar = new AStar();
    public astarPath(beginX: number, beginY: number, endX: number, endY: number): TileNode[] {

        var path: TileNode[] = new Array();
        this._grid.setStartPoint(beginX, beginY);
        this._grid.setEndPoint(endX, endY);

        if (this.astar.findPath(this._grid)) {
            path = this.astar.getPath();
        }

        return path;

    }
}

var config = [//map
    [1, 0, 1, 1, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]]
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
