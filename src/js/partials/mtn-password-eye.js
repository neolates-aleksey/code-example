function showHidePassword() {
  const allEyeControls = document.querySelectorAll('[data-password-eye-ctrl]');

  allEyeControls.forEach(function (el) {
    el.addEventListener('click', function () {
      const field = this.closest('[data-password-eye]');
      const input = field.querySelector('input');
      let type = input.getAttribute("type");

      if (type === 'password') {
        type = 'text';
      } else {
        type = 'password';
      }

      input.setAttribute("type", type);
      field.classList.toggle('is-password');
    });
  });
}

showHidePassword();

