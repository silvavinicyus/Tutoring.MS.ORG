import { IInputCreatePostReactionDto } from '@business/dto/postReactions/create'
import { IInputDeletePostReactionDto } from '@business/dto/postReactions/delete'
import { IInputFindAllPostReactionsDto } from '@business/dto/postReactions/findAll'
import { IInputFindByPostReactionDto } from '@business/dto/postReactions/findBy'
import { PostReactionErrors } from '@business/module/errors/postReactionErrors'
import { IPostReactionRepositoryToken } from '@business/repositories/postReaction/iPostReactionRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreatePostReactionUseCase } from '@business/useCases/postReaction/createPostReaction'
import { DeletePostReactionUseCase } from '@business/useCases/postReaction/deletePostReaction'
import { FindAllPostReactionsUseCase } from '@business/useCases/postReaction/findAllPostReactions'
import { FindByPostReactionUseCase } from '@business/useCases/postReaction/findByPostReaction'
import { PostReactionTypes } from '@domain/entities/postReactions'
import { container } from '@shared/ioc/container'
import { fakePostReactionEntity } from '@tests/mock/entities/fakePostReactionEntity'
import {
  FakePostReactionRepository,
  fakePostReactionRepositoryCreate,
  fakePostReactionRepositoryDelete,
  fakePostReactionRepositoryFindAll,
  fakePostReactionRepositoryFindBy,
} from '@tests/mock/repositories/fakePostReactionRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Post Reaction Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(IPostReactionRepositoryToken).to(FakePostReactionRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create Post Reaction use case', () => {
    const input: IInputCreatePostReactionDto = {
      post_id: 1,
      type: PostReactionTypes.HAHA,
      user_id: 1,
    }

    test('Should fail to create a post reaction if repository failed', async () => {
      fakePostReactionRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreatePostReactionUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostReactionErrors.creationError())
    })

    test('Should fail to create a post reaction if repository failed', async () => {
      fakePostReactionRepositoryCreate.mockImplementationOnce(
        async () => fakePostReactionEntity
      )

      const sut = container.get(CreatePostReactionUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete Post Reaction use case', () => {
    const input: IInputDeletePostReactionDto = {
      id: 1,
    }

    test('Should fail to delete a post reaction if repository failed', async () => {
      fakePostReactionRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeletePostReactionUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostReactionErrors.deleteFailed())
    })

    test('Should fail to delete a post reaction if repository failed', async () => {
      fakePostReactionRepositoryDelete.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(DeletePostReactionUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindAll Post Reaction use case', () => {
    const input: IInputFindAllPostReactionsDto = {
      where: [
        {
          column: 'post_id',
          value: 1,
        },
      ],
    }

    test('Should fail to find all post reactions if repository failed', async () => {
      fakePostReactionRepositoryFindAll.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindAllPostReactionsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostReactionErrors.loadFailed())
    })

    test('Should fail to find all post reactions if repository failed', async () => {
      fakePostReactionRepositoryFindAll.mockImplementationOnce(async () => ({
        count: 1,
        items: [fakePostReactionEntity],
        page: 0,
        perPage: 10,
      }))

      const sut = container.get(FindAllPostReactionsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindBy Post Reaction use case', () => {
    const input: IInputFindByPostReactionDto = {
      where: [
        {
          column: 'post_id',
          value: 1,
        },
      ],
    }

    test('Should fail to find a post reaction if repository failed', async () => {
      fakePostReactionRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindByPostReactionUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostReactionErrors.loadFailed())
    })

    test('Should fail to find a post reaction if post does not exists', async () => {
      fakePostReactionRepositoryFindBy.mockImplementationOnce(
        async () => undefined
      )

      const sut = container.get(FindByPostReactionUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostReactionErrors.notFound())
    })

    test('Should fail to find a post reaction if repository failed', async () => {
      fakePostReactionRepositoryFindBy.mockImplementationOnce(
        async () => fakePostReactionEntity
      )

      const sut = container.get(FindByPostReactionUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
