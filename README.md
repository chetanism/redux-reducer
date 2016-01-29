# Redux Reducer
JavaScript library to simplify writing [redux](https://github.com/rackt/redux) reducers

[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/redux-reducer2)

## Why redux-reducer?
[Redux](https://github.com/rackt/redux) is awesome!
However, as you go through [examples](http://rackt.org/redux/docs/introduction/Examples.html), 
 it soon starts appearing that writing complex reducers as functions using switch-case is going to be painful.
 
This library is intended to provide a little more object-oriented approach to write reducers. All it does is
  provide Reducer and CombineReducers classes to get rid of switch-case. Additionally it also lets you 
  add/remove reducers dynamically. Although you must not require this under normal use cases, but if you do, 
  you can.
  
## Installation
npm install redux-reducer2 [--save]
  
## Usage

### A simple usage
The following code is equivalent to the final code listing on [redux's reducers documentation page](http://rackt.org/redux/docs/basics/Reducers.html)

```javascript
import { Reducer, CombineReducers } from 'redux-reducer';
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions';
const { SHOW_ALL } = VisibilityFilters;


const visibilityFilter = new Reducer(SHOW_ALL)
  .on(SET_VISIBILITY_FILTER, (state, action) => action.filter);


const todos = new Reducer([])
  .on(ADD_TODO, (state, action) => (
    [
      ...state,
      {
        text: action.text,
        completed: false
      }
    ]
  ))
  .on(COMPLETE_TODO, (state, action) => (
    [
      ...state.slice(0, action.index),
      Object.assign({}, state[action.index], {
        completed: true
      }),
      ...state.slice(action.index + 1)
    ]
  ));


const todoApp = new CombineReducers({
  visibilityFilter,
  todos
});

export default todoApp.reduce;
```

The Reducer constructor expects the initial state as an argument. 

### Advanced Usages
#### Attaching same handler for multiple action types
```javascript
const myReducer = new Reducer(2);
myReducer.on(['SOME_ACTION_1', 'SOME_ACTION_2'], (state) => (state * 2));
```
#### Attaching multiple handles for one action type
```javascript
myReducer.on('SOME_ACTION', (state, action) => doSomethingWith(state));
myReducer.on('SOME_ACTION', (state, action) => doSomethingElseWith(state));
```
In case multiple handlers are set for a single action, they get called in the order they were added. The returned state from 
 one handler is passed to the next handler. Consider it as a chain of handlers.

#### Removing handlers
For a following dummy reducer:
```javascript
const myReducer = new Reducer(2);
const mul2 = (num) => (num * 2);
const mul3 = (num) => (num * 3);
myReducer.on(['SOME_ACTION_1', 'SOME_ACTION_2'], mul2);
myReducer.on('SOME_ACTION_1', mul3);
```
The following line will get rid of just 'mul3' handler for 'SOME_ACTION_1':
```javascript
myReducer.off('SOME_ACTION_1', mul3)
```
While the following line will get rid of all handlers for 'SOME_ACTION_1':
```javascript
myReducer.off('SOME_ACTION_1')
```

 
#### No match, before all, after all
To do something before/after action handlers are invoked or when no action is matched:  
```javascript
const myReducer = new Reducer(2)
  .on('SOME_ACTION', (state) => (state * 2))
  .forNoMatch((state) => (state + 2))
  .beforeAll((state) => (state * 3))
  .afterAll((state) => (state + 4));  
let currentState = myReducer.reduce(null); // => 2
currentState = myReducer.reduce(currentState, { type: 'SOME_ACTION' }); // => 16
currentState = myReducer.reduce(currentState, { type: 'SOME_OTHER_ACTION' }); // => 18
```

Behind the scene forNoMatch() attaches the handler to Reducer.NO_MATCH action type.
 Following two lines are effectively same:
```javascript
myReducer.forNoMatch((state) => (state + 2));
myReducer.on(Reducer.NO_MATCH, (state) => (state + 2));
```
Similarly, beforeAll() is mapped to Reducer.BEFORE_ALL_ACTIONS and afterAll() to Reducer.AFTER_ALL_ACTIONS.

As with any other action, more handlers can be attached or removed for these actions.

#### Action type
By default, redux-reducer expects actions to be [FSA](https://github.com/acdlite/flux-standard-action) and looks for action.type
property to determine which handlers to invoke. You can override this by providing a second argument to the constructor that maps 
an action to action type.

```javascript
const myReducer = new Reducer(2, action => action ? action.myType : '');
myReducer.on('SOME_ACTION_1', (state) => (state * 3));
let currentState = myReducer.reduce(null);
currentState = myReducer.reduce(currentState, {myType: 'SOME_ACTION_1'});
```



### How to Test

```shell
$ npm run lint          # Lint your code
$ npm test              # Run unit tests, or `npm test -- --watch`
```

### License

The MIT License © Chetan Verma ([@chetanism](https://twitter.com/chetanism))
