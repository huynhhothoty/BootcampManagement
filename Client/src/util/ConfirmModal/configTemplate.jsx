import { createContext } from 'react';

const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);

export const baseConfig = {
    title: 'Use Hook!',
    content: (
      <>
        <ReachableContext.Consumer>{(name) => `Reachable: ${name}!`}</ReachableContext.Consumer>
        <br />
        <UnreachableContext.Consumer>{(name) => `Unreachable: ${name}!`}</UnreachableContext.Consumer>
      </>
    ),
  };