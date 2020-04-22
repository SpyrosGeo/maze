const { Engine, Render, Runner, World, Bodies, } = Matter;


const engine = Engine.create();
const { world } = engine
const width = 800;
const height = 800;
const cells = 3;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width,
        height,
        wireframes: false
    }

});

Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 40, {
        isStatic: true
    }), Bodies.rectangle(width / 2, height, width, 40, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 40, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 40, height, {
        isStatic: true
    }),

]



World.add(world, walls);

//Maze generation
const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false))

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false))

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false))

const startRow = Math.floor(Math.random()*cells)
const startColumn = Math.floor(Math.random()*cells)

const navigateMaze = (row,column)=>{

}

navigateMaze(startRow,startColumn)