const useExample = Deno.args.at(0) === "-e"

const data = useExample
    ? await Deno.readTextFile("example2.txt")
    : await Deno.readTextFile("task.txt")

let cleanedData = data

while (cleanedData.indexOf(`don't()`) > 0) {
    const donTIndex = cleanedData.indexOf(`don't()`)
    const doIndex = cleanedData.indexOf(`do()`, donTIndex)
    cleanedData = cleanedData.substring(0, donTIndex) + (doIndex > 0 ? cleanedData.substring(doIndex) : "")
}
console.log(cleanedData)

const reg = RegExp(/mul\(\d+,\d+\)/g)

const matches = cleanedData.match(reg);
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