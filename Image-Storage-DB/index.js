const crypto = require('crypto');

function generateChatId(user1, user2) {
    // Ensure the order is consistent
    const sortedUsers = [user1, user2].sort();
   
    
    // Concatenate the sorted user IDs
    const combinedString = `${sortedUsers[0]}_${sortedUsers[1]}`;
 
    
    // Hash the combined string for a unique and consistent ID
    const chatId = crypto.createHmac('sha256' , "12345").update(combinedString).digest('hex');
    
    return chatId;
}

// Example Usage
const user1 = "6766be9a80b6cfe21932c5cc";
const user2 = "6766beb180b6cfe21932c5d2";
console.log(generateChatId(user1, user2)); // Consistent ID regardless of order
// c15a9c2c6e4f90a48cbdd1cc6e58afc3c28ea38c98808072c2632d1e09f6fabf
// c15a9c2c6e4f90a48cbdd1cc6e58afc3c28ea38c98808072c2632d1e09f6fabf