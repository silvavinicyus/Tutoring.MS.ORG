import { IInputCreatePostDto } from '@business/dto/post/create'
import { IInputDeletePostDto } from '@business/dto/post/delete'
import { IInputFindAllPostsDto } from '@business/dto/post/findAll'
import { IInputFindByPostDto } from '@business/dto/post/findBy'
import { IInputUpdatePostDto } from '@business/dto/post/update'
import { PostErrors } from '@business/module/errors/postErrors'
import { IPostRepositoryToken } from '@business/repositories/post/iPostRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreatePostUseCase } from '@business/useCases/post/createPost'
import { DeletePostUseCase } from '@business/useCases/post/deletePost'
import { FindAllPostsUseCase } from '@business/useCases/post/findAllPosts'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { UpdatePostUseCase } from '@business/useCases/post/updatePost'
import { container } from '@shared/ioc/container'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'
import {
  FakePostRepository,
  fakePostRepositoryCreate,
  fakePostRepositoryDelete,
  fakePostRepositoryFindAll,
  fakePostRepositoryFindBy,
  fakePostRepositoryUpdate,
} from '@tests/mock/repositories/fakePostRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Post Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(IPostRepositoryToken).to(FakePostRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create Post Use Case', () => {
    const input: IInputCreatePostDto = {
      content: 'new content',
      fixed: false,
      group_id: 1,
      owner_id: 1,
      title: 'new title',
      image_id: 1,
    }

    test('Should fail to create a post if repository failed', async () => {
      fakePostRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreatePostUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostErrors.creationError())
    })

    test('Should have success to create a post', async () => {
      fakePostRepositoryCreate.mockImplementationOnce(
        async () => fakePostEntity
      )

      const sut = container.get(CreatePostUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete Post Use Case', () => {
    const input: IInputDeletePostDto = {
      id: 1,
    }

    test('Should fail to delete a post if repository failed', async () => {
      fakePostRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeletePostUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostErrors.deleteFailed())
    })

    test('Should have success to delete a post', async () => {
      fakePostRepositoryDelete.mockImplementationOnce(async () => void 0)

      const sut = container.get(DeletePostUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Find By Post Use Case', () => {
    const input: IInputFindByPostDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find by a post if repository failed', async () => {
      fakePostRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindByPostUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostErrors.loadFailed())
    })

    test('Should fail to find by a post if post does not exists', async () => {
      fakePostRepositoryFindBy.mockImplementationOnce(async () => undefined)

      const sut = container.get(FindByPostUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostErrors.notFound())
    })

    test('Should have success to find by a post', async () => {
      fakePostRepositoryFindBy.mockImplementationOnce(
        async () => fakePostEntity
      )

      const sut = container.get(FindByPostUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Find All Posts Use Case', () => {
    const input: IInputFindAllPostsDto = {
      where: [
        {
          column: 'group_id',
          value: 1,
        },
      ],
    }

    test('Should fail to find all posts if repository failed', async () => {
      fakePostRepositoryFindAll.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindAllPostsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostErrors.loadFailed())
    })

    test('Should have success to find all posts', async () => {
      fakePostRepositoryFindAll.mockImplementationOnce(async () => ({
        count: 1,
        items: [fakePostEntity],
        page: 0,
        perPage: 10,
      }))

      const sut = container.get(FindAllPostsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Update Post Use Case', () => {
    const input: IInputUpdatePostDto = {
      content: 'new content',
      title: 'new title',
    }

    test('Should fail to update a post if repository failed', async () => {
      fakePostRepositoryUpdate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(UpdatePostUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostErrors.updateError())
    })

    test('Should fail to update a post if repository returned empty', async () => {
      fakePostRepositoryUpdate.mockImplementationOnce(async () => undefined)

      const sut = container.get(UpdatePostUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(PostErrors.updateError())
    })

    test('Should have success to update a post', async () => {
      fakePostRepositoryUpdate.mockImplementationOnce(
        async () => fakePostEntity
      )

      const sut = container.get(UpdatePostUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
