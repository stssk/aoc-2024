export function range(start: number, count: number): number[] {
    return Array.from({ length: count }, (_, index) => start + index);
}

export function sum(numbers: number[]): number {
    return numbers.reduce((acc, c) => acc + c, 0);
}

export function sumBig(numbers: bigint[]): bigint {
    return numbers.reduce((acc, c) => acc + c, 0n);
}


export function distinct<T>(array: T[], comparator: (a: T, b: T) => boolean): T[] {
    return array.filter((item, index) =>
        index === array.findIndex(other => comparator(item, other))
    );
}

export function contains<T>(array: T[], value: T) {
    for (const e of array) {
        if (e === value) return true
    }
    return false
}