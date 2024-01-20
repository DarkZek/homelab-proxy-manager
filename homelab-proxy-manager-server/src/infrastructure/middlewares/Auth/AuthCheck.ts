import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '@base/config/auth';
import { Response } from 'express';
import { UserRepository } from '@base/api/repositories/Users/UserRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class AuthCheck implements ExpressMiddlewareInterface {

  public constructor (@InjectRepository() private userRepository: UserRepository) {

  }

  use(request: any, response: Response, next?: (err?: any) => any): any {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).send({ status: 401, message: 'Unauthorized!' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, authConfig.providers.jwt.secret, (err: any, user: any) => {
      if (err) {
        return response.status(401).send({ status: 401, message: 'Unauthorized!' });
      }

      this.userRepository.findOneOrFail(user.id).then((user) => {
        request.loggedUser = user;
        next();
      }).catch((e) => {
        console.error("Error fetching user. Error: ", e);
        return response.status(401).send({ status: 401, message: 'Revoked token!' });
      });
    });
  }
}
