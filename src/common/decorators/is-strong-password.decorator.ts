import { Matches, MinLength } from 'class-validator';

export function IsStrongPassword(): PropertyDecorator {
  return (target, propertyKey: string | symbol) => {
    Matches(/((?=.[A-Z])(?=.[a-z])(?=.*\d).{8,})/, {
      message:
        'password is too week, ' +
        'it must have at least one number, one capital letter and one lowercase letter.',
    })(target, propertyKey);
    MinLength(8)(target, propertyKey as string);
  };
}
