const firebaseConfig = {
    apiKey: "AIzaSyAQQsaYnySLKVssnzus-D42eN9vBbgSK1Y",
    authDomain: "zeropass-24ac5.firebaseapp.com",
    databaseURL: "https://zeropass-24ac5.firebaseio.com",
    projectId: "zeropass-24ac5",
    storageBucket: "zeropass-24ac5.appspot.com",
    messagingSenderId: "204385607719",
    appId: "1:204385607719:web:2aff6af67468d14ed46e02",
    measurementId: "G-LWGMWWY0JX"
  };

const dstname=document.getElementById("district").value;
const taluk=document.getElementById("taluk").value;

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
var dataSet=[];
db.ref(`Regions/${dstname}/${taluk}/Complaints`).once('value')
.then(function(snapshot) {  
  snapshot.forEach(function(child) {
    db.ref(`Regions/${dstname}/${taluk}/Users/${child.key}`).once("value")
    .then((snap)=>{
      dataSet.push([snap.val().Name,snap.val().Address,snap.val().Mob,snap.val().AadharID,child.numChildren()-1,`<form id=${snap.val().Mob} onsubmit="mapfunction()"><input name="token" type="text" value=${snap.val().Mob} style="display: none;"/><input type="submit" name="button" value="view complaints" class="map-btn"/></form>`]);          
    });
  })  
  setTimeout(table,1000);  
});
function table(){
  $('#dataTable').DataTable({data: dataSet,destroy: true,dom: 'lBfrtip',buttons: ['excelHtml5']   
  });
}

function mapfunction() {
    event.preventDefault();
    const form = event.currentTarget;
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("map-close")[0];
    modal.style.display = "block";
    span.onclick = function() {
    modal.style.display = "none";
    }
    var table = document.querySelector('#complainttable tbody');
    while(table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    var DbData=db.ref(`Regions/${dstname}/${taluk}/Complaints`).orderByChild("Mob").equalTo(form.token.value);
    DbData.once("value",snap=>{
      var test=snap.val();
      for (var key in test) {
        console.log(key);
      for(var key2 in test[key]){

        if(!test[key][key2].Complaint)
          continue;

        var row = table.insertRow(-1);
        cell = row.insertCell(-1);
        cell.innerHTML = test[key][key2].Complaint;
        cell = row.insertCell(-1);
        cell.innerHTML = test[key][key2].Time;
      }    
    } 
   });
}
