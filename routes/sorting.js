let arrayTest = [1, 2, 3, 4, 5];
let arrayTest2 = [4, 4, 5, 6];

const reversing = (array) => {
  return array.reverse();
};

console.log(reversing(arrayTest));

const filtering = (array, value) => {
  return array.filter((item) => item !== value);
};

console.log(filtering(arrayTest2, 4));
