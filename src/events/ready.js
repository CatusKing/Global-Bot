module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready at ' + new Date());
        
        async function pickPresence () {
            const statusArray = [
                {
                    status: 'online',
                    content: 'your debates',
                    type: 2
                }
            ]
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,
                            
                        },
                    
                    ],

                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        }
        await pickPresence();
        setInterval(pickPresence, 1000 * 60 * 30);
    },
};