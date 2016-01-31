/**
 * Created by chetanv on 23/01/16.
 */

class Reducer {

  static getActionType(action) {
    return action ? action.type : '';
  }

  static reduceWithHandlers(state, action, handlerList) {
    let currentState = state;
    for (const handler of handlerList) {
      currentState = handler(currentState, action);
    }
    return currentState;
  }

  static NO_MATCH = '__redux_reducer_default_action__';
  static BEFORE_ALL_ACTIONS = '__redux_reducer_before_all_actions__';
  static AFTER_ALL_ACTIONS = '__redux_reducer_after_all_actions__';

  constructor(initialState = {}, mapActionType = null) {
    this.actionHandlers = {};
    this.initialState = initialState;
    this.reduce = this.reduce.bind(this);
    this.mapActionType = mapActionType;
  }

  on(actionType, handler) {
    const actionTypes = Array.isArray(actionType) ? actionType : [actionType];
    actionTypes.forEach(
      currentActionType => this.setActionHandler(currentActionType, handler)
    );
    return this;
  }

  forNoMatch(handler) {
    this.on(Reducer.NO_MATCH, handler);
    return this;
  }

  beforeAll(handler) {
    this.on(Reducer.BEFORE_ALL_ACTIONS, handler);
    return this;
  }

  afterAll(handler) {
    this.on(Reducer.AFTER_ALL_ACTIONS, handler);
    return this;
  }

  off(actionType, handler) {
    if (!handler) {
      this.actionHandlers[actionType] = [];
    } else {
      const actionHandlers = this.getHandlerList(actionType);
      this.actionHandlers[actionType] =
        actionHandlers.filter((existingHandler) => (existingHandler !== handler));
    }
    return this;
  }

  setActionHandler(actionType, handler) {
    const actionHandler = this.getHandlerList(actionType, true);
    actionHandler.push(handler);
  }

  getHandlerList(actionType, create = false) {
    const handlerList = this.actionHandlers[actionType] || [];

    if (!this.actionHandlers[actionType] && create) {
      this.actionHandlers[actionType] = handlerList;
    }

    return handlerList;
  }

  reduce(state, action) {
    if (state === null || state === undefined) {
      return this.initialState;
    }

    let currentState = state;

    const mapActionType = this.mapActionType || Reducer.getActionType;
    const actionType = mapActionType(action);
    const notAllowedActions = [
      Reducer.BEFORE_ALL_ACTIONS,
      Reducer.AFTER_ALL_ACTIONS,
      Reducer.NO_MATCH,
    ];

    if (notAllowedActions.indexOf(actionType) !== -1) {
      return currentState;
    }

    const handlerList = this.getHandlerList(actionType);

    if (handlerList.length > 0) {
      const beforeHandlerList = this.getHandlerList(Reducer.BEFORE_ALL_ACTIONS);
      const afterHandlerList = this.getHandlerList(Reducer.AFTER_ALL_ACTIONS);

      currentState = Reducer.reduceWithHandlers(currentState, action, beforeHandlerList);
      currentState = Reducer.reduceWithHandlers(currentState, action, handlerList);
      currentState = Reducer.reduceWithHandlers(currentState, action, afterHandlerList);
    } else {
      const noMatchHandlerList = this.getHandlerList(Reducer.NO_MATCH);
      currentState = Reducer.reduceWithHandlers(currentState, action, noMatchHandlerList);
    }

    return currentState;
  }
}

export default Reducer;
