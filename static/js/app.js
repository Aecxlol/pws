document.addEventListener('DOMContentLoaded', (e) => {
    
    if (document.querySelector("body").classList.contains('admin-body')) {
        new UsersListPopupManager();
        console.log("ùdr");
        // window.addEventListener('click', (e) => {
        //     let test = document.getElementsByClassName('active');
        //
        //     if(test.length > 0  && !e.target.classList.contains('active') && !e.target.classList.contains('admin-actions-btn')) {
        //         for (let i = 0; i < adminPopupAction.length; i++) {
        //             adminPopupAction[i].classList.remove('active');
        //         }
        //     }
        // });
    }
});