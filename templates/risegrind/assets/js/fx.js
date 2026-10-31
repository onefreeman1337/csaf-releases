/* ============================================================
   WEBGL TEMPLATE - MOTION ENGINE
   ------------------------------------------------------------
   index.html defines  window.SITE = { email, heroFrag, breakFrag }
   before loading this file. Everything else is automatic:
   hero WebGL, story breaks, masked reveals, velocity marquee,
   pinned gallery, scroll progress bar and the contact form.

   Native scrolling only. No dependencies. No build step.
   Every GLSL scene below is named - use the name in a section's
   data-break="" attribute to render it there.
   ============================================================ */
(function(){
  var SITE = window.SITE || {};
  var yearEl=document.getElementById('year'); if(yearEl) yearEl.textContent=new Date().getFullYear();
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var menuBtn=document.getElementById('menuBtn'), navLinks=document.getElementById('navLinks');
  if(menuBtn&&navLinks){
    menuBtn.addEventListener('click',function(){ navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ navLinks.classList.remove('open'); }); });
  }

  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* GLSL prelude shared by all scenes */
  var GLPRE=
    '#extension GL_OES_standard_derivatives : enable\n'+
    '#ifdef GL_FRAGMENT_PRECISION_HIGH\n'+
    'precision highp float;\n'+
    '#else\n'+
    'precision mediump float;\n'+
    '#endif\n'+
    'uniform float uT;uniform float uProg;uniform vec2 uRes;'+
    'uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;'+
    'float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}'+
    'float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);'+
    'float a=hash21(i),b=hash21(i+vec2(1.0,0.0)),c=hash21(i+vec2(0.0,1.0)),d=hash21(i+vec2(1.0,1.0));'+
    'return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}'+
    'float fbm(vec2 p){float s=0.0,a=0.5;for(int i=0;i<4;i++){s+=a*vnoise(p);p*=2.03;a*=0.5;}return s;}'+
    'mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}'+
    'vec2 pixUV(float minC){vec2 uv=gl_FragCoord.xy/uRes;float cells=mix(minC,3200.0,smoothstep(0.0,1.0,uProg));'+
    'float asp=uRes.x/uRes.y;vec2 n=vec2(cells*asp,cells);return (floor(uv*n)+0.5)/n;}'+
    /* Shared cinematic finish. Every scene ends with fxGrade(col) so the whole
       site grades the same way: highlight bloom, a filmic S-curve, split-toning
       into the brand hues, fine grain, and a soft optical vignette. Reads off
       gl_FragCoord so it never depends on a local uv being in scope. */
    /* FX-REALISM:BEGIN - lighting + antialiasing helpers (additive; no existing
       scene changes behaviour unless it opts in by calling these). */
    /* leading \n matters: the previous helper ends without one, and a '#'
       that does not start a line is a compile error, not a warning */
    '\n#ifdef GL_OES_standard_derivatives\n'+
    'float aa(float d){float w=fwidth(d);return smoothstep(w,-w,d);}'+
    'float aaBand(float d,float h){return aa(abs(d)-h);}\n'+
    '#else\n'+
    'float aa(float d){return smoothstep(0.0015,-0.0015,d);}'+
    'float aaBand(float d,float h){return smoothstep(0.0015,-0.0015,abs(d)-h);}\n'+
    '#endif\n'+
    /* normal from four height samples; s scales how pronounced the relief is */
    'vec3 nrmH(float hL,float hR,float hD,float hU,float s){'+
    'return normalize(vec3((hL-hR)*s,(hD-hU)*s,1.0));}'+
    /* Lambert + Blinn-Phong + Fresnel. gloss ~8 matte, ~120 polished. */
    'vec3 lit(vec3 albedo,vec3 n,vec3 L,vec3 lcol,float gloss,float specAmt){'+
    'vec3 V=vec3(0.0,0.0,1.0);'+
    'vec3 H=normalize(L+V);'+
    'float dif=max(dot(n,L),0.0);'+
    'float sp=pow(max(dot(n,H),0.0),gloss)*specAmt;'+
    'float fres=pow(1.0-max(dot(n,V),0.0),4.0);'+
    'return albedo*(0.22+0.78*dif)+lcol*sp+lcol*fres*0.16;}'+
    /* contact darkening - real surfaces are dark where they meet */
    'float ao(float occ,float strength){return 1.0-clamp(occ,0.0,1.0)*strength;}'+
    /* FX-REALISM:END */
    'vec3 fxGrade(vec3 c){'+
    'vec2 sc=gl_FragCoord.xy/uRes;'+
    'float lum=dot(c,vec3(0.299,0.587,0.114));'+
    /* Bloom was 0.55 from a 0.45 threshold, which spread a soft halo over any
       moderately bright pixel and was quietly softening EVERY scene on the site.
       Pulled back and raised so only genuine highlights bloom — this is the
       cheapest sharpness win available and it applies to all 112 scenes. */
    'c+=c*smoothstep(0.58,1.0,lum)*0.32;'+                       /* bloom on the highlights */
    /* clamp before the S-curve: c*c*(3-2c) turns NEGATIVE past 1.5, so bloomed
       pixels were inverting and putting cold cores inside bright highlights */
    'vec3 cs=clamp(c,0.0,1.0);'+
    'c=mix(c,cs*cs*(3.0-2.0*cs),0.44);'+                         /* filmic contrast */
    'c=mix(c,c*mix(uC3,uC1,smoothstep(0.0,0.55,lum)),0.10);'+    /* split-tone shadows/highs */
    'float g=hash21(sc*uRes+fract(uT*37.0)*141.0);'+
    'c+=(g-0.5)*0.034;'+                                          /* fine grain */
    'float v=smoothstep(1.30,0.28,length(sc-0.5));'+
    'c*=0.80+0.20*v;'+                                            /* optical falloff */
    'c+=vec3(0.008,0.007,0.011);'+                                /* lift crushed blacks */
    'return c;}';

  /* FX-SCENES:BEGIN — full-screen WebGL story scenes.
     Each is a complete fragment shader using the GLPRE helpers plus uT (wrapped
     clock), uProg (0→1 as the section crosses the viewport centre) and uC1/uC2/uC3
     (the site's own brand colours). A demo picks one per <section class="story-break"
     data-break="NAME">. Written once, tinted per brand — that's why every demo can
     have four of these without four times the code. */

  /* read --c1/--c2/--c3 off :root so the scenes match whatever brand this page is */
  function hexVec(v, fallback){
    v=(v||'').trim();
    var m=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
    if(m){
      var s=m[1]; if(s.length===3) s=s[0]+s[0]+s[1]+s[1]+s[2]+s[2];
      var n=parseInt(s,16);
      return new Float32Array([((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255]);
    }
    var rgb=/rgba?\(([^)]+)\)/i.exec(v);
    if(rgb){
      var a=rgb[1].split(',').map(parseFloat);
      if(a.length>=3) return new Float32Array([a[0]/255,a[1]/255,a[2]/255]);
    }
    return new Float32Array(fallback);
  }
  var CS=getComputedStyle(document.documentElement);
  var BRAND=[
    hexVec(CS.getPropertyValue('--c1'),[1.0,0.18,0.52]),
    hexVec(CS.getPropertyValue('--c2'),[0.20,0.90,0.82]),
    hexVec(CS.getPropertyValue('--c3'),[0.64,0.29,1.0])
  ];

  var SCENES={

  /* AURORA — polar light curtains with vertical striations, rising into view */
  aurora:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0);float t=uT*0.12;'+
    'vec3 col=vec3(0.018,0.014,0.032);'+
    'for(int i=0;i<5;i++){float s=float(i);'+
    'float w=fbm(vec2(p.x*1.6+s*2.3,t+s*0.7));'+
    'float y=p.y+0.28*sin(p.x*2.1+t*1.4+s*1.9)+(s-2.0)*0.10+(w-0.5)*0.35;'+
    'float band=exp(-abs(y)*7.0);'+
    'float striate=0.55+0.45*fbm(vec2(p.x*9.0+s*4.0,t*2.0));'+
    'vec3 hue=mix(uC1,uC2,fract(s*0.37+t*0.15));hue=mix(hue,uC3,0.35+0.35*sin(s*1.3+t));'+
    'col+=hue*band*striate*0.8;}'+
    'col*=smoothstep(0.0,0.85,uProg);'+
    'vec2 gp=p*36.0;float h=hash21(floor(gp));'+
    'col+=vec3(0.9)*smoothstep(0.09,0.0,length(fract(gp)-0.5))*step(0.985,h)*(0.5+0.5*sin(uT*3.0+h*50.0));'+
    'float vig=smoothstep(1.25,0.25,length(uv-0.5));col*=0.35+0.65*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* BLOOM — nested petal rings unfurling from the centre */
  bloom:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.2;'+
    'float r=length(p),a=atan(p.y,p.x),t=uT*0.25;'+
    'float open=smoothstep(0.0,0.9,uProg);'+
    'vec3 col=vec3(0.018,0.013,0.020);'+
    'for(int i=0;i<4;i++){float s=float(i);'+
    'float petals=5.0+s*2.0;float rt=t*(0.25+s*0.12)+s*0.8;'+
    'float lobe=0.34+0.20*cos(petals*(a+rt));'+
    'float R=lobe*(0.38+s*0.17)*open;'+
    'float d=abs(r-R);'+
    'vec3 hue=mix(uC1,uC2,s/3.0);hue=mix(hue,uC3,0.30+0.30*sin(t+s));'+
    'col+=hue*smoothstep(0.032,0.0,d)*1.15;'+
    'col+=hue*exp(-d*9.0)*0.22;}'+
    'vec2 gp=p*22.0;float h=hash21(floor(gp));'+
    'col+=uC3*smoothstep(0.10,0.0,length(fract(gp)-0.5))*step(0.972,h)*0.55*open;'+
    'col+=uC1*exp(-r*3.5)*0.18*open;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* SILK — folded satin with a travelling specular sheen */
  silk:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*1.6;float t=uT*0.09;'+
    'vec2 q=vec2(fbm(p*1.3+vec2(t,-t*0.6)),fbm(p*1.3+vec2(3.1,1.7)-t*0.8));'+
    'vec2 r2=vec2(fbm(p*1.1+2.4*q+vec2(1.2,4.4)+t*0.5),fbm(p*1.1+2.4*q+vec2(6.3,2.2)-t*0.35));'+
    'float f=fbm(p+2.6*r2+t);'+
    'float drape=f*0.65+r2.x*0.35;'+
    'float sheen=pow(clamp(sin((drape*2.1+t*1.1)*3.14159),0.0,1.0),3.0);'+'float crease=smoothstep(0.30,0.0,abs(fract(drape*3.0)-0.5));'+
    'vec3 col=mix(uC1*0.16,uC2*0.42,smoothstep(0.28,0.88,f));'+
    'col=mix(col,uC3*0.34,clamp(r2.y*0.8,0.0,1.0)*0.45);'+'col*=0.55+0.55*smoothstep(0.0,1.0,drape);'+'col*=1.0-crease*0.30;'+
    'col+=mix(uC3,vec3(1.0),0.5)*sheen*0.44;'+
    'col*=mix(0.22,1.0,smoothstep(0.0,0.8,uProg));'+
    'float vig=smoothstep(1.3,0.3,length(uv-0.5));col*=0.4+0.6*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* EMBER — heat haze and rising sparks over a warm floor glow */
  ember:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0);float t=uT*0.35;'+
    'vec3 col=mix(vec3(0.020,0.012,0.010),uC1*0.55,smoothstep(0.7,-0.5,p.y));'+
    'col=mix(col,uC2*0.5,smoothstep(0.2,-0.5,p.y)*0.6);'+
    'float sh=fbm(vec2(p.x*6.0,p.y*3.0-t*1.6));col+=uC1*sh*0.10;'+
    'for(int i=0;i<3;i++){float s=float(i);'+
    'vec2 gp=vec2(p.x*(14.0+s*7.0),p.y*(14.0+s*7.0)+t*(2.2+s*1.1));'+
    'vec2 cell=floor(gp);float h=hash21(cell+s*31.0);'+
    'vec2 f2=fract(gp)-0.5;f2.x+=0.3*sin(t*2.0+h*30.0);'+
    'float spark=smoothstep(0.16,0.0,length(f2))*step(0.955,h);'+
    'col+=mix(uC1,uC3,h)*spark*(1.6-s*0.35);}'+
    'col*=smoothstep(0.0,0.75,uProg);'+
    'float vig=smoothstep(1.3,0.25,length(uv-0.5));col*=0.35+0.65*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* PRISM — a white beam splitting into a spectrum, bent by soft turbulence */
  prism:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT*0.18;'+
    'p*=rot(sin(t*0.5)*0.35);'+
    'vec3 col=vec3(0.018,0.018,0.028);'+
    'for(int i=0;i<7;i++){float s=float(i);'+
    'float off=(s-3.0)*0.055;'+
    'float w=fbm(vec2(p.x*2.0+s,t*1.2));'+
    'float y=p.y+off+0.18*sin(p.x*1.5+t*1.6+s*0.5)+(w-0.5)*0.12;'+
    'float beam=exp(-abs(y)*16.0);'+
    'vec3 hue=0.5+0.5*cos(6.283*(s/7.0)+vec3(0.0,2.09,4.19));'+
    'hue=mix(hue,mix(uC1,uC2,s/6.0),0.45);'+
    'col+=hue*beam*0.6;}'+
    'float core=exp(-length(p+vec2(0.85,0.0))*5.0);'+
    'col+=vec3(1.0)*core*0.7;'+
    'col*=smoothstep(0.0,0.65,uProg);'+
    'float vig=smoothstep(1.35,0.3,length(uv-0.5));col*=0.35+0.65*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* RIPPLE — overlapping water caustics */
  ripple:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT*0.5;'+
    'float acc=0.0;'+
    'for(int i=0;i<4;i++){float s=float(i);'+
    'vec2 c=vec2(sin(t*0.3+s*2.1)*0.6,cos(t*0.24+s*1.7)*0.4);'+
    'float d=length(p-c);'+
    'acc+=sin(d*14.0-t*2.2+s*1.3)/(1.0+d*3.0);}'+
    'float caust=pow(max(acc*0.35+0.5,0.0),3.0);'+
    'vec3 col=mix(uC1*0.26,uC2,caust);'+
    'col=mix(col,uC3,caust*caust*0.5);'+
    'col+=vec3(1.0)*pow(caust,6.0)*0.45;'+
    'col*=smoothstep(0.0,0.8,uProg);'+
    'float vig=smoothstep(1.3,0.3,length(uv-0.5));col*=0.35+0.65*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* PULSE — a heartbeat trace with shockwave rings on the beat */
  pulse:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT;'+
    'vec3 col=vec3(0.020,0.022,0.026);'+
    'float beat=fract(t*0.55);'+
    'for(int i=0;i<3;i++){float s=float(i);'+
    'float rr=fract(beat+s*0.333);'+
    'float d=abs(length(p)-rr*1.5);'+
    'col+=mix(uC1,uC2,s*0.5)*smoothstep(0.05,0.0,d)*(1.0-rr)*0.95;}'+
    'float ph=fract(p.x*0.5+0.5-t*0.25)-0.5;'+
    'float spike=exp(-pow(ph*16.0,2.0));'+
    'float wave=sin(p.x*7.0+t*3.0)*0.06+spike*0.5*sin(ph*40.0);'+
    'float d2=abs(p.y-wave);'+
    'col+=uC3*smoothstep(0.026,0.0,d2)*1.5;'+
    'col+=uC3*exp(-d2*10.0)*0.28;'+
    'col*=smoothstep(0.0,0.7,uProg);'+
    'float vig=smoothstep(1.35,0.3,length(uv-0.5));col*=0.4+0.6*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* BLADE — a mirror-polish blend with a blade of light sweeping across it.
     This replaces the old barber-pole scene. */
  blade:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT*0.25;'+
    'float open=smoothstep(0.0,0.85,uProg);'+
    'float g=smoothstep(-0.9,0.9,p.y+0.15*sin(p.x*2.0+t));'+
    'vec3 col=mix(uC1*0.13,uC2*0.55,g);'+
    'col+=uC3*fbm(p*3.0+t*0.5)*0.10;'+
    'float sweep=fract(t*0.5);float lx=sweep*2.8-1.4;'+
    'float d=abs(p.x-lx-0.12*sin(p.y*3.0+t*2.0));'+
    'col+=vec3(1.0)*smoothstep(0.018,0.0,d)*open*1.3;'+
    'col+=uC3*exp(-d*7.0)*0.40*open;'+
    'float comb=0.5+0.5*sin(p.x*70.0+t*1.5);col+=uC3*comb*0.035*g;'+
    'col+=vec3(1.0)*fbm(p*7.0+t)*0.05;'+
    'col*=open;'+
    'float vig=smoothstep(1.35,0.3,length(uv-0.5));col*=0.35+0.65*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* LIQUID — a full-frame sheet of iridescent liquid metal, folding and flowing.
     (Earlier version used tight metaballs — they read as small blown-out dots on
     black. Wide soft falloff + a smooth surface term fills the frame instead.) */
  /* Domain-warped molten flow — the same technique as the flagship hero, which
     is the look she already signed off on. Two earlier attempts here (tight
     metaballs, then contour banding) read as blown-out dots and a topographic
     map respectively; warped fbm gives organic flow with nowhere to go wrong,
     and a single narrow sheen band supplies the molten highlight. */
  liquid:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*1.7;float t=uT*0.06;'+
    'vec2 q=vec2(fbm(p+vec2(t,-t*0.7)),fbm(p+vec2(4.2,1.3)-t));'+
    'vec2 r=vec2(fbm(p+2.2*q+vec2(1.7,9.2)+t*0.6),fbm(p+2.2*q+vec2(8.3,2.8)-t*0.4));'+
    'float f=fbm(p+2.5*r+t);f=f*0.5+0.5;'+
    'vec3 base=vec3(0.022,0.020,0.030);'+
    'vec3 col=mix(uC1*0.5,uC2,smoothstep(0.30,0.92,f));'+
    'col=mix(col,uC3,clamp(smoothstep(0.55,1.0,r.y*0.5+0.5),0.0,1.0)*0.55);'+
    'col=mix(base,col,smoothstep(0.06,0.85,f)*0.95);'+
    'float sheen=pow(max(sin((f*3.0+r.x*1.5+t*2.0)*3.14159),0.0),18.0);'+
    'col+=vec3(1.0)*sheen*0.30;'+
    'col*=smoothstep(0.0,0.8,uProg);'+
    'float vig=smoothstep(1.4,0.25,length(uv-0.5));col*=0.4+0.6*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* DRIFT — soft petals / flour / dust tumbling through depth layers */
  drift:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0);float t=uT*0.22;'+
    'vec3 col=mix(uC1*0.10,uC2*0.22,uv.y);'+
    'for(int i=0;i<4;i++){float s=float(i);'+
    'float sc=8.0+s*6.0;'+
    'vec2 gp=vec2(p.x*sc+sin(t*(0.6+s*0.2))*1.5,p.y*sc+t*(1.4+s*0.9));'+
    'vec2 cell=floor(gp);float h=hash21(cell+s*17.0);'+
    'vec2 f2=fract(gp)-0.5;f2*=rot(h*6.283+t);'+
    'float d=length(f2*vec2(1.0,1.9));'+
    'float sp=smoothstep(0.34,0.02,d)*step(0.90,h);'+
    'col+=mix(uC1,uC3,fract(h*7.0))*sp*(0.9-s*0.15);}'+
    'col*=smoothstep(0.0,0.75,uProg);'+
    'float vig=smoothstep(1.25,0.3,length(uv-0.5));col*=0.4+0.6*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* LAYERS — strata stacking up one at a time, with a dusting of sugar */
  layers:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT*0.2;'+
    'float open=smoothstep(0.0,0.9,uProg);'+
    'vec3 col=vec3(0.028,0.020,0.018);'+
    'for(int i=0;i<5;i++){float s=float(i);'+
    'float appear=smoothstep(s*0.15,s*0.15+0.30,open);'+
    'float yc=-0.72+s*0.30;'+
    'float wob=0.035*sin(p.x*4.0+t*1.5+s*1.2);'+
    'float band=smoothstep(0.13,0.10,abs(p.y-yc-wob))*step(abs(p.x),0.86);'+
    'vec3 hue=mix(uC1,uC2,s/4.0);'+
    'col+=hue*band*appear*0.95;'+
    'float cream=smoothstep(0.035,0.020,abs(p.y-yc-0.15-wob))*step(abs(p.x),0.86);'+
    'col+=uC3*cream*appear;}'+
    'vec2 gp=p*26.0;float h=hash21(floor(gp));'+
    'col+=vec3(1.0)*smoothstep(0.10,0.0,length(fract(gp)-0.5))*step(0.975,h)*0.55*open;'+
    'float vig=smoothstep(1.35,0.3,length(uv-0.5));col*=0.4+0.6*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* ---- LASH-STUDIO SCENES (only the two lash pages use these) ---- */

  /* EYE — an extreme closeup: fibrous iris, limbal ring, catchlight,
     and a procedural lash comb along the upper lid. */
  eye:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT;'+
    'float open=smoothstep(0.0,0.55,uProg);'+
    'vec3 col=mix(vec3(0.055,0.032,0.048),vec3(0.020,0.012,0.020),smoothstep(0.2,1.5,length(p)));'+
    'float blink=1.0-0.92*pow(max(sin(t*0.42),0.0),42.0);'+                 /* rare blink */
    'float lidT=(0.50+0.03*sin(t*0.6))*open*blink;'+
    'float lidB=0.34*open*blink;'+
    'float xs=clamp(1.0-p.x*p.x*0.92,0.0,1.0);'+
    'float eTop=lidT*xs,eBot=-lidB*xs;'+
    'float inEye=smoothstep(0.012,0.0,max(p.y-eTop,eBot-p.y))*step(abs(p.x),1.04);'+
    'vec2 ip=p-vec2(0.0,0.055);float r=length(ip),a=atan(ip.y,ip.x);'+
    'float fib=0.5+0.5*sin(a*74.0+fbm(vec2(a*5.0,r*9.0))*7.0);'+            /* iris fibres */
    'float fib2=0.5+0.5*sin(a*152.0+1.7);'+
    'vec3 iris=mix(uC3*0.55,uC1,fib*0.70+fib2*0.30);'+
    'iris=mix(iris,uC2,smoothstep(0.30,0.09,r)*0.55);'+
    'iris*=0.50+0.80*smoothstep(0.34,0.11,r);'+
    'iris*=1.0-smoothstep(0.285,0.335,r)*0.78;'+                            /* limbal ring */
    'float pup=smoothstep(0.140+0.014*sin(t*0.8),0.128,r);'+
    'iris=mix(iris,vec3(0.015,0.010,0.016),pup);'+
    'iris+=vec3(1.0)*smoothstep(0.058,0.0,length(ip-vec2(-0.105,0.115)))*1.0;'+   /* catchlight */
    'iris+=vec3(0.95,0.88,0.85)*smoothstep(0.030,0.0,length(ip-vec2(0.125,-0.095)))*0.40;'+
    'vec3 sclera=mix(vec3(0.88,0.83,0.83),vec3(0.55,0.44,0.48),smoothstep(0.18,1.0,abs(p.x)));'+
    'sclera-=vec3(0.0,0.06,0.05)*smoothstep(0.55,1.0,abs(p.x));'+
    'vec3 eyeCol=mix(sclera,iris,smoothstep(0.345,0.335,r));'+
    'col=mix(col,eyeCol,inEye);'+
    'col*=1.0-smoothstep(0.10,0.0,eTop-p.y)*0.55*inEye;'+                   /* lid shadow */
    'float ld=p.y-eTop;'+                                                    /* --- lashes --- */
    'float cells=26.0;float cu=p.x*cells;float id=floor(cu);'+
    'float h=hash21(vec2(id,4.0));'+
    'float fx=(fract(cu)-0.5)/cells;'+
    'float lenL=(0.20+0.16*xs+h*0.07)*open;'+
    'float tt=clamp(ld/max(lenL,0.001),0.0,1.0);'+
    'float lean=(0.30+h*0.55)*p.x;'+
    'float bend=lean*tt*tt*0.42;'+
    'float wdt=0.0075*(1.0-tt*0.92)+0.0012;'+
    'float lash=smoothstep(wdt,0.0,abs(fx-bend))*step(0.0,ld)*step(ld,lenL)*step(0.15,h)*step(abs(p.x),0.97);'+
    'col=mix(col,vec3(0.045,0.026,0.036),lash*0.96);'+
    'col+=uC1*lash*0.30*smoothstep(0.0,0.7,tt);'+                           /* gloss on the tips */
    'float lower=eBot-p.y;'+                                                 /* lower lashes */
    'float lenB=(0.075+0.05*xs)*open;'+
    'float tb=clamp(lower/max(lenB,0.001),0.0,1.0);'+
    'float lash2=smoothstep(0.006*(1.0-tb),0.0,abs(fx-lean*tb*tb*0.25))*step(0.0,lower)*step(lower,lenB)*step(0.45,h)*step(abs(p.x),0.93);'+
    'col=mix(col,vec3(0.05,0.03,0.04),lash2*0.85);'+
    'col+=uC1*smoothstep(0.020,0.0,abs(p.y-eTop))*step(abs(p.x),1.0)*0.35*open;'+ /* liner along the lid */
    'vec2 gp=p*24.0+vec2(t*0.25,-t*0.4);float gh=hash21(floor(gp));'+
    'col+=uC1*smoothstep(0.11,0.0,length(fract(gp)-0.5))*step(0.978,gh)*0.6*open;'+
    'float vig=smoothstep(1.45,0.25,length(uv-0.5));col*=0.35+0.65*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* LINER — a winged eyeliner stroke painting itself, wet and glossy,
     with the brush tip glinting at the leading edge. */
  liner:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT*0.5;'+
    'vec3 col=mix(vec3(0.072,0.044,0.062),vec3(0.018,0.011,0.019),smoothstep(0.1,1.5,length(p)));'+'col+=uC1*0.055*exp(-abs(p.y+0.02)*2.0)*exp(-abs(p.x)*0.7);'+
    'float draw=smoothstep(0.02,0.92,uProg);'+
    'float best=9.9;float bt=0.0;'+
    'vec2 prev=vec2(-0.95,-0.10);'+
    'for(int i=1;i<=40;i++){float u=float(i)/40.0;'+                          /* wing as joined segments */
    'vec2 cur=vec2(mix(-0.95,0.92,u),-0.10+0.63*u*u*u-0.16*sin(u*3.14159));'+
    'vec2 pa=p-prev,ba=cur-prev;'+
    'float hseg=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.0,1.0);'+
    'float d=length(pa-ba*hseg);'+
    'if(d<best){best=d;bt=(float(i-1)+hseg)/40.0;}'+
    'prev=cur;}'+
    'float grow=step(bt,draw);'+
    'float wid=(0.030+0.055*bt*bt)*(1.0-0.72*smoothstep(0.80,1.0,bt));'+     /* thickens, then points */
    'float stroke=smoothstep(wid,wid*0.35,best)*grow;'+
    'vec3 ink=mix(vec3(0.030,0.020,0.030),uC3*0.5,0.35);'+
    'col=mix(col,ink,stroke);'+
    'float gloss=smoothstep(wid*0.85,0.0,abs(best-wid*0.42))*grow;'+         /* wet highlight */
    'col+=mix(uC1,vec3(1.0),0.55)*gloss*0.55;'+
    'float tipx=mix(-0.95,0.92,draw);'+
    'float tipy=-0.10+0.63*draw*draw*draw-0.16*sin(draw*3.14159);'+
    'float tip=exp(-length(p-vec2(tipx,tipy))*13.0);'+
    'col+=vec3(1.0,0.94,0.90)*tip*0.85*step(draw,0.995);'+                   /* brush tip glint */
    'col+=uC1*exp(-length(p-vec2(tipx,tipy))*4.0)*0.30*step(draw,0.995);'+
    'for(int i=0;i<16;i++){float s=float(i);'+'float u=s/15.0;'+'float lx=mix(-0.86,0.72,u);'+'float ly=-0.10+0.63*u*u*u-0.16*sin(u*3.14159);'+'float hh=hash21(vec2(s,4.0));'+'float lang=1.24+0.42*u+(hh-0.5)*0.26;'+'vec2 ldir=vec2(cos(lang),sin(lang));'+'float LL=0.26+hh*0.14;'+'vec2 lpa=p-vec2(lx,ly);'+'float al=clamp(dot(lpa,ldir),0.0,LL);'+'float dd=length(lpa-ldir*al-vec2(0.055*(al/LL)*(al/LL),0.0));'+'float ww=0.0105*(1.0-al/LL)+0.0018;'+'float lash=smoothstep(ww,0.0,dd)*step(u,draw+0.06);'+'col=mix(col,vec3(0.16,0.10,0.13),lash);'+'col+=uC1*lash*1.15*smoothstep(0.10,1.0,al/LL);'+'col+=vec3(1.0,0.95,0.92)*lash*0.35*smoothstep(0.62,1.0,al/LL);}'+'float sheen=pow(clamp(0.5+0.5*sin(p.x*3.0-t*2.2),0.0,1.0),12.0);'+
    'col+=vec3(1.0)*sheen*stroke*0.22;'+
    'vec2 gp=p*20.0+vec2(-t*0.5,t*0.3);float h=hash21(floor(gp));'+
    'col+=uC1*smoothstep(0.12,0.0,length(fract(gp)-0.5))*step(0.980,h)*0.55*draw;'+
    'float vig=smoothstep(1.45,0.28,length(uv-0.5));col*=0.38+0.62*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* FANS — handmade volume fans drifting in and settling along the
     lash line one at a time, each a spray of fine tapered hairs. */
  fans:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT*0.4;'+
    'vec3 col=mix(vec3(0.070,0.042,0.060),vec3(0.018,0.011,0.019),smoothstep(0.1,1.4,length(p)));'+'col+=uC1*0.045*exp(-abs(p.y+0.18)*2.2);'+
    'float place=smoothstep(0.0,0.92,uProg);'+
    'for(int f=0;f<7;f++){float s=float(f);'+
    'float u=s/6.0;'+
    'float land=smoothstep(u*0.78,u*0.78+0.26,place);'+                      /* fans arrive in order */
    'vec2 home=vec2(mix(-0.80,0.80,u),-0.20+0.50*(1.0-pow(abs(u-0.5)*2.0,1.7)));'+
    'vec2 from=home+vec2(0.55*sin(s*2.3),0.95);'+
    'vec2 base=mix(from,home,land);'+
    'float wob=(1.0-land)*0.10;'+
    'base+=vec2(sin(t*2.0+s)*wob,cos(t*1.7+s)*wob);'+
    'float tilt=(u-0.5)*0.95;'+
    'for(int hI=0;hI<5;hI++){float hs=float(hI);'+                           /* 5 hairs per fan */
    'float sp=(hs-2.0)*0.155;'+
    'float ang=1.5708+tilt+sp;'+
    'vec2 dir=vec2(cos(ang),sin(ang));'+
    'float L=0.46+0.085*(2.0-abs(hs-2.0));'+
    'vec2 pa=p-base;'+
    'float along=clamp(dot(pa,dir),0.0,L);'+
    'vec2 curve=dir*along+vec2(1.0,0.0)*(0.16*sp*(along/L)*(along/L));'+     /* natural curl */
    'float d=length(pa-curve);'+
    'float w=0.0150*(1.0-along/L)+0.0026;'+
    'float hair=smoothstep(w,0.0,d)*land;'+
    'col=mix(col,vec3(0.125,0.080,0.100),hair*0.98);'+
    'col+=uC1*hair*1.05*smoothstep(0.15,1.0,along/L);}'+                     /* tip gloss */
    'col+=uC2*exp(-length(p-base)*46.0)*0.30*land;}'+                        /* adhesive point */
    'vec2 gp=p*22.0+vec2(t*0.3,t*0.5);float gh=hash21(floor(gp));'+
    'col+=mix(uC1,uC2,gh)*smoothstep(0.11,0.0,length(fract(gp)-0.5))*step(0.977,gh)*0.6*place;'+
    'float vig=smoothstep(1.45,0.26,length(uv-0.5));col*=0.36+0.64*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* BROW — a laminated brow: hairs seated in a real arch, messy at rest,
     brushed up and out along the tail as you scroll. */
  brow:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0)*2.0;float t=uT*0.35;'+
    'vec3 col=mix(vec3(0.060,0.036,0.050),vec3(0.018,0.011,0.018),smoothstep(0.1,1.5,length(p)));'+
    'float set=smoothstep(0.0,0.88,uProg);'+
    'float cells=70.0;'+
    'float u0=clamp((p.x+0.78)/1.56,0.0,1.0);'+
    'float cu=u0*cells;float id=floor(cu);'+
    'float u=clamp(id/cells,0.0,1.0);'+
    'float arch=-0.06+0.44*sin(3.14159*pow(u,0.72));'+                        /* rise then tail off */
    'float th=0.15*sin(3.14159*pow(u,0.62))*(1.0-0.52*u)+0.013;'+             /* thick body, fine tail */
    'col+=uC1*exp(-abs(p.y-arch)*4.5)*exp(-pow(abs(p.x)*1.15,2.0))*0.10;'+    /* skin behind it */
    'for(int k=0;k<4;k++){float fk=float(k);'+                                /* 4 hairs per column, or it reads as dashes */
    'float h1=hash21(vec2(id,9.0+fk*13.0));'+
    'float h2=hash21(vec2(id,23.0+fk*7.0));'+
    'float h3=hash21(vec2(id,41.0+fk*5.0));'+
    'vec2 base=vec2(mix(-0.78,0.78,u)+(h3-0.5)*0.012,arch-th*0.5+((fk+h1)/4.0)*th);'+
    'float rest=(h2-0.5)*2.3;'+
    'float groomed=mix(1.30,0.30,u)+(h1-0.5)*0.30;'+                          /* up at the head, out at the tail */
    'float ang=mix(rest,groomed,set);'+
    'vec2 dir=vec2(cos(ang),sin(ang));'+
    'float L=(0.115+h3*0.085)*(0.55+0.45*sin(3.14159*pow(u,0.6)));'+
    'vec2 pa=p-base;'+
    'float along=clamp(dot(pa,dir),0.0,L);'+
    'float curl=0.05*(along/max(L,1e-4))*(along/max(L,1e-4))*(1.0-set*0.6);'+
    'float d=length(pa-dir*along-vec2(0.0,1.0)*curl);'+
    'float w=0.0060*(1.0-along/max(L,1e-4))+0.0015;'+
    'float hair=smoothstep(w,0.0,d)*step(0.10,h1)*step(abs(p.x),0.84);'+
    'vec3 hc=mix(vec3(0.30,0.185,0.125),vec3(0.68,0.45,0.29),h2);'+
    'col=mix(col,hc,hair);'+
    'col+=uC1*hair*0.60*smoothstep(0.30,1.0,along/max(L,1e-4))*set;}'+
    'vec2 gp=p*20.0+vec2(-t*0.4,t*0.25);float gh=hash21(floor(gp));'+
    'col+=uC2*smoothstep(0.12,0.0,length(fract(gp)-0.5))*step(0.982,gh)*0.5*set;'+
    'float vig=smoothstep(1.45,0.28,length(uv-0.5));col*=0.36+0.64*vig;'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}',

  /* STEAM — volumetric vapour curling upward */
  steam:
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;'+
    'vec2 p=(uv-0.5)*vec2(asp,1.0);float t=uT*0.16;'+
    'float acc=0.0;'+
    'for(int i=0;i<4;i++){float s=float(i);'+
    'vec2 q=vec2(p.x*1.6+sin(t*1.1+s)*0.4,p.y*1.1-t*(1.0+s*0.35));'+
    'acc+=fbm(q*(1.4+s*0.5))*(0.5-s*0.09);}'+
    'float ch=smoothstep(0.25,0.95,acc);'+
    'vec3 col=mix(uC1*0.14,uC2*0.75,ch);'+
    'col=mix(col,uC3,pow(ch,3.0)*0.5);'+
    'col*=smoothstep(-0.9,0.55,p.y+acc*0.5);'+
    'col+=vec3(1.0)*pow(ch,7.0)*0.22;'+
    'col*=smoothstep(0.0,0.8,uProg);'+
    'col=fxGrade(col);gl_FragColor=vec4(col,1.0);}'

  };
  /* FX-SCENES:END */

  function makeGL(canvas,frag){
    var gl=canvas.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});
    if(!gl) return null;
    /* Must be requested BEFORE compiling anything, or the prelude's
       `#extension GL_OES_standard_derivatives : enable` is rejected and every
       fwidth() in the realism helpers fails to compile. */
    gl.getExtension('OES_standard_derivatives');
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);
      if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){console.warn('shader:',gl.getShaderInfoLog(o));return null;}return o;}
    var v=sh(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}');
    var f=sh(gl.FRAGMENT_SHADER,GLPRE+frag);
    if(!v||!f) return null;
    var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var uT=gl.getUniformLocation(pr,'uT'),uP=gl.getUniformLocation(pr,'uProg'),uR=gl.getUniformLocation(pr,'uRes');
    var u1=gl.getUniformLocation(pr,'uC1'),u2=gl.getUniformLocation(pr,'uC2'),u3=gl.getUniformLocation(pr,'uC3');
    return {draw:function(t,p){
      /* A canvas can opt into rendering below device resolution with
         data-scale="0.5". Needed for raymarched 3D scenes, which cost roughly
         30 full scene evaluations PER PIXEL — at DPR 2 that froze the renderer
         outright. Halving the scale is a 4x cut and is barely visible on a
         soft-lit background. Everything else keeps data-scale absent = 1. */
      var sc=parseFloat(canvas.getAttribute('data-scale'))||1;
      var dpr=Math.min(window.devicePixelRatio||1,2)*sc;
      var w=Math.max(2,Math.floor(canvas.clientWidth*dpr)),h=Math.max(2,Math.floor(canvas.clientHeight*dpr));
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
      gl.uniform1f(uT,t);gl.uniform1f(uP,p);gl.uniform2f(uR,w,h);
      /* brand colours straight from the site's CSS vars, so one scene library
         renders in every demo's own palette without forking the GLSL */
      gl.uniform3fv(u1,BRAND[0]);gl.uniform3fv(u2,BRAND[1]);gl.uniform3fv(u3,BRAND[2]);
      gl.drawArrays(gl.TRIANGLES,0,3);
    }};
  }

  var glOK=false, heroScene=null, breakScenes=[];
  if(!reduceMotion){
    try{
      var heroCv=document.getElementById('heroGL');
      if(heroCv && SITE.heroFrag){
        heroScene=makeGL(heroCv,SITE.heroFrag);
        if(heroScene){ glOK=true; document.documentElement.classList.add('gl-on'); }
      }
      document.querySelectorAll('.story-break').forEach(function(sec){
        var sc=null;
        /* data-break picks a scene: the site's own custom shader first (so a
           bespoke one-off still wins), then the shared library, then the legacy
           single breakFrag. */
        var key=sec.getAttribute('data-break')||'';
        var frag=(SITE.breakFrags&&SITE.breakFrags[key])||SCENES[key]||SITE.breakFrag;
        try{ if(frag) sc=makeGL(sec.querySelector('canvas'),frag); }catch(e){ sc=null; }
        if(!sc){ sec.classList.add('no-gl'); return; }
        breakScenes.push({sec:sec,scene:sc,on:false});
      });
      if(breakScenes.length){
        var bio=new IntersectionObserver(function(es){ es.forEach(function(e){ breakScenes.forEach(function(b){ if(b.sec===e.target) b.on=e.isIntersecting; }); }); },{rootMargin:'12% 0px'});
        breakScenes.forEach(function(b){ bio.observe(b.sec); });
      }
      var t0=performance.now(), hidden=false;
      document.addEventListener('visibilitychange',function(){ hidden=document.hidden; });
      (function glLoop(){
        if(!hidden){
          var t=((performance.now()-t0)/1000)%600;
          if(heroScene && window.scrollY<window.innerHeight*1.2){
            heroScene.draw(t, Math.min(window.scrollY/window.innerHeight,1));
          }
          breakScenes.forEach(function(b){
            if(!b.on) return;
            var r=b.sec.getBoundingClientRect();
            var mid=r.top+r.height/2, vc=window.innerHeight/2;
            var prog=1-Math.min(1,Math.abs(mid-vc)/(window.innerHeight*0.75));
            b.scene.draw(t,Math.max(0,Math.min(1,prog)));
          });
        }
        requestAnimationFrame(glLoop);
      })();
    }catch(err){ console.warn('WebGL unavailable:',err); }
  }
  if(!glOK){ document.querySelectorAll('.story-break').forEach(function(s){ s.classList.add('no-gl'); }); }

  /* word-split titles */
  if(!reduceMotion){
    document.querySelectorAll('.sec-head h2').forEach(function(h){
      var words=h.textContent.trim().split(/\s+/);
      h.textContent=''; h.classList.add('split');
      words.forEach(function(word,i){
        var w=document.createElement('span'); w.className='w';
        var wi=document.createElement('span'); wi.className='wi'; wi.textContent=word;
        wi.style.setProperty('--wd',(i*0.055)+'s');
        w.appendChild(wi); h.appendChild(w);
        if(i<words.length-1) h.appendChild(document.createTextNode(' '));
      });
    });
    var splitIO=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); splitIO.unobserve(e.target); } }); },{threshold:.35});
    document.querySelectorAll('h2.split').forEach(function(h){ splitIO.observe(h); });
    var mT=document.querySelector('.marquee-track'); if(mT) mT.style.animation='none';
  }

  /* progress + velocity marquee + pinned gallery */
  var progressBar=document.getElementById('progressBar');
  var mTrack=document.querySelector('.marquee-track');
  var workPin=document.getElementById('looks'), workTrack=document.getElementById('workTrack'), workProgress=document.getElementById('workProgress');
  var mx=0, lastY=window.scrollY, vel=0, skew=0;
  (function fxLoop(){
    var y=window.scrollY;
    vel+=((y-lastY)-vel)*0.12; lastY=y;
    var doc=document.documentElement;
    var p=Math.min(y/((doc.scrollHeight-window.innerHeight)||1),1);
    if(progressBar) progressBar.style.transform='scaleX('+p+')';
    if(!reduceMotion){
      if(mTrack){
        var half=mTrack.scrollWidth/2;
        if(half>0){
          mx+=-1.2-Math.max(-22,Math.min(22,vel*0.4));
          while(mx<=-half) mx+=half; while(mx>0) mx-=half;
          skew+=(Math.max(-10,Math.min(10,vel*0.35))-skew)*0.12;
          mTrack.style.transform='translate3d('+mx+'px,0,0) skewX('+skew+'deg)';
        }
      }
      if(workPin&&workTrack&&window.innerWidth>960){
        var r=workPin.getBoundingClientRect();
        var total=workPin.offsetHeight-window.innerHeight;
        var wp=Math.max(0,Math.min(1,-r.top/(total||1)));
        var travel=workTrack.scrollWidth-window.innerWidth;
        var wskew=Math.max(-3,Math.min(3,vel*0.09));
        if(travel>0) workTrack.style.transform='translate3d('+(-wp*travel)+'px,0,0) skewX('+wskew.toFixed(2)+'deg)';
        if(workProgress) workProgress.style.transform='scaleX('+wp+')';
      }
      v2Frame(y);
    }
    requestAnimationFrame(fxLoop);
  })();

  /* interactive 3D tilt + glare on cards (pointer devices, motion-safe) */
  if(!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.card, .quote').forEach(function(el){
      el.classList.add('tilt3d');
      var raf=null, rx=0, ry=0;
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        rx=(py-0.5)*-7; ry=(px-0.5)*9;
        el.style.setProperty('--gx',(px*100).toFixed(1)+'%');
        el.style.setProperty('--gy',(py*100).toFixed(1)+'%');
        if(raf) return;
        raf=requestAnimationFrame(function(){ raf=null;
          el.style.transform='perspective(760px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) translateY(-6px)';
        });
      });
      el.addEventListener('pointerenter',function(){ el.classList.add('tilting'); });
      el.addEventListener('pointerleave',function(){ el.classList.remove('tilting'); el.style.transform=''; if(raf){ cancelAnimationFrame(raf); raf=null; } });
    });
  }

  /* booking/contact form -> prefilled email */
  var form=document.getElementById('bookForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault(); var f=e.target;
      var svc=f.service?f.service.value:'';
      var subject=(SITE.formSubject||'Enquiry')+' — '+(svc||f.name.value);
      var lines=[];
      ['name','phone','service','date','notes'].forEach(function(k){ if(f[k]&&f[k].value) lines.push(k.charAt(0).toUpperCase()+k.slice(1)+': '+f[k].value); });
      window.location.href='mailto:'+(SITE.email||'')+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
    });
  }

  /* FX-V2-JS:BEGIN — synced into the standalone templates by
     shared/sync-standalone-fx.py. Edit here, then re-run that script. */
  /* ==========================================================
     FX v2 — the extra motion layer.
     Purely additive: injects its own elements, never edits the
     markup a demo ships with. Function declarations hoist, so
     v2Frame() is already defined when the fx loop first runs.
     ========================================================== */
  var spot=null, orbs=null, px=0.5, py=0.4, heroLayers=[], orbsOff=false, v2on=false;

  /* every frame: spotlight position, hero parallax, orb gating.
     fxLoop's first tick is synchronous — it fires before the setup below has
     run — so bail until v2on says the state actually exists. */
  function v2Frame(y){
    if(!v2on) return;
    if(spot){ spot.style.setProperty('--cx',(px*100).toFixed(2)+'%'); spot.style.setProperty('--cy',(py*100).toFixed(2)+'%'); }
    var vh=window.innerHeight;
    if(heroLayers.length && y<vh*1.25){
      var fade=Math.max(0,1-y/(vh*0.8)).toFixed(3);
      for(var i=0;i<heroLayers.length;i++){
        var l=heroLayers[i];
        if(l.sp) l.el.style.transform='translate3d(0,'+(y*l.sp).toFixed(1)+'px,0)';
        l.el.style.opacity=fade;
      }
    }
    if(orbs){
      var shouldHide=y>vh*1.35;                 /* stop compositing sparks nobody can see */
      if(shouldHide!==orbsOff){ orbsOff=shouldHide; orbs.classList.toggle('off',shouldHide); }
    }
  }

  if(!reduceMotion){
    var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    /* the intro curtain can never get stuck, whatever happens to the animation */
    window.addEventListener('load',function(){
      setTimeout(function(){ document.documentElement.classList.add('loaded'); },1300);
    });

    /* --- ambient sparks drifting up through the hero --- */
    orbs=document.createElement('div');
    orbs.className='fx-orbs'; orbs.setAttribute('aria-hidden','true');
    var cols=['var(--c1)','var(--c2)','var(--c3,var(--c2))'];
    for(var oi=0;oi<14;oi++){
      var o=document.createElement('i');
      o.style.left=(Math.random()*100).toFixed(1)+'%';
      o.style.setProperty('--s',(2+Math.random()*4).toFixed(1)+'px');
      o.style.setProperty('--cc',cols[oi%3]);
      o.style.setProperty('--dur',(13+Math.random()*11).toFixed(1)+'s');
      o.style.setProperty('--dly',(-Math.random()*20).toFixed(1)+'s');
      o.style.setProperty('--dx',(Math.random()*90-45).toFixed(0)+'px');
      orbs.appendChild(o);
    }
    document.body.appendChild(orbs);

    /* --- cursor spotlight (pointer devices only) --- */
    if(fine){
      spot=document.createElement('div');
      spot.className='fx-spot'; spot.setAttribute('aria-hidden','true');
      document.body.appendChild(spot);
      document.documentElement.classList.add('fx-pointer');
      window.addEventListener('pointermove',function(e){
        px=e.clientX/window.innerWidth; py=e.clientY/window.innerHeight;
      },{passive:true});
    }

    /* --- hero parallax: each layer drifts at its own speed, then fades --- */
    var heroEl=document.querySelector('.hero');
    if(heroEl){
      /* the badge floats on its own CSS animation, so it fades but never gets a transform */
      [['.hero-badge',0],['h1',0.19],['.lead',0.27],['.hero-cta',0.35],['.trust',0.43]].forEach(function(pair){
        var el=heroEl.querySelector(pair[0]);
        if(el) heroLayers.push({el:el,sp:pair[1]});
      });
    }

    /* --- magnetic buttons + click ripple --- */
    document.querySelectorAll('.btn').forEach(function(b){
      b.classList.add('magnetic');
      if(fine){
        b.addEventListener('pointerenter',function(){ b.classList.add('mag-on'); });
        b.addEventListener('pointermove',function(e){
          var r=b.getBoundingClientRect();
          b.style.setProperty('--mx',(((e.clientX-(r.left+r.width/2))/(r.width/2))*7).toFixed(1)+'px');
          b.style.setProperty('--my',(((e.clientY-(r.top+r.height/2))/(r.height/2))*5).toFixed(1)+'px');
        });
        b.addEventListener('pointerleave',function(){
          b.classList.remove('mag-on');
          b.style.setProperty('--mx','0px'); b.style.setProperty('--my','0px');
        });
      }
      b.addEventListener('pointerdown',function(e){
        var r=b.getBoundingClientRect(), d=Math.max(r.width,r.height)*2.2;
        var s=document.createElement('span');
        s.className='ripple'; s.style.width=s.style.height=d+'px';
        s.style.left=(e.clientX-r.left)+'px'; s.style.top=(e.clientY-r.top)+'px';
        b.appendChild(s);
        setTimeout(function(){ if(s.parentNode) s.parentNode.removeChild(s); },700);
      });
    });

    /* --- stagger indexes so rows fan in instead of arriving all at once --- */
    document.querySelectorAll('.menu-item').forEach(function(el,i){ el.style.setProperty('--si',i); });
    document.querySelectorAll('.info-list li').forEach(function(el,i){ el.style.setProperty('--si',i); });

    /* --- split the star rows so they can pop in one at a time --- */
    document.querySelectorAll('.quote .stars').forEach(function(row){
      var chars=row.textContent.trim().split('');
      row.textContent='';
      chars.forEach(function(c,i){
        var s=document.createElement('s'); s.textContent=c; s.style.setProperty('--si',i);
        row.appendChild(s);
      });
    });

    /* blocks that drive their own child animations need .in even if the
       demo's markup didn't tag them .reveal */
    var io2=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io2.unobserve(e.target); } });
    },{threshold:0.05});
    document.querySelectorAll('.menu,.quote,.contact-left').forEach(function(el){
      if(!el.classList.contains('reveal')) io2.observe(el);
    });

    /* --- eyebrows decode themselves when they scroll into view --- */
    var GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦/\\<>*+·';
    function decode(el){
      var target=el.textContent, frame=0, total=Math.min(30,target.length+14);
      var id=setInterval(function(){
        frame++;
        var shown=Math.floor(target.length*(frame/total)), out='';
        for(var i=0;i<target.length;i++){
          var c=target.charAt(i);
          out+=(i<shown||c===' ')?c:GLYPHS.charAt(Math.floor(Math.random()*GLYPHS.length));
        }
        el.textContent=out;
        if(frame>=total){ clearInterval(id); el.textContent=target; }
      },34);
    }
    var eio=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ eio.unobserve(e.target); decode(e.target); } });
    },{threshold:0.6});
    document.querySelectorAll('.eyebrow').forEach(function(el){ eio.observe(el); });

    v2on=true;   /* everything above exists — the frame hook can start working */
  }
  /* FX-V2-JS:END */
})();
