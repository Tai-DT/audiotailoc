"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class CustomIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        return server;
    }
}
exports.CustomIoAdapter = CustomIoAdapter;
//# sourceMappingURL=custom-io.adapter.js.map