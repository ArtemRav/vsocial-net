export class ViewLike {
  constructor(payload) {
    this.id = payload.id || ''
    this.type = payload.type
    this.personId = payload.person_id || payload.personId || ''
    this.personFullname = payload.person_fullname || payload.personFullname || ''
  }
}
