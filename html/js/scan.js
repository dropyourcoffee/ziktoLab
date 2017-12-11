
let isScan;

$( document ).ready(function() {

  $("#btn_scan")[0].addEventListener("click", ajaxScan);
  //checkConnList(); // Need to poll connected list of devices
});

$(document).on('click','.btn_conn',function(){
  console.log(this.id);
  $.get("http://localhost:3001/conn", function(data){

    let content = "";
    data.connList.forEach((p)=>{
      content += p.localName;
    });
    $('.connList').html(content);

    setTimeout(checkConnList, 1000);
  });

});

function ajaxScan(){

  isScan = !isScan;
  $("#btn_scan").html((isScan)? "Stop Scan" : "Scan");
  doScan();

};


function doScan(){
  $.get("http://localhost:3001/scan", {scan:isScan?true:false} ,function(data, status){
    $('.status').html(data.status);

    let content = "";
    let i = 0;
    data.scanList.forEach((p)=>{
      content += p.localName + "<button class= 'btn_conn' id=" + (i++) + " '>Connect</button><br>";
      $("btn_conn"+i).click(function(){
        console.log(this.id);
      })
    });
    $('.scanList').html(content);

    //console.log(JSON.stringify(data.scanList));
    if($("#btn_scan").html()==="Stop Scan") setTimeout(doScan, 1000);
  });
};


/*function checkConnList(){

  $.get("http://localhost:3001/conn", function(data){

    let content = "";
    data.connList.forEach((p)=>{
      content += p.localName;
    });
    $('.connList').html(content);

    setTimeout(checkConnList, 1000);
  });


}*/

