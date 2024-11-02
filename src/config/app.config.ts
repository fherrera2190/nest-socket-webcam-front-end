export const envConfig =
  import.meta.env.MODE === "development"
    ? {
        VITE_SERVER: import.meta.env.VITE_SERVER,
        VITE_PATH_SOCKET: import.meta.env.VITE_PATH_SOCKET,
        VITE_PEER_PATH: import.meta.env.VITE_PEER_PATH,
        VITE_PEER_SECURE:
          import.meta.env.VITE_PEER_SECURE === "true" ? true : false,
        VITE_PORT: import.meta.env.VITE_PORT,
      }
    : {};
console.log(envConfig);
