
document.addEventListener('DOMContentLoaded', function () { 
    var userName = prompt("Please Enter Your Name");

    var messageInp = document.getElementById("messageInp");
    var groupNameInp = document.getElementById("groupNameInp");
    var messageToGroupInp = document.getElementById("messageToGroupInp");
    messageInp.focus(); 

    // Define Proxy
    var proxyConnection = new signalR.HubConnectionBuilder().withUrl("/chat").build();// use Route specified in Startup 
    // of service y want to call it ...

    proxyConnection.start().then(function () {
        // start 'start connection' > return promise may success or fail so handle with fun then if success 'take callback' or fun catch if error
        document.getElementById("sendMessageBtn").addEventListener("click", function (e) { 
            e.preventDefault(); // pre def behav to click
            proxyConnection.invoke("Send", userName, messageInp.value); 
        });

        document.getElementById("joinGroupBtn").addEventListener("click", function (e) { // - Join to group..
            e.preventDefault();
            proxyConnection.invoke("JoinGroup", groupNameInp.value, userName);

        });

        document.getElementById("sendMessageToGroupBtn").addEventListener("click", function (e) { // - send mess to Gp
            e.preventDefault();
            proxyConnection.invoke("SendMessageToGroup", groupNameInp.value, userName, messageToGroupInp.value);
        })

    }).catch(function (error) {
        console.log(error);
    })

    proxyConnection.on("ReceiveMessage", function (userName, message) { // userN , mess from event fired 'ReceiveMes' in service
        var liElement = document.createElement("li");
        liElement.innerHTML = `<strong>${userName}: </strong> ${message}`;
        document.getElementById("conversation").appendChild(liElement);
    })

    proxyConnection.on("NewMemberJoin", function (userName, groupName) { // - send mess to others ..
        var liElement = document.createElement("li");
        liElement.innerHTML = `<i>${userName} has joined ${groupName}</i>`;
        document.getElementById("groupConversationUL").appendChild(liElement);
    })

    proxyConnection.on("ReceiveMessageFromGroup", function (message, sender) { // - send mess to Gp
        var liElement = document.createElement("li");
        liElement.innerHTML = `<strong>${sender}: </strong> ${message}`;
        document.getElementById("groupConversationUL").appendChild(liElement);
    })
});