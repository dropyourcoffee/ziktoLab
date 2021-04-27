
let isScan;
let conns = [];
let rawDataCollection = {
  accelx:[], accely:[], accelz:[],
  gyrox:[], gyroy:[], gyroz:[],
};
let shift = 0;

$( document ).ready(function() {

  $("#btn_scan")[0].addEventListener("click", ajaxScan);
});

$(document).on('click','.btn_conn',function(){
  $('.status').html("Connecting " + $("div.peri_scan")[this.id].innerText + "...");
  $.get("/conn", {connId:this.id}, function(data){

    renderPeripherals(data);
    if(data.connList) connSync(data.connList);

  });

});

$(document).on('click','.btn_sendCmd',function(){

  let periId = $(this).attr('periid');
  $.get("/command", {periId, cmd:$(this).text()} ,function(data, status) {
    console.log(data);
  });
  if($(this).text() === "startSampling"){
    conns[periId].is_sampling = true;
    rawDataCollection.accelx = [];
    shift=0;
    sampleData(periId);
  }
  if($(this).text() === "stopSampling"){
    conns[periId].is_sampling = false;
  }


});

function ajaxScan(){

  isScan = !isScan;
  $("#btn_scan").html((isScan)? "Stop Scan" : "Scan");
  doScan();

};


function doScan(){
  $.get("/scan", {scan:isScan} ,function(data, status){

    renderPeripherals(data);
    if(data.connList) connSync(data.connList);
    if($("#btn_scan").html()==="Stop Scan") setTimeout(doScan, 1000);

  });
};

function renderPeripherals(data){
  if(data.status) $('.status').html(data.status);

  let content = "";
  let i = 0;

  if(data.scanList){
    data.scanList.forEach((p,ii)=>{
      content += "<div class='peri_scan' id=" + i + ">" +
                    "<button class= 'btn-primary btn_conn' id=" + (i++) + " '>"+ p.advertisement.localName + " " + p.address + "</button>"+
                 "</div>";
    });
    $('#scanList').html(content);
  }

  if(data.connList){
    content = "";
    data.connList.forEach((p,ii)=>{
      if(p.peripheral.localName === "Zikto-walk"){
        content += "<div class='peri_conn peri_conn"+ ii + "' id=" + ii + ">" + p.peripheral.localName+"<br><div class='btn-group'>";
        p.cmds.forEach((c,j)=>{
          content += "<button class='btn btn-primary btn_sendCmd' periid="+ ii +" cmdid="+ j +">"+ c +"</button>";
        });
        content+="</div><br><br><div class='sensorData big-chart' id='chart"+ii+"'></div>";
        content += "</div>";
      }else{
        content += "<div class='peri_conn' id=" + ii + ">" + p.peripheral.localName + "</div>";
      }
    });
    $('#connList').html(content);
  }
};

function connSync(connList){

  conns = [];
  connList.forEach((p)=>{

    conns.push({name:p.peripheral.localName, is_sampling:"false"});

  });
}

function sampleData(connId){
  $.get("/data", {connId} ,function(data, status){

    for(d in data){
      if(d.includes("accel")) rawDataCollection[d].push(data[d]);
    }

    let res =[];
    let window = 20; // This should be somewhere in config.

    if(rawDataCollection.accelx.length > window){
      shift = rawDataCollection.accelx.length-window;
      for (rd in rawDataCollection){
        let tmp = rawDataCollection[rd].slice(-window);
        res.push(tmp.map((el,i)=>[i+shift,el]));
      }
    }else{
      for (rd in rawDataCollection){
        res.push(rawDataCollection[rd].map((el,i)=>[i+shift,el]));
      }
    }

    let plot = $.plot("#chart0",res,{
      yaxis:{min:-40, max:40},
      xaxis:{min:shift, show:true},
    });
    plot.setData(res);
    plot.draw();

    if(conns[connId].is_sampling) setTimeout(()=>sampleData(connId), 100);
  });


};
