console.clear()

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const persons = [
  {name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
  {name: 'Michael', profession: 'teacher', age: 50, maritalStatus: 'single'},
  {name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'married'},
  {name: 'Rose', profession: 'scientific', age: 50, maritalStatus: 'married'},
  {name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
  {name: 'Anna', profession: 'politician', age: 50, maritalStatus: 'married'},
  {name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'single'}
]

function isEven (number) {
  return number % 2 === 0
}

function parity (number) {
  return isEven(number) ? 'even' : 'odd'
}

function isPrime (number) {
  if (number < 2) {
    return false
  }
  let divisor = 2
  for (; number % divisor !== 0; divisor++) {}
  return divisor === number
}

function prime (number) {
  return isPrime(number) ? 'prime' : 'divisible'
}

function profession (person) {
  return person.profession
}

function professionGroup (group) {
  return group[0]
}

function name (person) {
  return person.name
}

function isTeacher (person) {
  return person.profession === 'teacher'
}

const query = () => ({
  select: function (fn) {
    if (this.selectCalled) {
      throw new Error('Duplicate SELECT')
    }

    this.selectFn = fn
    this.selectCalled = true
    return this
  },
  from: function (data) {
    if (this.fromCalled) {
      throw new Error('Duplicate FROM')
    }

    this.data = data
    this.fromCalled = true
    return this
  },
  where: function (filter) {
    this.filter = filter
    return this
  },
  groupBy: function (...fn) {
    console.log('fn', fn)
    this.groupByFn = fn
    return this
  },
  execute: function () {
    if (this.filter) {
      this.data = this.data.filter(this.filter)
    }

    if (this.groupByFn) {
      this.data = this.data.reduce((acc, item, index, array) => {
        const group = []
        if (acc.filter(accItem => accItem[0] === this.groupByFn(item)).length === 0) {
          const grouped = array.filter(_item => {
            if (this.groupByFn(item) === 'odd') {
              return !isEven(_item)
            }
            if (this.groupByFn(item) === 'even') {
              return isEven(_item)
            }

            return _item[this.groupByFn.name] === this.groupByFn(item)
          })
          group.push(this.groupByFn(item), grouped)
        }
        if (group.length > 0) acc.push(group)
        return acc
      }, [])
    }

    if (this.selectFn) {
      this.data = this.data.map(this.selectFn)
    }

    return this.data || []
  }
})

// console.log(query().select().from(numbers).execute())
// console.log(query().from(numbers).select().execute())
// console.log(query().select().from(persons).execute())
// console.log(query().select(profession).from(persons).execute())
// query().select().select().execute() //Error('Duplicate SELECT')
// query().select().from([]).select().execute() //Error('Duplicate SELECT')
// query().select().from([]).from([]).execute() //Error('Duplicate FROM')
// console.log(query().select().execute()) //[]
// console.log(query().from(numbers).execute()) // [1, 2, 3]
// console.log(query().execute()) // []
// console.log(query().select(name).from(persons).where(isTeacher).execute())
// console.log(query().select().from(persons).groupBy(profession).execute())
// console.log(query().select().from(persons).where(isTeacher).groupBy(profession).execute())
// console.log(query().select(professionGroup).from(persons).groupBy(profession).execute()) //["teacher","scientific","politician"]
// console.log(query().select().from(numbers).execute())
// console.log(query().select().from(numbers).groupBy(parity).execute())
console.log(query().select().from(numbers).groupBy(parity, prime).execute())
