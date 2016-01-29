/**
 * Created by chetanv on 28/01/16.
 */


import { describe, it } from 'mocha';
import { expect } from 'chai';
import CombineReducers from '../src/CombineReducers';
import Reducer from '../src/Reducer';


describe('CombineReducers', () => {
  it('can be initialized', () => {
    const myReducer = new CombineReducers();
    expect(myReducer).to.be.an('object');
  });

  it('combines reducers', () => {

    const state1 = {hello: '1'};
    const state2 = {world: ''};
    const initialState = {state1, state2};

    const reducer1 = new Reducer(state1);
    reducer1.on('HELLO_SAYS_WORLD', (state) => ({
      hello: 'world'
    }));

    const reducer2 = new Reducer(state2);
    reducer2.on('WORLD_SAYS_HELLO', (state) => ({
      world: 'hello'
    }));

    const myReducer = new CombineReducers({
      state1: reducer1,
      state2: reducer2
    });

    let currentState = myReducer.reduce(null);
    expect(currentState).to.be.deep.equal(initialState);

    currentState = myReducer.reduce(currentState, {type: 'HELLO_SAYS_WORLD'});
    expect(currentState).to.have.property('state1')
      .that.is.an('object')
      .with.deep.property('hello')
      .that.equals('world');

  })
});