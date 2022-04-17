export class Attachment {
  constructor(payload) {
    this.id = payload?.id || ''
    this.type = payload?.type || ''
    this.name = payload?.name || ''
    this.url = payload?.url || ''
    this.size = payload?.size || ''
  }
}
