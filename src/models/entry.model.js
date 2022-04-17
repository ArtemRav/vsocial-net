import { TypicalObject } from './object.model.js'
import { Attachment } from './attachments.model.js'
import { ViewLike } from './viewlike.model.js'

class Access {
  constructor(payload) {
    this.allowComment = payload.allow_comment
    this.allowDislike = payload.allow_dislike
    this.allowFollow = payload.allow_follow
    this.allowLike = payload.allow_like
    this.allowShare = payload.allow_share
    this.allowViewList = payload.allow_view_list
    this.allowViewNumbers = payload.allow_view_numbers
    this.dislikeWeight = payload.dislike_weight
    this.likeWeight = payload.like_weight
    this.viewDislike = payload.view_dislike
    this.viewFollow = payload.view_follow
    this.viewLike = payload.view_like
  }
}

class Tag {
  constructor(payload) {
    this.id = payload?.id || ''
    this.name = payload?.name || ''
    this.url = payload?.url || ''
  }
}

export class EnterItem {
  constructor(payload) {
    this.id = payload.id
    this.type = payload.type
    this.name = payload.name
    this.link = payload.link
    this.text = payload.text
    this.date = payload.date_create
    this.blocked = payload.blocked
    this.dateModified = payload.date_modified
    this.likes = payload.likes
    this.dislikes = payload.dislikes
    this.isCurUserLike = payload.has_my_like
    this.isCurUserDislike = payload.has_my_dislike
    this.hasSubscription = payload.has_subscription
    this.canDelete = payload.can_delete
    this.access = payload.access
    this.person = payload.person
    this.viewLikePersons = []
    this.viewDislikePersons = []
    this.object = payload.object
    this.owner = payload.owner
    this.attachments = payload.attachments
    this.tags = payload.tags
    this.comments = payload.comments
  }

  set access(value) {
    this._access = []
    if (value && value.length > 1) {
      this._access = new Access(JSON.parse(value))
    }
  }

  get access() {
    return this._access
  }

  set person(value) {
    this._person = new TypicalObject(value)
  }

  get person() {
    return this._person
  }

  set object(value) {
    this._object = new TypicalObject(value)
    this._object.likes = value?.likes || ''
    this._object.dislikes = value?.dislikes || ''
    this._object.isCurUserLike = value?.has_my_like || ''
    this._object.isCurUserDislike = value?.has_my_dislike || ''
  }

  get object() {
    return this._object
  }

  set owner(value) {
    this._owner = new TypicalObject(value)
  }

  get owner() {
    return this._owner
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

  set tags(value) {
    this._tags = []
    if (Array.isArray(value) && value.length > 0) {
      this._tags = value.map(t => new Tag(t))
    }
  }

  get tags() {
    return this._tags
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
