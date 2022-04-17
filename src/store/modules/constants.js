export default {
  state() {
    return {
      CONST_pathToAPI: '/oapi/social_net_library/',
      CONST_PostMessage: 'Добавить сообщение',
      CONST_EnterText: 'Введите текст',
      CONST_CancelPostMessage: 'Отмена',
      CONST_ExpandFeed: 'Развернуть все',
      CONST_CollapseFeed: 'Свернуть все',
      CONST_Filters: 'Фильтр',
      CONST_ApplyFilters: 'Применить',
      CONST_ResetFilters: 'Сбросить',
      CONST_NoItemsYet: 'Записей еще нет',
      CONST_NoItemsFound: 'Записей не найдено',
      CONST_More: 'Далее',
      CONST_SelectTargets: 'Направить в',
      CONST_PublicEntry: 'Опубликовать',
      CONST_SubmitComment: 'Отправить',
      CONST_LikeCommentWarning: 'Прокомментируйте Вашу оценку',
      CONST_ShareCommentWarning: 'Комментарий к ссылке',
      CONST_SelectAll: 'Выбрать все',
      CONST_Files: 'Файлы',
      CONST_ChooseFile: 'Выберите файл',
      CONST_FilesAttached: 'Приложенные файлы',
      CONST_AttachFiles: 'Прикрепить файл(ы)',
      CONST_Tags: 'Тэги',
      CONST_Access: 'Доступно только',
      CONST_EditEntry: 'Редактировать',
      CONST_Follow: 'Подписаться на изменения',
      CONST_Unfollow: 'Удалить подписку',
      CONST_ShareEntry: 'Поделиться ссылкой',
      CONST_LockEntry: 'Блокировать',
      CONST_UnlockEntry: 'Снять блокировку',
      CONST_DeleteEntry: 'Удалить запись',
      CONST_EditComment: 'Редактировать',
      CONST_DeleteComment: 'Удалить комментарий',
      CONST_CommentThis: 'Комментировать',
      CONST_CancelComment: 'Отменить',
      CONST_CommentsLocked: 'Комментирование закрыто',
      CONST_ExpandComments: 'Развернуть комментарии',
      CONST_CollapseComments: 'Свернуть комментарии',
      CONST_BlogRecord: 'Запись в блоге',
      CONST_ForumRecord: 'Запись в форуме',
      CONST_FollowRecord: 'Комментарий к отслеживаемой теме',
      CONST_ShareRecord: 'делится ссылкой',
      CONST_LikeRecord: 'Оценено',
      CONST_FilterTarget: 'Направление',
      CONST_FilterTypes: 'Типы',
      CONST_FilterUsers: 'Пользователи',
      CONST_FilterTags: 'Тэги',
      CONST_Period: 'Период',
      CONST_FilterDate: 'Дата',
      CONST_FilterDateFrom: 'с',
      CONST_FilterDateTo: 'по',
      CONST_FilterSearch: 'Поиск',
      CONST_FilterSearchHint: 'Минимум 2 символа',
      CONST_DateHint: 'ДД.ММ.ГГГГ',
      CONST_DateMonths: 'Январь;Февраль;Март;Апрель;Май;Июнь;Июль;Август;Сентябрь;Октябрь;Ноябрь;Декабрь',
      CONST_DateMonthsShort: 'Янв;Фев;Мар;Апр;Май;Июн;Июл;Авг;Сен;Окт;Ноя;Дек',
      CONST_DateDays: 'Воскресенье;Понедельник;Вторник;Среда;Четверг;Пятница;Суббота',
      CONST_DateDaysShort: 'Вск;Пнд;Втр;Срд;Чтв;Птн;Сбт',
      CONST_DateDaysMin: 'ВС;ПН;ВТ;СР;ЧТ;ПТ;СБ',
      CONST_DatePrev: 'Пред.',
      CONST_DateNext: 'След.',
      CONST_DisabledWarning: 'Нельзя опубликовать сообщение с пустым текстом или не выбранным направлением',
      CONST_DisabledWarningComment: 'Нельзя отправить комментарий без текста',
      CONST_ConfirmNonEmpty: 'Отменить незаконченный комментарий и начать новый?',
      CONST_NoTargets: 'Недостаточно прав для создания записей',
      CONST_LoadMore: 'Загрузить еще',
      CONST_ExceededFiles: 'Превышено максимально допустимое количество файлов.',
      CONST_ErrorAddTag: 'Запрещено создание новых тегов.'
    }
  },
  getters: {
    getCONST_pathToAPI: state => state.CONST_pathToAPI,
    getCONST_PostMessage: state => state.CONST_PostMessage,
    getCONST_EnterText: state => state.CONST_EnterText,
    getCONST_CancelPostMessage: state => state.CONST_CancelPostMessage,
    getCONST_ExpandFeed: state => state.CONST_ExpandFeed,
    getCONST_CollapseFeed: state => state.CONST_CollapseFeed,
    getCONST_Filters: state => state.CONST_Filters,
    getCONST_ApplyFilters: state => state.CONST_ApplyFilters,
    getCONST_ResetFilters: state => state.CONST_ResetFilters,
    getCONST_NoItemsYet: state => state.CONST_NoItemsYet,
    getCONST_NoItemsFound: state => state.CONST_NoItemsFound,
    getCONST_More: state => state.CONST_More,
    getCONST_SelectTargets: state => state.CONST_SelectTargets,
    getCONST_PublicEntry: state => state.CONST_PublicEntry,
    getCONST_SubmitComment: state => state.CONST_SubmitComment,
    getCONST_LikeCommentWarning: state => state.CONST_LikeCommentWarning,
    getCONST_ShareCommentWarning: state => state.CONST_ShareCommentWarning,
    getCONST_SelectAll: state => state.CONST_SelectAll,
    getCONST_Files: state => state.CONST_Files,
    getCONST_ChooseFile: state => state.CONST_ChooseFile,
    getCONST_FilesAttached: state => state.CONST_FilesAttached,
    getCONST_AttachFiles: state => state.CONST_AttachFiles,
    getCONST_Tags: state => state.CONST_Tags,
    getCONST_Access: state => state.CONST_Access,
    getCONST_EditEntry: state => state.CONST_EditEntry,
    getCONST_Follow: state => state.CONST_Follow,
    getCONST_Unfollow: state => state.CONST_Unfollow,
    getCONST_ShareEntry: state => state.CONST_ShareEntry,
    getCONST_LockEntry: state => state.CONST_LockEntry,
    getCONST_UnlockEntry: state => state.CONST_UnlockEntry,
    getCONST_DeleteEntry: state => state.CONST_DeleteEntry,
    getCONST_EditComment: state => state.CONST_EditComment,
    getCONST_DeleteComment: state => state.CONST_DeleteComment,
    getCONST_CommentThis: state => state.CONST_CommentThis,
    getCONST_CancelComment: state => state.CONST_CancelComment,
    getCONST_CommentsLocked: state => state.CONST_CommentsLocked,
    getCONST_ExpandComments: state => state.CONST_ExpandComments,
    getCONST_CollapseComments: state => state.CONST_CollapseComments,
    getCONST_BlogRecord: state => state.CONST_BlogRecord,
    getCONST_ForumRecord: state => state.CONST_ForumRecord,
    getCONST_FollowRecord: state => state.CONST_FollowRecord,
    getCONST_ShareRecord: state => state.CONST_ShareRecord,
    getCONST_LikeRecord: state => state.CONST_LikeRecord,
    getCONST_FilterTarget: state => state.CONST_FilterTarget,
    getCONST_FilterTypes: state => state.CONST_FilterTypes,
    getCONST_FilterUsers: state => state.CONST_FilterUsers,
    getCONST_FilterTags: state => state.CONST_FilterTags,
    getCONST_Period: state => state.CONST_Period,
    getCONST_FilterDate: state => state.CONST_FilterDate,
    getCONST_FilterDateFrom: state => state.CONST_FilterDateFrom,
    getCONST_FilterDateTo: state => state.CONST_FilterDateTo,
    getCONST_FilterSearch: state => state.CONST_FilterSearch,
    getCONST_FilterSearchHint: state => state.CONST_FilterSearchHint,
    getCONST_DateHint: state => state.CONST_DateHint,
    getCONST_DateMonths: state => state.CONST_DateMonths,
    getCONST_DateMonthsShort: state => state.CONST_DateMonthsShort,
    getCONST_DateDays: state => state.CONST_DateDays,
    getCONST_DateDaysShort: state => state.CONST_DateDaysShort,
    getCONST_DateDaysMin: state => state.CONST_DateDaysMin,
    getCONST_DatePrev: state => state.CONST_DatePrev,
    getCONST_DateNext: state => state.CONST_DateNext,
    getCONST_DisabledWarning: state => state.CONST_DisabledWarning,
    getCONST_DisabledWarningComment: state => state.CONST_DisabledWarningComment,
    getCONST_ConfirmNonEmpty: state => state.CONST_ConfirmNonEmpty,
    getCONST_NoTargets: state => state.CONST_NoTargets,
    getCONST_LoadMore: state => state.CONST_LoadMore,
    getCONST_ExceededFiles: state => state.CONST_ExceededFiles,
    getCONST_ErrorAddTag: state => state.CONST_ErrorAddTag
  }
}