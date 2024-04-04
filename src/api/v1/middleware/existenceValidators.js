import { existenceValidatorBuilder } from '../../helpers/existenceValidatorBuilder.js'
import { existsById } from '../models/postModels.js'

const postExists = existenceValidatorBuilder(existsById, 'La publicación no existe')

export { postExists }
