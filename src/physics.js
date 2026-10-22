// One shared rigid-body world. Units are design pixels, not browser/device pixels.
export const PHYSICS = Object.freeze({
 step:1000/240, gravity:1.05, density:.0016,
 friction:.62, frictionStatic:1.0, air:.012, restitution:.08,
 maxSpeed:22, maxAngularSpeed:.075, handleSpeed:1.25,
 stiffness:.075, damping:.14, sleepThreshold:90
});
export function createPhysics(M,configs,initialView,{entrance='above',reduced=false}={}){
 const {Engine,Bodies,Body,Composite,Constraint,Sleeping,Vector,Query}=M;
 const engine=Engine.create({enableSleeping:true,positionIterations:12,velocityIterations:10,constraintIterations:4});
 engine.gravity.y=PHYSICS.gravity;
 let view={...initialView},walls=[],elapsed=0,grab=null;
 const records=configs.map(config=>({config,body:null,added:false,entered:false,scale:1,release:0}));
 function pose(config){
  const mobile=view.mode==='mobile',p=mobile?config.mobile:[config.x,config.y,1,config.angle];
  return {x:p[0]+view.offsetX,y:p[1]+view.offsetY,scale:p[2],angle:p[3]*Math.PI/180};
 }
 function boundaries(){
  Composite.remove(engine.world,walls);
  const w=view.width,h=view.height,t=160,above=3000;
  const options={isStatic:true,friction:.75,restitution:.04,collisionFilter:{category:1,mask:2}};
  walls=[
   Bodies.rectangle(w/2,h+t/2,w+2*t,t,{...options,label:'floor'}),
   Bodies.rectangle(-t/2,(h-above)/2,t,h+above,{...options,label:'left'}),
   Bodies.rectangle(w+t/2,(h-above)/2,t,h+above,{...options,label:'right'}),
   Bodies.rectangle(w/2,-t/2,w+2*t,t,{...options,label:'ceiling',collisionFilter:{category:4,mask:2}})
  ];
  Composite.add(engine.world,walls);
 }
 boundaries();
 function initialize(record){
  const p=pose(record.config),c=record.config;
  record.scale=p.scale;record.initial=p;
  const halfY=(Math.abs(Math.sin(p.angle))*c.width+Math.abs(Math.cos(p.angle))*c.height)*p.scale/2;
  const y=entrance==='above'&&!reduced?Math.min(-halfY-32,p.y-view.height-350):p.y;
  record.body=Bodies.rectangle(p.x,y,c.width*p.scale,c.height*p.scale,{
   label:c.id,angle:p.angle,density:PHYSICS.density*(c.kind==='image'?1.08:1),
   friction:PHYSICS.friction,frictionStatic:PHYSICS.frictionStatic,
   frictionAir:PHYSICS.air,restitution:PHYSICS.restitution,slop:.04,
   sleepThreshold:PHYSICS.sleepThreshold,collisionFilter:{category:2,mask:3},
   render:{visible:false}
  });
 }
 records.forEach(initialize);
 // Remove the offscreen lead-in while keeping the relative spawn arrangement.
 if(entrance==='above'&&!reduced){
  const leadingEdge=Math.max(...records.map(r=>r.body.bounds.max.y));
  for(const record of records)Body.translate(record.body,{x:0,y:-leadingEdge});
 }
 function spawn(config,x){
  const record={config,body:null,added:false,entered:false,scale:1,release:elapsed};
  initialize(record);
  const body=record.body,halfX=(body.bounds.max.x-body.bounds.min.x)/2;
  const halfY=(body.bounds.max.y-body.bounds.min.y)/2;
  x=Math.max(halfX+2,Math.min(view.width-halfX-2,x));
  const clearance=candidate=>Math.min(view.height,...records.filter(r=>r.body.bounds.max.x>candidate-halfX&&r.body.bounds.min.x<candidate+halfX).map(r=>r.body.bounds.min.y));
  if(clearance(x)<halfY*2+24){
   let best=x;
   for(let candidate=halfX+2;candidate<view.width-halfX-1;candidate+=halfX/2)if(clearance(candidate)>clearance(best))best=candidate;
   x=best;
  }
  let bottom=-4;
  // Queue above any incoming bodies in this column, never spawn intersecting them.
  for(const other of records){
   const b=other.body.bounds;
   if(b.max.x>x-halfX&&b.min.x<x+halfX)bottom=Math.min(bottom,b.min.y-8);
  }
  Body.setPosition(body,{x,y:bottom-halfY});
  records.push(record);
  return record;
 }
 function limit(body){
  const velocity=Body.getVelocity(body),speed=Math.hypot(velocity.x,velocity.y);
  if(speed>PHYSICS.maxSpeed)Body.setVelocity(body,Vector.mult(velocity,PHYSICS.maxSpeed/speed));
  const angular=Body.getAngularVelocity(body);
  if(Math.abs(angular)>PHYSICS.maxAngularSpeed)Body.setAngularVelocity(body,Math.sign(angular)*PHYSICS.maxAngularSpeed);
 }
 function wakeConnected(body){
  const connected=new Set([body]);
  // Wake the whole contact island: removing support must never leave sleeping tiles suspended.
  for(let pass=0;pass<records.length;pass++){
   let changed=false;
   for(const pair of engine.pairs.list){
    if(!pair.isActive)continue;
    const a=pair.bodyA.parent,b=pair.bodyB.parent;
    if(a.isStatic||b.isStatic)continue;
    if(connected.has(a)&&!connected.has(b)){connected.add(b);changed=true}
    if(connected.has(b)&&!connected.has(a)){connected.add(a);changed=true}
   }
   if(!changed)break;
  }
  for(const b of connected)Sleeping.set(b,false);
 }
 function step(dt=PHYSICS.step){
  elapsed+=dt;
  for(const record of records){
   if(!record.added&&elapsed>=record.release){Composite.add(engine.world,record.body);record.added=true;}
   if(record.added)limit(record.body);
  }
  if(grab){
   Sleeping.set(grab.body,false);
   const delta=Vector.sub(grab.target,grab.constraint.pointA),distance=Vector.magnitude(delta);
   // Bound handle travel per substep instead of teleporting the grabbed body.
   const travel=Math.min(distance,PHYSICS.handleSpeed*dt);
   if(distance>0)grab.constraint.pointA=Vector.add(grab.constraint.pointA,Vector.mult(delta,travel/distance));
  }
  Engine.update(engine,dt);
  for(const record of records){
   if(!record.added)continue;
   limit(record.body);
   if(!record.entered&&record.body.bounds.min.y>=.5){
    record.entered=true;record.body.collisionFilter.mask=7;
   }
  }
 }
 function begin(id,point){
  end();
  const record=records.find(r=>r.config.id===id);
  if(!record?.added||!record.entered||!Query.point([record.body],point).length)return false;
  const body=record.body;wakeConnected(body);
  const constraint=Constraint.create({
   pointA:{...point},bodyB:body,pointB:Vector.sub(point,body.position),
   length:0,stiffness:PHYSICS.stiffness,damping:PHYSICS.damping,
   angularStiffness:0,render:{visible:false}
  });
  grab={body,constraint,target:{...point}};Composite.add(engine.world,constraint);
  return true;
 }
 function move(point){
  if(grab)grab.target={x:Math.max(1,Math.min(view.width-1,point.x)),y:Math.max(1,Math.min(view.height-1,point.y))};
 }
 function end(){
  if(!grab)return;
  const body=grab.body;Composite.remove(engine.world,grab.constraint);grab=null;
  Sleeping.set(body,false);limit(body);
  // The solver's current linear/angular velocities ARE the throw; no random or fixed release impulse.
 }
 function resize(next){
  end();const old=view;view={...next};boundaries();
  for(const record of records){
   const body=record.body,p=pose(record.config),ratio=p.scale/record.scale;
   if(Math.abs(ratio-1)>1e-6)Body.scale(body,ratio,ratio);
   record.scale=p.scale;record.initial=p;
   const x=body.position.x/old.width*view.width;
   const y=body.position.y<0?body.position.y:body.position.y/old.height*view.height;
   Body.setPosition(body,{x,y});
   if(record.entered){
    const hw=(body.bounds.max.x-body.bounds.min.x)/2,hh=(body.bounds.max.y-body.bounds.min.y)/2;
    Body.setPosition(body,{x:Math.max(hw+1,Math.min(view.width-hw-1,body.position.x)),y:Math.max(hh+1,Math.min(view.height-hh-1,body.position.y))});
   }
   Sleeping.set(body,false);limit(body);
  }
 }
 function nudge(id,dx,dy){
  const record=records.find(r=>r.config.id===id);if(!record?.entered)return;
  wakeConnected(record.body);
  Body.setVelocity(record.body,{x:record.body.velocity.x+dx,y:record.body.velocity.y+dy});
  limit(record.body);
 }
 function dispose(){end();Composite.clear(engine.world,false);Engine.clear(engine)}
 return {engine,records,spawn,step,begin,move,end,resize,nudge,dispose,get elapsed(){return elapsed},get held(){return grab?.body||null},get view(){return view}};
}
