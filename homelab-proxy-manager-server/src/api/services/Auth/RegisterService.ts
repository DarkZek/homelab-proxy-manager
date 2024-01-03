import { Service } from 'typedi';
import { UserRepository } from '@api/repositories/Users/UserRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { AuthService } from '@base/infrastructure/services/auth/AuthService';

@Service()
export class RegisterService {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    private authService: AuthService,
  ) {
    //
  }

  public async register(data: object) {
    let user = await this.userRepository.createUser(data);

    user = await this.userRepository.findOne({
      where: { id: user.id }
    });

    this.eventDispatcher.dispatch('onUserRegister', user);

    return this.authService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      { user: { id: user.id, email: user.email } },
    );
  }
}
