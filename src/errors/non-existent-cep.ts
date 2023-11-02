import { ApplicationError } from "@/protocols";

export function nonExistentCep(): ApplicationError{
  return {
    name: 'nonExistentCep',
    message:'Cannot find CEP!'
  }
}