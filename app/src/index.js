const express = require('express');
const os = require('os');
const app = express();
const port = 8080;

const getIps = () => {
    const filterIpV4 = (addresses) => addresses.filter(address => address.internal === false && address.family === 'IPv4');
    const interfaces = os.networkInterfaces();

    return Object
        .keys(interfaces)
        .reduce((result, ifName) => {
            const addresses = interfaces[ifName];

            return result.concat(filterIpV4(addresses))
        }, [])
        .map((address) => address.address);
};

app.get('/', (req, res) => res.send('It works!'));
app.get('/actuator/health', (req, res) => res.send('UP'));
app.get('/crash', (req, res) => {
    res.send('ok');
    console.error('error');
    process.exit(1);
});
app.get('/info', (req, res) => {
    res.send({
        hostname: os.hostname(),
        addresses: getIps()
    })
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log(`http://localhost:${port}/actuator/health`);
    console.log(`http://localhost:${port}/crash`);
    console.log(`http://localhost:${port}/info`);
});
