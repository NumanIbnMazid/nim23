import { Component } from 'solid-js'

const HiddenBackground: Component = () => {
  return (
    <div class="absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
      <div class="w-[108rem] flex-none flex justify-end">
        <picture>
          <source srcset="./static/images/backgrounds/docs@30.8b9a76a2.avif" type="image/avif" />
          <img
            src="./static/images/backgrounds/docs@tinypng.d9e4dcdc.png"
            alt=""
            class="w-[71.75rem] flex-none max-w-none dark:hidden"
            decoding="async"
          />
        </picture>
        <picture>
          <source srcset="./static/images/backgrounds/docs-dark@30.1a9f8cbf.avif" type="image/avif" />
          <img
            src="./static/images/backgrounds/docs-dark@tinypng.1bbe175e.png"
            alt=""
            class="w-[90rem] flex-none max-w-none hidden dark:block"
            decoding="async"
          />
        </picture>
      </div>
    </div>
  )
}

export default HiddenBackground
