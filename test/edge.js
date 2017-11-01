var edge = require('edge');  
var getResult = edge.func('G:/01 CODE/code01/apple/test/TestNodejs.dll');  
  
getResult(13,function (error, result) {  
    if (error) throw error;  
    console.log(result);
});

// var edge=require('edge');

// var helloWorld= edge.func(function () {/*
//    async (input) => {  //这里是C#代码
//        return ".NET Welcomes" + input.ToString();
//    }
// */});

// helloWorld('JavaScript',function (error, result) {
//   if (error) throw error;
//   console.log(result);
// });