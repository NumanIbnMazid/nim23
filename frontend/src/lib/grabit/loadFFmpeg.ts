import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

export const loadFFmpeg = async (ffmpeg: FFmpeg, setStatusMessage: any) => {
  ffmpeg.on('log', ({ message }) => {
    setStatusMessage(message)
  })
  await ffmpeg.load({
    coreURL: await toBlobURL('/scripts/ffmpeg-core.js', 'text/javascript'),
    wasmURL: await toBlobURL('/scripts/ffmpeg-core.wasm', 'application/wasm'),
  })
  return ffmpeg
}
