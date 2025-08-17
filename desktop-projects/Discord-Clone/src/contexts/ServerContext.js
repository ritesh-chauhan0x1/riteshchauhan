import React from 'react';

const ServerContext = React.createContext();

export const ServerProvider = ServerContext.Provider;
export const ServerConsumer = ServerContext.Consumer;

export default ServerContext;
