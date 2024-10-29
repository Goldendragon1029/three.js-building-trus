import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import Controller from "./components/controller";
import Building from "./components/building";

const App = () => (
  <Provider store={store}>
    <div className="flex">
      <Controller />
      <Building /> 
    </div>
  </Provider>
);

export default App;