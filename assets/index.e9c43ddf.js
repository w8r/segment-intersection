import{d as B,a as H,r as W}from"./vendor.89ed1c77.js";const C=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))g(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&g(u)}).observe(document,{childList:!0,subtree:!0});function o(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function g(e){if(e.ep)return;e.ep=!0;const s=o(e);fetch(e.href,s)}};C();const c=[[0,0],[0,0]];function X(t,n,o,g,e,s,u,a,y=1e-6){const l=o-t,d=g-n,p=u-e,w=a-s,v=e-t,M=s-n;let h=l*w-d*p,k=h*h;const N=l*l+d*d,Y=p*p+w*w;if(k>y*N*Y){const i=(v*w-M*p)/h;if(i<0||i>1)return 0;const x=(v*d-M*l)/h;return x<0||x>1?0:(i===0||i===1?(c[0][0]=t+i*l,c[0][1]=n+i*d):x===0||x===1?(c[0][0]=e+x*p,c[0][1]=s+x*w):(c[0][0]=t+i*l,c[0][1]=n+i*d),1)}const j=v*v+M*M;if(h=v*d-M*l,k=h*h,k>y*N*j)return 0;const D=(l*v+d*M)/N,E=D+(l*p+d*w)/N;let P=0,F=0;const _=Math.min(D,E),z=Math.max(D,E),A=0,b=1;let L=0;b<_||A>z?L=0:b>_?A<z?(P=A<_?_:A,F=b>z?z:b,L=2):(P=A,L=1):(P=b,L=1);for(let i=0;i<L;i++){const x=i===0?P:F;c[i][0]=t+x*l,c[i][1]=n+x*d}return L}window.findIntersection=X;window.intersection=c;const q=window.innerWidth,O=window.innerHeight,f=20,m=15,r=new Array(4).fill(0).map((t,n)=>({x:S(Math.random()*(q-m*2),f),y:S(Math.random()*(O-m*2),f),index:n})),G=B().on("drag",Q),I=H("body").append("svg").attr("width",q).attr("height",O);I.append("g").attr("class","vertical").selectAll(".vertical").data(W(1,q/f)).enter().append("line").attr("x1",t=>t*f).attr("y1",0).attr("x2",t=>t*f).attr("y2",O);I.append("g").attr("class","horizontal").selectAll(".horizontal").data(W(1,O/f)).enter().append("line").attr("x1",0).attr("y1",t=>t*f).attr("x2",q).attr("y2",t=>t*f);const J=I.append("g").selectAll("line").data([r[0],r[2]]).enter().append("line").attr("class","segment").attr("x1",t=>t.x).attr("y1",t=>t.y).attr("x2",t=>r[t.index+1].x).attr("y2",t=>r[t.index+1].y);I.selectAll("circle").data(r).enter().append("circle").attr("cx",t=>t.x).attr("cy",t=>t.y).attr("r",m).call(G);const K=I.append("g").selectAll("circle").data(c).enter().append("circle").attr("class","intersection").classed("hidden",!0).attr("cx",t=>t[0]).attr("cy",t=>t[1]).attr("r",5);function Q({x:t,y:n},o){const g=S(Math.max(m,Math.min(q-m,t)),f),e=S(Math.max(m,Math.min(O-m,n)),f);r[o.index].x=o.x=g,r[o.index].y=o.y=e,J.filter((a,y)=>o.index<2?y===0:y===1).attr("x1",a=>a.x).attr("y1",a=>a.y).attr("x2",a=>r[a.index+1].x).attr("y2",a=>r[a.index+1].y),H(this).attr("cx",o.x).attr("cy",o.y);const u=X(r[0].x,r[0].y,r[1].x,r[1].y,r[2].x,r[2].y,r[3].x,r[3].y);K.data(c).attr("cx",a=>a[0]).attr("cy",a=>a[1]),u===0?K.classed("hidden",!0):u===1?K.filter((a,y)=>y===0).classed("hidden",!1):u===2&&K.classed("hidden",!1)}function S(t,n){return t%n<n/2?t-t%n:t+n-t%n}
