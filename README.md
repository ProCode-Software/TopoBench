# TopoBench

A tester for different [topological sorting](https://en.wikipedia.org/wiki/Topological_sorting) algorithms.

I used:

- [My own implementation](https://github.com/ProCode-Software/procosort) (procosort)
- [Kahn's algorithm](./kahn.js)
- [Depth-first search](./dfs.js)

## Usage

### Testing an implementation

1. Create a new file with your implementation as the default export

    ```ts
    export default function toposort(graph: [number, number][]): number[] {}
    ```

    - It takes a list of edges as a parameter
    - Returns the ordered vertices

2. In `main.js`, add the name of your implementation and the function to the `implementations` object

    ```js
    import myImpl from './myImpl.js'

    const implementations = {
        "ProCode's Algorithm": procode,
        "Kahn's Algorithm": kahn,
        'Depth-First Search': dfs,
        'My Implementation': myImpl,
    }
    ```

3. Run the test runner in `main.js` using Node or Bun

    ```shell
    # Bun
    bun run main.js

    # Node
    node main.js
    ```

Results will be formatted similar to the following:

```
==================================================
RESULTS
==================================================
Max points: 12

Implementation           | Score | Time
--------------------------------------------------
ProCode's Algorithm      |    12 | 1.0981500 ms
Kahn's Algorithm         |    12 | 3.0878900 ms
Depth-First Search       |    12 | 1.2606010 ms
==================================================
⚡ Best performance: ProCode's Algorithm at 1.10 ms
🐌 Worst performance: Kahn's Algorithm at 3.09 ms
```

**Score:** The highest score will be the length of the `tests` array. This indicates that the implementation is correct and passes all tests. Each passed tests gives the implementation 1 point, while a failed test subtracts 1.

### Adding tests

In the `tests` array in [main.js](./main.js), you can add a test by calling `input` with your pairs of edges. If you want to test a cycle, meaning you expect implementations to report a cycle, call `cycleInput` instead. Currently, you have to specify if an input is a cycle or not for correct results. Implementations lose a point for false positive/negative cycle reports.

## License

MIT License
