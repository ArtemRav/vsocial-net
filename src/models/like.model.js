export class Like {
  constructor(payload) {
    this.id = payload.id || ''
    this.objectId = payload.object_id || ''
    this.ownerId = payload.owner_id || ''
    this.command = payload.command || ''
    this.isRevoked = payload.is_revoked || ''
  }
}
