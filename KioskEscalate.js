import xapi from 'xapi';

var deviceId;

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
  if(event.PanelId == 'escalateQantas'){
    xapi.command("UserInterface WebView Display", {Title: "Options", Url: "https://talk2spark.com/qantasKiosk/index.html?deviceId=" + deviceId})
  }else if(event.PanelId == 'escalateNrmaEn'){
    xapi.command("UserInterface WebView Display", {Title: "Options", Url: "https://talk2spark.com/iagKiosk/index.html?deviceId=" + deviceId})
  }else if(event.PanelId == 'escalateNrmaVn'){
    xapi.command("UserInterface WebView Display", {Title: "Options", Url: "https://talk2spark.com/iagKiosk/indexVn.html?deviceId=" + deviceId})
  }else if(event.PanelId == 'escalateWestpacEn'){
    xapi.command("UserInterface WebView Display", {Title: "Options", Url: "https://talk2spark.com/westpacKiosk/index.html?deviceId=" + deviceId})
  }else if(event.PanelId == 'escalateWestpacCn'){
    xapi.command("UserInterface WebView Display", {Title: "Options", Url: "https://talk2spark.com/westpacKiosk/indexCn.html?deviceId=" + deviceId})
  }else if(event.PanelId == 'escalateWestpacVn'){
    xapi.command("UserInterface WebView Display", {Title: "Options", Url: "https://talk2spark.com/westpacKiosk/indexVn.html?deviceId=" + deviceId})
  }else if(event.PanelId == 'escalateWestpacGr'){
    xapi.command("UserInterface WebView Display", {Title: "Options", Url: "https://talk2spark.com/westpacKiosk/indexGr.html?deviceId=" + deviceId})
  }else if(event.PanelId == 'hangupBtn'){
    xapi.command("call Disconnect");
  }
});

// Prevent audio volume from changing (also noise removal, mute, external things, also power off, etc)
// https://github.com/alvulovi/VideoKiosk/blob/main/VideoKiosk.js 

function init(){
  xapi.status.get('SystemUnit Hardware Module SerialNumber').then ((value) => {
    console.log("Serial Number: " + value);
    getDevice(value);
  })
}


function getDevice(serialNumber){
  // Need to get deviceId  ** USING TEMP TOKEN RIGHT NOW (need to change to BOT) **
  const TOKEN = "<insert Token>";
  const BEARERTOKEN = "Authorization: Bearer " + TOKEN;
  const WEBEXDEVICEURL = 'https://webexapis.com/v1/devices?serial=' + serialNumber; 
  const CONTENT_TYPE = "Content-Type: application/json";
  
  xapi.command('HttpClient Get', { 'Header': [CONTENT_TYPE, BEARERTOKEN] , 'Url':WEBEXDEVICEURL, 'AllowInsecureHTTPS': 'True'})
  .then(
    (result) => {
       //if (response.StatusCode == 200) {
      var code = result.StatusCode;
      console.log("code: " + code);
      var body = result.Body;
      var totalItems = JSON.parse(body).items.length
      if(totalItems > 0){
        deviceId =  JSON.parse(body).items[0].id;
        console.log("id: " + deviceId);
      }else{
        console.log("Error: Unable to find deviceId from serial number: " + serialNumber);
      }

    }
  );
}

init();
