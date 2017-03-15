var noble = require('noble')

noble.on('stateChange', function(state){
     if (state === 'poweredOn') {
        noble.startScanning();
      } else {
        console.log('Please power on the Bluetooth Adapter');
      }
});

