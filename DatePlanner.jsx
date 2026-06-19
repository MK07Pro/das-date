import { useState, useEffect, useRef } from "react";

const CONF=Array.from({length:50},(_,i)=>({l:`${(i*13.7+5)%100}%`,delay:`${(i*.13)%1}s`,dur:`${1.6+(i%5)*.4}s`,w:6+(i%4)*3,h:6+(i%3)*4,round:i%3===0,c:["#e8427b","#9b59b6","#ffd700","#00c896","#ff69b4","#87ceeb","#f39c12"][i%7]}));

/* 18 kino-phasen, ~30 sekunden */
const CINEMA=[
  {d:700,c:null},
  {d:3000,c:"logo"},
  {d:400,c:null},
  {d:400,c:"flash"},
  {d:2800,c:"based"},
  {d:500,c:null},
  {d:3300,c:"l1"},
  {d:400,c:null},
  {d:3300,c:"l2"},
  {d:400,c:null},
  {d:2800,c:"l3"},
  {d:600,c:"flash"},
  {d:4500,c:"title"},
  {d:400,c:null},
  {d:3000,c:"cast"},
  {d:400,c:null},
  {d:3000,c:"tag"},
  {d:800,c:null},
];

const BURST=Array.from({length:28},(_,i)=>{const ang=(i/28)*Math.PI*2;const d=38+(i%4)*28;return{tx:Math.cos(ang)*d,ty:Math.sin(ang)*d*.52,sz:3+(i%4)*3,dl:(i%7)*.06,c:["#e8427b","#ffd700","#9b59b6","#ff69b4","white","#c8a96e","#87ceeb"][i%7]};});

const TIMES=[{t:"12:00",l:"Mittagsdate 🥗",s:"Wir gönn uns was Feines"},{t:"14:00",l:"Nachmittag ☕",s:"Entspannt & gemütlich"},{t:"17:00",l:"Golden Hour 🌅",s:"Warm & romantisch"},{t:"18:30",l:"Early Bird ✨",s:"Mehr Zeit für uns"},{t:"19:00",l:"Perfekter Abend 💫",s:"Du weißt, was du willst"},{t:"20:00",l:"Candlelight 🕯️",s:"So unglaublich romantisch"},{t:"21:00",l:"Late Night 🌙",s:"Spät, aber legendär"}];
const VIBES=[{e:"🍽️",l:"Romantisches Dinner",s:"Schick & genussvoll"},{e:"🎬",l:"Kinoabend",s:"Film, Popcorn & Kuscheln"},{e:"🌳",l:"Spaziergang",s:"Frische Luft & du"},{e:"☕",l:"Café Date",s:"Kuchen & Kaffee"},{e:"🎢",l:"Abenteuer",s:"Action & Spaß"},{e:"🛋️",l:"Movie Night",s:"Zuhause & gemütlich"},{e:"🎨",l:"Kreativ-Date",s:"Basteln, malen & lachen"},{e:"🎁",l:"Überrasch mich",s:"Du planst alles ✨"}];
const FOODS=[{e:"🍕",l:"Pizza"},{e:"🍣",l:"Sushi"},{e:"🍔",l:"Burger"},{e:"🍝",l:"Pasta"},{e:"🥙",l:"Döner"},{e:"🍜",l:"Ramen"},{e:"🫕",l:"Fondue"},{e:"🥗",l:"Leichtes"}];
const SWEET=[{e:"🍦",l:"Eis danach"},{e:"🌃",l:"Sterne gucken"},{e:"🚶",l:"Abendspaziergang"},{e:"🛒",l:"Gemeinsam shoppen"},{e:"🎠",l:"Noch irgendwo hin"},{e:"🏠",l:"Einfach nach Hause"}];
const FAVS=[{e:"🤣",l:"Lachen & Quatsch"},{e:"🥰",l:"Kuscheln & Nähe"},{e:"💬",l:"Tiefe Gespräche"},{e:"🍴",l:"Leckeres Essen"},{e:"✨",l:"Einfach zusammen"},{e:"🎉",l:"Etwas erleben"}];
const NO_MSGS=["Nein 🙄","Immer noch nein 😤","Lass das! 😡","NIEMALS! 🫣","Du gibst nicht auf?! 😂","Ok, du bist anstrengend 😮‍💨"];
const MEM_PAIRS=["🌸","💖","✨","🦋","🎀","🌈","🎠","🌺"];
const QUIZ=[
  {q:"Was erwartest du von unserem Date?",opts:["Einfach Zeit mit dir 🥰","Lachen, Essen & Abenteuer 😄","Etwas ganz Besonderes 💝","Einfach alles! 🌈"],rx:["Genau das wollte ich hören! 💕","Perfekte Antwort! Das machen wir! 🎉","Genau das wird es! 💖","Das kriegst du! Versprochen! 🌟"]},
  {q:"Was machst du, wenn ich nervös bin?",opts:["Deine Hand halten 🤝","Dich zum Lachen bringen 😄","Dir in die Augen schauen 👀","Einfach da sein 💕"],rx:["Das wärmt mein Herz! 🥺","Genau was ich brauche! 😊","...ich werde rot. Danke. 🙈","Das ist mehr als genug! 💖"]},
  {q:"Was ist das Beste an uns?",opts:["Wir lachen immer zusammen 😂","Wir verstehen uns einfach 🫶","Jeder Moment ist besonders ✨","Ich mag dich einfach sehr 💝"],rx:["Mein Lieblingsgeräusch: dein Lachen! 😍","Als wären wir füreinander gemacht 💕","Stimmt – auch dieser hier! 🌟","...ich auch. Sehr. 🥺"]},
  {q:"Wie aufgeregt bist du gerade?",opts:["Ein bisschen 😊","Ziemlich aufgeregt 🤩","Mega aufgeregt!!! 🥳","Ich zitter schon 🫠"],rx:["Das reicht! Der Rest kommt von selbst! 💕","Ich auch!! Seit Tagen! 🎉","JAAA!! So soll es sein!! 🎊","Oh nein... ich meine: Oh ja! Ich auch! 😅"]},
  {q:"Letzte Frage: Magst du mich?",opts:["Ja 😊","Ja, natürlich! 😍","Ein bisschen zu sehr 🫶","Mehr als das 💝"],rx:["Das. Reicht. Mir. 💖","Dieser Moment macht alles wert! 🌟","Kann man nicht – niemals. 🥺","...ich auch. Viel mehr. 💕"]}
];

const CARD={background:"rgba(255,255,255,.93)",borderRadius:28,padding:"clamp(20px,5vw,36px) clamp(16px,5vw,32px)",boxShadow:"0 20px 60px rgba(232,66,123,.14),0 4px 20px rgba(0,0,0,.04)",backdropFilter:"blur(12px)",maxWidth:460,width:"100%",position:"relative",zIndex:10};
const BTN={background:"linear-gradient(135deg,#e8427b,#c2255c)",color:"white",border:"none",padding:"15px 32px",borderRadius:50,fontSize:16,fontFamily:"'Nunito',sans-serif",fontWeight:800,boxShadow:"0 8px 26px rgba(232,66,123,.38)",width:"100%",marginTop:20,transition:"all .2s",cursor:"pointer"};
const H1S={fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#2d1f3d",lineHeight:1.25,marginBottom:8};
const SUBS={color:"#9b8aa5",fontSize:14,lineHeight:1.6,fontFamily:"'Nunito',sans-serif"};
const WRAP={minHeight:"100vh",background:"linear-gradient(135deg,#fff0f7 0%,#f3e8ff 55%,#fce4ec 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden",fontFamily:"'Nunito',sans-serif"};

function Progress({n,total=7}){return(<div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:22}}>{Array.from({length:total}).map((_,i)=><span key={i} style={{fontSize:16,filter:i<n?"none":"grayscale(1) opacity(.3)",transition:"all .35s"}}>💖</span>)}</div>);}
function GameBadge({n}){return(<div style={{background:"linear-gradient(135deg,#9b59b6,#6c3483)",color:"white",borderRadius:50,padding:"6px 18px",fontSize:12,fontWeight:800,fontFamily:"'Nunito',sans-serif",textAlign:"center",marginBottom:16,display:"inline-block",letterSpacing:".03em"}}>🎮 Mini-Game {n} von 4</div>);}
function Opt({e,l,s,sel,onClick}){return(<div onClick={onClick} style={{background:sel?"linear-gradient(135deg,#fff0f5,#f8e8ff)":"white",border:`2px solid ${sel?"#e8427b":"#f0e0e8"}`,borderRadius:16,padding:"13px 8px",cursor:"pointer",textAlign:"center",transition:"all .2s",transform:sel?"translateY(-2px)":"none",boxShadow:sel?"0 7px 18px rgba(232,66,123,.18)":"0 2px 8px rgba(0,0,0,.03)"}}><div style={{fontSize:24,marginBottom:4}}>{e}</div><div style={{fontWeight:700,fontSize:12,color:"#2d1f3d",fontFamily:"'Nunito',sans-serif"}}>{l}</div>{s&&<div style={{fontSize:11,color:"#b0a0ba",marginTop:2,fontFamily:"'Nunito',sans-serif"}}>{s}</div>}</div>);}
function Grid({items,selFn,onToggle}){return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{items.map(({e,l,s})=><Opt key={l} e={e} l={l} s={s} sel={selFn(l)} onClick={()=>onToggle(l)}/>)}</div>);}
function BtnP({onClick,disabled,children,mt=20}){return(<button onClick={onClick} disabled={!!disabled} style={{...BTN,marginTop:mt,opacity:disabled?.4:1,cursor:disabled?"default":"pointer"}}>{children}</button>);}
function SumRow({icon,label,val}){if(!val)return null;return(<div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}><span style={{fontSize:20,flexShrink:0}}>{icon}</span><div><div style={{fontSize:10,fontWeight:800,color:"#b0a0ba",textTransform:"uppercase",letterSpacing:".08em",marginBottom:2}}>{label}</div><div style={{fontSize:15,fontWeight:700,color:"#2d1f3d",fontFamily:"'Nunito',sans-serif"}}>{val}</div></div></div>);}

/* ── Typewriter ── */
function TypewriterText({text,speed=52,startDelay=380}){
  const [shown,setShown]=useState(0);
  const ref=useRef(0);
  useEffect(()=>{
    const s=setTimeout(()=>{
      const t=setInterval(()=>{
        if(ref.current>=text.length){clearInterval(t);return;}
        ref.current++;setShown(ref.current);
      },speed);
      return()=>clearInterval(t);
    },startDelay);
    return()=>clearTimeout(s);
  },[]);
  const done=shown>=text.length;
  return(<span>{text.slice(0,shown)}{!done&&<span style={{borderRight:"2px solid rgba(255,255,255,.65)",animation:"blinkBar .65s step-end infinite",marginLeft:2,display:"inline-block",height:"1em",verticalAlign:"middle"}}/>}</span>);
}

/* ── SPEKTAKULÄRES KINO-INTRO ── */
function CinematicIntro({onDone}){
  const [ph,setPh]=useState(0);
  useEffect(()=>{
    if(ph>=CINEMA.length){onDone();return;}
    const t=setTimeout(()=>setPh(p=>p+1),CINEMA[ph].d);
    return()=>clearTimeout(t);
  },[ph]);
  const cur=CINEMA[Math.min(ph,CINEMA.length-1)];
  const isFlash=cur.c==="flash";
  const show=!!cur.c&&!isFlash;

  const content=()=>{
    switch(cur.c){
      case"logo":return(
        <div style={{textAlign:"center",width:"100%"}}>
          <div style={{fontSize:30,color:"#c8a96e",animation:"heartBeat 1.2s ease both",marginBottom:14,display:"block"}}>❤</div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,#c8a96e,transparent)",animation:"lineGrow .9s ease both",transformOrigin:"center",marginBottom:13}}/>
          <div style={{fontSize:11,letterSpacing:".4em",color:"#c8a96e",fontFamily:"'Nunito',sans-serif",fontWeight:800,animation:"logoFadeUp .7s .3s both"}}>HERZSTUDIO PRODUCTIONS</div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,#c8a96e,transparent)",animation:"lineGrow .9s .15s ease both",transformOrigin:"center",margin:"13px 0 11px"}}/>
          <div style={{fontSize:9,letterSpacing:".28em",color:"rgba(200,169,110,.48)",fontFamily:"'Nunito',sans-serif",animation:"logoFadeUp .6s .5s both"}}>PRESENTS</div>
        </div>
      );
      case"based":return(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:9,letterSpacing:".35em",color:"rgba(255,255,255,.28)",fontFamily:"'Nunito',sans-serif",marginBottom:14,animation:"logoFadeUp .6s ease both"}}>BASIEREND AUF EINER WAHREN GESCHICHTE</div>
          <div style={{width:32,height:1,background:"rgba(255,255,255,.18)",margin:"0 auto"}}/>
        </div>
      );
      case"l1":return(<p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"rgba(255,255,255,.9)",fontSize:"clamp(16px,3.8vw,25px)",lineHeight:1.7,textAlign:"center"}}><TypewriterText key={ph} text="In einer Welt voller gewöhnlicher Textnachrichten..."/></p>);
      case"l2":return(<p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"rgba(255,255,255,.9)",fontSize:"clamp(16px,3.8vw,25px)",lineHeight:1.7,textAlign:"center"}}><TypewriterText key={ph} text="...wagte einer das Außergewöhnliche."/></p>);
      case"l3":return(<p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"rgba(255,255,255,.75)",fontSize:"clamp(14px,3vw,20px)",lineHeight:1.8,textAlign:"center"}}><TypewriterText key={ph} text="Für genau eine Person auf der Welt." speed={62}/></p>);
      case"title":return(
        <div style={{textAlign:"center",position:"relative"}}>
          <div style={{position:"absolute",left:"50%",top:"40%",width:0,height:0,zIndex:0}}>
            {BURST.map((p,i)=>(
              <div key={i} style={{position:"absolute",width:p.sz,height:p.sz,borderRadius:"50%",background:p.c,"--tx":`${p.tx}px`,"--ty":`${p.ty}px`,animation:`particleBurst 1.6s ${p.dl}s cubic-bezier(.15,.8,.2,1) both`}}/>
            ))}
          </div>
          <div style={{position:"relative",zIndex:1,fontFamily:"'Playfair Display',serif",fontSize:"clamp(44px,12vw,90px)",color:"white",fontWeight:700,letterSpacing:".12em",lineHeight:1,animation:"titleBloom .95s .2s cubic-bezier(.2,0,.15,1) both, titleGlow 2.8s 1.4s ease infinite"}}>
            DAS DATE
          </div>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)",margin:"22px auto",width:70,animation:"lineGrow .7s 1s ease both"}}/>
          <div style={{fontSize:10,letterSpacing:".32em",color:"rgba(255,255,255,.38)",fontFamily:"'Nunito',sans-serif",animation:"logoFadeUp .9s 1.3s both"}}>EIN ABENTEUER · NUR FÜR DICH</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.16)",fontFamily:"'Nunito',sans-serif",marginTop:30,letterSpacing:".14em",animation:"logoFadeUp .8s 2.4s both"}}>❤ HERZSTUDIO PRODUCTIONS ❤</div>
        </div>
      );
      case"cast":{
        const letters=["D","I","R","."];
        return(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:10,letterSpacing:".42em",color:"rgba(255,255,255,.32)",fontFamily:"'Nunito',sans-serif",marginBottom:20,animation:"logoFadeUp .5s ease both"}}>STARRING</div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"baseline",gap:"0.06em"}}>
              {letters.map((ch,i)=>(
                <span key={i} style={{fontSize:"clamp(56px,14vw,94px)",fontFamily:"'Playfair Display',serif",color:"white",fontWeight:700,display:"inline-block",animation:`letterFlip .55s ${i*.2+.15}s cubic-bezier(.4,0,.2,1) both`,transformOrigin:"top center",lineHeight:1}}>{ch}</span>
              ))}
            </div>
            <div style={{fontSize:11,letterSpacing:".28em",color:"rgba(255,255,255,.28)",fontFamily:"'Nunito',sans-serif",marginTop:16,animation:"logoFadeUp .6s 1.1s both"}}>IN: DAS DATE</div>
          </div>
        );
      }
      case"tag":return(
        <p style={{fontFamily:"'Playfair Display',serif",color:"rgba(255,255,255,.78)",fontSize:"clamp(14px,3vw,21px)",lineHeight:1.85,textAlign:"center",animation:"logoFadeUp .9s ease both"}}>
          Diese Geschichte wurde für genau<br/>eine Person auf der Welt erschaffen. ❤️
        </p>
      );
      default:return null;
    }
  };

  return(
    <div style={{position:"fixed",inset:0,background:cur.c==="title"?"#060010":"#000",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",transition:"background 1.5s ease"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"8%",background:"#000",zIndex:5}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"8%",background:"#000",zIndex:5}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 28%,rgba(0,0,0,.78) 100%)",pointerEvents:"none",zIndex:2,animation:"vignettePulse 5s ease infinite"}}/>
      {isFlash&&<div style={{position:"absolute",inset:0,background:"white",animation:"flashFade .45s ease forwards",zIndex:4}}/>}
      <div style={{opacity:show?1:0,transition:"opacity .55s ease",textAlign:"center",padding:"0 8%",zIndex:3,width:"100%",maxWidth:600}}>
        {content()}
      </div>
      <button onClick={onDone} style={{position:"absolute",bottom:"9%",right:"5%",background:"transparent",border:"1px solid rgba(255,255,255,.16)",color:"rgba(255,255,255,.32)",padding:"5px 14px",borderRadius:3,fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",zIndex:6,letterSpacing:".06em"}}>überspringen →</button>
    </div>
  );
}

const H_EMOJIS=["💕","💖","💗","💓","💝","❤️","🥰","💞","💘","💟","🫀","💌"];
const H_DELAYS=[0,450,900,1350,1800,2250,2700,3150,3600,4050,4500,4950];
const H_ALIVE=2600;
const H_TARGET=8;
const H_MAX=3;

function HeartsGameInner({onDone}){
  const [states,setStates]=useState(Array(12).fill("waiting"));
  const scoreRef=useRef(0);
  const [score,setScore]=useState(0);
  useEffect(()=>{
    const timers=[];
    H_DELAYS.forEach((d,i)=>{
      timers.push(setTimeout(()=>setStates(s=>s.map((x,j)=>j===i?"active":x)),d));
      timers.push(setTimeout(()=>setStates(s=>{const n=[...s];if(n[i]==="active")n[i]="missed";return n;}),d+H_ALIVE));
    });
    timers.push(setTimeout(()=>onDone({won:scoreRef.current>=H_TARGET,score:scoreRef.current}),H_DELAYS[11]+H_ALIVE+700));
    return()=>timers.forEach(clearTimeout);
  },[]);
  const catch_=(i)=>{
    setStates(s=>{if(s[i]!=="active")return s;const n=[...s];n[i]="caught";return n;});
    scoreRef.current++;setScore(scoreRef.current);
  };
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontWeight:800,color:"#e8427b",fontSize:15,fontFamily:"'Nunito',sans-serif"}}>💕 {score} / 12</span>
        <span style={{...SUBS,fontSize:13}}>Ziel: {H_TARGET} fangen!</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {states.map((st,i)=>(
          <div key={i} onClick={()=>catch_(i)} style={{height:70,borderRadius:14,cursor:st==="active"?"pointer":"default",background:st==="caught"?"#f0fff8":st==="missed"?"#f8f8f8":st==="waiting"?"#fafafa":"#fff0f5",border:`2px solid ${st==="caught"?"#00c896":st==="missed"?"#eee":st==="waiting"?"#f0e8f0":"#e8427b"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all .25s",userSelect:"none",transform:st==="active"?"scale(1.06)":"scale(1)",boxShadow:st==="active"?"0 4px 14px rgba(232,66,123,.22)":"none"}}>
            <div style={{fontSize:26,opacity:st==="missed"?.2:1}}>{st==="caught"?"✓":st==="missed"?"💨":st==="waiting"?"":H_EMOJIS[i]}</div>
            {st==="active"&&<div style={{width:"60%",height:3,background:"#f0d0e0",borderRadius:2,marginTop:5,overflow:"hidden"}}><div style={{height:"100%",background:"#e8427b",animation:`shrinkBar ${H_ALIVE/1000}s linear forwards`}}/></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeartsGame({onWin}){
  const [attempt,setAttempt]=useState(1);
  const [key,setKey]=useState(0);
  const [result,setResult]=useState(null);
  const retry=()=>{setAttempt(a=>a+1);setResult(null);setKey(k=>k+1);};
  if(result&&result.won)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={1}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>🥳</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>{result.score} von 12 Herzen gefangen!</h1><p style={{...SUBS,marginBottom:22}}>{result.score===12?"Perfekt!! Du hast alle erwischt – genauso wie du mein Herz 💕":"Geschafft! Du bist definitiv für mich gemacht 💖"}</p><BtnP onClick={onWin}>Weiter zum nächsten Abenteuer →</BtnP></div></div>);
  if(result&&attempt>=H_MAX)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={1}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>🥺</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>Du hast {result.score} gefangen!</h1><p style={{...SUBS,marginBottom:22}}>Egal – du hast eh schon mein Herz. Für immer. 💖</p><BtnP onClick={onWin}>Trotzdem weiter →</BtnP></div></div>);
  if(result)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={1}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>😤</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>Fast! {result.score} von 12!</h1><p style={{...SUBS,marginBottom:6}}>Du brauchst noch {H_TARGET-result.score} mehr – du schaffst das! 💪</p><p style={{...SUBS,fontSize:12,marginBottom:22,color:"#c0b0d0"}}>Versuch {attempt} von {H_MAX}</p><BtnP onClick={retry}>Nochmal! 🔄</BtnP></div></div>);
  return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center",marginBottom:14}}><GameBadge n={1}/><h1 style={{...H1S,fontSize:22,marginBottom:4}}>Herzfang! 💕</h1><p style={SUBS}>Klick die Herzen bevor der Balken leer ist! Fang {H_TARGET} von 12.</p></div><HeartsGameInner key={key} onDone={setResult}/></div>);
}

function createCards(){return[...MEM_PAIRS,...MEM_PAIRS].sort(()=>Math.random()-.5).map((emoji,id)=>({id,emoji,flipped:false,matched:false}));}
const MEM_TIME=90;
const MEM_MAX=3;

function MemoryGameInner({onDone}){
  const [cards,setCards]=useState(()=>createCards());
  const [sel,setSel]=useState(null);
  const [moves,setMoves]=useState(0);
  const [lock,setLock]=useState(false);
  const [time,setTime]=useState(MEM_TIME);
  const movesRef=useRef(0);
  const doneRef=useRef(false);

  useEffect(()=>{
    if(cards.length>0&&cards.every(c=>c.matched)&&!doneRef.current){
      doneRef.current=true;
      onDone({won:true,moves:movesRef.current});
    }
  },[cards]);

  useEffect(()=>{
    const t=setInterval(()=>setTime(s=>{
      if(s<=1){if(!doneRef.current){doneRef.current=true;setTimeout(()=>onDone({won:false,moves:movesRef.current}),0);}return 0;}
      return s-1;
    }),1000);
    return()=>clearInterval(t);
  },[]);

  const flip=(id)=>{
    if(lock||doneRef.current)return;
    const card=cards.find(c=>c.id===id);
    if(!card||card.flipped||card.matched)return;
    if(sel===null){
      setCards(cs=>cs.map(c=>c.id===id?{...c,flipped:true}:c));
      setSel(id);
    } else if(sel!==id){
      const firstEmoji=cards.find(c=>c.id===sel).emoji;
      setCards(cs=>cs.map(c=>c.id===id?{...c,flipped:true}:c));
      setSel(null);
      movesRef.current++;
      setMoves(movesRef.current);
      setLock(true);
      if(firstEmoji===card.emoji){
        setTimeout(()=>{setCards(cs=>cs.map(c=>c.id===sel||c.id===id?{...c,matched:true,flipped:true}:c));setLock(false);},280);
      } else {
        setTimeout(()=>{setCards(cs=>cs.map(c=>c.id===sel||c.id===id?{...c,flipped:false}:c));setLock(false);},950);
      }
    }
  };

  const pct=(time/MEM_TIME)*100;
  const tc=time<=10?"#e8427b":time<=30?"#f39c12":"#00c896";
  return(
    <div>
      <div style={{height:6,background:"#f0d0e0",borderRadius:3,marginBottom:10,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:tc,transition:"width 1s linear,background .5s"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontWeight:800,color:tc,fontSize:14,fontFamily:"'Nunito',sans-serif",transition:"color .5s"}}>⏱️ {time}s</span>
        <span style={{...SUBS,fontSize:13}}>Züge: {moves}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
        {cards.map(c=>(
          <div key={c.id} onClick={()=>flip(c.id)} style={{height:64,borderRadius:12,cursor:c.matched?"default":"pointer",background:c.matched?"linear-gradient(135deg,#f0fff8,#e8f8f0)":c.flipped?"#fff0f5":"linear-gradient(135deg,#e8427b,#c2255c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:c.flipped||c.matched?25:17,border:`2px solid ${c.matched?"#00c896":c.flipped?"#e8427b":"transparent"}`,transition:"all .3s",transform:c.flipped&&!c.matched?"scale(1.07)":"scale(1)",color:c.flipped||c.matched?"inherit":"white",userSelect:"none"}}>
            {c.flipped||c.matched?c.emoji:"?"}
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryGame({onWin}){
  const [attempt,setAttempt]=useState(1);
  const [key,setKey]=useState(0);
  const [result,setResult]=useState(null);
  const retry=()=>{setAttempt(a=>a+1);setResult(null);setKey(k=>k+1);};
  if(result&&result.won)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={2}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>🎊</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>Alle Paare gefunden!</h1><p style={{...SUBS,marginBottom:22}}>In nur {result.moves} Zügen! Du kennst mich in- und auswendig 🥰</p><BtnP onClick={onWin}>Weiter zum nächsten Abenteuer →</BtnP></div></div>);
  if(result&&attempt>=MEM_MAX)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={2}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>🥺</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>Fast geschafft!</h1><p style={{...SUBS,marginBottom:22}}>Egal – du wirst mich noch kennenlernen. Ich freu mich drauf. 💖</p><BtnP onClick={onWin}>Trotzdem weiter →</BtnP></div></div>);
  if(result)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={2}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>⏰</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>Zeit abgelaufen!</h1><p style={{...SUBS,marginBottom:6}}>Du warst so nah dran! Ein weiterer Versuch? 💪</p><p style={{...SUBS,fontSize:12,marginBottom:22,color:"#c0b0d0"}}>Versuch {attempt} von {MEM_MAX}</p><BtnP onClick={retry}>Nochmal! 🔄</BtnP></div></div>);
  return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center",marginBottom:14}}><GameBadge n={2}/><h1 style={{...H1S,fontSize:22,marginBottom:4}}>Paare finden! 🃏</h1><p style={SUBS}>Finde alle 8 Paare in 90 Sekunden – Züge werden gezählt!</p></div><MemoryGameInner key={key} onDone={setResult}/></div>);
}

function QuizGame({onWin}){
  const [qIdx,setQIdx]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [allDone,setAllDone]=useState(false);
  const choose=(i)=>{
    if(chosen!==null)return;
    setChosen(i);
    setTimeout(()=>{
      if(qIdx>=QUIZ.length-1){setAllDone(true);}
      else{setQIdx(q=>q+1);setChosen(null);}
    },1800);
  };
  if(allDone)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={3}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>🌟</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>Quiz bestanden!</h1><p style={{...SUBS,marginBottom:22}}>Natürlich – du kannst gar nichts Falsches sagen. Niemals. 💖</p><BtnP onClick={onWin}>Weiter zum letzten Abenteuer →</BtnP></div></div>);
  const q=QUIZ[qIdx];
  return(
    <div className="dp-slide" style={CARD}>
      <div style={{textAlign:"center",marginBottom:18}}>
        <GameBadge n={3}/>
        <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:14}}>
          {QUIZ.map((_,i)=><div key={i} style={{height:4,borderRadius:2,flex:1,background:i<=qIdx?"#e8427b":"#f0d0e0",transition:"background .3s"}}/>)}
        </div>
        <h1 style={{...H1S,fontSize:20,lineHeight:1.35}}>{q.q}</h1>
      </div>
      {chosen!==null?(
        <div style={{textAlign:"center",padding:"24px 16px",background:"linear-gradient(135deg,#fff0f5,#f8e8ff)",borderRadius:18,border:"1.5px solid #f0d0e0"}}>
          <div style={{fontSize:44,marginBottom:10}}>💖</div>
          <p style={{fontWeight:800,color:"#e8427b",fontFamily:"'Nunito',sans-serif",fontSize:16}}>{q.rx[chosen]}</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>choose(i)}
              style={{background:"white",border:"2px solid #f0d0e0",borderRadius:14,padding:"13px 18px",fontSize:14,fontFamily:"'Nunito',sans-serif",fontWeight:700,color:"#2d1f3d",cursor:"pointer",textAlign:"left",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#e8427b";e.currentTarget.style.background="#fff0f5";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#f0d0e0";e.currentTarget.style.background="white";}}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const STAR_EMOJIS=["⭐","🌟","✨","💫"];
const STAR_TIME=28;
const STAR_TARGET=12;
const STAR_MAX=3;

function StarsGameInner({onDone}){
  const [stars,setStars]=useState([]);
  const [time,setTime]=useState(STAR_TIME);
  const scoreRef=useRef(0);
  const [score,setScore]=useState(0);
  const doneRef=useRef(false);
  const idRef=useRef(0);

  useEffect(()=>{
    const si=setInterval(()=>{
      const id=idRef.current++;
      const star={id,x:5+Math.random()*82,y:8+Math.random()*75,sz:20+Math.floor(Math.random()*16),e:STAR_EMOJIS[Math.floor(Math.random()*4)]};
      setStars(s=>[...s,star]);
      setTimeout(()=>setStars(s=>s.filter(st=>st.id!==id)),2200);
    },750);
    const ti=setInterval(()=>setTime(s=>{
      if(s<=1){clearInterval(si);clearInterval(ti);if(!doneRef.current){doneRef.current=true;setTimeout(()=>onDone({won:scoreRef.current>=STAR_TARGET,score:scoreRef.current}),200);}return 0;}
      return s-1;
    }),1000);
    return()=>{clearInterval(si);clearInterval(ti);};
  },[]);

  const catchStar=(id)=>{
    if(doneRef.current)return;
    setStars(s=>s.filter(st=>st.id!==id));
    scoreRef.current++;
    setScore(scoreRef.current);
    if(scoreRef.current>=STAR_TARGET&&!doneRef.current){doneRef.current=true;setTimeout(()=>onDone({won:true,score:scoreRef.current}),300);}
  };

  const tc=time<=5?"#e8427b":time<=12?"#f39c12":"#00c896";
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontWeight:800,color:"#9b59b6",fontSize:15,fontFamily:"'Nunito',sans-serif"}}>⭐ {score}/{STAR_TARGET}</span>
        <span style={{fontWeight:800,color:tc,fontSize:15,fontFamily:"'Nunito',sans-serif",transition:"color .4s"}}>⏱️ {time}s</span>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,.15)",borderRadius:3,marginBottom:10,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(score/STAR_TARGET)*100}%`,background:"linear-gradient(90deg,#9b59b6,#e8427b)",transition:"width .3s",borderRadius:3}}/>
      </div>
      <div style={{position:"relative",height:230,background:"linear-gradient(160deg,#0a0a2e,#1a1a5e,#0d0935)",borderRadius:18,overflow:"hidden",cursor:"crosshair"}}>
        {Array.from({length:30}).map((_,i)=>(
          <div key={`bg${i}`} style={{position:"absolute",left:`${(i*17+3)%97}%`,top:`${(i*13+7)%90}%`,fontSize:7,opacity:.2,color:"white",pointerEvents:"none"}}>·</div>
        ))}
        {stars.map(star=>(
          <div key={star.id} onClick={()=>catchStar(star.id)} style={{position:"absolute",left:`${star.x}%`,top:`${star.y}%`,fontSize:star.sz,cursor:"pointer",userSelect:"none",animation:"starAppear .3s cubic-bezier(.4,0,.2,1)",filter:"drop-shadow(0 0 8px rgba(255,220,50,.9))"}}>
            {star.e}
          </div>
        ))}
      </div>
    </div>
  );
}

function StarsGame({onWin}){
  const [attempt,setAttempt]=useState(1);
  const [key,setKey]=useState(0);
  const [result,setResult]=useState(null);
  const retry=()=>{setAttempt(a=>a+1);setResult(null);setKey(k=>k+1);};
  if(result&&result.won)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={4}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>🌟</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>{result.score} Sterne gesammelt!</h1><p style={{...SUBS,marginBottom:22}}>{result.score>=STAR_TARGET?"Wahnsinn! Du strahlst genau so in meinem Leben 🌟":"Fast! Du bist sowieso schon der schönste Stern für mich 💖"}</p><BtnP onClick={onWin}>Zum Date-Plan! 🎉</BtnP></div></div>);
  if(result&&attempt>=STAR_MAX)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={4}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>✨</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>Du hast {result.score} Sterne!</h1><p style={{...SUBS,marginBottom:22}}>Du bist sowieso schon mein liebster Stern – das zählt viel mehr. 💖</p><BtnP onClick={onWin}>Zum Date-Plan! 🎉</BtnP></div></div>);
  if(result)return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><GameBadge n={4}/><div className="dp-pop" style={{fontSize:56,margin:"10px 0 14px"}}>😤</div><h1 style={{...H1S,fontSize:23,marginBottom:8}}>{result.score} von {STAR_TARGET} Sternen!</h1><p style={{...SUBS,marginBottom:6}}>Noch {STAR_TARGET-result.score} fehlen – du schaffst das! 💪</p><p style={{...SUBS,fontSize:12,marginBottom:22,color:"#c0b0d0"}}>Versuch {attempt} von {STAR_MAX}</p><BtnP onClick={retry}>Nochmal! 🔄</BtnP></div></div>);
  return(<div className="dp-slide" style={CARD}><div style={{textAlign:"center",marginBottom:12}}><GameBadge n={4}/><h1 style={{...H1S,fontSize:22,marginBottom:4}}>Sternenhimmel! ⭐</h1><p style={SUBS}>Klick {STAR_TARGET} Sterne in {STAR_TIME} Sekunden – sie verschwinden schnell!</p></div><StarsGameInner key={key} onDone={setResult}/></div>);
}

function GateScreen({onPass,fireConf}){
  const [val,setVal]=useState("");
  const [error,setError]=useState(false);
  const [shake,setShake]=useState(false);
  const [success,setSuccess]=useState(false);
  const check=()=>{
    if(val.trim().toLowerCase()==="louisa"){
      setSuccess(true);fireConf();
      setTimeout(()=>onPass(),1500);
    } else {
      setError(true);setShake(true);
      setTimeout(()=>setShake(false),500);
      setTimeout(()=>setError(false),2800);
    }
  };
  return(
    <div className="dp-slide" style={CARD}>
      <div style={{textAlign:"center"}}>
        {success?(
          <>
            <div className="dp-pop" style={{fontSize:64,marginBottom:16}}>🥰</div>
            <h1 style={{...H1S,fontSize:24,marginBottom:8}}>Richtig! Das bist du!</h1>
            <p style={SUBS}>Dein Abenteuer beginnt gleich... 💕</p>
          </>
        ):(
          <>
            <div className="dp-wiggle" style={{fontSize:48,marginBottom:16}}>🔐</div>
            <h1 style={{...H1S,fontSize:22,marginBottom:6}}>Geheime Frage</h1>
            <p style={{...SUBS,marginBottom:22}}>Beantworte die Frage, um das Abenteuer zu starten!</p>
            <div style={{background:"linear-gradient(135deg,#fff0f5,#f8e8ff)",borderRadius:18,padding:"20px 16px",marginBottom:22,border:"1.5px solid #f0d0e0"}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:19,color:"#2d1f3d",lineHeight:1.55}}>"Wie heißt die tollste<br/>Freundin auf der Welt?"</p>
            </div>
            <input type="text" value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()}
              placeholder="Dein Name..."
              style={{width:"100%",padding:"14px 18px",borderRadius:16,border:`2px solid ${error?"#e8427b":"#f0d0e0"}`,fontSize:17,fontFamily:"'Nunito',sans-serif",fontWeight:700,outline:"none",color:"#2d1f3d",background:"#fff9fc",textAlign:"center",transition:"border-color .3s",animation:shake?"shakeIt .45s ease":"none"}}
            />
            {error&&<p style={{color:"#e8427b",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif",marginTop:10}}>Hmm... das klingt nicht ganz richtig 🤔</p>}
            <BtnP onClick={check} disabled={!val.trim()} mt={error?14:20}>Bestätigen ✨</BtnP>
          </>
        )}
      </div>
    </div>
  );
}

function BG(){return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>{["💕","💖","🌸","✨","💗","🌺","💝","⭐","🌷","💫"].map((h,i)=>(<div key={i} style={{position:"absolute",left:`${(i*10+3)%100}%`,bottom:-30,fontSize:11+(i%4)*5,opacity:.35,animation:`floatUp ${5+(i%5)*1.6}s linear ${i*.85}s infinite`}}>{h}</div>))}</div>);}
function Conf(){return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:100,overflow:"hidden"}}>{CONF.map((p,i)=>(<div key={i} style={{position:"absolute",left:p.l,top:-18,width:p.w,height:p.h,background:p.c,borderRadius:p.round?"50%":3,animation:`confDrop ${p.dur} ease-in ${p.delay} both`}}/>))}</div>);}

export default function DatePlanner(){
  const [gate,setGate]=useState(true);
  const [cinema,setCinema]=useState(true);
  const [step,setStep]=useState(0);
  const [confetti,setConfetti]=useState(false);
  const [noCount,setNoCount]=useState(0);
  const [noFixed,setNoFixed]=useState(false);
  const [noPos,setNoPos]=useState({x:0,y:0});
  const [sk,setSk]=useState(0);
  const [copied,setCopied]=useState(false);
  const [ans,setAns]=useState({date:"",time:"",vibe:"",food:[],wish:"",fav:"",sweet:[]});

  useEffect(()=>{
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
    const style=document.createElement("style");
    style.textContent=`
      @keyframes floatUp{0%{transform:translateY(110vh) rotate(0deg);opacity:0}8%{opacity:.45}92%{opacity:.3}100%{transform:translateY(-40px) rotate(360deg);opacity:0}}
      @keyframes confDrop{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
      @keyframes slideIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes popIn{0%{transform:scale(.3);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
      @keyframes wiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-10deg)}60%{transform:rotate(10deg)}80%{transform:rotate(-5deg)}}
      @keyframes pulsate{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
      @keyframes shrinkBar{from{width:100%}to{width:0%}}
      @keyframes starAppear{from{transform:scale(0) rotate(-180deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
      .dp-slide{animation:slideIn .42s cubic-bezier(.4,0,.2,1) both}
      .dp-pop{animation:popIn .5s cubic-bezier(.4,0,.2,1) both}
      .dp-wiggle{animation:wiggle 1.4s ease infinite}
      .dp-pulse{animation:pulsate 2s ease infinite}
    `;
    document.head.appendChild(style);
    return()=>{document.head.removeChild(link);document.head.removeChild(style);};
  },[]);

  const next=()=>{setSk(k=>k+1);setStep(s=>s+1);};
  const set=(k,v)=>setAns(a=>({...a,[k]:v}));
  const toggle=(k,v)=>set(k,ans[k].includes(v)?ans[k].filter(x=>x!==v):[...ans[k],v]);
  const fireConf=()=>{setConfetti(true);setTimeout(()=>setConfetti(false),3500);};
  const handleYes=()=>{fireConf();setTimeout(next,500);};
  const escapeNo=()=>{
    if(noCount>=NO_MSGS.length-1)return;
    setNoCount(c=>c+1);setNoFixed(true);
    setNoPos({x:20+Math.random()*(window.innerWidth-170),y:20+Math.random()*(window.innerHeight-80)});
  };
  const formatDate=d=>{if(!d)return"Noch offen";const[y,m,day]=d.split("-");return`${parseInt(day)}. ${["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"][parseInt(m)-1]} ${y}`;};
  const copyPlan=()=>{
    const t=["🎉 Es ist ein Date!",`📅 ${formatDate(ans.date)} · ${ans.time} Uhr`,`🎭 ${ans.vibe}`,ans.food.length?`🍴 ${ans.food.join(", ")}`:"",ans.sweet.length?`🌙 Danach: ${ans.sweet.join(", ")}`:"",ans.fav?`💝 Dir ist wichtig: ${ans.fav}`:"",ans.wish?`💭 Dein Wunsch: ${ans.wish}`:""].filter(Boolean).join("\n");
    try{navigator.clipboard.writeText(t);}catch(_){}
    setCopied(true);setTimeout(()=>setCopied(false),2500);
  };

  const PROG={3:1,4:2,6:3,7:4,9:5,10:6,11:7};

  if(gate)return(<div style={WRAP}><BG/>{confetti&&<Conf/>}<GateScreen onPass={()=>setGate(false)} fireConf={fireConf}/></div>);
  if(cinema)return(<div style={WRAP}><BG/><CinematicIntro onDone={()=>setCinema(false)}/></div>);
  if(step===2)return(<div style={WRAP}><BG/>{confetti&&<Conf/>}<HeartsGame onWin={next}/></div>);
  if(step===5)return(<div style={WRAP}><BG/><MemoryGame onWin={next}/></div>);
  if(step===8)return(<div style={WRAP}><BG/><QuizGame onWin={next}/></div>);
  if(step===12)return(<div style={WRAP}><BG/><StarsGame onWin={next}/></div>);

  const pn=PROG[step];
  const S=(txt,extra={})=>(<p style={{...SUBS,...extra}}>{txt}</p>);
  const H=(txt,sz=24)=>(<h1 style={{...H1S,fontSize:sz}}>{txt}</h1>);

  const screens={
    0:(<div key={sk} className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><div className="dp-wiggle" style={{fontSize:52,marginBottom:12}}>💌</div>{H("Hallo, mein Schatz",26)}{S("Ich hab da eine ganz wichtige Frage an dich...",{marginBottom:24})}<div style={{background:"linear-gradient(135deg,#fff0f5,#f8e8ff)",borderRadius:20,padding:"24px 20px",marginBottom:28,border:"1.5px solid #f0d0e0"}}><p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:21,color:"#2d1f3d",lineHeight:1.55}}>"Möchtest du mit mir<br/>auf ein Date gehen?"</p></div><button onClick={handleYes} className="dp-pulse" style={{...BTN,marginTop:0,fontSize:19,padding:"18px 44px",width:"auto"}}>Ja, natürlich! 💕</button><div style={{height:54,position:"relative",marginTop:14}}>{!noFixed&&<button onMouseEnter={escapeNo} onClick={escapeNo} style={{background:"#f5f0f7",color:"#9b8aa5",border:"none",padding:"10px 22px",borderRadius:50,fontSize:13,fontFamily:"'Nunito',sans-serif",fontWeight:700,cursor:"pointer",position:"absolute",right:0,bottom:0}}>{NO_MSGS[0]}</button>}</div></div></div>),

    1:(<div key={sk} className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><div className="dp-pop" style={{fontSize:60,marginBottom:14}}>🎉</div>{H("ICH WUSSTE ES!",27)}<p style={{color:"#e8427b",fontWeight:800,fontSize:16,fontFamily:"'Nunito',sans-serif",marginBottom:10}}>Du bist einfach die Allerbeste ✨</p>{S("Jetzt beginnt dein kleines Abenteuer! Beantworte ein paar Fragen – und bezwinge 4 Mini-Spiele. Viel Glück! 🎮",{marginBottom:22})}<div style={{background:"#fff0f5",borderRadius:16,padding:"16px 18px",marginBottom:22,border:"1.5px solid #fdd0e0"}}><p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"#9b59b6",fontSize:15,lineHeight:1.75}}>"Jeder Moment mit dir ist mein Lieblingsmoment."</p></div><BtnP onClick={next}>Abenteuer starten! 🚀</BtnP></div></div>),

    3:(<div key={sk} className="dp-slide" style={CARD}><Progress n={pn}/><div style={{textAlign:"center",marginBottom:22}}><div style={{fontSize:38,marginBottom:10}}>📅</div>{H("Wann hast du Zeit für mich?")}{S("Ich freu mich auf jeden Tag mit dir")}</div><input type="date" value={ans.date} onChange={e=>set("date",e.target.value)} min={new Date().toISOString().split("T")[0]} style={{width:"100%",padding:"15px 18px",borderRadius:16,border:"2px solid #f0d0e0",fontSize:16,fontFamily:"'Nunito',sans-serif",outline:"none",color:"#2d1f3d",background:"#fff9fc"}}/>{ans.date&&<div style={{background:"#f0fff8",borderRadius:12,padding:"12px 16px",marginTop:14,border:"1.5px solid #a8e6cf",textAlign:"center"}}><span style={{color:"#27ae60",fontWeight:800,fontSize:14,fontFamily:"'Nunito',sans-serif"}}>✓ Perfekt! Ich freu mich SO sehr! 🥰</span></div>}<BtnP onClick={next} disabled={!ans.date}>Weiter 💕</BtnP></div>),

    4:(<div key={sk} className="dp-slide" style={CARD}><Progress n={pn}/><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:38,marginBottom:10}}>⏰</div>{H("Wie spät soll's sein?")}{S("Je früher, desto mehr Zeit für uns ☺️")}</div><div style={{display:"flex",flexDirection:"column",gap:9}}>{TIMES.map(({t,l,s})=><div key={t} onClick={()=>set("time",t)} style={{display:"flex",alignItems:"center",gap:14,background:ans.time===t?"linear-gradient(135deg,#fff0f5,#f8e8ff)":"white",border:`2px solid ${ans.time===t?"#e8427b":"#f0e0e8"}`,borderRadius:14,padding:"13px 16px",cursor:"pointer",transition:"all .2s",boxShadow:ans.time===t?"0 6px 16px rgba(232,66,123,.18)":"none"}}><div style={{background:ans.time===t?"#e8427b":"#f5f0f7",color:ans.time===t?"white":"#9b8aa5",borderRadius:10,padding:"5px 11px",fontWeight:800,fontSize:13,fontFamily:"'Nunito',sans-serif",minWidth:55,textAlign:"center",transition:"all .2s"}}>{t}</div><div><div style={{fontWeight:700,fontSize:14,color:"#2d1f3d",fontFamily:"'Nunito',sans-serif"}}>{l}</div><div style={{fontSize:12,color:"#b0a0ba",fontFamily:"'Nunito',sans-serif"}}>{s}</div></div>{ans.time===t&&<div style={{marginLeft:"auto",color:"#e8427b",fontSize:17}}>✓</div>}</div>)}</div><BtnP onClick={next} disabled={!ans.time}>Weiter ✨</BtnP></div>),

    6:(<div key={sk} className="dp-slide" style={CARD}><Progress n={pn}/><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:38,marginBottom:10}}>🎭</div>{H("Was sollen wir unternehmen?")}{S("Wähl einfach, was dich am meisten anlacht")}</div><Grid items={VIBES} selFn={l=>ans.vibe===l} onToggle={l=>set("vibe",l)}/><BtnP onClick={next} disabled={!ans.vibe}>Super Wahl! 🎉</BtnP></div>),

    7:(<div key={sk} className="dp-slide" style={CARD}><Progress n={pn}/><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:38,marginBottom:10}}>🍴</div>{H("Worauf haben wir Hunger?")}{S("Du kannst mehrere wählen 😋")}</div><Grid items={FOODS} selFn={l=>ans.food.includes(l)} onToggle={l=>toggle("food",l)}/><BtnP onClick={next} disabled={ans.food.length===0}>Mmh, lecker! 😍</BtnP></div>),

    9:(<div key={sk} className="dp-slide" style={CARD}><Progress n={pn}/><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:38,marginBottom:10}}>🌙</div>{H("Was machen wir danach?")}{S("Das Date muss irgendwann enden... oder? 😏")}</div><Grid items={SWEET} selFn={l=>ans.sweet.includes(l)} onToggle={l=>toggle("sweet",l)}/><BtnP onClick={next}>Weiter 💫</BtnP></div>),

    10:(<div key={sk} className="dp-slide" style={CARD}><Progress n={pn}/><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:38,marginBottom:10}}>💝</div>{H("Was liebst du am meisten an unserer Zeit?",21)}{S("Ich bin neugierig 🥰")}</div><Grid items={FAVS} selFn={l=>ans.fav===l} onToggle={l=>{set("fav",l);setTimeout(next,350);}}/></div>),

    11:(<div key={sk} className="dp-slide" style={CARD}><Progress n={pn}/><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:38,marginBottom:10}}>💭</div>{H("Hast du noch einen Wunsch?")}{S("Schreib mir deinen Herzenswunsch – oder lass es frei ✨")}</div><textarea value={ans.wish} onChange={e=>set("wish",e.target.value)} placeholder="z.B. danach noch Eis essen 🍦, Sterne gucken 🌟, tanzen gehen 💃..." rows={4} style={{width:"100%",padding:"15px 18px",borderRadius:16,border:"2px solid #f0d0e0",fontSize:15,fontFamily:"'Nunito',sans-serif",outline:"none",color:"#2d1f3d",background:"#fff9fc",resize:"none",lineHeight:1.6}}/><BtnP onClick={next}>{ans.wish?"Notiert! 📝":"Weiter ohne Wunsch →"}</BtnP></div>),

    13:(<div key={sk} className="dp-slide" style={CARD}><div style={{textAlign:"center"}}><div className="dp-pop" style={{fontSize:58,marginBottom:14}}>💑</div>{H("Es ist ein Date!",27)}<p style={{color:"#e8427b",fontWeight:800,fontSize:15,fontFamily:"'Nunito',sans-serif",marginBottom:22}}>Du bist das Abenteuer, das ich für immer erleben möchte 🥰</p><div style={{background:"linear-gradient(135deg,#fff0f5,#f8e8ff)",borderRadius:20,padding:"22px 20px",marginBottom:18,border:"1.5px solid #f0d0e0",textAlign:"left"}}><SumRow icon="📅" label="Wann" val={`${formatDate(ans.date)} · ${ans.time} Uhr`}/><SumRow icon="🎭" label="Was" val={ans.vibe}/><SumRow icon="🍴" label="Hunger auf" val={ans.food.join(", ")}/><SumRow icon="🌙" label="Danach" val={ans.sweet.join(", ")}/><SumRow icon="💝" label="Dir ist wichtig" val={ans.fav}/><SumRow icon="💭" label="Dein Wunsch" val={ans.wish}/></div><div style={{background:"white",borderRadius:14,padding:"14px 18px",marginBottom:18,border:"1.5px solid #f0e0e8"}}><p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"#9b59b6",fontSize:14,lineHeight:1.75}}>p.s. Normale Menschen texten einfach.<br/>Ich hab eine Website mit Mini-Spielen gebaut. Für dich.<br/>Kein großes Ding. 💜</p></div><BtnP onClick={copyPlan}>{copied?"✓ Kopiert! Schick's ihr! 🚀":"📋 Plan kopieren & abschicken"}</BtnP></div></div>),
  };

  return(
    <div style={WRAP}>
      <BG/>
      {confetti&&<Conf/>}
      {noFixed&&step===0&&<button onMouseEnter={escapeNo} onClick={escapeNo} style={{position:"fixed",left:noPos.x,top:noPos.y,zIndex:200,background:"#f5f0f7",color:"#9b8aa5",border:"none",padding:"10px 22px",borderRadius:50,fontSize:13,fontFamily:"'Nunito',sans-serif",fontWeight:700,cursor:"pointer",transition:"left .12s ease,top .12s ease"}}>{NO_MSGS[Math.min(noCount-1,NO_MSGS.length-1)]}</button>}
      {screens[step]??screens[13]}
    </div>
  );
}
