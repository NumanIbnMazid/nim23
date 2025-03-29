import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

export const loadFFmpeg = async (ffmpeg: FFmpeg, messageRef: React.RefObject<HTMLParagraphElement>) => {
  ffmpeg.on('log', ({ message }) => {
    console.log("FFmpeg log:", message);
    
    if (messageRef.current) messageRef.current.innerHTML = message
  })
  await ffmpeg.load({
    coreURL: await toBlobURL('/scripts/ffmpeg-core.js', 'text/javascript'),
    wasmURL: await toBlobURL('/scripts/ffmpeg-core.wasm', 'application/wasm'),
  })
  return ffmpeg
}
