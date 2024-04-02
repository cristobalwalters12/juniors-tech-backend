import { nanoid } from 'nanoid'

const getUUID = () => {
  return nanoid(10)
}

export { getUUID }
