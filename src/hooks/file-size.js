export default function useGetFileSize(size) {
  let fileSize = ''
  let fileLength = String(size).length

  if (fileLength > 9) {
    fileSize += (size / 1000000000).toFixed(1) + ' Гб'
  } else if (fileLength > 6) {
    fileSize += (size / 1000000).toFixed(1) + ' Мб'
  } else if (fileLength > 3) {
    fileSize += (size / 1000).toFixed(1) + ' Кб'
  } else {
    fileSize += size + ' Байт'
  }

  return {
    fileSize
  }
}
