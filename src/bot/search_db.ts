import { random_time, rightTime } from './time_randomizer';
import { gpt_response } from './gpt_response';
import mysql from 'mysql2/promise';
import { Client, LocalAuth } from 'whatsapp-web.js';

//this function gets triggered if the random time is equal to the right time
//then we will go into the db and search for matches and if some where found we generate a gpt-response
//this response is getting passed trough the whatsapp-web.js library to the person
async function bdquestionmark(client: Client) : Promise<void>
{
	let		todays_date : Date = new Date();
	let		todays_day = todays_date.getDate();
	let		todays_month = todays_date.getMonth() + 1;

	try
	{
		const connection = await mysql.createConnection({
			host: 'database',
			port: 3306,
			user: 'root',
			password: '',
			database: 'bot_db'
		});
		
		const [rows]: any[] = await connection.execute(
            'SELECT * FROM bot_db WHERE birthday_day = ? AND birthday_month = ?',
            [todays_day, todays_month]
        );

        if (rows.length > 0)
		{
            for (const row of rows)
			{
                let response = await gpt_response(row.name);
				client.on('ready', async () => {
					const originalNumber = row.tel_num; 
					const number = originalNumber.replace(/^0/, '49');
					const chatId = `${number}@c.us`;
					try
					{
						let chat = await client.getChatById(chatId);
						const message : string | null = await response;
						if (message === null)
								return ;
						const sentMessage = await chat.sendMessage(message);
						console.log(`Birthday congrats were send to ${row.name} with following message:\n${response}`);
					}
					catch (err)
					{
						console.error('Error sending message:', err);
					}
				});
            }
        }
		else
		{
            console.log('No birthdays today.');
        }
        await connection.end();
    }
	catch (error)
	{
        console.log("Error reading data from DB: ", error);
    }
}

//this function checks for the random time and if its the right time the function calls bdquestionmark (see documentation if you want to know more)
export async function search_db(client : Client) : Promise<void>
{
	let	get_random_time : number[] = random_time();
	console.log(`random_time: ${random_time}`);
	console.log(`rightTime: ${rightTime(get_random_time)}`);
	if (await rightTime(get_random_time) === true)
	{
		bdquestionmark(client);
		console.log("bdquestionmark triggered!\n");
	}
}
