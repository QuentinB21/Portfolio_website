const mapCache = new Map<string, { image: string; scale: number }>()

/** Build the sampling field of a rounded convex lens (air 1, glass 1.5). */
export function createGlassDisplacement(width: number, height: number, radius: number) {
  const key = `${width}:${height}:${radius}`
  const cached = mapCache.get(key)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width)
  canvas.height = Math.ceil(height)
  const context = canvas.getContext('2d')
  if (!context) return null
  const r = Math.max(1, Math.min(radius, width / 2, height / 2))
  const bezel = Math.min(14, r * 0.85)
  const thickness = Math.min(22, height * 0.45)
  const field = new Float32Array(canvas.width * canvas.height * 2)
  const image = context.createImageData(canvas.width, canvas.height)
  const profile = (t: number) => (1 - (1 - Math.min(1, Math.max(0, t))) ** 4) ** 0.25
  let maximum = 1

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = x + 0.5 - width / 2
      const py = y + 0.5 - height / 2
      const qx = Math.abs(px) - (width / 2 - r)
      const qy = Math.abs(py) - (height / 2 - r)
      const ox = Math.max(qx, 0)
      const oy = Math.max(qy, 0)
      const outside = Math.hypot(ox, oy)
      const distance = r - outside - Math.min(Math.max(qx, qy), 0)
      if (distance <= 0 || distance >= bezel) continue
      const nx = outside > 0 ? ox / outside * Math.sign(px) : qx > qy ? Math.sign(px) : 0
      const ny = outside > 0 ? oy / outside * Math.sign(py) : qx > qy ? 0 : Math.sign(py)
      const t = distance / bezel
      const delta = 0.001
      const slope = (profile(t + delta) - profile(t - delta)) / (2 * delta) * thickness / bezel
      const normalZ = 1 / Math.hypot(slope, 1)
      const normalSide = slope * normalZ
      const eta = 1 / 1.5
      const refraction = Math.sqrt(1 - eta * eta * (1 - normalZ * normalZ))
      const factor = refraction - eta * normalZ
      const rayZ = eta + factor * normalZ
      const displacement = factor * normalSide / rayZ * profile(t) * thickness
      const index = (y * canvas.width + x) * 2
      // Convex glass samples inward, avoiding transparent pixels outside the surface.
      field[index] = -nx * displacement
      field[index + 1] = -ny * displacement
      maximum = Math.max(maximum, displacement)
    }
  }
  for (let pixel = 0; pixel < canvas.width * canvas.height; pixel++) {
    image.data[pixel * 4] = Math.round(127.5 + field[pixel * 2] / maximum * 127.5)
    image.data[pixel * 4 + 1] = Math.round(127.5 + field[pixel * 2 + 1] / maximum * 127.5)
    image.data[pixel * 4 + 2] = 128
    image.data[pixel * 4 + 3] = 255
  }
  context.putImageData(image, 0, 0)
  // SVG uses scale * (channel / 255 - 0.5), hence twice the maximum shift.
  const map = { image: canvas.toDataURL(), scale: maximum * 2 }
  if (mapCache.size >= 12) mapCache.delete(mapCache.keys().next().value!)
  mapCache.set(key, map)
  return map
}
