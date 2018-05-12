#!/bin/bash

# Install Rust and WebAssembly build target
curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly
source $HOME/.cargo/env
rustup target add wasm32-unknown-unknown
