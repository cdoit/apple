var edge = require('edge');

var getPerson = edge.func(function () {/*
    using System.Threading.Tasks;

    public class Person
    {
        public int anInteger = 1;
        public double aNumber = 3.1415;
        public string aString = "foo";
        public bool aBoolean = true;
        public byte[] aBuffer = new byte[10];
        public object[] anArray = new object[] { 1, "foo" };
        public object anObject = new { a = "foo", b = 12 };
    }

    public class Startup
    {
        public async Task<object> Invoke(dynamic input)
        {
            Person person = new Person();
            string A = (string)input.aString;
            person.aString = A + "2323";
            return person;
        }
    }
*/});

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