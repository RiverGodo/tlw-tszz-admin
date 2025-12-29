// let obj = {
//   a:1,
//   b:["c","d"],
//   c:{d:"x"}
// }
// // let obj1 = Object.assign({},obj);
// let obj1 = JSON.parse(JSON.stringify(obj));
// // let obj1 = Object.assign({},obj);
// // obj1.c = Object.assign({},obj.c);
// // obj1.b = Object.assign({},obj.b);
// // obj1.b[0] =2;
// obj1.c.d =2;
// console.log(obj1);
// console.log(obj);
const fs = require('fs');

fs.open('./env.js', 'a', function(err, fd) {
  console.error(err);
  console.info(fd);
  // const buf = Buffer.from('abc','utf8');
  const buf = 'export default "production";';
  fs.write(fd, buf, 0, function(err, written, buffer) {});
});