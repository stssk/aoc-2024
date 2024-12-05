const useExample = Deno.args.at(0) === "-e"

const rawData = useExample
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const data = rawData.split("\n\n")

const rules = data
    .at(0)
    ?.split("\n")
    .map(p => p.split("|").map(e => Number(e))) ?? []

const tasks = data
    .at(1)
    ?.split("\n")
    .map(p => p.split(",").map(e => Number(e))) ?? []

let sum = 0
for (const task of tasks) {
    sum += checkTask(task)
}

console.log(`Sum is ${sum}`)

function checkTask(task: number[]) {
    for (let i = 0; i < task.length; i++) {
        const num = task[i]
        const before = task.slice(0, Math.max(i, 0));
        if (!before.every(e => rules.filter(r => r[1] === num).find(r => r[0] === e))) {
            return 0
        }
        const after = task.slice(Math.min(i + 1, task.length));
        if (!after.every(e => rules.filter(r => r[0] === num).find(r => r[1] === e))) {
            return 0
        }
    }
    const middleNumber = task[(task.length - 1) / 2]
    console.log(task, middleNumber)
    return middleNumber
}
