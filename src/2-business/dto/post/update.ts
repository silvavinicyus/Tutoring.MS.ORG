import { IPostEntity } from '@domain/entities/post'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputUpdatePostDto = Partial<
  Pick<IPostEntity, 'title' | 'content' | 'fixed' | 'image_id'>
>

export type IOutputUpdatePostDto = Either<IError, Partial<IPostEntity>>
