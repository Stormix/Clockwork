import { Engine } from './Engine/Engine'
import { Game } from './Game/Game'
import './style.scss'

const canvas = document.getElementById('viewport') as HTMLCanvasElement
const gameArea = document.getElementById('gameArea') as HTMLElement

const engine = new Engine(canvas, gameArea)

window.onload = () => {
  engine.start(1280, 720, new Game(engine))
}
