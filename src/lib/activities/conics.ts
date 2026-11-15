export function parabolaState(p: number, t: number) {
  if (!Number.isFinite(p) || p === 0 || !Number.isFinite(t)) throw new RangeError('p must be nonzero and parameters finite');
  const x=t*t/(4*p), y=t;
  return {x,y,focusDistance:Math.hypot(x-p,y),directrixDistance:Math.abs(x+p)};
}
export function hyperbolaState(a:number,b:number,t:number,branch:number) {
  if (!(a>0 && b>0) || ![a,b,t].every(Number.isFinite) || ![-1,1].includes(branch)) throw new RangeError('Invalid hyperbola parameters');
  const c=Math.hypot(a,b),x=branch*a*Math.cosh(t),y=b*Math.sinh(t);
  return {c,x,y,d1:Math.hypot(x+c,y),d2:Math.hypot(x-c,y)};
}
