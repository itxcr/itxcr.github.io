function pluck(obj, names) {
    return names.map(function (name) { return obj[name]; });
}
var person = {
    name: 'xcr',
    age: 18
};
console.log(pluck(person, ["name"]));
pluck(person, ["profession"]); // Type '"profession"' is not assignable to type 'keyof Person'.
