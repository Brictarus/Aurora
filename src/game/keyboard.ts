export class Keyboard {
  private readonly keys: { [key: number]: boolean } = {};
  private readonly keyMappings: { [key: string]: number } = {
    'up': 38,
    'down': 40,
    'left': 37,
    'right': 39,
    'a': 65
  };

  constructor(container: GlobalEventHandlers) {
    if (container) {
      container.addEventListener('keydown', (ev) => this.onKeyDown(ev));
      container.addEventListener('keyup', (ev) => this.onKeyUp(ev));
    }
  }

  onKeyDown(ev: KeyboardEvent): void {
    this.keys[ev.keyCode] = true;
  }

  onKeyUp(ev: KeyboardEvent): void {
    delete this.keys[ev.keyCode];
  }

  isPressed(key: string): boolean {
    return this.keys[this.keyMappings[key]] ?? false;
  }
}