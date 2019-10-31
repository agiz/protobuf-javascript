const fs = require('fs')
const { tutorial } = require('./addressbook.proto.js')

const contents = fs.readFileSync('./addressbook.proto.dump')
const data = tutorial.AddressBook.decode(new Uint8Array(contents))

for (const person of data.people) {
  console.log(person)
}
