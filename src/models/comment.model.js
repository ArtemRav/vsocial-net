import { TypicalObject } from './object.model.js'
import { Attachment } from './attachments.model.js'
import { ViewLike } from './viewlike.model.js'

class AccessGroup {
  constructor(payload) {
    this.id = payload.id
    this.name = payload.name
  }
}

export class Comment {
  constructor(payload) {
    this.id = payload.id
    this.type = payload.type
    this.parentId = payload.parent_id
    this.ownerId = payload.owner_id
    this.text = payload.text
    this.link = payload.link
    this.date = payload.date
    this.likes = payload.likes
    this.dislikes = payload.dislikes
    this.isCurUserLike = payload.has_my_like
    this.isCurUserDislike = payload.has_my_dislike
    this.person = payload.person
    this.viewLikePersons = []
    this.viewDislikePersons = []
    this.attachments = payload.attachments
    this.access_groups = payload.access_groups
    this.comments = []
  }

  set person(value) {
    this._person = new TypicalObject(value)
  }

  get person() {
    return this._person
  }

  set attachments(value) {
    this._attachments = []
    if (Array.isArray(value) && value.length > 0) {
      this._attachments = value.map(a => new Attachment(a))
    }
  }

  get attachments() {
    return this._attachments
  }

  set accessGroup(value) {
    this._AccessGroups = []
    if (Array.isArray(value) && value.length > 0) {
      this._AccessGroups = value.map(g => new AccessGroup(g))
    }
  }

  get accessGroup() {
    return this._AccessGroups
  }

  set viewLikePersons(value) {
    this._viewLikePersons = []
    if (Array.isArray(value) && value.length > 0) {
      this._viewLikePersons = value.map(l => new ViewLike(l))
    }
  }

  get viewLikePersons() {
    return this._viewLikePersons
  }

  set viewDislikePersons(value) {
    this._viewDislikePersons = []
    if (Array.isArray(value) && value.length > 0) {
      this._viewDislikePersons = value.map(l => new ViewLike(l))
    }
  }

  get viewDislikePersons() {
    return this._viewDislikePersons
  }
}
