const fs = require('fs')
const { tutorial } = require('./addressbook.proto.js')

const addressBook = tutorial.AddressBook.create()

// One way to create a person.
const person = tutorial.Person.create()
person.id = 1234
person.name = "John Doe"
person.email = "jdoe@example.com"
person.phones.push({
  number: "555-4321",
  type: tutorial.Person.PhoneType.HOME,
})

addressBook.people.push(person)

// Another way to create a person.
const personB = tutorial.Person.create()

const prop = {
  id: 5678,
  name: "Jane Doe",
  email: "jane@example.com",
  phones: [{
    number: "777-4321",
    type: tutorial.Person.PhoneType.WORK,
  }],
}

Object.assign(personB, prop)

addressBook.people.push(personB)

const buffer = tutorial.AddressBook.encode(addressBook).finish()

fs.writeFileSync('addressbook.proto.dump', buffer)
