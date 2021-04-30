module.exports = {
  before: config=>{

    global.jest = require("jest-mock");

    global.test = (desc, runner) =>{
      runner();
    };

    let errObj;

    global.expect = expObj => {

      global.expect.arrayContaining = (toObj) => {
        return{
          determine: (toObj) => {
            return (toObj.every(to => expObj.includes(to) ))
          },
          err: (toObj) => Error(`Expected value to equal:\n ArrayContaining ${JSON.stringify(toObj, null)}\nReceived:\n ${JSON.stringify(expObj, null)}`),
          noterr: (toObj) => Error(`Expected value not to equal:\n ArrayContaining ${JSON.stringify(toObj, null)}\nReceived:\n ${JSON.stringify(expObj, null)}`),
          self: toObj
        }

      };


      const _toBe = {
        determine: (toObj) => !!(expObj === toObj),
        err: (toObj) => Error(`Expected:\n ${JSON.stringify(toObj, null)}\n Received:\n ${JSON.stringify(expObj, null)}`),
        noterr: (toObj) => Error(`Expected:\n ${JSON.stringify(toObj, null)}\nReceived:\n ${JSON.stringify(expObj, null)}`)
      };
      const _toEqual = {
        determine: (toObj) => !!(expObj == toObj),
        err: (toObj) => Error(`Expected value to equal:\n ${JSON.stringify(toObj, null)}\nReceived:\n ${JSON.stringify(expObj, null)}`),
        noterr: (toObj) => Error(`Expected value not to equal:\n ${JSON.stringify(toObj, null)}\nReceived:\n ${JSON.stringify(expObj, null)}`)

      };

      const _toThrow = {
        determine: toObj=> {
          if (typeof expObj !== "function")
            throw Error(`Received value must be a function, but instead "${typeof expObj}" was found`);

          try {
            expObj();
          } catch (e) {
            errObj = e;
            return !!(e instanceof toObj);
          }
          return false;
        },
        err: (toObj, e) => {
          return Error(`Expected the function to throw an error of type:\n "${toObj.nam}"\nInstead, it threw:\n ${errObj}`)
        },
        noterr: (toObj, e) => {
          return Error(`Expected the function not to throw an error of type:\n "${toObj.name}"\nInstead, it threw:\n ${errObj}`)
        }
      };

      const _toHaveBeenCalled = {
        determine: (expObj) => !!(expObj.mock.calls.length),
        err: (_) =>
          Error(`Expected mock function to have been called.`),
        noterr: () =>
          Error(`Expected mock function not to be called but it was called with:\n${JSON.stringify(expObj.mock.calls[1], null)}`)
      };


      return{
        toBe: (toObj)=>{
          if (!_toBe.determine(toObj))
            throw _toBe.err(toObj)
        },
        toEqual: (toObj)=>{
          if (toObj.determine){
            if (!toObj.determine(toObj.self))
              throw toObj.err(toObj.self)
          }
          else if (!_toEqual.determine(toObj))
            throw _toEqual.err(toObj)
        },

        toThrow: (toObj)=>{
          if (!_toThrow.determine(toObj)){
            throw _toThrow.err(toObj)
          }
        },
        toHaveBeenCalled: (_)=>{
          if (!_toHaveBeenCalled.determine(expObj)){
            throw _toHaveBeenCalled.err()
          }
        },


        not:{
          toBe: (toObj)=>{
            if (_toBe.determine(toObj)){
              throw _toBe.noterr(expObj, toObj)
            }
          },
          toEqual: (toObj)=>{
            console.log(toObj.determine(toObj.self))
            if (toObj.determine){
              if (toObj.determine(toObj.self))
                throw toObj.noterr(toObj.self)
            }
            else if (_toEqual.determine(toObj))
              throw _toEqual.err(toObj)
          },
          toThrow: (toObj)=>{
            if (_toThrow.determine(toObj))
              throw _toThrow.noterr(toObj)
          },
          toHaveBeenCalled: ()=>{
            if (_toHaveBeenCalled.determine(expObj))
              throw _toHaveBeenCalled.noterr()
          }

        }


      }


    };

  },



};
