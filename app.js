const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;


const engine = Engine.create();
// engine.world.gravity.y=0;
const { world } = engine
const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 20;
const cellsVertical =20

const unitLengthX =width /cellsHorizontal
const unitLengthY = height /cellsVertical

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width,
        height,
        // wireframes: false
    }

});

Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 1, {
        isStatic: true
    }), Bodies.rectangle(width / 2, height, width, 1, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 1, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 1, height, {
        isStatic: true
    }),

]



World.add(world, walls);

//Maze generation

const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter)

        counter--;
        const temp = arr[counter];
        arr[counter] = arr[index]
        arr[index] = temp;
    }
    return arr;
};
const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false))

const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false))

const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false))

const startRow = Math.floor(Math.random() * cellsVertical)
const startColumn = Math.floor(Math.random() * cellsHorizontal)

const navigateMaze = (row, column) => {
    //check if the cell has been visited
    if (grid[row][column]) {
        return;
    }
    //mark the cell as visited
    grid[row][column] = true;

    //assemble randomy-ordered list of neighbors
    const neighbors = shuffle([
        //above cell
        [row - 1, column, 'up'],
        //cell on the right
        [row, column + 1, 'right'],
        //cell below
        [row + 1, column, 'down'],
        //cell on the left
        [row, column - 1, 'left']
    ])
    //for each neighbor..
    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;

        //see if neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;


        }


        //if we have visited neighbor continue to next
        if (grid[nextRow][nextColumn]) {
            continue;
        }
        //remove wall from horizontals or verticals
        if (direction === "left") {
            verticals[row][column - 1] = true;
        } else if (direction === "right") {
            verticals[row][column] = true;
        } else if (direction === "up") {
            horizontals[row - 1][column] = true;
        } else if (direction === "down") {
            horizontals[row][column] = true;
        }

        //visit that next cell
        navigateMaze(nextRow, nextColumn);

    }

}

navigateMaze(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
    // console.log(row);
    row.forEach((open, columnIndex) => {
        if (open) {
            return
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            10,
            {
                isStatic: true,
                label:'wall'
            }
        );
        World.add(world, wall)
    });

});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            10,
            unitLengthY,
            {
                isStatic: true,
                label:"wall"
            }
        );
        World.add(world, wall)
    });
});




//Goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .5,
    unitLengthY * .5, {
    isStatic: true,
    label: "Goal"
}

);

World.add(world, goal)


//player
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius, {
    isStatic: false,
    label: "Ball"
}
)
World.add(world, ball)


//handle keypresses

document.addEventListener('keydown', e => {
    const { x, y } = ball.velocity;
    if (e.keyCode === 87) {
        Body.setVelocity(ball, {
            x,
            y: y - 5
        })
    }
    if (e.keyCode === 68) {
        Body.setVelocity(ball, {
            x: x + 5,
            y
        })
    }
    if (e.keyCode === 83) {
        Body.setVelocity(ball, {
            x,
            y: y + 5
        })
    }
    if (e.keyCode === 65) {
        Body.setVelocity(ball, {
            x: x - 5,
            y
        })
    }
})
//Win condition

Events.on(engine, 'collisionStart', e => {
    e.pairs.forEach((collision) => {
        const labels =['Ball','Goal']
        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
            world.bodies.forEach(body=>{
                if(body.label==='wall'){
                    Body.setStatic(body,false)
                }
            })
        }
    })
})