import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loadFFmpeg = async (ffmpeg: FFmpeg, _setStatusMessage: any) => {
  // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

  // ffmpeg.on('log', ({ message }) => {
  //   console.log(message)
  // })
  // ffmpeg.on('progress', ({ progress }) => {
  //   const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)))
  //   setStatusMessage(`Processing... ${percentage}%`)
  // })

  await ffmpeg.load({
    // coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    // wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    coreURL: await toBlobURL('/scripts/ffmpeg-core.js', 'text/javascript'),
    wasmURL: await toBlobURL('/scripts/ffmpeg-core.wasm', 'application/wasm'),
    workerURL: await toBlobURL('/scripts/ffmpeg-core.worker.js', 'text/javascript'),
  })

  return ffmpeg
}
