import { ViewLike } from '@/models/viewlike.model.js'

export function useSetViewLikes(object, params, curUser) {
  if (object) {
    if (params.command == 'like') {
      if (params.isRevoked) {
        object.viewLikePersons = object.viewLikePersons.filter(i => i.id != params.id)
        object.isCurUserLike = false
        object.likes--
      } else {
        object.viewLikePersons.push(new ViewLike({ id: params.id, person_id: curUser.id, person_fullname: curUser.name, type: 'like' }))
        object.isCurUserLike = true
        object.likes++
      }
    } else {
      if (params.isRevoked) {
        object.viewDislikePersons = object.viewDislikePersons.filter(i => i.id != params.id)
        object.isCurUserDislike = false
        object.dislikes--
      } else {
        object.viewDislikePersons.push(
          new ViewLike({ id: params.id, person_id: curUser.id, person_fullname: curUser.name, type: 'dislike' })
        )
        object.isCurUserDislike = true
        object.dislikes++
      }
    }
  }
}
