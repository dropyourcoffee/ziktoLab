
let isScan;
let conns = [];

$( document ).ready(function() {

  $("#btn_scan")[0].addEventListener("click", ajaxScan);
});

$(document).on('click','.btn_conn',function(){
  $('.status').html("Connecting " + $("div.peri_scan")[this.id].innerText + "...");
  $.get("http://localhost:3001/conn", {connId:this.id}, function(data){

    renderPeripherals(data);
    if(data.connList) connSync(data.connList);

  });

});

$(document).on('click','.btn_sendCmd',function(){

  let periId = $(this).attr('periid');
  $.get("http://localhost:3001/command", {periId, cmd:$(this).text()} ,function(data, status) {
    console.log(data);
  });
  if($(this).text() === "startSampling"){
    conns[periId].is_sampling = true;
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
  $.get("http://localhost:3001/scan", {scan:isScan} ,function(data, status){

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
    data.scanList.forEach((p)=>{
      content += "<div class='peri_scan' id=" + i + "><button class= 'btn_conn' id=" + (i++) + " '>"+ p.advertisement.localName + " " + p.address + "</button></div>";
    });
    $('#scanList').html(content);
  }

  if(data.connList){
    content = "";
    i = -1;
    data.connList.forEach((p)=>{
      if(p.peripheral.localName === "Zikto-walk"){
        content += "<div class='peri_conn' id=" + (++i) + ">" + p.peripheral.localName;
        j=0;
        p.cmds.forEach(c=>{
          content += "<button class='btn_sendCmd' periid="+ i +" cmdid="+ (j++) +">"+ c +"</button>";
        });
        content+="<br><br><div class='sensorData'></div>";
        content += "</div>";
      }else{
        content += "<div class='peri_conn' id=" + (++i) + ">" + p.peripheral.localName + "</div>";
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
  $.get("http://localhost:3001/data", {connId} ,function(data, status){

    $($(".peri_conn")[0].children[5]).html(JSON.stringify(data));
    if(conns[connId].is_sampling) setTimeout(()=>sampleData(connId), 100);
  });


};
