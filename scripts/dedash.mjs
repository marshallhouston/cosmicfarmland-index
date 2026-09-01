// House style: no em-dashes or en-dashes in generated copy.
export function deDash(s = '') {
  return s.replace(/\s*[—–]\s*/g, ' - ')
}
