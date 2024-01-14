import { Service } from 'typedi';
import { UserRepository } from '@api/repositories/Users/UserRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AuthService } from '@base/infrastructure/services/auth/AuthService';

@Service()
export class RegisterService {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    private authService: AuthService,
  ) {
    //
  }

  public async register(data: object) {

    if (await this.userRepository.count() > 0) {
      throw new Error('User already registered');
    }
    
    let user = await this.userRepository.createUser(data);

    user = await this.userRepository.findOne({
      where: { id: user.id }
    });

    return this.authService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      { user: { id: user.id, email: user.email } },
    );
  }
}
