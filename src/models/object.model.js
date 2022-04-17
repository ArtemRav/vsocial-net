export class TypicalObject {
  constructor(payload) {
    this.id = payload?.id || ''
    this.type = payload?.type || ''
    this.name = payload?.name || ''
    this.link = payload?.link || ''
    this.img = payload?.img || ''
    this.sex = payload?.sex || ''
  }
}
