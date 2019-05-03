import React from "react";
export const AppContext = React.createContext();
export default props => {
  return <AppContext.Provider>{props.children}</AppContext.Provider>;
};
