# Current Commands

## Community

### /help

Sends a configured help message

### /quote

Quotes a member of the server

- author - The author of the quote.
- quote - The actual quote to be posted.

### /vent

Send a completely anonymous vent.

- vent - The to vent be submitted.

## Moderation

### /ban

Bans a member from the server.

- target - The member you want to ban.
- reason - Reason for banning the selected member.
- hide - Option to hide who sent the command.

### /clear_timeout

Clears timeout of a selected member within the server.

- target - The member to clear the timeout.
- reason - Reason for clearing the timeout on the user.
- hide - Option to hide who sent the command.

### /kick

Kicks a member from the server.

- target - The member you want to kick.
- reason - Reason for kicking the selected member.
- hide - Option to hide who sent the command.

### /suspicious_user

Logs a user as a suspicious server member.

- target - The target user you would like to log as suspicious. This can be just a user id.
- reason - The reason for logging the user as suspicious.

### /timeout

Times out a member in the server with a reason and duration.

- target - The member to timeout.
- duration - Duration of the timeout on the member.
- reason - Reason for timing out the member.
- hide - Option to hide who sent the command.

### /unban

Removes the ban from a member.

- target - The member you want to remove the ban from.
- reason - Reason for removing the ban from the selected member.
- hide - Option to hide who sent the command.

## Other

### /config

Configures a global setting.

- options - The different configs you can change.

### /ping

Prints out Pong with response time in ms. For testing.

### /print

Prints out inputted message. Usually used for testing purposes.

- message - The message for the bot to send.

### /status

Get information about the bot.

## Staff

### /blacklist

Logs a user as blacklisted from staff.

- target - The target user you would like to log as blacklisted. This Can be just a user id.
- position - The highest position the target user held.
- reason - The reason for logging the user as blacklisted.

### /demote

Demote a staff member and update the db.

- member - The person you want to demote.
- position - The position you want to demote the member to.

### /fire

Fire a staff member and remove them from the db.

- member - The person you want to fire.
- position - The position the member currently holds.

### /hire

Hire a staff member and add them to the db.

- member - The person you want to hire.
- position - The position you want to hire the member as.

### /inactive

Formats your inactivity notice.

- length - Length for the inactivity period.
- return - Date of return for the inactivity period.
- position - The current position you hold
- notes - Notes for the inactivity notice.

### /lookup

Get information about staff member.

- member - The person you want to look up.

### /promote

Promote a staff member and update the db.

- member - The person you want to promote.
- position - The position you want to promote the member to.

### /resign

Formats your resignation notice.

- position - The current position you hold.
- reason - Reason for the resignation notice.

### /strike

Strike a staff member and increase count in the db.

- member - The person you want to strike.

### /verify

Send a request to verify a staff position.

- position - The position you applied for.

v1.0.1