'use strict'

var p = require('parsimmon');

function lexeme(token)
{
	return ignore.then(token);
}

function keyword(id)
{
	return lexeme(p.string(id));
}

var seq = p.seqMap;

function opt(parser, def)
{
	return parser.or(p.succeed(def));
}

function surround(left, parser, right)
{
	return left.then(parser).skip(right);
}

function toObject(pairs)
{
	var obj = {};
	for(var [key, value] of pairs)
	{
		obj[key] = value;
	}
	return obj;
}

var ignore = opt(p.string(' '));

var IDENT = lexeme(p.regex(/[_A-Za-z$][_A-Za-z$0-9]*/));
var STR = lexeme(p.regex(/"([^"\\]*(\\.[^"\\]*)*)"/)).map(s => s.substring(1, s.length - 1));
var NUM = lexeme(p.regex(/-?([0-9]+|[0-9]*\.[0-9]+)/)).map(Number);
var TRUE = keyword('true').result(true);
var FALSE = keyword('false').result(false);

var L_PAREN = keyword('(');
var R_PAREN = keyword(')');
var L_BRACKET = keyword('[');
var R_BRACKET = keyword(']');
var L_BRACE = keyword('{');
var R_BRACE = keyword('}');
var COMMA = keyword(',');
var COLON = keyword(':');

var Exp = p.lazy('Expression', () => p.alt(
	TRUE,
	FALSE,
	Sequence,
	Composite,
	STR,
	NUM,
	L_PAREN.then(R_PAREN).result(null)
));

var KVPair = p.seq(IDENT.skip(COLON), Exp);

var Sequence = surround(L_BRACKET, Exp.skip(opt(COMMA)).many(), R_BRACKET);

var Composite = seq(IDENT, opt(p.alt(
	surround(L_PAREN, Exp.skip(opt(COMMA)).many(), R_PAREN),
	surround(L_BRACE, KVPair.skip(opt(COMMA)).many().map(toObject), R_BRACE)
), []), (id, values) => [id].concat(values));

var EntryPoint = Exp.skip(ignore);

module.exports = function(input)
{
	var result = EntryPoint.parse(input);
	if(!result.status)
	{
		var nearby = input.substr(result.index.offset, 1);
		throw new Error(`Unexpected ${nearby.length ? 'symbol ' + nearby : 'end of script'} (line ${result.index.line}, col ${result.index.column})`);
	}
	return result.value;
}