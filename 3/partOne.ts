const useExample = Deno.args.at(0) === "-e"

const data = useExample
    ? await Deno.readTextFile("example.txt")
    : await Deno.readTextFile("task.txt")

const reg = RegExp(/mul\(\d+,\d+\)/g)

const matches = data.match(reg);
console.log(matches);

let res = 0n

matches?.forEach(match => {
    const innerReg = /mul\((\d+),(\d+)\)/
    const values = innerReg.exec(match)
    const a = BigInt(values?.[1] ?? 0)
    const b = BigInt(values?.[2] ?? 0)
    res += a * b
});

console.log(res)