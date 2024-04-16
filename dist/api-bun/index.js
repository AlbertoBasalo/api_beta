var Y={LOG_LEVEL:Bun.env.LOG_LEVEL||"info",STORAGE:Bun.env.STORAGE||"memory"};function Z(j,$){if(J!=="verbose")return;console.log(`\u2754 ${j}`,h($))}function T(j,$){if(J==="none")return;console.log(`\uD83D\uDCD8 ${j}`,h($))}function w(j,$){if(J==="none")return;console.warn(`\uD83D\uDCD2 ${j}`,h($))}function W(j,$){if(J==="none")return;console.error(`\uD83D\uDD25 ${j}`,h($))}var h=function(j){if(!j)return"";if(typeof j==="object")return JSON.stringify(j);return j},J=Y.LOG_LEVEL;class S extends Response{constructor(j,$){super(JSON.stringify(j),$);if(this.headers.set("Access-Control-Allow-Origin","*"),this.headers.set("Access-Control-Allow-Methods","OPTIONS, GET"),this.headers.set("Access-Control-Allow-Headers","Content-Type"),j?.length)Z(`Response: ${this.status}`,{size:j?.length})}}async function A(j){try{const $=P(j);return Z("Reading seed data",$),await Bun.file($).json()}catch($){if(T("No seed data available. Starting empty collection.",j),Y.STORAGE==="file")w("Creating file storage",j),O(j,[]);return[]}}async function O(j,$){if(Y.STORAGE!=="file")return;try{const z=JSON.stringify($,null,2);await Bun.write(P(j),z)}catch(z){W("Error writing to file. Using only memory.",z)}}var P=function(j){return`db/${j}.json`};async function U(j){return await F(j)}async function x(j,$,z){return(await U(j)).filter((Q)=>Q[$]==z)}async function _(j,$){const z=await F(j);return z.push($),await K(j,z),$}async function B(j,$,z){const H=await F(j),M=H.findIndex((X)=>X.id===$);if(M===-1)return null;return H[M]=z,await K(j,H),H[M]}async function R(j,$){const z=await F(j),H=z.findIndex((M)=>M.id==$);if(H>=0)z.splice(H,1),await K(j,z)}async function F(j){if(!k[j]){const $=await A(j);k[j]=$}return[...k[j]]}async function K(j,$){k[j]=[...$],await O(j,$)}var k={};async function v(j){return await U(j)}async function L(j,$){const H=(await x(j,"id",$))[0],M=H?void 0:`Item with id ${$} not found in ${j}`;return{result:H,error:M}}async function b(j,$,z){return await x(j,$,z)}async function C(j,$){let z=$.id;if(z){if((await L(j,z)).result)return{result:void 0,error:`Item with id ${z} already exists in ${j}`}}else z=Math.random().toString(36).substr(2,9);const Q={...$,id:z,createdAt:new Date,updatedAt:null};return{result:await _(j,Q)}}async function D(j,$,z){const H=await L(j,$);if(H.error)return{error:`Item ${$} not found on ${j}`};const M=new Date,Q={...H.result,...z,updatedAt:M},X=await B(j,$,Q),E=X?Q:void 0,G=X?void 0:`Item ${$} not updated on ${j}`;return{result:E,error:G}}async function N(j,$){await R(j,$)}async function g(j){if(j.id)return u(j);if(j.key&&j.value)return d(j);return I(j)}async function p(j){if(j.endPoint==="/login"){const M=j.body;return delete M.password,new S({user:M,accessToken:"json.web.token"})}const $=await C(j.resource,j.body),z=$.result?201:409,H=$.result?$.result:$.error;return new S(H,{status:z})}async function m(j){if(!j.id)j.id=j.body.id;const $=await D(j.resource,j.id,j.body),z=$.result?200:404,H=$.result?$.result:$.error;return new S(H,{status:z})}async function y(j){return await N(j.resource,j.id),new S(null,{status:204})}async function I(j){const $=await v(j.resource),z=$.length>0?200:200;return new S($,{status:z})}async function u(j){const $=await L(j.resource,j.id),z=$.result?200:404,H=$.result?$.result:$.error;return new S(H,{status:z})}async function d(j){const $=await b(j.resource,j.key,j.value),z=$.length>0?200:200;return new S($,{status:z})}async function f(j){try{const $=j.method,z=new URL(j.url).pathname,H=z.split("/")[1]||"",M=z.split("/")[2]||"",Q=new URL(j.url).searchParams,X=Q.get("key")||"",E=Q.get("value")||"";let G={};if($==="POST"||$==="PUT")G=await j.json();const V={method:$,endPoint:z,resource:H,id:M,key:X,value:E,body:G};return Z("Request:",V),V}catch($){return W("Error extracting request info",$),null}}async function q(j){if(j.endPoint==="/")return new Response(`
      <html>
        <head>
          <title>API Bun</title>
        </head>
        <body>
          <h1><a href="https://github.com/AlbertoBasalo/api_bun">API Bun</a></h1>
          <p>Hello, this is your ready to to use REST server.</p>
          <p>Read the <a href="https://github.com/AlbertoBasalo/api_bun/blob/main/README.md">docs</a> for more information.</p>
          <p>Check the <a href="./activities">activities</a> sample endpoint.</p>
          <footer>Cooked with love by <a href="https://albertobasalo.dev">Alberto Basalo</a></footer>
        </body>
      </html>
    `,{headers:{"Content-Type":"text/html"}});if(j.endPoint==="/favicon.ico")return new Response(null,{status:204});return null}async function s(j){const $=await f(j);if(!$)return new Response("Bad request",{status:400});switch($.method){case"GET":const z=await q($);if(z)return z;return await g($);case"POST":return await p($);case"PUT":return await m($);case"DELETE":return await y($);case"OPTIONS":return new S("OK");default:return new Response("Method Not Allowed",{status:200})}}var r=Bun.serve({port:3000,fetch(j){try{return s(j)}catch($){return W("Error processing request",$),new Response($.message,{status:500})}}});T(`Listening on ${r.url}`,Y);
