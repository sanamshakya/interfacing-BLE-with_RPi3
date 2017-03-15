var noble = require('noble')

noble.on('stateChange', function(state){
     if (state === 'poweredOn') {
        noble.startScanning();
      } else {
        console.log('Please power on the Bluetooth Adapter');
      }
});

noble.on('discover', function(peripheral) {

      var localName = peripheral.advertisement.localName;

    // find SensorTag based on local name
       if (localName && localName.match(/WICED/)) {
           noble.stopScanning();
               console.log('Attempting to connect to ' + localName);
               connectAndSetUpSensorTag(peripheral);
        }    
    var advertisement = peripheral.advertisement;

    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;

    if (localName) {
      console.log('  Local Name        = ' + localName);
    }

    if (txPowerLevel) {
      console.log('  TX Power Level    = ' + txPowerLevel);
    }

    if (manufacturerData) {
      console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
    }

    if (serviceData) {
      console.log('  Service Data      = ' + serviceData);
    }

    if (serviceUuids) {
      console.log('  Service UUIDs     = ' + serviceUuids);
    }

    console.log();

});

function connectAndSetUpSensorTag(peripheral) {

    peripheral.connect(function(error) {
       console.log('Connected to ' + peripheral.advertisement.localName);
       if (error) {
          console.log('There was an error connecting ' + error);
          return;
       }

var serviceUUIDs = ['739298b687b64984a5dcbdc18b068985'];
var characteristicUUIDs = ['33ef91133b55413eb553fea1eaada459'];

peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
    });
  // attach disconnect handler
    peripheral.once('disconnect', onDisconnect);
}

function onDisconnect() {
     console.log('Peripheral disconnected!');
     noble.startScanning();
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {

        if (error) {
            console.log('Error discovering services and characteristics ' + error);
            return;
        }

        var characteristic = characteristics[0];

        // subscribe for notifications
        characteristic.notify(true);
        
        // called when notification state changes
        characteristic.on('notify', function(isNotifying) {
              if (isNotifying) {
              console.log('SensorTag remote is ready');
              }
         });
  // called when the data changes
  characteristic.on('data', onCharacteristicData);
}

function onCharacteristicData(data, isNotification) {
        console.log(data);
}
