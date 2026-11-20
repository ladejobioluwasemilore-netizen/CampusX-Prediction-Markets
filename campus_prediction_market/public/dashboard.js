const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fmt=n=>'₦'+Number(n||0).toLocaleString('en-NG',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let user=null;try{user=JSON.parse(sessionStorage.getItem('campusXSession')||localStorage.getItem('campusXRememberedSession')||'null')}catch{}
if(!user){location.replace('index.html');}
const CAMPUSX_APPROVED_ADMINS={'progjossytech@gmail.com':'Jossy08','shinaayomiawwal@gmail.com':'Awwa_1','rachealkumapayi@gmail.com':'Honey13','mohd.yusuph08@gmail.com':'Yusuph24','amusafarid@gmail.com':'Farid10','emailux10@gmail.com':'Digimide00'};
if(user&&CAMPUSX_APPROVED_ADMINS[String(user.email||'').trim().toLowerCase()]){const id=CAMPUSX_APPROVED_ADMINS[String(user.email).trim().toLowerCase()];user={...user,role:'ADMIN',adminUserId:id,adminVerified:true};sessionStorage.setItem('campusXSession',JSON.stringify(user));if(localStorage.getItem('campusXRememberedSession'))localStorage.setItem('campusXRememberedSession',JSON.stringify(user));try{const accounts=JSON.parse(localStorage.getItem('campusXAccounts')||'[]');const ix=accounts.findIndex(a=>String(a.email||'').trim().toLowerCase()===String(user.email).toLowerCase());if(ix>=0){accounts[ix]={...accounts[ix],role:'ADMIN',adminUserId:id,adminVerified:true};localStorage.setItem('campusXAccounts',JSON.stringify(accounts));}}catch{}}
const marketList=(()=>{
 const read=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return []}};
 const primary=read('campusXMarkets'),snapshot=read('campusXMarketSnapshot'),merged=new Map();
 [...snapshot,...primary].forEach(m=>{if(!m||!m.question)return;const key=String(m.id??`question:${m.question}`);merged.set(key,{...merged.get(key),...m})});
 let result=[...merged.values()];
 // Always seed the bundled starter catalogue, even when this browser already has saved markets.
 // Existing saved markets are overlaid below so admin edits remain intact.
 if(true){
  const colleges=['COLENG','COLPHYS','COLCOMPS','COLBIOS','COLERM','COLANIM','COLPLANT'];
  const literary=colleges.map((c,i)=>({id:`literary-${c.toLowerCase()}`,category:'Competitions',question:`Will ${c} win the Literary Night?`,desc:`Pick YES if ${c} is announced as the overall winner of the Literary Night; otherwise pick NO.`,yes:[.52,.46,.58,.49,.43,.55,.47][i],no:[.48,.54,.42,.51,.57,.45,.53][i],close:'2026-12-12T18:00:00',status:'OPEN',source:'Official Literary Night organising committee final result.',criteria:`YES if ${c} is officially announced as the overall winner of the Literary Night. Otherwise NO.`}));
  const starters=[['m2','Fashion','Will the campus fashion showcase feature 10 or more designers?',.72],['m3','Entertainment','Will the headline artist perform before 10:00 PM?',.48],['m4','Campus life','Will the inter-hall sports final end in a draw?',.31],['m5','Competitions','Will the debate competition have more than 6 participating teams?',.58],['m6','Entertainment','Will the campus comedy night sell out?',.39],['m7','Fashion','Will the best-dressed award go to a first-year student?',.22],['m8','Campus life','Will the charity drive reach its published target?',.61]].map(([id,category,question,yes])=>({id,category,question,yes,no:1-yes,desc:'CampusX campus prediction market. Review the market rules before participating.',close:'2026-12-18T18:00:00',status:'OPEN',source:'Official event organiser announcement.',criteria:'YES if the stated event outcome is officially confirmed; otherwise NO.'}));
  const positions=['President','Vice President','General Secretary','Assistant General Secretary','Financial Secretary','Treasurer','Public Relations Officer','Social Director','Assistant Social Director','Sports Secretary','Assistant Sports Secretary','Welfare Director','Assistant Welfare Director','Auditor'];
  const scopes=[{type:'SUG',name:'SUG',college:''},...colleges.map(name=>({type:'College',name,college:name})),{type:'Department',name:'Statistics Department',college:'COLPHYS'}];
  const names=['Tobi Adeyemi','Femi Oladipo','Daniel Eze','Ibrahim Bello','Chinedu Okafor','Samuel Akinyemi','David Ojo','Emmanuel Balogun','Kemi Adebayo','Zainab Yusuf','Michael Okon'];
  const elections=scopes.flatMap((scope,si)=>positions.map((position,pi)=>{const candidate=names[(si*3+pi)%names.length],yes=[.51,.43,.58,.47,.54,.49,.62,.45,.52,.41,.56][(si+pi)%11];return{id:`election-${scope.type.toLowerCase()}-${scope.name.toLowerCase()}-${pi}`,category:'Campus Elections',section:scope.type,scope:scope.name,college:scope.college,position,candidate,question:`Will ${candidate} win ${scope.name} ${position}?`,desc:`${scope.name} election · ${position}. Candidate details are subject to confirmation by the election organizers.`,yes,no:1-yes,close:'2027-02-15T18:00:00',criteria:`YES if ${candidate} is officially declared winner of the ${scope.name} ${position} election. Otherwise NO.`,source:'Official FUNAAB election committee result / certified announcement.',status:'OPEN'}}));
  const mrNames=['Tobi Adeyemi','Femi Oladipo','Daniel Eze','Ibrahim Bello','Chinedu Okafor','Samuel Akinyemi','David Ojo','Emmanuel Balogun'];const mrMarkets=mrNames.map((name,i)=>{const yes=[.18,.14,.12,.11,.15,.13,.10,.17][i];return{id:`mrfunaab-${i+1}`,category:'Competitions',question:`Will ${name} win Mr FUNAAB 2026/2027?`,desc:'Contestant information is subject to confirmation by the event organizers.',yes,no:1-yes,close:'2027-03-01T18:00:00',criteria:`YES if ${name} is officially announced as Mr FUNAAB 2026/2027 by the event organisers. Otherwise NO.`,source:'Official Mr FUNAAB 2026/2027 organising committee announcement.',status:'OPEN'}});
  const starterCatalogue=[...starters,...literary,...mrMarkets,...elections];
  // Always retain the bundled catalogue and overlay admin-created / edited markets.
  const combined=new Map(starterCatalogue.map(m=>[String(m.id),m]));
  result.forEach(m=>combined.set(String(m.id??`question:${m.question}`),{...combined.get(String(m.id??`question:${m.question}`)),...m}));
  result=[...combined.values()];
  try{localStorage.setItem('campusXMarkets',JSON.stringify(result));localStorage.setItem('campusXMarketSnapshot',JSON.stringify(result));}catch{}
 }
 return result;
})();
let balance=Number(localStorage.getItem('campusXWalletBalance')||0);
let requests=(()=>{try{return JSON.parse(localStorage.getItem('campusXWalletRequests')||'[]')}catch{return []}})();
let positions=(()=>{try{return JSON.parse(localStorage.getItem('campusXPositions')||'[]')}catch{return []}})();
let activeMarketCategory='All';
let pendingMarketOrder=null;
let slipSelections=[];
let pendingMultiSlip=null;
let chartsCollapsed=localStorage.getItem('campusXPreferences')?JSON.parse(localStorage.getItem('campusXPreferences')).charts==='closed':false;
let selectedMarketsCollapsed=localStorage.getItem('campusXSelectedMarketsCollapsed')==='true';
let lastMarketPrices=(()=>{try{return JSON.parse(localStorage.getItem('campusXMarketPriceHistory')||'{}')}catch{return {}}})();
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)};
const save=()=>{localStorage.setItem('campusXWalletBalance',String(balance));localStorage.setItem('campusXWalletRequests',JSON.stringify(requests));localStorage.setItem('campusXPositions',JSON.stringify(positions))};
function marketCard(m){const y=Number(m.yes??m.yes_price??.5),n=Number(m.no??m.no_price??(1-y)),pickedYes=slipSelections.some(x=>String(x.marketId)===String(m.id)&&x.side==='YES'),pickedNo=slipSelections.some(x=>String(x.marketId)===String(m.id)&&x.side==='NO');return `<article class="dash-market-card"><small>${esc(m.category||'CAMPUS MARKET')} · ${esc(m.status||'OPEN')}${m.section?' · '+esc(m.scope||m.section)+' · '+esc(m.position||''):''}</small><h3>${esc(m.question)}</h3><p>${esc(m.desc||m.description||'CampusX prediction market. Review the market rules before participating.')}</p><div class="dash-market-actions"><button class="yes ${pickedYes?'slip-picked':''}" data-slip-pick="YES" data-id="${esc(m.id)}" ${m.status&&m.status!=='OPEN'?'disabled':''}>${pickedYes?'✓ Selected YES':'Select YES'} · ${Math.round(y*100)}%</button><button class="no ${pickedNo?'slip-picked':''}" data-slip-pick="NO" data-id="${esc(m.id)}" ${m.status&&m.status!=='OPEN'?'disabled':''}>${pickedNo?'✓ Selected NO':'Select NO'} · ${Math.round(n*100)}%</button></div></article>`}
function renderMarkets(){
 const host=$('#allMarketGrid');if(!host)return;
 const q=($('#marketSearch')?.value||'').toLowerCase().trim();
 const list=marketList.filter(m=>{
  const category=String(m.category||'').toLowerCase();
  const election=category.includes('election');
  const matchesCategory=activeMarketCategory==='All'||(activeMarketCategory==='Elections'?election:category===activeMarketCategory.toLowerCase());
  return matchesCategory&&`${m.question} ${m.category} ${m.scope||''} ${m.position||''}`.toLowerCase().includes(q);
 });
 host.innerHTML=list.map(marketCard).join('')||`<div class="tracked-empty"><b>No ${activeMarketCategory==='All'?'':esc(activeMarketCategory.toLowerCase())+' '}markets yet</b>There are no markets in this category right now. Check another category or come back later.</div>`;
 if($('#marketResultLabel'))$('#marketResultLabel').textContent=activeMarketCategory==='All'?'Showing all categories':`Showing ${activeMarketCategory} markets`;
 if($('#marketResultCount'))$('#marketResultCount').textContent=`${list.length} MARKET${list.length===1?'':'S'}`;
 // Keep the overview preview populated independently from the full Markets page.
 // Exactly three cards are shown initially; the remaining catalogue is rendered only
 // in the expandable region and remains expanded across market re-renders.
 const preview=$('#overviewMarketGrid'),more=$('#overviewMoreMarkets'),expand=$('#toggleOverviewMarkets');
 const opened=expand?.getAttribute('aria-expanded')==='true';
 if(preview){preview.innerHTML=marketList.slice(0,3).map(marketCard).join('');preview.style.display='grid';}
 if(more){more.innerHTML=opened?marketList.slice(3).map(marketCard).join(''):'';more.hidden=!opened;more.style.display=opened?'grid':'none';}
 if(expand){expand.textContent=opened?'Show fewer markets ↑':`View all markets ↓ (${Math.max(0,marketList.length-3)} more)`;expand.disabled=marketList.length<=3;}
 $$('[data-slip-pick]').forEach(b=>b.onclick=()=>toggleSlipSelection(b.dataset.id,b.dataset.slipPick));
}
function getOutcomePrice(m,side){const yes=Math.min(.99,Math.max(.01,Number(m.yes??m.yes_price??.5))),no=Math.min(.99,Math.max(.01,Number(m.no??m.no_price??(1-yes))));return side==='YES'?yes:no}
function toggleSlipSelection(id,side){const m=marketList.find(x=>String(x.id)===String(id));if(!m)return;if(m.status&&m.status!=='OPEN')return toast('Only open markets can be added to a slip.');const existing=slipSelections.findIndex(x=>String(x.marketId)===String(id));if(existing>=0){if(slipSelections[existing].side===side)slipSelections.splice(existing,1);else slipSelections[existing]={marketId:m.id,question:m.question,side,price:getOutcomePrice(m,side)};}else slipSelections.push({marketId:m.id,question:m.question,side,price:getOutcomePrice(m,side)});renderMarkets();renderSlip();}

function openSlipExpansion(){
 let panel=document.getElementById('cxSlipExpansion');
 if(!panel){
  panel=document.createElement('div');
  panel.id='cxSlipExpansion';
  panel.className='cx-slip-overlay';
  panel.innerHTML=`<div class="cx-slip-expansion" role="dialog" aria-modal="true" aria-labelledby="cxSlipExpansionTitle">
   <div class="cx-slip-expansion-head"><div class="cx-slip-title-wrap"><span class="cx-slip-title-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3.8h8l3 3V20H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"/><path d="M15 4v4h4M9 12h6M9 16h6"/></svg></span><div><span class="cx-slip-eyebrow">CAMPUSX CHECKOUT</span><h2 id="cxSlipExpansionTitle">Your market slip</h2><p>Review your selections and stake before payment</p></div></div><button type="button" class="cx-slip-close" aria-label="Close slip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
   <div class="cx-slip-progress"><span></span></div>
   <div class="cx-slip-expansion-body" id="cxSlipExpansionBody"></div>
   <div class="cx-slip-expansion-foot"><button type="button" class="cx-slip-back">Continue selecting</button><button type="button" class="cx-slip-proceed">Proceed to Payment</button></div>
  </div>`;
  document.body.appendChild(panel);
  panel.querySelector('.cx-slip-close').addEventListener('click',closeSlipExpansion);
  panel.querySelector('.cx-slip-back').addEventListener('click',closeSlipExpansion);
  panel.addEventListener('click',e=>{if(e.target===panel)closeSlipExpansion()});
  panel.querySelector('.cx-slip-proceed').addEventListener('click',()=>{
   const stakeCopy=document.getElementById('cxSlipExpansionStake');
   const stakeField=document.getElementById('slipStake');
   if(stakeCopy&&stakeField){stakeField.value=stakeCopy.value;stakeField.dispatchEvent(new Event('input',{bubbles:true}));}
   document.getElementById('placeMultiSlip')?.click();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSlipExpansion()});
 }
 const body=panel.querySelector('#cxSlipExpansionBody');
 const source=document.getElementById('slipSelections');
 if(source && source.innerHTML.trim()){
  body.innerHTML=source.innerHTML;
 }else{
  body.innerHTML='<div class="cx-slip-empty">No markets selected yet. Choose a YES or NO outcome to add one.</div>';
 }
 const summary=document.querySelector('#multiMarketSlip .slip-summary,#multiMarketSlip .slip-totals,#multiMarketSlip .slip-footer');
 if(summary){const wrap=document.createElement('div');wrap.className='cx-slip-summary-copy';const copy=summary.cloneNode(true);copy.querySelector('label')?.remove();copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));wrap.appendChild(copy);body.appendChild(wrap)}
 const stake=document.getElementById('slipStake');
 if(stake){
  const clone=stake.cloneNode(true);clone.id='cxSlipExpansionStake';
  const wrap=document.createElement('label');wrap.className='cx-slip-stake-wrap';wrap.innerHTML='<span>Stake amount</span>';wrap.appendChild(clone);body.appendChild(wrap);
  clone.addEventListener('input',()=>{stake.value=clone.value;stake.dispatchEvent(new Event('input',{bubbles:true}));const multiplier=Number(document.getElementById('slipMultiplier')?.textContent.replace('×',''))||1;const cards=body.querySelectorAll('.cx-slip-summary-copy .slip-summary>div');if(cards[1])cards[1].querySelector('b').textContent=fmt(Number(clone.value||0)*multiplier);if(cards[2])cards[2].querySelector('b').textContent=fmt(Math.max(0,Number(clone.value||0)*multiplier-Number(clone.value||0)));});
 }
 panel.classList.add('is-open');
 document.body.classList.add('cx-slip-lock');
 panel.querySelector('.cx-slip-close').focus();
}
function closeSlipExpansion(){
 const panel=document.getElementById('cxSlipExpansion');
 if(panel)panel.classList.remove('is-open');
 document.body.classList.remove('cx-slip-lock');
}

function ensureDashFloatingSlip(){
 let b=$('#cxDashSlipFloat');
 if(!b){b=document.createElement('button');b.id='cxDashSlipFloat';b.type='button';b.className='cx-slip-float';b.innerHTML='<span class="cx-slip-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3.8h8l3 3V20H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"/><path d="M15 4v4h4M9 12h6M9 16h6"/></svg></span><span><b>View Slip</b><small id="cxDashSlipCount">0 selections</small></span><strong id="cxDashSlipReturn">₦0</strong>';document.body.appendChild(b);b.addEventListener('click',()=>openSlipExpansion());}
 return b;
}
function renderSlip(){ensureDashFloatingSlip();const host=$('#slipSelections');if(!host)return;$('#slipCount').textContent=String(slipSelections.length);const float=$('#cxDashSlipFloat');if(float){const stakeNow=Number($('#slipStake')?.value)||0,multNow=slipSelections.reduce((v,x)=>v*(1/x.price),1);$('#cxDashSlipCount').textContent=`${slipSelections.length} selection${slipSelections.length===1?'':'s'}`;$('#cxDashSlipReturn').textContent=fmt(stakeNow*multNow);float.classList.toggle('visible',slipSelections.length>0);}host.innerHTML=slipSelections.length?slipSelections.map((x,i)=>`<div class="slip-row"><div><b>${esc(x.question)}</b><small>${esc(x.side)} · ${Math.round(x.price*100)}% · ${fmt(x.price)} price</small></div><button type="button" data-remove-slip="${i}" aria-label="Remove selection"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"/></svg></button></div>`).join(''):'<p>Select YES or NO on multiple markets to build a combined slip.</p>';host.querySelectorAll('[data-remove-slip]').forEach(b=>b.onclick=()=>{slipSelections.splice(Number(b.dataset.removeSlip),1);renderSlip();renderMarkets()});const multiplier=slipSelections.reduce((v,x)=>v*(1/x.price),1),stake=Number($('#slipStake')?.value)||0,earnings=stake*multiplier;$('#slipMultiplier').textContent=multiplier.toFixed(2)+'×';$('#slipEarnings').textContent=fmt(earnings);$('#slipProfit').textContent=fmt(Math.max(0,earnings-stake));const canProceed=slipSelections.length>=2&&stake>=1000&&stake<=1000000;$('#placeMultiSlip').disabled=!canProceed;const overlayProceed=document.querySelector('#cxSlipExpansion .cx-slip-proceed');if(overlayProceed)overlayProceed.disabled=!canProceed;}
$('#slipStake')?.addEventListener('input',renderSlip);$('#clearSlip')?.addEventListener('click',()=>{slipSelections=[];renderSlip();renderMarkets()});
function startSquadCoCheckout(){const stake=Math.round(Number($('#slipStake')?.value)||0);if(slipSelections.length<2||stake<1000||stake>1000000){renderSlip();return}toast('Checkout and real-money payments will be enabled when the backend is added. Your selections are saved locally for now.');localStorage.setItem('campusXPendingSlip',JSON.stringify({stake,selections:slipSelections,createdAt:new Date().toISOString()}));}
$('#placeMultiSlip')?.addEventListener('click',startSquadCoCheckout);
function openMarketPayment(id,side){
 const m=marketList.find(x=>String(x.id)===String(id));if(!m)return;
 if((String(m.category||'').toLowerCase().includes('election')||['sug','college','department'].includes(String(m.section||'').toLowerCase()))&&Date.now()>=new Date(localStorage.getItem('campusXElectionBuyDeadline')||Date.now()+1).getTime())return toast('The FUNAAB election buying window has closed.');
 const yes=Math.min(.99,Math.max(.01,Number(m.yes??m.yes_price??.5))),no=Math.min(.99,Math.max(.01,Number(m.no??m.no_price??(1-yes))));
 const price=side==='YES'?yes:no;
 pendingMarketOrder={market:m,side,price};
 $('#checkoutQuestion').textContent=m.question||'Selected market';
 $('#checkoutSide').textContent=side;$('#checkoutPrice').textContent=`${(price*100).toFixed(1)}% · ${fmt(price)} per share`;
 $('#checkoutWallet').textContent=fmt(balance);$('#checkoutAmount').value=1000;updateCheckoutEstimate();
 $('#marketPaymentModal').classList.add('show');document.body.classList.add('modal-open');
}
function updateCheckoutEstimate(){if(!pendingMarketOrder)return;const amount=Number($('#checkoutAmount').value)||0,price=pendingMarketOrder.price,shares=price?amount/price:0,payout=shares,profit=payout-amount;$('#checkoutShares').textContent=shares.toLocaleString('en-NG',{maximumFractionDigits:2});$('#checkoutPayout').textContent=fmt(payout);$('#checkoutProfit').textContent=fmt(profit);$('#checkoutConfirm').disabled=amount<1000||amount>1000000||amount>balance;$('#checkoutLimitHint').textContent=amount<1000?'Minimum stake is ₦1,000.':amount>1000000?'Maximum stake is ₦1,000,000.':amount>balance?'Your wallet balance is insufficient.':'Review your position before confirming.'}
$('#checkoutAmount')?.addEventListener('input',updateCheckoutEstimate);
$('#checkoutClose')?.addEventListener('click',()=>{$('#marketPaymentModal').classList.remove('show');document.body.classList.remove('modal-open')});
$('#checkoutAddFunds')?.addEventListener('click',()=>{$('#marketPaymentModal').classList.remove('show');document.body.classList.remove('modal-open');switchView('wallet')});
$('#checkoutConfirm')?.addEventListener('click',()=>{if(!pendingMarketOrder)return;const amount=Number($('#checkoutAmount').value);if(!Number.isFinite(amount)||amount<1000||amount>1000000||amount>balance)return updateCheckoutEstimate();const {market,side,price}=pendingMarketOrder;const shares=amount/price;balance-=amount;const placedAt=new Date().toISOString();positions.push({marketId:market.id,question:market.question,side,amount,cost:amount,price,shares,payout:shares,date:placedAt,status:'OPEN'});requests.push({id:crypto.randomUUID(),label:`${side} market position`,detail:market.question,amount,status:'Submitted',date:placedAt});save();renderBalance();renderMyMarkets();$('#marketPaymentModal').classList.remove('show');document.body.classList.remove('modal-open');pendingMarketOrder=null;toast('Position added to My Markets. Payment settlement requires an active verified provider.');switchView('my-markets')});


function renderTrendChart(m,p){
 const history=(()=>{try{return JSON.parse(localStorage.getItem('campusXMarketPriceHistory')||'{}')}catch{return {}}})();
 let values=(history[m.id]||[]).map(x=>Number(x.price)).filter(Number.isFinite);
 if(p.side==='NO')values=(history[m.id]||[]).map(x=>Number(x.no??x.noPrice??(1-Number(x.price)))).filter(Number.isFinite);
 const rawYes=Number(m.yes??m.yes_price??p.price??.5),rawNo=Number(m.no??m.no_price??(1-rawYes)),current=p.side==='NO'?rawNo:rawYes,entry=Number(p.price??current);
 if(values.length<2)values=[entry,current];
 values=values.slice(-18);while(values.length<12)values.unshift(values[0]??current);
 const seed=String(m.id||p.marketId||'market').replace(/[^a-z0-9]/gi,'').slice(0,18)||'market';
 return `<div class="live-market-chart" data-market-chart="${esc(seed)}" data-side="${esc(p.side||'YES')}" data-current="${current}"><svg viewBox="0 0 300 78" preserveAspectRatio="none" role="img" aria-label="Animated illustrative market price chart"><path class="chart-grid" d="M0 18H300M0 39H300M0 60H300"/><g class="chart-segments"></g><circle class="chart-dot" r="3.5" cx="295" cy="39" fill="#279653"/></svg></div><div class="live-chart-caption">Animated price movement · listing value updates when odds are published</div>`;
}
function updateLiveCharts(){
 const now=Date.now();
 document.querySelectorAll('[data-market-chart]').forEach(el=>{
  const base=Math.max(.05,Math.min(.95,Number(el.dataset.current)||.5));
  if(!el._chartValues){
   el._chartBase=base;
   el._chartPhase=(Array.from(String(el.dataset.marketChart||'market')).reduce((a,c)=>a+c.charCodeAt(0),0)%100)/100*Math.PI*2;
   const phase=el._chartPhase;
   const waveAt=t=>base+Math.sin(t/6200+phase)*.036+Math.sin(t/10300+phase*1.7)*.014;
   el._chartValues=Array.from({length:18},(_,i)=>waveAt(now-(17-i)*460));
   el._chartLastStep=now;
  }
  const values=el._chartValues,phase=el._chartPhase,chartBase=el._chartBase;
  const waveAt=t=>chartBase+Math.sin(t/6200+phase)*.036+Math.sin(t/10300+phase*1.7)*.014;
  /* Add a new point only after each gentle step; ease toward the slow wave. */
  if(now-el._chartLastStep>=430){
   const target=waveAt(now),last=values[values.length-1];
   values.push(last+(target-last)*.42);
   if(values.length>22)values.shift();
   el._chartLastStep=now;
  }
  const low=chartBase-.065,high=chartBase+.065,span=high-low;
  const pts=values.map((v,i)=>({x:i/(values.length-1)*290+5,y:68-((Math.max(low,Math.min(high,v))-low)/span)*58}));
  const group=el.querySelector('.chart-segments');if(!group)return;
  const segments=pts.slice(1);
  if(group.children.length!==segments.length){group.innerHTML=segments.map(()=>'<line/>').join('');}
  segments.forEach((pt,i)=>{const line=group.children[i];line.setAttribute('class',values[i+1]>=values[i]?'trend-up':'trend-down');line.setAttribute('x1',pts[i].x.toFixed(1));line.setAttribute('y1',pts[i].y.toFixed(1));line.setAttribute('x2',pt.x.toFixed(1));line.setAttribute('y2',pt.y.toFixed(1));});
  const dot=el.querySelector('.chart-dot'),lastPoint=pts[pts.length-1];
  dot.setAttribute('cx',lastPoint.x);dot.setAttribute('cy',lastPoint.y);
  dot.setAttribute('fill',values[values.length-1]>=values[values.length-2]?'#279653':'#df4b4b');
 });
}

function renderMyMarkets(){const host=$('#myMarketsGrid');if(!host)return;const active=positions.filter(p=>p.marketId||p.question);$('#trackedMarketCount').textContent=`${active.length} TRACKED`;if(!active.length){host.innerHTML='<div class="tracked-empty"><b>No selected markets yet</b>Choose a YES or NO position from All markets and it will appear here for tracking.</div>';applySelectedMarketsCollapse();return}host.innerHTML=active.map((p,i)=>{const m=marketList.find(x=>String(x.id)===String(p.marketId))||marketList.find(x=>x.question===p.question)||{};const yes=Number(m.yes??m.yes_price??p.price??.5),no=Number(m.no??m.no_price??(1-yes)),current=p.side==='NO'?no:yes,entry=Number(p.price??(p.side==='NO'?no:yes)),cost=Number(p.cost??p.amount??0),shares=Number(p.shares??(entry?cost/entry:0)),value=p.side==='MULTI'?Number(p.payout||0):shares*current,delta=value-cost,up=delta>=0;return `<article class="tracked-market-card" style="animation-delay:${Math.min(i*60,360)}ms"><div class="tracked-market-top"><small>${esc(m.category||'CAMPUS MARKET')} · ${esc(m.status||p.status||'OPEN')}</small><span class="tracked-side ${p.side==='NO'?'no':''}">${esc(p.side||'YES')} POSITION</span></div><h3>${esc(p.question||m.question||'Selected market')}</h3><div class="tracked-market-meta"><span>${p.side==='MULTI'?'Combined multiplier '+Number(p.multiplier||0).toFixed(2)+'×':'Entry '+Math.round(entry*100)+'%'}</span><span>${p.side==='MULTI'?(p.picks||[]).length+' selections':'Current '+Math.round(current*100)+'%'}</span></div>${p.side==='MULTI'?`<div class="slip-leg-list">${(p.picks||[]).map(x=>`<small>${esc(x.side)} · ${esc(x.question)} · ${Math.round(x.price*100)}%</small>`).join('')}</div>`:renderTrendChart(m,p)}<div class="tracked-market-values"><div><small>POSITION COST</small><b>${fmt(cost)}</b></div><div><small>EST. VALUE</small><b>${fmt(value)}</b></div><div><small>VALUE CHANGE</small><b style="color:${up?'#287344':'#a15e3e'}">${up?'+':''}${fmt(delta)}</b></div></div></article>`}).join('');applySelectedMarketsCollapse()}
function applySelectedMarketsCollapse(){const grid=$('#myMarketsGrid'),button=$('#toggleSelectedMarkets');grid?.classList.toggle('selected-markets-collapsed',selectedMarketsCollapsed);if(grid){grid.setAttribute('aria-hidden',String(selectedMarketsCollapsed));grid.inert=selectedMarketsCollapsed;}if(button){button.innerHTML=selectedMarketsCollapsed?'Expand selected markets <span aria-hidden="true">⌄</span>':'Collapse selected markets <span aria-hidden="true">⌃</span>';button.setAttribute('aria-expanded',String(!selectedMarketsCollapsed));}}
$('#toggleSelectedMarkets')?.addEventListener('click',()=>{selectedMarketsCollapsed=!selectedMarketsCollapsed;localStorage.setItem('campusXSelectedMarketsCollapsed',String(selectedMarketsCollapsed));applySelectedMarketsCollapse();});

function renderBalance(){['#walletBalance','#headerBalance','#overviewBalance'].forEach(s=>{if($(s))$(s).textContent=fmt(balance)});$('#overviewMarketCount').textContent=marketList.length;$('#overviewPositions').textContent=positions.length;$('#transactionList').innerHTML=requests.slice().reverse().map(r=>`<div class="dash-transaction"><div><b>${esc(r.label)}</b><small>${esc(r.detail)} · ${new Date(r.date).toLocaleString('en-NG')}</small></div><strong>${fmt(r.amount)}<small style="display:block;color:#b17a2f">${esc(r.status)}</small></strong></div>`).join('')||'<p>No wallet transactions yet.</p>'}
function switchView(name){if(name==='admin-tools'&&!user?.adminVerified)return;const target=$('#view-'+name);if(!target)return;$$('.dash-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$$('.dash-view').forEach(v=>v.classList.toggle('active',v===target));if(name==='markets')renderMarkets();if(name==='my-markets')renderMyMarkets();if(name==='elections')renderElectionView(activeElectionScope);window.scrollTo({top:0,behavior:'smooth'})}
// Reliable overview market expansion. The full catalogue is rendered on demand and
// visibility is controlled with both the hidden attribute and inline display so it
// remains usable across browsers and mobile webviews.
function setOverviewMarketsExpanded(expanded){
 const button=$('#toggleOverviewMarkets'),panel=$('#overviewMoreMarkets'),preview=$('#overviewMarketGrid');
 if(!button||!panel||!preview)return;
 const firstThree=marketList.slice(0,3);
 preview.innerHTML=firstThree.map(marketCard).join('')||'<div class="tracked-empty"><b>No markets available</b>Markets will appear here when they are published.</div>';
 preview.style.display='grid';
 const remaining=marketList.slice(3);
 panel.innerHTML=expanded?remaining.map(marketCard).join(''):'';
 panel.hidden=!expanded;
 panel.style.display=expanded&&remaining.length?'grid':'none';
 button.setAttribute('aria-expanded',String(Boolean(expanded&&remaining.length)));
 button.textContent=expanded?'Show fewer markets ↑':`View all markets ↓ (${remaining.length} more)`;
 button.disabled=remaining.length===0;
 [panel,preview].forEach(region=>region.querySelectorAll('[data-slip-pick]').forEach(b=>b.onclick=()=>toggleSlipSelection(b.dataset.id,b.dataset.slipPick)));
}
window.setOverviewMarketsExpanded=setOverviewMarketsExpanded;
$('#toggleOverviewMarkets')?.addEventListener('click',()=>setOverviewMarketsExpanded($('#toggleOverviewMarkets').getAttribute('aria-expanded')!=='true'));

$$('.dash-nav button').forEach(b=>b.onclick=()=>switchView(b.dataset.view));if(location.hash==='#profile')switchView('profile');
$('#topMarketsNav')?.addEventListener('click',()=>{switchView('overview');setOverviewMarketsExpanded(false);requestAnimationFrame(()=>$('#overviewMarketsPanel')?.scrollIntoView({behavior:'smooth',block:'start'}));});$('#mainWalletButton')?.addEventListener('click',()=>switchView('wallet'));$$('[data-main-wallet]').forEach(b=>b.addEventListener('click',()=>switchView('wallet')));$$('[data-open-view]').forEach(b=>b.onclick=()=>switchView(b.dataset.openView));if($('#marketSearch'))$('#marketSearch').oninput=renderMarkets;
$$('[data-market-category]').forEach(button=>button.addEventListener('click',()=>{activeMarketCategory=button.dataset.marketCategory;$$('[data-market-category]').forEach(chip=>{const selected=chip===button;chip.classList.toggle('active',selected);chip.setAttribute('aria-pressed',String(selected))});renderMarkets()}));
let activeElectionScope='SUG';
const electionPositions=['President','Vice President','General Secretary','Assistant General Secretary','Financial Secretary','Treasurer','Public Relations Officer','Social Director','Sports Secretary','Welfare Director','Auditor','Parliamentarian'];
const electionColleges=['COLENG','COLPHYS','COLCOMPS','COLBIOS','COLERM','COLANIM','COLPLANT'];
function renderElectionView(scope='SUG'){
 activeElectionScope=scope;$$('[data-election-scope]').forEach(b=>b.classList.toggle('active',b.dataset.electionScope===scope));
 const heading=$('#electionScopeHeading'),host=$('#electionPositionList');if(!host)return;
 let groups=[];
 if(scope==='SUG')groups=[{name:'Student Union Government (SUG)',key:'SUG'}];
 else if(scope==='College')groups=electionColleges.map(name=>({name,key:name}));
 else {const departments=[...new Set(marketList.filter(m=>String(m.section||'').toLowerCase()==='department').map(m=>String(m.department||m.scope||'').trim()).filter(Boolean))].sort();groups=departments.map(name=>({name,key:name}));if(!groups.length)groups=[{name:'Department markets',key:'__none__'}]}
 const all=groups.map(g=>{const matches=marketList.filter(m=>{const section=String(m.section||'').toLowerCase(),scopeValue=String(m.scope||m.college||m.department||'').toLowerCase();return (String(m.category||'').toLowerCase().includes('election')||section==='sug'||section==='college'||section==='department')&&(scope==='SUG'?section==='sug'||scopeValue==='sug':scope==='College'?section==='college'&&scopeValue===g.key.toLowerCase():section==='department'&&scopeValue===g.key.toLowerCase())});return {group:g,markets:matches}});
 heading.innerHTML=scope==='SUG'?'<h3>Student Union Government (SUG)</h3><p>Markets for every SUG executive position, from President downwards.</p>':scope==='College'?'<h3>College elections</h3><p>Choose a college to see its published election positions and candidate markets.</p>':'<h3>Departmental elections</h3><p>Department markets appear here once published by the market creator.</p>';
 host.innerHTML=all.map(({group,markets})=>`<section class="election-group"><h4>${esc(group.name)}</h4><div class="election-position-list">${electionPositions.map(position=>{const found=markets.filter(m=>String(m.position||'').toLowerCase()===position.toLowerCase()||String(m.question||'').toLowerCase().includes(position.toLowerCase()));return `<article class="election-position-card"><b>${esc(position)}</b><small>${esc(group.name)} · ${found.length?'Market available':'Position market'}</small>${found.length?`<div class="published-market">${found.map(m=>marketCard(m)).join('')}</div>`:'<span class="awaiting">Awaiting candidate / market listing</span>'}</article>`}).join('')}</div></section>`).join('');
 host.querySelectorAll('[data-slip-pick]').forEach(b=>b.onclick=()=>toggleSlipSelection(b.dataset.id,b.dataset.slipPick));
}
$$('[data-election-scope]').forEach(b=>b.addEventListener('click',()=>renderElectionView(b.dataset.electionScope)));
function initElectionCountdown(){let deadline;try{deadline=localStorage.getItem('campusXElectionBuyDeadlineV2')}catch{}if(!deadline){deadline=new Date(Date.now()+123*24*60*60*1000).toISOString();try{localStorage.setItem('campusXElectionBuyDeadlineV2',deadline)}catch{}}const target=new Date(deadline).getTime();const update=()=>{let ms=Math.max(0,target-Date.now()),days=Math.floor(ms/86400000),hours=Math.floor(ms%86400000/3600000),minutes=Math.floor(ms%3600000/60000),seconds=Math.floor(ms%60000/1000);[['countDays',days],['countHours',hours],['countMinutes',minutes],['countSeconds',seconds]].forEach(([id,v])=>{const el=$('#'+id);if(el)el.textContent=String(v).padStart(2,'0')});const label=$('#electionDeadlineLabel');if(label)label.textContent=ms>0?`Buying closes ${new Date(target).toLocaleString('en-NG',{dateStyle:'medium',timeStyle:'short'})}`:'Buying window closed';};update();setInterval(update,1000)}


const depositHints={'Bank transfer':'A transfer instruction and unique reference will be generated by the payment provider.','Debit / credit card':'Cards will be processed on a secure hosted checkout. Never share your PIN, CVV or OTP here.','USSD':'A bank-specific USSD code will be generated after provider integration.','Bank app / QR':'A secure QR code or bank-app payment link will be provided after integration.','Virtual account':'A dedicated virtual account number will be issued and reconciled by the payment provider.','OPay / PalmPay':'Choose your supported wallet on the provider checkout page after integration.'};
$('#depositMethod')?.addEventListener('change',()=>{$('#depositMethodHint').textContent=depositHints[$('#depositMethod').value]||'Payment instructions appear after provider integration.'});
$('#payoutType')?.addEventListener('change',()=>{const mobile=$('#payoutType').value==='Mobile wallet';$('#payoutBank').value='';$('#payoutBank').selectedIndex=0;$('#payoutAccount').placeholder=mobile?'11-digit mobile wallet phone number':'10-digit bank account number';});
try{const preferred=localStorage.getItem('campusXPreferredPayoutProvider');if(preferred)$('#payoutBank').value=preferred}catch{}
$('#savePayoutChoice')?.addEventListener('change',e=>{if(e.target.checked&&$('#payoutBank').value)localStorage.setItem('campusXPreferredPayoutProvider',$('#payoutBank').value);else localStorage.removeItem('campusXPreferredPayoutProvider')});
$('#payoutBank')?.addEventListener('change',()=>{if($('#savePayoutChoice')?.checked&&$('#payoutBank').value)localStorage.setItem('campusXPreferredPayoutProvider',$('#payoutBank').value)});
$('#depositForm').onsubmit=e=>{e.preventDefault();const amount=Number($('#depositAmount').value);if(amount<100)return toast('Minimum deposit is ₦100.');requests.push({id:crypto.randomUUID(),label:'Deposit request',detail:$('#depositMethod').value,amount,status:'Pending',date:new Date().toISOString()});save();renderBalance();e.target.reset();toast('Deposit request saved. Payment processing requires an active verified provider.')};
$('#withdrawForm').onsubmit=e=>{e.preventDefault();const amount=Number($('#withdrawAmount').value),account=$('#payoutAccount').value.trim();if(amount<100||amount>balance)return toast('Enter a valid amount within your wallet balance.');if($('#payoutType').value==='Mobile wallet'?!/^\d{11}$/.test(account):!/^\d{10}$/.test(account))return toast($('#payoutType').value==='Mobile wallet'?'Enter an 11-digit mobile wallet phone number.':'Enter a valid 10-digit bank account number.');requests.push({id:crypto.randomUUID(),label:'Withdrawal request',detail:`${$('#payoutType').value} · ${$('#payoutBank').value} · ${$('#payoutName').value} · ****${account.slice(-4)}`,amount,status:'Pending',date:new Date().toISOString()});save();renderBalance();e.target.reset();toast('Withdrawal request submitted as pending. No payout was sent.')};
$('#profileForm').onsubmit=async e=>{e.preventDefault();try{const api=await window.CampusXBackendReady;const saved=await api.updateProfile({full_name:$('#profileName').value,phone:$('#profilePhone').value,campus:$('#profileCampus').value,department:$('#profileDepartment').value,level:$('#profileLevel').value});user={...user,...saved};fillUser();toast('Profile updated.')}catch(err){toast(err?.message||'Could not update your profile.')}};window.CampusXRefreshUser=u=>{user={...user,...u};fillUser()};
function fillUser(){const name=user?.name||'User',email=user?.email||'';$('#welcomeUserName').textContent=name.split(' ')[0];$('#dashWelcomeName').textContent=name.split(' ')[0];$('#headerName').textContent=name.split(' ')[0];$('#headerInitial').textContent=name[0].toUpperCase();$('#profileInitial').textContent=name[0].toUpperCase();$('#overviewFullName').textContent=name;$('#overviewEmail').textContent=email;$('#profileName').value=name;$('#profileEmail').value=email;$('#profilePhone').value=user?.phone||'';$('#profileCampus').value=user?.campus||'';$('#profileDepartment').value=user?.department||'';$('#profileLevel').value=user?.level||''}
$('#logoutButton').onclick=async()=>{try{const api=await window.CampusXBackendReady;await api.signOut()}catch{}sessionStorage.removeItem('campusXSession');localStorage.removeItem('campusXRememberedSession');location.href='index.html'};
function getPrefs(){try{return JSON.parse(localStorage.getItem('campusXPreferences')||'{}')}catch{return {}}}
function applyPreferences(prefs=getPrefs()){
 document.body.classList.toggle('dark-mode',prefs.theme==='dark');document.body.classList.toggle('compact-mode',!!prefs.compact);document.body.classList.toggle('reduce-motion',!!prefs.reducedMotion);
 const theme=$('#settingTheme');if(theme)theme.value=prefs.theme||'light';const compact=$('#settingCompact');if(compact)compact.checked=!!prefs.compact;const motion=$('#settingMotion');if(motion)motion.checked=!!prefs.reducedMotion;const alerts=$('#settingAlerts');if(alerts)alerts.checked=prefs.alerts!==false;const charts=$('#settingCharts');if(charts)charts.value=prefs.charts||'open';
 chartsCollapsed=prefs.charts==='closed';$('#myMarketsGrid')?.classList.toggle('charts-collapsed',chartsCollapsed);applySelectedMarketsCollapse();
}
function savePrefs(){const prefs={theme:$('#settingTheme').value,compact:$('#settingCompact').checked,reducedMotion:$('#settingMotion').checked,alerts:$('#settingAlerts').checked,charts:$('#settingCharts').value};localStorage.setItem('campusXPreferences',JSON.stringify(prefs));applyPreferences(prefs);$('#settingsFeedback').textContent='Preferences saved on this device.';toast('Your preferences have been saved.')}
$('#savePreferences')?.addEventListener('click',savePrefs);
$('#settingTheme')?.addEventListener('change',e=>{const prefs=getPrefs();prefs.theme=e.target.value;localStorage.setItem('campusXPreferences',JSON.stringify(prefs));applyPreferences(prefs)});
$('#themeToggle')?.addEventListener('click',()=>{const prefs=getPrefs();prefs.theme=document.body.classList.contains('dark-mode')?'light':'dark';localStorage.setItem('campusXPreferences',JSON.stringify(prefs));applyPreferences(prefs);});
window.addEventListener('storage',e=>{if(e.key==='campusXMarkets'||e.key==='campusXMarketPriceHistory'){try{const latest=JSON.parse(localStorage.getItem('campusXMarkets')||'[]');const hist=JSON.parse(localStorage.getItem('campusXMarketPriceHistory')||'{}');let moved=false;Object.keys(hist).forEach(id=>{const before=lastMarketPrices[id]||[],after=hist[id]||[];if(after.length>before.length&&before.length&&Number(after.at(-1).price)!==Number(before.at(-1).price))moved=true});if(latest.length){marketList.splice(0,marketList.length,...latest);if($('#view-markets')?.classList.contains('active'))renderMarkets();renderMyMarkets();}if(moved&&getPrefs().alerts!==false)toast('A campus market price has moved. Check My Markets for the updated trend.');lastMarketPrices=hist}catch{}}});
applyPreferences();

fillUser();renderMarkets();setOverviewMarketsExpanded(false);if($('#overviewMarketGrid')&&marketList.length>=3){$('#overviewMarketGrid').innerHTML=marketList.slice(0,3).map(marketCard).join('');}renderSlip();renderMyMarkets();
;applySelectedMarketsCollapse();const adminId=CAMPUSX_APPROVED_ADMINS[String(user?.email||'').trim().toLowerCase()];const isApprovedAdmin=!!adminId;if(isApprovedAdmin){user.role='ADMIN';user.adminUserId=adminId;user.adminVerified=true;sessionStorage.setItem('campusXSession',JSON.stringify(user));if(localStorage.getItem('campusXRememberedSession'))localStorage.setItem('campusXRememberedSession',JSON.stringify(user));const adminNav=$('#adminToolsNav');if(adminNav){adminNav.classList.remove('hidden');adminNav.style.display='inline-flex';adminNav.setAttribute('aria-hidden','false');}$('#adminToolsName').textContent=user.name||'Administrator';$('#adminToolsEmail').textContent=user.email||'';$('#adminToolsId').textContent='Admin ID: '+adminId+' · Verified administrator';$('#adminToolsInitial').textContent=(user.name||'A').charAt(0).toUpperCase();}renderBalance();renderElectionView('SUG');initElectionCountdown();updateLiveCharts();setInterval(updateLiveCharts,1050);
const welcome=$('#welcomeScreen');if(welcome){sessionStorage.setItem('campusXWelcomeShown','1');setTimeout(()=>welcome.classList.add('hide'),650);setTimeout(()=>welcome.remove(),1100)}
