import { Service } from 'typedi';
import { UserRepository } from '@api/repositories/Users/UserRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { InvalidCredentials } from '@api/exceptions/Auth/InvalidCredentials';
import { AuthService } from '@base/infrastructure/services/auth/AuthService';
import { HashService } from '@base/infrastructure/services/hash/HashService';
import { LoginRequest } from '@api/types/requests/Auth/LoginRequest';

@Service()
export class LoginService {
  constructor(@InjectRepository() private userRepository: UserRepository, private authService: AuthService, private hashService: HashService) {
    //
  }

  public async login(data: LoginRequest) {
    let user = await this.userRepository.findOne({
      where: { email: data.email }
    });

    if (!user) {
      throw new InvalidCredentials();
    }

    if (!(await this.hashService.compare(data.password, user.password))) {
      throw new InvalidCredentials();
    }

    return this.authService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      { user: { id: user.id, email: user.email } },
    );
  }
}
