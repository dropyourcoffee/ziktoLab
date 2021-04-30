let ConnManager = require("../app/middleware/mock");

test("connManager spec", async ()=>{
  let bleMaster = ConnManager.init();

  /**
   * Start scanning and wait..
   * Wait time must be less than 1000; since ConnManager is singleton object.
   * Must leave room for test("connManager onDiscover") to discover new peripherals (max 5).
   * */
  bleMaster.scan();
  await new Promise(resolve => setTimeout(resolve, 500)); // Should be less than 1000.  200(ms) * 5 periphs

  let connectableDevices = bleMaster.getScannedPeripherals();

  let localnames = connectableDevices.map(dev=>dev.advertisement.localName);
  // expect(localnames.includes("Zikto-walk")).toBe(true);
  expect(localnames).toEqual(expect.arrayContaining(["Zikto-walk"]));

});

test("connManager has no self-constructor", ()=>{

  function f(){
    ConnManager();
  }
  expect(f).toThrow(TypeError);

});

test("connManager is singleton", ()=>{
  let bleMaster = ConnManager.init();
  let bleMaster2 = ConnManager.init();
  expect((bleMaster === bleMaster2)).toBe(true)

});

test("connManager onDiscover", async ()=>{
  let bleMaster = ConnManager.init();
  const discovered= ()=>{
    if(!discovered.cnt)
      discovered.cnt = 1;
    else
      discovered.cnt++;
  }
  const discovered2 = jest.fn(discovered);
  bleMaster.scan(discovered2);

  await new Promise(resolve => setTimeout(resolve, 1200));
  expect(discovered2).toHaveBeenCalled();

});
