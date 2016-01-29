/**
 * Created by chetanv on 24/01/16.
 */


import { describe, it } from 'mocha';
import { expect } from 'chai';
import Reducer from '../src/Reducer';


describe('Reducer', () => {

  it('can be initialized', () => {
    const myReducer = new Reducer(1);
    expect(myReducer.initialState).to.deep.equal(1);
  });

  describe('#on', () => {
    it('can add action handler', () => {
      const myReducer = new Reducer();
      myReducer.on('SOME_ACTION_1', () => null);
      myReducer.on('SOME_ACTION_2', () => null);
      expect(myReducer.actionHandlers).to.have.property('SOME_ACTION_1')
        .that.is.an('array')
        .with.deep.property('[0]')
        .that.is.a('function');

      expect(myReducer.actionHandlers).to.have.property('SOME_ACTION_2')
        .that.is.an('array')
        .with.deep.property('[0]')
        .that.is.a('function');
    });

    it('can add multiple handler for same action', () => {
      const myReducer = new Reducer();
      myReducer.on('SOME_ACTION', () => null);
      myReducer.on('SOME_ACTION', () => null);

      expect(myReducer.actionHandlers).to.have.property('SOME_ACTION')
        .that.is.an('array')
        .with.deep.property('[0]')
        .that.is.a('function');

      expect(myReducer.actionHandlers).to.have.property('SOME_ACTION')
        .that.is.an('array')
        .with.deep.property('[1]')
        .that.is.a('function');
    });

    it('can add handler for multiple actions', () => {
      const myReducer = new Reducer(2);
      myReducer.on(['SOME_ACTION_1', 'SOME_ACTION_2'], (state) => (state * 2));

      let currentState = myReducer.reduce(null);
      expect(currentState).to.be.equal(2);

      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_1'});
      expect(currentState).to.be.equal(4);

      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_2'});
      expect(currentState).to.be.equal(8);
    });

    it('can remove all handlers for an action', () => {
      const myReducer = new Reducer(2);
      myReducer.on(['SOME_ACTION_1', 'SOME_ACTION_2'], (state) => (state * 2));
      myReducer.on('SOME_ACTION_1', (state) => (state * 3));

      let currentState = myReducer.reduce(null);
      expect(currentState).to.be.equal(2);

      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_1'});
      expect(currentState).to.be.equal(12);

      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_2'});
      expect(currentState).to.be.equal(24);

      myReducer.off('SOME_ACTION_1');
      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_1'});
      expect(currentState).to.be.equal(24);
    });

    it('can remove one handler for an action', () => {
      const myReducer = new Reducer(2);
      const mul3 = (num) => (num * 3);

      myReducer.on(['SOME_ACTION_1', 'SOME_ACTION_2'], (state) => (state * 2));
      myReducer.on('SOME_ACTION_1', mul3);

      let currentState = myReducer.reduce(null);
      expect(currentState).to.be.equal(2);

      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_1'});
      expect(currentState).to.be.equal(12);

      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_2'});
      expect(currentState).to.be.equal(24);

      myReducer.off('SOME_ACTION_1', mul3);
      currentState = myReducer.reduce(currentState, {type: 'SOME_ACTION_1'});
      expect(currentState).to.be.equal(48);
    });

    it('can change way action type is determined', () => {
      const myReducer = new Reducer(2, action => action ? action.myType : '');
      myReducer.on('SOME_ACTION_1', (state) => (state * 3));

      let currentState = myReducer.reduce(null);
      expect(currentState).to.be.equal(2);
      currentState = myReducer.reduce(currentState, {myType: 'SOME_ACTION_1'});
      expect(currentState).to.be.equal(6);
    });
  });

  describe('#forNoMatch', () => {
    it('should reduce with before, after, no-match handlers correctly', () => {
      const myReducer = new Reducer(2)
        .on('SOME_ACTION', (state) => (state * 2))
        .forNoMatch((state) => (state + 2))
        .beforeAll((state) => (state * 3))
        .afterAll((state) => (state + 4));

      let currentState = myReducer.reduce(null);
      expect(currentState).to.be.equal(2);

      currentState = myReducer.reduce(currentState, { type: 'SOME_ACTION' });
      expect(currentState).to.be.equal(16);

      currentState = myReducer.reduce(currentState, { type: 'SOME_OTHER_ACTION' });
      expect(currentState).to.be.equal(18);
    });
  });

  describe('#reduce', () => {
    it('should reduce for known actions', () => {
      const state = {
        hello: '',
        world: ''
      };

      const myReducer = new Reducer(state)
        .on('HELLO_SAYS_WORLD', (state) => ({
            hello: 'world',
            world: state.world
          })
        )
        .on('HELLO_SAYS_WORLD', (state) => ({
            hello: state.hello + 'world',
            world: state.world
          })
        )
        .on('WORLD_SAYS_HELLO', (state) => ({
          hello: state.hello,
          world: 'hello'
        }));

      expect(myReducer.initialState).to.be.deep.equal(state);

      let currentState = myReducer.reduce(null);
      expect(currentState).to.deep.equal(state);

      currentState = myReducer.reduce(currentState, {type: 'HELLO_SAYS_WORLD'});
      expect(currentState).to.have.property('hello')
        .that.equals('worldworld');

      currentState = myReducer.reduce(currentState, {type: 'WORLD_SAYS_HELLO'});
      expect(currentState).to.have.property('world')
        .that.equals('hello');
    });


    it('should not reduce for unknown actions', () => {
      const state = {
        hello: ''
      };

      const myReducer = new Reducer(state);
      myReducer.on('HELLO_SAYS_WORLD', (state) => ({
          hello: 'world',
          world: state.world
        })
      );

      let currentState = myReducer.reduce(null);
      currentState = myReducer.reduce(currentState, {type: 'WORLD_SAYS_HELLO'});
      expect(currentState).to.deep.equals(state);
    });
  });
});