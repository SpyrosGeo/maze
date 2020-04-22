const { Engine, Render, Runner, World, Bodies, } = Matter;


const engine = Engine.create();
const { world } = engine
const width = 800;
const height = 800;
const cells = 5;
const unitLength = width / cells;

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
const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false))

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false))

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false))

const startRow = Math.floor(Math.random() * cells)
const startColumn = Math.floor(Math.random() * cells)

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
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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

        navigateMaze(nextRow, nextColumn);

    }
    //visit that next cell

}

navigateMaze(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
    // console.log(row);
    row.forEach((open, columnIndex) => {
        if (open) {
            return
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            10,
            {
                isStatic: true,
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
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            10,
            unitLength,
            {
                isStatic: true,
            }
        );
        World.add(world, wall)
    });
});