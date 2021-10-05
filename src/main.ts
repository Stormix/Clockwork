import { Engine } from './Engine/Engine'
import { Game } from './Game/Game'
import './style.scss'

const canvas = document.getElementById('viewport') as HTMLCanvasElement
const gameArea = document.getElementById('gameArea') as HTMLElement

const ratio = 9 / 11
const width = window.innerWidth
const engine = new Engine(canvas, gameArea, 1280, width * ratio)

window.onload = () => {
  engine.start(new Game(engine))
}
