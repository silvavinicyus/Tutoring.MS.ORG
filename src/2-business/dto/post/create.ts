import { IInputPostEntity, IPostEntity } from '@domain/entities/post'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreatePostDto = IInputPostEntity

export type IOutputCreatePostDto = Either<IError, IPostEntity>
