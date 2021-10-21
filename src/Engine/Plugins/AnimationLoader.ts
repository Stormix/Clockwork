import { ILoaderPlugin, Loader, LoaderResource } from '@pixi/loaders'
import path from 'path'
import Logger from '../Core/Logger'
import { dirname } from '../Core/Tiled/dirname'

export interface IAnimationState {
  name: string
  frames: string[]
}

export interface IAnimation {
  name: string
  states: IAnimationState[]
}

export interface IAnimationFile {
  animations_keys: string[]
  animation_length: number
  frame_number_format: string
  base_name: string
  assets_path: string
  extension: string
}

export class AnimationLoaderPlugin implements ILoaderPlugin {
  static add() {
    Logger.info('AnimationLoaderPlugin', 'add')
    LoaderResource.setExtensionXhrType(
      'animation',
      LoaderResource.XHR_RESPONSE_TYPE.JSON,
    )
  }

  static use(resource: LoaderResource, next: () => void) {
    if (resource.extension !== 'animation') {
      return next()
    }

    const route = dirname(resource.url)
    const loadOptions = {
      crossOrigin: resource.crossOrigin,
      parentResource: resource,
    }

    // TODO: valdiate animation file
    const data = JSON.parse(resource.xhr.response) as IAnimationFile

    const getAssetName = (
      data: IAnimationFile,
      animation_key: string,
      index: number,
    ) => {
      const frameNumberLength = data.frame_number_format.length
      const frameNumberLong = `${data.frame_number_format}` + index.toString()
      const frameNumber = frameNumberLong.slice(
        frameNumberLong.length - frameNumberLength,
      )

      return `${data.assets_path}${data.base_name}_${animation_key}_${frameNumber}.${data.extension}`
    }

    const states = []

    for (const animation_key of data.animations_keys) {
      const frames = []
      for (let i = 0; i < data.animation_length; i++) {
        const assetPath = getAssetName(data, animation_key, i)
        Loader.shared.add(assetPath, `${route}/${assetPath}`, loadOptions)
        frames.push(assetPath)
      }
      states.push({
        name: animation_key,
        frames,
      })
    }
    const name = path.basename(resource.url, '.animation')
    resource.data = {
      name,
      states,
    }
    next()
  }
}
