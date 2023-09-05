/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Op, FindOptions, fn } from 'sequelize'
import { IUseCaseOptions } from '@business/dto/useCaseOptions'
import { IWhere } from '@business/repositories/where'
import { IRelation } from '../../2-business/repositories/relation'
import { sequelize } from './database'

interface IInputFindByOptions<E>
  extends IWhere<keyof E, string | number | boolean>,
    IUseCaseOptions<keyof E> {}

interface IFindByOptionsWithNestedWheres<E> extends IUseCaseOptions<keyof E> {
  where: IWhere<keyof E, string | number | boolean>[]
}

interface IInputFindAllOptions<E>
  extends IUseCaseOptions<keyof E, string | number> {
  where?: IWhere<string, unknown>[]
  whereIs?: IWhere<string, unknown>[]
  whereOr?: IWhere<string, unknown>[]
  whereSubstring?: IWhere<string | number, unknown>[]
  whereRegexp?: IWhere<string | number, unknown>[]
  order?: [string, 'ASC' | 'DESC'][]
  whereNotIn?: IWhere<string, number[] | string[]>
}

export const includeNestedRelations = (
  relations?: IRelation<string, unknown>[]
) =>
  relations &&
  relations.map((relation) => ({
    association: relation.tableName,
    include: relation.relations
      ? includeNestedRelations(relation.relations)
      : [],
  }))

export const includeNestedRelationsWithWhere = (
  relations?: IRelation<string, unknown>[]
) =>
  relations &&
  relations.map((relation) => {
    const options: { [k: string]: unknown } = {
      association: relation.tableName,
    }

    if (relation.where?.length) {
      options.where = relation.where.map(({ column, value }) => ({
        [column]: value,
      }))
    }

    if (relation.relations) {
      options.include = includeNestedRelations(relation.relations)
    }

    return options
  })

export const createFindByOptions = <E>(
  input: IInputFindByOptions<E>
): FindOptions => {
  const options: FindOptions = {
    where: { [input.column]: input.value },
    include: includeNestedRelations(input.relations),
  }

  return options
}

export const createFindByOptionsWithNestedWheres = <E>(
  input: IFindByOptionsWithNestedWheres<E>
): FindOptions => {
  const options: FindOptions = {
    where: { [Op.or]: [...input.where.map((where) => unnestWheres(where))] },
    include: includeNestedRelations(input.relations),
  }

  if (!input.filters?.getSoftDeleteds) {
    options.where['deleted_at'] = {
      [Op.is]: null,
    }
  }

  return options
}

export const createFindAllOptions = <E>(
  input: IInputFindAllOptions<E>
): FindOptions => {
  const options: FindOptions = {
    where: {},
    include: includeNestedRelationsWithWhere(input.relations),
  }

  if (input.orders) {
    const getOptions = []
    input.orders.forEach(({ ordenation, column }) => {
      switch (ordenation) {
        case 'ASC': {
          getOptions.push([sequelize.literal(column), 'ASC'])
          break
        }
        case 'DESC': {
          getOptions.push([sequelize.literal(column), 'DESC'])
          break
        }
        case 'RAND': {
          getOptions.push(fn('RAND'))
          break
        }
        default: {
          break
        }
      }
    })

    options['order'] = getOptions.length ? getOptions : [['updated_at', 'DESC']]
  }
  if (input.pagination) {
    options.limit = input.pagination.count
    options.offset = Math.abs(input.pagination.count * input.pagination.page)
  }
  if (input?.where?.length)
    input.where?.forEach(({ column, value }) => {
      options.where[column] = value
    })

  input?.filters?.contains?.forEach(({ column, value }) => {
    if (column && value)
      options.where[column as string] = {
        [Op.substring]: value,
      }
  })

  return options
}

export const groupByFindAllOptionsWithoutFilters = <E>(
  input: IInputFindAllOptions<E>
): FindOptions => {
  const options: FindOptions = {
    where: {},
    include: includeNestedRelationsWithWhere(input.relations),
    attributes: [],
    group: [],
    order: input.order,
  }

  if (input.pagination) {
    options.limit = input.pagination.count
    options.offset = Math.abs(input.pagination.count * input.pagination.page)
  }

  input.whereIs?.forEach(({ column, value }) => {
    options.where[column] = {
      [Op.is]: value,
    }
  })
  input.whereOr?.forEach(({ column, value }) => {
    options.where[column] = {
      [Op.or]: value,
    }
  })

  input.whereSubstring?.forEach(({ column, value }) => {
    options.where[column] = {
      [Op.substring]: value,
    }
  })

  input.whereRegexp?.forEach(({ column, value }) => {
    if (column && value)
      options.where[column] = {
        [Op.regexp]: value,
      }
  })

  input.filters.contains?.forEach(({ column, value }) => {
    options.where[column as string] = {
      [Op.substring]: value,
    }
  })

  return options
}

export const groupByFindAllOptions = <E>(
  input: IInputFindAllOptions<E>
): FindOptions => {
  const options: FindOptions = {
    where: {},
    include: includeNestedRelationsWithWhere(input.relations),
    attributes: [],
    group: [],
    order: input.order,
  }

  if (input.pagination) {
    options.limit = input.pagination.count
    options.offset = Math.abs(input.pagination.count * input.pagination.page)
  }

  input.whereIs?.forEach(({ column, value }) => {
    options.where[column] = {
      [Op.is]: value,
    }
  })
  input.whereOr?.forEach(({ column, value }) => {
    options.where[column] = {
      [Op.or]: value,
    }
  })

  input.whereSubstring?.forEach(({ column, value }) => {
    options.where[column] = {
      [Op.substring]: value,
    }
  })

  input.whereRegexp?.forEach(({ column, value }) => {
    if (column && value)
      options.where[column] = {
        [Op.regexp]: value,
      }
  })

  if (!input.filters.getSoftDeleteds) {
    options.where['deleted_at'] = {
      [Op.is]: null,
    }
  }

  if (!input.filters.getDeactivated) {
    options.where['is_active'] = {
      [Op.is]: true,
    }
  }

  input.filters.contains?.forEach(({ column, value }) => {
    options.where[column as string] = {
      [Op.substring]: value,
    }
  })
  return options
}

export const unnestWheres = (
  where?: IWhere<string | number | symbol, unknown>
) => {
  if (!where) {
    return {}
  }

  return {
    [where.column]: where.value,
    ...unnestWheres(where.where),
  }
}
