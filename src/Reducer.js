/**
 * Created by chetanv on 23/01/16.
 */

class Reducer {

  static getActionType(action) {
    return action ? action.type : '';
  }

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
  }

  off(actionType, handler) {
    if (!handler) {
      this.actionHandlers[actionType] = [];
    } else {
      const actionHandlers = this.getActionHandler(actionType);
      this.actionHandlers[actionType] =
        actionHandlers.filter((existingHandler) => (existingHandler !== handler));
    }
  }

  setActionHandler(actionType, handler) {
    const actionHandler = this.getActionHandler(actionType);
    actionHandler.push(handler);
  }

  getActionHandler(actionType) {
    if (!this.actionHandlers[actionType]) {
      this.actionHandlers[actionType] = [];
    }

    return this.actionHandlers[actionType];
  }

  reduce(state, action) {
    let currentState = state || this.initialState;

    const mapActionType = this.mapActionType || Reducer.getActionType;
    const handlerList = this.actionHandlers[mapActionType(action)] || [];

    for (const handler of handlerList) {
      currentState = handler(currentState, action);
    }

    return currentState;
  }
}

export default Reducer;
