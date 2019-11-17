const express = require('express');
const os = require('os');
const app = express();
const port = 8080;
const fs = require('fs');
const yaml = require('yaml');
const fetch = require('node-fetch');

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

app.get('/foo', (req, res) => {
    return res.send('foo');
});

app.get('/bar', (req, res) => {
    return res.send('bar');
});

app.get('/config', (req, res) => {
    const config = yaml.parse(fs.readFileSync(__dirname + '/application.yaml').toString());

    return res.send(config);
});

app.get('/ask', (req, res) => {
    const config = yaml.parse(fs.readFileSync(__dirname + '/application.yaml').toString());

    fetch(config.url).then(result => {
        
        return result.text();
    }).then(data => {
        res.send(data);
    }).catch(err => {
        console.log(err);
        res.send(err.message);
    });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log(`http://localhost:${port}/actuator/health`);
    console.log(`http://localhost:${port}/crash`);
    console.log(`http://localhost:${port}/info`);
});
