import"./modulepreload-polyfill.c7c6310f.js";function E(){return fetch("https://api.github.com/repos/ktlisfo/singpost/contents/data/input-data/").then(n=>{if(!n.ok)throw new Error("Failed to fetch file list");return n.json()}).then(n=>{console.log(n);const o=n.map(c=>c.name);return console.log(o),o}).catch(n=>(console.error("Error:",n),[]))}function N(t){return fetch(t).then(e=>{if(!e.ok)throw new Error(`JSON \uC77D\uAE30 \uC624\uB958: ${e.status} ${e.statusText}`);return e.json()}).then(e=>{const r=new Set;return e.result.forEach(n=>{r.add(n.CAR_NUM)}),r})}function g(t){const e=document.createDocumentFragment();return t.forEach(r=>{const n=document.createElement("details");n.className="tree-nav__item is-expandable";const o=document.createElement("summary");o.className="tree-nav__item-title",o.textContent=r.replace(".json",""),console.log("fname: "+r),o.addEventListener("click",function(){const m="/singpost/data/input-data/"+r;console.log("jsonUrl: "+m),_.has(r)||(N(m).then(s=>{console.log(s),C(r,s)}).catch(s=>{console.error("JSON \uC77D\uAE30 \uC624\uB958:",s)}),_.add(r))});const c=document.createElement("div");c.className="tree-nav__item";const u="./data/all-route/",a=document.createElement("a");a.className="tree-nav__item";const l=u+r.replace("json","html");console.log("all route url: "+l),a.href=l,a.textContent="All Route",c.appendChild(a);const d="./data/all-route-by-car/"+r.replace(".json","_by_CAR.html");console.log("bycar url: "+d),fetch(d).then(m=>{if(m.ok){const s=document.createElement("a");s.className="tree-nav__item",s.href=d,s.textContent="All Route By Car",c.appendChild(s)}}),n.appendChild(c),n.appendChild(o),e.appendChild(n)}),e}function C(t,e){const r="./route.html?",n=t.replace(".json",""),o=document.querySelector(".tree-nav");if(o&&o.children){for(const c of o.children)if(c.tagName==="DETAILS"){const u=c.querySelector(".tree-nav__item-title");if(u&&u.textContent===n){const a=c.querySelector(".tree-nav__item");a&&S(e).forEach(l=>{const i=document.createElement("a");i.className="tree-nav__item",i.href=r+"fname="+t.replace(".json","")+"&car_id="+l,i.textContent=l,a.appendChild(i)});break}}}}function A(t){return t.sort((e,r)=>{const n=h(e),o=h(r);if(n>o)return-1;if(n<o)return 1;const c=p(e),u=p(r);if(c>u)return-1;if(c<u)return 1;const a=f(e),l=f(r);return a>l?-1:a<l?1:0}),console.log(t),t}function h(t){const[e,r]=[t.substring(0,2),t.substring(2,5)],n={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};return new Date(2023,n[r],parseInt(e))}function p(t){const e=t.match(/R([0-9]+)/);return e?parseInt(e[1]):0}function f(t){const e=t.match(/T([0-9]+)/);return e?parseInt(e[1]):0}function S(t){return Array.from(t).sort()}const _=new Set;E().then(t=>{const e=A(t),r=g(e),n=document.querySelector(".tree-nav");n?n.appendChild(r):console.error("Container Element Not Found")}).catch(t=>{console.error("Error:",t)});
