import process from 'node:process'
import consola from 'consola'

/**
 * Wrapper to exit the process if the user presses CTRL+C.
 */
export async function prompt(message: string, options: any) {
  const response = await consola.prompt(message, options)
  if (response.toString() === 'Symbol(clack:cancel)') {
    process.exit(0)
  }
  return response
}
