export class CostCard {
  constructor(private element: HTMLElement) {}
  set value(val: string) { this.element.textContent = val; }
}
