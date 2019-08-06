# Coding conventions
Since JavaScript can be one huge mess if not managed properly, we're collecting 
here some conventions we'll be using in our project to favor consistency, performance
and elegance.

## Importing files
As of now, we just import all of the required js files in the right order in the HTML document calling them. In the future we may turn to [ES6 modules](https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file/950146#950146).

## Object oriented programming

### Class declaration

```javascript
class Musician {
    constructor (name, earnings) {
        // Public fields
        this.name = name;
        // Private fields
        this._earnings = earnings;
    }
    // Public methods
    printDiscography () {
        console.log("Many cool records");
    }

    // Private methods
    _printResidence () {
        console.log("You should not call this from outside the class");
    }
}
```

Notes:

- The syntax for private fields and methods will be easily updated to the WIP private [fields](https://github.com/tc39/proposal-class-fields#private-fields)/[methods](https://docs.google.com/presentation/d/1Q9upYkWnPjJaVc8k9q3U6NekDch8tsz7CgV-Xm55-5Y/edit#slide=id.g423c483f71_0_39) of JS by just replacing "_" with "#".
- This way of declaring methods only creates one function object in the prototype, which is referenced by all instances. This is good compared to techniques that end up creating a new one per instance.

### Class instantiation

```javascript
let me = new Musician("Jotaro", 0);
inst.printDiscography();
```

### Inheritance

```javascript
class Drummer extends Musician {
    constructor(name, earnings, doubleBass) {
        // Fields of the parent class
        super(name, earnings);

        // Specific fields
        this.doubleBass = doubleBass;
    }
}

let moreSpecificObject = new Drummer ("Mike", 1000, true);
if (moreSpecificObject.doubleBass)
    moreSpecificObject.printDiscography();
```

