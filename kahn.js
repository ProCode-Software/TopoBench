/// <reference lib="esnext" />
// @ts-check
/**
 * Implements Kahn's algorithm:
 * For each node without dependencies, the node is added to the sorted result array.
 * Remaining nodes that still depend on the current node repeat this process. If
 * edges remain in the graph, there is a cycle.
 *
 * Source: [Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm)
@param {[number, number][]} graph
@returns {number[] | 'cycle'} */
export function kahn(graph) {
    const edges = new Set(graph)
    // Nodes without dependencies
    const nodes = new Set(
        graph.flat().filter(v => !graph.some(([, dependent]) => dependent == v))
    )
    /** @type {number[]} */
    const sorted = [] // Nodes without dependencies
    while (nodes.size) {
        const [node] = nodes.values().take(1) // Lovin' the latest ECMAScript
        nodes.delete(node)

        sorted.push(node)
        // For each node that depends on `node`
        for (const edge of edges) {
            const [dependency, dependent] = edge
            if (dependency != node) continue

            edges.delete(edge)
            // If the dependent has no dependencies, enqueue it to `nodes`
            // oxlint-disable-next-line no-unused-expressions
            !edges.values().some(([_from, to]) => to == dependent) && nodes.add(dependent)
        }
    }
    return edges.size ? 'cycle' : sorted
}
