import $ from 'jQuery'
class User {
  name: string;
  age: number;
}

console.log($.ajax)

function getUsers(cb: (users: User[]) => void): void {
  $.ajax({
    url: 'api/users',
    method: 'GET',
    success: function (data) {
      cb(data.items)
    },
    error: function (error) {
      cb(null)
    }
  })
}
