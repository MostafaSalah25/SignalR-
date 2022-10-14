using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Chat_Demo.Hubs
{
    // Service
    public class ChatHub : Hub
    {
        public async Task Send(string userName, string message)
        {
            
            await Clients.All.SendAsync("ReceiveMessage", userName, message);// as fire event ReceiveMessage & send userN & mess
        } 
        // - Join to group..
        public async Task JoinGroup(string groupName, string userName)
        {
            
            await Groups.AddToGroupAsync(GetConnectionId(), groupName); // Each and Every Time When User Login app >
            await Clients.OthersInGroup(groupName).SendAsync("NewMemberJoin", userName, groupName); // - send mess to 
        } // others there is new member joined to Gp

        // - send mess to Gp
        public async Task SendMessageToGroup(string groupName, string sender, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessageFromGroup", message, sender); // Group > send to all include sender
        }

        public string GetConnectionId() => Context.ConnectionId; // Context is property in Hub

    }
}
