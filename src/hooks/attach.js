import { ref } from '@vue/reactivity'

export default function useAttach(emit) {
  const filesAttached = ref([])

  function _fileRead(file) {
    if (file?.name) {
      filesAttached.value.push(file)
    }
  }

  function attachFiles(e) {
    const filesAttached = e.currentTarget.files || []
    if (filesAttached.length > 0) {
      filesAttached.forEach(file => _fileRead(file))
    }
  }

  function removeFile(lastModified) {
    filesAttached.value = filesAttached.value.filter(item => item.lastModified !== lastModified)
  }

  function addFiles(e) {
    attachFiles(e)
    emit('change-files-list', filesAttached.value)
  }

  function delFiles(payload) {
    removeFile(payload)
    emit('change-files-list', filesAttached.value)
  }

  return {
    filesAttached,
    addFiles,
    delFiles
  }
}
