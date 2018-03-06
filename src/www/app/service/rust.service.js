module.exports = function RustService()
{
    var RustPromise = window.RustPromise;
    
    RustPromise.then(result =>
		{
        // console.log(module)///
        
        console.log(result)///
        
        console.log(result.instance.exports.test(123));
		});
}
