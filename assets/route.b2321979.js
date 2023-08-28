import"./modulepreload-polyfill.c7c6310f.js";const C=new URLSearchParams(window.location.search),f=`${C.get("fname")}.json`,w=C.get("car_id");console.log(`fname: ${f}`);console.log(`carID : ${w}`);async function b(e){try{const t=await fetch(e);if(!t.ok)throw new Error(`JSON \uC77D\uAE30 \uC624\uB958: ${t.status} ${t.statusText}`);return(await t.json()).result.filter(n=>n.CAR_NUM===w).map(n=>{const{Y:s,X:c,ADDRESS_FULL:u,OPEN_TIME:p,CLOSE_TIME:r,ORDER_VOLUME:a,BOX_NUM:g,OPT_ARR_TIME_HM:l,EST_PROC_TIME:m}=n,i=parseFloat(s),d=parseFloat(c),_=u,h=parseInt(p),B=parseInt(r),E=parseFloat(a),I=parseInt(g),D=l,M=parseInt(m);return{latitude:i,longitude:d,address:_,open_time:h,close_time:B,order_volume:E,box_num:I,arrival_time:D,dwell_time:M}})}catch(t){return console.error("JSON \uC77D\uAE30 \uC624\uB958:",t),[]}}async function R(){const e=new google.maps.Map(document.getElementById("map"),{zoom:4}),t=new google.maps.InfoWindow;try{const o=await b(`/singpost-route/data/input-data/${f}`);o.length>0?T(o,e,t):console.error("\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}catch(o){console.error("\uB370\uC774\uD130 \uB85C\uB529 \uC624\uB958:",o)}}function T(e,t,o){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZ",s=new google.maps.DirectionsRenderer({draggable:!1,map:t,panel:document.getElementById("panel"),suppressMarkers:!1,suppressInfoWindows:!0,markerOptions:{icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"white",fillOpacity:1,strokeWeight:3,strokeColor:"blue",scale:5},zIndex:0}});s.addListener("directions_changed",()=>{const r=s.getDirections();r&&S(r)});const c=[];e.slice(1,e.length-1).forEach(r=>{const a={location:new google.maps.LatLng(r.latitude,r.longitude)};c.push(a)});const u={origin:{lat:e[0].latitude,lng:e[0].longitude},destination:{lat:e[e.length-1].latitude,lng:e[e.length-1].longitude},waypoints:c,travelMode:google.maps.TravelMode.DRIVING,avoidTolls:!0};new google.maps.DirectionsService().route(u,(r,a)=>{a===google.maps.DirectionsStatus.OK&&r?(s.setDirections(r),e.forEach((g,l)=>{const m=l===0?"A":n[l],i=y(e,m,l,t),d=O(g);i.addListener("click",()=>{o.setContent(d),o.open(t,i)})})):console.error("\uACBD\uB85C \uC694\uCCAD \uC2E4\uD328:",a)})}function y(e,t,o,n){const s=o===0?e.length:e.length-o;return new google.maps.Marker({position:new google.maps.LatLng(e[o].latitude,e[o].longitude),map:n,label:{text:t,fontWeight:"bold"},zIndex:s})}function O(e){return`
  <strong>- Address: </strong>${e.address}<br>
  <strong>- Arrival Time: </strong>${e.arrival_time}<br>
  <strong>- Dwell Time: </strong>${e.dwell_time}<br>
  <strong>- Items: </strong>${e.box_num}<br>
  <strong>- Total Weight: </strong>${e.order_volume}<br>
  <strong>- Requested time from: </strong>${e.open_time}<br>
  <strong>- Request time to: </strong>${e.close_time}<br>
  `}function S(e){let t=0;const o=e.routes[0];if(!!o){for(let n=0;n<o.legs.length;n++)t+=o.legs[n].distance.value;t=t/1e3,document.getElementById("total").innerHTML=t+" km"}}window.initMap=R;
