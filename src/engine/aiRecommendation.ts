export function waterAI(intensity:number,reuse:number){

let advice=[];

if(intensity>5)
advice.push("Reduce freshwater consumption.");

if(reuse<40)
advice.push("Increase treated wastewater reuse.");

if(intensity<3)
advice.push("Excellent water efficiency.");

return advice;

}