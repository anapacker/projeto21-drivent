export function invalidPayment(details:string){
  return {
    name:'PaymentRequired',
    message:`${details}`
  }
}