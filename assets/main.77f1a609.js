import"./modulepreload-polyfill.c7c6310f.js";function C(){return fetch("https://api.github.com/repos/ktlisfo/singpost/contents/data/input-data/").then(r=>{if(!r.ok)throw new Error("Failed to fetch file list");return r.json()}).then(r=>{console.log(r);const o=r.map(c=>c.name);return console.log(o),o}).catch(r=>(console.error("Error:",r),[]))}function A(t){return fetch(t).then(e=>{if(!e.ok)throw new Error(`JSON \uC77D\uAE30 \uC624\uB958: ${e.status} ${e.statusText}`);return e.json()}).then(e=>{const n=new Set;return e.result.forEach(r=>{n.add(r.CAR_NUM)}),n})}function y(t){const e=document.createDocumentFragment();return t.forEach(n=>{const r=document.createElement("details");r.className="tree-nav__item is-expandable";const o=document.createElement("summary");o.className="tree-nav__item-title",o.textContent=n.replace(".json",""),console.log("fname: "+n),o.addEventListener("click",function(){const m="/singpost/data/input-data/"+n;console.log("jsonUrl: "+m),E.has(n)||(A(m).then(a=>{console.log(a),S(n,a)}).catch(a=>{console.error("JSON \uC77D\uAE30 \uC624\uB958:",a)}),E.add(n))});const c=document.createElement("div");c.className="tree-nav__item";const l="./data/all-route/",s=document.createElement("a");s.className="tree-nav__item";const u=l+n.replace("json","html");console.log("all route url: "+u),s.href=u,s.textContent="All Route",c.appendChild(s);const d="./data/all-route-by-car/"+n.replace(".json","_by_CAR.html");console.log("bycar url: "+d),fetch(d).then(m=>{if(m.ok){const a=document.createElement("a");a.className="tree-nav__item",a.href=d,a.textContent="All Route By Car",c.appendChild(a)}}),r.appendChild(c),r.appendChild(o),e.appendChild(r)}),e}function S(t,e){const n="./route.html?",r=t.replace(".json",""),o=document.querySelector(".tree-nav");if(o&&o.children){for(const c of o.children)if(c.tagName==="DETAILS"){const l=c.querySelector(".tree-nav__item-title");if(l&&l.textContent===r){const s=c.querySelector(".tree-nav__item");s&&b(e).forEach(u=>{const i=document.createElement("a");i.className="tree-nav__item",i.href=n+"fname="+t.replace(".json","")+"&car_id="+u,i.textContent=u,s.appendChild(i)});break}}}}function F(t){return t.sort((e,n)=>{const r=h(e),o=h(n);if(r>o)return-1;if(r<o)return 1;const c=f(e),l=f(n);if(c>l)return 1;if(c<l)return-1;const s=c==0?_(e):p(e),u=l==0?_(n):p(n);if(s>u)return-1;if(s<u)return 1;const i=N(e),d=N(n);if(i>d)return-1;if(i<d)return 1;const m=g(e),a=g(n);return m>a?-1:m<a?1:0}),console.log(t),t}function h(t){const[e,n]=[t.substring(0,2),t.substring(2,5)],r={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};return new Date(2023,r[n],parseInt(e))}function f(t){return console.log("E or R: "+t[6]),t[6]=="E"?0:1}function p(t){const e=t.match(/R([0-9]+)/);return e?parseInt(e[1]):0}function _(t){const e=t.match(/E([0-9]+)/);return e?parseInt(e[1]):0}function N(t){const e=t.match(/T([0-9]+)/);return e?parseInt(e[1]):0}function g(t){const e=t.match(/P([0-9]+)/);return e?parseInt(e[1]):0}function b(t){return Array.from(t).sort()}const E=new Set;C().then(t=>{const e=F(t),n=y(e),r=document.querySelector(".tree-nav");r?r.appendChild(n):console.error("Container Element Not Found")}).catch(t=>{console.error("Error:",t)});