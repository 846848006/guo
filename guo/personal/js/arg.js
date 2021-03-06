/*

  arg.js - v1.3.1
  JavaScript URL argument processing once and for all.

  by Mat Ryer and Ryan Quinn
  Copyright (c) 2015 Stretchr, Inc.

  Please consider promoting this project if you find it useful.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
  to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies
  or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
  DEALINGS IN THE SOFTWARE.

*/
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(9(E){E.14=9(){5 4=9(){6 4.15.1l(E,a)};4.1m="1.2.0";4.w=9(s){8(!s)6{};8(s.c("=")===-1&&s.c("&")===-1)6{};s=4.F(s);5 7={};5 G=s.H("&");I(5 L J G){8(G.K(L)){5 M=G[L].H("=");5 f=16(M[0]),e=4.17(M[1]);4.x(7,f,e)}}6 7};4.17=9(s){18(s&&s.c("+")>-1){s=s.19("+"," ")};s=16(s);6 s};4.x=9(7,g,d){5 1a=h d!=="i";5 r=-1;5 N={\'O\':O,\'P\':P,\'Q\':Q};8(h g==\'1b\'||1n.1o(g)==\'[R 1p]\'){r=g.S(/[\\.\\[]/)}8(r===-1){8(4.1c){d=d&&!1q(d)?+d:d===\'i\'?i:N[d]!==i?N[d]:d}6 1a?(7[g]=d):7[g]}5 o=g.t(0,r);5 j=g.t(r+1);T(g.1r(r)){u\'[\':7[o]=7[o]||[];j=j.19(\']\',\'\');8(j.S(/[\\.\\[]/)===-1){j=1s(j,10)}6 4.x(7[o],j,d);u\'.\':7[o]=7[o]||{};6 4.x(7[o],j,d)}6 7};4.v=9(7,y){T(h(7)){u"R":5 b=[];5 z;I(5 f J 7){8(!7.K(f))1d;5 e=7[f];8(h(f)==="i"||f.l===0||h(e)==="i"||e===Q||e.l===0)1d;z=y?y+"."+f:f;8(h 7.l!=="i"){z=y?y+"["+f+"]":f}8(h e==="R"){b.m(4.v(e,z))}1t{b.m(U(z)+"="+U(e))}}6 b.1e("&")}6 U(7)};4.1u=9(){5 A=(4.1f?4.V:4.n);5 b=[W.1v,A];5 B={};T(a.l){u 1:b.m(4.v(a[0]));1g;u 2:b[0]=4.X(a[0]);B=4.w(a[0]);B=4.1h(B,a[1]);b.m(4.v(B));1g;u 3:b[0]=4.X(a[0]);b[1]=4.n;b.m(4.v(a[1]));(h(a[2])==="1b")?b.m(4.q):b.m(4.V);b.m(4.v(a[2]))}5 s=b.1e("");8(s.c(A)==s.l-A.l){s=s.t(0,s.l-A.l)}6 s};4.1f=P;4.n="?";4.q="#";4.V="#?";4.1c=O;4.C=9(){5 1i=4.w(4.Y()+"&"+4.Z());6 4.11?4.11:4.11=1i};4.15=9(g,1j){5 e=4.x(4.C(),g);6 h(e)==="i"?1j:e};4.1w=9(){6 4.12?4.12:4.12=4.w(4.Y())};4.1k=9(){6 4.13?4.13:4.13=4.w(4.Z())};4.Y=9(){6 4.F(W.S)};4.Z=9(){6 4.F(W.1k)};4.F=9(s){8(s.c(4.n)>-1)s=s.H(4.n)[1];8(s.c(4.q)>-1)s=s.H(4.q)[1];8(s.c("=")===-1&&s.c("&")===-1)6"";18(s.c(4.q)==0||s.c(4.n)==0)s=s.t(1);6 s};4.X=9(p){8(p.c(4.n)>-1)p=p.t(0,p.c(4.n));8(p.c(4.q)>-1)p=p.t(0,p.c(4.q));6 p};4.1h=9(){5 C={};I(5 D J a){8(a.K(D)){I(5 k J a[D]){8(a[D].K(k)){C[k]=a[D][k]}}}}6 C};6 4};E.4=14()})(1x);',62,96,'||||Arg|var|return|obj|if|function|arguments|segs|indexOf|value|val|key|selector|typeof|undefined|nextSelector||length|push|querySeperator|currentRoot||hashSeperator|selectorBreak||substr|case|stringify|parse|_access|keyPrefix|thisKey|sep|args|all|ai|global|_cleanParamStr|pairs|split|for|in|hasOwnProperty|pi|kvsegs|coerce_types|true|false|null|object|search|switch|encodeURIComponent|hashQuerySeperator|location|_cleanPath|querystring|hashstring||_all|_query|_hash|MakeArg|get|decodeURIComponent|__decode|while|replace|shouldSet|string|coerceMode|continue|join|urlUseHash|break|merge|merged|def|hash|apply|version|toString|call|String|isNaN|charAt|parseInt|else|url|pathname|query|window'.split('|'),0,{}));