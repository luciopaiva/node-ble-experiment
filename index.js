
const noble = require('@abandonware/noble');

noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
        await noble.startScanningAsync([], true);
    }
});

const deviceNameRegex = new RegExp(process.argv[2] ?? '.*', 'i');

noble.on('discover', async (peripheral) => {
    const name = peripheral.advertisement.localName ? `${peripheral.advertisement.localName} (${peripheral.id})` : peripheral.id;
    if (deviceNameRegex.test(name)) {
        const serviceUuids = (peripheral.advertisement.serviceUuids ?? []).join(', ');
        const manufacturerData = peripheral.advertisement.manufacturerData?.toString('hex');
        const serviceData = peripheral.advertisement.serviceData?.map(({ uuid, data }) => `    ${uuid}: ${data.toString('hex')}`).join("\n");
        console.info(name);
        console.info("  Service UUIDs:", serviceUuids);
        console.info("  Manufacturer Data:", manufacturerData);
        console.info("  Service Data:");
        console.info(serviceData);
    }
});
