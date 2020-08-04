$(function () {
    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $loginPage = $('.login.page'); // The login page
    var $currentInput = $usernameInput.focus();
    const setUsername = () => {
        username = cleanInput($usernameInput.val().trim()+Date.now());

        // If the username is valid
        if (username) {
            $loginPage.fadeOut();
            $loginPage.off('click');
            sendData(username,'Initialized');
        }
        return username;
    }

    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }
    // Keyboard events

    $window.keydown(event => {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
            //     sendMessage();
            //     socket.emit('stop typing');
            //     typing = false;
            } else {
                username = setUsername();
            }
        }
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
        $currentInput.focus();
    });

})