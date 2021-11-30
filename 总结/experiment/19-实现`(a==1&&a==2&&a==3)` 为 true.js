var a = {
    i: 1,
    toString: function () {
      return a.i++;
    }
  }
  console.log(a == 1 && a == 2 && a == 3) // true