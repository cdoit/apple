// function runAsync1(){
//     var p = new Promise(function(resolve, reject){
//         //做一些异步操作
//         setTimeout(function(){
//             console.log('异步任务1执行完成');
//             resolve('随便什么数据1');
//         }, 1000);
//     });
//     return p;            
// }
// function runAsync2(){
//     var p = new Promise(function(resolve, reject){
//         //做一些异步操作
//         setTimeout(function(){
//             console.log('异步任务2执行完成');
//             resolve('随便什么数据2');
//         }, 2000);
//     });
//     return p;            
// }
// function runAsync3(){
//     var p = new Promise(function(resolve, reject){
//         //做一些异步操作
//         setTimeout(function(){
//             console.log('异步任务3执行完成');
//             resolve('随便什么数据3');
//         }, 2000);
//     });
//     return p;            
// }


// runAsync1()
// .then(function(data){
//     console.log(data);
//     return runAsync2();
// })
// .then(function(data){
//     console.log(data);
//     return '直接返回数据';  //这里直接返回数据
// })
// .then(function(data){
//     console.log(data);
// });


//请求某个图片资源
function requestImg(){
    var p = new Promise(function(resolve, reject){
        var images = require("images");
        var img = new images();
        img.onload = function(){
            resolve(img);
        }
        img.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503046853&di=d4f984fcf86583432a14b7de8ef81851&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F267f9e2f07082838b5168c32b299a9014c08f1f9.jpg';
    });
    return p;
}

//延时函数，用于给请求计时
function timeout(){
    var p = new Promise(function(resolve, reject){
        setTimeout(function(){
            reject('图片请求超时');
        }, 5000);
    });
    return p;
}

Promise=require("Promise");
Promise
.race([requestImg(), timeout()])
.then(function(results){
    console.log(results);
})
.catch(function(reason){
    console.log(reason);
});

a=1;