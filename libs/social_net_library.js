/*------------------------------------------------------------------ API FUNCTIONS ------------------------------------------------------------------*/
/**
 * @typedef {Object} ReturnInitSocialFeed
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} aTags Массив тегов
 * @property {Object} oConfig Параметры социальной ленты
 * @property {Object} aTargetsAll Массив всех направлений (для фильтрации)
 * @property {Object} aTargetsForPost Массив направлений (для постинга)
*/
/**
 * @author RA
 * @function InitSocialFeed
 * @memberof Websoft.HCM.SocialNet
 * @description Возвращает массив данных со значениями параметров шаблона 'Социальная лента / Параметры'
 * @returns {ReturnInitSocialFeed}
*/
function InitSocialFeed() {
  var oRes = tools.get_code_library_result_object();
  oRes.oConfig = GetSocialFeedConfig();

  var sTargetCollectionId = oRes.oConfig['sTargetCollectionId']; 
  oRes.aTargetsAll = (IsArray(sTargetCollectionId)) ? _getTargets(sTargetCollectionId[0], 'all') : _getTargets(sTargetCollectionId);
  oRes.aTargetsForPost = (IsArray(sTargetCollectionId)) ? _getTargets(sTargetCollectionId[0], 'for_post') : _getTargets(sTargetCollectionId);

  oRes.aTags = [];
  for (cTag in XQuery('for $elem in tags order by $elem/name return $elem/Fields("id", "name")')) {
    oRes.aTags.push({ id: cTag.id.Value, name: cTag.name.Value });
  }

  return oRes;
}

/**
 * @typedef {Object} ReturnTargets
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} aTargetsAll Массив всех направлений (для фильтрации)
 * @property {Object} aTargetsForPost Массив направлений (для постинга)
*/
/**
 * @author RA
 * @function RefreshTargets
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sCollectionTargetId Id коллекции, возвращающей список направлений
 * @description Возвращает направления для постинга (в случае когда параметр sTargetCollectionId это массив)
 * @returns {ReturnTargets}
*/
function RefreshTargets(sCollectionTargetId) {
  var oRes = tools.get_code_library_result_object();
  oRes.oConfig = GetSocialFeedConfig();

  var iCurTargetId = OptInt(Trim(sCollectionTargetId));

  if (iCurTargetId == undefined) {
    return _getError(oRes, 1, 'Не передан id выборки для текущего таба.');
  }

  oRes.aTargetsAll = _getTargets(iCurTargetId, 'all');
  oRes.aTargetsForPost = _getTargets(iCurTargetId, 'for_post');

  return oRes;
}

/**
 * @typedef {Object} ReturnSocialFeedItems
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} array Список элементов для соц. ленты
*/
/**
 * @author RA
 * @function GetSocialFeedItems
 * @memberof Websoft.HCM.SocialNet
 * @param {number} iPageNum Номер страницы
 * @param {number} iPageSize Размер страницы
 * @param {string} directions Строка id направлений через запятую
 * @param {string} search Строка поиска
 * @param {string} dateFrom Начало диапазона дат
 * @param {string} dateTo Конец диапазона дат
 * @param {string} sCollectionTargetId Id коллекции, возвращающей список направлений
 * @description Возвращает данные выборки, формирующей список items для социальной ленты
 * @returns {ReturnSocialFeedItems}
*/
function GetSocialFeedItems(iPageNum, iPageSize, directions, search, dateFrom, dateTo, sCollectionTargetId) {
  var oRes = tools.get_code_library_result_object();
  oRes.array = [];

  var iTargetCollectionID = '';
  var oConfig = GetSocialFeedConfig();
  var iSingleTargetID = _getSingleTargetID();
  var iTargetID = OptInt(Trim(sCollectionTargetId));
  var iCollectionID = OptInt(oConfig['sRemoteCollectionId']);
  var oDateFrom = (OptDate(dateFrom) != undefined) ? { type: 'start_date', value: Trim(dateFrom) } : null;
  var oDateTo = (OptDate(dateTo) != undefined) ? { type: 'finish_date', value: Trim(dateTo) } : null;
  var bGroupManagerAccess = tools_web.is_true(oConfig.GetOptProperty('bGroupManagerAccess', ''));

  var aFilters = (Trim(directions) != '') ? [{ type: 'targets', value: Trim(directions) }] : [];
  if (search != '') {
    aFilters.push({ type: 'search', value: search })
  }
  if (oDateFrom != null) {
    aFilters.push(oDateFrom);
  }
  if (oDateTo != null) {
    aFilters.push(oDateTo);
  }

  if (iTargetID != undefined) {
    iTargetCollectionID = iTargetID;
  } else if (IsArray(oConfig['sTargetCollectionId'])) {
    iTargetCollectionID = oConfig['sTargetCollectionId'][0].targetId;
  } else {
    iTargetCollectionID = oConfig['sTargetCollectionId'];
  }

  if (iCollectionID == undefined) {
    sCollectionCode = 'GetListItemsOrigin'; // 'social_list_wall_items'
    teCollection = OpenDoc(UrlFromDocID(ArrayOptFirstElem(tools.xquery('for $elem in remote_collections where $elem/code = '+ XQueryLiteral(sCollectionCode) +' return $elem/id, $elem/__data')).id)).TopElem;
  } else {
    teCollection = OpenDoc(UrlFromDocID(iCollectionID)).TopElem;
  }

  if (iSingleTargetID == null && OptInt(iTargetCollectionID) != undefined) {
    var sCollectionTargetsCode = ArrayOptFirstElem(XQuery('for $elem in remote_collections where $elem/id = '+ iTargetCollectionID + ' return $elem/Fields("code")')).code.Value;
    var aListTargets = _getTargets(iTargetCollectionID, 'all');

    teCollection.wvars.ObtainChildByKey('sListTargets').value = ArrayCount(aListTargets) > 0 ? ArrayMerge(aListTargets, 'This.id', ',') : '';
    teCollection.wvars.ObtainChildByKey('sCollectionTargetsCode').value = sCollectionTargetsCode;
  } else {
    teCollection.wvars.ObtainChildByKey('sListTargets').value = String(iSingleTargetID);
  }

  teCollection.wvars.ObtainChildByKey('sListFilters').value = tools.object_to_text(aFilters, 'json');
  teCollection.wvars.ObtainChildByKey('iPageNum').value = iPageNum;
  teCollection.wvars.ObtainChildByKey('iPageSize').value = iPageSize;
  teCollection.wvars.ObtainChildByKey('bGroupManagerAccess').value = bGroupManagerAccess;

  oListItems = teCollection.evaluate('json', CurRequest);
  if (OptInt(oListItems.GetOptProperty('error'), 0) == 1) {
    return _checkCollectionResult(oRes, oListItems, 'GetListItemsOrigin');
  }
  oRes.array = ParseJson(oListItems.result);

  return oRes;
}

/**
 * @typedef {Object} ReturnComments
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} array Массив вложенных и связанных с элементом соц. ленты комментариев
*/
/**
 * @author RA
 * @function GetSocialItemComments
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sItemID Id сообщения
 * @param {string} sItemType Тип сообщения ('blog_entry' например, если сообщение блога)
 * @param {string} sItemComments Строка id комментариев сообщения через запятую
 * @description Возвращает массив вложенных и связанных с элементом соц. ленты комментариев
 * @returns {ReturnComments}
*/
function GetSocialItemComments(sItemID, sItemType, sItemComments) {
  var oRes = tools.get_code_library_result_object();
  
  oRes.array = ParseJson(_getBlogEntryComments(sItemID, sItemComments));

  return oRes;
}

/**
 * @typedef {Object} ReturnComments
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} array Массив с созданным(-и) сообщением(-ми)
*/
/**
 * @author RA
 * @function PostSocialItem
 * @memberof Websoft.HCM.SocialNet
 * @description Возвращает массив с созданным(-и) сообщением(-ми)
 * @returns {ReturnComments}
*/
function PostSocialItem() {
  var oRes = tools.get_code_library_result_object();
  oRes.array = [];

  var curObject = _getCurObject();
  var sCurObjectName = _getCurObjectName();
  var curUserID = _getCurUserID();
  var curUser = _getCurUser();

  var oForm = CurRequest.Form;
  var sType = Trim(oForm.sType);
  var sText = tools_web.convert_bbtags_to_html(Trim(oForm.sText));
  var sDirections = Trim(oForm.sDirections);

  try {
    var sObjectID = Trim(oForm.sObjectID);
  } catch(e) {
    sObjectID = ''
  }

  try {
    var sEntryID = Trim(oForm.sEntryID);
  } catch(e) {
    sEntryID = ''
  }

  var oFiles = _obtainFilesList(oForm, curUserID, curUser);
  if (oFiles.error > 0) {
    return _getError(oRes, oFiles.error, oFiles.errorText, 'array')
  }
  var aTags = _obtainTagsList(oForm);
  var aSocItems = [];

  if (sEntryID != '') { // social item edit mode
    iTargetID = OptInt(sDirections);
    dTarget = tools.open_doc(iTargetID);
    var oSocialtemEdited = _editSocialItem(sEntryID, sType, iTargetID, dTarget.TopElem, curUserID, curUser, sText, curObject);

    if (oSocialtemEdited.GetOptProperty('error') > 0) {
      return _getError(oRes, oSocialtemEdited.error, oSocialtemEdited.errorText);
    }

    teItem = oSocialtemEdited.doc.TopElem;
    for (file in oFiles.files) {
      teItem.files.ObtainChildByKey(file);
    }

    oSocialtemEdited.doc.Save();
    oItem = _getWallItemResult(oSocialtemEdited.doc.DocID, teItem, curUserID, sCurObjectName);
    aSocItems.push(oItem);
  } else { // social item post mode
    var xarrDirectionIds = sDirections.split(',');
    for (target in xarrDirectionIds) {
      iTargetID = OptInt(target);
      dTarget = tools.open_doc(iTargetID);

      if (dTarget != undefined) {
        dItem = _createSocialItem(sType, iTargetID, dTarget.TopElem, curUserID, curUser, sText, sObjectID, curObject);
        teItem = dItem.TopElem;

        for (file in oFiles.files) {
          teItem.files.ObtainChildByKey(file);
        }

        for (tag in aTags) {
          if (!teItem.tags.ChildByKeyExists(tag.id)) {
            fldTag = teItem.tags.ObtainChildByKey(tag.id);
            tools.common_filling('tag', fldTag, tag.id);
          }
        }

        dItem.Save();
        oItem = _getWallItemResult(dItem.DocID, teItem, curUserID, sCurObjectName);
        aSocItems.push(oItem);
      } else {
        _log('PostSocialItem', 'Не удалось открыть карточку с id: ' + target)
      }
    }
  }

  oRes.array = ParseJson(tools.object_to_text(aSocItems, 'json'));

  return oRes;
}

/**
 * @typedef {Object} ReturnSocialItem
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} array Массив с записью в соц. ленте с указанным id
*/
/**
 * @author RA
 * @function GetSocialItem
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sItemId Id сообщения блога
 * @description Возвращает массив с записью в соц. ленте с указанным id
 * @returns {ReturnSocialItem}
*/
function GetSocialItem(sItemId) {
  var oRes = tools.get_code_library_result_object();
  oRes.array = [];

  var iItemId = OptInt(Trim(sItemId));
  var curUserID = _getCurUserID();
  var curUser = _getCurUser();

  if (iItemId == undefined) {
    return _getError(oRes, 500, 'Не передан id записи.')
  }

  dItem = tools.open_doc(iItemId);
  if (dItem != undefined) {
    teItem = dItem.TopElem;

    switch (teItem.Name) {
      case 'blog_entry':
        if (!tools_web.check_access(iItemId, curUserID, curUser, CurRequest.Session)) {
          _getError(oRes, 403, 'У вас нет доступа к текущему документу (' + iItemId + ')');
        }

        var oItem = _getWallItemResult(iItemId, teItem, curUserID, teItem.Name);
        // oRes.item.owner = _getWallItemOwner(oRes.item.object, xarrBlogsUnion);
        oRes.array.push(oItem);
        break;
    }
  } else {
    return _getError(oRes, 500, 'Не удалось открыть карточку документа с id: ' + iItemId)
  }

  return oRes;
}

/**
 * @typedef {Object} ReturnComment
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} array Массив с созданным комментарием
*/
/**
 * @author RA
 * @function PostComment
 * @memberof Websoft.HCM.SocialNet
 * @description Возвращает массив с созданным комментарием
 * @returns {ReturnComment}
*/
function PostComment() {
  var oRes = tools.get_code_library_result_object();
  oRes.array = [];

  var curUserID = _getCurUserID();
  var curUser = _getCurUser();

  var oForm = CurRequest.Form;
  var iObjectID = Trim(oForm.sObjectID);
  var iParentID = Trim(oForm.sParentID);
  var sText = tools_web.convert_bbtags_to_html(Trim(oForm.sText));

  var oFiles = _obtainFilesList(oForm, curUserID, curUser);
  if (oFiles.error > 0) {
    return _getError(oRes, oFiles.error, oFiles.errorText, 'array')
  }

  var teObject = null;
  dObject = tools.open_doc(iObjectID);
  if (dObject != undefined) {
    teObject = dObject.TopElem;
  }

  dComment = OpenNewDoc('x-local://wtv/wtv_blog_entry_comment.xmd');
  teComment = dComment.TopElem;

  teComment.blog_entry_id = iObjectID;
  tools.common_filling('object', teComment, iObjectID, teObject);
  teComment.parent_id = iParentID;
  teComment.person_id = curUserID;
  tools.common_filling('collaborator', teComment, curUserID, curUser);
  teComment.message = sText;

  if (teComment.parent_id.HasValue) {
    dParent = tools.open_doc(iParentID);
    if (dParent != undefined) {
      teParent = dParent.TopElem;
      teComment.access.AssignElem(teParent.access);
    }
  } else if (teObject != null) {
    teComment.access.AssignElem(teObject.access);
  }
  dComment.BindToDb(DefaultDb);

  for (file in oFiles.files) {
    teComment.files.ObtainChildByKey(file);
  }

  dComment.Save();
  iCommentID = dComment.DocID;

  ms_tools.raise_system_event_env('portal_create_comment_social', {
    'iCommentID': iCommentID,
    'teComment': teComment,
    'curObjectID': iObjectID,
    'curObject': teObject,
    'curUserID': curUserID,
    'curUser': curUser
  });

  oCommentItem = _getCommentItem(iCommentID, teComment, curUserID, iObjectID);
  // alert('[PostComment] => oCommentItem: ' + tools.object_to_text(oCommentItem, 'json'))
  oRes.array.push(oCommentItem);

  return oRes;
}

/**
 * @typedef {Object} ReturnObjectLike
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} oLike Объект лайка
*/
/**
 * @author RA
 * @function SetLike
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sObjectId Id объекта оценки (сообщение блога, комментарий)
 * @param {string} sOwnerId Id объекта, к которому относится оцениваемый объект (блог, группа)
 * @param {string} sCommand Тип оценки (like/dislike)
 * @param {string} bCanRevoke Возможен отзыв оценки (да/нет)
 * @description Создает лайк/дизлайк для заданного объекта
 * @returns {ReturnObjectLike}
*/
function SetLike(sObjectId, sOwnerId, sCommand, bCanRevoke) {
  var oRes = tools.get_code_library_result_object();

  var curUserID = _getCurUserID();
  var curUser = _getCurUser();
  var iWeight = 1;
  var isLike = (sCommand == 'like');

  oRes.oLike = {
    id: '',
    object_id: sObjectId,
    owner_id: sOwnerId,
    command: sCommand,
    is_revoked: false
  };

  try {
    iWeight = OptInt(Trim(iWeight), 1);
  } catch(e) {}

  if (!isLike) {
    iWeight = 0 - iWeight;
  }

  var catLike = _getObjectLike(sObjectId, curUserID, isLike);

  if (catLike == undefined) {
    return _createLike(oRes, iWeight, curUserID, curUser, null);
  } else {
    var iLikeID = catLike.id.Value;

    if (tools_web.is_true(bCanRevoke)) {
      oRes.oLike.is_revoked = true;
      return _deleteLike(oRes, iLikeID);
    } else {
      if (catLike.weight == iWeight) {
        return _getError(oRes, 1, (iWeight > 0 ? 'Like' : 'Dislike') + ' already exists.');
      } else {
        return _createLike(oRes, iWeight, curUserID, curUser, iLikeID);
      }
    }
  }
}

/**
 * @typedef {Object} ReturnDescription
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} sMessage Текст уведомления о результате выполнения действия
*/
/**
 * @author RA
 * @function Subscribe
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sObjectID Id сообщения для которого создается/удаляется подписка
 * @description Создает подписку на сообщение блога
 * @returns {ReturnDescription}
*/
function Subscribe(sObjectID) {
  var oRes = tools.get_code_library_result_object();
  oRes.sMessage = '';

  var curUser = _getCurUser();
  var curUserID = _getCurUserID();

  catSubscription = ArrayOptFirstElem(XQuery('for $elem in subscriptions where $elem/person_id = '+ curUserID +' and $elem/document_id = '+ sObjectID +' and ($elem/date_to = null() or $elem/date_to > ' + XQueryLiteral(Date()) + ') return $elem/Fields("id")'));
  if (catSubscription != undefined) {
    try {
      DeleteDoc(UrlFromDocID(catSubscription.id.Value));
      oRes.sMessage = 'Подписка успешно удалена.';
    } catch(e) {
      return _getError(oRes, 1, 'Произошла ошибка при удалении подписки: ' + e);
    }
  } else {
    try {
      dSubscription = OpenNewDoc('x-local://wtv/wtv_subscription.xmd');
      teSubscription = dSubscription.TopElem;
      teSubscription.document_id = sObjectID;
      teSubscription.person_id = curUserID;
      tools.common_filling('collaborator', teSubscription, curUserID, curUser);
      teSubscription.type = 'blog_entry';
      dSubscription.BindToDb(DefaultDb);
      dSubscription.Save();

      oRes.sMessage = 'Подписка успешно оформлена.';
    } catch(e) {
      return _getError(oRes, 1, 'Произошла ошибка при создании подписки: ' + e);
    }
  }

  return oRes;
}

/**
 * @typedef {Object} ReturnDescription
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} sMessage Текст уведомления о результате выполнения действия
*/
/**
 * @author RA
 * @function DeleteSocialItem
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sObjectID Id сообщения блога
 * @description Удаляет сообщение блога
 * @returns {ReturnDescription}
*/
function DeleteSocialItem(sObjectID) {
  var oRes = tools.get_code_library_result_object();
  oRes.sMessage = '';

  var curObject = _getCurObject();
  var curUser = _getCurUser();
  var curUserID = _getCurUserID();
  var iObjectID = OptInt(Trim(sObjectID));
  if (iObjectID == undefined) {
    return _getError(oRes, 1, 'Не передан ID сообщения.')
  }

  var bCanDelete = _checkUserPermits(curObject, curUserID, iObjectID);
  if (!bCanDelete) {
    return _getError(oRes, 403, 'Не достаточно прав для удаления записи.');
  }

  xarrBlogEntryComments = ArraySelectAll(XQuery('for $elem in blog_entry_comments where $elem/blog_entry_id = '+ iObjectID +' return $elem/Fields("id")'));
  if (ArrayOptFirstElem(xarrBlogEntryComments) == undefined) {
    sLikeCondition = '$elem/object_id = ' + iObjectID;
  } else {
    sLikeCondition = 'MatchSome($elem/object_id, ('+ iObjectID + ',' + ArrayMerge(xarrBlogEntryComments, 'id', ',') +'))';
    for (catCommentElem in xarrBlogEntryComments) {
      DeleteDoc(UrlFromDocID(catCommentElem.id));
    }
  }

  for (catLikeElem in XQuery("for $elem in likes where " + sLikeCondition + " return $elem/Fields('id')")) {
    DeleteDoc(UrlFromDocID(catLikeElem.id));
  }

  var sBlogType = 'blog';
  var sBlogName = '';
  if (curObject != null && (feBlog = curObject.blog_id.OptForeignElem) != undefined) {
    if (feBlog.type.HasValue) {
      sBlogType = feBlog.type.Value;
    }
    if (feBlog.name.HasValue) {
      sBlogName = feBlog.name.Value;
    }
  }

  try {
    DeleteDoc(UrlFromDocID(iObjectID));
  } catch(e) {
    return _getError(oRes, 1, 'Ошибка: не удалось удалить запись с id: ' + iObjectID);
  }

  ms_tools.raise_system_event_env('common_delete_blog_entry', {
    'curUserID': curUserID,
    'curUser': curUser,
    'iBlogEntryID': iObjectID,
    'sBlogType': sBlogType,
    'sBlogName': sBlogName
  });

  return oRes;
}

/**
 * @typedef {Object} ReturnDescription
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} sMessage Текст уведомления о результате выполнения действия
*/
/**
 * @author RA
 * @function BlockSocialItem
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sObjectID Id сообщения блога
 * @description Блокирует сообщение блога (блокирует возможность оставлять комментарии)
 * @returns {ReturnDescription}
*/
function BlockSocialItem(sObjectID) {
  var oRes = tools.get_code_library_result_object();
  oRes.sMessage = '';

  var iObjectID = OptInt(Trim(sObjectID));
  if (iObjectID == undefined) {
    return _getError(oRes, 1, 'Не передан ID сообщения.')
  }

  dSocItem = tools.open_doc(iObjectID);
  if (dSocItem != undefined) {
    teSocItem = dSocItem.TopElem;
    if (teSocItem.blocked.HasValue) {
      teSocItem.blocked = !teSocItem.blocked.Value;
    } else {
      teSocItem.blocked = true;
    }
    dSocItem.Save();
  } else {
    return _getError(oRes, 1, 'Не удалось открыть карточку объекта с id: ' + iObjectID);
  }

  return oRes;
}

/**
 * @typedef {Object} ReturnDescription
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} sMessage Текст уведомления о результате выполнения действия
*/
/**
 * @author RA
 * @function DeleteComment
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sObjectID Id комментария
 * @description Удаляет комментарий
 * @returns {ReturnDescription}
*/
function DeleteComment(sObjectID) {
  var oRes = tools.get_code_library_result_object();
  oRes.sMessage = '';

  var iObjectID = OptInt(Trim(sObjectID));

  if (iObjectID == undefined) {
    return _getError(oRes, 1, 'Не передан ID комментария.')
  }

  xarrComments = ArraySelectAll(tools.xquery('for $elem in blog_entry_comments where IsHierChild($elem/id, '+ iObjectID +') order by $elem/Hier() return $elem'));
  if (ArrayOptFirstElem(xarrComments) == undefined) {
    sLikeCondition = '$elem/object_id = ' + iObjectID;
  } else {
    sLikeCondition = 'MatchSome($elem/object_id, ('+ iObjectID + ',' + ArrayMerge(xarrComments, 'id', ',') +'))';

    for (catComment in xarrComments) {
      DeleteDoc(UrlFromDocID(catComment.id));
    }
  }

  for (catLikeElem in XQuery('for $elem in likes where ' + sLikeCondition + ' return $elem')) {
    DeleteDoc(UrlFromDocID(catLikeElem.id));
  }

  DeleteDoc(UrlFromDocID(iObjectID));

  return oRes;
}

/**
 * @typedef {Object} ReturnPersonsFullname
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} aLikePersons Массив объектов с id лайка, ФИО, id сотрудника, поставившего лайк/дизлайк
*/
/**
 * @author RA
 * @function GetViewList
 * @memberof Websoft.HCM.SocialNet
 * @param {string} sObjectId Id оцениваемого объекта (сообщение, комментарий)
 * @param {string} sLikeType Тип лайк/дизлайк
 * @description Возвращает массив объектов с id лайка, ФИО, id сотрудника, поставившего лайк/дизлайк
 * @returns {ReturnPersonsFullname}
*/
function GetViewList(sObjectId, sLikeType) {
  var oRes = tools.get_code_library_result_object();
  oRes.aLikePersons = []

  var xarrLikes = _getObjectLikes(sObjectId, (sLikeType == 'like'));
  for (like in xarrLikes) {
    oRes.aLikePersons.push({
      id: like.id.Value,
      type: sLikeType,
      person_id: like.person_id.Value,
      person_fullname: like.person_fullname.Value
    });
  }

  oRes.aLikePersons = ParseJson(tools.object_to_text(oRes.aLikePersons, 'json'));

  return oRes;
}

/*------------------------------------------------------------------ COLLECTIONS ------------------------------------------------------------------*/
/**
 * @typedef {Object} SocialFeedListItems
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} array Список элементов для соц. ленты
*/
/**
 * @author RA
 * @function GetListItemsOrigin
 * @memberof Websoft.HCM.SocialNet
 * @description Вовзращает список элементов для соц. ленты
 * @param {Object} sListTargets - Строка id направлений (групп, блогов) к которым относятся элементы соц. ленты
 * @param {Object} aListFilters - Массив значений по которым выборка будет фильтровать результат (текст, диапазон дат, направления)
 * @param {Object} sCollectionTargetsCode - Код коллекции, формирующей список направлений
 * @param {boolean} bGroupManagerAccess - Включить на сервере расчет прав для возможности руководителю удалять записи подчиненных
 * @param {number} iPageNum - Номер страницы
 * @param {number} iPageSize - Размер страницы
 * @returns {SocialFeedListItems}
*/
function GetListItemsOrigin(sListTargets, aListFilters, sCollectionTargetsCode, bGroupManagerAccess, iPageNum, iPageSize) {
  var oRes = tools.get_code_library_result_object();
  oRes.array = [];

  var xarrBlogsUnion = [];
  var arrBlogEntries = [];
  var curUser = _getCurUser();
  var curUserID = _getCurUserID();
  var curObjectID = _getCurObjectID();
  var sCurObjectName = _getCurObjectName();

  iPageNum = OptInt(iPageNum)
  iPageSize = OptInt(iPageSize)

  try {
    if (sListTargets == null || sListTargets == null || sListTargets == '') {
      throw ''
    }
  } catch (e) {
    sListTargets = '';
  }

  try {
    if (aListFilters == null || aListFilters == undefined || aListFilters == '') {
      throw ''
    }
  } catch(e) {
    aListFilters = []
  }

  try {
    if (sCollectionTargetsCode == null || sCollectionTargetsCode == undefined) {
      throw '';
    }
  } catch(e) {
    sCollectionTargetsCode = '';
  }

  var sItemsFiltering = '';
  var sItemsSorting = ' order by $elem/create_date descending';
  for (oFilter in aListFilters) {
    switch (oFilter.type) {
      case 'start_date':
        sItemsFiltering += ' and $elem/create_date >= ' + XQueryLiteral(Date(oFilter.value));
        break;

      case 'finish_date':
        sItemsFiltering += ' and $elem/create_date < ' + XQueryLiteral(DateNewTime(Date(oFilter.value), 23, 59, 59));
        break;

      case 'search':
        sItemsFiltering += ' and doc-contains($elem/id, "' + DefaultDb + '", ' + XQueryLiteral(oFilter.value) + ')';
        break;
    }
  }

  if (sCurObjectName == 'group' || sCurObjectName == 'blog') {
    var sRequest = 'for $elem in blogs where $elem/';

    if (sCurObjectName == 'blog') {
      sRequest += 'id = '+ curObjectID ;
    } else {
      sRequest += 'object_id = '+ curObjectID;
    }
    sRequest += ' return $elem';
    catBlog = ArrayOptFirstElem(XQuery(sRequest))

    if (catBlog != undefined) {
      arrBlogEntries = ArrayDirect(XQuery('for $elem in blog_entrys where $elem/blog_id = '+ catBlog.id + sItemsFiltering + sItemsSorting +' return $elem'));
      xarrBlogsUnion = [catBlog];
    } else {
      return _getError(oRes, 1, 'Blog with ID: '+ curObjectID +' is not found.', 'array');
    }
  } else {
    var sFilterTargets = (ArrayOptFirstElem(aListFilters) != undefined) ? ((oFilterTargets = ArrayOptFindByKey(aListFilters, 'targets', 'type')) != undefined) ? oFilterTargets.value : '' : '';

    if (sFilterTargets != '') {
      switch (sCollectionTargetsCode) {
        case 'GetListTargetsLxpSubs':
        case 'GetListTargetsLxpSkills':
          xarrBlogsUnion = XQuery('for $elem in blogs where MatchSome($elem/id, ('+ sFilterTargets +')) return $elem');
          break;

        default:
          xarrBlogsUnion = XQuery('for $elem in blogs where MatchSome($elem/object_id, ('+ sFilterTargets +')) return $elem');
      }
    } else {
      switch (sCollectionTargetsCode) {
        case 'GetListTargetsLxpSubs':
        case 'GetListTargetsLxpSkills':
          xarrBlogsUnion = XQuery('for $elem in blogs where MatchSome($elem/id, ('+ sListTargets +')) return $elem');
          break;

        default:
          if (sListTargets != '') {
            xarrTargetsBlogs = XQuery('for $elem in blogs where MatchSome($elem/object_id, ('+ sListTargets +')) return $elem');
          } else {
            xarrTargetsBlogs = XQuery('for $elem in blogs where some $gc in group_collaborators satisfies ($elem/object_id = $gc/group_id and $gc/collaborator_id = '+ curUserID +' and $gc/allow_social_post = true() and $gc/is_hidden = false()) return $elem');
          }

          xarrBlogSubscriptions = XQuery('for $elem in blogs where some $subsc in subscriptions satisfies ($elem/id = $subsc/document_id and $subsc/person_id = '+ curUserID +' and ($subsc/date_to = null() or $subsc/date_to > '+ XQueryLiteral(Date()) +')) return $elem');

          xarrBlogsUnion = ArraySelectDistinct(ArrayUnion(xarrTargetsBlogs, xarrBlogSubscriptions, XQuery('for $elem in blogs where $elem/object_id = '+ curUserID +' return $elem')), 'id');
      }
    }

    arrBlogEntries = ArrayDirect(XQuery('for $elem in blog_entrys where MatchSome($elem/blog_id, ('+ ArrayMerge(xarrBlogsUnion, 'id', ',') +'))'+ sItemsFiltering + sItemsSorting +' return $elem'));
  }

  var iTotal = ArrayCount(arrBlogEntries);
  if (iTotal > 0) {
    oRes.paging = {
      MANUAL: true,
      INDEX: iPageNum,
      SIZE: iPageSize,
      TOTAL: iTotal
    };

    iStart = (iPageNum == 0) ? iPageNum : iPageNum * iPageSize;
    if (iTotal - iStart - iPageSize < 0) {
      iPageSize = iTotal;
      oRes.paging.MANUAL = false;
    } else {
      iPageSize = iStart + iPageSize;
    }

    for (i = iStart; i < iPageSize; i++) {
      catBlogEntry = arrBlogEntries[i];
      iBlogEntryID = catBlogEntry.id.Value;
      dBlogEntry = tools.open_doc(iBlogEntryID);

      if (dBlogEntry == undefined) {
        _log('GetListItemsOrigin', 'Cannot open document with ID: ' + iBlogEntryID);
        continue;
      }

      if (!tools_web.check_access(catBlogEntry, curUserID, curUser, CurRequest.Session)) {
        _log('GetListItemsOrigin', 'curUser has not access to document with ID: ' + iBlogEntryID);
        continue;
      }

      teBlogEntry = dBlogEntry.TopElem;
      oEntryRes = _getWallItemResult(iBlogEntryID, teBlogEntry, curUserID, sCurObjectName);
      oEntryRes.owner = _getWallItemOwner(oEntryRes.object, xarrBlogsUnion);
      oRes.array.push(oEntryRes);
    }
  }

  if (bGroupManagerAccess) {
    for (oItem in oRes.array) {
      if (oItem.type == 'blog_entry' && oItem.owner.type == 'group') {
        if (curUserID == oItem.person.id) {
          oItem.can_delete = true;
          continue;
        }

        xarrManagerGroups = XQuery('for $elem in func_managers where $elem/person_id = '+ curUserID +' and $elem/catalog = "group" return $elem/Fields("object_id")');
        iOwnerID = OptInt(oItem.owner.id);

        if (ArrayOptFindByKey(xarrManagerGroups, iOwnerID, 'object_id') != undefined) {
          oItem.can_delete = true;
        }
      }
    }
  }

  return oRes;
}

/**
 * @typedef {Object} ReturnListTargetsOrigin
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} aGroups Массив групп для постинга и фильтрации
*/
/**
 * @author RA
 * @function GetListTargetsOrigin
 * @memberof Websoft.HCM.SocialNet
 * @description Возвращает массив групп для постинга и фильтрации
 * @returns {ReturnListTargetsOrigin}
*/
function GetListTargetsOrigin() {
  var oRes = tools.get_code_library_result_object();
  var curUserID = _getCurUserID();
  oRes.aGroups = [];

  xarrGroups = ArraySort(_getUserSocialGroups(curUserID), 'name', '+');
  for (catGroup in xarrGroups) {
    oRes.aGroups.push({
      id: catGroup.group_id.Value,
      type: 'group',
      name: catGroup.name.Value
    });
  }

  // alert('oRes: ' + tools.object_to_text(oRes, 'json'));
  return oRes;
}

/**
 * @typedef {Object} ReturnConfig
 * @property {number} error Код ошибки
 * @property {string} errorText Текст ошибки
 * @property {Object} oParams Параметры шаблона 'Социальная лента / Параметры' (vsocial_net_params)
*/
/**
 * @author RA
 * @function GetSocialFeedConfig
 * @memberof Websoft.HCM.SocialNet
 * @description Возвращает параметры шаблона vsocial_net_params
 * @returns {ReturnConfig}
*/
function GetSocialFeedConfig(code) {
  try {
    if (code == undefined || code == null) {
      throw '';
    }
  } catch(e) {
    code = 'vsocial_net_params';
  }
  var oParams = {};

  var iTemplateID;
  var curUser = _getCurUser();
  var curUserID = _getCurUserID();
  var curMode = _getRequestEnvParam('curMode');
  var sCurUserName = curUser.lastname + ' ' + curUser.firstname + ' ' + curUser.middlename;

  if (curMode != null && (StrContains(curMode, 'lxp') || StrContains(curMode, 'vsn') || StrContains(curMode, 'social'))) {
    var iBlockContainerTmpltID = ArrayOptFirstElem(XQuery('for $elem in custom_web_templates where $elem/code = "block_container" return $elem/Fields("id")'), { id: undefined }).id;
    var xarrOverrideTemplates = XQuery('for $elem in override_web_templates where $elem/mode = '+ XQueryLiteral(curMode) +' return $elem');

    if (ArrayOptFirstElem(xarrOverrideTemplates) == undefined) {
      return _getError(oRes, 500, 'Не найден ни один связанный элемент шаблона с параметрами для соц. ленты');
    }

    function getTemplateParams(cOverrideTemplate, bBlockContainer) {  
      if (bBlockContainer) {
        dOverrideTemplate = tools.open_doc(cOverrideTemplate.id.Value);
  
        if (dOverrideTemplate != undefined) {
          teOverrideTemplate = dOverrideTemplate.TopElem;
          iTemplateID = (oWvar = ArrayOptFindByKey(teOverrideTemplate.wvars, 'block_container.owt_id', 'name')) != undefined ? oWvar.value.Value : undefined;
        }
      } else {
        iTemplateID = ArrayOptFirstElem(xarrOverrideTemplates).id;
      }
    }

    catOverrideTemplate = ArrayOptFindByKey(xarrOverrideTemplates, iBlockContainerTmpltID, 'custom_web_template_id');
    if (catOverrideTemplate != undefined) {
      getTemplateParams(catOverrideTemplate, true);
    } else {
      getTemplateParams(catOverrideTemplate, false);
    }
  } else {
    iTemplateID = ArrayOptFirstElem(XQuery('for $elem in custom_web_templates where $elem/code = '+ XQueryLiteral(code) +' return $elem'), { id: undefined }).id;
  }

  dTemplate = tools.open_doc(iTemplateID);
  if (dTemplate != undefined) {
    teTemplate = dTemplate.TopElem;
    oWvars = tools.wvars_to_object(teTemplate.wvars);
    for (key in oWvars) {
      sName = StrReplace(key, 'vsocial_net.', '');
      oParams.SetProperty(sName, oWvars[key]);
    }

    if (IsArray(oParams['sTargetCollectionId'])) {
      var aTargetObjects = [];
      var aTargetParams = ParseJson(teTemplate.wvars.GetOptChildByKey('vsocial_net.sTargetCollectionId', 'name').value);
      for (target in aTargetParams) {
        aTargetObjects.push({
          targetId: target.__value,
          targetTabName: target.comment
        })
      }
      oParams['sTargetCollectionId'] = ParseJson(tools.object_to_text(aTargetObjects, 'json'));
    }
  } else {
    return _getError(oRes, 500, 'Не удалось открыть карточку элемента шаблона с id: ' + iTemplateID);
  }
  oParams.curUser = {
    id: String(curUserID),
    name: sCurUserName
  }
  // alert('oParams: ' + tools.object_to_text(oParams, 'json'))

  return oParams;
}

/*------------------------------------------------------------------ SERVICE FUNCTIONS ------------------------------------------------------------------*/
function _getTargets(sTargetCollectionId, mode) {
  var oListTargets;
  var aListTargets = [];
  var aTargetCollectionIds = [];

  if (IsArray(sTargetCollectionId)) {
    for (collection in sTargetCollectionId) {
      aTargetCollectionIds.push(collection.targetId);
    }
  } else if (DataType(sTargetCollectionId) == "object" && sTargetCollectionId.HasProperty('targetId')) {
    aTargetCollectionIds.push(sTargetCollectionId.targetId);
  } else {
    aTargetCollectionIds.push(sTargetCollectionId);
  }

  var aParams = [];
  switch (mode) {
    case 'for_post':
      break;

    case 'all':
      aParams = [{ 
        name: 'isForPostEntrys', 
        value: false 
      }];
      break;
  }

  for (targetId in aTargetCollectionIds) {
    oListTargets = _getTargetCollectionResult(targetId, aParams);

    if (OptInt(oListTargets.GetOptProperty('error'), 0) == 1) {
      return _checkCollectionResult(oRes, oListTargets, 'InitSocialFeed');
    }

    aListTargets = ArrayUnion(aListTargets, ParseJson(oListTargets.result));
  }

  return aListTargets;
}

function _createLike(oRes, iWeight, curUserID, curUser, iLikeID) {
  var iLikeID = OptInt(iLikeID);

  if (iLikeID != undefined) {
    dLike = tools.open_doc(iLikeID);
    if (dLike != undefined) {
      teLike = dLike.TopElem;
      teLike.weight = iWeight;
      teLike.create_date = Date();
      dLike.Save();
    }
  } else {
    try {
      dLike = OpenNewDoc('x-local://wtv/wtv_like.xmd');
    } catch(e) {
      return _getError(oRes, 1, 'Like creation failed.')
    }
    teLike = dLike.TopElem;
    teLike.object_id = oRes.oLike.object_id;

    teObject = null;
    dObject = tools.open_doc(oRes.oLike.object_id);
    if (dObject != undefined) {
      teObject = dObject.TopElem;
    }

    tools.common_filling('object', teLike, oRes.oLike.object_id, teObject);
    teLike.person_id = curUserID;
    tools.common_filling('collaborator', teLike, curUserID, curUser);
    teLike.weight = iWeight;
    dLike.BindToDb(DefaultDb);
    dLike.Save();
    iLikeID = dLike.DocID;

    ms_tools.raise_system_event_env('common_create_like', {
      'sType': 'create',
      'iObjectID': oRes.oLike.object_id,
      'teObject':  teObject,
      'iUserID': curUserID,
      'teUser': curUser,
      'iLikeID': iLikeID,
      'teLike': teLike,
    });
  }

  oRes.oLike.id = String(iLikeID);

  return oRes;
}

function _deleteLike(oRes, iLikeID) {
  if (iLikeID != undefined) {
    DeleteDoc(UrlFromDocID(iLikeID));
  }

  oRes.oLike.id = String(iLikeID);

  return oRes;
}

function _getObjectLikes(iObjectID, isLike) {
  return XQuery('for $elem in likes where $elem/object_id = '+ iObjectID +' and $elem/weight'+ (isLike ? '> 0' : '< 0') +' order by $elem/person_fullname return $elem/Fields("id", "person_id", "person_fullname")')
}

function _getObjectLike(iObjectID, curUserID, isLike) {
  return ArrayOptFirstElem(XQuery('for $elem in likes where $elem/object_id = '+ iObjectID +' and $elem/person_id = '+ curUserID +' and $elem/weight'+ (isLike ? '> 0' : '< 0') +' return $elem/Fields("id", "weight")'))
}

function _obtainTagsList(oForm) {
  var aTags = [];
  try {
    var aTagNames = Trim(oForm.sTags).split(',');
  } catch(e) {
    aTagNames = [];
  }

  for (tag in aTagNames) {
    if (Trim(tag) != '') {
      aTags.push(_createNewTag(Trim(tag)));
    }
  }

  return aTags;
}

function _createNewTag(sTag) {
  var iTagID = '';
  var catTag = ArrayOptFirstElem(XQuery('for $elem in tags where $elem/name = '+ XQueryLiteral(sTag) +' order by $elem/name return $elem/Fields("id")'));
  if (catTag != undefined) {
    iTagID = catTag.id.Value;
  } else {
    dTag = OpenNewDoc('x-local://wtv/wtv_tag.xmd');
    dTag.BindToDb(DefaultDb);
    dTag.TopElem.code = tools.random_string(10);
    dTag.TopElem.name = sTag;
    dTag.Save();
    iTagID = dTag.DocID;
  }

  return {
    id: iTagID,
    name: sTag
  };
}

function _obtainFilesList(oForm, curUserID, curUser) {
  var oRes = {
    error: 0,
    errorText: '',
    files: []
  };
  var iFileCounter = 0;

  if ((sEntryFiles = oForm.GetOptProperty('sEntryFiles')) != undefined) {
    var aFilesID = String(sEntryFiles).split(',');
    for (file_id in aFilesID) {
      oRes.files.push(file_id);
    }
  }

  while (true) {
    oFileData = oForm.GetOptProperty('file-' + iFileCounter);
    if (oFileData != undefined && oFileData != '') {
      oFile = _obtainFile(oFileData, curUserID, false, curUser);
      if (oFile.error == 0) {
        oRes.files.push(oFile.doc.DocID);
      } else {
        oRes.error = oFile.error;
	      oRes.errorText = oFile.errorText;
        return oRes;
      }
    } else {
      break;
    }
    iFileCounter++;
  }

  return oRes;
}

function _obtainFile(oFileData, iPersonID, bUnauthorize, tePerson) {
  oRes = {
    error: 0,
    errorText: '',
    doc: null
  };

	try {
		sFileName = UrlFileName(oFileData.FileName);
	} catch(e) {
		oRes.error = 1;
		oRes.errorText = 'Incorrect oFileData';
		return oRes;
	}

	try {
		if (bUnauthorize == undefined || bUnauthorize == null) {
			throw '';
    }
		bUnauthorize = tools_web.is_true(bUnauthorize);
	} catch(e) {
    bUnauthorize = false;
  }

	dResource = OpenNewDoc('x-local://wtv/wtv_resource.xmd');
  teResource = dResource.TopElem;
	dResource.BindToDb(DefaultDb);

	teResource.person_id = iPersonID;
	tools.common_filling('collaborator', teResource, teResource.person_id, tePerson);

	if (bUnauthorize) {
		teResource.allow_unauthorized_download = true;
  }

	teResource.put_str(oFileData, sFileName);
	dResource.Save();
	oRes.doc = dResource;

	return oRes;
}

function _createSocialItem(sTypeItem, iTargetID, teTarget, iPersonID, tePerson, sText, sObjectID, curObject) {
  if (teTarget.Name != 'blog') {
    dTarget = _obtainBlog(iTargetID, teTarget);
    teTarget = dTarget.TopElem;
    iTargetID = dTarget.DocID;
  }

  dBlogEntry = OpenNewDoc('x-local://wtv/wtv_blog_entry.xmd');
  teBlogEntry = dBlogEntry.TopElem;

  teBlogEntry.type = sTypeItem;
  teBlogEntry.blog_id = OptInt(iTargetID);
  teBlogEntry.person_id = iPersonID;
  tools.common_filling('collaborator', teBlogEntry, iPersonID, tePerson);
  teBlogEntry.text_area = tools_web.convert_bbtags_to_html(sText);
  teBlogEntry.access.AssignElem(teTarget.access);

  var curOjbectID = null;
  if (curObject != null) {
    curOjbectID = _getCurObjectID();
    teBlogEntry.object_id = curOjbectID;
    tools.common_filling('object', teBlogEntry, curOjbectID, curObject);
  }

  switch (sTypeItem) {
    case 'share':
      teBlogEntry.name = teBlogEntry.person_fullname.Value + ' поделился ссылкой';
      dSrcBlogEntry = tools.open_doc(sObjectID);
      if (dSrcBlogEntry != undefined) {
        teSrcBlogEntry = dSrcBlogEntry.TopElem;
        // var sLinkToObject = '</br></br><a href="'+ tools_web.get_mode_clean_url(null, sObjectID) +'">'+ teSrcBlogEntry.text_area.Value +'</a>';
        var sLinkToObject = '</br></br><a href="/_wt/'+ _getRequestEnvParam('curMode') +'#/item/'+ sObjectID +'">'+ teSrcBlogEntry.text_area.Value +'</a>';
        teBlogEntry.text_area = teBlogEntry.name.Value + ': </br></br>' + teBlogEntry.text_area.Value + tools_web.convert_bbtags_to_html(sLinkToObject);
      }
      break;
    case 'reference':
      teBlogEntry.name = StrReplace(StrReplace(ms_tools.get_const('upominaniepara'), '{PARAM1}', teBlogEntry.person_fullname.Value), '{PARAM2}', teBlogEntry.object_name.Value);
      break;
    default:
      sName = UnifySpaces(HtmlToPlainText(teBlogEntry.text_area));
      teBlogEntry.name = StrCharCount(sName) > 50 ? StrLeftCharRange(sName, 50) + '...' : sName;
      break;
  }

  dBlogEntry.BindToDb(DefaultDb);
  dBlogEntry.Save();
  iBlogEntryID = dBlogEntry.DocID;

  ms_tools.raise_system_event_env('common_create_individual_blog_entry', {
    'iObjectID': curOjbectID,
    'teObject': curObject,
    'sEntryType': sTypeItem,
    'iUserID': iPersonID,
    'teUser': tePerson,
    'iTargetID': teBlogEntry.blog_id.Value,
    'teTarget': teTarget,
    'teBlogEntry': teBlogEntry,
    'iBlogEntryID': iBlogEntryID
  });

  return dBlogEntry;
}

function _editSocialItem(sEntryID, sTypeItem, iTargetID, teTarget, iPersonID, tePerson, sText, curObject) {
  var oRes = {
    error: 0,
    errorText: '',
    doc: null
  }

  if (!_checkUserPermits(curObject, null, sEntryID)) {
    oRes.error = 403;
    oRes.errorText = 'Не достаточно прав для редактирования записи.';

    return oRes;
  }

  dBlogEntry = tools.open_doc(sEntryID);
  if (dBlogEntry != undefined) {
    if (teTarget.Name != 'blog') {
      dTarget = _obtainBlog(iTargetID, teTarget);
      teTarget = dTarget.TopElem;
      iTargetID = dTarget.DocID;
    }

    teBlogEntry = dBlogEntry.TopElem;

    teBlogEntry.type = sTypeItem;
    teBlogEntry.blog_id = OptInt(iTargetID);
    teBlogEntry.person_id = iPersonID;
    tools.common_filling('collaborator', teBlogEntry, iPersonID, tePerson);
    teBlogEntry.text_area = tools_web.convert_bbtags_to_html(sText);

    var curOjbectID = null;
    if (curObject != null) {
      curOjbectID = _getCurObjectID();
      teBlogEntry.object_id = curOjbectID;
      tools.common_filling('object', teBlogEntry, curOjbectID, curObject);
    }

    teBlogEntry.files.Clear();
    dBlogEntry.Save()

    oRes.doc = dBlogEntry;
  } else {
    oRes.error = 1;
    oRes.errorText = 'Не удалось открыть карточку документа с id: ' + sEntryID;
  }

  return oRes;
}

function _checkUserPermits(curObject, curUserID, iObjectID) {
  var bCanDelete = false;

  try {
    if (curUserID == null || OptInt(curUserID) == undefined) {
      throw ''
    }
  } catch(e) {
    curUserID = _getCurUserID();
  }

  if (curObject != null && curObject.person_id == curUserID) {
    bCanDelete = true;
  } else {
    var catBlog = ArrayOptFirstElem(XQuery('for $elem in blog_entrys where $elem/id = '+ iObjectID +' and $elem/person_id = '+ curUserID +' return $elem'));

    if (catBlog != undefined) {
      bCanDelete = true;
    } else {
      var xarrUserSocGroups = _getUserSocialGroups(curUserID);

      if (ArrayOptFirstElem(xarrUserSocGroups) != undefined) {
        bCanDelete = ArrayOptFirstElem(XQuery('for $elem in func_managers where $elem/person_id = '+ curUserID +' and MatchSome($elem/object_id, ('+ ArrayMerge(xarrUserSocGroups, 'group_id', ',') +')) return $elem/Fields("object_id")')) != undefined;
      }
    }
  }

  return bCanDelete;
}

function _obtainBlog(iObjectID, teObject) {
  catBlog = ArrayOptFirstElem(tools.xquery('for $elem in blogs where $elem/object_id = '+ iObjectID +' return $elem/id, $elem/__data'));
  if (catBlog == undefined) {
    dBlog = OpenNewDoc('x-local://wtv/wtv_blog.xmd');
    teBlog = dBlog.TopElem;

    if (teObject == undefined || teObject == null || teObject == '') {
      teObject = OpenDoc(UrlFromDocID(iObjectID)).TopElem;
    }

    teBlog.object_id = iObjectID;
    teBlog.object_name = tools.get_object_name_field_value(teObject);
    teBlog.object_type = teObject.Name;
    teBlog.name = teBlog.object_name;

    if (teObject.Name == 'collaborator') {
      fldAuthorChild = teBlog.authors.AddChild();
      fldAuthorChild.person_id = iObjectID;
      tools.common_filling('collaborator', fldAuthorChild, iObjectID, teObject);
      fldAuthorChild.is_full_moderator = true;
    }

    dBlog.BindToDb(DefaultDb);
    dBlog.Save();
  } else {
    dBlog = OpenDoc(UrlFromDocID(catBlog.id));
  }

  return dBlog;
}

function _getCurObjectName() {
  var curObject = _getCurObject();
  if (curObject != null) {
    return curObject.Name;
  }
  return '';
}

function _getWallItemResult(iItemID, teItem, iUserID, sObjName) {
  sItemType = _getWallItemType(teItem);
  sItemUrl = tools_web.get_mode_clean_url(null, iItemID);
  sItemText = teItem.text_area.HasValue ? tools_web.get_web_desc(teItem.text_area.Value, UrlFromDocID(iItemID), teItem.Name + '.text_area') : (teItem.GetOptProperty('comment') != undefined) ? teItem.comment.Value : '';
  bBlocked = teItem.blocked.HasValue ? teItem.blocked.Value : false;
  oLikes = _getWallItemLike(iItemID, iUserID, true);
  oDislikes = _getWallItemLike(iItemID, iUserID, false);
  sAccess = _getWallItemAccess(sObjName);
  oPerson = (teItem.person_id.HasValue) ? _getEntryPerson(teItem.person_id) : {};
  oObject = _getWallItemObject(teItem, 'blog');
  aAttachments = _getWallItemFiles(teItem);
  aTags = _getWallItemTags(teItem);
  aComments = _getWallItemCommenIds(iItemID, 'blog_entry_comments');

  oItemRes = {
    id: String(iItemID),
    type: sItemType,
    name: teItem.name.Value,
    link: sItemUrl,
    text: sItemText,
    date_create: teItem.create_date.Value,
    blocked: bBlocked,
    date_modified: teItem.date_modified.Value,
    likes: oLikes.amount,
    dislikes: oDislikes.amount,
    has_my_like: oLikes.bUser,
    has_my_dislike: oDislikes.bUser,
    has_subscription: _getWallItemSubscriptions(iItemID, iUserID),
    can_delete: true,
    access: tools.object_to_text(sAccess, 'json'),
    person: oPerson,
    object: oObject,
    owner: {},
    attachments: aAttachments,
    tags: aTags,
    comments: aComments
  }

  return oItemRes;
}

function _getWallItemType(te) {
  var sName = te.Name;
  switch (sName) {
    case 'blog_entry':
      if (te.type.Value == 'post') {
        return sName;
      } else {
        return sName + '_' + te.type.Value;
      }
  }
}

function _getBlogEntryComments(iObjectID, sObjectIds) {
  var aComments = [];
  var curUserID = _getCurUserID();
  var sCondition = '';
  if (sObjectIds != '') {
    sCondition = 'where MatchSome($elem/id, ('+ sObjectIds +'))';
  } else {
    sCondition = 'where $elem/blog_entry_id = ' + iObjectID;
  }
  xarrComments = tools.xquery('for $elem in blog_entry_comments '+ sCondition +' order by $elem/create_date descending return $elem/id, $elem/__data');

  for (catComment in xarrComments) {
    iCommentID = catComment.id.Value;
    dComment = tools.open_doc(iCommentID);
    if (dComment == undefined) {
      continue;
    }
    teComment = dComment.TopElem;

    aComments.push(_getCommentItem(iCommentID, teComment, curUserID, iObjectID));
  }

  return tools.object_to_text(aComments, 'json');
}

function _getCommentItem(iCommentID, teComment, curUserID, iObjectID) {
  sLink = tools_web.get_mode_clean_url(null, iCommentID);
  oPerson = (teComment.person_id.HasValue) ? _getEntryPerson(teComment.person_id) : {};
  aAttachments = _getWallItemFiles(teComment);
  aAccessGroups = _getCommentAccessGroups(teComment);
  oLikes = _getWallItemLike(iCommentID, curUserID, true);
  oDislikes = _getWallItemLike(iCommentID, curUserID, false);
  iParentID = teComment.parent_id.HasValue ? teComment.parent_id.Value : iObjectID;

  oComment = {
    id: String(iCommentID),
    type: 'comment',
    parent_id: String(iParentID),
    owner_id: iObjectID,
    text: teComment.message.Value,
    link: sLink,
    date: teComment.create_date.Value,
    likes: oLikes.amount,
    dislikes: oDislikes.amount,
    has_my_like: oLikes.bUser,
    has_my_dislike: oDislikes.bUser,
    person: oPerson,
    attachments: aAttachments,
    access_groups: aAccessGroups
  }

  return oComment;
}

function _getCommentAccessGroups(teComment) {
  var aAcsGroups = [];
  for (flgAccessGroup in teComment.access.access_groups) {
    catGroup = flgAccessGroup.group_id.OptForeignElem;
    if (catGroup == undefined) {
      continue;
    }

    oGroup = {
      id: catGroup.id.Value,
      name: catGroup.name.Value
    }

    aAcsGroups.push(oGroup);
  }
  return aAcsGroups;
}

function _log(sFnName, sMsg) {
  alert('[social_net_library] => ['+ sFnName +']: ' + sMsg);
}

function _checkCollectionResult(oRes, oResult, sFnName) {
  var sError = '['+ sFnName +'] => ';

  if (oResult.GetOptProperty('errorText') != undefined) {
    sError += oResult.GetOptProperty('errorText');
  } else if (oResult.GetOptProperty('messageText') != undefined) {
    sError += oResult.GetOptProperty('messageText');
  }
  return _getError(oRes, 1, sError);
}

function _getError(oRes, iError, sErrorText, sResFldName) {
	oRes.error = OptInt(iError, 1);
	oRes.errorText = sErrorText;

  try {
    if (sResFldName != null && sResFldName != undefined && sResFldName != '') {
      oRes[sResFldName] = [];
    }
  } catch(e) {}

  return oRes;
}

function _getRequestEnvParam(name) {
  return CurRequest.Session.Env.GetOptProperty(name, null);
}

function _getSingleTargetID() {
  iTargetID = _getCurObjectID();
  if (iTargetID == null) {
    iTargetID = OptInt(_getRequestEnvParam('curDocID'), null);
  }

  return iTargetID;
}

function _getCurUserID() {
  return OptInt(_getRequestEnvParam('curUserID'), null);
}

function _getCurUser() {
  return _getRequestEnvParam('curUser');
}

function _getCurObjectID() {
  return OptInt(_getRequestEnvParam('curObjectID'), null);
}

function _getCurObject() {
  return _getRequestEnvParam('curObject');
}

function _getCurDocID() {
  return _getRequestEnvParam('curDocID');
}

function _getTargetCollectionResult(iTargetCollectionID, aParams, teCollection) {
  var iCollectionID = OptInt(iTargetCollectionID);
  var teCollection = null;

  if (iCollectionID == undefined) {
    var sCollectionCode = 'GetListTargetsOrigin'; // 'social_list_targets'
    dCollection = tools.open_doc(ArrayOptFirstElem(tools.xquery('for $elem in remote_collections where $elem/code = '+ XQueryLiteral(sCollectionCode) +' return $elem/id, $elem/__data'), {id: undefined}).id);
    if (dCollection != undefined) {
      teCollection = dCollection.TopElem;
    }
  } else {
    if (teCollection == undefined || teCollection == null) {
      dCollection = tools.open_doc(iCollectionID);
      if (dCollection != undefined) {
        teCollection = dCollection.TopElem;
      }
    }

    if (aParams != undefined && aParams != null && ArrayOptFirstElem(aParams) != undefined) {
      for (param in aParams) {
        teCollection.wvars.ObtainChildByKey(param.name).value = param.value;
      }
    }
  }

  if (teCollection == null) {
    return { error: 1, errorText: '[_getTargetCollectionResult]: Error evaluated collection of getting list targets' };
  } else {
    return teCollection.evaluate('json', CurRequest);
  }
}

function _getWallItemAccess(sCatalog) {
  fldAdminAccessCtalog = admin_access_catalogs.GetOptChildByKey(sCatalog);
  if (fldAdminAccessCtalog == undefined) {
    return CreateElem('x-local://wtv/wtv_general.xmd', 'social_object_access_base');
  } else {
    return fldAdminAccessCtalog.social;
  }
}

function _getTypicalObject() {
  return {
    id: '',
    type: '',
    name: '',
    link: '',
    img: '',
    sex: ''
  }
}

function _getObjectUrl(te) {
  if (te.ChildExists('resource_id') && te.resource_id.HasValue) {
    return tools_web.get_object_source_url('resource', te.resource_id);
  }
	return '/images/' + te.Name + '.png';
}

function _getEntryPerson(fldPerson) {
  iPersonID = fldPerson.Value;
  fePerson = fldPerson.OptForeignElem;
  if (fePerson != undefined) {
    oPerson = _getTypicalObject();
    oPerson.id = String(iPersonID);
    oPerson.type = 'collaborator';
    oPerson.name = fePerson.fullname.Value;
    oPerson.link = tools_web.get_mode_clean_url(null, iPersonID);
    oPerson.img = fePerson.pict_url.Value;
    oPerson.sex = fePerson.sex.Value;
    return oPerson;
  } else {
    return {};
  }
}

function _getWallItemObject(teObject, sObjectType) {
  oItemObject = _getTypicalObject();
  oItemObject.likes = '';
  oItemObject.dislikes = '';
  oItemObject.has_my_like = '';
  oItemObject.has_my_dislike = '';

  oItemObject.type = sObjectType;
  switch (sObjectType) {
    case 'blog':
      iCurDocID = _getCurDocID();
      iBlogID = teObject.blog_id.Value;
      dBlog = tools.open_doc(iBlogID);
      if (dBlog != undefined) {
        teBlog = dBlog.TopElem;

        oItemObject.id = String(iBlogID);
        oItemObject.name = teBlog.name.Value;
        oItemObject.link = tools_web.get_mode_clean_url(null, iBlogID); // tools_web.get_object_link(sObjectType, iBlogID, teBlog, iCurDocID);
        oItemObject.img = _getObjectUrl(teBlog);
      }
      break;

    case 'collaborator':
      iPersonID = teObject.person_id.Value;
      oItemObject.id = iPersonID;
      fePerson = teObject.person_id.OptForeignElem;

      if (fePerson != undefined) {
        oItemObject.name = fePerson.fullname.Value;
        oItemObject.link = tools_web.get_mode_clean_url(null, iPersonID);
        oItemObject.img = fePerson.pict_url.Value;
        oItemObject.sex = fePerson.sex.Value;
      }
      break;
  }
  return oItemObject;
}

function _getWallItemOwner(oItemObject, aObjects) {
  function set_item_props(oOwner) {
    oOwner.link = tools_web.get_mode_clean_url(null, oOwner.id);
    dOwner = tools.open_doc(oOwner.id);
    if (dOwner != undefined) {
      teOwner = dOwner.TopElem;
      oOwner.img = _getObjectUrl(teOwner);
      oOwner.type = teOwner.Name;
    }
  }

  oItemOwner = _getTypicalObject();
  switch (oItemObject.type) {
    case 'blog':
      fdItemOwner = ArrayOptFindByKey(aObjects, oItemObject.id, 'id');
      if (fdItemOwner != undefined) {
        if (fdItemOwner.object_id.HasValue) {
          oItemOwner.id = fdItemOwner.object_id.Value;
          oItemOwner.name = fdItemOwner.object_name.Value;
        } else {
          sNameSubscription = 'Подписка на блог: ' + fdItemOwner.name.Value;
          fdItemOwner = ArrayOptFirstElem(tools.xquery('for $elem in subscriptions where $elem/document_id = '+ oItemObject.id +' return $elem/id, $elem/__data'));
          if (fdItemOwner != undefined) {
            oItemOwner.id = fdItemOwner.id.Value;
            oItemOwner.name = sNameSubscription;
          }
        }
        set_item_props(oItemOwner);
      }
      break;

    case 'collaborator':
      fdItemOwner = ArrayOptFindByKey(aObjects, oItemObject.id, 'object_id');
      if (fdItemOwner != undefined) {
        oItemOwner.id = fdItemOwner.object_id.Value;
        oItemOwner.name = fdItemOwner.object_name.Value;
        set_item_props(oItemOwner);
      }
      break;
  }
  return oItemOwner;
}

function _getWallItemFiles(teObject) {
  if (teObject.files.ChildNum > 0) {
    aFiles = [];
    for (file in teObject.files) {
      iFileID = file.PrimaryKey.Value;
      dResource = tools.open_doc(iFileID);
      if (dResource != undefined) {
        teResource = dResource.TopElem;
        sFileName = (teResource.file_name.HasValue) ? teResource.file_name.Value : teResource.name.Value;
        aFiles.push({
          id: String(iFileID),
          type: teResource.type.Value,
          name: sFileName,
          url: tools_web.get_object_source_url('resource', iFileID),
          size: teResource.size.Value
        });
      }
    }
    return aFiles;
  } else {
    return [];
  }
}

function _getWallItemTags(teObject) {
  if (teObject.tags.ChildNum > 0) {
    aTags = [];
    for (tag in teObject.tags) {
      iTagID = tag.PrimaryKey.Value;
      aTags.push({
        id: String(iTagID),
        name: tag.tag_name.Value,
        url: tools_web.get_mode_clean_url(null, iTagID)
      });
    }
    return aTags;
  } else {
    return [];
  }
}

function _getWallItemLike(iObjectID, iUserID, isLike) {
  sSign = (isLike) ? '>' : '<';
  xarrItems = XQuery('for $elem in likes where $elem/object_id = '+ iObjectID +' and $elem/weight'+ sSign +'0 return $elem/Fields("person_id")');

  return {
    'amount': ArrayCount(xarrItems),
    'bUser': (ArrayOptFindByKey(xarrItems, iUserID, 'person_id') != undefined)
  };
}

function _getWallItemSubscriptions(iObjectID, curUserID) {
  return ArrayOptFirstElem(XQuery('for $elem in subscriptions where $elem/person_id = '+ curUserID +' and $elem/document_id = '+ iObjectID +' and ($elem/date_to = null() or $elem/date_to > '+ XQueryLiteral(Date()) +')  return $elem/Fields("id")')) != undefined;
}

function _getWallItemCommenIds(iObjectID, type) {
  switch (type) {
    case 'blog_entry_comments':
      xarrBlogEntryComments = XQuery('for $elem in blog_entry_comments where $elem/blog_entry_id = '+ iObjectID +' order by $elem/create_date descending return $elem/Fields("id")');
      if (ArrayOptFirstElem(xarrBlogEntryComments) != undefined) {
        aBECIDs = [];
        for (comment in xarrBlogEntryComments) {
          if (comment.id.HasValue) {
            aBECIDs.push(String(comment.id.Value));
          }
        }
        return aBECIDs;
      } else {
        return [];
      }
      break;
  }
}

function _getBlogGroup(iBlogID) {
  return XQuery('for $elem in blogs where some $grp in groups satisfies($elem/id = '+ iBlogID +' and $elem/object_id = $grp/id) return $elem/Fields("object_id")');
}

function _getUserSocialGroups(iUserID, iBlogID) {
  var sCondition = '';

  try {
    if (OptInt(iBlogID) != undefined) {
      var xarrBlogGroups = _getBlogGroup(iBlogID);
      if (ArrayOptFirstElem(xarrBlogGroups) != undefined) {
        sCondition = ' and MatchSome($elem/group_id, ('+ ArrayMerge(xarrBlogGroups, 'This.object_id', ',') +'))';
      }
    }
  } catch(e) {}

  xarrGroups = XQuery('for $elem in group_collaborators where $elem/collaborator_id = '+ iUserID + sCondition +' and $elem/allow_social_post = true() and $elem/is_hidden = false() order by $elem/name return $elem/Fields("group_id", "name")');

  return xarrGroups;

  // xarrManagerGroups = XQuery('for $elem in func_managers where $elem/person_id = '+ iUserID +' and $elem/catalog = "group" return $elem/Fields("object_id")');
  // xarrRightGroups = ArraySelect(xarrManagerGroups, 'tools.check_operation_rights(tools.get_object_relative_operations('+ iUserID +', This.object_id, "group"), curUser, "group_social_post")');
  // return QueryCatalogByKeys('groups', 'id', ArraySelectDistinct(ArrayUnion(ArrayExtract(xarrGroups, 'group_id'), ArrayExtract(xarrRightGroups, 'object_id')), 'This'));
}
