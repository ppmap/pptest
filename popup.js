/*************************************************/
/*JSON読み込み                                   */
/*************************************************/

var loadJSON = function(path){
  
  var data = [];
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, false);
  xhr.send(null);
  
  if(xhr.status == 200 || xhr.status == 304){
    data = JSON.parse(xhr.responseText);
    return data;
  }else{
    return;
  }
  
  
}


/*************************************************/
/*ポップアップ表示設定                           */
/*************************************************/

//ポップアップ表示
var popup = new mapboxgl.Popup();
map.on('click', function(e) {
  
  console.log(e);
  
  //レンダリングされた地物を取得
  var features = map.queryRenderedFeatures(e.point);
  if (!features.length) {
    popup.remove();
    return;
  }
  
  var htmlString = ""; //ポップアップ
  
  var feature = features[0]; //一番上のものだけ表示
  console.log(feature);
  
  if(feature.sourceLayer && feature.sourceLayer == "pp"){
  
      var featureProperties = "<table>";
      for(name in feature.properties){
          if(name == "ID"){
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>"
                                + "<a target='_blank' href='https://mapps.gsi.go.jp/map-lib-api/apiContentsView.do?specificationId=" + feature.properties[name] + "'>"
                                + feature.properties[name] + "</a>" + "</td></tr>";
              /*
              featureProperties = featureProperties + "<td style='color:#000000;'>"
                                + "<img src='https://mapps.gsi.go.jp/contentsImage.do?specificationId=" + feature.properties[name]  + "'>"
                                + "</td></tr>";
              */
          }else{
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>" + feature.properties[name] + "</td></tr>";
          }
      
      }
      featureProperties = featureProperties +  "</table>";
      htmlString = htmlString + "<span style='font-weight:bold;' >" + "単写真" +  "</span>" + featureProperties;
      //htmlString = htmlString + "<span style='font-weight:bold;' >" + feature.layer.id + ":" + feature.sourceLayer + "</span>" + featureProperties;
      
  }else if(feature.sourceLayer && feature.sourceLayer == "ppcls"){
  
      
      var featureProperties = "<table>";
      for(name in feature.properties){
          if(name == "撮影年月日"){
              var pd = +feature.properties[name].substr(0,4);
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>" + pd + "</td></tr>";
          }else if(name == "撮影縮尺"){
              var pd = Math.floor(+feature.properties[name]/1000) * 1000;
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>" + pd + "</td></tr>";
          }else if(name == "カラー種別" || name == "撮影計画機関"){
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>" + feature.properties[name] + "</td></tr>";
          }
      
      }
      featureProperties = featureProperties +  "</table>";
      featureProperties = featureProperties 
                        + "<div>※個別の写真を見るには、<a href='#' onClick='map.flyTo(" 
                        + "{center: [" + e.lngLat.lng + "," +  e.lngLat.lat + "], zoom: " + 11 + "}"
                        + ");'>地図を拡大</a>してください。</div>";
      htmlString = htmlString + "<span style='font-weight:bold;' >" + "単写真（集計）" +  "</span>" + featureProperties;
      //htmlString = htmlString + "<span style='font-weight:bold;' >" + feature.layer.id + ":" + feature.sourceLayer + "</span>" + featureProperties;
  
  }else if(feature.sourceLayer && feature.sourceLayer == "zu"){
      
      /*
      const figureNameId = feature.properties.figureNameId;
      const zurekiUrl = "https://mapps.gsi.go.jp/historyList.do?figureNameId=" + figureNameId;
      const zurekiJson = loadJSON(zurekiUrl);
      
      console.log(zurekiJson);
      */
      
      const zurekiPageUrl = "https://mapps.gsi.go.jp/history.html#figureNameId=" + feature.properties.figureNameId;
      
      var featureProperties = "<table>";
      for(name in feature.properties){
          if(name == "scale"){
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + "縮尺" + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>" + feature.properties[name] + "</td></tr>";
          }else if(name == "Name"){
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + "図名" + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>" + feature.properties[name] + "</td></tr>";
          }else if(name == "figureNameId"){
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>"
                                /*
                                + "<a target='_blank' href='https://mapps.gsi.go.jp/maplibSearch.do?searchMethod=2&zoomLevel=11&listNumber=" + feature.properties[name] + "'>"
                                + feature.properties[name] + "</a>"
                                */
                                + feature.properties[name] + " →"
                                + "<a target='_blank' href='" + zurekiPageUrl + "'>" + "図歴" + "</a>"
                                + "</td></tr>";
                                
          }else if(name == "カラー種別" || name == "撮影計画機関"){
              featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
              featureProperties = featureProperties + "<td style='color:#000000;'>" + feature.properties[name] + "</td></tr>";
          }
      
      }
      featureProperties = featureProperties +  "</table>";
      featureProperties = featureProperties +  "<div>※個別の地図を見るには、"
                        + "<a target='_blank' href='" + zurekiPageUrl + "'>" + "図歴" + "</a>"
                        + "から選択してください。</div>";
      htmlString = htmlString + "<span style='font-weight:bold;' >" + "地形図・地勢図" +  "</span>" + featureProperties;
      //htmlString = htmlString + "<span style='font-weight:bold;' >" + feature.layer.id + ":" + feature.sourceLayer + "</span>" + featureProperties;
  
  }

  if (!htmlString || htmlString == "") {
    popup.remove();
    return;
  }
  
  /*
  for(i in features){
      
      
      //ポップアップ表示 --------------------
      var feature = features[i];
      if(!feature.sourceLayer  || feature.sourceLayer != "pp") continue;
      //console.log(feature);
      
      var featureProperties = "<table>";
      for(name in feature.properties){
          featureProperties = featureProperties + "<tr><td style='vertical-align:top; color:#555555;'>" + name + "</td>";
          featureProperties = featureProperties + "<td style='color:#000000;'>" + feature.properties[name] + "</td></tr>";
      }
      featureProperties = featureProperties +  "</table>";
      
      htmlString = htmlString + "<span style='font-weight:bold;' >" + feature.layer.id + ":" + feature.sourceLayer + "</span>" + featureProperties;
      //htmlString = htmlString + "<br>データソース：" + feature.sourceLayer + "<br>--属性値：" + JSON.stringify( feature.properties );
      //レイヤID => feature.layer.id
    
    
  }
  */
  
  //結果の表示
  //ポップアップ
  popup.setLngLat([ e.lngLat.lng, e.lngLat.lat ])
    .setHTML(htmlString)
    .addTo(map);
  
});
