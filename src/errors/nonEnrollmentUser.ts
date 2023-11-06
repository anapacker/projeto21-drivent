import { ApplicationError } from '@/protocols';

export function nonEnrollmentForUser(): ApplicationError {
  return {
    name: 'nonEnrollementForUser',
    message: "User doesn't have an enrollment.",
  };
}
