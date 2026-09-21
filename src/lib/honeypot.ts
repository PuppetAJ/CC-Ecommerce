/** Anything in the off-screen field was typed by a script rather than a person. */
export function isBot(formData: FormData): boolean {
  return Boolean(formData.get('website'))
}
