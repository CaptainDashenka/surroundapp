// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
   navigator.splashscreen.hide();

    // check for storage funcionality and already existing access tokens
    if (checkStorage) {
    var sToken = window.localStorage.getItem("WBtoken");
    if (sToken != null) {
        // check token
        var sAPICall = 'https://api.weibo.com/oauth2/get_token_info?access_token=' + sToken;
        $.ajax({
            type: 'POST',   
            url: sAPICall,
            success: function (data) {
                app.navigate('home.html');
             }
        });
    }}
}


//=================== Logon to Weibo ( page 2 ) Operations =====================//
function callWBlogin() {
    var resultMessageElem = document.getElementById('result');

 /*     */  
    closeWBlogin('http://www.surroundapp.asia/postlogin.html#access_token=2.002M91_DwMN8HCef97eb8c5c2KdMQC&remind_in=6345654254&expires_in=250327040&refresh_token=REFRESH_TOKEN');
    return;
 
    objWP = window.plugins;
    var navUri = 'https://api.weibo.com/oauth2/authorize?client_id=1942185646&response_type=token&redirect_uri=http://www.surroundapp.asia/postlogin.html&display=mobile';
    if(objWP != null) {
        objWP.childBrowser.showWebPage(navUri,{ showLocationBar: false });
        objWP.childBrowser.onLocationChange = closeWBlogin;
    }
    else
       resultMessageElem.innerHTML = 'plugins is null';
    //resultMessageElem.innerHTML += ' hello2';
}

function closeWBlogin(redirUrl) {
       
    if (redirUrl.indexOf("redirect_uri") == -1 && redirUrl.indexOf("surroundapp.asia") >= 0) {
        var resultMessageElem = document.getElementById('result');
        //window.plugins.childBrowser.close();
        
        // finding the parameters
        var arrMatches = redirUrl.match(/access_token=([0-9a-zA-Z.=_]*)?/);
        //resultMessageElem.innerHTML = "**";
       
        if (arrMatches != null) {
             resultMessageElem.innerHTML = "url: " + redirUrl + " access token: " + arrMatches[1] ;
             console.log(arrMatches[1]);
             window.localStorage.setItem("WBtoken",arrMatches[1]);
             app.navigate('home.html');
        }
        else
        resultMessageElem.innerHTML = "access token not found";
    }
}

function showAccessToken(e) {
    
    var tokenMessageElem = document.getElementById('tokenDisplay');
    var sToken = window.localStorage.getItem("WBtoken");
    tokenMessageElem.innerHTML += sToken; 
}

//=================== Time line data feed =========================//
    
   var dataSource = new kendo.data.DataSource({
       transport: {
           read: {
               url:"https://api.weibo.com/2/statuses/friends_timeline.json",
               dataType: "odata", //jsonp
               data: {
                   access_token: window.localStorage.getItem("WBtoken"),
                   page:1,
                   count:20 
                }
           },
           error: function(e) {
                console.log(e.status);
           }
       },
       schema: {
           data: function(response) {
               return response.data.statuses;
           },
           errors: function(response) {
               // console.log(e.status);
               return response.errors;
           }
       }
   });
   
  
function viewInit(e){
    console.log('viewinit called');
    console.log( window.localStorage.getItem("WBtoken"));
      $("#statusListView").kendoMobileListView({
      dataSource: dataSource,
      pullToRefresh: true,
      template: $("#status-template").html()
      });
    console.log('viewinit ended');
    }
  
   
   $("#statusListView").kendoMobileListView({
       dataSource: dataSource,
       //pullToRefresh: true,
       //appendOnRefresh: true,
       template: $("#status-template").text(),
       click: function(e) {
                    
           var text=e.dataItem.text;
           text = text.replace(/#/g, '\!'); 
           
           $('#translationbox').empty();
           $('#translatedbox').empty();
           $('#usertime').empty();
           $('#userimg').empty();
           var profileImageUrl = e.dataItem.user.profile_image_url; 
           var createtime=e.dataItem.user.created_at;
           var userimg=e.dataItem.original_pic;
           console.log(createtime);
           
           $('#tweetProfileImage').html('<img width="48" height="48" src="'+ profileImageUrl +'.jpg" alt="profile image" />');
           $('#username').html(e.dataItem.user.screen_name);
           
           var createtime2=kendo.toString(new Date(Date.parse(createtime)), "ddd dd MMM yyyy HH:mm ")
           $('#usertime').html(createtime2);
             
           $('#translationbox').append(e.dataItem.user.screen_name);
           $('#translationbox').append(':');
           $('#translationbox').append(text);
           if (userimg!== undefined)
           { $('#userimg').html('<img width="100" height="100" src="'+ userimg +'.jpg" alt="profile image" />');}
           
           window.location = '#detailtweet';
                          
          }
    });

//============================ Utilities =========================//

// check for storage
var checkStorage = (function() {
      var uid = new Date,
          storage,
          result;
      try {
        (storage = window.localStorage).setItem(uid, uid);
        result = storage.getItem(uid) == uid;
        storage.removeItem(uid);
        return result && storage;
      } catch(e) {}
    }());
