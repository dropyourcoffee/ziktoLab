
let isScan;

$( document ).ready(function() {

  $("#btn_scan")[0].addEventListener("click", ajaxScan);
});

$(document).on('click','.btn_conn',function(){
  $('.status').html("Connecting " + $("div.peri_scan")[this.id].innerText + "...");
  $.get("http://localhost:3001/conn", {connId:this.id}, function(data){

    renderPeripherals(data);

  });

});

function ajaxScan(){

  isScan = !isScan;
  $("#btn_scan").html((isScan)? "Stop Scan" : "Scan");
  doScan();

};


function doScan(){
  $.get("http://localhost:3001/scan", {scan:isScan} ,function(data, status){

    renderPeripherals(data);
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
    i = 0;
    data.connList.forEach((p)=>{
      if(p.peripheral.localName === "Zikto-walk"){
        content += "<div class='peri_conn' id=" + (i++) + ">" + p.peripheral.localName + "<button>Find Me</button><button>Start Gait</button>" + "</div>";
      }else{
        content += "<div class='peri_conn' id=" + (i++) + ">" + p.peripheral.localName + "</div>";
      }
    });
    $('#connList').html(content);
  }
}


