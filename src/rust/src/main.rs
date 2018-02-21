// #[macro_use]
// extern crate fungi_lang;

// use fungi_lang::vis;

fn main() {
	println!("Hello Rust!");
}

#[no_mangle]
pub fn test(input: &str) {
	println!("~~ {} ~~", input);
}