import xapi from 'xapi';

var panelId;

xapi.event.on('UserInterface Extensions Widget Action', (event) => {
    if(event.WidgetId == 'kioskModeSelect'){
      if(event.Type == 'pressed'){
        if (event.Value == 'qantas'){
          panelId = "escalateQantas";
          toggleKiosk(true);
          var url = "https://www.employees.org/~dhenwood/WbxWallpaper/qantasKioskWallpaper.zip";
          updateWallpaper("Qantas", url);
        }else if (event.Value == 'nrma'){
          panelId = "escalateNrma";
          toggleKiosk(true);
          var url = "https://www.employees.org/~dhenwood/WbxWallpaper/nrmaKiosk.zip";
          updateWallpaper("NRMA", url);
        }else if (event.Value == 'westpac'){
          panelId = "escalateWestpac";
          toggleKiosk(true);
          var url = "https://www.employees.org/~dhenwood/WbxWallpaper/westpacKiosk.zip";
          updateWallpaper("Westpac", url);
        }
      }
    }else if(event.WidgetId == 'kioskModeCancel'){
      if(event.Type == 'pressed'){
        panelId = "cancelKiosk";
        toggleKiosk(false);
        xapi.command("UserInterface Branding Clear");
      }
    }
});

// Hidden return to normal trigger
xapi.event.on('Audio Volume AlreadyAtLimit', () => {
  panelId = "cancelKiosk";
  toggleKiosk(false);
  xapi.command("UserInterface Branding Clear");
});


function toggleKiosk(toggleState){
  console.log("toggleState: " + toggleState);
  var toggleNameBool, toggleNameString, toggleNameOpposite;
  if (toggleState == true){
    toggleNameBool = "True";
    toggleNameString = "Hidden";
    toggleNameOpposite = "Auto";
  }else if (toggleState == false){
    toggleNameBool = "False"
    toggleNameString = "Auto";
    toggleNameOpposite = "Hidden";
  }

  xapi.config.set("UserInterface Features HideAll",toggleNameBool);
  xapi.config.set("UserInterface SettingsMenu Visibility",toggleNameString);  
  xapi.command("UserInterface Extensions Panel Update", {PanelId: "kioskModePage", Visibility: toggleNameString})
  

  xapi.command('UserInterface Extensions List')
  .then((response) => {
    const panelList = response.Extensions.Panel;
    panelList.forEach(checkPanelId);
  });
}

function checkPanelId(item){
  const eachPanelId = item.PanelId
  if(panelId == eachPanelId){
    xapi.command("UserInterface Extensions Panel Update", {PanelId: eachPanelId, Visibility: "Auto"})
  }else if (panelId == "cancelKiosk"){
    xapi.command("UserInterface Extensions Panel Update", {PanelId: eachPanelId, Visibility: "Auto"})
    const panelStartsWithEscalate = eachPanelId.startsWith("escalate");
    if (panelStartsWithEscalate == true){
      xapi.command("UserInterface Extensions Panel Remove", {PanelId: eachPanelId})
    }
  }
}


function updateWallpaper(company, url){
  xapi.command("Provisioning Service Fetch", {URL: url})
  xapi.command("UserInterface Extensions Panel Close")
  xapi.command("UserInterface Message Alert Display", {
    Title: 'Updating Kiosk'
    , Text:  'Loading ' + company + ' configuration...'
    , Duration: 10
  }).catch((error) => { console.error(error); })
}
