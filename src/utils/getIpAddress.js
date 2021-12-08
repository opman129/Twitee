const os = require('os');

exports.getIpAddress = () => {
    const interfaces = os.networkInterfaces();

    for(const key in interfaces) {
        const iface = interfaces[key];
        if (iface) {
            for (i = 0; i < iface?.length; i++) {
                const alias = iface[i];
                if (alias?.family === 'IPv4' && alias?.address !== '127.0.0.1' && !alias?.internal) {
                    return alias?.address;
                };
            };
        };
    };
};