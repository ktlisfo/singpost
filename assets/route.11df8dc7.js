import"./modulepreload-polyfill.c7c6310f.js";const B=new URLSearchParams(window.location.search),D=`${B.get("fname")}.json`,S=B.get("car_id");console.log(`fname: ${D}`);console.log(`carID : ${S}`);async function P(e){try{const t=await fetch(e);if(!t.ok)throw new Error(`JSON \uC77D\uAE30 \uC624\uB958: ${t.status} ${t.statusText}`);return(await t.json()).result.filter(n=>n.CAR_NUM===S).map(n=>{const{VISIT_ORDER:u,Y:i,X:o,ZIP_CODE:s,ADDRESS_FULL:c,OPEN_TIME:f,CLOSE_TIME:a,ORDER_VOLUME:h,BOX_NUM:C,OPT_ARR_TIME_HM:l,EST_PROC_TIME:d,NM_COUNT:m,BOX_COUNT:p,E:g}=n,I=parseInt(u),w=parseFloat(i),y=parseFloat(o),_=s,b=c,L=V(parseInt(f)),O=j(parseInt(a)),$=parseFloat(h),F=parseInt(C),R=l,N=parseInt(d),x=parseInt(m),A=parseInt(p),H=parseInt(g);return{visit_order:I,latitude:w,longitude:y,zip_code:_,address:b,open_time:L,close_time:O,order_volume:$,box_num:F,arrival_time:R,dwell_time:N,nm_count:x,box_count:A,e:H}})}catch(t){return console.error("JSON \uC77D\uAE30 \uC624\uB958:",t),[]}}async function U(){const e=new google.maps.Map(document.getElementById("map"),{zoom:4}),t=new google.maps.InfoWindow,r=[];try{const n=await P(`/singpost/data/input-data/${D}`);n.length>0?z(n,e,t,r):console.error("\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}catch(n){console.error("\uB370\uC774\uD130 \uB85C\uB529 \uC624\uB958:",n)}}function z(e,t,r,n){var u=e.map(function(a){return a.longitude}),i=e.map(function(a){return a.latitude});t.fitBounds({west:Math.min.apply(null,u),east:Math.max.apply(null,u),north:Math.min.apply(null,i),south:Math.max.apply(null,i)});for(var o=0,s=[],c=25-1;o<e.length;o=o+c)s.push(e.slice(o,o+c+1));const f=new google.maps.DirectionsService;e.slice(1,e.length-1).forEach(a=>{new google.maps.LatLng(a.latitude,a.longitude)});for(var o=0;o<s.length;o++){const h=[];s[o].slice(1,e.length-1).forEach(l=>{const d={location:new google.maps.LatLng(l.latitude,l.longitude)};h.push(d)});const C={origin:{lat:s[o][0].latitude,lng:s[o][0].longitude},destination:{lat:s[o][s[o].length-1].latitude,lng:s[o][s[o].length-1].longitude},waypoints:h,travelMode:google.maps.TravelMode.DRIVING,avoidTolls:!0};f.route(C,(l,d)=>{if(d===google.maps.DirectionsStatus.OK&&l){var m=new google.maps.DirectionsRenderer;m.setMap(t),m.setOptions({suppressMarkers:!0,preserveViewport:!0}),m.setDirections(l);var p=new google.maps.DirectionsRenderer({draggable:!1,map:t,suppressMarkers:!1,preserveViewport:!0,suppressInfoWindows:!0,markerOptions:{icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"white",fillOpacity:1,strokeWeight:3,strokeColor:"blue",scale:5},zIndex:0}});p.addListener("directions_changed",()=>{const g=p.getDirections();g&&J(g)}),p.setDirections(l),e.forEach((g,I)=>{const w=I+1+"",y=T(e[I].arrival_time),_=q(e,w,I,t,y,g.e),b=k(g);n.push(_),_.addListener("click",()=>{r.setContent(b),r.open(t,_)})}),X(e,t,r,n)}else console.error("index: ",o),console.error("parts: ",s),console.error("\uACBD\uB85C \uC694\uCCAD \uC2E4\uD328:",d)})}}function q(e,t,r,n,u,i){const o=r===0?e.length:e.length-r,s=i==1?"blue":"black",c=i==1?3:2;return new google.maps.Marker({position:new google.maps.LatLng(e[r].latitude,e[r].longitude),map:n,icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:u,fillOpacity:1,strokeWeight:c,strokeColor:s,scale:10},label:{text:t},zIndex:o})}function T(e){const t=parseInt(e.split(":")[0]);return t>=0&&t<=11?"#FFA7A7":t>=12&&t<=14?"#FAED7D":t>=15&&t<=17?"#B7F0B1":"#6799FF"}function V(e){const t=Math.floor(e/60),r=e%60;return`${t.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`}function j(e){if(e>=1440)return"23:59";{const t=Math.floor(e/60),r=e%60;return`${t.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`}}function k(e){return`
  <strong>- Zipcode: </strong>${e.zip_code}<br>
  <strong>- Customer: </strong>${e.nm_count}<br>
  <strong>- Total Item: </strong>${e.box_count}<br>
  `}function W(e){return`
  (${e.zip_code})<br>
  ${e.address}<br>
  `}function Z(e){return`
  - Arrival Time: ${e.arrival_time}<br>
  - Dwell Time: ${e.dwell_time}<br>
  - Items: ${e.box_num}<br>
  - Total Weight: ${e.order_volume}<br>
  - Requested time from: ${e.open_time}<br>
  - Requested time to: ${e.close_time}<br>
  `}function J(e){let t=0;const r=e.routes[0];if(!!r){for(let n=0;n<r.legs.length;n++)t+=r.legs[n].distance.value;t=t/1e3,document.getElementById("total").innerHTML=t+" km"}}function X(e,t,r,n){const u=document.getElementById("data-list");u&&(u.innerHTML="",e.forEach((i,o)=>{const s=document.createElement("li");s.className="data-item";const c=document.createElement("div");c.className="item-header";const f=e[o].e==1?"#EBF7FF":"#EEEEEE";c.style.backgroundColor=f;const a=document.createElement("div");a.className="index-circle",a.style.backgroundColor=T(e[o].arrival_time);const h=e[o].e==1?"blue":"black";a.style.borderColor=h;const C=document.createElement("span");C.textContent=(o+1).toString(),a.appendChild(C);const l=document.createElement("div");l.className="header-info",l.innerHTML=W(i),c.appendChild(a),c.appendChild(l),s.appendChild(c);const d=document.createElement("div");d.innerHTML=Z(i),s.appendChild(d),u.appendChild(s),c.addEventListener("click",()=>{const m=n[o];m&&(n.forEach((p,g)=>{p.setZIndex(n.length-g)}),m.setZIndex(n.length+1),r.setContent(k(i)),r.open(t,m))})}))}const v=document.getElementById("accordian-header"),M=document.querySelector(".arrow-icon"),E=document.getElementById("sidebar");if(v&&M&&E){let e=!0;v.addEventListener("click",()=>{e?(E.style.maxHeight="0",E.addEventListener("transitionend",()=>{E.style.padding="0"},{once:!0})):(E.style.maxHeight="50%",E.style.padding="1rem"),e=!e,M.style.transform=e?"rotate(180deg)":"rotate(0deg)"})}else console.error("Required elements not found");window.initMap=U;