***Human-Fungi Interface*** is an interactive visualization tool for the [Fungi](https://github.com/Adapton/fungi-lang.rust) programming language.

### Local Configuration

1. Download/install [Rust](https://www.rust-lang.org/)
2. Download/install [Node.js](https://nodejs.org/en/)
3. Run `rustup target add wasm32-unknown-unknown --toolchain nightly` to install the Webassembly compile target
4. Run `npm i` to install dependencies
5. Run `node index dev` to run on port 8080
6. Visit http://localhost:8080 in your browser

### Current Features
- Pretty-printing bundled Fungi code/traces
- Variable highlighting
- AST/context/type inspection
- Client-side code execution
