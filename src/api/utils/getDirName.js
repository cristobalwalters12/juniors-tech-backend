import path from 'path'
import { fileURLToPath } from 'url'

function getDirName (moduleUrl) {
  const __filename = fileURLToPath(moduleUrl)
  return path.dirname(__filename)
}

export { getDirName }
