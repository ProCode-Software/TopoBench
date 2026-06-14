//@ts-check
/**
 * Source: [Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
 * @param {[number, number][]} graph
 * @returns {number[] | 'cycle'}
 */
export function dfs(graph) {
    /** @type {number[]} */
    const reverseSorted = []
    const unvisited = new Set(graph.flat())
    /** @type {Set<number>} */
    const tempMarked = new Set()

    while (unvisited.size) {
        const [node] = unvisited.values().take(1)
        if (visit(node) == 'cycle') return 'cycle'
    }
    /** @param {number} */
    function visit(node) {
        if (!unvisited.has(node)) return
        if (tempMarked.has(node)) return 'cycle'

        tempMarked.add(node)
        // Loop over dependents of node
        // The new Iterator.filter is crazy great for performance!
        for (const [, dependent] of graph
            .values()
            .filter(([dependency]) => dependency == node)) {
            if (visit(dependent) == 'cycle') return 'cycle'
        }
        unvisited.delete(node)
        reverseSorted.push(node)
    }
    // It's faster to push-then-reverse than to unshift
    return reverseSorted.reverse()
}
