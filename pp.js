const yearsList = [
  1930,
  1940,
  1950,
  1960,
  1970,
  1980,
  1990,
  2000,
  2010,
  2020,
  2030
]

const startYear = 1900;
const endYear = 2021;

const showPp = (upYear, lwYear, filterArr) => {
  const upYears = Math.ceil(upYear/10)*10;
  const lwYears = Math.floor(lwYear/10)*10;
  
  //フィルタ条件の整理
  const filterYear = [
          'all',
          ['>=', ["to-number", ["slice", ["get", "撮影年月日"], 0, 4]], lwYear],
          ['<=', ["to-number", ["slice", ["get", "撮影年月日"], 0, 4]], upYear]
  ];
      
  const filter = filterYear.concat(filterArr);

  
  //各年代のソース・レイヤ追加
  //yearsList.forEach( ys => {
    
    const ys = 0;
    
    //大縮尺用
    const sourceid = ys + 's';
    const layerid = ys + 's';
    
    //小縮尺用（クラスタリング）
    const sourceidszl = ys + 's-szl';
    const layeridszl = ys + 's-szl';
    
    //既存のソース・レイヤを削除
    //既存のソースをそのまま利用できるように、年代に応じてソース削除の有無あり
    
    if(ys && +ys > lwYears && upYears <= +ys){
      
      if(map.getLayer(layerid + 'debug')){
        map.removeLayer(layerid + 'debug');
      }
      if(map.getLayer(layerid)){
        map.removeLayer(layerid);
        if(map.getSource(sourceid)){
          map.removeSource(sourceid);
        }
      }
      //小縮尺用（クラスタリング）
      if(map.getLayer(layeridszl + 'text')){
        map.removeLayer(layeridszl + 'text');
      }
      if(map.getLayer(layeridszl)){
        map.removeLayer(layeridszl);
        if(map.getSource(sourceidszl)){
          map.removeSource(sourceidszl);
        }
      }
    }else{
    
    
      if(map.getLayer(layerid + 'debug')){
        map.removeLayer(layerid + 'debug');
      }
      if(map.getLayer(layerid)){
        map.removeLayer(layerid);
      }
      if(map.getLayer(layeridszl)){
        map.removeLayer(layeridszl);
      }
      if(map.getLayer(layeridszl + 'text')){
        map.removeLayer(layeridszl + 'text');
      }
    
    
    }
    
    
    //チェックボックスの確認
    if(!document.selection.selectPp.checked){ 
      document.question.style.display = "none";
      return;
      
    }else{
      document.question.style.display = "";
    }
    
    
    //if(+ys >= lwYears && upYears > +ys){
      
      //console.log('-', ys);

      //大縮尺用ソース・レイヤの追加
      if(!map.getSource(sourceid)){
        map.addSource(sourceid, {
          type: 'vector',
          //tiles: [root + '/pbf/' + ys + 's/{z}/{x}/{y}.pbf'],
          tiles: [root + '/pbf/{z}/{x}/{y}.pbf'],
          minzoom: 11,
          maxzoom: 11
        });
      }
      
      /* debug用
      map.addLayer({
        'id': sourceid + 'debug',
        'type': 'circle',
        'source': sourceid,
        'minzoom': 11,
        'maxzoom': 22,
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
          'circle-radius': 10,
          'circle-color': ['rgba', 255,255,255,0.3]
        },
        'source-layer': 'pp'
      });
      */
      map.addLayer({
        'id': sourceid,
        'type': 'circle',
        'source': sourceid,
        'minzoom': 11,
        'maxzoom': 22,
        'filter': filter,
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
          'circle-radius': 5,
          'circle-color': ['rgba', 
            255, 
            0, //["*", 2, ["to-number", ["slice", ["get", "撮影年月日"], 2, 4]]],
            0, //["-", 255, ["*", 2, ["to-number", ["slice", ["get", "撮影年月日"], 2, 4]]]],
            1]
        },
        'source-layer': 'pp'
      });
      
      console.log('-', ys);
      
      
      
    //} //if(+ys >= lwYears && upYears > +ys){
    
    /**************************************************************/
    
    //小縮尺用にクラスタリングしたタイル
    
    
      
    if(!map.getSource(sourceidszl)){
      map.addSource(sourceidszl, {
        type: 'vector',
        tiles: [root + '/sz_pbf/{z}/{x}/{y}.pbf'],
        minzoom: 6,
        maxzoom: 10
      });
    }
    
    map.addLayer({
      'id': sourceidszl,
      'type': 'circle',
      'source': sourceidszl,
      'minzoom': 6,
      'maxzoom': 11,
      'filter': filter,
      'layout': {
        'visibility': 'visible'
      },
      'paint': {
        'circle-radius': 16,
        'circle-color': ['rgba', 
          255, 
          0, //["*", 2, ["to-number", ["slice", ["get", "撮影年月日"], 2, 4]]],
          0, //["-", 255, ["*", 2, ["to-number", ["slice", ["get", "撮影年月日"], 2, 4]]]],
          0.3]
      },
      'source-layer': 'ppcls'
    });
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
        'text-variable-anchor': ["center", "left", "right", "top", "bottom"],
        'text-font': ["NotoSansCJKjp-Regular"],
        'text-allow-overlap': false,
        'symbol-sort-key': ["case",
          ["has", "point_count"],["get", "point_count"],
          1
        ],
        'visibility': 'visible'
      },
      'paint': {
        'text-color': ['rgba', 0,0,0,1],
        'text-halo-color': ['rgba', 255,255,255,1],
        'text-halo-width': 2
      },
      'source-layer': 'ppcls'
    });
    
    
    /**************************************************************/
    
  //}) //forEach
  
}

const refleshPp = () =>{
  const l = +document.question.lower.value;
  const u = +document.question.upper.value;
  
  document.getElementById('lwYearNum').innerText = l + "年";
  document.getElementById('upYearNum').innerText = u + "年";
  
  const upy = Math.max(l,u);
  const lwy = Math.min(l,u);
  console.log(upy, lwy);
  
  const filterArr = [];
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
  showPp(upy, lwy, filterArr);
}

map.on('load', function(){
  refleshPp();
});

