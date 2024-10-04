import OpenAI from "openai";

const openai = new OpenAI();

export async function gpt_response(bdpersons_name : string) : Promise<string | null>
{
	const completion = await openai.chat.completions.create({
	messages: [{ role: "user", content: `Schreibe auf deutsch Geburtstagsgluckwunsche an ${bdpersons_name}.
		Halte die Nachricht in etwa 15 Woerter lang und baue Emojis ein. Schreibe den Text eher casually. Gib mir als Antwort lediglich die
		Geburtstagsglueckwuensche zurueck ohne etwas davor oder danach zu sagen!` }],
	model: "gpt-4o-mini",
	});

	console.log(completion.choices[0].message.content);
	return (completion.choices[0].message.content);
}
