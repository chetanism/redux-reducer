/**
 * Created by chetanv on 23/01/16.
 */

class CombineReducers {

  constructor(reducers = {}) {
    this.reducers = reducers;
    this.reduce = this.reduce.bind(this);
  }

  reduce(state, action) {
    const newState = {};
    for (const subStateKey of Object.keys(this.reducers)) {
      const reducer = this.reducers[subStateKey];
      const subState = state ? state[subStateKey] : null;
      newState[subStateKey] = (typeof reducer === 'function') ?
        reducer(subState, action) : reducer.reduce(subState, action);
    }
    return newState;
  }
}

export default CombineReducers;
