
const showZu = (upYear, lwYear, filterArr) => {
  const upYears = Math.ceil(upYear/10)*10;
  const lwYears = Math.floor(lwYear/10)*10;
  
  //フィルタ条件の整理（今は使わない）
  const filterYear = [
          'all'/*
          ,
          ['>=', ["to-number", ["slice", ["get", "撮影年月日"], 0, 4]], lwYear],
          ['<=', ["to-number", ["slice", ["get", "撮影年月日"], 0, 4]], upYear]
          */
  ];
      
  const filter = filterYear.concat(filterArr);
  console.log(filter);
  
    
  //大縮尺用
  const sourceid = 'zu';
  const layerid = 'zu';
    

    
  //既存のレイヤを削除
    //既存のソースはそのまま利用

    if(map.getLayer(layerid)){
        map.removeLayer(layerid);
    }
    if(map.getLayer(layerid + 'text')){
        map.removeLayer(layerid + 'text');
    }
    
    
    //チェックボックスの確認
    if(!document.selection.selectChizu.checked){ 
      document.zuFilter.style.display = "none";
      return;
      
    }else{
      document.zuFilter.style.display = "";
    }
    
    
    if(!map.getSource(sourceid)){
      map.addSource(sourceid, {
        type: 'vector',
        tiles: [root + '/pbf_chizu/{z}/{x}/{y}.pbf'],
        minzoom: 6,
        maxzoom: 9
      });
    }
    
    map.addLayer({
      'id': sourceid,
      'type': 'circle',
      'source': sourceid,
      'minzoom': 6,
      'maxzoom': 22,
      'filter': filter,
      'layout': {
        'visibility': 'visible'
      },
      'paint': {
        'circle-radius': [
          "interpolate", ["linear"], ["zoom"],
          7,2,
          11,8
        ],
        'circle-color': ['rgba', 
          /*
          [
            "case", 
            ["<", ["get", "scale"], 25000], 250, 
            ["<", ["get", "scale"], 50000], 150, 
            ["<", ["get", "scale"], 200000], 50, 
            0
          ],*/
          60,
          200,
          100,
          1]
      },
      'source-layer': 'zu'
    });
    
    /*
    map.addLayer({
      'id': sourceidszl + 'text',
      'type': 'symbol',
      'source': sourceidszl,
      'minzoom': 6,
      'maxzoom': 11,
      'filter': filter,
      'layout': {
        'text-field': ["case",
          ["has", "point_count"],["get", "point_count"],
          "1"
        ],
        'text-font': ["NotoSansCJKjp-Regular"],
        'text-allow-overlap': true,
        'visibility': 'visible'
      },
      'paint': {
        'text-color': ['rgba', 0,0,0,1],
        'text-halo-color': ['rgba', 255,255,255,1],
        'text-halo-width': 2
      },
      'source-layer': 'zu'
    });
    */

  
}

const refleshZu = () =>{

  const filterArr = [];
  
  
  const scaleFilter = ["any"];
  
  if(document.zuFilter.zu200000.checked){
    scaleFilter.push(["==", ["get", "scale"], 200000]);
  }
  
  if(document.zuFilter.zu50000.checked){
    scaleFilter.push(["==", ["get", "scale"], 50000]);
  }
  
  if(document.zuFilter.zu25000.checked){
    scaleFilter.push(["==", ["get", "scale"], 25000]);
  }
  
  if(document.zuFilter.zu10000.checked){
    scaleFilter.push(["==", ["get", "scale"], 10000]);
  }
  
  
  if(scaleFilter.length > 1){
    filterArr.push(scaleFilter);
  }
  
  /****************************************************
  const l = +document.question.lower.value;
  const u = +document.question.upper.value;
  
  document.getElementById('lwYearNum').innerText = l + "年";
  document.getElementById('upYearNum').innerText = u + "年";
  
  const upy = Math.max(l,u);
  const lwy = Math.min(l,u);
  console.log(upy, lwy);
  
  const kikan = document.question.kikan.value;
  console.log(kikan);
  if(kikan){
    filterArr.push( ["in", kikan, ["get", "撮影計画機関"]] );
  }
  
  const pcolor = document.question.pcolor.value;
  if(pcolor == "c"){
    filterArr.push( ["==", ["get", "カラー種別"], "カラー"] );
  }else if(pcolor == "m"){
    filterArr.push( ["==", ["get", "カラー種別"], "モノクロ"] );
  }
  
  const ps1 = +document.question.pscalestart.value;
  const ps2 = +document.question.pscaleend.value;
  const pscalestart = Math.min(ps1, ps2);
  const pscaleend = Math.max(ps1, ps2);
  if(true){
    filterArr.push( [">=", ["get", "撮影縮尺"], pscalestart] );
    filterArr.push( ["<=", ["get", "撮影縮尺"], pscaleend] );
  }
  
  console.log(filterArr);
  ****************************************************/
  showZu(1900, 2030, filterArr);
}

map.on('load', function(){
  refleshZu();
});

