var edge = require('edge');

var getPerson = edge.func('G:/01 CODE/code01/apple/test/TestNodejs3.dll'); 

var payload = {
    anInteger: 1,
    aNumber: 3.1415,
    aString: 'AAAA',
    aBoolean: true,
    aBuffer: new Buffer(10),
    anArray: [ 1, 'foo' ],
    anObject: { a: 'foo', b: 12 }
};

getPerson(payload, function (error, result) {
    if (error) throw error;
    console.log(result);
});