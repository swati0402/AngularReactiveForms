import { AbstractControl, Validator, ValidatorFn } from '@angular/forms';
export function ratingRange(min:number, max:number)
: ValidatorFn {return (c: AbstractControl):{[key:string]: boolean}|null =>{
  if(c.value!= null && (c.value < min || c.value > max || isNaN(c.value))){
    return {'range':true}
  }
  return null;
}
}
export function CompareEmail(c:AbstractControl):{[key:string]:boolean}|null
{
const val1 = c.get('email');
const val2 = c.get('confirmEmail');
if(val1.pristine || val2.pristine){
  return null;
}
  if(val1.value !== val2.value){
    return {'match':true}
  }
  return null;
}
