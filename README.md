# Protocol Buffer Basics: JavaScript (Node.js)

This tutorial provides a basic JavaScript programmer's introduction to working with protocol buffers. It shows you how to:

  - Use the protocol buffer compiler.
  - Use the JavaScript's `protobufjs` library to write and read messages.

### What is protobuf?

Protocol Buffers (Protobuf) is a method of serializing structured data. It is useful in developing programs to communicate with each other over a wire or for storing data.

source: [Wikipedia](https://en.wikipedia.org/wiki/Protocol_Buffers)

### protobuf schema

A schema associates data types with field names. For the purpose of this tutorial we will borrow `.proto` file from Google's [Protocol Buffer Basics: Python](https://developers.google.com/protocol-buffers/docs/pythontutorial) tutorial.

##### **`addressbook.proto`**
```protobuf
syntax = "proto3";

package tutorial;

message Person {
  required string name = 1;
  required int32 id = 2;
  optional string email = 3;

  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }

  message PhoneNumber {
    required string number = 1;
    optional PhoneType type = 2 [default = HOME];
  }

  repeated PhoneNumber phones = 4;
}

message AddressBook {
  repeated Person people = 1;
}
```

### Set up the environment

```sh
$ yarn init
$ yarn add protobufjs
```

### Compiling Your Protocol Buffers

Now you have to compile `.proto` file. You will get a new file (`addressbook.proto.js`) with `AddressBook` and some other classes that you need to read and write messages. Running the compiler:

```sh
$ ./node_modules/protobufjs/bin/pbjs -t static-module -w commonjs -o addressbook.proto.js addressbook.proto
```

### Writing A Message

##### **`addressbook-writer.js`**
```javascript
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
```

Execute `addressbook-writer.js`:

```sh
$ node addressbook-writer.js
```

### Reading A Message

##### **`addressbook-reader.js`**
```javascript
const fs = require('fs')
const { tutorial } = require('./addressbook.proto.js')

const contents = fs.readFileSync('./addressbook.proto.dump')
const data = tutorial.AddressBook.decode(new Uint8Array(contents))

for (const person of data.people) {
  console.log(person)
}
```

Execute `addressbook-reader.js`:

```sh
$ node addressbook-reader.js
```

You should get the following output:

```elixir
Person {
  phones: [ PhoneNumber { number: '555-4321', type: 1 } ],
  name: 'John Doe',
  id: 1234,
  email: 'jdoe@example.com' }
Person {
  phones: [ PhoneNumber { number: '777-4321', type: 2 } ],
  name: 'Jane Doe',
  id: 5678,
  email: 'jane@example.com' }
```


Author
------

[Ziga Zupanec](https://www.zigazupanec.com/)


License
-------

MIT

