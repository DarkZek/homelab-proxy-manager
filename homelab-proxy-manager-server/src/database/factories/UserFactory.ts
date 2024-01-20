import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '@api/models/Users/User';

define(User, (faker: typeof Faker) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName).toLowerCase();

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = 'password';

  return user;
});
