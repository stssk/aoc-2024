const useExample = Deno.args.at(0) === "-e"

const data = useExample
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const board = data
    .split("\n")
    .map(p => p.split(""))

function hitBorder({ x, y }: Position) {
    return x < 0 || y < 0 || x >= board[0].length || y >= board.length
}

enum Direction {
    Up,
    Right,
    Down,
    Left
}

interface Position {
    x: number
    y: number
    direction: Direction
}

function getInitialPosition(): Position {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const cell = board[y][x]
            if (cell === "^") {
                return {
                    x: x,
                    y: y,
                    direction: Direction.Up
                }
            }
        }
    }
    throw Error("No position")
}

const trailMarker = "X"
const box = "#"

function move({ x, y, direction }: Position): Position {
    let newX = x
    let newY = y
    if (direction === Direction.Up) { newY-- }
    else if (direction === Direction.Right) { newX++ }
    else if (direction === Direction.Down) { newY++ }
    else if (direction === Direction.Left) { newX-- }
    const newP = { x: newX, y: newY, direction }
    if (hitBorder(newP)) {
        board[y][x] = trailMarker
        return newP
    }
    if (board[newY][newX] !== box) {
        board[y][x] = trailMarker
        return newP
    }
    const newD = turnRight(direction)
    return move({ x, y, direction: newD })
}

function turnRight(d: Direction) {
    switch (d) {
        case Direction.Up:
            return Direction.Right
        case Direction.Right:
            return Direction.Down
        case Direction.Down:
            return Direction.Left
        case Direction.Left:
            return Direction.Up
    }
}

let position = getInitialPosition()

while (!hitBorder(position)) {
    position = move(position)
}

console.log(board.map(p => p.join("")).join("\n"))

let sum = 0

for (const row of board)
    for (const e of row)
        if (e === trailMarker) sum++

console.log(sum)