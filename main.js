import { performance } from 'perf_hooks'
import { styleText } from 'util'
import { kahn } from './kahn.js'
import procode from './procosort/index.js'
import { dfs } from './dfs.js'

const implementations = {
    "ProCode's Algorithm": procode,
    "ProCode's Algorithm (2)": procode2,
    "Kahn's Algorithm": kahn,
    'Depth-First Search': dfs,
}

/**
 * Each item is the possible vertices that can be used at that position.
 * @typedef {string | number[]} Result */

/**
 * @param {number[][]} x
 * @returns {number[][]}
 */
const input = (...x) => x

const cycleInput = (...x) => ((x.cycle = true), x)

const tests = [
    input([3, 0], [1, 0], [2, 0]),
    input([1, 3], [2, 3], [4, 1], [4, 0], [5, 0], [5, 2]),
    input([0, 1], [1, 2], [3, 2], [3, 4]),
    input([5, 3], [4, 3], [3, 1]),
    input([5, 11], [7, 8], [7, 11], [3, 8], [3, 10], [11, 2], [11, 9], [11, 10], [8, 9]),
    // Cycles
    cycleInput([4, 1], [1, 2], [2, 3], [3, 4]),
    cycleInput([4, 1], [1, 2], [2, 4]),
    cycleInput([1, 2], [2, 3], [3, 1]),
    cycleInput([1, 2], [2, 3], [3, 4], [4, 5], [5, 1]),
    cycleInput([1, 2], [2, 1]),
    cycleInput([1, 2], [2, 3], [3, 4], [4, 2]),
    cycleInput([1, 2], [2, 3], [3, 4], [4, 5], [5, 3]),
]

/** @type {Map<string, number>} */
const scores = new Map()

/** @type {Map<string, number>} */
const times = new Map()

// Run each implementation
for (const [name, fn] of Object.entries(implementations)) {
    runImpl(name, fn)
}

printScores()

function runImpl(name, fn) {
    for (const [i, testInput] of tests.entries()) {
        const start = performance.now()
        /** @type {Result} */
        const result = fn(testInput)
        const duration = performance.now() - start
        times.set(name, (times.get(name) ?? 0) + duration)

        const validation = validate(testInput, result, testInput.cycle)
        if (validation === true) {
            scores.set(name, (scores.get(name) ?? 0) + 1)
        } else {
            scores.set(name, (scores.get(name) ?? 0) - 1)
            const title = s => styleText('bold', s)
            console.log(
                styleText(
                    ['bold', 'redBright'],
                    `${styleText('yellowBright', `${name}`)} failed test ${styleText('cyanBright', `#${i}`)}:`
                )
            )
            console.group()
            console.log(`${title('Message:')} ${styleText('redBright', validation)}`)
            console.log(title('Input:'), testInput)
            console.log(title('Got:'), result)
            console.groupEnd()
            console.log()
        }
    }
}

/** @param {Result} result
 * @param {number[][]} input
 * @param {true | undefined} cycle
 */
function validate(input, result, cycle) {
    if (typeof result == 'string') {
        return result == 'cycle' && cycle ? true : 'Not a cycle'
    }
    if (cycle) return 'Supposed to be a cycle'

    /** @type {Map<number, number[]>} */
    const depMap = new Map()
    for (const [dependency, dependent] of input) {
        if (!depMap.has(dependent)) depMap.set(dependent, [dependency])
        else depMap.get(dependent).push(dependency)
    }

    /** @type {Map<number, true>} */
    const processed = new Map()
    for (let v of result) {
        for (const dep of depMap.get(v) ?? []) {
            // If the toposort is correct, each item in the result can only reference
            // items that have already been processed.
            if (!processed.has(dep)) {
                return `Vertex ${v} depends on unprocessed vertex ${dep}`
            }
        }
        processed.set(v, true)
    }
    const totalVertices = new Set(input.flat()).size
    if (processed.size != totalVertices) {
        return `Test has ${totalVertices} vertices, but only processed ${processed.size}`
    }
    return true
}

function printScores() {
    console.log(styleText('cyan', '='.repeat(50)))
    console.log(styleText(['blueBright', 'bold'], 'RESULTS'))
    console.log(styleText('cyan', '='.repeat(50)))

    const BEST = tests.length
    console.log(
        styleText('magenta', `Max points: ${styleText('blueBright', `${BEST}`)}\n`)
    )
    const longestName =
        Object.keys(implementations).reduce(
            (a, { length }) => (a > length ? a : length),
            0
        ) + 5

    // Header
    console.log(
        styleText(
            ['yellow', 'bold'],
            `${'Implementation'.padEnd(longestName)} | Score | Time`
        )
    )
    console.log(styleText('blue', '-'.repeat(50)))

    // Table
    const sortedEntries = [...scores.entries()].sort(([, a], [, b]) => b - a)
    for (const [i, [name, score]] of sortedEntries.entries()) {
        let row = [
            styleText('bold', `${name.padEnd(longestName)}`),
            '|',
            styleText(
                score == BEST
                    ? 'greenBright'
                    : score > BEST / 2
                      ? 'yellowBright'
                      : 'redBright',
                `${score}`.padStart(5)
            ),
            '|',
            styleText('greenBright', `${times.get(name).toPrecision(8)} ms`),
        ]
        if (i % 2 === 1) row = row.map(cell => styleText('dim', cell))
        console.log(...row)
    }

    console.log(styleText('cyan', '='.repeat(50)))

    const sortedTimes = [...times.entries()].sort(([, a], [, b]) => a - b)
    const [fastestAlg, fastestTime] = sortedTimes[0]
    const [slowestAlg, slowestTime] = sortedTimes[sortedTimes.length - 1]

    console.log(
        '⚡',
        styleText(['magentaBright', 'bold'], 'Best performance:'),
        styleText('blueBright', fastestAlg),
        'at',
        styleText('blueBright', `${fastestTime.toPrecision(3)} ms`)
    )
    console.log(
        '🐌',
        styleText(['bold'], 'Worst performance:'),
        styleText('redBright', slowestAlg),
        'at',
        styleText('redBright', `${slowestTime.toPrecision(3)} ms`)
    )
    console.groupEnd()
}
