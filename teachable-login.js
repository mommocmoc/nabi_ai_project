function ready(fn) {
    if(document.readyState !== 'loading'){
        fn()
    }else{
        document.addEventListener('DOMContentLoaded',fn)
    }
}

ready(loginInit);



function loginInit(){

    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize variables
    var $window = $(window);
    var $nameInputInst = $('#nameInputInst')
    var $modelInputInst = $('#modelInputInst')
    var $usernameInput = $('.usernameInput'); // Input for username
    var $modelURLInput = $('.modelURLInput'); // Input for teachable machine URL
    var $loginPage = $('.login.page'); // The login page
    var $currentInput = $usernameInput.focus();

    const setUsername = () => {
        username = cleanInput($usernameInput.val().trim());

        // If the username is valid
        if (username && initURL) {
            $modelURLInput.hide();
            $usernameInput.hide();
            $modelInputInst.hide();
            $loginPage.fadeIn();
            $nameInputInst.text("와우! 이제 로딩중이에요~ 조금만 기다려주세요!😀")
            // $loginPage.off('click');
            init();
            // sendData(username,'Initialized');
        }
        return username;
    }

    const setInitURL = () => {
        initURL = cleanInput($modelURLInput.val().trim());
        if (username && initURL) {
            $loginPage.fadeOut();
            $loginPage.off('click');
            init();
            // let userID = username + Date.now();
            // sendData(userID,'Initialized');
        }
        return initURL;
    }

    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

     // Click events
     $modelURLInput.click(() => {
         $modelURLInput.focus();
         $currentInput = $modelURLInput.focus();
     });

     // Focus input when clicking anywhere on login page
     $usernameInput.click(() => {
         $currentInput = $usernameInput.focus();
         $usernameInput.focus();
     });

    // Keyboard events

    $window.keydown(event => {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
         // When the client hits TAB on their keyboard
        if (event.which === 9){
            if($currentInput === $usernameInput.focus()){
                $currentInput = $modelURLInput.focus()
            }else{
                $currentInput = $usernameInput.focus()
            }
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                //     sendMessage();
                //     socket.emit('stop typing');
                //     typing = false;
            } else {
                initURL = setInitURL();
                username = setUsername();
            }
        }
        
    });

   


}