export function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return ''
  }

  if (points.length === 1) {
    const point = points[0]
    return `M ${point.x} ${point.y}`
  }

  return points.reduce((path, point, index, all) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }

    const prev = all[index - 1]
    const controlX = (prev.x + point.x) / 2
    return `${path} C ${controlX} ${prev.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`
  }, '')
}
