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

// console.log(rules)
// console.log(tasks)

let sum = 0
for (const task of tasks) {
    if (!checkTask(task)) {
        sum += fixTask(task)
    }
}

console.log(`Sum is ${sum}`)

function checkTask(task: number[]) {
    for (let i = 0; i < task.length; i++) {
        const num = task[i]
        const before = task.slice(0, Math.max(i, 0));
        if (!before.every(e => rules.filter(r => r[1] === num).find(r => r[0] === e))) {
            return false
        }
        const after = task.slice(Math.min(i + 1, task.length));
        if (!after.every(e => rules.filter(r => r[0] === num).find(r => r[1] === e))) {
            return false
        }
    }
    return true
}

function insertAt<T>(working: T[], index: number, current: T): T[] {
    if (index > working.length) {
        return [...working, current]
    }
    return [...working.slice(0, index), current, ...working.slice(index)];
}

function fixTask(task: number[]) {
    let working = [task[0]]
    for (let i = 1; i < task.length; i++) {
        const current = task[i]

        const beforeRules = rules.filter(p => p[0] === current).map(rule => rule[1])
        const beforeInWorking = working.find(w => beforeRules.find(rule => rule === w))
        if (beforeInWorking) {
            const index = working.indexOf(beforeInWorking)
            // console.log(`Inserting ${current} before ${index}`)
            working = insertAt(working, index, current)
            continue
        }
        const afterRules = rules.filter(p => p[1] === current).map(rule => rule[0])
        const afterInWorking = working.findLast(w => afterRules.find(rule => rule === w))
        if (afterInWorking) {
            // console.log({ task, current, afterRules, afterInWorking })
            const index = working.indexOf(afterInWorking)
            // console.log(`Inserting ${current} after ${index}`)
            working = insertAt(working, index + 1, current)
            continue
        }

        console.log({ task, current, working, beforeRules, afterRules, afterInWorking, beforeInWorking })

        // console.error(`Can't find ${current}`)
    }
    const middleNumber = working[(task.length - 1) / 2]
    console.log({ task, working, middleNumber })
    return middleNumber
}