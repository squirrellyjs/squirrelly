## Conditionals
```sqrl
{{if(options.someval === "someothervalue")}}
Display this!
{{#else}}
They don't equal
{{/if}}
```

## Looping over arrays
```sqrl
{{each(options.someArray)}}
The current array item is {{@this}}, the current index is {{@index}}
{{/each}}
```
## Looping over objects
```
{{foreach(options.someObject)}}
The current object key is {{@key}}, and the value is {{@this}}
{{/foreach}}
```
## Logging to the console
```
{{log("The value of options.num is: " + options.num)/}}
```
