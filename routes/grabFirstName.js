let name = " test NAME";
let firstName = name.trim().split(" ")[0];

let firstName2 = name
  .trim()
  .split(" ")[0]
  .replace(/^\w/, (c) => c.toUpperCase());
console.log(firstName);
console.log(firstName2);
