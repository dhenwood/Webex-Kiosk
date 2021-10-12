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

// Additional controls such preventing changing audio volume/mute/etc may also wish to be performed.

function init(){
  xapi.status.get('SystemUnit Hardware Module SerialNumber').then ((value) => {
    console.log("Serial Number: " + value);
    getDevice(value);
  })
}


function getDevice(serialNumber){
  /*
  Need to get deviceId from serial number
  
  Whilst a token can be created a number of different ways, for the purposes of this, a BOT token is probably best suited.
  This can be done by following the instructions at https://developer.webex.com/docs/bots
  Once created, save the BOT token and paste it into the following line.
  Furthermore, from Webex Control Hub for the device(s), associate the BOT to the devices you which to perform this on.
  */
  
  const TOKEN = "<insert Token>";
  const BEARERTOKEN = "Authorization: Bearer " + TOKEN;
  const WEBEXDEVICEURL = 'https://webexapis.com/v1/devices?serial=' + serialNumber; 
  const CONTENT_TYPE = "Content-Type: application/json";
  
  xapi.command('HttpClient Get', { 'Header': [CONTENT_TYPE, BEARERTOKEN] , 'Url':WEBEXDEVICEURL, 'AllowInsecureHTTPS': 'True'})
  .then(
    (result) => {
      //if (response.StatusCode == 200) {
      //var code = result.StatusCode;
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
