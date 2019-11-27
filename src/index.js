import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider, connect } from "react-redux";
import { createLogger } from "redux-logger";
import { schema, normalize } from "normalizr";
import "./index.css";

//action types
const TODO_ADD = "TODO_ADD";
const TODO_TOGGLE = "TODO_TOGGLE";
const FILTER_SET = "FILTER_SET";

//reducer
// const todos = [
//   { id: 0, name: "learn redux" },
//   { id: 1, name: "learn mobx" }
// ];

const todoSchema = new schema.Entity("todo");

const todos = [
  { id: "1", name: "Redux Standalone with advanced Actions" },
  { id: "2", name: "Redux Standalone with advanced Reducers" },
  { id: "3", name: "Bootstrap App with Redux" },
  { id: "4", name: "Naive Todo with React and Redux" },
  { id: "5", name: "Sophisticated Todo with React and Redux" },
  { id: "6", name: "Connecting State Everywhere" },
  { id: "7", name: "Todo with advanced Redux" },
  { id: "8", name: "Todo but more Features" },
  { id: "9", name: "Todo with Notifications" },
  { id: "10", name: "Hacker News with Redux" }
];

const normalizedTodos = normalize(todos, [todoSchema]);
const initialTodoState = {
  entities: normalizedTodos.entities.todo,
  ids: normalizedTodos.result
};

//console.log(initialTodoState)
//const normalizedTodos = normalize(todos, [todoSchema]);
console.log(initialTodoState);

//todoReducer
function todoReducer(state = initialTodoState, action) {
  switch (action.type) {
    case TODO_ADD: {
      return applyAddTodo(state, action);
    }
    case TODO_TOGGLE: {
      return applyToggleTodo(state, action);
    }
    default:
      return state;
  }
}

function applyAddTodo(state, action) {
  //   const todo = Object.assign({}, action.todo, { completed: false });
  //   return state.concat(todo);

  //   const todo = { ...action.todo, completed: false };
  //   return [...state, todo];

  const todo = { ...action.todo, completed: false };
  const entities = { ...state.entities, [todo.id]: todo };
  const ids = [...state.ids, action.todo.id];
  return { ...state, entities, ids };
}

function applyToggleTodo(state, action) {
  //   const newTodos = state.map(todo =>
  //     todo.id === action.todo.id ? { ...todo, completed: !todo.completed } : todo
  //   );
  //   return newTodos;

  // return state.map(todo =>
  //   todo.id === action.todo.id
  //     ? Object.assign({}, todo, { completed: !todo.completed })
  //     : todo
  // );

  const id = action.todo.id;
  const todo = state.entities[id];
  const toggledTodo = { ...todo, completed: !todo.completed };
  const entities = { ...state.entities, [id]: toggledTodo };
  return { ...state, entities };
}

//filterReducer
function filterReducer(state = "SHOW_ALL", action) {
  switch (action.type) {
    case FILTER_SET: {
      return applySetFilter(state, action);
    }
    default:
      return state;
  }
}

function applySetFilter(state, action) {
  return action.filter;
}

//action creators
function doAddTodo(id, name) {
  return {
    type: TODO_ADD,
    todo: { id, name }
  };
}

function doToggleTodo(id) {
  return {
    type: TODO_TOGGLE,
    todo: { id }
  };
}

function doSetFilter(filter) {
  return {
    type: FILTER_SET,
    filter
  };
}

//Store
const rootReducer = combineReducers({
  todoState: todoReducer,
  filterState: filterReducer
});

const logger = createLogger();

const store = createStore(rootReducer, undefined, applyMiddleware(logger));

//Main App
const ConnectedTodoList = connect(mapStateToProps)(TodoList);
const ConnectedTodoItem = connect(null, mapDispatchToProps)(TodoItem);

function TodoApp({ todos, onToggleTodo }) {
  //   return <TodoList todos={todos} onToggleTodo={onToggleTodo} />;
  return <ConnectedTodoList />;
}

function TodoList({ todos }) {
  return (
    <div>
      {todos.map(todo => (
        // <TodoItem key={todo.id} todo={todo} onToggleTodo={onToggleTodo} />
        <ConnectedTodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

function TodoItem({ todo, onToggleTodo }) {
  const { name, id, completed } = todo;
  return (
    <div>
      {name}
      <button type="button" onClick={() => onToggleTodo(id)}>
        {completed ? "Incomplete" : "Complete"}
      </button>
    </div>
  );
}

// function render() {
//   ReactDOM.render(
//     <TodoApp
//       todos={store.getState().todoState}
//       onToggleTodo={id => store.dispatch(doToggleTodo(id))}
//     />,
//     document.getElementById("root")
//   );
// }

// store.subscribe(render);
// render();

// const ConnectedTodoApp = connect(mapStateToProps,mapDispatchToProps)(TodoApp)

function mapStateToProps(state) {
  return {
    todos: state.todoState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onToggleTodo: id => dispatch(doToggleTodo(id))
  };
}

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);
