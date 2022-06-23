module.exports = (io, socket) => {
  const handleUserLogin = async (payload) => {
    socket.data = payload;
    console.log(`user: ${payload.first_name} ${payload.last_name} login`);
    socket.join("logged-in");
    const clients = await io.in("logged-in").fetchSockets();

    const clientsData = clients.map((client) => client.data);

    io.to("logged-in").emit("user:active", clientsData);
  };
  const handleUserLogout = async (payload) => {
    console.log(`user: ${payload.first_name} ${payload.last_name} logout`);
    socket.leave("logged-in");
    const clients = await io.in("logged-in").fetchSockets();
    const clientsData = clients.map((client) => client.data);

    io.to("logged-in").emit("user:active", clientsData);
  };

  const readOrder = (orderId, callback) => {
    // ...
  };

  socket.on("user:login", handleUserLogin);
  socket.on("user:logout", handleUserLogout);
};
