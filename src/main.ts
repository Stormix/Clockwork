import { Engine } from './Engine/Core/Engine'
import { Game } from './TestGame/Game'
import './style.scss'

const engine = new Engine(320, 480)

window.onload = () => {
  engine.start(new Game(), 'viewport')
}

window.onresize = () => {
  engine.resize()
}
