const ADD = Symbol(0), REMOVE = Symbol(0), RESET = Symbol(0), SELECT = Symbol(0), READONLY = Symbol(0), SET_READONLY = Symbol(0), ON_RESET = Symbol(0), ON_REMOVE = Symbol(0), ON_USER_SELECT = Symbol(0);
const ListSymbol = {
  add: ADD,
  remove: REMOVE,
  reset: RESET,
  select: SELECT,
  readonly: READONLY,
  setReadonly: SET_READONLY,
  onReset: ON_RESET,
  onRemove: ON_REMOVE,
  onUserSelect: ON_USER_SELECT
};

export { ListSymbol };
