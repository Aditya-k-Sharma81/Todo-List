import Swal from 'sweetalert2';

/**
 * Show a sleek SweetAlert delete confirmation modal
 */
export const showDeleteConfirm = async ({
  title = 'Delete Task?',
  text = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmButtonText = 'Yes, Delete'
} = {}) => {
  return await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancel',
    background: '#1e293b',
    color: '#f8fafc',
    iconColor: '#f59e0b',
    customClass: {
      popup: 'glass-swal-popup',
      title: 'glass-swal-title',
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  });
};

/**
 * Show a success notification toast
 */
export const showSuccessToast = (title = 'Operation completed successfully') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#f8fafc',
    iconColor: '#34d399'
  });
};

/**
 * Show an error modal dialog
 */
export const showErrorAlert = (message = 'Something went wrong. Please try again.') => {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    background: '#1e293b',
    color: '#f8fafc',
    iconColor: '#fca5a5',
    customClass: {
      popup: 'glass-swal-popup',
      title: 'glass-swal-title',
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  });
};
