import { ILoaderPlugin, Loader, LoaderResource } from '@pixi/loaders'
import path from 'path'
import * as tmx from 'tmx-parser'
import Logger from '../../Core/Logger'

export class TMXLoaderPlugin implements ILoaderPlugin {
  static add() {
    Logger.info('TMXLoaderPlugin', 'add')
    LoaderResource.setExtensionXhrType(
      'tmx',
      LoaderResource.XHR_RESPONSE_TYPE.TEXT,
    )
  }

  static use(resource: LoaderResource, next: () => void) {
    if (resource.extension !== 'tmx') {
      return next()
    }

    const route = path.dirname(resource.url)
    const loadOptions = {
      crossOrigin: resource.crossOrigin,
      parentResource: resource,
    }

    tmx.parse(resource.xhr.responseText, route, (err, map) => {
      if (err) throw err

      map.tileSets.forEach((tileset) => {
        if (!(tileset.image?.source in Loader.shared.resources)) {
          if (tileset.image?.source) {
            Loader.shared.add(
              tileset.image.source,
              `${route}/${tileset.name}/${tileset.image.source}`,
              loadOptions,
            )
          }
          tileset.tiles.forEach((tile) => {
            if (tile.image?.source) {
              Loader.shared.add(
                tile.image.source,
                `${route}/${tile.image.source}`,
                loadOptions,
              )
            }
          })
        }
      })

      resource.data = map
      next()
    })
  }
}
