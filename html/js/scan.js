/*document.querySelector('.ajaxsend').addEventListener('click', function(){
  // 입력값 위치를 찾아 변수에 담고
  var inputdata = document.forms[0].elements[0].value;
  // sendAjax 함수를 만들고 URL과 data를 전달
  sendAjax('http://127.0.0.1:3000/ajax_send_email', inputdata)
})*/
$( document ).ready(function() {

  $('.ajaxsend')[0].addEventListener('click', ajaxScan);

});

function ajaxScan(){
  $.get("http://localhost:3001/scan", function(data, status){
    $('.status').html(data.status);

    let content = "";
    data.scanList.forEach((p)=>{
      content += p.localName + "<button>Connect</button><br>";
    });
    console.log(content);
    $('.scanList').html(content);

    //console.log(JSON.stringify(data.scanList));
    setTimeout(ajaxScan, 1000);
  });
};


