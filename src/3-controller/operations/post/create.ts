import { inject, injectable } from 'inversify'
import { IOutputCreatePostDto } from '@business/dto/post/create'
import { CreatePostUseCase } from '@business/useCases/post/createPost'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { InputCreatePost } from '@controller/serializers/post/create'
import { left } from '@shared/either'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreatePostOperator extends AbstractOperator<
  InputCreatePost,
  IOutputCreatePostDto
> {
  constructor(
    @inject(CreatePostUseCase)
    private createPost: CreatePostUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroup: FindStudyGroupByUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }
  async run(
    input: InputCreatePost,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputCreatePostDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['create_post'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const studyGroup = await this.findStudyGroup.exec({
      where: [
        {
          column: 'id',
          value: input.group_id,
        },
      ],
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
    }

    const postResult = await this.createPost.exec({
      ...input,
    })

    if (postResult.isLeft()) {
      return left(postResult.value)
    }

    return postResult
  }
}
