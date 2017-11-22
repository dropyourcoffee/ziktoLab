const noble = require('noble');
const Promise = require('promise');
exports_ = module.exports = {};

exports_.Connect = (peripheral) => {
	return new Promise((resolve,reject)=>{
		console.log("connected");
		peripheral.connect((err)=>{
			
			if(err) reject(err);
			else    resolve(peripheral);

			return;
		});
	});
}

exports_.DiscoverServices = (peripheral)=> {
	console.log("Finding Services...");

	return new Promise((resolve,reject)=>{
		peripheral.discoverServices([],(err,services)=>{
			
			if(err) reject(err);
			else    resolve(services);

			return;

		});
	});
};

exports_.DiscoverLayer  = (peripheral)=>{
	console.log("Find SErvices and Characteristics...");

	return new Promise((resolve,reject)=>{
		peripheral.discoverAllServicesAndCharacteristics((err,services,characteristics)=>{
			if(err) reject(err);
			else{
				services.forEach(s=>{
					console.log(s);
				});
				characteristics.forEach(c=>{
					console.log(c);
				});
			}
			return;
		});
	});
};

exports_.DiscoverCharacteristicsByPeripheral = (peripheral)=>{
	console.log("Discovering Characteristics(p)...");

	return new Promise((resolve,reject)=>{
		peripheral.discoverAllServicesAndCharacteristics((err,services,characteristics)=>{

			if(err) reject(err);
			else    {
				resolve(characteristics);
			}

			return;
		});
	});
};

exports_.DiscoverCharacteristicsByService = (service)=>{
  console.log("Discovering Characteristics(s)...");

  return new Promise((resolve,reject)=>{
    service.discoverCharacteristics(null,(err,characteristics)=>{

      if(err) reject(err);
      else    {
        resolve(characteristics);
      }

      return;
    });
  });
};

