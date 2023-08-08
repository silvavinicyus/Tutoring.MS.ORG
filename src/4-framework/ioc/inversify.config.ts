import { container } from '@shared/ioc/container'
import { sequelize } from '../utility/database'
import { operatorModule } from './operatorModule'
import { repositoryModule } from './repositoryModule'
import { servicesModule } from './servicesModule'
import { useCaseModule } from './useCaseModule'

container.bind('sequelize').toConstantValue(sequelize)
container.load(servicesModule)
container.load(repositoryModule)
container.load(useCaseModule)
container.load(operatorModule)
