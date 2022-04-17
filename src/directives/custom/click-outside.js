const clickOutside = app => {
  app.directive('click-outside', {
    beforeMount(el, binding) {
      el.clickOutsideEvent = function(e) {
        if (!(el === e.target || el.contains(e.target))) {
          binding.value()
        }
      }

      document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
    }
  })
}

export default clickOutside
