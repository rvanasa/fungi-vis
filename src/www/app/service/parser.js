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

function optNext(a, b, combiner)
{
	return seq(a, b, combiner).or(a);
}

function sep1(delim, parser)
{
	return seq(parser, delim.then(parser).many(), (f, list) => (list.unshift(f), list));
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

// var ignore = p.alt(p.whitespace, p.string('//').then(p.regex(/.*$/m))).many();
var ignore = p.string(' ').many();

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
	L_PAREN.then(R_PAREN).result(null),
));

// var Literal = p.alt(STR, NUM, TRUE, FALSE);

var KVPair = p.seq(IDENT.skip(COLON), Exp);

var Sequence = seq(opt(IDENT)/***/, surround(L_BRACKET, Exp.skip(opt(COMMA)).many(), R_BRACKET),
	(id, values) => values);

var Composite = seq(IDENT, opt(p.alt(
	surround(L_PAREN, Exp.skip(opt(COMMA)).many(), R_PAREN),
	surround(L_BRACE, KVPair.skip(opt(COMMA)).many().map(toObject), R_BRACE),
), []), (id, values) => [id].concat(values));

module.exports = Exp.skip(ignore);
