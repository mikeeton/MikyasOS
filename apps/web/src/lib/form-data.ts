export function formString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
}
