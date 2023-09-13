import"./modulepreload-polyfill.c7c6310f.js";const b=new URLSearchParams(window.location.search),D=`${b.get("fname")}.json`,S=b.get("car_id");console.log(`fname: ${D}`);console.log(`carID : ${S}`);async function A(e){try{const t=await fetch(e);if(!t.ok)throw new Error(`JSON \uC77D\uAE30 \uC624\uB958: ${t.status} ${t.statusText}`);return(await t.json()).result.filter(n=>n.CAR_NUM===S).map(n=>{const{VISIT_ORDER:l,Y:i,X:o,ZIP_CODE:s,ADDRESS_FULL:u,OPEN_TIME:d,CLOSE_TIME:c,ORDER_VOLUME:m,BOX_NUM:f,OPT_ARR_TIME_HM:a,EST_PROC_TIME:g,NM_COUNT:p,BOX_COUNT:E}=n,h=parseInt(l),_=parseFloat(i),w=parseFloat(o),v=s,I=u,y=z(parseInt(d)),O=q(parseInt(c)),$=parseFloat(m),k=parseInt(f),R=a,N=parseInt(g),x=parseInt(p),F=parseInt(E);return{visit_order:h,latitude:_,longitude:w,zip_code:v,address:I,open_time:y,close_time:O,order_volume:$,box_num:k,arrival_time:R,dwell_time:N,nm_count:x,box_count:F}})}catch(t){return console.error("JSON \uC77D\uAE30 \uC624\uB958:",t),[]}}async function H(){const e=new google.maps.Map(document.getElementById("map"),{zoom:4}),t=new google.maps.InfoWindow,r=[];try{const n=await A(`/singpost/data/input-data/${D}`);n.length>0?P(n,e,t,r):console.error("\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}catch(n){console.error("\uB370\uC774\uD130 \uB85C\uB529 \uC624\uB958:",n)}}function P(e,t,r,n){var l=e.map(function(c){return c.longitude}),i=e.map(function(c){return c.latitude});t.fitBounds({west:Math.min.apply(null,l),east:Math.max.apply(null,l),north:Math.min.apply(null,i),south:Math.max.apply(null,i)});for(var o=0,s=[],u=25-1;o<e.length;o=o+u)s.push(e.slice(o,o+u+1));const d=new google.maps.DirectionsService;e.slice(1,e.length-1).forEach(c=>{new google.maps.LatLng(c.latitude,c.longitude)});for(var o=0;o<s.length;o++){const m=[];s[o].slice(1,e.length-1).forEach(a=>{const g={location:new google.maps.LatLng(a.latitude,a.longitude)};m.push(g)});const f={origin:{lat:s[o][0].latitude,lng:s[o][0].longitude},destination:{lat:s[o][s[o].length-1].latitude,lng:s[o][s[o].length-1].longitude},waypoints:m,travelMode:google.maps.TravelMode.DRIVING,avoidTolls:!0};d.route(f,(a,g)=>{if(g===google.maps.DirectionsStatus.OK&&a){var p=new google.maps.DirectionsRenderer;p.setMap(t),p.setOptions({suppressMarkers:!0,preserveViewport:!0}),p.setDirections(a);var E=new google.maps.DirectionsRenderer({draggable:!1,map:t,suppressMarkers:!1,preserveViewport:!0,suppressInfoWindows:!0,markerOptions:{icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"white",fillOpacity:1,strokeWeight:3,strokeColor:"blue",scale:5},zIndex:0}});E.addListener("directions_changed",()=>{const h=E.getDirections();h&&W(h)}),E.setDirections(a),e.forEach((h,_)=>{const w=_+1+"",v=T(e[_].arrival_time),I=U(e,w,_,t,v),y=L(h);n.push(I),I.addListener("click",()=>{r.setContent(y),r.open(t,I)})}),Z(e,t,r,n)}else console.error("index: ",o),console.error("parts: ",s),console.error("\uACBD\uB85C \uC694\uCCAD \uC2E4\uD328:",g)})}}function U(e,t,r,n,l){const i=r===0?e.length:e.length-r;return new google.maps.Marker({position:new google.maps.LatLng(e[r].latitude,e[r].longitude),map:n,icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:l,fillOpacity:1,strokeWeight:2,scale:10},label:{text:t},zIndex:i})}function T(e){const t=parseInt(e.split(":")[0]);return t>=0&&t<=11?"red":t>=12&&t<=14?"orange":t>=15&&t<=17?"yellow":"#3ADF00"}function z(e){const t=Math.floor(e/60),r=e%60;return`${t.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`}function q(e){if(e>=1440)return"23:59";{const t=Math.floor(e/60),r=e%60;return`${t.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`}}function L(e){return`
  <strong>- Zipcode: </strong>${e.zip_code}<br>
  <strong>- Customer: </strong>${e.nm_count}<br>
  <strong>- Total Item: </strong>${e.box_count}<br>
  `}function V(e){return`
  (${e.zip_code})<br>
  ${e.address}<br>
  `}function j(e){return`
  - Arrival Time: ${e.arrival_time}<br>
  - Dwell Time: ${e.dwell_time}<br>
  - Items: ${e.box_num}<br>
  - Total Weight: ${e.order_volume}<br>
  - Requested time from: ${e.open_time}<br>
  - Requested time to: ${e.close_time}<br>
  `}function W(e){let t=0;const r=e.routes[0];if(!!r){for(let n=0;n<r.legs.length;n++)t+=r.legs[n].distance.value;t=t/1e3,document.getElementById("total").innerHTML=t+" km"}}function Z(e,t,r,n){const l=document.getElementById("data-list");l&&(l.innerHTML="",e.forEach((i,o)=>{const s=document.createElement("li");s.className="data-item";const u=document.createElement("div");u.className="item-header";const d=document.createElement("div");d.className="index-circle",d.style.backgroundColor=T(e[o].arrival_time);const c=document.createElement("span");c.textContent=(o+1).toString(),d.appendChild(c);const m=document.createElement("div");m.className="header-info",m.innerHTML=V(i),u.appendChild(d),u.appendChild(m),s.appendChild(u);const f=document.createElement("div");f.innerHTML=j(i),s.appendChild(f),l.appendChild(s),u.addEventListener("click",()=>{const a=n[o];a&&(n.forEach((g,p)=>{g.setZIndex(n.length-p)}),a.setZIndex(n.length+1),r.setContent(L(i)),r.open(t,a))})}))}const M=document.getElementById("accordian-header"),B=document.querySelector(".arrow-icon"),C=document.getElementById("sidebar");if(M&&B&&C){let e=!1;M.addEventListener("click",()=>{e?(C.style.maxHeight="0",C.addEventListener("transitionend",()=>{C.style.padding="0"},{once:!0})):(C.style.maxHeight="50%",C.style.padding="1rem"),e=!e,B.style.transform=e?"rotate(180deg)":"rotate(0deg)"})}else console.error("Required elements not found");window.initMap=H;
