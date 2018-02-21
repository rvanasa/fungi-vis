***Human-Fungi Interface*** is an interactive visualization tool for the [Fungi](https://github.com/Adapton/fungi-lang.rust) programming language.

### Local Configuration

1. Download/install [Rust](https://www.rust-lang.org/)
2. Download/install [Node.js](https://nodejs.org/en/)
3. Download/install [Emscripten SDK](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html)
4. Run `rustup target add wasm32-unknown-emscripten` to install the Emscripten compile target
5. Run `npm i` to install dependencies
6. Run `node index dev` to run on port 8080
7. Visit http://localhost:8080 in your browser

### Current Features
- Pretty-printing bundled Fungi code/traces
- Variable highlighting
- AST/context/type inspection