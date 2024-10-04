import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { fill_db } from './fill_db';
import { search_db } from './search_db';

// activates the Client, then generates an qrcode. At the end you will be trown in an endless loop
async function activateClient() : Promise<Client>
{
	const wwebVersion = '2.2412.54';

	const client = await new Client({
		authStrategy: new LocalAuth({
			dataPath: 'auth/'
		}),
		puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--unhandled-rejections=strict'] },
		webVersionCache: {
			type: 'remote',
			remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
		},
	});
	
	client.on('qr', qr => {
		console.log("Client is active!\n");
		console.log("\n");
		qrcode.generate(qr, {small: true});
	});

	client.initialize();
	return (client);
}

function sleep(ms: number): Promise<void>
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

function isExactlySevenOClock(): boolean
{
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    
    return (hour === 7 && minutes === 0);
}

//Mainfunction, from here the Program starts
async function main(): Promise<void>
{
    let client = await activateClient();
    fill_db();
    while (true)
    {
        if (isExactlySevenOClock())
        {
			search_db(client);
			console.log("search_db triggered and executed!\n");
            await sleep(59000);
        }
        else
            await sleep(30000);
    }
}

main();
