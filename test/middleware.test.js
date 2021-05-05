let ConnManager = require("../app/middleware2/mock");

let bleMaster, bleMaster2;

test("connManager spec", async ()=>{
  bleMaster = ConnManager.init();

  /**
   * Start scanning and wait..
   * Wait time must be less than 1000; since ConnManager is singleton object.
   * Must leave room for test("connManager onDiscover") to discover new peripherals (max 5).
   * */

  bleMaster.scan();
  await new Promise(resolve => setTimeout(resolve, 800)); // Should be less than 1000.  200(ms) * 5 periphs

  let connectableDevices = bleMaster.getScannedPeripherals();
  let localnames = connectableDevices.map(dev=>dev.advertisement.localName);

  expect(localnames).toEqual(expect.arrayContaining(["Zikto-walk"]));


});

test("connManager has no self-constructor", ()=>{

  function f(){
    ConnManager();
  }
  expect(f).toThrow(TypeError);

});

test("connManager is singleton", ()=>{
  bleMaster = ConnManager.init();
  bleMaster2 = ConnManager.init();
  expect((bleMaster)).toBe(bleMaster2)

});

test("connManager onDiscover", async ()=>{

  const cb = jest.fn();
  bleMaster.scan(cb);
  await new Promise(resolve => setTimeout(resolve, 400)); // Should be less than 1000.  200(ms) * 5 periphs

  expect(cb).toHaveBeenCalled();

});


test("no conns before connect been called", async ()=>{

  /* Case 1.*/
  let conns = bleMaster.getConnectedDevices();
  expect(conns.length).toEqual(0);

});

test("Conns after connect has been called", async ()=>{
  const ConnectedDevice = require("../app/middleware2/device/base");

  await new Promise(resolve => setTimeout(resolve, 800)); // Should be less than 1000.  200(ms) * 5 periphs
  let periphs = bleMaster.getScannedPeripherals();
  periphs.length/*?*/
  let connectableTarget = periphs
    .filter(p=>p.connectable)
    .filter(p=>(p.advertisement.localName && p.advertisement.localName.includes("Zikto")))[0]/*?*/


  /* Case 1.*/
  connectableTarget.connect()
    .then((device)=>{
      expect(device).toBeInstanceOf(ConnectedDevice);

      conns = bleMaster.getConnectedDevices();
      expect(conns.length).toBeGreaterThan(0);
    });

});

// test("No services detected before init", async ()=>{
//
//   let bleMaster = ConnManager.init();
//
//   let dev = bleMaster.getConnectedDevices()[0];
//
//   expect(dev.services).toBeFalsy();
//
//   dev.services.forEach(svc=>{
//     expect(svc).toBeFalsy();
//   });
//
//
//
// });
//
// test("Services detected after init", async ()=>{
//
//   let dev = bleMaster.getConnectedDevices()[0];
//   dev.init();
//
//   expect(dev.services).toBeTruthy();
//
//   dev.services.forEach(svc=>{
//     expect(svc).toBeTruthy();
//   });
//
// });
//
//
// test("Services detected after init", async ()=>{
//
//   let dev = bleMaster.getConnectedDevices()[0];
//   dev.init();
//
//   expect(dev.services).toBeTruthy();
//
//   dev.services.forEach(svc=>{
//     expect(svc).toBeTruthy();
//   });
//
// });
