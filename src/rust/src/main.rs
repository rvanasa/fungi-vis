#[macro_use]
extern crate fungi_lang;

use fungi_lang::ast::*;
use fungi_lang::bitype::*;
use fungi_lang::vis::*;
// use fungi_lang::eval::*;

fn main() {
	println!("Hello Rust!");
}

#[no_mangle]
pub fn test(_input: String) -> usize {
	
	let bundle = fgi_bundle![
	    ret 0
	];
	
	// println!("{:?}", bundle);
	// println!("{}", input);
	
	// format!("{:?}", bundle)
	12345
}
